//Generally, anonymous functions run thru each element separately, like rects
//some data
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
//the y_scale
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

// Create text labels representing the data
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

//Events: updating the chart
d3.select('.update').on('click', function(d) {
  //this reverses the data
  //console.log('data: ' + data);
  //data.reverse();
  //console.log('data reversed: ' + data);

  //update single data point
  data[0] = 50; //this breaks the domain as its now the largest datapoint

  //Thus, apply domain function again and all bars reshape
  y_scale.domain([0, d3.max(data)]);

  //no data is in the waiting room, so no enter()
  //Value changes, so only rect heights are affected (bars)
  svg
    .selectAll('rect')
    .data(data)
    .transition() //smooth animation, ORDER MATTERS
    //delay each element by 100ms more than the previous one as index increases
    .delay(function(d, i) {
      return i / data.length * 1000; //cap time for large data important
    })
    .duration(1000)
    .ease(d3.easeCubicInOut)
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
    .transition() //smooth animation, ORDER MATTERS
    //delay each element by 100ms more than the previous one as index increases
    .delay(function(d, i) {
      return i / data.length * 1000;
    })
    .duration(1000)
    .ease(d3.easeCubicInOut)
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

//Events: Add data to chart_width
d3.select('.add').on('click', function() {
  //create a new datapoint
  var new_number = Math.floor(Math.random() * d3.max(data));
  data.push(new_number);

  //update scales
  x_scale.domain(d3.range(data.length));
  y_scale.domain([
    0,
    d3.max(data, function(d) {
      return d;
    })
  ]);
  //select bars
  var bars = svg.selectAll('rect').data(data);

  //update all bars
  bars
    .enter()
    .append('rect')
    .attr('x', function(d, i) {
      return x_scale(i);
    })
    .attr('y', chart_height)
    .attr('width', x_scale.bandwidth())
    .attr('height', 0)
    .attr('fill', '#7ed26d')
    //new bars has been created and now has to be added to svg
    //combine to selections with merge as last element is separated initially
    //as we want to apply everything all at once
    .merge(bars)
    .transition()
    .duration(1000)
    //add positions to the new bar
    .attr('x', function(d, i) {
      return x_scale(i);
    })
    .attr('y', function(d) {
      return chart_height - y_scale(d);
    })
    .attr('width', x_scale.bandwidth())
    .attr('height', function(d) {
      return y_scale(d);
    });

  //add the Labels
  var labels = d3.selectAll('text').data(data);

  labels
    .enter()
    .append('text')
    .text(function(d) {
      return d;
    })
    .attr('x', function(d, i) {
      return x_scale(i) + x_scale.bandwidth() / 2;
    })
    .attr('y', chart_height)
    .attr('font-size', '14px')
    .attr('fill', '#fff')
    .attr('text-anchor', 'middle')
    .merge(labels)
    .transition()
    .duration(500)
    .attr('text-anchor', 'start')
    .attr('x', function(d, i) {
      return x_scale(i) + x_scale.bandwidth() / 2;
    })
    .attr('y', function(d) {
      return chart_height - y_scale(d) + 15;
    });
});
