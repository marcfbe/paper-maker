/**
 * Paper Maker Application
 * Main application logic for handling user interactions and generating paper templates
 */

class PaperMaker {
    constructor() {
        this.config = this.getDefaultConfig();
        this.initializeElements();
        this.initializeSlider();
        this.attachEventListeners();
        this.updatePreview();
    }

    /**
     * Initialize slider settings based on paper size
     */
    initializeSlider() {
        if (this.config.paperSize === 'a4') {
            this.lineSpacingInput.min = '5';
            this.lineSpacingInput.max = '12';
            this.lineSpacingInput.step = '0.5';
            // Default is 9mm for A4 (equivalent to 11/32")
            if (this.config.lineSpacing === 0.34375) {
                this.config.lineSpacing = 9;
            }
            this.gridSizeInput.min = '2.5';
            this.gridSizeInput.max = '10';
            this.gridSizeInput.step = '0.5';
            // Default is 10mm for A4 (equivalent to 2 lines/inch)
            if (this.config.gridSize === 0.5) {
                this.config.gridSize = 10;
            }
        } else {
            this.lineSpacingInput.min = '0.25';
            this.lineSpacingInput.max = '0.5';
            this.lineSpacingInput.step = '0.03125';
            this.gridSizeInput.min = '0.1';
            this.gridSizeInput.max = '0.5';
            this.gridSizeInput.step = '0.05';
        }
        this.lineSpacingInput.value = this.config.lineSpacing;
        this.gridSizeInput.value = this.config.gridSize;
        this.updateLineSpacingLabel();
        this.updateGridSizeLabel();
    }

    /**
     * Get default configuration
     */
    getDefaultConfig() {
        return {
            paperType: 'lined',
            paperSize: 'letter',
            orientation: 'portrait',
            lineSpacing: 0.34375, // 11/32" in inches, or 9mm for A4
            gridSize: 0.5, // 0.5" spacing (2 lines/inch) for letter, or 10mm for A4
            dotSpacing: 2,
            margins: {
                top: 0.5,
                bottom: 0.5,
                left: 0.75,
                right: 0.5
            },
            lineColor: '#0000ff',
            lineThickness: 1
        };
    }

    /**
     * Initialize DOM element references
     */
    initializeElements() {
        // Paper type controls
        this.paperTypeInputs = document.querySelectorAll('input[name="paperType"]');
        this.linedControls = document.getElementById('linedControls');
        this.graphControls = document.getElementById('graphControls');
        this.dotControls = document.getElementById('dotControls');

        // Paper size and orientation
        this.paperSizeInputs = document.querySelectorAll('input[name="paperSize"]');
        this.orientationInputs = document.querySelectorAll('input[name="orientation"]');

        // Line spacing (for lined paper)
        this.lineSpacingInput = document.getElementById('lineSpacing');
        this.lineSpacingValue = document.getElementById('lineSpacingValue');

        // Grid size (for graph paper)
        this.gridSizeInput = document.getElementById('gridSize');
        this.gridSizeValue = document.getElementById('gridSizeValue');

        // Dot spacing (for dot paper)
        this.dotSpacingInputs = document.querySelectorAll('input[name="dotSpacing"]');

        // Margins
        this.marginTopInput = document.getElementById('marginTop');
        this.marginBottomInput = document.getElementById('marginBottom');
        this.marginLeftInput = document.getElementById('marginLeft');
        this.marginRightInput = document.getElementById('marginRight');

        // Appearance
        this.lineColorInput = document.getElementById('lineColor');
        this.lineThicknessInput = document.getElementById('lineThickness');
        this.lineThicknessValue = document.getElementById('lineThicknessValue');

        // Buttons
        this.printButton = document.getElementById('printButton');
        this.resetButton = document.getElementById('resetButton');

        // Preview
        this.paperPreview = document.getElementById('paperPreview');
    }

