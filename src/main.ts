// ----- Imports -----
import { SetupCanvas, CreateGradient, WriteToCanvas, DrawFormWithNCorners } from "./canvas.js";
import { profiles } from "./presets.js";

// ----- Configuration -----
export const version: string = "1.1.0";

export let width: number = 0;
export let height: number = 0;
export let background: string[] = ["#272823", "#1e1f1c"];
export let icon_color: string = "";
export let icon_size: number = 0;
export let margin: number = 0;
export let offset_x: number = 0;
export let offset_y: number = 0;
export let svgFilePaths: string[] = [];
export let transparent_icons: boolean = true;
export let transparent_shapes: boolean = true;

const colors: string[] = ["#ed6c89ff", "#ee9d70ff", "#f9d978ff", "#b3db82ff", "#91dae6ff", "#a99decff"];
const color_gradient: string[] = ["#363636ff", "#363636cc", "#36363699", "#36363666", "#36363633"];
const icon_gradient: string[] = ["#808080ff", "#686868ff", "#575757ff", "#4e4e4eff", "#424242ff", "#00000000"];

export let base_color_probability: number = 0.01; 
export let neighbor_bonus: number = 0.13; 
// HTML elements are now in frontend.ts

// ----- Setup canvas -----
export const Background_Canvas = document.getElementById("Background_Canvas") as HTMLCanvasElement;
export const ctx = Background_Canvas.getContext("2d") as CanvasRenderingContext2D;

// ----- Helper-Functions -----
// ** Creates a random integer between min and max (inclusive) **
function GetRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ----- Functions -----
// ** Counts the number of colored neighbors around a given cell **
function CountColoredNeighbors(grid: {hasColor: boolean}[][], row: number, col: number, rows: number, cols: number): number {
    let count = 0;
    // Check all 8 directions around the current cell (including diagonals)
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],  // top row
        [0, -1],           [0, 1],   // same row
        [1, -1],  [1, 0],  [1, 1]    // bottom row
    ];
    
    for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        
        // Check if neighbor is within grid bounds and has color
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            if (grid[newRow][newCol].hasColor) {
                count++;
            }
        }
    }
    return count;
}

// ** Determines if a cell should have color based on its neighbors **
function ShouldHaveColor(grid: {hasColor: boolean}[][], row: number, col: number, rows: number, cols: number): boolean {
    const coloredNeighbors = CountColoredNeighbors(grid, row, col, rows, cols);
    // Higher probability if more neighbors have color (clustering effect)
    const probability = base_color_probability + (coloredNeighbors * neighbor_bonus);
    return Math.random() < probability;
}

// ** Calculates distance to nearest colored cell using BFS (for gradient effect) **
function CalculateDistanceToNearestColor(grid: {hasColor: boolean}[][], row: number, col: number, rows: number, cols: number): number {
    if (grid[row][col].hasColor) return 0;
    
    // Breadth-First Search to find nearest colored field
    const queue: {row: number, col: number, distance: number}[] = [];
    const visited: boolean[][] = [];
    
    // Initialize visited array
    for (let i = 0; i < rows; i++) {
        visited[i] = new Array(cols).fill(false);
    }
    
    queue.push({row, col, distance: 0});
    visited[row][col] = true;
    
    // Only check orthogonal neighbors (up, down, left, right) for distance
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1]
    ];
    
    while (queue.length > 0) {
        const current = queue.shift()!;
        
        for (const [dr, dc] of directions) {
            const newRow = current.row + dr;
            const newCol = current.col + dc;
            
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && !visited[newRow][newCol]) {
                if (grid[newRow][newCol].hasColor) {
                    return current.distance + 1;
                }
                
                visited[newRow][newCol] = true;
                queue.push({row: newRow, col: newCol, distance: current.distance + 1});
            }
        }
    }
    
    return transparent_icons ? 6 : 5; // Maximum distance if no colored field found
}

