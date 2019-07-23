/*chart.js*/

var alfa = 0.8
var valuePlotBaud = [{ // Light air
  from: 0,
  to: 50,
  color: 'rgba(0, 254, 3, ' + alfa + ')',
  label: {
    text: '优',
    style: {
      color: '#606060'
    }
  }
}, { // Light breeze
  from: 51,
  to: 100,
  color: 'rgba(254, 245, 0, ' + alfa + ')',
  label: {
    text: '良',
    style: {
      color: '#606060'
    }
  }
}, { // Gentle breeze
  from: 101,
  to: 150,
  color: 'rgba(254, 125, 0, ' + alfa + ')',
  label: {
    text: '轻度污染',
    style: {
      color: '#606060'
    }
  }
}, { // Moderate breeze
  from: 151,
  to: 200,
  color: 'rgba(255, 3, 3, ' + alfa + ')',
  label: {
    text: '中度污染',
    style: {
      color: '#606060'
    }
  }
}, { // Fresh breeze
  from: 201,
  to: 300,
  color: 'rgba(188, 3,205 , ' + alfa + ')',
  label: {
    text: '重度污染',
    style: {
      color: '#606060'
    }
  }
}, { // Strong breeze
  from: 301,
  to: 600,
  color: 'rgba(72, 0, 78, ' + alfa + ')',
  label: {
    text: '严重污染',
    style: {
      color: '#606060'
    }
  }
}]

// line chart
function showLineChart(container, name, data, unit, type) {

  var dateTypeFormat
  if (type == 'HOUR') {
    dateTypeFormat = '%Y-%m-%d %H:%M'
  }
  else if (type == 'DAY') {
    dateTypeFormat = '%Y-%m-%d'
  }
  else if (type == 'MONTH') {
    dateTypeFormat = '%Y-%m'
  }

  var markerShowFlag
  if (data.length < 50) {
    markerShowFlag = true
  }
  else {
    markerShowFlag = false
  }

  $('#' + container).highcharts({
    chart: {
      type: 'spline',
      zoomType: 'x',
      spacingLeft: 0,
      spacingRight: 0
    },
    title: {
      text: ''
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        millisecond: '%H:%M:%S.%L',
        second: '%H:%M:%S',
        minute: '%H:%M',
        hour: '%H:%M',
        day: '%m-%d',
        week: '%m-%d',
        month: '%Y-%m',
        year: '%Y'
      }
    },
    yAxis: {
      title: {
        text: ''
      },
      min: 0
    },
    tooltip: {
      //shared: true,
      enabled: true,
      formatter: function () {
        var tip = '' + Highcharts.dateFormat(dateTypeFormat, this.x) + '<br/>' +
          this.series.name + ': <b>' + this.y + '</b>' + unit
        if (this.point.primary_pollutant != null && this.point.primary_pollutant != '') {
          tip = tip + '<br/>首要污染物：' + this.point.primary_pollutant
        }
        else {
          tip = tip + '<br/>首要污染物：无'
        }
        return tip

      }
    },
    plotOptions: {
      series: {
        marker: {
          enabled: markerShowFlag,
          radius: 5
        },
        enableMouseTracking: true,
        turboThreshold: 0
      }
    },
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    series: [{
      name: name,
      data: data
    }]
  })
}

