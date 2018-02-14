
queue()
 .defer(d3.json, "/stat/data")
 .await(makeGraphs);

function makeGraphs(error, data) {
  var freqChart = dc.lineChart('#freq-by-year');
  var eventChart = dc.dataTable('#event-table');
  var selectField = dc.selectMenu('#attack-by-state');
  var selectField2 = dc.selectMenu('#attack-by-city');

  var dateFormat = d3.time.format("%Y");
  data.forEach(function (d) {
      d["year"] = dateFormat.parse(d["year"]+'');
  });
  
  var ndx = crossfilter(data);
  var all = ndx.groupAll();

  var yearDim = ndx.dimension(function (d) {
    return d.year;
  });

  var cityDim = ndx.dimension(function (d) {
    return d.city;
  });

  var stateDim = ndx.dimension(function (d) {
    return d.state;
  });

  var yearGroup = yearDim.group();
  var cityGroup = cityDim.group();
  var stateGroup = stateDim.group();

  var minYear = yearDim.bottom(1)[0]["year"];
  var maxYear = yearDim.top(1)[0]["year"];

  freqChart
    .ordinalColors(['blue'])
    // .width(700)
    .height(300)
    .margins({top: 30, right: 50, bottom: 30, left: 50})
    .dimension(yearDim)
    .group(yearGroup)
    .renderArea(true)
    .transitionDuration(500)
    .x(d3.time.scale().domain([minYear, maxYear]))
    .elasticY(true)
    .xAxisLabel("Year")
    .yAxis().ticks(6);

  eventChart
    .dimension(yearDim)
    .group(function(d){
      return new Date(d.year).getFullYear();
    })
    .columns([
      "city",
      "state",
      "summary"
    ]);

  selectField
    .dimension(stateDim)
    .group(stateGroup);

  selectField2
    .dimension(cityDim)
    .group(cityGroup);

  dc.renderAll();

  $(window).resize(function(){
    var loop;
    clearTimeout(loop);
    loop=setTimeout(function(){
      dc.renderAll();
    },500);
  });
}

introJs().start();