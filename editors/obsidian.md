# Obsidian-Style Rich Text Editor - API Documentation

## Overview

The editor now supports:
- ✅ Form submission with hidden input field
- ✅ Event handlers (onChange, onLoad, onFocus, onBlur, onInput)
- ✅ Public API for programmatic control
- ✅ Automatic content synchronization with hidden input

---

## Form Integration

### HTML Structure

```html
<form id="editorForm" action="/submit" method="POST">
    <input type="hidden" id="editorContent" name="content" value="">
</form>
```

The editor content is automatically synced to the hidden input field `#editorContent` on every change.

### Submitting the Form

#### Using the Submit Button
Click the "Submit" button in the toolbar to trigger form submission.

#### Programmatic Submission
```javascript
// Submit the form programmatically
editorAPI.submit();

// Or access the editor instance directly
editor.submit();
```

#### Manual Form Submission
```javascript
// Get the form element
const form = document.getElementById('editorForm');

// Ensure content is synced before submitting
editor.syncContent();

// Submit via AJAX
const formData = new FormData(form);
fetch('/submit', {
    method: 'POST',
    body: formData
}).then(response => response.json())
  .then(data => console.log('Success:', data));
```

---

## Event Handlers

### Available Events

1. **onChange** - Fires when content changes (on blur if modified)
2. **onLoad** - Fires when editor is initialized
3. **onFocus** - Fires when editor gains focus
4. **onBlur** - Fires when editor loses focus
5. **onInput** - Fires on every keystroke/content modification

### Adding Event Listeners

```javascript
// Method 1: Using the editor instance
editor.on('change', (data) => {
    console.log('Content changed!');
    console.log('New content:', data.content);
    console.log('Previous content:', data.previousContent);
});

// Method 2: Using the global API
editorAPI.on('input', (data) => {
    console.log('User is typing...');
    console.log('Current content:', data.content);
});

// Method 3: Chaining multiple events
editor
    .on('focus', () => console.log('Editor focused'))
    .on('blur', () => console.log('Editor blurred'))
    .on('change', (data) => console.log('Content changed'));
```

### Event Handler Examples

#### Auto-save on change
```javascript
editor.on('change', (data) => {
    // Save to server
    fetch('/api/autosave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: data.content })
    });
});
```

#### Live preview
```javascript
editor.on('input', (data) => {
    // Update preview pane in real-time
    document.getElementById('preview').innerHTML = data.content;
});
```

#### Character limit
```javascript
editor.on('input', () => {
    const charCount = editor.getCharCount();
    const maxChars = 5000;
    
    if (charCount > maxChars) {
        alert(`Character limit exceeded! (${charCount}/${maxChars})`);
    }
});
```

#### Unsaved changes warning
```javascript
let hasUnsavedChanges = false;

editor.on('change', () => {
    hasUnsavedChanges = true;
});

window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    }
});

// Clear flag on successful save
document.getElementById('editorForm').addEventListener('submit', () => {
    hasUnsavedChanges = false;
});
```

### Removing Event Listeners

```javascript
// Define handler function
function myChangeHandler(data) {
    console.log('Changed:', data.content);
}

// Add handler
editor.on('change', myChangeHandler);

// Remove handler
editor.off('change', myChangeHandler);
```

---

## Public API Reference

### Content Methods

#### `getContent()`
Returns the HTML content of the editor.
```javascript
const html = editor.getContent();
console.log(html); // "<h1>Hello World</h1><p>Content...</p>"
```

#### `setContent(html)`
Sets the HTML content of the editor.
```javascript
editor.setContent('<h1>New Title</h1><p>New content...</p>');
```

#### `getText()`
Returns the plain text content (no HTML).
```javascript
const text = editor.getText();
console.log(text); // "Hello World\nContent..."
```

#### `clear()`
Clears all content from the editor.
```javascript
editor.clear();
```

### Focus Methods

#### `focus()`
Programmatically focuses the editor.
```javascript
editor.focus();
```

### Form Methods

#### `submit()`
Submits the form programmatically.
```javascript
editor.submit();
```

#### `syncContent()`
Manually syncs editor content to hidden input (usually automatic).
```javascript
editor.syncContent();
```

### Statistics Methods