// line chart
function showPercentChart(container, name, dataPM25Index, dataPM10Index, dataSO2Index, dataNO2Index, dataCOIndex, dataO3Index, dataAQI, dataIndex, type) {

  var aqicolor = '#3399CC'
  var dateTypeFormat
  if (type == 'HOUR') {
    dateTypeFormat = '%Y-%m-%d %H:%M'
  }
  else if (type == 'DAY') {
    dateTypeFormat = '%Y-%m-%d'
  }
  else if (type == 'MONTH') {
    dateTypeFormat = '%Y-%m'
  }

  var markerShowFlag
  if (dataPM25Index.length < 35) {
    markerShowFlag = true
  }
  else {
    markerShowFlag = false
  }

  $('#' + container).highcharts({
    chart: {
      type: 'area',
      zoomType: 'x',
      spacingLeft: 0,
      spacingRight: 0
    },
    title: {
      text: ''
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        millisecond: '%H:%M:%S.%L',
        second: '%H:%M:%S',
        minute: '%H:%M',
        hour: '%H:%M',
        day: '%m-%d',
        week: '%m-%d',
        month: '%Y-%m',
        year: '%Y'
      }
    },
    yAxis: [{
      title: {
        text: 'AQI/综合指数',
      },
      labels: {
        format: '{value}',
      },
      min: 0
    }, {
      title: {
        text: '百分比',
      },
      labels: {
        format: '{value}' + '%',//格式化Y轴刻度
      },
      min: 0,
      max: 100,
      opposite: true
    }],
    tooltip: {
      //pointFormat: '<div class="width:100px"><div class="float:left"><span style="color:{series.color}">{series.name}</span>:</div><div class="float:left;text-align:right;"> <b>{point.y:,.0f}</b>天 ({point.percentage:.1f}%)<br/></div></div>',
      shared: true,
      useHTML: true,
      formatter: function () {

        var complexindex = 0
        tip = '' + Highcharts.dateFormat(dateTypeFormat, this.x) + '<br/>'
          + '<table width=\'160px\' class=\'table-condensed table-bordered table-striped\' style=\'margin:5px 0 0 0\'>'
        tipindex = '<tr><th style=\'text-align:center\'>污染物</th><th>分指数</th><th>百分比</th></tr>'
        for (i = 0; i < this.points.length; i++) {
          color = this.points[i].series.color
          name = this.points[i].series.name
          //style = getAQIStyleByLevel(name);
          y = this.points[i].y

          if (name == 'AQI') {
            var aqi = y
          }
          else if (name == '综合指数') {

          }
          else {
            complexindex = complexindex + parseFloat(y)
            percentage = (this.points[i].percentage).toFixed(1)
            tipindex = tipindex + '<tr><td width=\'80px\' style=\'text-align:center;background:' + color + ';color:#fff\'>' + name + '</td><td align=\'right\'><b>' + y.toFixed(3) + '</b></td><td align=\'right\'>' + percentage + '%</td></tr>'
          }

        }
        tipindex = tipindex + '<tr><td width=\'80px\' style=\'text-align:center;\'>综合指数</td><td align=\'right\'><b>' + complexindex.toFixed(3) + '</b></td><td align=\'right\'>100%</td></tr>'
        if (aqi != null) {
          quality = getQualityByAqi(aqi)
          index = getAQILevelIndex(aqi)
          color = getColorByIndex(index)
          tip = tip + '<tr style=\'border-bottom:2px solid #ddd\'><td width=\'80px\' style=\'text-align:center;\'>AQI</td><td align=\'center\'><b>' + aqi + '</b></td><td align=\'center\' style=\'background:' + color + ';color:#fff\'>' + quality + '</td></tr>'
        }
        tip = tip + tipindex
        tip = tip + '</table>'
        return tip

      }
    },
    plotOptions: {
      series: {
        marker: {
          enabled: markerShowFlag,
          radius: 5
        },
        enableMouseTracking: true,
        turboThreshold: 0

      },
      area: {
        stacking: 'percent',
        lineColor: '#ffffff',
        lineWidth: 1,
        marker: {
          lineWidth: 1,
          lineColor: '#ffffff'
        }
      }
    },
    legend: {
      enabled: true
    },
    credits: {
      enabled: false
    },
    series: [{
      name: 'PM2.5',
      data: dataPM25Index,
      yAxis: 1
    }, {
      name: 'PM10',
      data: dataPM10Index,
      yAxis: 1
    }, {
      name: 'NO2',
      data: dataNO2Index,
      yAxis: 1
    }, {
      name: 'SO2',
      data: dataSO2Index,
      yAxis: 1
    }, {
      name: 'CO',
      data: dataCOIndex,
      yAxis: 1
    }, {
      name: 'O3',
      data: dataO3Index,
      yAxis: 1
    }, {
      type: 'spline',
      name: 'AQI',
      data: dataAQI,
      color: aqicolor,
      yAxis: 0
    }, {
      type: 'spline',
      name: '综合指数',
      data: dataIndex,
      color: aqicolor,
      yAxis: 0
    }]
  })
}

function showLineChartCompare(container, name, city1, city2, city3, data1, data2, data3, unit, type) {

  var dateTypeFormat
  if (type == 'HOUR') {
    dateTypeFormat = '%Y-%m-%d %H:%M'
  }
  else if (type == 'DAY') {
    dateTypeFormat = '%Y-%m-%d'
  }
  else if (type == 'MONTH') {
    dateTypeFormat = '%Y-%m'
  }

  var markerShowFlag
  if (data1.length < 50) {
    markerShowFlag = true
  }
  else {
    markerShowFlag = false
  }

  $('#' + container).highcharts({
    chart: {
      type: 'spline',
      zoomType: 'x',
      spacingLeft: 0,
      spacingRight: 0
    },
    title: {
      text: ''
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        millisecond: '%H:%M:%S.%L',
        second: '%H:%M:%S',
        minute: '%H:%M',
        hour: '%H:%M',
        day: '%m-%d',
        week: '%m-%d',
        month: '%Y-%m',
        year: '%Y'
      }
    },
    yAxis: {
      title: {
        text: name
      }
    },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function () {

        tip = '' + Highcharts.dateFormat(dateTypeFormat, this.x) + '<br/><hr style="margin:3px 0;"/>'
          + '<table width=\'120px\'>'
        for (i = 0; i < this.points.length; i++) {
          if (this.points[i].point.winddirection != null)
            winddirection = ' ' + this.points[i].point.winddirection
          else
            winddirection = ''
          tip = tip + '<tr><td style=\'color:' + this.points[i].series.color + '\'>' + this.points[i].series.name + ': </td><td align=\'right\'><b>' + this.points[i].y + '</b>' + unit + winddirection + '</td></tr>'
        }
        tip = tip + '</table>'
        return tip

      }
    },
    plotOptions: {
      series: {
        marker: {
          enabled: markerShowFlag,
          radius: 5
        },
        enableMouseTracking: true,
        turboThreshold: 0
      }
    },
    legend: {
      enabled: true
    },
    credits: {
      enabled: false
    },
    series: [{
      name: city1,
      data: data1,
      color: '#3399CC'
    }, {
      name: city2,
      data: data2,
      color: '#D26900'
    }, {
      name: city3,
      data: data3,
      color: '#A5A552'
    }]
  })
}

