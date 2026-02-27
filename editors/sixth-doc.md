```js
const ed = new MarkdownEditor('#editor1', { initialValue: '...' });
ed.init();

ed.on('change', (html, md) => {});
ed.on('save', (html, md) => {});

ed.getValue();  // HTML
ed.getMarkdown();  // Markdown
ed.loadValue(str); // load HTML or MD
ed.clear(); ed.focus(); ed.destroy(); 
```

