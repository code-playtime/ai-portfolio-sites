```js
BlockEditor.addTextBlock()           // add a text block
BlockEditor.addCodeBlock()           // add a code block
BlockEditor.save(id)                 // save block by ID → returns HTML
BlockEditor.saveAll()                // save all → returns array of { id, type, output }
BlockEditor.getOutput(id)            // get HTML output without saving
BlockEditor.getAllOutputs()          // get all outputs as array
BlockEditor.deleteBlock(id)          // remove a block
BlockEditor.getBlocks()              // list all blocks with { id, type }
```
