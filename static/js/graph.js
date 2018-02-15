if($(location)[0].pathname=='/stat'){
  queue()
   .defer(d3.json, "/stat/data")
   .await(makeGraphs);

  function makeGraphs(error, data) {
    var freqChart = dc.lineChart('#freq-by-year');
    var eventChart = dc.dataTable('#event-table');
    var selectField = dc.selectMenu('#attack-by-state');
    var selectField2 = dc.selectMenu('#attack-by-city');
    var selectField3 = dc.selectMenu('#attack-by-year');
    var stateChart = dc.pieChart('#amount-by-state');

    var dateFormat = d3.time.format("%Y");
    data.forEach(function (d) {
        d["year"] = dateFormat.parse(d["year"]+'');
    });
    
    var ndx = crossfilter(data);
    var all = ndx.groupAll();

    var yearDim = ndx.dimension(function (d) {
      return d.year;
    });
    var yearDim2 = ndx.dimension(function (d) {
      return new Date(d.year).getFullYear();
    });
    var cityDim = ndx.dimension(function (d) {
      return d.city;
    });

    var stateDim = ndx.dimension(function (d) {
      return d.state;
    });

    var stateDim2 = ndx.dimension(function (d) {
      return d.state;
    });

    var yearGroup = yearDim.group();
    var yearGroup2 = yearDim2.group();
    var cityGroup = cityDim.group();
    var stateGroup = stateDim.group();
    var stateGroup2 = stateDim.group();

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
      .yAxisLabel("Amount")
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
      .dimension(stateDim2)
      .group(stateGroup);

    selectField2
      .dimension(cityDim)
      .group(cityGroup);

    selectField3
      .dimension(yearDim2)
      .group(yearGroup2);

    stateChart
      .height(300)
      .dimension(stateDim2)
      .group(stateGroup2)
      .innerRadius(50)
      // .drawPaths(true);

    dc.renderAll();
    
    fix.winResize(dc.renderAll);
  }

  introJs().start();
}
