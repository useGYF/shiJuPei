<script>
  import BMap from 'BMap'
  import {bus} from '@/js/bus.js'

  export default {
    name: 'hello',
    render(){
    },
    data () {
      return {
        hotLayer: undefined,
        hasVisible: true,
        checkedName: 'AQI',
        data: [],
        hotConfig: {
          radius: 20
        }
      };
    },
    props: ['charUrl'],
    created(){
    },
    mounted(){
      this.ready();
    },
    methods: {
      ready(){
        //bus.$on('tilesSenseLoaded', this.getMap);
        bus.$once('loadHotLayer', this.loadHotLayer);
        bus.$on('setHotLayerVisible', this.hotLayerToggle);
        bus.$on('hotLayerTarget', this.pollutionTarget);
        bus.$on('refreshHotLayer',this.refreshLayer);
      },

      //获取Map
      getMap(map){
        if (!this.map) {
          this.map = map;
        }
      },

      //加载热力图
      loadHotLayer(map, data){
//        console.log('hot'+this.hasVisible);
        if (!this.data.length) {
          this.data = data;
        }
        this.map = map;
        let dt = this.getPollutionByType(this.checkedName);
        if (!this.hotLayer) {
          this.hotLayer = new BMapLib.HeatmapOverlay(this.hotConfig);
          this.map.addOverlay(this.hotLayer);
          this.hotLayer.setDataSet({data: dt, max: (this.getMaxPollutionByType() || 200)});
          this.hasVisible ? this.hotLayer.show() : this.hotLayer.hide();
        }
      },

      //污染指标切换
      pollutionTarget(type){
//        console.log(type);
        this.checkedName = type;
        let dt = this.getPollutionByType(type);
        if (dt.length) {
          this.refreshLayer(dt);
        }
      },

      //刷新热力图
      refreshLayer(data){
        if (this.hotLayer) {
          this.clearHotLayer();
          this.loadHotLayer(this.map, data);
        }
      },

      //根据切换指标类型获取热力图渲染对象
      getPollutionByType(type){
        let rtValue = [];
        if (this.data) {
          for (let i = 0, length = this.data.length; i < length; i++) {
            let item = this.data[i];
            let obj = {'lng': item.longitude, 'lat': item.latitude, 'count': item[type.toLowerCase()]};
            rtValue.push(obj);
          }
        }
        return rtValue;
      },

      //清除热力图图层
      clearHotLayer(){
        if (this.hotLayer) {
          this.map.removeOverlay(this.hotLayer);
          this.hotLayer = undefined;
        }
      },

      //图层显隐性切换
      hotLayerToggle(hasVisible){
        this.hasVisible = hasVisible;
        if (this.hotLayer) {
          hasVisible ? this.hotLayer.show() : this.hotLayer.hide();
        }
      },

      //获取切换指标变红临界值
      getMaxPollutionByType(){
          let rtValue = undefined;
          if(this.checkedName){
              switch(this.checkedName.toUpperCase()){
                case 'AQI':
                  rtValue = 200;
                    break;
                case 'PM25':
                  rtValue = 150;
                  break;
                case 'PM10':
                  rtValue = 350;
                  break;
                case 'SO2':
                  rtValue = 800;
                  break;
                case 'NO2':
                  rtValue = 280;
                  break;
                case 'CO':
                  rtValue = 24;
                  break;
                case 'O3':
                  rtValue = 265;
                  break;
              }
          }
          return rtValue;
      }
    }
  };
</script>
<style scoped>
</style>