// ** Generate grid with clustering logic **
function GenerateGrid(icon_size: number, margin: number, width: number, height: number): {x: number, y: number, color: number, icon: number, shape: number, hasColor: boolean}[] {
    let positions: {x: number, y: number, color: number, icon: number, shape: number, hasColor: boolean}[] = [];

    // Calculate grid dimensions based on canvas size and spacing
    let cols = Math.floor((width + margin * 2 + offset_x) / (icon_size + margin));
    let rows = Math.floor((height + margin * 2 + offset_y) / (icon_size + margin));

    // Create 2D grid for neighbor checking and clustering logic
    let grid: {hasColor: boolean}[][] = [];
    for (let i = 0; i < rows; i++) {
        grid[i] = [];
        for (let j = 0; j < cols; j++) {
            grid[i][j] = { hasColor: false };
        }
    }

    // Multiple passes to create clustering effect (colors appear near other colors)
    for (let pass = 0; pass < 3; pass++) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (!grid[i][j].hasColor && ShouldHaveColor(grid, i, j, rows, cols)) {
                    grid[i][j].hasColor = true;
                }
            }
        }
    }

    // Generate final positions with color assignments
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            // Calculate pixel coordinates from grid coordinates with offset
            let x = margin + j * (icon_size + margin) + offset_x;
            let y = margin + i * (icon_size + margin) + offset_y;
            
            // Generate random shape (5-11 corners, 0 for circle)
            let shape = GetRandomInt(5, 11);
            if (shape === 11) shape = 0;
            
            let colorValue: number;
            if (grid[i][j].hasColor) {
                // Assign random color from palette
                colorValue = GetRandomInt(0, colors.length - 1);
            } else {
                // Assign negative value based on distance to nearest colored field
                // Creates gradient effect: -1 (closest) to -5/-6 (farthest)
                const distance = CalculateDistanceToNearestColor(grid, i, j, rows, cols);
                const maxDistance = transparent_icons ? 6 : 5;
                colorValue = -Math.min(distance, maxDistance);
            }
            
            positions.push({
                x: x,
                y: y,
                color: colorValue,
                icon: svgFilePaths.length > 0 ? GetRandomInt(0, svgFilePaths.length - 1) : 0,
                shape: shape,
                hasColor: grid[i][j].hasColor
            });
        }
    }

    console.log("Generated grid with clustering: ", positions);
    console.log("Fields with color: ", positions.filter(p => p.hasColor).length, "/", positions.length);

    // Prevent adjacent fields from having the same icon (visual variety)
    for (let i = 0; i < positions.length; i++) {
        let current = positions[i];
        if (!current.hasColor) continue; // Skip empty fields
        
        let right = positions[i + 1];
        let down = positions[i + cols];

        // Change icon if right neighbor has same icon
        if (right && current.hasColor && right.hasColor && current.icon === right.icon && svgFilePaths.length > 1) {
            right.icon = (right.icon + 1) % svgFilePaths.length;
        }
        // Change icon if bottom neighbor has same icon
        if (down && current.hasColor && down.hasColor && current.icon === down.icon && svgFilePaths.length > 1) {
            down.icon = (down.icon + 1) % svgFilePaths.length;
        }
    }

    return positions;
}