function showLineChartWithAQI(container, name, data, dataAQI, unit, type) {

  var dateTypeFormat
  var aqicolor = '#3399CC'
  var itemcolor = '#D26900'
  if (type == 'HOUR') {
    dateTypeFormat = '%Y-%m-%d %H:%M'
  }
  else if (type == 'DAY') {
    dateTypeFormat = '%Y-%m-%d'
  }
  else if (type == 'MONTH') {
    dateTypeFormat = '%Y-%m'
  }

  var markerShowFlag
  if (data.length < 50) {
    markerShowFlag = true
  }
  else {
    markerShowFlag = false
  }

  $('#' + container).highcharts({
    chart: {
      type: 'spline',
      zoomType: 'x',
      spacingLeft: 0,
      spacingRight: 0
    },
    title: {
      text: ''
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        millisecond: '%H:%M:%S.%L',
        second: '%H:%M:%S',
        minute: '%H:%M',
        hour: '%H:%M',
        day: '%m-%d',
        week: '%m-%d',
        month: '%Y-%m',
        year: '%Y'
      }
    },
    yAxis: [{
      title: {
        text: 'AQI',
        style: {
          color: aqicolor
        },
      },
      labels: {
        format: '{value}',//格式化Y轴刻度
        style: {
          color: aqicolor
        }
      },
      min: 0
    }, {
      title: {
        text: name,
        style: {
          color: itemcolor
        },
      },
      labels: {
        format: '{value}' + unit,
        style: {
          color: itemcolor
        },
      },
      opposite: true
    }],
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function () {
        if (this.points.length == 2) {
          var tip = '' + Highcharts.dateFormat(dateTypeFormat, this.x) + '<br/>' +
            this.points[0].series.name + ': <b>' + this.points[0].y + '</b>' + '<br/>' +
            this.points[1].series.name + ': <b>' + this.points[1].y + '</b>' + unit
          if (this.points[1].point.winddirection != null) {
            tip = tip + '<br/>风向:<b>' + this.points[1].point.winddirection + '</b>'
          }
        }
        else {
          var tip = '' + Highcharts.dateFormat(dateTypeFormat, this.x) + '<br/>' +
            this.points[0].series.name + ': <b>' + this.points[0].y + '</b>'
          if (this.points[0].series.name != 'AQI') {
            tip = tip + unit
          }
          if (this.points[0].point.winddirection != null) {
            tip = tip + '<br/>风向:<b>' + this.points[0].point.winddirection + '</b>'
          }
        }
        return tip
      }
    },
    plotOptions: {
      series: {
        marker: {
          enabled: markerShowFlag,
          radius: 5
        },
        enableMouseTracking: true,
        turboThreshold: 0
      }
    },
    legend: {
      enabled: true
    },
    credits: {
      enabled: false
    },
    series: [{
      name: 'AQI',
      data: dataAQI,
      color: aqicolor,
      yAxis: 0
    }, {
      name: name,
      data: data,
      color: itemcolor,
      yAxis: 1
    }]
  })
}

