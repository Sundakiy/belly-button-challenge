// json url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// initialize function to pull ID numbers
function init() {
    var dropDown = d3.select("#selDataset");
    // retrieve JSON data
    d3.json(url).then(function (data) {
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            dropDown.append("option").text(sample).property("value", sample)
        });
        var initSample = sampleNames[0];
        buildDemo(initSample);
        buildCharts(initSample);
    });
};

//----------------------------------------------------//
//---------------------------------------------------//
        //Building a function to create charts// 
//Deliverable 1
//---------------------------------------------------//
function buildCharts(sample) {
    d3.json(url).then(function (data) {
        // variables for charts
        var samplesComplete = data.samples;
        var sampleInfo = samplesComplete.filter(row => row.id == sample);
        var sampleValues = sampleInfo[0].sample_values;
        var sampleValuesSlice = sampleValues.slice(0,10).reverse();
        var otuIds = sampleInfo[0].otu_ids;
        var otuIdsSlice = otuIds.slice(0,10).reverse();
        var otuLabels = sampleInfo[0].otu_labels;
        var otuLabelsSlice = otuLabels.slice(0,10).reverse();
        var metaData = data.metadata;
        var metaDataSample = metaData.filter(row => row.id == sample);
        var wash = metaDataSample[0].wfreq;

    //----------------------------------------------//
    //----------------------------------------------//
                // Building a bar chart//
    //----------------------------------------------//
        var trace1 = {
            x: sampleValuesSlice,
            y: otuIdsSlice.map(item => `OTU ${item}`),
            type: "bar",
            orientation: "h",
            text: otuLabelsSlice,
        };
        var data = [trace1];
        Plotly.newPlot("bar", data)

    //---------------------------------------------------------//
    //----------------------------------------------------------//
                // Building  a bubble chart//
        var trace2 = {
            x: otuIds,
            y: sampleValues,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale: "Earth"
            },
            text: otuIds
        };
        var data2 = [trace2];
        var bublayout = {title: "Bacteria Cultures Per Sample",
        xaxis: {title:"OTU ID"},
        // hovermode = otu_labels
            showlegend: false
        };

        Plotly.newPlot("bubble", data2, bublayout);

        //---------------------------------------------------------------//
        //---------------------------------------------------------------//
                         // BUilding a gauge chart//
        //---------------------------------------------------------------//
        var data3 = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: wash,
              title: {text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week" },
              type: "indicator",
              mode: "gauge+number",
              gauge: {
                axis: { range: [null, 9] },
                bar: { color: "red" },
                steps: [
                
                { range: [1, 2], color: "orange" },
                { range: [2, 3], color: "yellow" },
                { range: [3, 4], color: "beige" },
                { range: [4, 5], color: "lightyellow" },
                { range: [5, 6], color: "powderblue" },
                { range: [6, 7], color: "lightskyblue" },
                { range: [7, 8], color: "lightgreen" },
                { range: [8, 9], color: "green" }
                ],
                threshold: {
                  line: { color: "black", width: 4 },
                  thickness: 0.75,
                  value: wash
                }
              }
            }
          ];
          
          var guagelayout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
          Plotly.newPlot('gauge', data3, guagelayout);
    });
};

//--------------------------------------------------------------//
//--------------------------------------------------------------//
      // Building a demographic metadata //
//-------------------------------------------------------------//
function buildDemo(sample) {
    var demo = d3.select("#sample-metadata");
    d3.json(url).then(function (data) {
        var metaData = data.metadata;
        var metaDataSample = metaData.filter(row => row.id == sample);
        demo.selectAll("p").remove();
        metaDataSample.forEach((row) => {
            for (const [key, value] of Object.entries(row)) {
                demo.append("p").text(`${key}: ${value}`);
            };
        });
    });
};

// 
function optionChanged(sample) {
    buildDemo(sample);
    buildCharts(sample);
};

// call initialize function to run
init();

