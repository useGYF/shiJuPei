<template>
  <div class="map-handle">
    <ul class="map-handle_ul">
      <li v-for="(value,index) in handleItems" :class="{activeColor:value.isActive}" v-show="value.hasVisible" :data-index="index" :data-type="value.type" @click="liClickEvent">
        <img :title="value.name" :src="value.src" v-if="!value.isActive">
        <img :src="value.checked" alt="" v-if="value.isActive">
        <span>{{value.name}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
  import {bus} from '@/js/bus.js'
  export default {
    name: 'MapHandle',
    data () {
      return {
        //map: undefined,
        handleItems: [
          {
            name: '放大',
            type: 'ZOOMIN',
            src: 'static/imgs/mapGJ/ceju.png',
            checked: 'static/imgs/mapGJ/ceju1.png',
            hasVisible: false,
            isActive: false,
          }, {
            name: '缩小',
            type: 'ZOOMOUT',
            src: 'static/imgs/mapGJ/zhuashou.png',
            checked: 'static/imgs/mapGJ/zhuashou1.png',
            hasVisible: false,
            isActive: false,
          }, {
            name: '量算',
            type: 'LENGTH',
            src: 'static/imgs/toor/icon_Ruler_1.png',
            checked: 'static/imgs/toor/icon_Ruler_2.png',
            hasVisible: true,
            isActive: false,
          }, {
            name: '抓取',
            type: 'HANDLE',
            src: 'static/imgs/toor/icon_hand_1.png',
            checked: 'static/imgs/toor/icon_hand_2.png',
            hasVisible: true,
            isActive: false,
          }, {
            name: '原范围',
            type: 'EXTENT',
            src: 'static/imgs/toor/icon_Location_1.png',
            checked: 'static/imgs/toor/icon_Location_2.png',
            hasVisible: true,
            isActive: false,
          }, {
            name: '全屏',
            type: 'FULL',
            src: 'static/imgs/toor/icon_quanping_1.png',
            checked: 'static/imgs/toor/icon_quanping_2.png',
            hasVisible: true,
            isActive: false,
          }, {
            name: '圈选',
            type: 'REGION',
            src: 'static/imgs/toor/icon_region_1.png',
            checked: 'static/imgs/toor/icon_region_2.png',
            hasVisible: true,
            isActive: false,
          }
        ],
        styleOptions: {
          strokeColor: "#ff0000",    //边线颜色。
          fillColor: "#ff0000",      //填充颜色。当参数为空时，圆形将没有填充效果。
          strokeWeight: 2,       //边线的宽度，以像素为单位。
          strokeOpacity: 1,	   //边线透明度，取值范围0 - 1。
          fillOpacity: 0.3,      //填充的透明度，取值范围0 - 1。
          strokeStyle: 'dashed' //边线的样式，solid或dashed。
        }
      };
    },
    beforeCreate(){
    },
    created(){
    },
    mounted(){
      bus.$once('setToolMap', this.getMap);
    },
    methods: {
      getMap(map){
        this.map = map;
        if (this.map) {
          this.$parent.drawingManager = new BMapLib.DrawingManager(this.map, {
            isOpen: false, //是否开启绘制模式
            enableDrawingTool: false, //是否显示工具栏
            drawingToolOptions: {
              anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
              offset: new BMap.Size(5, 5), //偏离值
            },
            circleOptions: this.styleOptions, //圆的样式
            polylineOptions: this.styleOptions, //线的样式
            polygonOptions: this.styleOptions, //多边形的样式
            rectangleOptions: this.styleOptions //矩形的样式
          });
          this.$parent.drawingManager.addEventListener('circlecomplete', this.circleCompleteEvent);
          this.$parent.drawOverlay = [];
        }
      },

      liClickEvent(e){
        //this.resetImg();
        Object.assign(this.$data, this.$options.data());
        let childElement = e.currentTarget;
        let qel = jQuery(childElement);
        let imgElement = childElement.querySelector('img');
        let index = childElement.getAttribute('data-index');
        let targets = this.$data.handleItems;
        let item = targets[index];
        item.isActive = true;
        qel.hasClass('activeColor') ? (qel.removeClass('activeColor')) : (qel.addClass('activeColor').siblings().removeClass('activeColor'));
        qel.hasClass('activeColor') ? imgElement.src = item.checked : imgElement.src = item.src;
        let type = childElement.getAttribute('data-type');
        if (this.map) {
          if (type.toUpperCase() !== 'LENGTH')
            this.$parent.distanceTool && (this.$parent.distanceTool.close());
          if (type.toUpperCase() !== 'REGION')
            this.$parent.drawingManager && (this.clearOverlay(), this.$parent.drawingManager._close());
          let zoom = this.map.getZoom();
          switch (type.toUpperCase()) {
            case 'ZOOMIN':
              this.map.setZoom(zoom + 1);
              break;
            case 'ZOOMOUT':
              this.map.setZoom(zoom - 1);
              break;
            case 'EXTENT':
              this.map.centerAndZoom('廊坊', 10);
              break;
            case 'HANDLE':
              this.map.setDefaultCursor();
              this.clearOverlay();
              if (this.$parent.drawingManager && this.$parent.drawingManager._isOpen) {
                this.$parent.drawingManager._close();
              }
              break;
            case 'LENGTH':
              this.$parent.distanceTool = new BMapLib.DistanceTool(this.map, {lineStroke: 2});
              this.$parent.distanceTool.open();
              break;
            case 'FULL':
              this.fullScreen(this.map.getContainer());
              break;
            case 'REGION':
              if (this.$parent.drawingManager) {
                this.$parent.drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
                this.$parent.drawingManager._isOpen ? this.$parent.drawingManager._close() : this.$parent.drawingManager._open();
              }
              break;
          }
        }
        this.resetImg();
      },

      resetImg(){
        let targets = this.$data.handleItems;
        jQuery.find('.map-handle li').forEach(function (value, index) {
          value.style.backgroundColor = '#fff';
        });
        jQuery.find('.map-handle li>img').forEach(function (value, index) {
//          let target = targets[index];
//          value && (value.src = target.src);
        })
      },

      fullScreen(docElm) {
        //W3C
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        }
        //FireFox
        else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        }
        //Chrome等
        else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        }
        //IE11
        else if (docElm.msRequestFullscreen) {
          docElm.msRequestFullscreen();
        }
      },

      circleCompleteEvent(e, overlay){
        const t = this;
        this.clearOverlay();
        overlay.getRadius() > 6000 && overlay.setRadius(6000);
        let radiusLabel = new BMap.Label(`<div style="border-radius: 5px">当前半径：${parseInt(overlay.getRadius()/1000)}公里</div>`,{
          position:overlay.getBounds().getNorthEast()
        });
        radiusLabel.setStyle({
          color:'#000',
          backgroundColor:'#fff',
          border:'solid 1px #ccc',
          padding:'0 5px'
        });

        overlay.addEventListener('click',function(){
          bus.$emit('geoSearch', overlay);
        });
        overlay.addEventListener('mouseover',function(){
          t.$parent.drawingManager._close();
        });

        overlay.addEventListener('mouseout',function(){
          t.$parent.drawingManager._open();
        });

        this.$parent.drawOverlay.push(overlay);
        this.$parent.drawOverlay.push(radiusLabel);

        this.map.addOverlay(overlay);
        this.map.addOverlay(radiusLabel);
        // bus.$emit('geoSearch', overlay);
      },

      clearOverlay(){
        // for (let i = 0, length = this.$parent.drawOverlay.length; i < length; i++) {
        //   this.map.removeOverlay(this.$parent.drawOverlay[i]);
        // }
        const t = this;
        t.$parent.drawOverlay.forEach(v=>(t.map.removeOverlay(v)));
        t.$parent.drawOverlay.length = 0;
      },
    }
  };
</script>
<style lang="scss" scoped>
  .map-handle {
    position: absolute;
    height: 36px;
    z-index: 1;
  }

  .active {
    background: #1080cc !important;
    color: #fff;
  }

  .activeColor span {
    color: #2494F2;
  }

  span {
    display: inline-block;
    width: 60px;
    text-align: left;
    padding-left: 5px;
    color: #333;
  }

  .map-handle ul {
    height: auto;
    box-shadow: 0 3px 5px #ccc;
    border-top: none;
  }

  .map-handle li {
    background: #fff;
    list-style: none;
    height: 38px;
    width: 104px;
  }

  .map-handle li:hover {
    cursor: pointer;
  }

  .map-handle li img {
    margin-left: 10px;
  }
</style>