#### `getWordCount()`
Returns the number of words in the editor.
```javascript
const words = editor.getWordCount();
console.log(`Word count: ${words}`);
```

#### `getCharCount()`
Returns the number of characters in the editor.
```javascript
const chars = editor.getCharCount();
console.log(`Character count: ${chars}`);
```

---

## Complete Integration Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Blog Post Editor</title>
</head>
<body>
    <!-- Include the editor -->
    <script src="obsidian-editor.html"></script>

    <script>
        // Wait for editor to initialize
        window.addEventListener('load', () => {
            // Set up auto-save
            let saveTimeout;
            editor.on('input', () => {
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => {
                    console.log('Auto-saving...');
                    fetch('/api/draft/save', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            content: editor.getContent()
                        })
                    });
                }, 2000); // Save 2 seconds after user stops typing
            });

            // Set up word count display
            editor.on('input', () => {
                const words = editor.getWordCount();
                document.getElementById('wordDisplay').textContent = 
                    `${words} words`;
            });

            // Handle form submission
            document.getElementById('editorForm').addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = new FormData(e.target);
                
                fetch('/api/blog/publish', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    alert('Blog post published!');
                    console.log('Response:', data);
                })
                .catch(error => {
                    alert('Error publishing post');
                    console.error(error);
                });
            });

            // Load existing content
            fetch('/api/blog/123')
                .then(response => response.json())
                .then(data => {
                    editor.setContent(data.content);
                });

            // Warn about unsaved changes
            let hasChanges = false;
            editor.on('change', () => hasChanges = true);
            
            window.addEventListener('beforeunload', (e) => {
                if (hasChanges) {
                    e.preventDefault();
                    e.returnValue = '';
                }
            });
        });
    </script>
</body>
</html>
```

---

## Browser Console Testing

Open the browser console and try these commands:

```javascript
// Get content
editorAPI.getContent()

// Set content
editorAPI.setContent('<h1>Testing</h1><p>This is a test.</p>')

// Get text only
editorAPI.getText()

// Clear editor
editorAPI.clear()

// Get statistics
editorAPI.getWordCount()
editorAPI.getCharCount()

// Submit form
editorAPI.submit()

// Listen to events
editorAPI.on('change', (data) => console.log('Changed!', data))

// Focus editor
editorAPI.focus()
```

---

## Plugin Development with Events

Plugins can also listen to editor events:

```javascript
editor.registerPlugin(
    'Auto Saver',
    'Automatically saves content every 30 seconds',
    `
    // This code runs when plugin is enabled
    const intervalId = setInterval(() => {
        const content = context.editor.innerHTML;
        console.log('Auto-saving content...');
        // Save logic here
        localStorage.setItem('autosave', content);
    }, 30000);
    
    // Store interval ID to clear later
    window.autoSaveInterval = intervalId;
    `
);
```

---

## Common Use Cases

### 1. Blog Post Editor
```javascript
editor.on('change', autosaveDraft);
editor.on('input', updateWordCount);
form.addEventListener('submit', publishPost);
```

### 2. Email Composer
```javascript
editor.on('change', saveToDrafts);
editor.on('blur', validateRecipients);
form.addEventListener('submit', sendEmail);
```

### 3. Note-taking App
```javascript
editor.on('input', syncToCloud);
editor.on('focus', lockNote);
editor.on('blur', unlockNote);
```

### 4. CMS Content Editor
```javascript
editor.on('change', markAsModified);
editor.on('load', loadFromDatabase);
form.addEventListener('submit', saveToDatabase);
```

---

## Tips & Best Practices

1. **Always sync before submission**: The editor automatically syncs, but for custom submissions, call `editor.syncContent()` first.

2. **Debounce input events**: Use setTimeout to avoid excessive API calls on rapid typing.

3. **Handle errors gracefully**: Wrap event handlers in try-catch blocks.

4. **Clean up listeners**: Remove event listeners when they're no longer needed.

5. **Use change over input**: For auto-save, use `change` (fires on blur) instead of `input` (fires on every keystroke).

6. **Validate before submit**: Check content in form submit handler before sending to server.

---

## Need Help?

All events and methods are logged to the console when the editor loads. Open your browser's developer tools to see available commands and try them out!