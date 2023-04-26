// let draw;

// function init() {
//     // draw = SVG().addTo("#graphicsOutput").size(1200, 1200);
// }

function init() {
    document.getElementById("userInputSamples").value = "start, 0.0\ntest, 0.1\nhejsa, 0.5\nend, 1.0";
    
    // Add event listeners
    document.getElementById("userInputWidth").addEventListener("input", makeChromagram);
    document.getElementById("userInputHeight").addEventListener("input", makeChromagram);
    document.getElementById("userInputStartLine").addEventListener("input", makeChromagram);
    document.getElementById("userInputSolventFront").addEventListener("input", makeChromagram);
    document.getElementById("userInputSamples").addEventListener("input", makeChromagram);
    document.getElementById("userInputLabelSize").addEventListener("input", makeChromagram);
    document.getElementById("userInputLabelRotation").addEventListener("input", makeChromagram);
    document.getElementById("userInputLabelDistance").addEventListener("input", makeChromagram);
    document.getElementById("userInputPhaseColor").addEventListener("input", makeChromagram);
    document.getElementById("userInputBorderWidth").addEventListener("input", makeChromagram);
    document.getElementById("userInputBorderColor").addEventListener("input", makeChromagram);
    document.getElementById("userInputSampleTypeDot").addEventListener("input", makeChromagram);
    document.getElementById("userInputSampleTypeLine").addEventListener("input", makeChromagram);
    // sampleType
    document.getElementById("userInputSampleSize").addEventListener("input", makeChromagram);
    document.getElementById("userInputSampleColor").addEventListener("input", makeChromagram);
    makeChromagram();

    document.getElementById("userInputDownloadAsSvg").addEventListener("click", exportChromagram)
}

function makeChromagram() {
    document.getElementById("graphicsOutput").replaceChildren();
    let chromagram = drawChromagram();
    SVG().add(chromagram).size(1200, 1200).addTo("#graphicsOutput");
}

function exportChromagram() {
    download("export.svg", SVG().add(drawChromagram()).svg())
}

function drawChromagram() {
    let width = parseFloat(document.getElementById("userInputWidth").value);
    let height = parseFloat(document.getElementById("userInputHeight").value);
    let startLine = parseFloat(document.getElementById("userInputStartLine").value);
    let solventFront = parseFloat(document.getElementById("userInputSolventFront").value);
    let samples = getSamples();
    let labelSize = parseFloat(document.getElementById("userInputLabelSize").value)
    let labelRotation = parseFloat(document.getElementById("userInputLabelRotation").value);
    let labelDistance = parseFloat(document.getElementById("userInputLabelDistance").value);
    let stationaryPhaseColor = document.getElementById("userInputPhaseColor").value;
    let borderWidth = parseFloat(document.getElementById("userInputBorderWidth").value);
    let borderColor = document.getElementById("userInputBorderColor").value;
    let sampleType = document.querySelector("input[name='sampleType']:checked").value;
    let sampleSize = parseFloat(document.getElementById("userInputSampleSize").value); 
    let sampleColor = document.getElementById("userInputSampleColor").value;
    
    let draw = SVG().group();
    draw.rect(width, height).stroke({color: borderColor, width: borderWidth}).fill(stationaryPhaseColor).move(0, 0);
    
    let yPositioningInterval = height - startLine - solventFront;
    
    // Draw start point dash
    draw.line(0, 0, width - borderWidth, 0).stroke({color: "#757575", width: 8, dasharray: "10, 10"}).cy(height - startLine).x(borderWidth / 2);
    // Draw solvent front dash
    draw.line(0, 0, width - borderWidth, 0).stroke({color: "#757575", width: 8, dasharray: "10, 10"}).cy(height - startLine - yPositioningInterval).x(borderWidth / 2);
    
    for(let i = 0; i < samples.length; i++) {
        let spaceBetween = width / (samples.length + 1);
        let x = spaceBetween + spaceBetween * i;
        
        // Draw dot of sample
        let y = height - startLine - yPositioningInterval * samples[i]["Rf"];
        if (sampleType == "dot") {
            draw.circle(sampleSize).fill(sampleColor).center(x, y);
        }
        else if (sampleType == "line") {
            draw.line(0, 0, sampleSize, 0).stroke({color: sampleColor, width: 8}).center(x, y);
        }
        
        // Draw label
        y = height + labelDistance;
        draw.text(samples[i]["label"]).cx(x).y(y).rotate(labelRotation).font({
            family: "Arial",
            size: labelSize
        });
    }

    // Offset rectangle such that everything is displayed. This will mean that all other components will have to get moved too
    draw.transform({translate: [borderWidth / 2, borderWidth / 2]});
    
    return draw; 
}

function getSamples() {
    input = document.getElementById("userInputSamples").value;
    // each line holds a sample
    rawSamples = input.split("\n");
    
    samples = [];
    for(let i = 0; i < rawSamples.length; i++) {
        entries = rawSamples[i].split(", ");
        samples.push({
            "label": entries[0],
            "Rf": parseFloat(entries[1])
        })
    }
    
    return samples;
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}