function showTwoLineChart(container, name, name1, name2, data1, data2, unit, type) {

  var dateTypeFormat
  var aqicolor = '#3399CC'
  var itemcolor = '#D26900'
  if (type == 'HOUR') {
    dateTypeFormat = '%m-%d %H:%M'
  }
  else if (type == 'DAY') {
    dateTypeFormat = '%m月%d日'
  }
  else if (type == 'MONTH') {
    dateTypeFormat = '%m'
  }

  var markerShowFlag
  if (data1.length < 50 && data2.length < 50) {
    markerShowFlag = true
  }
  else {
    markerShowFlag = false
  }

  $('#' + container).highcharts({
    chart: {
      type: 'spline',
      zoomType: 'x',
      spacingLeft: 0,
      spacingRight: 0
    },
    title: {
      text: name + '比较'
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        millisecond: '%H:%M:%S.%L',
        second: '%H:%M:%S',
        minute: '%H:%M',
        hour: '%H:%M',
        day: '%m-%d',
        week: '%m-%d',
        month: '%m月',
      }
    },
    yAxis: [{
      title: {
        text: name
      },
      min: 0
    }],
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function () {
        if (this.points.length == 2) {
          var tip = '' + Highcharts.dateFormat(dateTypeFormat, this.x) + name + '比较<br/>' +
            this.points[0].series.name + ': <b>' + this.points[0].y + '</b>' + unit + '<br/>' +
            this.points[1].series.name + ': <b>' + this.points[1].y + '</b>' + unit + '<br/>'
          ratio = (100 * (this.points[1].y - this.points[0].y) / this.points[0].y).toFixed(2)
          if (ratio >= 0) {
            tip = tip + '同比升高<span style="color:red">: ' + ratio + '%</span>'
          }
          else {

            tip = tip + '同比下降<span style="color:green">: ' + Math.abs(ratio) + '%</span>'
          }

        }
        else {
          var tip = '' + Highcharts.dateFormat(dateTypeFormat, this.x) + name + '比较<br/>' +
            this.points[0].series.name + ': <b>' + this.points[0].y + '</b>' + unit
        }
        return tip
      }
    },
    plotOptions: {
      series: {
        marker: {
          enabled: markerShowFlag,
          radius: 5
        },
        enableMouseTracking: true,
        turboThreshold: 0
      }
    },
    legend: {
      enabled: true
    },
    credits: {
      enabled: false
    },
    series: [{
      name: name1,
      data: data1,
      color: aqicolor,
    }, {
      name: name2,
      data: data2,
      color: itemcolor
    }]
  })
}

function showLineChartAll(container, type, dataAQI, dataPM25, dataPM10, dataSO2, dataNO2, dataCO, dataO3, dataTemp, dataHumi, dataWind) {

  var dateTypeFormat
  var aqicolor = '#3399CC'
  var itemcolor = '#D26900'
  if (type == 'HOUR') {
    dateTypeFormat = '%Y-%m-%d %H:%M'
  }
  else if (type == 'DAY') {
    dateTypeFormat = '%Y-%m-%d'
  }
  else if (type == 'MONTH') {
    dateTypeFormat = '%Y-%m'
  }

  var markerShowFlag
  if (dataAQI.length < 50) {
    markerShowFlag = true
  }
  else {
    markerShowFlag = false
  }

  $('#' + container).highcharts({
    chart: {
      type: 'spline',
      zoomType: 'x',
      spacingLeft: 0,
      spacingRight: 0
    },
    title: {
      text: ''
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        millisecond: '%H:%M:%S.%L',
        second: '%H:%M:%S',
        minute: '%H:%M',
        hour: '%H:%M',
        day: '%m-%d',
        week: '%m-%d',
        month: '%Y-%m',
        year: '%Y'
      }
    },
    yAxis: [{
      title: {
        text: 'AQI'
      },
      labels: {
        format: '{value}'
      },
      min: 0
    }, {
      title: {
        text: 'PM2.5 PM10 SO2 NO2 O3',
        enabled: false
      },
      labels: {
        format: '{value}' + 'ug/m3',
        enabled: false
      },
      opposite: false
    }, {
      title: {
        text: 'CO',
        enabled: false
      },
      labels: {
        format: '{value}' + 'mg/m3',
        enabled: false
      },
      opposite: false
    }, {
      title: {
        text: '温度',
        enabled: false
      },
      labels: {
        format: '{value}' + '℃',
        enabled: false
      },
      opposite: true
    }, {
      title: {
        text: '湿度',
        enabled: false
      },
      labels: {
        format: '{value}' + '%',
        enabled: false
      },
      opposite: true
    }, {
      title: {
        text: '风级',
        enabled: false
      },
      labels: {
        format: '{value}' + '级',
        enabled: false
      },
      opposite: true
    }],
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function () {
        tip = '' + Highcharts.dateFormat(dateTypeFormat, this.x) + '<br/><hr style="margin:3px 0;"/>'
          + '<table width=\'150px\'>'
        var tq = null
        var level = null
        var color = null
        for (i = 0; i < this.points.length; i++) {
          if (this.points[i].series.name == '风级') {
            tip = tip + '<tr><td style=\'color:' + this.points[i].series.color + '\'>' + this.points[i].series.name + ': </td><td align=\'right\'><b>' + this.points[i].y + '</b>级 ' + this.points[i].point.winddirection + '</td></tr>'
            tq = this.points[i].point.weather
          }
          else {

            unit = ''
            name = this.points[i].series.name
            if (name == 'PM2.5' || name == 'PM10' || name == 'SO2' || name == 'NO2' || name == 'O3') {
              unit = 'ug/m3'
            }
            else if (name == 'CO') {
              unit = 'mg/m3'
            }
            else if (name == '温度') {
              unit = '℃'
            }
            else if (name == '湿度') {
              unit = '%'
            }

            tip = tip + '<tr><td style=\'color:' + this.points[i].series.color + '\'>' + this.points[i].series.name + ': </td><td align=\'right\'><b>' + this.points[i].y + '</b>' + unit + '</td></tr>'
            if (name == 'AQI') {
              //obj = getColor(this.points[i].y);
              //level = obj.quality;
              //color = obj.color;

            }
          }
        }
        if (level != null) {
          tip = tip + '<tr><td >等级: </td><td align=\'right\' >' + level + '</td></tr>'
        }
        if (tq != null && tq != '' && type != 'MONTH') {
          tip = tip + '<tr><td >天气: </td><td align=\'right\'>' + tq + '</td></tr>'
        }
        tip = tip + '</table>'
        return tip

      }
    },
    plotOptions: {
      series: {
        marker: {
          enabled: markerShowFlag,
          radius: 5
        },
        enableMouseTracking: true,
        turboThreshold: 0
      }
    },
    legend: {
      enabled: true
    },
    credits: {
      enabled: false
    },
    series: [
      {
        name: 'AQI',
        data: dataAQI,
        yAxis: 0
      },
      {
        name: 'PM2.5',
        data: dataPM25,
        yAxis: 1
      },
      {
        name: 'PM10',
        data: dataPM10,
        yAxis: 1
      },
      {
        name: 'SO2',
        data: dataSO2,
        yAxis: 1
      },
      {
        name: 'CO',
        data: dataCO,
        yAxis: 2
      },
      {
        name: 'NO2',
        data: dataNO2,
        yAxis: 1
      },
      {
        name: 'O3',
        data: dataO3,
        yAxis: 1
      },
      {
        name: '温度',
        data: dataTemp,
        yAxis: 3
      },
      {
        name: '湿度',
        data: dataHumi,
        yAxis: 4
      },
      {
        name: '风级',
        data: dataWind,
        yAxis: 5
      }]
  })
}