// ** Generate background **
export function Generate() {
    console.log("Generating background...");
    console.log("Base color probability:", base_color_probability);
    console.log("Neighbor bonus:", neighbor_bonus);
    console.log("Icon color:", icon_color);
    console.log("Icon Size:", icon_size);
    console.log("Margin:", margin);
    console.log("Canvas size:", width, "x", height);
    SetupCanvas(Background_Canvas, width, height);
    CreateGradient(ctx, background, width, height)
    const grid_cords = GenerateGrid(icon_size, margin, width, height);
    grid_cords.forEach(pos => {
        if (pos.hasColor && pos.color >= 0) {
            // Draw colored fields normally
            DrawFormWithNCorners(ctx, pos.shape, colors[pos.color], icon_size, margin/2, pos.x, pos.y);
            if (svgFilePaths.length > 0) {
                WriteToCanvas(ctx, svgFilePaths[pos.icon], pos.x, pos.y, icon_color, icon_size);
            }
        } else if (pos.color < 0) {
            // Draw empty fields with gradient based on distance to colored fields
            const distanceIndex = Math.abs(pos.color) - 1; // Convert -1 to 0, -2 to 1, etc.
            const maxGradientIndex = transparent_icons ? 5 : 4; // 0-5 for transparent mode, 0-4 for normal
            if (distanceIndex <= maxGradientIndex) {
                // For level 6 (-6) in transparent mode, skip drawing the shape but still draw icon if not transparent
                if (transparent_shapes) { //FIXME Decuple "transparent_shapes" and "transparent_icons"
                    if (transparent_icons) {
                        if (distanceIndex < 5) {
                            DrawFormWithNCorners(ctx, pos.shape, color_gradient[distanceIndex], icon_size, margin/2, pos.x, pos.y);
                        }
                    }
                    else {
                        if (distanceIndex < 4) {
                            DrawFormWithNCorners(ctx, pos.shape, color_gradient[distanceIndex], icon_size, margin/2, pos.x, pos.y);
                        }
                    }
                }
                else {
                    let index: number = distanceIndex;
                    if (index === 5) index = 4;
                    DrawFormWithNCorners(ctx, pos.shape, color_gradient[index], icon_size, margin/2, pos.x, pos.y);
                }
                // Draw icons with appropriate transparency
                if (svgFilePaths.length > 0 && icon_gradient[distanceIndex] !== "#00000000") { // Only draw icon if not fully transparent
                    WriteToCanvas(ctx, svgFilePaths[pos.icon], pos.x, pos.y, icon_gradient[distanceIndex], icon_size);
                }
            }
        }
    });
    console.log("Background generated.");
}

//SECTION - ** Load profile settings **
export function LoadProfile(profile: number) {
    margin = profiles[profile].margin;
    background = profiles[profile].background;
    icon_color = profiles[profile].icon_color;
    icon_size = profiles[profile].icon_size;
    width = profiles[profile].width;
    height = profiles[profile].height;
    base_color_probability = profiles[profile].base_color_probability;
    neighbor_bonus = profiles[profile].neighbor_bonus;
    offset_x = profiles[profile].offset_x;
    offset_y = profiles[profile].offset_y;
    console.log("Loaded profile:", profile, profiles[profile]);
}

// ** Update variables from sliders and inputs -> Called from frontend.ts**
export function updateVariables(widthSlider: HTMLInputElement, heightSlider: HTMLInputElement, iconSizeSlider: HTMLInputElement, marginSlider: HTMLInputElement, iconColorPicker: HTMLInputElement, gradiantColorOne: HTMLInputElement, gradiantColorTwo: HTMLInputElement, colorPercentage: HTMLInputElement, clusteringPercentage: HTMLInputElement, offsetXSlider: HTMLInputElement, offsetYSlider: HTMLInputElement, transparentIconsCheckbox: HTMLInputElement, transparentShapesCheckbox: HTMLInputElement) {
    width = parseInt(widthSlider.value);
    height = parseInt(heightSlider.value);
    icon_color = iconColorPicker.value;
    icon_size = parseInt(iconSizeSlider.value);
    margin = parseInt(marginSlider.value);
    background = [gradiantColorOne.value, gradiantColorTwo.value];
    base_color_probability = Math.pow(parseFloat(colorPercentage.value), 4);
    neighbor_bonus = Math.pow(parseFloat(clusteringPercentage.value), 6);
    offset_x = parseInt(offsetXSlider.value);
    offset_y = parseInt(offsetYSlider.value);
    transparent_icons = transparentIconsCheckbox.checked;
    transparent_shapes = transparentShapesCheckbox.checked;
    console.log("Updated variables from inputs.");
}
