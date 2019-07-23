<template>
  <div class="main-map-content">
    <div id="main_map"></div>
    <main-layer-handle></main-layer-handle>
    <el-dialog title="" :visible.sync="dialogVisible" size="large" width="90%" top="2%" @close="dialogCloseEvent">
      <div class="target-panel">
        <ul>
          <li v-for="(v,i) in meanOptions" v-show="v.visible">
            <span>{{v.fieldName}}</span>
            <el-select size="small" class="el-select" v-model="v.checkedName" @change="changeEvent(v)">
              <el-option v-for="(c,j) in v.childs" :label="c.text" :value="c.fieldName"></el-option>
            </el-select>
          </li>
          <li>
            <el-date-picker size="small" v-model="startTime" format="yyyy-MM-dd hh:00:00" type="datetime" placeholder="选择日期"></el-date-picker>
            <el-date-picker size="small" v-model="endTime" format="yyyy-MM-dd hh:00:00" type="datetime" placeholder="选择日期"></el-date-picker>
            <el-button size="small" type="primary" icon="search" @click="btnSearchEvent">搜索</el-button>
          </li>
        </ul>
      </div>
      <div id="search_char"></div>
    </el-dialog>
    <history-handle></history-handle>
  </div>
</template>
<script>
  import BMap from 'BMap'
  import MainLayerHandle from '@/map/controls/MainLayerHandleNew'
  import MapHandle from '@/map/controls/MapHandle'
  import HistoryHandle from '@/map/controls/HistoryHandle'
  import RequestHandle from '@/request/'
  import {bus} from '@/js/bus.js'

  export default {
    name: 'MainMap',
    data() {
      return {
        zoom: 13,
        dialogVisible: false,
        map: undefined,
        distanceTool: undefined,
        drawingManager: undefined,
        charPanel: undefined,
        startTime: undefined,
        endTime: undefined,
        searchSource: undefined,
        factorSource: [],
        drawOverlay: [],
        targetSource: [],
        meanOptions: [
          {
            name: 'layer_gs',
            fieldName: '国省控监测点',
            visible: true,
            checkedName: 'aqi',
            childs: [{
              text: 'AQI',
              fieldName: 'aqi'
            }, {
              text: 'PM2.5',
              fieldName: 'pm25'
            }, {
              text: 'PM10',
              fieldName: 'pm10'
            }, {
              text: 'SO2',
              fieldName: 'so2'
            }, {
              text: 'NO2',
              fieldName: 'no2'
            }, {
              text: 'CO',
              fieldName: 'co'
            }, {
              text: 'O3',
              fieldName: 'o3'
            }, {
              text: '综指',
              fieldName: 'complexindex'
            }, {
              text: '温度',
              fieldName: 'temp'
            }, {
              text: '湿度',
              fieldName: 'humi'
            }, {
              text: '风力',
              fieldName: 'windspeed'
            }, {
              text: '风向',
              fieldName: 'windangle'
            }]
          }, {
            name: 'layer_cgq_lcs',
            checkedName: 'aqi',
            fieldName: '六参数传感器',
            visible: false,
            childs: [{
              text: 'AQI',
              fieldName: 'aqi'
            }, {
              text: 'PM2.5',
              fieldName: 'pm25'
            }, {
              text: 'PM10',
              fieldName: 'pm10'
            }, {
              text: 'SO2',
              fieldName: 'so2'
            }, {
              text: 'NO2',
              fieldName: 'no2'
            }, {
              text: 'CO',
              fieldName: 'co'
            }, {
              text: 'O3',
              fieldName: 'o3'
            }]
          }, {
            name: 'layer_gd',
            checkedName: 'pm25',
            fieldName: '工地扬尘在线',
            visible: false,
            childs: [{
              text: 'PM2.5',
              fieldName: 'pm25'
            }, {
              text: 'PM10',
              fieldName: 'pm10'
            }]
          }, {
            name: 'layer_qy',
            checkedName: 'smoke',
            fieldName: '企业污染源监测',
            visible: false,
            childs: [{
              text: '烟尘',
              fieldName: 'smoke'
            }, {
              text: 'NOX',
              fieldName: 'nox'
            }, {
              text: 'SO2',
              fieldName: 'so2'
            }]
          }, {
            name: 'layer_cx',
            checkedName: 'pm25',
            fieldName: '城乡',
            visible: false,
            childs: [{
              text: 'PM2.5',
              fieldName: 'pm25'
            }, {
              text: 'SO2',
              fieldName: 'so2'
            }]
          }, {
            name: 'layer_cgx_voc',
            checkedName: 'tvoc',
            fieldName: 'TVOC监测点',
            visible: false,
            childs: []
          }]
      };
    },
    mounted() {
      bus.$on('loadSearchChar', this.loadSearchChar);//加载空间查询图表
      this.ready();
    },
    methods: {
      ready() {
        let map = new BMap.Map('main_map', {enableMapClick: false});
        //map.centerAndZoom('廊坊', 10);
        map.centerAndZoom(new BMap.Point(116.703602, 39.518611), 10);
        map.enableScrollWheelZoom();
        mapStyle && map.setMapStyle(mapStyle);
        this.map = map;
        this.$parent.map = map;
        let t = this;
        bus.$emit('setMainMap', t.map);

        map.addEventListener('tilesloaded', function () {
          bus.$emit('setPolygonMap',map);
          bus.$emit('setToolMap', map);
          bus.$emit('setGSMarkerVisible', map.getZoom() <= 9);
          bus.$emit('setMainValueLabel', t.map.getZoom() >= t.zoom);//setMainValueLabel
        });
      },

      loadSearchChar(result, geoSearch, hasFactor) {
        const t = this;
        t.dialogVisible = true;
        t.factorSource = [];
        let gsMenu = t.meanOptions[0];
        let lcsMenu = t.meanOptions[1];
        let gdMenu = t.meanOptions[2];
        let qyMenu = t.meanOptions[3];
        let cxMenu = t.meanOptions[4];
        let vocMenu = t.meanOptions[5];
        lcsMenu.visible = false;
        gdMenu.visible = false;
        qyMenu.visible = false;
        cxMenu.visible = false;
        let gsChecked = geoSearch.find(v => v.layerCode.toUpperCase() === 'LAYER_GS');
        let lcsChecked = geoSearch.find(v => v.layerCode.toUpperCase() === 'LAYER_CGQ_LCS');
        let gdChecked = geoSearch.find(v => v.layerCode.toUpperCase() === 'LAYER_GD');
        let qyChecked = geoSearch.find(v => v.layerCode.toUpperCase() === 'LAYER_QY');
        let vocChecked = geoSearch.find(v => v.layerCode.toUpperCase() === 'LAYER_CGQ_VOC');
        let cxChecked = geoSearch.find(v => v.layerCode.toUpperCase() === 'LAYER_CX');

        gsChecked && (gsMenu.visible = true, gsMenu.checkedName = gsChecked.fieldName);
        lcsChecked && (lcsMenu.visible = true, lcsMenu.checkedName = lcsChecked.fieldName);
        gdChecked && (gdMenu.visible = true, gdMenu.checkedName = gdChecked.fieldName);
        qyChecked && (qyMenu.visible = true, qyMenu.checkedName = qyChecked.fieldName.replace(/Status/g, ''));
        vocChecked && (vocMenu.checkedName = vocChecked.fieldName);
        cxChecked && (cxMenu.visible = true, cxMenu.checkedName = cxChecked.fieldName);

        t.factorSource = geoSearch;
        !hasFactor && (t.factorSource = []);

        setTimeout(function () {
          t.setSearchChar(result);
        }, 500);
      },

      setSearchChar(result) {
        let charDom = document.getElementById('search_char');

        charDom.style.height = document.documentElement.clientHeight * 0.8 + 'px';
        const t = this;
        let hasSelected = {};
        let airData = result.metedata || {};//获取空气质量数据
        let data = (result.data || []).map(v => (v.type.toUpperCase() === 'LAYER_GS' ? (Object.assign(v, airData)) : v));
        let xAxisData = result.legend;//.map(v => ((new Date(v)).getTime()));
        let legendData = data.map((v) => ({name: v.name})) || [];
        legendData.length && (legendData.forEach((v, i) => (hasSelected[v.name] = i < 11)));
        t.searchSource = data;

        !t.charPanel && (t.charPanel = echarts.init(charDom));
        t.charPanel.clear();
        let option = {
          title: {
            text: '',
            show: false
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            type: 'scroll',
            top: 0,
            data: legendData,
            selected: hasSelected
          },
          grid: {
            left: '5%',
            right: '5%',
            top: '8%',
            bottom: '8%',
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData
          },
          yAxis: {
            type: 'value'
          },
          series: t.getSeriesSource(data)
        };
        t.charPanel.setOption(option);
      },

      getSeriesSource(data) {
        let rtValue = [];
        const t = this;
        // let cn = checkedName;
        data.forEach(v => {
          let ops = t.meanOptions.find(m => (m.name.toUpperCase() === v.type.toUpperCase()));
          // console.log(ops);
          // !cn && (cn = ops.checkedName);
          let hasWind = ops.checkedName === 'windangle' || ops.checkedName === 'windspeed';
          rtValue.push({
            name: v.name,
            id: v.code,
            type: 'line',
            data: hasWind ? (v.windspeed.map((w, i) => ({value: w, symbolRotate: (180 - v.windangle[i]) || 0}))) : v[ops.checkedName],
            symbol: hasWind ? 'path://m0,80l50,-20l50,20l-50,-80z' : 'emptyCircle',
            symbolSize: hasWind ? 12 : 4
          });
        });
        return rtValue;
      },

      changeEvent(item) {
        const t = this;
        let targetSource = t.searchSource.filter(v => (v.type.toUpperCase() === item.name.toUpperCase()));
        let seriesSource = t.getSeriesSource(targetSource);
        t.charPanel.setOption({
          series: seriesSource
        });
      },

      btnSearchEvent() {
        const t = this;
        let urlTM = RequestHandle.getRequestUrl('MAPGEOSEARCH');
        if (t.startTime && t.endTime) {
          RequestHandle.request({
            url: urlTM,
            type: 'POST',
            pms: {Id: t.factorSource.map(v => v.Id), BeginTime: t.dateFormat(t.startTime), EndTime: t.dateFormat(t.endTime)}
          }, function (result) {
            t.setSearchChar(result.obj);
          }, ex => console.log(ex));
        }
      },

      dialogCloseEvent() {
        this.meanOptions.forEach(v => {
          v.childs.length && (v.checkedName = v.childs[0].fieldName);
        })
      },

      dateFormat(t) {
        return t.getFullYear() + '-'
          + ((t.getMonth() + 1) > 9 ? (t.getMonth() + 1) : ('0' + (t.getMonth() + 1))) + '-'
          + (t.getDate() > 9 ? t.getDate() : ('0' + t.getDate())) + ' '
          + (t.getHours() > 9 ? t.getHours() : ('0' + (t.getHours()))) + ':00:00';
      }
    },
    components: {MainLayerHandle, MapHandle, HistoryHandle}
  };
</script>
<style scoped>
  .main-map-content {
    height: calc(100% - 56px);
    width: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    position: absolute;
  }

  #main_map {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    position: absolute;
  }

  .target-panel {
    margin-top: -30px;
    padding: 0;
    height: 30px;
  }

  .target-panel ul, li {
    list-style: none;
  }

  .target-panel li {
    margin: 0 5px;
    float: left;
  }

  .el-select {
    width: 85px;
  }
</style>