// line chart
function showRankChart(container, city, name, data, unit, type, subtitle) {

  var dateTypeFormat
  if (type == 'HOUR') {
    dateTypeFormat = '%Y-%m-%d %H:%M'
    typestr = '小时'
  }
  else if (type == 'DAY') {
    dateTypeFormat = '%Y年%m月%d日'
    typestr = '日'
    label = '综合指数'
  }
  else if (type == 'MONTH') {
    dateTypeFormat = '%Y年%m月'
    typestr = '月'
    label = '综合指数'
  }

  var markerShowFlag
  if (data.length < 50) {
    markerShowFlag = true
  }
  else {
    markerShowFlag = false
  }

  $('#' + container).highcharts({
    chart: {
      type: 'column',
      zoomType: 'x',
      spacingLeft: 0,
      spacingRight: 0
    },
    title: {
      text: city + name + typestr + '变化',
      style: {
        color: '#3E576F',
        fontSize: '30px'
      }
    },
    subtitle: {
      text: subtitle
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        millisecond: '%H:%M:%S.%L',
        second: '%H:%M:%S',
        minute: '%H:%M',
        hour: '%H:%M',
        day: '%m-%d',
        week: '%m-%d',
        month: '%Y-%m',
        year: '%Y'
      }
    },
    yAxis: {
      title: {
        text: ''
      },
      min: 0
    },
    tooltip: {
      //shared: true,
      enabled: true,
      formatter: function () {
        return '' + Highcharts.dateFormat(dateTypeFormat, this.x) + this.point.type + '<br/>' +
          this.series.name + ': <b>' + this.y + '</b>' + unit + '<br/>' +
          label + ': ' + this.point.index + '<br/>' +
          '首要污染物: ' + this.point.primary_pollutant
      }
    },
    plotOptions: {
      series: {
        marker: {
          enabled: markerShowFlag,
          radius: 6
        },
        enableMouseTracking: true,
        turboThreshold: 0
      }
    },
    legend: {
      enabled: true
    },
    credits: {
      enabled: false
    },
    series: [{
      name: name,
      data: data,
      dataLabels: {
        enabled: true,
        rotation: -90,
        color: '#FFFFFF',
        align: 'right',
        x: 4,
        y: 10,
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif',
          textShadow: '0 0 3px black'
        }
      }
    }]
  })

  var chartObj = $('#' + container).highcharts()
  if (chartObj != null) {
    chartObj.yAxis[0].addPlotLine({
      value: 10,
      color: 'blue',
      label: {
        text: '前十名界线',
        align: 'left',
        x: 5,
        color: 'blue'
      },
      width: 2,
      id: 'base-fuel'
    })
  }
}

