<script>
  import BMap from 'BMap'
  import Axios from 'axios'
  import {bus} from '@/js/bus.js'

  export default {
    name: 'BdLabel',
    render() {
    },
    data() {
      return {
        labels: [{
          name: '一级网格',
          hasVisible: true,
          maxZoom: 12,
          minZoom: 0,
          url: '/static/data/YL.json',
          icon: '',
          geometry: []
        }, {
          name: '二级网格',
          hasVisible: false,
          maxZoom: 15,
          minZoom: 12,
          url: '/static/data/EL.json',
          icon: '',
          geometry: []
        }],
        checkedLabel: undefined,
        hasLoad: false
      }
    },
    created() {
    },
    mounted() {
      this.ready()
    },
    methods: {
      ready() {
        let t = this;
        bus.$on('getMap', this.getMap);
        bus.$on('getSenseMap', this.getMap);
        bus.$on('getDustMap', this.getMap);
        //bus.$on('tilesLoaded', this.labelInit)
        bus.$on('setLabelVisible', this.setLabelVisible);
        setTimeout(function () {
          t.labelInit();
        }, 10);

//      bus.$on('getSenseMap', this.getMap)
//      bus.$on('tilesSenseLoaded', this.labelInit)
        //bus.$on('setLabelVisible', this.setLabelVisible)
      },
      getMap(map){
        this.map = map;
      },
      labelInit() {
        if (this.map) {
          bus.$on('getMap', this.getMap);
          bus.$on('getSenseMap', this.getMap);
          bus.$on('getDustMap', this.getMap);
        }
        if (this.hasLoad) {
          this.setLabelVisibleByZoom();
          return false;
        }
        this.hasLoad = true;
        let t = this;
        for (let i = 0, length = this.labels.length; i < length; i++) {
          let label = this.labels[i];
          let url = label.url;
          let visible = label.hasVisible;
          Axios({
            url: url,
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: {}
          }).then(function (result) {
            if (result.status === 200) {
              t.createLabel(result.data, label.geometry, visible);
            }
          }).catch(function (e) {
            console.error('Request Error:url:' + url);
          })
        }
      },
      setLabelVisibleByZoom() {
        let zoom = this.map.getZoom();
        if (this.checkedLabel) {
          let minZoom = this.checkedLabel.minZoom;
          let maxZoom = this.checkedLabel.maxZoom;
          let hasVisible = zoom > minZoom && zoom <= maxZoom;
          let geometry = this.checkedLabel.geometry;
          for (let i = 0, length = geometry.length; i < length; i++) {
            hasVisible ? geometry[i].show() : geometry[i].hide();
          }
        }
      },
      setLabelVisible(index) {
        this.setLabelHide();
        let ckLabel = this.labels[index];
        this.checkedLabel = ckLabel;
        let geometrys = ckLabel.geometry;
        for (let i = 0, length = geometrys.length; i < length; i++) {
          geometrys[i].show();
        }
      },
      createLabel(data, label, hasVisible) {
        data = typeof data === 'string' ? JSON.parse(data) : data;
        let ft = data.features;
        let displayField = data.displayFieldName;
        let labelStyle = {
          color: '#333',
          fontSize: '12px',
          height: '20px',
          backgroundColor: 'none',
          border: 'none',
          lineHeight: '20px',
          fontFamily: '微软雅黑'
        };
        for (let i = 0, length = ft.length; i < length; i++) {
          let feature = ft[i];
          let attributes = feature.attributes;
          let geometry = feature.geometry;
          let pt = new BMap.Point(geometry.x, geometry.y);
          let l = new BMap.Label(attributes[displayField], {position: pt});
          l.setStyle(labelStyle);
          label.push(l);
          this.map.addOverlay(l);
          hasVisible ? l.show() : l.hide();
        }
      },
      setLabelHide() {
        for (let i = 0, length = this.labels.length; i < length; i++) {
          let geometrys = this.labels[i].geometry;
          for (let j = 0, count = geometrys.length; j < count; j++) {
            geometrys[j].hide();
          }
        }
      }
    }
  }

</script>
