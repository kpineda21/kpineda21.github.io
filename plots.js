function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
      var firstSample = sampleNames[0];
      buildMetadata(firstSample);
      buildCharts(firstSample);
})}
  
init();

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    PANEL.append("h6").text(`Id: ${result.id}`);
    PANEL.append("h6").text(`Ethnicity: ${result.ethnicity}`);
    PANEL.append("h6").text(`Gender: ${result.gender}`);
    PANEL.append("h6").text(`Age: ${result.age}`);
    PANEL.append("h6").text(`Location: ${result.location}`);
    PANEL.append("h6").text(`bbtype: ${result.bbtype}`);
    PANEL.append("h6").text(`wfreq: ${result.wfreq}`);
  });
}

function buildCharts(sampleid) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sampleid);
    var result = resultArray[0];
  
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    var wfreq = result.wfreq;

    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: {t:0},
      hovermode: "closest",
      xaxis: {title:"OTU ID"},
      margin: {t:30}
    }

    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

    var barData = [ 
      {
        y: yticks,
        x: sample_values.slice(0,10).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: 'h'
      }
    ];

    var barLayout = {
      title: "Top Ten Bacteria Cultures Found",
      margin: {t:30, l:150}
    }

    Plotly.newPlot("bar", barData, barLayout)


    var data = [
        {
          domain: { x: [wfreq]},
          value: 9,
          title: { text: "Belly Button Washing Frequency" },
          type: "indicator",
          mode: "gauge+number",
          // delta: { reference: 380 },
          gauge: {
            axis: { range: [null, 9] },
            steps: [
              { range: [0, 1], color: "white" },
              { range: [1, 2], color: "ivory" },
              { range: [2, 3], color: "beige" },
              { range: [3, 4], color: "blanchedalmond" },
              { range: [4, 5], color: "linen" },
              { range: [5, 6], color: "lavenderblush" },
              { range: [6, 7], color: "linen" },
              { range: [7, 8], color: "mistyrose" },
              { range: [8, 9], color: "pink" }
            ],
            threshold: {
              thickness: 0.75,
              value: 9
            }
          }
        }
      ];

      var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
      Plotly.newPlot('mygauge', data, layout)

  });
}