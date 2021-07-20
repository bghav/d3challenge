var width = parseInt(d3.select("#scatter").style("width"));

var height = width-width/3.9;

var margin =20;

var labelArea = 110;

var tPadBot = 40;
var tPadLeft = 40;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart")

var circRadius;

function crGet() {
  if(width <= 530) {
    circRadius = 5;
  }
  else {
    circRadius = 10;
  }
}
crGet();

svg.append("g").attr("class", "xText");
var xText = d3.select(".xText");

var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea)/ 2 - labelArea;

function xTextRefresh() {
}
xTextRefresh();

xText
  .append("text")
  .attr("x", -26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("Poverty (%)");

/*xText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "age")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  //.text("Age (Median)");

xText
  .append("text")
  .attr("x", 26)
  .attr("data-name", "income")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  //.text("Household Income (Median)");*/

svg.append("g").attr("class", "yText");
var yText = d3.select(".yText");
 
function yTextRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + "," + leftTextY + ")rotate(-90)"
  );
}
yTextRefresh();

yText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obese (%)");

/*yText
  .append("text")
  .attr("x", 0)
  .attr("data-name", "smokes")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  //.text("Smokes (%)");

yText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  //.text("Lacks Healthcare (%)");*/

d3.csv("assets/data/data.csv").then(function(data) {
  visualize(data);
});

function visualize(theData) {

  var curX = "poverty";
  var curY = "obesity";

var xMin;
var xMax;
var yMin;
var yMax;

var toolTip = d3
  .tip()
  .attr("class", "d3-tip")
  .offset([40, -60])
  .html(function(d) {

    var theX;
    
    var theState = "<div>" + d.state + "</div>";
    
    var theY = "<div>" + curY + ": " +d[curY] + "</div>";

    if (curX === "poverty") {
      theX = "<div>"+ curX + ": " +d[curX] + "</div>";
    }
    else {

    theX = "<div>" +
    curX +
    ": " +
    parseFloat(d[curX]).toLocaleString("en") +
    "</div>";
}
    return theState + theX + theY;
});

svg.call(toolTip);

function xMinMax() {

xMin = d3.min(theData, function(d) {
 return parseFloat(d[curX]) * 0.90;
});

xMax = d3.max(theData, function(d) {
 return parseFloat(d[curX]) * 1.10;
});
}

function yMinMax() {

  yMin = d3.min(theData, function(d) {
   return parseFloat(d[curY]) * 0.90;
  });
  
  yMax = d3.max(theData, function(d) {
   return parseFloat(d[curY]) * 1.10;
  });
  }

function labelChange(axis, clickedText) {

  d3
    .selectAll(".aText")
    .filter("," + axis)
    .filter(".active")
    .classed("active", false)
    .classed("inactive", true);

  clickedText.classed("inactive", false).classed("inactive", true);
}

xMinMax();
yMinMax();

var xScale = d3
  .scaleLinear()
  .domain([xMin, xMax])
  .range([margin + labelArea, width - margin]);

var yScale = d3
  .scaleLinear()
  .domain([yMin, yMax])
  .range([height - margin - labelArea, margin]);

var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);

function tickCount() {
  if (width <= 500) {
    xAxis.ticks(5);
    yAxis.ticks(5);
  }
else {
  xAxis.ticks(10);
  yAxis.ticks(10);
}
}
tickCount();

svg
  .append("g")
  .call(xAxis)
  .attr("class", "xAxis")
  .attr("transform", "translate(0," +(height- margin - labelArea) + ")");
svg
  .append("g")
  .call(yAxis)
  .attr("class", "yAxis")
  .attr("transform", "translate(" +(margin + labelArea) + ",0)");

var theCircles = svg.selectAll("g theCircles").data(theData).enter();
console.log(theCircles);
theCircles
  .append("circle")
  .attr("cx", function(d) {
    return xScale(d[curX]);
  })
  .attr("cy", function(d){
    return yScale(d[curY]);
  })
  .attr("r", circRadius)
  .attr("class", function(d) {
    return "stateCircle" + d.abbr;
  })
  .on("mouseover", function(d) {
    toolTip.show(d, this);
    d3.select(this).style("stroke" , "#323232");
  })
  .on("mouseout", function(d) {
    toolTip.hide(d);
    d3.select(this).style("stroke" , "#323232"); 
});
var theCircles= svg.selectAll("g theCircles").data(theData).enter();
theCircles
//.attr(function(d) {
  //return d.abbr;
//})
.attr("dx", function(d){
  return xScale(d[curX]);
})
.attr("dy", function(d) {
  return yScale(d[curY]) + circRadius/ 2.5;
})
.attr("font-size", circRadius) 
.attr("class", "stateText")
.on("mouseover", function(d) {
  toolTip.show(d,this);
  d3.select("." + d.abbr).style("stroke", "#e3e3e3")
})
.on("mouseout", function(d) {
toolTip.hide(d);
d3.select("." + d.abbr).style("stroke", "#e3e3e3")
})
};

var circleText= svg.selectAll("null").data(theData).enter();
circleText
/*.append("text")
.attr(height="30") 
.attr(width="200")
.attr(x ="0")
.attr(y="15") 
.attr(fill="red")
.attr("I love SVG!")*/

/*.attr("x", function(d) {
  return xLinearScale(d.poverty);
})
.attr("y", function(d) {
  return yLinearScale(d.obesity);
})
.text(function(d) {
  return d.abbr;
})
.attr("font-family", "sans-serif")
.attr("font-size", "10px")
.attr("text-anchor", "middle")
.attr("fill", "white"); 
}*/
