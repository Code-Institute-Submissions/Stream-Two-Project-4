
if($(location)[0].pathname=='/stat'){
  queue()
   .defer(d3.json, "/stat/data")
   .await(makeGraphs);

  var size;
  function makeGraphs(error, data) {
    var dataSize;
    var offset = 0;
    var page = 10;
    var yearFreqChart = dc.lineChart('#freq-by-year');

    var cityFreqChart = dc.barChart('#freq-by-city');


    var eventChart = dc.dataTable('#event-table');
    var selectField = dc.selectMenu('#attack-by-state');
    var selectField2 = dc.selectMenu('#attack-by-city');
    var selectField3 = dc.selectMenu('#attack-by-year');
    var stateChart = dc.pieChart('#amount-by-state');
    var attackNumber = dc.numberDisplay('#attack-number');

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
    var cityDim = ndx.dimension(function (d,i,l) {
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

    // console.log(cityDim.bottom(1))
    var minYear = yearDim.bottom(1)[0]["year"];
    var maxYear = yearDim.top(1)[0]["year"];
    var minCity = cityDim.bottom(1)[0]["city"];
    var maxCity = cityDim.bottom(4)[0]["city"];


    attackNumber
    .group(all)
    .formatNumber(d3.format(""))
    .valueAccessor(function(d) {
      console.log(d)
      dataSize = d;
      offset= 0;
      chartUpdate();
      return d
     })
    .html({
      one:"<span>%number</span> Attack",
      some:"<span>%number</span> Attacks",
      none:"<span>0</span> Attacks"
    })

    yearFreqChart
    .ordinalColors(['blue'])
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

    cityFreqChart
    .width(function (element) {
     return cityGroup.size() * 15
    })
    .height(300)
    .dimension(cityDim)
    // .gap(1)
    .group(cityGroup)
    .ordering(dc.pluck('key'))
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .renderHorizontalGridLines(true)
    .margins({top: 10, right: 0, bottom: 110, left: 30})
    .brushOn(true)
    .centerBar(true)
    .elasticY(true)
    .xAxisLabel("City")
    .yAxisLabel("Amount")
    .on("postRender", function(c) {
      fixChartLabels(c);
      c.svg().selectAll("rect.bar")
      $(window).resize(function(){
        $('#chartscroll').val(0)
      })
      
    });

    function fixChartLabels(chart) {
      $('#freq-by-city .axis text')
      .css('fill','white')

      $('#freq-by-city .axis.x text')
      .css('pointer-events','all')
      .css('cursor','pointer')
    
      chart.svg().selectAll('.axis.x text')
      .on("click",function(d) { 
        chart.filter(d);  
        dc.redrawAll();
      })
      .style("text-anchor", "end" )      
      .attr("dx", function(d) { return "-0.6em"; })
      .attr("dy", function(d) { return "0"; })
      .attr("transform", function(d) { return "rotate(-90, -4, 9) "; })
      .attr("transform", function(d) { return "rotate(-90, -4, 9) "; });
    }

    eventChart
    .dimension(cityDim)
    .group(function(d){
      return '';
    })
    .size(Infinity)
    .columns([
      "city",
      "state",
      "summary"
    ]);

    function pagerInfo() {
      d3.select('#begin')
          .text(offset+1);
      if(offset+page-1 > dataSize){
        d3.select('#end')
          .text(dataSize);
      }
      else{
        d3.select('#end')
          .text(offset+page);
      }
      d3.select('#info-prev')
          .attr('disabled', offset-page<0 ? 'true' : null);
      d3.select('#info-next')
          .attr('disabled', offset+page>=dataSize ? 'true' : null);
      d3.select('#size').text(dataSize);
      console.log(dataSize)
    }
    function chartUpdate() {
      eventChart.beginSlice(offset);
      eventChart.endSlice(offset+page);
      pagerInfo();
      eventChart.redraw();
    }
    function nextPage() {
        offset += page;
        chartUpdate();
    }
    function prevPage() {
        offset -= page;
        chartUpdate();
    }
    $('#info-next').click(nextPage)
    $('#info-prev').click(prevPage)

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
    // .drawPaths(true);
    .dimension(stateDim2)
    .group(stateGroup2)
    .innerRadius(50)

    chartUpdate();
    dc.renderAll();
    
    fix.winResize(dc.renderAll);
  }
  introJs().start();

  $(function() {
    var loop = setInterval(function (e) {
      if((typeof $('#freq-by-city g.axis.x').width()) == 'number'){
        clearInterval(loop);

        var x = $('#freq-by-city g.axis.x');
        var num = x.attr('transform')
          .split('(')[1]
          .split(')')[0]
          .split(',');
        num[1] = num[1].trim();

        var x1 = $('#freq-by-city g.chart-body');
        var num1 = x1.attr('transform')
          .split('(')[1]
          .split(')')[0]
          .split(',');
        num1[1] = num1[1].trim();

        $('#chartscroll')
        .mousemove(function(e){
          changer($('#freq-by-city g.axis.x'),$('#chartscroll').val(),num)
          changer($('#freq-by-city g.chart-body'),$('#chartscroll').val(),num1)
        })
        .change(function(e){
          changer($('#freq-by-city g.axis.x'),$('#chartscroll').val(),num)
          changer($('#freq-by-city g.chart-body'),$('#chartscroll').val(),num1)
        })
        .focus(function(e){
          changer($('#freq-by-city g.axis.x'),$('#chartscroll').val(),num)
          changer($('#freq-by-city g.chart-body'),$('#chartscroll').val(),num1)
        });
        //city chart pager buttons for mobile
        var inc = 0; 
        $('#btn-prev').click(function(e){
          e.preventDefault();
          inc--;
          if(inc >= 0){
            changer($('#freq-by-city g.axis.x'),inc,num)
            changer($('#freq-by-city g.chart-body'),inc,num1)
          }
          else{
            inc = 0;
          }
          console.log(inc)
        })
        $('#btn-next').click(function(e){
          e.preventDefault();
          inc++;
          if(inc <= 100){
            changer($('#freq-by-city g.axis.x'),inc,num)
            changer($('#freq-by-city g.chart-body'),inc,num1)
          }
          else{
            inc = 100;
          }
          console.log(inc)
        })
        var els = $('#freq-by-city .axis.x .tick text');
      }
    },300);

    function changer(t,val,base) {
      var scale=d3.scale.linear().domain([0,100]).range([base[0],-Math.abs($('#freq-by-city svg').width()-$('#freq-by-city').width())]);
      t.attr('transform','translate('+scale(val)+', '+base[1]+')')
    }
  })
}
