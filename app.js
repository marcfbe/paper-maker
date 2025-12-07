/**
 * Paper Maker Application
 * Main application logic for handling user interactions and generating paper templates
 */

class PaperMaker {
    constructor() {
        this.config = this.getDefaultConfig();
        this.initializeElements();
        this.attachEventListeners();
        this.updatePreview();
    }

    /**
     * Get default configuration
     */
    getDefaultConfig() {
        return {
            paperType: 'lined',
            paperSize: 'letter',
            orientation: 'portrait',
            lineSpacing: 'wide',
            gridSize: 2,
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
        this.lineSpacingInputs = document.querySelectorAll('input[name="lineSpacing"]');

        // Grid size (for graph paper)
        this.gridSizeInputs = document.querySelectorAll('input[name="gridSize"]');

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
                this.config.paperSize = input.value;
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
        this.lineSpacingInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.config.lineSpacing = input.value;
                this.updatePreview();
            });
        });

        // Grid size
        this.gridSizeInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.config.gridSize = parseInt(input.value);
                this.updatePreview();
            });
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
        this.lineSpacingInputs.forEach(input => {
            input.checked = input.value === this.config.lineSpacing;
        });

        // Reset grid size
        this.gridSizeInputs.forEach(input => {
            input.checked = parseInt(input.value) === this.config.gridSize;
        });

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
    new PaperMaker();
});

