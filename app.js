var data = [6, 20, 21, 14, 2, 30, 7, 16, 25, 5, 11, 28, 10, 26, 9];

// Create SVG Element
var chart_width = 800;
var chart_height = 400;
var bar_padding = 5;
var svg = d3
  .select('#chart')
  .append('svg')
  .attr('width', chart_width)
  .attr('height', chart_height);

//Create scales
//800/15 = 53.33
// this results in a scale of: 0, 53.33, 106.66 etc
var x_scale = d3
  .scaleBand()
  .domain(d3.range(data.length))
  .rangeRound([0, chart_width])
  .paddingInner(0.05);

var y_scale = d3
  .scaleLinear()
  .domain([0, d3.max(data)]) //ranges from 0 to the max vaklue of the data
  .rangeRound([0, chart_height]);

// Bind Data and create bars
svg
  .selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .attr('x', function(d, i) {
    return x_scale(i);
  })
  .attr('y', function(d) {
    return chart_height - y_scale(d);
  })
  //apply the scale here
  .attr('width', x_scale.bandwidth())
  .attr('height', function(d) {
    return y_scale(d);
  })
  .attr('fill', '#7ED26D');

// Create Labels
svg
  .selectAll('text')
  .data(data)
  .enter()
  .append('text')
  .text(function(d) {
    return d;
  })
  .attr('x', function(d, i) {
    return x_scale(i) + x_scale.bandwidth() / 2;
  })
  .attr('y', function(d) {
    return chart_height - y_scale(d) + 16;
  })
  .attr('font-size', 14)
  .attr('fill', '#fff')
  .attr('text-anchor', 'middle');

//Events updating the chart
d3.select('button').on('click', function(d) {
  //this reverses the data
  console.log('data: ' + data);
  data.reverse();
  console.log('data reversed: ' + data);
  //no data is in the waiting room, so no enter()
  //Value changes, so only rect heights are affected (bars)
  svg
    .selectAll('rect')
    .data(data)
    .attr('y', function(d) {
      return chart_height - y_scale(d);
    })
    .attr('height', function(d) {
      return y_scale(d);
    });
  //the text label pos have to be adopted as well
  // update Labels
  svg
    .selectAll('text')
    .data(data)
    //.enter()
    //.append('text')
    .text(function(d) {
      return d;
    })
    .attr('x', function(d, i) {
      return x_scale(i) + x_scale.bandwidth() / 2;
    })
    .attr('y', function(d) {
      return chart_height - y_scale(d) + 16;
    })
    .attr('font-size', 14)
    .attr('fill', '#fff')
    .attr('text-anchor', 'middle');
});
