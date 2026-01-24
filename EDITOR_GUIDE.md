# Rich Text Editor Features

The Topic Editor now includes a powerful rich text editor powered by Editor.js with the following features:

## Available Formatting Tools

### Text Formatting (Inline Toolbar)
When you select text, an inline toolbar appears with these options:
- **Bold** - Make text bold
- **Italic** - Make text italic  
- **Inline Code** - Format text as inline code (e.g., `variable`)
- **Marker** - Highlight text with a background color

### Block Types (+ Menu)
Click the **+** icon on the left side of any line to add different content blocks:

1. **Text** - Regular paragraph text (default)
2. **Header** - Create headings (H1-H6)
3. **List** - Ordered or unordered lists
4. **Checklist** - Interactive todo items with checkboxes
5. **Quote** - Blockquotes with optional attribution
6. **Code** - Code blocks with syntax highlighting
7. **Table** - Create tables for structured data
8. **Warning** - Highlighted warning/note boxes
9. **Delimiter** - Visual separator between sections

## How to Use

### Adding Content
1. Click inside the editor area
2. Start typing for regular text
3. Press **Enter** to create a new block
4. Click the **+** icon to choose a block type

### Formatting Text
1. Select the text you want to format
2. Use the inline toolbar that appears
3. Click the formatting option you want

### Editing Blocks
1. Click the **⋮** icon (settings) on the right of any block
2. Options to move up/down or delete the block

### Keyboard Shortcuts
- **Ctrl/Cmd + B** - Bold
- **Ctrl/Cmd + I** - Italic
- **Enter** - New block
- **Tab** - Indent (in lists)
- **Shift + Tab** - Outdent (in lists)

## Data Storage
- Content is saved as structured JSON (Editor.js OutputData format)
- This allows for rich formatting while maintaining data integrity
- Old topics with plain text are automatically supported

## Tips
- Use **Headers** to organize your notes into sections
- Use **Checklists** for learning objectives or practice problems
- Use **Code blocks** for programming examples
- Use **Tables** for comparison charts or structured information
- Use **Quotes** for important definitions or key concepts
- Use **Warning blocks** for important notes or gotchas
