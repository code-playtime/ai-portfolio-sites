```js
const editor = new BlockEditor("#editor-container");

// Per-block save
editor.onSave((block) => {
  console.log("Block id    ::", block.id);
  console.log("Block type  ::", block.type);     // "text" | "code"
  console.log("Block order ::", block.order);    // 1-based DOM position
  console.log("Block label ::", block.label);    // text from the label input
  console.log("Block output::", block.content);  // always HTML
});

// Save all button
editor.onSaveAll((blocks) => {
  console.log("All blocks ::", blocks); // array of the same shape
});

// Pre-load from JSON on page load
editor.load([
  { type: "text",  label: "Intro", content: "<p>Hello</p>" },
  { type: "code",  label: "Example", language: "python", content: "print('hi')" },
]);

// Read current state at any time
const snapshot = editor.getAll();
// → [{ id, type, order, label, content }, ...]
```

