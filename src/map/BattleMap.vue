<template>
  <div class="batter-map-content">
    <div id="batter_map" style="width:426px;height:100%"></div>
    <div class="btn-index"></div>
    <battle-handle></battle-handle>
  </div>
</template>
<script>
  import BMap from 'BMap'
  import LayerSwitch from '@/map/controls/LayerSwitch'
  import BattleHandle from '@/map/Handle/BattleHandle'
  import MapHandle from '@/map/controls/MapHandle'
  import {bus} from '@/js/bus.js'

  export default {
    name: 'BattleMap',
    data() {
      return {
        zoom: 13
      };
    },
    mounted() {
      this.ready();
    },
    methods: {
      ready() {
        let map = new BMap.Map('batter_map', {enableMapClick: false});
        map.centerAndZoom('廊坊', 10);
        map.enableScrollWheelZoom();
        mapStyle && map.setMapStyle({style: 'midnight'});
        this.map = map;
        let t = this;

        map.addEventListener('tilesloaded', function () {
          bus.$emit('setButtleMap', map);
        });
      }
    },
    components: {LayerSwitch, BattleHandle, MapHandle}
  };
</script>
<style scoped>
  .main-map-content {
    height: calc(100% - 56px);
    width: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    position: relative;
  }

  #main_map {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    position: absolute;
  }
</style>
