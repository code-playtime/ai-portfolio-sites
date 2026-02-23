Now let me build this comprehensive markdown editor. This is a complex project - I'll create a full-featured, Obsidian-like editor.Here's your Obsidian-style markdown editor. Here's a quick rundown of how it works:

**Obsidian behavior:** Each paragraph/heading/block renders beautifully when unfocused. Click on any rendered text → it shows the raw markdown source for editing. Click away → it renders again instantly.

**Key features included:**
- All standard markdown: headings, bold/italic/strikethrough/highlight/inline code, lists, task lists, tables, blockquotes, HR, links, images
- Syntax-highlighted code blocks with language labels and a copy button (supports JS, Python, TS, PHP, Rust, Go, SQL, CSS, Bash, and more)
- Paste images directly (`Ctrl+V`) or drag & drop — they embed as base64 data URLs
- Load HTML via `MarkdownEditor.setHTML(htmlString)` — it converts it back to editable markdown blocks
- Output is always HTML (stored in `#md-output` hidden input)

**API for integration:**
```javascript
// Initialize with content (markdown or HTML)
MarkdownEditor.init(content)

// Set content
MarkdownEditor.setMarkdown(md)
MarkdownEditor.setHTML(html)  // loads from your backend

// Get output
MarkdownEditor.getHTML()       // → HTML string for your backend
MarkdownEditor.getMarkdown()   // → raw markdown

// Events
MarkdownEditor.onChange(({ html, markdown }) => {
  myHiddenInput.value = html;
})

// Hidden input (for form submission)
MarkdownEditor.setInputName('content')  // sets the form field name
MarkdownEditor.getInput()               // returns the <input> element
```

**Views:** Edit / Split / Preview toggle in the top-right. `Ctrl+S` copies the HTML to clipboard.