```js
const editor = window.MarkdownEditor;

editor.on('change', ({ value }) => { /* runs on every keystroke */ });
editor.on('save', ({ value }) => { /* Ctrl+S fires this */ });
editor.setValue('# My Post');       // set content
editor.getValue();                  // get markdown
editor.getHTML();                   // get rendered HTML
editor.loadHTML('<h1>Hello</h1>'); // load HTML directly
editor.bindInput('my-input-id');   // auto-sync to hidden input
editor.setView('split');           // 'source' | 'split' | 'preview'
editor.getStats();                 // { words, chars, lines }
```