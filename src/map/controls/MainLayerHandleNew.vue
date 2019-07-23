<template>
  <div class="ly-tree">
    <div class="t-handle" @click="handleClick">筛选</div>
    <ul>
      <li v-for="(v,i) in treeOption" v-show="v.visible" :id="('LI_'+ v.code)" :style="'background:'+(v.checked ? '#2494F2' : 'rgba(0, 0, 0, 0.6)')" :data-index="i" :data-type="v.code" @click="liClick">
        <div class="t-item">
          <img :title="v.name" class="t-icon" :src="v.checked ? v.checkedSrc : v.src"/>
          <span class="t-text">{{v.name}}</span>
          <select v-show="v.checked" :id="'SELECT_'+v.code" title="" @change="targetChanged" :data-index="i" :style="'display:'+ (v.childs.length ? 'line-block' : 'none')">
            <option v-for="(c,j) in v.childs">{{c.text}}</option>
          </select>
        </div>
      </li>
    </ul>
    <main-handle></main-handle>
  </div>
</template>
<script>
  import MainHandle from '@/map/handle/MainHandle'
  import {bus} from '@/js/bus'

  export default {
    name: 'MainLayerHandleNew',
    data() {
      return {
        treeOption: [
          {
            name: '国省控监测',
            code: 'layer_gs',
            layerIndex: 0,
            checked: true,
            visible: true,
            src: 'static/imgs/main/gs.png',
            checkedSrc: 'static/imgs/main/gs_c.png',
            displayName: 'pointname',
            primaryKey: '',
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
              text: '风向',
              fieldName: 'windangle'
            }, {
              text: '风力',
              fieldName: 'windspeed'
            }]
          }, {
            name: '六参数传感器',
            code: 'layer_cgq_lcs',
            layerIndex: 1,
            checked: false,
            visible: true,
            src: 'static/imgs/main/cg.png',
            checkedSrc: 'static/imgs/main/cg_c.png',
            displayName: 'stationname',
            primaryKey: '',
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
            name: '乡镇空气站监测',
            code: 'layer_cx',
            layerIndex: 3,
            displayName: 'name',
            checked: false,
            visible: true,
            src: 'static/imgs/main/m_cx.png',
            checkedSrc: 'static/imgs/main/cx_c.png',
            primaryKey: '',
            childs: [{
              text: 'PM2.5',
              fieldName: 'pm25'
            }, {
              text: 'SO2',
              fieldName: 'so2'
            },{
              text: '综指',
              fieldName: 'com_index'
            }
            ]
          }, {
            name: '工地扬尘监测',
            code: 'layer_gd',
            layerIndex: 4,
            checked: false,
            visible: true,
            src: 'static/imgs/main/gd.png',
            checkedSrc: 'static/imgs/main/gd_c.png',
            displayName: 'name',
            primaryKey: '',
            childs: [{
              text: 'PM2.5',
              fieldName: 'pm25'
            }, {
              text: 'PM10',
              fieldName: 'pm10'
            }
//          , {
//            text: '温度',
//            fieldName: 'temp'
//          }, {
//            text: '湿度',
//            fieldName: 'humi'
//          }, {
//            text: '风向',
//            fieldName: 'winddirection'
//          }, {
//            text: '风力',
//            fieldName: 'windspeed'
//          }
            ]
          }, {
            name: '企业污染源监测',
            code: 'layer_qy',
            layerIndex: 5,
            checked: false,
            visible: true,
            src: 'static/imgs/main/qy.png',
            checkedSrc: 'static/imgs/main/qy_c.png',
            primaryKey: '',
            childs: [{
              text: '烟尘',
              fieldName: 'smokeStatus'
            }, {
              text: 'NOX',
              fieldName: 'noxStatus'
            }, {
              text: 'SO2',
              fieldName: 'so2Status'
            }]
          }, {
            name: 'TVOC监测',
            code: 'layer_cgq_voc',
            layerIndex: 2,
            checked: false,
            visible: true,
            src: 'static/imgs/mues/sixzb/vocw.png',
            checkedSrc: 'static/imgs/mues/sixzb/vocw_c.png',
            primaryKey: '',
            childs: []
          }, {
            name: '散乱污企业',
            code: 'layer_sp_slw',
            layerIndex: 9,
            checked: false,
            visible: true,
            hasCamera: true,
            cameraType: 4,
            displayName: 'CamName',
            primaryKey: '',
            src: 'static/imgs/mues/video/slw.png',
            checkedSrc: 'static/imgs/mues/video/slw_c.png',
            childs: []
          }, {
            name: 'VOCs企业',
            code: 'layer_sp_voc',
            layerIndex: 10,
            checked: false,
            visible: true,
            hasCamera: true,
            cameraType: 3,
            displayName: 'CamName',
            primaryKey: '',
            src: 'static/imgs/mues/video/voc.png',
            checkedSrc: 'static/imgs/mues/video/voc_c.png',
            childs: []
          }, {
            name: '高空五公里',
            code: 'layer_sp_gkw',
            layerIndex: 11,
            checked: false,
            visible: true,
            hasCamera: true,
            cameraType: 5,
            displayName: 'CamName',
            primaryKey: '',
            src: 'static/imgs/mues/video/gkw.png',
            checkedSrc: 'static/imgs/mues/video/gkw_c.png',
            childs: []
          }, {
            name: '道路路况',
            code: 'layer_lk',
            layerIndex: 8,
            visible: true,
            checked: false,
            src: 'static/imgs/main/lk.png',
            checkedSrc: 'static/imgs/main/lk_c.png',
            primaryKey: '',
            childs: []
          }, {
            name: '大气排放源清单',
            code: 'layer_yqd',
            layerIndex: 6,
            checked: false,
            visible: true,
            src: 'static/imgs/main/yqd.png',
            checkedSrc: 'static/imgs/main/yqd_c.png',
            displayName: 'e',
            primaryKey: '',
            childs: [
                {
                    text: 'SO2',
                    fieldName: 'so2'
                }, {
                text: 'NOX',
                fieldName: 'nox'
              }, {
                text: 'CO',
                fieldName: 'co'
              }, {
                text: 'NH3',
                fieldName: 'nh3'
              }, {
                text: 'PM2.5',
                fieldName: 'pm25'
              }, {
                text: 'PM10',
                fieldName: 'pm10'
              }, {
                text: 'BC',
                fieldName: 'bc'
              }, {
                text: 'OC',
                fieldName: 'oc'
              }, {
                text: 'VOC',
                fieldName: 'voc'
              }
            ]
          }, {
            name: '应急清单',
            code: 'layer_yj',
            layerIndex: 7,
            checked: false,
            visible: true,
            src: 'static/imgs/main/yj.png',
            checkedSrc: 'static/imgs/main/yj_c.png',
            primaryKey: '',
            displayField: 'companyname',
            childs: []
          }, {
            name: '渣土车GPS',
            code: 'layer_zt',
            layerIndex: 12,
            checked: false,
            visible: false,
            src: 'static/imgs/main/zt.png',
            checkedSrc: 'static/imgs/main/zt_c.png',
            primaryKey: '',
            childs: []
          }, {
            name: '环卫车GPS',
            code: 'layer_hw',
            layerIndex: 13,
            checked: false,
            visible: false,
            src: 'static/imgs/main/hw.png',
            checkedSrc: 'static/imgs/main/hw_c.png',
            primaryKey: '',
            childs: []
          }, {
            name: '加油站在线监测',
            code: 'layer_jy',
            layerIndex: 14,
            checked: false,
            visible: false,
            src: 'static/imgs/main/jy.png',
            checkedSrc: 'static/imgs/main/jy_c.png',
            primaryKey: '',
            childs: []
          }, {
            name: '全民举报',
            code: 'layer_qm',
            layerIndex: 15,
            checked: false,
            visible: true,
            src: 'static/imgs/main/qm.png',
            checkedSrc: 'static/imgs/main/qm_c.png',
            primaryKey: '',
            childs: []
          }],
        hasClose: false,
        hasSelect:false,
        checkCount: 1,
        // Adata:[]
      }
    },
    created() {

    },
    mounted() {

    },
    methods: {

      //指标切换点击事件
      liClick(e) {
        let a = 1;
        const _this = this;
        if (e.target.nodeName === 'SELECT' || _this.hasSelect) {
          _this.hasSelect = false;
          return;
        }
        let childElement = e.currentTarget;
        let imgElement = childElement.querySelector('img');
        let index = childElement.getAttribute('data-index');
        let type = childElement.getAttribute('data-type');
        let targets = this.$data.treeOption;
        let item = targets[index];
        let hasChecked = false;
        let cameraType = item.hasCamera ? item.cameraType : undefined;
        let slePollution = document.getElementById('SELECT_' + item.code);
        imgElement.getAttribute('src') !== item.src ? (imgElement.src = item.src, childElement.style.backgroundColor = 'rgba(0, 0, 0, 0.6)') : (imgElement.src = item.checkedSrc, childElement.style.backgroundColor = '#2494F2', hasChecked = true);
        !hasChecked && (slePollution && (slePollution.value = (item.childs.length && item.childs[0].text)));
        //hasChecked ? (slePollution.removeAttribute('disabled'), this.checkCount++) : (slePollution.setAttribute('disabled', hasChecked), this.checkCount--);
        item.childs.length && (item.checked = hasChecked);
        bus.$emit('targetMainLayer', type, hasChecked, cameraType);
        ///动态添加右侧菜单
        if (hasChecked == true && type != 'layer_lk' && type != 'layer_zt' && type != 'layer_hw' && type != 'layer_jy') {
          //添加对应右侧菜单
          switch (type) {
            case 'layer_gs':
              this.$store.state.menuData.unshift({
                title: '国省',
                title_tx: '国省控点',
                show_xs: 'layer_gs',
                url: 'static/imgs/indeximgs/morenimg/icon_fang.png',
                url_one: 'static/imgs/indeximgs/morenimg/icon_fang.png'
              });
              bus.$emit('menuative', '国省');
              break;
            case 'layer_cgq_lcs':
              this.$store.state.menuData.unshift({
                title: '六参',
                title_tx: '六参数',
                show_xs: 'layer_cgq_lcs',
                url: 'static/imgs/indeximgs/morenimg/icon_yuan1.png',
                url_one: 'static/imgs/indeximgs/morenimg/icon_yuan1.png'
              });
                bus.$emit('menuative', '六参');
              break;
            case 'layer_cgq_voc':
              this.$store.state.menuData.unshift({
                title: 'VOC',
                title_tx: 'VOC监测',
                show_xs: 'layer_cgq_voc',
                url: 'static/imgs/indeximgs/morenimg/icon_Triangle_3.png',
                url_one: 'static/imgs/indeximgs/morenimg/icon_Triangle_3.png'
              });
                bus.$emit('menuative', 'VOC');
              break;
            case 'layer_cx':
              this.$store.state.menuData.unshift({
                title: '乡镇',
                title_tx: '乡镇统计',
                show_xs: 'layer_cx',
                url: 'static/imgs/indeximgs/morenimg/icon_ditu2.png',
                url_one: 'static/imgs/indeximgs/morenimg/icon_ditu2.png'
              });
                bus.$emit('menuative', '乡镇');
              break;
            case 'layer_gd':
              this.$store.state.menuData.unshift({
                title: '工地',
                title_tx: '工地扬尘',
                show_xs: 'layer_gd',
                url: 'static/imgs/indeximgs/morenimg/icon_gd.png',
                url_one: 'static/imgs/indeximgs/morenimg/icon_gd.png'
              });
                bus.$emit('menuative', '工地');
              break;
            case 'layer_qy':
              this.$store.state.menuData.unshift({
                title: '企业',
                title_tx: '企业监测',
                show_xs: 'layer_qy',
                url: 'static/imgs/indeximgs/morenimg/icon_enterprise.png',
                url_one: 'static/imgs/indeximgs/morenimg/icon_enterprise.png'
              });
                bus.$emit('menuative', '企业');
              break;
            case 'layer_yqd':
              this.$store.state.menuData.unshift({
                title: '静态',
                title_tx: '大气排放源清单',
                show_xs: 'layer_yqd',
                url: 'static/imgs/indeximgs/morenimg/icon_jiayou.png',
                url_one: 'static/imgs/indeximgs/morenimg/icon_jiayou.png'
              });
                bus.$emit('menuative', '静态');
              break;
            case 'layer_yj':
              this.$store.state.menuData.unshift({
                title: '应急',
                title_tx: '应急清单',
                show_xs: 'layer_yj',
                url: 'static/imgs/indeximgs/morenimg/icon_huanwei.png',
                url_one: 'static/imgs/indeximgs/morenimg/icon_huanwei.png'
              });
                bus.$emit('menuative', '应急');
              break;
            case 'layer_sp_slw':
              this.$store.state.menuData.unshift({
                title: '散乱视频',
                title_tx: '散乱污视频监控',
                show_xs: 'layer_sp_slw',
                url: 'static/imgs/indeximgs/morenimg/slw.png',
                url_one: 'static/imgs/indeximgs/morenimg/slw.png'
              });
                bus.$emit('menuative', '散乱视频');
              break;
            case 'layer_sp_voc':
              this.$store.state.menuData.unshift({
                title: 'VOC视频',
                title_tx: 'VOC视频监控',
                show_xs: 'layer_sp_voc',
                url: 'static/imgs/indeximgs/morenimg/voc.png',
                url_one: 'static/imgs/indeximgs/morenimg/voc.png'
              });
                bus.$emit('menuative', 'VOC视频');
              break;
            case 'layer_sp_gkw':
              this.$store.state.menuData.unshift({
                title: '高空视频',
                title_tx: '高空五公里视频监控',
                show_xs: 'layer_sp_gkw',
                url: 'static/imgs/indeximgs/morenimg/gkw.png',
                url_one: 'static/imgs/indeximgs/morenimg/gkw.png'
              });
                bus.$emit('menuative', '高空视频');
              break;
            case 'layer_qm':
              this.$store.state.menuData.unshift({
                title: '全民举报',
                title_tx: '全民举报',
                show_xs: 'layer_qm',
                url: 'static/imgs/indeximgs/morenimg/quanmin.png',
                url_one: 'static/imgs/indeximgs/morenimg/quanmin.png'
              });
                bus.$emit('menuative', '全民举报');
              break;
              default:
                  bus.$emit('menuative', '统计');
                  break;
          }
          console.log(type);
        } else {
          //删除选项
          let keyarr = _this.$store.state.menuData;
          for (let i = 0; i < keyarr.length; i++) {
            //console.log(keyarr[i]);
            if (keyarr[i].show_xs == type) {
              // console.log('该删除我了')
              console.log(keyarr[i])
              // 删除指定对象
              _this.removeObjWithArr(keyarr, keyarr[i])
            }
          }
        }

      },
      //删除指定对象
      removeObjWithArr(_arr, _obj) {
        let length = _arr.length;
        for (let i = 0; i < length; i++) {
          if (_arr[i] == _obj) {
            if (i == 0) {
              _arr.shift(); //删除并返回数组的第一个元素
              return;
            }
            else if (i == length - 1) {
              _arr.pop();  //删除并返回数组的最后一个元素
              return;
            }
            else {
              _arr.splice(i, 1); //删除下标为i的元素
              return;
            }
          }
        }
      },
      //
      targetChanged(e) {
        this.hasSelect = true;
        let childElement = e.currentTarget;
        let index = childElement.getAttribute('data-index');
        let selectedIndex = childElement.selectedIndex;
        let targets = this.$data.treeOption;
        let item = targets[index];
        let ckItem = item.childs[selectedIndex];
        let displayName = item.displayName;
        let primaryKey = item.primaryKey;
        let type = item.code;
        // console.log(type);
        bus.$emit('targetPollution', type, ckItem.fieldName, displayName, primaryKey);
      },
      //
      handleClick(e) {
        let els = document.getElementsByClassName('t-text');
        if (els.length) {
          for (let i = 0, length = els.length; i < length; i++) {
            els[i].style.width = this.hasClose ? '120px' : '0';
          }
        }
        this.hasClose = !this.hasClose;
      }
    },
    components: {MainHandle}
  };
</script>
<style lang="scss" scoped>
  .ly-tree {
    height: 90%;
    position: absolute;
    margin: 2.5% 0;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    color: #fff;
  }

  li {
    background-color: #fff;
    margin: 0;
    cursor: pointer;
  }

  .t-handle {
    background: #fff;
    color: #2494F2;
    line-height: 38px;
    opacity: 0.8;
    cursor: pointer;
  }

  .t-item {
    position: relative;
    height: 32px;
  }

  .t-item .t-icon {
    float: left;
    display: inline-block;
    margin: 6px 12px;
  }

  .t-item .t-text {
    float: left;
    width: 120px;
    line-height: 32px;
    text-align: left;
    vertical-align: baseline;
    white-space: nowrap;
    overflow: hidden;
    transition: width .5s;
  }

  .t-item select, .t-item option {
    width: 64px;
    height: 32px;
    float: right;
    border: none;
    position: absolute;
  }
</style>