// line chart
function showTwoRankChart(container, city, name, dataAQI, dataIndex, unit, type, subtitle) {

  var dateTypeFormat
  if (type == 'HOUR') {
    dateTypeFormat = '%Y-%m-%d %H:%M'
    typestr = '小时'
  }
  else if (type == 'DAY') {
    dateTypeFormat = '%Y年%m月%d日'
    typestr = '日'
    label = 'AQI'
  }
  else if (type == 'MONTH') {
    dateTypeFormat = '%Y年%m月'
    typestr = '月'
    label = '综合指数'
  }

  var markerShowFlag
  if (dataIndex.length < 50) {
    markerShowFlag = true
  }
  else {
    markerShowFlag = false
  }

  $('#' + container).highcharts({
    chart: {
      type: 'column',
      zoomType: 'x',
      spacingLeft: 0,
      spacingRight: 0
    },
    title: {
      text: city + name + typestr + '变化',
      style: {
        color: '#3E576F',
        fontSize: '30px'
      }
    },
    subtitle: {
      text: subtitle
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        millisecond: '%H:%M:%S.%L',
        second: '%H:%M:%S',
        minute: '%H:%M',
        hour: '%H:%M',
        day: '%m-%d',
        week: '%m-%d',
        month: '%Y-%m',
        year: '%Y'
      }
    },
    yAxis: {
      title: {
        text: ''
      },
      min: 0
    },
    tooltip: {
      shared: true,
      enabled: true,
      useHTML: true,
      formatter: function () {
        // return
        if (this.points.length == 2) {
          var tip = '' + Highcharts.dateFormat(dateTypeFormat, this.x) + '<br/>' +
            this.points[0].series.name + ': <b>' + this.points[0].y + '</b>名<br/>' +
            this.points[1].series.name + ': <b>' + this.points[1].y + '</b>名<br/>'
        }
        else {
          var tip = '' + Highcharts.dateFormat(dateTypeFormat, this.x) + this.points[0].point.type + '<br/>' +
            name + ': <b>' + this.y + '</b>' + unit + '<br/>'
          if (this.points[0].point.index != null) {
            label = '综合指数'
            value = this.points[0].point.index
          }
          else {
            label = 'AQI'
            value = this.points[0].point.aqi
          }

          tip = tip + label + ': ' + value + '<br/>' +
            '首要污染物: ' + this.points[0].point.primary_pollutant
        }
        return tip
      }
    },
    plotOptions: {
      series: {
        marker: {
          enabled: markerShowFlag,
          radius: 6
        },
        enableMouseTracking: true,
        turboThreshold: 0
      }
    },
    legend: {
      enabled: true
    },
    credits: {
      enabled: false
    },
    series: [{
      name: 'AQI排名',
      type: 'column',
      data: dataAQI,
      visible: false,
      dataLabels: {
        enabled: true,
        rotation: -90,
        color: '#FFFFFF',
        align: 'right',
        x: 4,
        y: 10,
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif',
          textShadow: '0 0 3px black'
        }
      }
    },
      {
        name: '综合指数排名',
        data: dataIndex,
        dataLabels: {
          enabled: true,
          rotation: -90,
          color: '#FFFFFF',
          align: 'right',
          x: 4,
          y: 10,
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif',
            textShadow: '0 0 3px black'
          }
        }
      }]
  })

  var chartObj = $('#' + container).highcharts()
  if (chartObj != null) {
    chartObj.yAxis[0].addPlotLine({
      value: 10,
      color: 'blue',
      label: {
        text: '前十名界线',
        align: 'left',
        x: 5,
        color: 'blue'
      },
      width: 2,
      id: 'base-fuel'
    })
  }
}

function showPieChart(container, title, name, unit, data) {
  $('#' + container).highcharts({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false
    },
    title: {
      text: title + '分布图'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y}</b>' + unit + '({point.percentage:.1f}%)'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          color: '#000000',
          connectorColor: '#000000',
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        },
        showInLegend: true,
        events: {
          click: function (e) {
            //alert('You just clicked the graph:' + e.point.name);
          }
        }
      }
    },
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    series: [{
      type: 'pie',
      name: name,
      data: data
    }]
  })
}

// show column chart
function showColumnChart(container, name, category, data, city, bestpoint, worstpoint, unit) {
  $('#' + container).highcharts({
    chart: {
      type: 'bar'
    },
    title: {
      text: city + '监测站点' + name + '比较',
      style: {
        color: '#3E576F',
        fontSize: '30px'
      }
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y}</b>' + unit
    },
    subtitle: {
      text: '【' + bestpoint + '】站点最好,【' + worstpoint + '】站点最差'
    },
    xAxis: {
      categories: category
    },
    yAxis: {
      min: 0,
      title: {
        text: ''
      }
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        events: {
          click: function (e) { //就是这里的事件响应不了。而且我不太会调试，希望得到大家指点！
            //alert('You just clicked the graph:' + e.point.name);
            //$('#info').html(e.point.key);
          }
        }
      }
    },
    legend: {
      layout: 'vertical',
      align: 'left',
      x: 50,
      verticalAlign: 'top',
      y: 30,
      floating: true,
      backgroundColor: '#FFFFFF',
      enabled: false
    },
    credits: {
      enabled: false
    },
    exporting: {
      enabled: false
    },
    series: [{
      name: name,
      data: data,
      dataLabels: {
        enabled: true,
        rotation: 0,
        color: '#FFFFFF',
        align: 'right',
        x: 0,
        y: 0,
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif',
          textShadow: '0 0 3px black'
        }
      }
    }]
  })
}

