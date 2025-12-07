# Paper Maker

A static web application for generating custom printable paper templates including lined paper, graph paper, dot paper, and blank paper with customizable parameters.

## Features

- **Multiple Paper Types**
  - Lined Paper (wide-ruled, college-ruled, narrow-ruled)
  - Graph Paper (2, 4, 5, 10 lines per inch)
  - Dot Paper (2, 3, 4, 5 dots per inch)
  - Blank Paper (with optional margin guides)

- **Customization Options**
  - Paper size: Letter (8.5" × 11") or A4 (210mm × 297mm)
  - Orientation: Portrait or Landscape
  - Adjustable margins (top, bottom, left, right)
  - Customizable line color and thickness
  - Type-specific spacing options

- **Print-Optimized**
  - Browser print-to-PDF functionality
  - Accurate 1:1 scale printing at 96 DPI
  - Clean print output with UI elements hidden

## Usage

1. Open `index.html` in a web browser
2. Select your desired paper type from the controls panel
3. Customize the parameters (size, spacing, margins, colors)
4. Preview updates in real-time
5. Click "Print / Save as PDF" to print or save your custom paper

## Technical Details

- **Pure Static Application**: No server-side runtime required
- **Technologies**: HTML5, CSS3, Vanilla JavaScript
- **SVG-Based**: Uses SVG for precise, scalable paper templates
- **Responsive Design**: Works on desktop and mobile devices
- **Print Optimization**: CSS `@media print` rules for accurate output

## File Structure

```
paper-maker/
├── index.html          # Main application page
├── styles.css          # All styling including print styles
├── app.js             # Main application logic
├── templates.js       # Paper template generators
└── README.md          # This file
```

## Browser Compatibility

Works in all modern browsers that support:
- SVG rendering
- CSS Grid and Flexbox
- ES6 JavaScript

Tested in:
- Chrome/Edge (Chromium)
- Firefox
- Safari

## Printing Tips

1. Use the browser's print dialog (Ctrl+P or Cmd+P)
2. Set margins to "None" or "Minimum" in print settings
3. Ensure "Background graphics" is enabled
4. Select "Save as PDF" as the destination to create a PDF file
5. For best results, use 100% scale (no shrinking or fitting)

## License

Free to use and modify.

