/**
 * 轻量级 Markdown 渲染引擎
 * 支持: 标题、段落、代码块、行内代码、引用、列表、链接、图片、粗体、斜体、表格、分割线
 */

const Markdown = {
    // 渲染入口
    render(md) {
        if (!md) return '';

        // 保护代码块
        const codeBlocks = [];
        md = md.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
            codeBlocks.push({ lang, code: code.replace(/\n$/, '') });
            return `\n\nCODEBLOCK_${codeBlocks.length - 1}\n\n`;
        });

        // 保护行内代码
        const inlineCodes = [];
        md = md.replace(/`([^`\n]+)`/g, (_, code) => {
            inlineCodes.push(code);
            return `INLINECODE_${inlineCodes.length - 1}`;
        });

        let html = md;

        // 分割为块
        const lines = html.split('\n');
        const result = [];
        let i = 0;

        while (i < lines.length) {
            const line = lines[i];

            // 空行
            if (line.trim() === '') {
                i++;
                continue;
            }

            // 代码块占位
            if (line.trim().match(/^CODEBLOCK_\d+$/)) {
                result.push(line);
                i++;
                continue;
            }

            // 标题
            const heading = line.match(/^(#{1,6})\s+(.+)$/);
            if (heading) {
                const level = heading[1].length;
                result.push(`<h${level}>${this.inline(heading[2])}</h${level}>`);
                i++;
                continue;
            }

            // 分割线
            if (line.match(/^[-*_]{3,}\s*$/)) {
                result.push('<hr>');
                i++;
                continue;
            }

            // 引用
            if (line.match(/^>\s?/)) {
                const quoteLines = [];
                while (i < lines.length && lines[i].match(/^>\s?/)) {
                    quoteLines.push(lines[i].replace(/^>\s?/, ''));
                    i++;
                }
                result.push(`<blockquote>${this.render(quoteLines.join('\n'))}</blockquote>`);
                continue;
            }

            // 无序列表
            if (line.match(/^[-*+]\s+/)) {
                const listItems = [];
                while (i < lines.length && lines[i].match(/^[-*+]\s+/)) {
                    listItems.push(lines[i].replace(/^[-*+]\s+/, ''));
                    i++;
                }
                result.push(`<ul>${listItems.map(item => `<li>${this.inline(item)}</li>`).join('')}</ul>`);
                continue;
            }

            // 有序列表
            if (line.match(/^\d+\.\s+/)) {
                const listItems = [];
                while (i < lines.length && lines[i].match(/^\d+\.\s+/)) {
                    listItems.push(lines[i].replace(/^\d+\.\s+/, ''));
                    i++;
                }
                result.push(`<ol>${listItems.map(item => `<li>${this.inline(item)}</li>`).join('')}</ol>`);
                continue;
            }

            // 表格
            if (line.match(/^\|.+\|$/) && i + 1 < lines.length && lines[i + 1].match(/^\|[\s\-:|]+\|$/)) {
                const tableLines = [];
                while (i < lines.length && lines[i].match(/^\|.+\|$/)) {
                    tableLines.push(lines[i]);
                    i++;
                }
                result.push(this.parseTable(tableLines));
                continue;
            }

            // 段落
            const paraLines = [];
            while (i < lines.length && lines[i].trim() !== '' &&
                   !lines[i].match(/^#{1,6}\s+/) &&
                   !lines[i].match(/^[-*+]\s+/) &&
                   !lines[i].match(/^\d+\.\s+/) &&
                   !lines[i].match(/^>\s?/) &&
                   !lines[i].match(/^[-*_]{3,}\s*$/) &&
                   !lines[i].match(/^CODEBLOCK_\d+$/) &&
                   !lines[i].match(/^\|.+\|$/)) {
                paraLines.push(lines[i]);
                i++;
            }
            if (paraLines.length > 0) {
                result.push(`<p>${this.inline(paraLines.join(' '))}</p>`);
            }
        }

        html = result.join('\n');

        // 恢复代码块
        html = html.replace(/CODEBLOCK_(\d+)/g, (_, idx) => {
            const { lang, code } = codeBlocks[parseInt(idx)];
            const langClass = lang ? ` class="language-${lang}"` : '';
            return `<pre><code${langClass}>${Utils.escapeHtml(code)}</code></pre>`;
        });

        // 恢复行内代码
        html = html.replace(/INLINECODE_(\d+)/g, (_, idx) => {
            return `<code>${Utils.escapeHtml(inlineCodes[parseInt(idx)])}</code>`;
        });

        return html;
    },

    // 行内元素处理
    inline(text) {
        let result = Utils.escapeHtml(text);

        // 图片
        result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

        // 链接
        result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

        // 粗体
        result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        result = result.replace(/__([^_]+)__/g, '<strong>$1</strong>');

        // 斜体
        result = result.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        result = result.replace(/_([^_]+)_/g, '<em>$1</em>');

        // 删除线
        result = result.replace(/~~([^~]+)~~/g, '<del>$1</del>');

        return result;
    },

    // 解析表格
    parseTable(lines) {
        const rows = lines.map(line =>
            line.split('|').slice(1, -1).map(cell => cell.trim())
        );

        const header = rows[0];
        const body = rows.slice(2);

        let html = '<table><thead><tr>';
        header.forEach(cell => {
            html += `<th>${this.inline(cell)}</th>`;
        });
        html += '</tr></thead><tbody>';

        body.forEach(row => {
            html += '<tr>';
            row.forEach(cell => {
                html += `<td>${this.inline(cell)}</td>`;
            });
            html += '</tr>';
        });

        html += '</tbody></table>';
        return html;
    }
};