//获取字符串长度 区分中英文, 中文两个字节
String.prototype.getBytes = function () {
  var cArr = this.match(/[^\x00-\xff]/ig)
  return this.length + (cArr == null ? 0 : cArr.length)
}
//截取字符串长度 区分中英文, 中文两个字节. 超出部分中指定字符串代替 需引用 String.prototype.getBytes
String.prototype.cutBytes = function (strLen, replaceStr) {
  var str = this.toString()
  if (str.getBytes() <= strLen)
    return str
  var returnStr = ''
  var tempLen = 0
  for (var i = 0; i < str.length; i++) {
    var tempChar = str[i].match(/[^\x00-\xff]/ig)
    returnStr += str[i]
    tempLen += tempChar == null ? 1 : 2
    if (tempLen >= strLen) {
      return i + 1 < str.length ? returnStr + replaceStr : returnStr
    }
  }
  return ''
}

/**      <br>
 * 对Date的扩展，将 Date 转化为指定格式的String       <br>
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符       <br>
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)       <br>
 * eg:       <br>
 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423       <br>
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04       <br>
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04       <br>
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04       <br>
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18       <br>
 */
Date.prototype.pattern = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
    'H+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    'S': this.getMilliseconds() //毫秒
  }
  var week = {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[this.getDay() + ''])
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

// convert time format for Firefox and IE
function converTimeFormat(time) {
  if (time != null) {
    time = time.replace('-', '/')
    time = time.replace('-', '/')
    return new Date(time)
  }
  return null
}

function convertMonthFormat(month) {

  if (month != null) {
    year = parseInt(parseInt(month) / 100)
    month = parseInt(month) % 100
    time = year + '-' + month + '-01'
    return converTimeFormat(time)
  }
}

function getWindDirectionUrl(wd) {
  var wid = 0
  var url = null
  switch (wd) {
    case '东风':
      wid = 1
      break
    case '东南风':
      wid = 2
      break
    case '南风':
      wid = 3
      break
    case '西南风':
      wid = 4
      break
    case '西风':
      wid = 5
      break
    case '西北风':
      wid = 6
      break
    case '北风':
      wid = 7
      break
    case '东北风':
      wid = 8
      break
  }
  if (wid > 0) {
    url = 'url(resource/img/arrow/' + wid + '.png)'
  }
  return url
}

function getColorByIndex(index) {
  switch (index) {
    case 0:
      color = '#999'
      break
    case 1:
      color = '#43ce17'
      break
    case 2:
      color = '#efdc31'
      break
    case 3:
      color = '#fa0'
      break
    case 4:
      color = '#ff401a'
      break
    case 5:
      color = '#d20040'
      break
    case 6:
      color = '#9c0a4e'
      break
    default:
      color = '#43ce17';
      break;
  }
  return color
}

function getColorByIndexForSensor(index) {
  switch (index) {
    case 0:
      color = '#999'
      break
    case 1:
      color = 'rgba(0,166,0,0.6)'
      break
    case 2:
      color = 'rgba(239,220,49,0.6)'
      break
    case 3:
      color = 'rgba(255,170,0,0.6)'
      break
    case 4:
      color = '#ff401a'
      break
    case 5:
      color = '#d20040'
      break
    case 6:
      color = '#9c0a4e'
      break
  }
  return color
}

function getQualityByIndex(index) {

  switch (index) {
    case 0:
      quality = '无'
      break
    case 1:
      quality = '优'
      break
    case 2:
      quality = '良'
      break
    case 3:
      quality = '轻度污染'
      break
    case 4:
      quality = '中度污染'
      break
    case 5:
      quality = '重度污染'
      break
    case 6:
      quality = '严重污染'
      break
  }
  return quality
}

function getQualityByAqi(val) {
  var value = null
  if (val <= 0) {
    value = '无'
  }
  else if (val <= 50) {
    value = '优'
  }
  else if (val <= 100) {
    value = '良'
  }
  else if (val <= 150) {
    value = '轻度污染'
  }
  else if (val <= 200) {
    value = '中度污染'
  }
  else if (val <= 300) {
    value = '重度污染'
  }
  else {
    value = '严重污染'
  }
  return value
}

function getAQILevelIndex(aqi) {
  if (aqi == 0) {
    level = 0
  }
  else if (aqi <= 200) {
    level = Math.ceil(aqi / 50)
    if (level < 0) {
      level = 1
    }
  }
  else if (aqi < 300) {
    level = 5
  }
  else {
    level = 6
  }
  return level
}

function getPM25LevelIndex(pm2_5) {
  if (pm2_5 == 0) {
    level = 0
  }
  else if (pm2_5 <= 35) {
    level = 1
  }
  else if (pm2_5 <= 75) {
    level = 2
  }
  else if (pm2_5 <= 115) {
    level = 3
  }
  else if (pm2_5 <= 150) {
    level = 4
  }
  else if (pm2_5 <= 250) {
    level = 5
  }
  else {
    level = 6
  }
  return level
}

