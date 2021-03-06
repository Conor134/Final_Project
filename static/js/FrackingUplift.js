var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart2")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("static/data/ProductionData.csv").then(function(coordData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    coordData.forEach(function(data) {
      data.XCoord = +data.SurfaceX;
      data.YCoord = +data.SurfaceY;
      data.wellname = +data.Name;
      data.Cumm = +data.CumOilBbl;
      data.FracUplift = +data.FracUpliftBbl_d
      console.log(data.FracUplift)
    });
    console.log(coordData)

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(coordData, d => d.XCoord)-250, d3.max(coordData, d => d.XCoord)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(coordData, d => d.YCoord) -250, d3.max(coordData, d => d.YCoord)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(coordData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.XCoord))
    .attr("cy", d => yLinearScale(d.YCoord))
    .attr("r", d => d.FracUplift*2)
    .attr("fill", "red")
    .attr("opacity", ".5");

    var circleLabels = chartGroup.selectAll().data(coordData).enter().append("text");
    circleLabels
      .attr("x", d =>  xLinearScale(d.XCoord))
      .attr("y",  d =>  yLinearScale(d.YCoord))
      
      .text(d => (d.abbr))
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("fill", "black");

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([0, 0])
      .html(function(d) {
        return (`${d.Name}<br>Frac Uplift: ${d.FracUplift}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Y Coordinates");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("X Coordinates");
  }).catch(function(error) {
    console.log(error);
  });
