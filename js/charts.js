function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sampleID) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
  let samples = data.samples


  // let currentSample = {}
  // for (let i = 0; i < samples.length; i++) {
  // if  (samples[i].id = sampleID) {
   //  currentSample = samples[i]
  // }
 //  }

    // 4. Create a variable that filters the samples for the object with the desired sample number.
  var filtered = samples.filter(function(sample){
    return (sample.id == sampleID)
  });

 // console.log(filtered);
    //  5. Create a variable that holds the first sample in the array.
let firstsample = filtered[0]

// console.log(firstsample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
let otu_ids = firstsample.otu_ids
let otu_labels = firstsample.otu_labels
let sample_values = firstsample.sample_values

// console.log(otu_ids)
// console.log(otu_labels)
// console.log(sample_values)
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.map(function(otu_id){
      return 'OTU' + ' ' + otu_id;
  }).slice(0,10).reverse()

//yticks = yticks.slice(0,10);

// yticks.reverse();

console.log(yticks);

    // 8. Create the trace for the bar chart. 

    var xticks = sample_values.slice(0,10).reverse()

    var barData = [
      { x: xticks,
        y: yticks,
        type: "bar",
        orientation: "h",
        text: otu_labels
      }
      
    ];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

      // 1. Create the trace for the bubble chart.
      var bubbleData = [
        { x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: 'markers',
          marker: {
            color: otu_ids,
            size: sample_values
          }
        }
   
      ];
  
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis: {title: "OTU ID"}
      };
  
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);


      // DELIVERABLE 3 

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
  let metadata = data.metadata

  var metafiltered = metadata.filter(function(sample){
    return (sample.id == sampleID)
  });
    // 2. Create a variable that holds the first sample in the metadata array.
  let firstmeta = metafiltered[0]


    // 3. Create a variable that holds the washing frequency.

    let washingfreq = parseFloat(firstmeta.wfreq)

    // console.log(washingfreq);
         
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washingfreq,
        title: { text: "<b>Belly Button Washing Frequency</b> </br><span style='font-size:0.8em;'>Scrubs per Week</span><br>" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {
            range: [null, 10],
            tickmode: "array",
            tickvals: [2,4,6,8,10],
          },
          bar: {color: "black"},
          steps: [
            {range: [0,2], color: "red"},
            {range: [2,4], color: "orange"},
            {range: [4,6], color: "yellow"},
            {range: [6,8], color: "limegreen"},
            {range: [8,10], color: "green"},
          ]
        }
      }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 600, height: 500, margin: { t: 0, b: 0 }
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
