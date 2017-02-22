/*
References:

1. To understand D3
https://www.youtube.com/watch?v=8jvoTV54nXw

2. bar chart examples
https://github.com/d3/d3/wiki/Tutorials
https://bl.ocks.org/d3noob/bdf28027e0ce70bd132edc64f1dd7ea4

3. For Aggregation
http://www.d3noob.org/2014/02/grouping-and-summing-data-using-d3nest.html

4. v3 to v4
http://denvycom.com/blog/d3-js-version-4-x-examples-and-changes-from-version-3-x/
*/

var svg;
//DEFINE YOUR VARIABLES UP HERE
var margin = {top: 30, right: 90, bottom: 30, left: 90};
var width = 500 - margin.left - margin.right;
var height = 250 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand().range([0, width]).padding(0.2);
var y = d3.scaleLinear().range([height, 0]);
// Category10 scale is created with a range of 10 colors, and an empty domain.
var colourScale = d3.scaleOrdinal(d3.schemeCategory10);
	
var xColumn;
var yColumn;


//Gets called when the page is loaded.
function init(){
	//PUT YOUR INIT CODE BELOW
	//console.log("Im in updateClicked()");
	// append the svg object to the div 
	// append a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	svg = d3.select('#vis').append("svg")
		.attr("width", 500)
		.attr("height", 250)
	  .append("g")
		.attr("transform", "translate(35," + margin.top + ")");

	
	colourScale.range(["#1f77b4","#ff7f0e","#2ca02c","#d62728"]);
}

//Called when the update button is clicked
function updateClicked(){
	//console.log("Im in updateClicked()");
	xColumn = getXSelectedOption();
	yColumn = getYSelectedOption();
	//console.log(xColumn);
	//console.log(yColumn);
	d3.csv("data/CoffeeData.csv",update);
  
}

//Callback for when data is loaded
function update(csv_data){
	//PUT YOUR UPDATE CODE BELOW
	svg.selectAll("*").remove();
	//data aggregation
	var data = d3.nest()
				.key(function(d) { return d[xColumn];})
				.rollup(function(d) { 
					return d3.sum(d, function(g) {
						return g[yColumn]; 
					});
				}).entries(csv_data);
			data.forEach(function (d){
				d[xColumn]=d.key;
				d[yColumn]=d.value;
				console.log(d.key + ", " + d.value);
	});
  
	// format the data
	data.forEach(function(d) {
					d[yColumn] = +d[yColumn];
	});

	// Scale the range of the data in the domains
	x.domain(data.map(function(d) { return d[xColumn]; }));
	y.domain([0, d3.max(data, function(d) { return d[yColumn]; })]);
		
	// append the rectangles for the bar chart
	// Bind data
	svg.selectAll("rect").data(data)
		.enter().append("rect")
			.attr("width", x.bandwidth())
			.attr("x", function(d) { return x(d[xColumn]); }) 
			.attr("y", function(d) { return y(d[yColumn]); })
			.attr("height", function(d) { return height - y(d[yColumn]); })
			.attr("fill",   function(d){ return colourScale(d[xColumn]); });
	
	// x Axis
	svg.append("g").attr("transform", "translate(0,"+height+")").call(d3.axisBottom(x)).style("font-size","15px").style("font-family","Times New Roman");

	// y Axis
	svg.append("g").attr("transform", "translate("+width+",0)").call(d3.axisRight(y).ticks(5)).style("font-size","15px").style("font-family","Times New Roman");
		
	//Exit
	//selects the remnants and removes the remnants.
	svg.exit().remove();

}

// Returns the selected option in the X-axis dropdown. Use d[getXSelectedOption()] to retrieve value instead of d.getXSelectedOption()
function getXSelectedOption(){
	var node = d3.select('#xdropdown').node();
	var i = node.selectedIndex;
	return node[i].value;
}

// Returns the selected option in the Y-axis dropdown. 
function getYSelectedOption(){
	var node = d3.select('#ydropdown').node();
	var i = node.selectedIndex;
	return node[i].value;
}