function getPM10LevelIndex(pm10) {
  if (pm10 == 0) {
    level = 0
  }
  else if (pm10 <= 50) {
    level = 1
  }
  else if (pm10 <= 150) {
    level = 2
  }
  else if (pm10 <= 250) {
    level = 3
  }
  else if (pm10 <= 350) {
    level = 4
  }
  else if (pm10 <= 420) {
    level = 5
  }
  else {
    level = 6
  }
  return level
}

function getSO2LevelIndex(so2) {
  if (so2 == 0) {
    level = 0
  }
  else if (so2 <= 50) {
    level = 1
  }
  else if (so2 <= 150) {
    level = 2
  }
  else if (so2 <= 475) {
    level = 3
  }
  else if (so2 <= 800) {
    level = 4
  }
  else if (so2 <= 1600) {
    level = 5
  }
  else {
    level = 6
  }
  return level
}

function getNO2LevelIndex(no2) {
  if (no2 == 0) {
    level = 0
  }
  else if (no2 <= 40) {
    level = 1
  }
  else if (no2 <= 80) {
    level = 2
  }
  else if (no2 <= 180) {
    level = 3
  }
  else if (no2 <= 280) {
    level = 4
  }
  else if (no2 <= 565) {
    level = 5
  }
  else {
    level = 6
  }
  return level
}

function getO3LevelIndex(o3) {
  if (o3 == 0) {
    level = 0
  }
  else if (o3 <= 160) {
    level = 1
  }
  else if (o3 <= 200) {
    level = 2
  }
  else if (o3 <= 300) {
    level = 3
  }
  else if (o3 <= 400) {
    level = 4
  }
  else if (o3 <= 800) {
    level = 5
  }
  else {
    level = 6
  }
  return level
}

function getCOLevelIndex(co) {
  if (co == 0) {
    level = 0
  }
  else if (co <= 2) {
    level = 1
  }
  else if (co <= 4) {
    level = 2
  }
  else if (co <= 14) {
    level = 3
  }
  else if (co <= 24) {
    level = 4
  }
  else if (co <= 36) {
    level = 5
  }
  else {
    level = 6
  }
  return level
}

function getComplexIndex(index) {
  if (index == 0) {
    level = 0
  }
  else if (index <= 4) {
    level = 1
  }
  else if (index <= 6) {
    level = 2
  }
  else if (index <= 8) {
    level = 3
  }
  else if (index <= 10) {
    level = 4
  }
  else if (index <= 12) {
    level = 5
  }
  else {
    level = 6
  }
  return level
}

function getTempLevelIndex(temp) {

  if (temp <= 0) {
    level = 1
  }
  else if (temp <= 8) {
    level = 2
  }
  else if (temp <= 16) {
    level = 3
  }
  else if (temp <= 24) {
    level = 4
  }
  else if (temp <= 32) {
    level = 5
  }
  else {
    level = 6
  }
  return level
}

function getHumiLevelIndex(humi) {

  if (humi == 0) {
    level = 0
  }
  else if (humi <= 20) {
    level = 1
  }
  else if (humi <= 40) {
    level = 2
  }
  else if (humi <= 60) {
    level = 3
  }
  else if (humi <= 80) {
    level = 4
  }
  else if (humi <= 100) {
    level = 5
  }
  return level
}

function getWindLevelIndex(value) {

  if (value == 0) {
    level = 0
  }
  else if (value <= 1) {
    level = 1
  }
  else if (value <= 2) {
    level = 2
  }
  else if (value <= 3) {
    level = 3
  }
  else if (value <= 4) {
    level = 4
  }
  else if (value <= 5) {
    level = 5
  }
  else {
    level = 6
  }
  return level
}

//voc颜色
function getVOCLeveColor(voc) {
  let color = '';
  if (voc == 0) {
    color = '#207a1f'
  }
  else if (1 <= voc && voc <= 80) {
    color = '#00E400'
  }
  else if (81 <= voc && voc <= 150) {
    color = '#EFDC31'
  }
  else if (151 <= voc && voc <= 300) {
    color = '#FF7E00'
  }
  else if (301 <= voc && voc <= 400) {
    color = '#FF0000'
  }
  else if (401 <= voc && voc <= 2000) {
    color = '#99004C'
  }
  else {
    color = '#7E0023'
  }
  return color
}


function getVOCLeveColorIndex(voc) {
  let level = 0;
  if (voc === 0) {
    level = 0;
  }
  else if (1 <= voc && voc <= 80) {
    level = 1
  }
  else if (81 <= voc && voc <= 150) {
    level = 2
  }
  else if (151 <= voc && voc <= 300) {
    level = 3
  }
  else if (301 <= voc && voc <= 400) {
    level = 4
  }
  else if (401 <= voc && voc <= 2000) {
    level = 5
  }
  else {
    level = 6
  }
  return level
}
