export function SetupCanvas(canvas: HTMLCanvasElement, width: number, height: number): void {
    canvas.width = width;
    canvas.height = height;
}

export function CreateGradient(ctx: CanvasRenderingContext2D, colors: string[], width: number, height: number) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);  
}

export function WriteToCanvas(ctx: CanvasRenderingContext2D, svg_path: string, x: number, y: number, color: string, icon_size: number) {
    fetch(svg_path)
        .then(response => response.text())
        .then(svgText => {
            if (/fill="[^"]*"/g.test(svgText)) {
                svgText = svgText.replace(/fill="[^"]*"/g, `fill="${color}"`);
            } else {
                svgText = svgText.replace(/<svg([^>]*)>/, `<svg$1 fill="${color}">`)
            }
            const img = new Image();
            const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(svgBlob);
            img.onload = function() {
                ctx.drawImage(img, x, y, icon_size, icon_size);
                URL.revokeObjectURL(url);
            };
            img.src = url;
        });
}

export function DrawFormWithNCorners(ctx: CanvasRenderingContext2D, corners: number, color: string, size: number, border: number, x: number, y: number) {
    ctx.fillStyle = color;
    ctx.beginPath();
    if (corners === 5) {
        // Hier: Die 5 Eckpunkte nach deinem Quadrat platzieren
        const points = [
            [x + size / 2, y - border],                         // oben Mitte
            [x + size + border, y + size * 0.35],               // rechts leicht unten
            [x + size * 0.8, y + size + border],                // unten rechts
            [x + size * 0.2, y + size + border],                // unten links
            [x - border, y + size * 0.35]                       // links leicht unten
        ];
        ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i][0], points[i][1]);
        }
        ctx.closePath();
    }
    else if (corners === 4) { 
        ctx.rect(x - border, y - border, size + border * 2, size + border * 2);
    }
    else if (corners === 3) {
        ctx.moveTo(x - border , y + size + border);
        ctx.lineTo(x + size + border, y + size + border);
        ctx.lineTo(x + size / 2, y - border);
        ctx.closePath();
    }
    else if (corners === 0) {
        ctx.arc(x + size / 2, y + size / 2, (size + border * 2) / 2, 0, 2 * Math.PI);
    }
    else {
        ctx.fill();
        for (let i = 0; i < corners; i++) {
            const angle = i * (2 * Math.PI / corners) - Math.PI / 2;
            const radius = (size + border * 2) / 2;
            const xPos = x + size / 2 + radius * Math.cos(angle);
            const yPos = y + size / 2 + radius * Math.sin(angle);
            if (i === 0) {
                ctx.moveTo(xPos, yPos);
            } else {
                ctx.lineTo(xPos, yPos);
            }
        }
        ctx.closePath();
    }
    ctx.fill();
}