    /**
     * Attach event listeners to all controls
     */
    attachEventListeners() {
        // Paper type
        this.paperTypeInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.config.paperType = input.value;
                this.updateTypeSpecificControls();
                this.updatePreview();
            });
        });

        // Paper size
        this.paperSizeInputs.forEach(input => {
            input.addEventListener('change', () => {
                const oldSize = this.config.paperSize;
                this.config.paperSize = input.value;
                // Convert line spacing when switching between letter and A4
                if (oldSize !== this.config.paperSize) {
                    if (oldSize === 'letter' && this.config.paperSize === 'a4') {
                        // Convert inches to mm
                        this.config.lineSpacing = Math.round((this.config.lineSpacing * 25.4) * 10) / 10; // Round to 0.1mm
                        this.lineSpacingInput.min = '5';
                        this.lineSpacingInput.max = '12';
                        this.lineSpacingInput.step = '0.5';
                        // Convert grid size from inches to mm
                        this.config.gridSize = Math.round((this.config.gridSize * 25.4) * 10) / 10; // Round to 0.1mm
                        this.gridSizeInput.min = '2.5';
                        this.gridSizeInput.max = '10';
                        this.gridSizeInput.step = '0.5';
                    } else if (oldSize === 'a4' && this.config.paperSize === 'letter') {
                        // Convert mm to inches
                        this.config.lineSpacing = Math.round((this.config.lineSpacing / 25.4) * 10000) / 10000; // Round to nearest 1/32"
                        this.lineSpacingInput.min = '0.25';
                        this.lineSpacingInput.max = '0.5';
                        this.lineSpacingInput.step = '0.03125';
                        // Convert grid size from mm to inches
                        this.config.gridSize = Math.round((this.config.gridSize / 25.4) * 10000) / 10000; // Round to nearest 1/32"
                        this.gridSizeInput.min = '0.1';
                        this.gridSizeInput.max = '0.5';
                        this.gridSizeInput.step = '0.05';
                    }
                    this.lineSpacingInput.value = this.config.lineSpacing;
                    this.gridSizeInput.value = this.config.gridSize;
                }
                this.updateUnitLabels();
                this.updateLineSpacingLabel();
                this.updateGridSizeLabel();
                this.updatePreview();
            });
        });

        // Orientation
        this.orientationInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.config.orientation = input.value;
                this.updatePreview();
            });
        });

        // Line spacing
        this.lineSpacingInput.addEventListener('input', () => {
            const value = parseFloat(this.lineSpacingInput.value);
            if (this.config.paperSize === 'a4') {
                // Store as mm for A4
                this.config.lineSpacing = value;
            } else {
                // Store as inches for letter
                this.config.lineSpacing = value;
            }
            this.updateLineSpacingLabel();
            this.updatePreview();
        });

        // Grid size
        this.gridSizeInput.addEventListener('input', () => {
            const value = parseFloat(this.gridSizeInput.value);
            this.config.gridSize = value;
            this.updateGridSizeLabel();
            this.updatePreview();
        });

        // Dot spacing
        this.dotSpacingInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.config.dotSpacing = parseInt(input.value);
                this.updatePreview();
            });
        });

        // Margins
        this.marginTopInput.addEventListener('input', () => {
            this.config.margins.top = parseFloat(this.marginTopInput.value);
            this.updatePreview();
        });

        this.marginBottomInput.addEventListener('input', () => {
            this.config.margins.bottom = parseFloat(this.marginBottomInput.value);
            this.updatePreview();
        });

        this.marginLeftInput.addEventListener('input', () => {
            this.config.margins.left = parseFloat(this.marginLeftInput.value);
            this.updatePreview();
        });

        this.marginRightInput.addEventListener('input', () => {
            this.config.margins.right = parseFloat(this.marginRightInput.value);
            this.updatePreview();
        });

        // Appearance
        this.lineColorInput.addEventListener('input', () => {
            this.config.lineColor = this.lineColorInput.value;
            this.updatePreview();
        });

        this.lineThicknessInput.addEventListener('input', () => {
            this.config.lineThickness = parseFloat(this.lineThicknessInput.value);
            this.lineThicknessValue.textContent = `${this.config.lineThickness}px`;
            this.updatePreview();
        });

        // Buttons
        this.printButton.addEventListener('click', () => {
            this.print();
        });

        this.resetButton.addEventListener('click', () => {
            this.resetToDefaults();
        });
    }

    /**
     * Show/hide type-specific controls based on selected paper type
     */
    updateTypeSpecificControls() {
        // Hide all type-specific controls
        this.linedControls.classList.add('hidden');
        this.graphControls.classList.add('hidden');
        this.dotControls.classList.add('hidden');

        // Show relevant controls
        switch (this.config.paperType) {
            case 'lined':
                this.linedControls.classList.remove('hidden');
                break;
            case 'graph':
                this.graphControls.classList.remove('hidden');
                break;
            case 'dot':
                this.dotControls.classList.remove('hidden');
                break;
        }
        this.updateUnitLabels();
    }

    /**
     * Update line spacing label with current value
     */
    updateLineSpacingLabel() {
        const value = parseFloat(this.config.lineSpacing);
        if (this.config.paperSize === 'a4') {
            // Display in mm
            this.lineSpacingValue.textContent = `${value.toFixed(1)}mm`;
        } else {
            // Display in inches, show as fraction if possible
            const fraction = this.inchesToFraction(value);
            this.lineSpacingValue.textContent = fraction || `${value.toFixed(3)}"`;
        }
    }

    /**
     * Update grid size label with current value
     */
    updateGridSizeLabel() {
        const value = parseFloat(this.config.gridSize);
        if (this.config.paperSize === 'a4') {
            // Display in mm
            this.gridSizeValue.textContent = `${value.toFixed(1)}mm grid`;
        } else {
            // Display as lines per inch
            const linesPerInch = 1 / value;
            this.gridSizeValue.textContent = `${linesPerInch.toFixed(1)} lines per inch`;
        }
    }

    /**
     * Convert decimal inches to fraction string
     */
    inchesToFraction(inches) {
        const commonFractions = {
            0.25: '1/4"',
            0.28125: '9/32"',
            0.3125: '5/16"',
            0.34375: '11/32"',
            0.375: '3/8"',
            0.40625: '13/32"',
            0.4375: '7/16"',
            0.46875: '15/32"',
            0.5: '1/2"'
        };
        // Check for exact match or very close match (within 0.001)
        for (const [dec, frac] of Object.entries(commonFractions)) {
            if (Math.abs(inches - parseFloat(dec)) < 0.001) {
                return frac;
            }
        }
        return null;
    }

    /**
     * Update unit labels based on paper size (inches for letter, mm for A4)
     */
    updateUnitLabels() {
        // Update line spacing label
        this.updateLineSpacingLabel();

        // Update grid size label
        this.updateGridSizeLabel();

        // Update dot spacing labels
        const isA4 = this.config.paperSize === 'a4';
        this.dotSpacingInputs.forEach(input => {
            const span = input.parentElement.querySelector('span');
            if (span && span.hasAttribute(`data-${isA4 ? 'a4' : 'letter'}`)) {
                span.textContent = span.getAttribute(`data-${isA4 ? 'a4' : 'letter'}`);
            }
        });
    }

    /**
     * Update the paper preview
     */
    updatePreview() {
        // Clear existing preview
        this.paperPreview.innerHTML = '';

        // Set data attributes for styling
        this.paperPreview.setAttribute('data-size', this.config.paperSize);
        this.paperPreview.setAttribute('data-orientation', this.config.orientation);

        // Generate the paper template
        const svg = PaperTemplates.generate(this.config);

        // Append to preview
        this.paperPreview.appendChild(svg);
    }

    /**
     * Trigger print dialog
     */
    print() {
        // Set page size in a style tag for print
        const pageSize = this.config.paperSize === 'letter' ? '8.5in 11in' : '210mm 297mm';
        const orientation = this.config.orientation;

        // Create or update print style
        let printStyle = document.getElementById('dynamic-print-style');
        if (!printStyle) {
            printStyle = document.createElement('style');
            printStyle.id = 'dynamic-print-style';
            document.head.appendChild(printStyle);
        }

        printStyle.textContent = `
            @media print {
                @page {
                    size: ${pageSize} ${orientation};
                    margin: 0;
                }
            }
        `;

        // Trigger print
        window.print();
    }

    /**
     * Reset all controls to default values
     */
    resetToDefaults() {
        this.config = this.getDefaultConfig();

        // Reset paper type
        this.paperTypeInputs.forEach(input => {
            input.checked = input.value === this.config.paperType;
        });

        // Reset paper size
        this.paperSizeInputs.forEach(input => {
            input.checked = input.value === this.config.paperSize;
        });

        // Reset orientation
        this.orientationInputs.forEach(input => {
            input.checked = input.value === this.config.orientation;
        });

        // Reset line spacing
        // Set slider min/max/step based on paper size
        if (this.config.paperSize === 'a4') {
            this.lineSpacingInput.min = '5';
            this.lineSpacingInput.max = '12';
            this.lineSpacingInput.step = '0.5';
            // Default is 9mm for A4 (equivalent to 11/32")
            this.config.lineSpacing = 9;
        } else {
            this.lineSpacingInput.min = '0.25';
            this.lineSpacingInput.max = '0.5';
            this.lineSpacingInput.step = '0.03125';
            // Default is 11/32" for letter
            this.config.lineSpacing = 0.34375;
        }
        this.lineSpacingInput.value = this.config.lineSpacing;
        this.updateLineSpacingLabel();

        // Reset grid size
        // Set slider min/max/step based on paper size
        if (this.config.paperSize === 'a4') {
            this.gridSizeInput.min = '2.5';
            this.gridSizeInput.max = '10';
            this.gridSizeInput.step = '0.5';
            // Default is 10mm for A4 (equivalent to 2 lines/inch)
            this.config.gridSize = 10;
        } else {
            this.gridSizeInput.min = '0.1';
            this.gridSizeInput.max = '0.5';
            this.gridSizeInput.step = '0.05';
            // Default is 0.5" for letter (2 lines/inch)
            this.config.gridSize = 0.5;
        }
        this.gridSizeInput.value = this.config.gridSize;
        this.updateGridSizeLabel();

        // Reset dot spacing
        this.dotSpacingInputs.forEach(input => {
            input.checked = parseInt(input.value) === this.config.dotSpacing;
        });

        // Reset margins
        this.marginTopInput.value = this.config.margins.top;
        this.marginBottomInput.value = this.config.margins.bottom;
        this.marginLeftInput.value = this.config.margins.left;
        this.marginRightInput.value = this.config.margins.right;

        // Reset appearance
        this.lineColorInput.value = this.config.lineColor;
        this.lineThicknessInput.value = this.config.lineThickness;
        this.lineThicknessValue.textContent = `${this.config.lineThickness}px`;

        // Update UI
        this.updateTypeSpecificControls();
        this.updatePreview();
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new PaperMaker();
    // Update labels on initial load
    app.updateUnitLabels();
});


