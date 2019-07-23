<template>
  <div class="grid-map-content">
    <div id="grid_map"></div>
    <div class="grid-legend"></div>
    <!--<map-handle></map-handle>-->
    <bd-grid-layer></bd-grid-layer>
    <grid-layer-switch></grid-layer-switch>
  </div>
</template>
<script>
  import BMap from 'BMap'
  import MapHandle from '@/map/controls/MapHandle'
  import BdGridLayer from '@/map/overlayes/BdGridLayer'
  import GridLayerSwitch from '@/map/controls/GridLayerSwitch'
  import {bus} from '@/js/bus.js'

  export default {
    name: 'GridMapMain',
    data () {
      return {};
    },
    mounted(){
      this.ready();
    },
    methods: {
      ready(){
        let map = new BMap.Map('grid_map', {enableMapClick:false});
        map.centerAndZoom('廊坊', 8);
        map.enableScrollWheelZoom();
        mapStyle && map.setMapStyle(mapStyle);
        this.map = map;

        bus.$emit('getGridMap', map);
        map.addEventListener('tilesloaded', function () {
          bus.$emit('tilesGridLoaded', map);
        });
      }
    },
    components: {MapHandle,BdGridLayer, GridLayerSwitch}
  };
</script>
<style scoped>
  .grid-map-content {
    height: calc(100% - 56px);
    width: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    position: absolute;
  }

  #grid_map {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    position: absolute;
  }

  .grid-legend {
    background-image: url("../../static/imgs/gridlayer/pic-18.png");
    height: 300px;
    width: 50px;
    z-index: 1;
    position: absolute;
    bottom: 50px;
    left: 50px;
  }
</style>
