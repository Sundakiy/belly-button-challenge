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
        var firsttrace = {
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
        var bubdata = [firsttrace];
        var bublayout = {title: "Bacteria Cultures Per Sample",
        xaxis: {title:"OTU ID"},
        // hovermode = otu_labels
            showlegend: false
        };

        Plotly.newPlot("bubble", bubdata, bublayout);

        //---------------------------------------------------------------//
        //---------------------------------------------------------------//
                         // BUilding a gauge chart//
        //---------------------------------------------------------------//
        // determine angle for each wfreq segment on the chart
          var angle = (4/ 9) * 180;
          // calculate end points for triangle pointer path
        var degrees = 180 - angle,
        radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Path: to create needle shape (triangle). Initial coordinates of two of the triangle corners plus the third calculated end tip that points to the appropriate segment on the gauge 
        // M aX aY L bX bY L cX cY Z
        var mainPath = 'M -.0 -0.005 L .0 0.025 L ',
            cX = String(x),
            cY = String(y),
            pathEnd = ' Z';
        var path = mainPath + cX + " " + cY + pathEnd;
        gaugeColors = ['rgb(8,29,88)', 'rgb(37,52,148)', 'rgb(34,94,168)', 'rgb(29,145,192)', 'rgb(65,182,196)', 'rgb(127,205,187)', 'rgb(199,233,180)', 'rgb(237,248,217)', 'rgb(255,255,217)', 'white']
        // create a trace to draw the circle where the needle is centered
        var traceNeedleCenter = {
            type: 'scatter',
            showlegend: false,
            x: [0],
            y: [0],
            marker: { size: 35, color: '850000' },
            name: wash,
            hoverinfo: 'name'
        };
        var gaugeData = [
            {type: "indicator",
              domain: { x: [0, 1], y: [0, 1] },
              value: wash,
              title: {text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week" },
              mode: "gauge+number",
              gauge: {
                axis: { range: [0, 9] },
                
                bar: { color: 'rgba(8,29,88,0)' },
                steps: [
                
                    { range: [0, 1], color: 'rgb(255,255,217)' },
                    { range: [1, 2], color: 'rgb(237,248,217)' },
                    { range: [2, 3], color: 'rgb(199,233,180)' },
                    { range: [3, 4], color: 'rgb(127,205,187)' },
                    { range: [4, 5], color: 'rgb(65,182,196)' },
                    { range: [5, 6], color: 'rgb(29,145,192)' },
                    { range: [6, 7], color: 'rgb(34,94,168)' },
                    { range: [7, 8], color: 'rgb(37,52,148)' },
                    { range: [8, 9], color: 'rgb(8,29,88)' }
                  ],
                threshold: {
                  line: { color: "black", width: 4 },
                  thickness: 1,
                  value: wash,
                //   traceNeedleCenter:traceNeedleCenter

                }
              }
            }
          ];
          
        var gaugedata=[gaugeData]; //,traceNeedleCenter];


          var guagelayout = { 
        // draw the needle pointer shape using path defined above
            shapes: [{
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: {
                    color: '850000'
          }
        }],
          width: 800, height: 450, margin: { t: 0, b: 0 },
          xaxis: {
                    zeroline: false,
                    showticklabels: false,
                    showgrid: false,
                    range: [-1, 1],
                    fixedrange: true // disable zoom
                }, 
            yaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-0.5, 1.5],
                fixedrange: true // disable zoom
            }
        };
          Plotly.newPlot('gauge', gaugeData, guagelayout);
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

