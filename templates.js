/**
 * Paper Template Generators
 * Creates SVG elements for different paper types
 */

const PaperTemplates = {
    /**
     * Get paper dimensions based on size and orientation
     */
    getDimensions(paperSize, orientation) {
        const dimensions = {
            letter: { width: 8.5, height: 11 }, // inches
            a4: { width: 210 / 25.4, height: 297 / 25.4 } // convert mm to inches
        };

        const size = dimensions[paperSize];
        if (orientation === 'landscape') {
            return { width: size.height, height: size.width };
        }
        return size;
    },

    /**
     * Create SVG namespace element
     */
    createSVG(width, height, dpi = 96) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const pixelWidth = width * dpi;
        const pixelHeight = height * dpi;

        svg.setAttribute('width', pixelWidth);
        svg.setAttribute('height', pixelHeight);
        svg.setAttribute('viewBox', `0 0 ${pixelWidth} ${pixelHeight}`);
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

        return svg;
    },

    /**
     * Generate Lined Paper
     */
    generateLinedPaper(config) {
        const { paperSize, orientation, lineSpacing, margins, lineColor, lineThickness } = config;
        const dims = this.getDimensions(paperSize, orientation);
        const dpi = 96;

        const svg = this.createSVG(dims.width, dims.height, dpi);

        // Convert margins from inches to pixels
        const marginTop = margins.top * dpi;
        const marginBottom = margins.bottom * dpi;
        const marginLeft = margins.left * dpi;
        const marginRight = margins.right * dpi;

        // Line spacing - inches for letter, mm for A4
        let spacing;
        if (paperSize === 'a4') {
            // lineSpacing is in mm, convert to pixels
            spacing = (lineSpacing / 25.4) * dpi;
        } else {
            // lineSpacing is in inches, convert to pixels
            spacing = lineSpacing * dpi;
        }

        // Calculate drawable area
        const startY = marginTop;
        const endY = dims.height * dpi - marginBottom;
        const startX = marginLeft;
        const endX = dims.width * dpi - marginRight;

        // Create lines
        let currentY = startY + spacing;
        while (currentY <= endY) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', startX);
            line.setAttribute('y1', currentY);
            line.setAttribute('x2', endX);
            line.setAttribute('y2', currentY);
            line.setAttribute('stroke', lineColor);
            line.setAttribute('stroke-width', lineThickness);
            svg.appendChild(line);

            currentY += spacing;
        }

        // Optional: Add left margin line (red line for notebook effect)
        if (marginLeft > 50) {
            const marginLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            const marginLineX = marginLeft - 10;
            marginLine.setAttribute('x1', marginLineX);
            marginLine.setAttribute('y1', marginTop);
            marginLine.setAttribute('x2', marginLineX);
            marginLine.setAttribute('y2', endY);
            marginLine.setAttribute('stroke', '#ff0000');
            marginLine.setAttribute('stroke-width', lineThickness);
            svg.appendChild(marginLine);
        }

        return svg;
    },

    /**
     * Generate Graph Paper
     */
    generateGraphPaper(config) {
        const { paperSize, orientation, gridSize, margins, lineColor, lineThickness } = config;
        const dims = this.getDimensions(paperSize, orientation);
        const dpi = 96;

        const svg = this.createSVG(dims.width, dims.height, dpi);

        // Convert margins from inches to pixels
        const marginTop = margins.top * dpi;
        const marginBottom = margins.bottom * dpi;
        const marginLeft = margins.left * dpi;
        const marginRight = margins.right * dpi;

        // Grid spacing - inches for letter, mm for A4
        let spacing;
        if (paperSize === 'a4') {
            // gridSize is in mm, convert to pixels
            spacing = (gridSize / 25.4) * dpi;
        } else {
            // gridSize is in inches, convert to pixels
            spacing = gridSize * dpi;
        }

        // Calculate drawable area
        const startY = marginTop;
        const endY = dims.height * dpi - marginBottom;
        const startX = marginLeft;
        const endX = dims.width * dpi - marginRight;

        // Create vertical lines
        let currentX = startX;
        let lineCount = 0;
        while (currentX <= endX) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', currentX);
            line.setAttribute('y1', startY);
            line.setAttribute('x2', currentX);
            line.setAttribute('y2', endY);
            line.setAttribute('stroke', lineColor);

            // Make every 5th line slightly thicker for easier counting
            const thickness = (lineCount % 5 === 0) ? lineThickness * 1.5 : lineThickness;
            line.setAttribute('stroke-width', thickness);

            svg.appendChild(line);
            currentX += spacing;
            lineCount++;
        }

        // Create horizontal lines
        let currentY = startY;
        lineCount = 0;
        while (currentY <= endY) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', startX);
            line.setAttribute('y1', currentY);
            line.setAttribute('x2', endX);
            line.setAttribute('y2', currentY);
            line.setAttribute('stroke', lineColor);

            // Make every 5th line slightly thicker for easier counting
            const thickness = (lineCount % 5 === 0) ? lineThickness * 1.5 : lineThickness;
            line.setAttribute('stroke-width', thickness);

            svg.appendChild(line);
            currentY += spacing;
            lineCount++;
        }

        return svg;
    },

    /**
     * Generate Dot Paper
     */
    generateDotPaper(config) {
        const { paperSize, orientation, dotSpacing, margins, lineColor, lineThickness } = config;
        const dims = this.getDimensions(paperSize, orientation);
        const dpi = 96;

        const svg = this.createSVG(dims.width, dims.height, dpi);

        // Convert margins from inches to pixels
        const marginTop = margins.top * dpi;
        const marginBottom = margins.bottom * dpi;
        const marginLeft = margins.left * dpi;
        const marginRight = margins.right * dpi;

        // Dot spacing - inches for letter, mm for A4
        let spacing;
        if (paperSize === 'a4') {
            // Convert to millimeters
            const dotSpacingMapMM = {
                2: 12.7,  // 12.7mm spacing (equivalent to 2 dots/inch)
                3: 8.5,   // 8.5mm spacing (equivalent to 3 dots/inch)
                4: 6.4,   // 6.4mm spacing (equivalent to 4 dots/inch)
                5: 5.0    // 5mm spacing (equivalent to 5 dots/inch)
            };
            const mmSpacing = dotSpacingMapMM[dotSpacing];
            spacing = (mmSpacing / 25.4) * dpi; // Convert mm to pixels
        } else {
            // Use inches for letter
            spacing = dpi / dotSpacing;
        }

        // Calculate drawable area
        const startY = marginTop;
        const endY = dims.height * dpi - marginBottom;
        const startX = marginLeft;
        const endX = dims.width * dpi - marginRight;

        // Dot radius based on line thickness
        const dotRadius = lineThickness * 0.75;

        // Create dots in a grid pattern
        let currentY = startY;
        while (currentY <= endY) {
            let currentX = startX;
            while (currentX <= endX) {
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', currentX);
                circle.setAttribute('cy', currentY);
                circle.setAttribute('r', dotRadius);
                circle.setAttribute('fill', lineColor);
                svg.appendChild(circle);

                currentX += spacing;
            }
            currentY += spacing;
        }

        return svg;
    },

    /**
     * Generate Blank Paper (with optional margin guides)
     */
    generateBlankPaper(config) {
        const { paperSize, orientation, margins, lineColor, lineThickness } = config;
        const dims = this.getDimensions(paperSize, orientation);
        const dpi = 96;

        const svg = this.createSVG(dims.width, dims.height, dpi);

        // Convert margins from inches to pixels
        const marginTop = margins.top * dpi;
        const marginBottom = margins.bottom * dpi;
        const marginLeft = margins.left * dpi;
        const marginRight = margins.right * dpi;

        // Draw very light margin guides (optional)
        if (margins.top > 0 || margins.bottom > 0 || margins.left > 0 || margins.right > 0) {
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', marginLeft);
            rect.setAttribute('y', marginTop);
            rect.setAttribute('width', dims.width * dpi - marginLeft - marginRight);
            rect.setAttribute('height', dims.height * dpi - marginTop - marginBottom);
            rect.setAttribute('fill', 'none');
            rect.setAttribute('stroke', lineColor);
            rect.setAttribute('stroke-width', lineThickness * 0.5);
            rect.setAttribute('stroke-dasharray', '5,5');
            rect.setAttribute('opacity', '0.3');
            svg.appendChild(rect);
        }

        return svg;
    },

    /**
     * Main generator function
     */
    generate(config) {
        const { paperType } = config;

        switch (paperType) {
            case 'lined':
                return this.generateLinedPaper(config);
            case 'graph':
                return this.generateGraphPaper(config);
            case 'dot':
                return this.generateDotPaper(config);
            case 'blank':
                return this.generateBlankPaper(config);
            default:
                return this.generateLinedPaper(config);
        }
    }
};

