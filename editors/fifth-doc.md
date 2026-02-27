
API Reference

```js
const editor = new MarkdownEditor('#editor1', {
  placeholder: 'Start writing…',
  initialValue: '<p>HTML or markdown</p>',
});
editor.init();

editor.on('change', (html, md) => {}); // fires on every edit
editor.on('save', (html, md) => {});   // fires on Ctrl+S
editor.on('autosave', (html, md) => {}); // debounced 2s

editor.getValue();      // → HTML string for backend
editor.getMarkdown();  // → raw Markdown string
editor.loadValue(str); // load HTML or Markdown
editor.clear();
editor.focus();
editor.destroy();
```