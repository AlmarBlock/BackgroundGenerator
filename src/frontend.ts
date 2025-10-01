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
    updateVariables,
    version
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
const saveSetting = document.getElementById("saveSetting") as HTMLButtonElement;
const loadSetting = document.getElementById("loadSetting") as HTMLButtonElement;
const regenerateButton = document.getElementById("regenerateButton") as HTMLButtonElement;

const loadIcons = document.getElementById("loadIcons") as HTMLButtonElement;

const applyPresetButton = document.getElementById("applyPresetButton") as HTMLButtonElement;
//!SECTION Buttons -----

//SECTION Dropdown -----
const presetsDropdown = document.getElementById("presetsDropdown") as HTMLSelectElement;
//!SECTION Dropdown -----

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

saveSetting.addEventListener("click", () => {
    const settings = {
        version: version,
        width: width,
        height: height,
        icon_color: icon_color,
        icon_size: icon_size,
        margin: margin,
        background: background,
        base_color_probability: base_color_probability,
        neighbor_bonus: neighbor_bonus
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "background_settings.json");
    dlAnchorElem.click();
});

loadSetting.addEventListener("click", () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = e => { 
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
            try {
                const settings = JSON.parse(e.target?.result as string);
                if (!settings.version || settings.version !== version) {
                    if (!confirm(`Settings file version (${settings.version}) does not match application version (${version}). Loading it may cause errors. Do you want to proceed?`)) {
                        return;
                    }

                }
                if (settings.width && settings.height && settings.icon_color && settings.icon_size && settings.margin && settings.background && settings.base_color_probability && settings.neighbor_bonus) {
                    widthSlider.value = settings.width;
                    heightSlider.value = settings.height;
                    iconColorPicker.value = settings.icon_color;
                    iconSizeSlider.value = settings.icon_size;
                    marginSlider.value = settings.margin;
                    gradiantColorOne.value = settings.background[0];
                    gradiantColorTwo.value = settings.background[1];
                    colorPercentage.value = Math.pow(settings.base_color_probability, (1 / 4)).toString();
                    clusteringPercentage.value = Math.pow(settings.neighbor_bonus, (1 / 6)).toString();
                    offsetXSlider.value = "0";
                    offsetYSlider.value = "0";
                    updateVariables(widthSlider, heightSlider, iconSizeSlider, marginSlider, 
                                    iconColorPicker, gradiantColorOne, gradiantColorTwo, 
                                    colorPercentage, clusteringPercentage, 
                                    offsetXSlider, offsetYSlider, transparentIconsCheckbox, transparentShapesCheckbox);
                    updateSliders();
                    updateSliderText();
                    Generate();
                    console.log("Settings loaded successfully.");
                } else {
                    alert("Invalid settings file.");
                }
            } catch {
                alert("Error reading settings file.");
            }
        };
        reader.readAsText(file);
    };
    input.click();
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

loadIcons.addEventListener("click", () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.svg,application/svg+xml';
    input.multiple = true;
    // @ts-ignore: webkitdirectory is not standard but supported by most browsers
    input.webkitdirectory = true;
    input.onchange = e => { 
        const files = (e.target as HTMLInputElement).files;
        if (!files) return;
        svgFilePaths.length = 0; // Clear array
        const fileArray = Array.from(files);
        const svgFiles = fileArray.filter(file => file.name.endsWith('.svg'));
        svgFilePaths.push(...svgFiles.map(file => URL.createObjectURL(file)));
    };
    input.click();
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

function updateSliderText() {
    widthValue.value = widthSlider.value;
    heightValue.value = heightSlider.value;
    iconSizeValue.value = iconSizeSlider.value;
    marginValue.value = marginSlider.value;
    colorPercentageValue.value = colorPercentage.value;
    clusteringPercentageValue.value = clusteringPercentage.value;
    offsetXValue.value = offsetXSlider.value;
    offsetYValue.value = offsetYSlider.value;
}

applyPresetButton.addEventListener("click", () => {
    LoadProfile(parseInt(presetsDropdown.value));
    updateSliders();
    updateSliderText();
    Generate();
});
//!SECTION Event listeners -----

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
