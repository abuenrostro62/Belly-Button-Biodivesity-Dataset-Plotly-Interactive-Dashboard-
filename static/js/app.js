function buildMetadata(sample) {
    // Use `d3.json` to fetch the data
    d3.json("static/js/samples.json").then(function (data) {
        var metaData = data.metadata;
        var newArray = metaData.filter(object => object.id == sample);
        var result = newArray[0];
        var sample_metadata = d3.select("#sample-metadata");
        // Use `.html("") to clear any existing metadata
        sample_metadata.html("");

        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        Object.entries(result).forEach(([key, value]) => {
            sample_metadata.append("p").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

function buildCharts(chart) {
    d3.json("static/js/samples.json").then(function (data) {
        //create chart variables    
        var chartSample = data.samples;
        var newArray = chartSample.filter(object => object.id === chart);
        var result = newArray[0];

        // Create chart value variables
        var sampleValues = result.sample_values;
        var otuID = result.otu_ids;
        var otuLabel = result.otu_labels;
        
        // Create the Trace
        var barData = [{
            x: sampleValues.slice(0, 10).reverse(),
            y: otuID.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
            text: otuLabel.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        }];

        var barLayout = {
            title: "OTU Sample Values",
            margin: {
                l: 75,
                r: 50,
                b: 50,
                t: 50,
                pad: 4
            },
            yaxis: { automargin: true },
            width: 750,
            height: 390
        }
        Plotly.newPlot('bar',barData,barLayout);


        // Create the Trace
        var trace_bubbles = [{
            x: otuID,
            y: sampleValues,
            text: otuLabel,
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: otuID,
                colorscale: "Earth"
            }
        }];

        var bubbleLayout = {
            xaxis: { title: "OTU ID" },
            yaxis: {automargin: true},
            hovermode: "closest",
            title: "Belly Button Bacteria"
        };
        Plotly.newPlot('bubble', trace_bubbles, bubbleLayout);
    });
}


function init() {
    // Grab a reference to the dropdown select element 
    var selector = d3.select("#selDataset");

    d3.json("static/js/samples.json").then((data) => {
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
};

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}
// Initialize the dashboard
init();