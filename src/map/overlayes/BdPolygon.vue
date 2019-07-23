<script>
  import Axios from 'axios'
  import BMap from 'BMap'
  import Coordtransform from 'coordtransform'
  import RequestHandle from '@/request/'
  import {bus} from '@/js/bus.js'

  export default {
    name: 'BdPolygon',
    render() {
    },
    data() {
      return {
        layers: [{
          url: '/static/data/TY1.json',
          hasVisible: true,
          displayFieldName: 'NAME99',
          geometry: []
        }, {
          url: '/static/data/TE1.json',
          hasVisible: false,
          displayFieldName: 'NAME99',
          geometry: []
        }, {
          url: '/static/data/TS1.json',
          hasVisible: false,
          displayFieldName: 'FCNAME',
          geometry: []
        }],
        labelSymbol: new BMap.Label(),
        checkLayerIndex: 0,
        hasLoaded: false,
        hasRequest: false
      }
    },
    create(){

    },
    mounted() {

      // let t = this;
      // setTimeout(function () {
      //   t.map = t.$parent.$parent.$parent.$parent.map;
      //
      //   if (t.map) {
      //     t.map.addOverlay(t.labelSymbol);
      //     t.labelSymbol.hide();
      //     t.labelSymbol.setStyle({color: '#333', backgroundColor: '#fff', border: 'solid 1px #333'});
      //    t.ready();
      //   }
      // }, 10);
     bus.$once('setPolygonMap', this.setMap);
      bus.$on('setVisible', this.setLayerVisible);
      bus.$on('setOpacity', this.setOpacity);//setLayerHide
      bus.$on('setLayerHide', this.setLayerHide);//setLayerHide
    },
    activated(){
//       this.hasRequest = false;
//       this.checkLayerIndex = 0;
//       this.clearOverlay();
//       let checkLayer = this.$parent.$parent.$parent.$parent.$parent.layerId || 0;
//       let index = 0;
// //      if (checkLayer === 'EW')
// //        index = 1;
// //      else if (checkLayer === 'SW')
// //        index = 2;
//       let t = this;
//       for (let i = 0, length = this.layers.length; i < length; i++) {
//         let l = this.layers[i];
//         l.hasVisible = i === index;
//       }
//
//       !this.hasLoaded && this.ready();
    },
    methods: {
     setMap(map){
       this.map = map;
       this.map.addOverlay(this.labelSymbol);
       this.labelSymbol.hide();
       this.labelSymbol.setStyle({color: '#333', backgroundColor: '#fff', border: 'solid 1px #333'});
       this.ready();
     },
      ready() {
        let t = this;
        for (let j = 0, count = this.layers.length; j < count; j++) {
          let sle = this.getLeaveColor(j);
          let layer = t.layers[j];
          let url = layer.url;
          let visible = layer.hasVisible;
          if (layer.hasVisible) {
            let displayFieldName = layer.displayFieldName;
            Axios({
              url: url,
              method: 'GET',
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              data: {}
            }).then(function (result) {
              if (result.status === 200) {
//                  console.log(result.data);
                t.createPolygon(result.data, layer.geometry, displayFieldName, sle);
                for (let i = 0, length = layer.geometry.length; i < length; i++) {
                  let ply = layer.geometry[i];
                  t.map.addOverlay(ply);
                  visible ? ply.show() : ply.hide();
                }
//                bus.$emit('myAjaxLoad')
              }
            }).catch(function (ex) {
//            console.log(ex)
            })
          }
        }
      },
      setLayerVisible(index, hasVisible) {
        let t = this;
        this.clearOverlay();
        if (hasVisible) {
          t.hasRequest = t.checkLayerIndex === index;
          if(!t.hasRequest) {
            this.checkLayerIndex = index;
            let layer = this.layers[index];
            let geometry = layer.geometry;
            for (let i = 0, length = this.layers.length; i < length; i++) {
              this.layers[i].hasVisible = i === parseInt(index);
            }
            this.ready();
          }
        }
        //for (let i = 0, length = geometry.length; i < length; i++) {
        //hasVisible ? geometry[i].show() : geometry[i].hide();
        //}
      },
      clearOverlay(){
        let t = this;
        this.layers.forEach(function (v) {
          v && (v.geometry.forEach(function (ol) {
            t.map.removeOverlay(ol);
          }));
          v.geometry = [];
        });
      },
      setOpacity(index, opacity){
        let layer = this.layers[index];
        let geometry = layer.geometry;
        for (let i = 0, length = geometry.length; i < length; i++) {
          geometry[i].setFillOpacity(opacity);
          geometry[i].setStrokeOpacity(opacity);
        }
      },
      setLayerHide(hasVisible = false) {
        for (let i = 0, length = this.layers.length; i < length; i++) {
          let geometry = this.layers[i].geometry;
          for (let j = 0, count = geometry.length; j < count; j++) {
            hasVisible ? geometry[j].show() : geometry[j].hide();
          }
        }
      },
      createPolygon(data, layer, displayFieldName, polygonStyle) {
        let transformRing = this.getBdPolygon(data);
        let t = this;
        for (let i = 0, length = transformRing.length; i < length; i++) {
          let lsRings = transformRing[i];
          let geometry = lsRings.geometry;
          let attributes = lsRings.attributes;
          //let fillColor = color || this.getRandomColor();
          for (let j = 0, count = geometry.length; j < count; j++) {
            let polygon = this.getStringPolygon(geometry[j]);
            let ply = new BMap.Polygon(polygon, polygonStyle);
            ply.attributes = attributes;
            ply.displayFieldName = displayFieldName;

            layer.push(ply);
//            this.map.addOverlay(ply);
//            hasVisible ? ply.show() : ply.hide();
//            ply.addEventListener('click', function (e) {
////              console.log(e);
//            });
            ply.addEventListener('mouseover', function (e) {
//              t.labelSymbol.show();
//              console.log(t.labelSymbol);
            });
            ply.addEventListener('click', this.mouseClickEvent);
            ply.addEventListener('mouseout', function (e) {
              t.labelSymbol.hide();
//              console.log(t.labelSymbol);
            });
          }
        }
      },
      mouseClickEvent(e){
        let t = this;
        t.labelSymbol.show();
        t.labelSymbol.setPosition(e.point);
        let displayFieldName = e.target.displayFieldName;
        let attributes = e.target.attributes;
//        console.log(e);
        (attributes && displayFieldName) && (t.labelSymbol.setContent(attributes[displayFieldName]));
        (attributes && displayFieldName) && (t.setSearchInfoWindow(e.point, attributes, displayFieldName));
      },

      //设置弹出层
      setSearchInfoWindow(point, attributes, displayFieldName){
        let t = this;
        let res = t.setSearchInfoStyle(attributes);
        if (res) {
          let searchInfoWindow = new BMapLib.SearchInfoWindow(t.map, res || '无数据', {
            title: '<sapn style="font-size:16px" ><b title="' + (attributes[displayFieldName] || '') + '">' + (attributes[displayFieldName] || '') + '</b>' + '</span>',             //标题
            width: '450',
            height: 'auto',
            enableAutoPan: true,
            enableSendToPhone: false,
            searchTypes: []
          });
          let m = new BMap.Marker(point, {
            offset: new BMap.Size(-attributes[displayFieldName].length * 6, 48)
          });
          searchInfoWindow.open(m);
        }
//        let t = this;
//        let path = RequestHandle.getRequestUrl('');
//        let url = path + '?code=' + attributes['code'];
//        let params = {url: url, type: 'GET', pms: null};
//        RequestHandle.request(params, function (result) {
//          let res = t.setSearchInfoStyle(result.obj);
//          if (res) {
//            let searchInfoWindow = new BMapLib.SearchInfoWindow(t.map, res || '无数据', {
//              title: '<sapn style="font-size:16px" ><b title="' + (attributes[displayFieldName] || '') + '">' + (attributes[displayFieldName] || '') + '</b>' + '</span>',             //标题
//              width: '120',
//              height: 'auto',
//              enableAutoPan: true,
//              enableSendToPhone: false,
//              searchTypes: []
//            });
//            searchInfoWindow.open(point);
//          }
//        }, function (e) {
//          console.error(e);
//        });
      },

      //设置弹出层样式
      setSearchInfoStyle(attributes){
        let url = undefined;
        if (attributes.hasOwnProperty('gridcode')) {
          switch (parseInt(this.checkLayerIndex)) {
            case 0:
              url = 'static/alert3/one.html' + '?gridcode=' + attributes.gridcode;
              break;
            case 1:
              url = 'static/alert3/two.html' + '?gridcode=' + attributes.gridcode;
              break;
            case 2:
              url = 'static/alert3/three.html' + '?gridcode=' + attributes.gridcode;
              break;
          }
        }
        return url ? '<iframe style="height:100%;min-height: 260px;width:100%;border:none;" src="' + url + '"></iframe>' : undefined;
      },

      //获取面数据
      getBdPolygon(data) {
        let rtValue = [];
        let features = data.features || [];
        for (let i = 0, length = features.length; i < length; i++) {
          let feature = features[i];
          let attributes = feature.attributes || {};
          let geometry = feature.geometry;
          let rings = geometry.rings || [];
//          rtValue.push({attributes: attributes, geometry: this.ringsTransform(rings)});//坐标转换
          rtValue.push({attributes: attributes, geometry: rings});//转换后坐标
        }
        return rtValue
      },

      //面图层转换
      ringsTransform: function (data) {
        if (!data) {
          return undefined;
        }
        let rtValue = [];
        for (let i = 0, length = data.length; i < length; i++) {
          let item = data[i];
          if (Array.isArray(item)) {
            let bdPoints = this.wgsPointToBd(data[i]);
            rtValue.push(bdPoints);
          }
        }
        return rtValue;
      },

      //WGS坐标转百度坐标
      wgsPointToBd: function (data) {
        let lsTransPoints = [];
        if (!this.convert) {
          this.convert = new BMap.Convertor();
        }
        for (let i = 0, length = data.length; i < length; i++) {
          let pts = data[i];
          let transPoint = this.transformFun(pts);
          let bdPoint = new BMap.Point(transPoint[0], transPoint[1]);
          lsTransPoints.push(bdPoint);
        }
        return lsTransPoints;
      },

      //坐标转换
      transformFun: function (path) {
        let gcPoint = Coordtransform.wgs84togcj02(path[0], path[1]);
        return Coordtransform.gcj02tobd09(gcPoint[0], gcPoint[1]);
      },

      //获取面字符串
      getStringPolygon: function (ring) {
        let rtValue = '';
        for (let i = 0; i < ring.length; i++) {
          let pt = ring[i];
          if (rtValue === '') {
            rtValue = (pt.lng || pt[0]) + ',' + (pt.lat || pt[1]);
          } else {
            rtValue += ';' + (pt.lng || pt[0]) + ',' + (pt.lat || pt[1]);
          }
        }
        return rtValue;
      },

      //获取随机颜色
      getRandomColor: function () {
        return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6);
      },

      //获取等级颜色
      getLeaveColor: function (type) {
        let sle = {};
        switch (type) {
          case 0:
            sle = {strokeWeight: 1, strokeStyle: 'dashed', strokeColor: '#0070CE', fillColor: '#2D96EF', fillOpacity: 0.2};
            break;
          case 1:
            sle = {strokeWeight: 1, strokeStyle: 'dashed', strokeColor: '#1C7B2A', fillColor: '#6FB779', fillOpacity: 0.2};
            break;
          case 2:
            sle = {strokeWeight: 1, strokeStyle: 'dashed', strokeColor: '#8441c9', fillColor: '#E8AAFF', fillOpacity: 0.2};
            break;
        }
        return sle;
      }
    }
  }

</script>
