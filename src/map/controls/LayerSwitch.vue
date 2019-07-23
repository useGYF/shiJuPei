<template>
  <div class="layerSwitch">
    <ul>
      <!--<li class="title"><b class="b-icon"></b><span>图层控制</span></li>-->
      <li :id="layers[0].id" data-attr="0" @click="radioClick" class="layer-checked">
        <!--<img :src="imgsrc" alt="">-->
        <div class="circle">
          <div class="circle-mini"></div>
        </div>
        {{layers[0].name}}
        <!--<input data-attr="0" title="" @click="radioClick" name="layer" type="radio" checked/>{{layers[0].name}}-->
        <!--<div class="block layerSwitch-slider">-->
        <!--<el-slider id="slider_0" data-attr="0" v-model="sliderValue0" :disabled="disabledSlider0" @change="sliderChangeEvent"></el-slider>-->
        <!--</div>-->
      </li>
      <li :id="layers[1].id" data-attr="1" @click="radioClick">
       <!-- <img :src="imgsrc" alt="">-->
        <div class="circle">
          <div class="circle-mini"></div>
        </div>
        {{layers[1].name}}
        <!--<input data-attr="1" title="" @click="radioClick" name="layer" type="radio"/>{{layers[1].name}}-->
        <!--<div class="block layerSwitch-slider">-->
        <!--<el-slider id="slider_1" data-attr="1" v-model="sliderValue1" :disabled="disabledSlider1" @change="sliderChangeEvent"></el-slider>-->
        <!--</div>-->
      </li>
      <li :id="layers[2].id" data-attr="2" @click="radioClick">
        <!--<img :src="imgsrc" alt="" v-if="">-->
        <div class="circle">
          <div class="circle-mini"></div>
        </div>
        {{layers[2].name}}
        <!--<input data-attr="2" title="" @click="radioClick" name="layer" type="radio"/>{{layers[2].name}}-->
        <!--<div class="block layerSwitch-slider">-->
        <!--<el-slider id="slider_2" data-attr="2" v-model="sliderValue2" :disabled="disabledSlider2" @change="sliderChangeEvent"></el-slider>-->
        <!--</div>-->
      </li>
    </ul>
    <bd-polygon></bd-polygon>
    <!--<bd-label></bd-label>-->
  </div>
