//SECTION Frontend Event Handlers -----
import { 
    Generate, 
    LoadProfile, 
    width, 
    height, 
    background, 
    icon_color, 
    icon_size, 
    margin, 
    svgFilePaths, 
    base_color_probability, 
    neighbor_bonus,
    Background_Canvas,
    updateVariables
} from "./main.js";

//SECTION HTML Elements -----
//SECTION Sliders -----
const widthSlider = document.getElementById("widthSlider") as HTMLInputElement;
const heightSlider = document.getElementById("heightSlider") as HTMLInputElement;
const iconSizeSlider = document.getElementById("iconSizeSlider") as HTMLInputElement;
const marginSlider = document.getElementById("marginSlider") as HTMLInputElement;
const iconColorPicker = document.getElementById("iconColorPicker") as HTMLInputElement;
const colorPercentage = document.getElementById("colorPercentage") as HTMLInputElement;
const clusteringPercentage = document.getElementById("clusteringPercentage") as HTMLInputElement;
const offsetXSlider = document.getElementById("offsetXSlider") as HTMLInputElement;
const offsetYSlider = document.getElementById("offsetYSlider") as HTMLInputElement;
//!SECTION Sliders -----

//SECTION Input Boxes -----
const widthValue = document.getElementById("widthValue") as HTMLInputElement;
const heightValue = document.getElementById("heightValue") as HTMLInputElement;
const iconSizeValue = document.getElementById("iconSizeValue") as HTMLInputElement;
const marginValue = document.getElementById("marginValue") as HTMLInputElement;
const colorPercentageValue = document.getElementById("colorPercentageValue") as HTMLInputElement;
const clusteringPercentageValue = document.getElementById("clusteringPercentageValue") as HTMLInputElement;
const offsetXValue = document.getElementById("offsetXValue") as HTMLInputElement;
const offsetYValue = document.getElementById("offsetYValue") as HTMLInputElement;
//!SECTION Input Boxes -----

//SECTION Checkboxes -----
const transparentIconsCheckbox = document.getElementById("transparentIconsCheckbox") as HTMLInputElement;
const transparentShapesCheckbox = document.getElementById("transparentShapesCheckbox") as HTMLInputElement;
//!SECTION Checkboxes -----

//SECTION Buttons -----
const toggleColorPickers = document.getElementById("toggleColorPickers") as HTMLButtonElement;

const saveButton = document.getElementById("saveButton") as HTMLButtonElement;
const regenerateButton = document.getElementById("regenerateButton") as HTMLButtonElement;
const p720h = document.getElementById("p720h") as HTMLButtonElement;
const p1080h = document.getElementById("p1080h") as HTMLButtonElement;
const p1440h = document.getElementById("p1440h") as HTMLButtonElement;
const p2160h = document.getElementById("p2160h") as HTMLButtonElement;
const p720v = document.getElementById("p720v") as HTMLButtonElement;
const p1080v = document.getElementById("p1080v") as HTMLButtonElement;
const p1440v = document.getElementById("p1440v") as HTMLButtonElement;
const p2160v = document.getElementById("p2160v") as HTMLButtonElement;
//!SECTION Buttons -----

//SECTION Color Pickers -----
const colorPickers = document.getElementById("colorPickers") as HTMLDivElement;
const gradiantColorOne = document.getElementById("gradiantColorOne") as HTMLInputElement;
const gradiantColorTwo = document.getElementById("gradiantColorTwo") as HTMLInputElement;
//!SECTION Color Pickers -----
//!SECTION HTML Elements -----
//!SECTION Frontend Event Handlers -----

//SECTION Initial setup -----
updateVariables(widthSlider, heightSlider, iconSizeSlider, marginSlider, 
                iconColorPicker, gradiantColorOne, gradiantColorTwo, 
                colorPercentage, clusteringPercentage, 
                offsetXSlider, offsetYSlider, transparentIconsCheckbox, transparentShapesCheckbox);
Generate();
//!SECTION Initial setup -----

//SECTION Event listeners -----
toggleColorPickers.addEventListener("click", () => {
    colorPickers.style.display = colorPickers.style.display === "none" ? "flex" : "none";
    toggleColorPickers.innerText = colorPickers.style.display === "none" ? "V - Show Color Pickers - V" : "V - Hide Color Pickers - V";
    if (window.innerWidth > 950) {
        window.scrollTo(0, document.body.scrollHeight);
    }
})

saveButton.addEventListener("click", () => {
    let link = document.createElement("a");
    link.download = "background.png";
    link.href = Background_Canvas.toDataURL();
    link.click();
});

regenerateButton.addEventListener("click", () => {
    updateVariables(widthSlider, heightSlider, iconSizeSlider, marginSlider, 
                    iconColorPicker, gradiantColorOne, gradiantColorTwo, 
                    colorPercentage, clusteringPercentage, 
                    offsetXSlider, offsetYSlider, transparentIconsCheckbox, transparentShapesCheckbox);
    regenerateButton.disabled = true;
    regenerateButton.innerHTML = "Generating...";
    Generate();
    regenerateButton.disabled = false;
    regenerateButton.innerHTML = "Regenerate";
});

