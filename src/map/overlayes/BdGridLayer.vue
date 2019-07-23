<template>
  <div class="grid-view">
  </div>
</template>
<script>
  import BMap from 'BMap'
  import RequestHandle from '@/request'
  import {bus} from '@/js/bus.js'

  export default {
    name: 'BdGridLayer',
    data () {
      return {
        lsCompany: [{
          companyname: '1',
          industry: '1',
          point_lat: '1',
          point_lng: '1'
        }],
        marker: undefined,
        rectangles: [],
        rectangleOption: {
          strokeColor: "black",
          strokeWeight: 0.3,
          strokeOpacity: 0,
          fillColor: "red",
          fillOpacity: 0.7
        },
        checkedName: 'SO2_120'
      }
    },
    created () {
      this.ready()
    },
    mounted () {
      let t = this;
      setTimeout(function () {
        t.createGrid();
        t.setMapData(t.checkedName, t.rectangleOption);
      }, 10)
    },
    methods: {
      ready () {
        bus.$on('getGridMap', this.getMap);
        bus.$on('locationGridPoint', this.locationPoint);
        bus.$on('gridLayerRefresh', this.refreshLayer);
      },
      getMap (map) {
        this.map = map
      },
      refreshLayer(type){
        if (type) {
          this.clearLayer();
          this.checkedName = type;
          this.setMapData(type, this.rectangleOption);
        }
      },
      createGrid () {
        if (!this.map) {
          bus.$on('getGridMap', this.getMap);
        }
        let xmin = 110;
        let ymin = 35.8;
        let xmax = 121.9;
        let ymax = 42.7;
        let lineOption = {
          strokeColor: '#000',
          strokeWeight: 0.3,
          strokeOpacity: 1.0,
          enableMassClear: false,
          enableClicking: false
        };
        for (let i = 0; i < 70; i++) {
          this.map.addOverlay(new BMap.Polyline([new BMap.Point(xmin, (ymin + 0.1 * i)), new BMap.Point(xmax, (ymin + 0.1 * i))], lineOption));
        }
        for (let i = 0; i < 120; i++) {
          this.map.addOverlay(new BMap.Polyline([new BMap.Point((xmin + 0.1 * i), ymin), new BMap.Point((xmin + 0.1 * i), ymax)], lineOption));
        }
      },
      setMapData (type, rectangleOption) {
//          console.log(rectangleOption);
        let t = this;
        let xmin = 110, ymin = 35.8, xmax = 121.9, ymax = 42.7;
//        $.get('http://60.10.135.153:3000/querys/adj.js', {var: type}, function (rdata) {
//          let data = rdata[type];
//          for (let i = 0; i < 70; i++) {
//            for (let j = 0; j < 120; j++) {
//              if (data[i][j] > 0.05) {
//                let rectangle = new BMap.Polygon([new BMap.Point(xmin + (0.1 * j), ymin + (0.1 * i)), new BMap.Point(xmin + 0.1 + (0.1 * j), ymin + (0.1 * i)), new BMap.Point(xmin + 0.1 + (0.1 * j), ymin + 0.1 + (0.1 * i)), new BMap.Point(xmin + (0.1 * j), ymin + 0.1 + (0.1 * i))
//                ], $.extend({}, rectangleOption, {fillColor: t.getColor(data[i][j])}));
//                rectangle.addEventListener("click", t.locationClick);
//                t.map.addOverlay(rectangle);
//                t.rectangles.push(rectangle);
//              }
//            }
//          }
//        }, 'jsonp');
//        console.log(type);
        let url = RequestHandle.getRequestUrl('GRIDPOLLUTION');//'http://lftdkplat.zhiscity.com/api/GridForecast/GetGridForecast';
        let pms = {
          'method': 'GET',
          'url': 'http://60.10.135.153:3000/querys/adj.json',
          'var': type
        };

        RequestHandle.request({
          url: url + '?paramStr=' + JSON.stringify(pms),
          type: 'GET',
          pms: {}
        }, function (result) {
          if (result.status) {
            let data = result.obj;
            switch(type){
              case 'CO_120':
                  data = data.CO_120;
                  break;
              case 'SO2_120':
                  data = data.SO2_120;
                  break;
              case 'NOX_120':
                  data = data.NOX_120;
                  break;
            }
            for (let i = 0; i < 70; i++) {
              for (let j = 0; j < 120; j++) {
                if (data[i][j] > 0.05) {
                  let rectangle = new BMap.Polygon([new BMap.Point(xmin + (0.1 * j), ymin + (0.1 * i)), new BMap.Point(xmin + 0.1 + (0.1 * j), ymin + (0.1 * i)), new BMap.Point(xmin + 0.1 + (0.1 * j), ymin + 0.1 + (0.1 * i)), new BMap.Point(xmin + (0.1 * j), ymin + 0.1 + (0.1 * i))
                  ], $.extend({}, rectangleOption, {fillColor: t.getColor(data[i][j])}));
                  rectangle.addEventListener("click", t.locationClick);
                  t.map.addOverlay(rectangle);
                  t.rectangles.push(rectangle);
                }
              }
            }
          }
        }, function (ex) {
          console.error(ex);
        });
      },
      locationClick (e) {
        let t = this;
        let p = e.target;
        let xmin = p.getBounds().getSouthWest().lng;
        let ymin = p.getBounds().getSouthWest().lat;
        let url = RequestHandle.getRequestUrl('GRIDCHAR');//'http://lftdkplat.zhiscity.com/api/GridForecast/GetGridForecast';
        let pms = {
          method: 'POST',
          url: 'http://www.zc12369.com/percenter/findCompanyByLocation.jhtm',
          xmin: xmin,
          xmax: (xmin + 0.1),
          ymin: ymin,
          ymax: (ymin + 0.1)
        };

        RequestHandle.request({
          url: url + '?paramStr=' + JSON.stringify(pms),
          type: 'GET', pms: {}
        }, function (result) {
          if (result.status) {
            bus.$emit('getGridData', result.obj);
          }
        }, function (ex) {
        });
      },
      locationPoint(lng, lat, code){
        let t = this;
        this.deletePoint();
        let point = new BMap.Point(lng, lat);
        this.marker ? this.marker.setPosition(point) : (this.marker = new BMap.Marker(point));

        //let url = 'http://lftdkplat.zhiscity.com/api/GridForecast/GetGridForecast';
        let url = RequestHandle.getRequestUrl('GRIDCHAR');
        let pms = {
          method: 'POST',
          url: 'http://www.zc12369.com/percenter/findCompany.jhtm',
          id: code,
        };

        RequestHandle.request({
          url: url + '?paramStr=' + JSON.stringify(pms),
          type: 'GET', pms: {}
        }, function (result) {
          if (result.status) {
            let data = result.obj;
            let res = t.getInfoWindow(data);
            let searchInfoWindow = new BMapLib.SearchInfoWindow(t.map, res, {
              title: '',
              width: 420,
              height: 250,
              enableAutoPan: true,
              searchTypes: []
            });
            searchInfoWindow.addEventListener("close", function (e) {
              t.deletePoint();
            });
            let m = new BMap.Marker(point, {
              offset: new BMap.Size(-36, 24)
            });
            searchInfoWindow.open(m);
            t.map.addOverlay(t.marker);
            //t.map.panTo(point);
          }
//          console.log(result);
        }, function (ex) {
        });
      },
      getInfoWindow(data){
        return '<table width=\'100%\' class="fitem"><tr style="height:32px;font-size:32px;font-weight:600;"><td colspan="2">' + data.companyname + '</td></tr>' +
          '<tr><th>行业</th><td style=\'width:70px;text-align:center;\'>' + (data.industry || '无') + '</td></tr>' +
          '<tr><th>污染物</th><td style=\'width:70px;text-align:center;\'>' + (data.mainpollute || '无') + '</td></tr>' +
          '<tr><th>联系人</th><td style=\'width:70px;text-align:center;\'>' + (data.contactName || '无') + '</td></tr>' +
          '<tr><th>联系电话</th><td style=\'width:70px;text-align:center;\'>' + (data.contacttype || '无') + '</td></tr>' +
          '<tr><th>地址</th><td style=\'width:70px;text-align:center;\'>' + (data.address || '无') + '</td></tr></table>';
      },
      clearLayer(){
        if (this.rectangles.length) {
          for (let i = 0, length = this.rectangles.length; i < length; i++) {
            this.map.removeOverlay(this.rectangles[i]);
          }
        }
      },
      deletePoint(){
        this.map.removeOverlay(this.marker);
      },
      getColor (val) {
        if (val <= 0.1)
          return '#79E6F0';
        else if (val <= 0.2)
          return '#C8DC33';
        else if (val <= 0.4)
          return '#F0DC16';
        else if (val <= 0.6)
          return '#FFBE16';
        else if (val <= 0.8)
          return '#FF790C';
        else if (val <= 1.0)
          return '#FF5B0C';
        else if (val <= 2.0)
          return '#F02A02';
        else if (val <= 4.0)
          return '#B40C02';
        else if (val <= 8.0)
          return '#790C02';
        else
          return '#330C02';
      },
      format (e, j) {
        return e.replace(/{(.+?)}/g, function (k, l) {
          return typeof j[l] === 'undefined' ? k : j[l]
        })
      }
    }
  }
</script>
<style scope>
  .grid-view {
    position: absolute;
    width: 50%;
    z-index: 1;
    background: #fff;
    top: 120px;
    left: 0;
  }

  .fitem {
    border: 1px solid #ddd;
    margin-right: 10px;
    line-height: 18px;
    width: 382px;
    height: 230px;
    margin: 0 auto;
  }

  .fitem th {
    width: 40px;
    font-size: 14px;
    font-weight: normal;
    text-align: center;
    border: 1px solid #ddd;
    height: 25px;
    background: #eaebed;
  }

  .fitem td {
    padding-left: 8px;
    font-size: 14px;
    text-align: left!important;
    border: 1px solid #ddd;
  }

  .BMapLib_SearchInfoWindow .BMapLib_bubble_title {
    background-color: #1080cc;
    color: #fff;
  }

  .BMapLib_SearchInfoWindow .BMapLib_bubble_tools div {
    background-color: rgba(0, 0, 0, 0);
  }

  .BMapLib_SearchInfoWindow .BMapLib_sendToPhone {
    background: none;
  }
</style>