</template>
<script>
  import BdPolygon from '@/map/overlayes/BdPolygon'
  import BdLabel from '@/map/overlayes/BdLabel'
  import {bus} from '@/js/bus.js'

  export default {
    name: 'LayerSwitch',
    data() {
      return {
        sliderValue0: 0,
        sliderValue1: 0,
        sliderValue2: 0,
        disabledSlider0: false,
        disabledSlider1: true,
        disabledSlider2: true,
        checkedId: 0,
        imgsrc: 'static/imgs/toor/icon_network_1.png',
        imgxzsrc: 'static/imgs/toor/icon_network_2.png',
        layers: [
          {
            id: 'YW',
            name: '一级网格',
            url: ''
          }, {
            id: 'EW',
            name: '二级网格',
            url: ''
          }, {
            id: 'SW',
            name: '三级网格',
            url: ''
          }],
        myE:undefined,
        layerId:0
      }
    },
    mounted() {
      this.ready();
      bus.$on('resetLayerLi', this.resetLi);
    },
    activated(){
      this.resetLi();
      //let qel = $('#' + this.$parent.$parent.$parent.$parent.layerId);
      let qel = $('#YW');

      if(qel.length) {
        let ckLayerId = qel[0].getAttribute('data-attr');
        let hasChecked = false;
        (qel.addClass('layer-checked').siblings().removeClass('layer-checked'), hasChecked = true);
        bus.$on('myAjaxLoad', () => {
          bus.$emit('setVisible', ckLayerId, hasChecked);
          //bus.$emit('setLabelVisible', ckLayerId);
        })
      }
    },
    methods: {
      ready() {

      },
      radioClick(e) {
        this.resetLi();
        let el = e.target;
        let img=el.querySelector('img');
        let qel = jQuery(el);
        let ckLayerId = el.getAttribute('data-attr');
        this.$parent.$parent.$parent.$parent.layerId = el.id;
        this.setSliderDisable(ckLayerId);
        this.checkedId = ckLayerId;
        let hasChecked = false;
        qel.hasClass('layer-checked') ? (qel.removeClass('layer-checked')) : (qel.addClass('layer-checked').siblings().removeClass('layer-checked'), hasChecked = true);
        //qel.hasClass('layer-checked')?img.src='static/imgs/toor/icon_network_2.png':img.src='static/imgs/toor/icon_network_1.png';
        bus.$emit('setVisible', ckLayerId, hasChecked);
        bus.$emit('setLabelVisible', ckLayerId);
//        !hasChecked && bus.$emit('setLayerHide',false);
        //$(e.target).addClass('layer-checked').siblings().removeClass('layer-checked');
      },
      setSliderDisable(id){
        this.disabledSlider0 = true;
        this.disabledSlider1 = true;
        this.disabledSlider2 = true;
        if (parseInt(id) === 0) {
          this.disabledSlider0 = false;
        } else if (parseInt(id) === 1) {
          this.disabledSlider1 = false;
        } else if (parseInt(id) === 2) {
          this.disabledSlider2 = false;
        }
      },
      sliderChangeEvent(e){
        bus.$emit('setOpacity', this.checkedId, e === 100 ? 0.001 : 1.0 - e / 100)
      },
      resetLi(hasReset = true){
        jQuery.find('.layerSwitch li').forEach(function (value, index) {
          index !== 0 && (value.style.backgroundColor = '#fff');
          !hasReset && (value.className = '');
        });
      }
    },
    components: {BdPolygon, BdLabel}
  }

</script>
<style lang="scss" scoped>
  .layerSwitch {
    position: absolute;
    bottom: 30px;
    left: 0;
    z-index: 1;
    width: 130px;
    border-radius: 2px;

  }
  .circle{
    height:15px;
    width:15px;
    border-radius: 50%;

    display:inline-block;
    background:white;
    line-height:11px;
  }
  .circle-mini{
    height:9px;
    width:9px;
    background: #ccc;
    border-radius:50%;
    display:inline-block;
  }

  .b-icon {
    height: 18px;
    width: 18px;
    vertical-align: middle;
    margin: 0 5px;
    display: none;
    background: url('/static/imgs/map/layer.png') no-repeat;
  }

  .layerSwitch li:first-child {
    line-height: 36px;
    width: 130px;
    text-align: center;
    margin: 0;
    background-color: #fff;
    font-size: 14px;
  }

  img {
    margin-left: -20px;
    padding-right: 5px;
  }

  .layerSwitch li span {
    font-size: 14px;
    line-height: 36px;
    vertical-align: middle;
    font-family: "Microsoft YaHei UI";
    color: #1080cc;
  }

  .layerSwitch ul {
    width: 130px;
    list-style-type: none;
    padding: 0;
    box-shadow: 0 3px 5px #ccc;
    border-top: none;
  }

  .layerSwitch li {
    width: 130px;
    list-style-type: none;
    text-align: center;
    font-size: 14px;
    margin: 0;
    border-radius: 0;
    color: #333;
    padding: 1px 5px;
    line-height: 36px;
    background-color: #fff;
  }

  .layerSwitch li:hover {
    cursor: pointer;
  }

  .layer-checked {
    color: #1080cc !important;
    .circle{
     // border:1px solid #1080cc !important;
      .circle-mini{
        background:#1080cc !important
      }
    }
  }

  .layerSwitch-slider {
    float: right;
    width: 100px;
    height: 5px;
    margin: -5px 0 0 0;
  }
</style>