document.getElementById('folderInput')!.addEventListener('change', (event) => {
    const input = event.target as HTMLInputElement;
    if (input.files) {
        svgFilePaths.length = 0; // Clear array
        const files = Array.from(input.files);
        const svgFiles = files.filter(file => file.name.endsWith('.svg'));
        svgFilePaths.push(...svgFiles.map(file => URL.createObjectURL(file)));
    }
});

// Helper function to update sliders after profile load
function updateSliders() {
    widthSlider.value = width.toString();
    heightSlider.value = height.toString();
    iconSizeSlider.value = icon_size.toString();
    marginSlider.value = margin.toString();
    iconColorPicker.value = icon_color;
    gradiantColorOne.value = background[0];
    gradiantColorTwo.value = background[1];
    colorPercentage.value = Math.pow(base_color_probability, (1 / 4)).toString();
    clusteringPercentage.value = Math.pow(neighbor_bonus, (1 / 6)).toString();
}
//!SECTION Event listeners -----

//SECTION Preset buttons -----
// Horizontal
p720h.addEventListener("click", () => {
    LoadProfile("720ph");
    updateSliders();
    Generate();
});

p1080h.addEventListener("click", () => {
    LoadProfile("1080ph");
    updateSliders();
    Generate();
});

p1440h.addEventListener("click", () => {
    LoadProfile("1440ph");
    updateSliders();
    Generate();
});

p2160h.addEventListener("click", () => {
    LoadProfile("4kh");
    updateSliders();
    Generate();
});

// Vertical
p720v.addEventListener("click", () => {
    LoadProfile("720pv");
    updateSliders();
    Generate();
});

p1080v.addEventListener("click", () => {
    LoadProfile("1080pv");
    updateSliders();
    Generate();
});

p1440v.addEventListener("click", () => {
    LoadProfile("1440pv");
    updateSliders();
    Generate();
});

p2160v.addEventListener("click", () => {
    LoadProfile("4kv");
    updateSliders();
    Generate();
});
//!SECTION Preset buttons -----

//SECTION Reset Sliders -----
widthSlider.addEventListener("dblclick", () => {
    widthSlider.value = "1920";
    widthValue.value = widthSlider.value;
});

heightSlider.addEventListener("dblclick", () => {
    heightSlider.value = "1080";
    heightValue.value = heightSlider.value;
});

iconSizeSlider.addEventListener("dblclick", () => {
    iconSizeSlider.value = "18";
    iconSizeValue.value = iconSizeSlider.value;
});

marginSlider.addEventListener("dblclick", () => {
    marginSlider.value = "18";
    marginValue.value = marginSlider.value;
});

offsetXSlider.addEventListener("dblclick", () => {
    offsetXSlider.value = "0";
    offsetXValue.value = offsetXSlider.value;
});

offsetYSlider.addEventListener("dblclick", () => {
    offsetYSlider.value = "0";
    offsetYValue.value = offsetYSlider.value;
});

colorPercentage.addEventListener("dblclick", () => {
    colorPercentage.value = "0.35";
    colorPercentageValue.value = colorPercentage.value;
});

clusteringPercentage.addEventListener("dblclick", () => {
    clusteringPercentage.value = "0.7";
    clusteringPercentageValue.value = clusteringPercentage.value;
});
//!SECTION Reset Sliders -----

//SECTION Update Sliders Text -----
widthSlider.addEventListener("input", () => {
    widthValue.value = widthSlider.value;
});

heightSlider.addEventListener("input", () => {
    heightValue.value = heightSlider.value;
});

iconSizeSlider.addEventListener("input", () => {
    iconSizeValue.value = iconSizeSlider.value;
});

marginSlider.addEventListener("input", () => {
    marginValue.value = marginSlider.value;
});

colorPercentage.addEventListener("input", () => {
    colorPercentageValue.value = colorPercentage.value;
});

clusteringPercentage.addEventListener("input", () => {
    clusteringPercentageValue.value = clusteringPercentage.value;
});

offsetXSlider.addEventListener("input", () => {
    offsetXValue.value = offsetXSlider.value;
});

offsetYSlider.addEventListener("input", () => {
    offsetYValue.value = offsetYSlider.value;
});
//!SECTION Update Sliders Text -----

//SECTION Update Sliders Position -----
widthValue.addEventListener("input", () => {
    widthSlider.value = widthValue.value;
});

heightValue.addEventListener("input", () => {
    heightSlider.value = heightValue.value;
});

iconSizeValue.addEventListener("input", () => {
    iconSizeSlider.value = iconSizeValue.value;
});

marginValue.addEventListener("input", () => {
    marginSlider.value = marginValue.value;
});

colorPercentageValue.addEventListener("input", () => {
    colorPercentage.value = colorPercentageValue.value;
});

clusteringPercentageValue.addEventListener("input", () => {
    clusteringPercentage.value = clusteringPercentageValue.value;
});

offsetXValue.addEventListener("input", () => {
    offsetXSlider.value = offsetXValue.value;
});

offsetYValue.addEventListener("input", () => {
    offsetYSlider.value = offsetYValue.value;
});
//!SECTION Update Sliders Position -----
