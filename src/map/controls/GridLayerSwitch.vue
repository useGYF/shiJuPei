<template>
  <div class="grid-switch-content">
    <ul>
      <li v-for="(item,index) in target" :data-type="item.value" @click="liClickEvent">{{item.name}}</li>
    </ul>
  </div>
</template>
<script>
  import {bus} from '@/js/bus.js'

  export default {
    name: 'GridLayerSwitch',
    data () {
      return {
        target: [
          {
            name: 'SO2治理需求分布',
            value: 'SO2_120',
            hasChecked: true
          }, {
            name: 'CO治理需求分布',
            value: 'CO_120',
            hasChecked: false
          }, {
            name: 'Nox治理需求分布',
            value: 'NOX_120',
            hasChecked: false
          }
        ]
      };
    },
    created(){
    },
    methods: {
      liClickEvent(e){
        let element = e.currentTarget;
        if (element) {
          this.resetLi();
          let type = element.getAttribute('data-type');
          element.style.backgroundColor = '#fff';
          element.style.color = '#1080CC';
          bus.$emit('gridLayerRefresh', type.toUpperCase())
        }
      },
      resetLi(){
        jQuery.find('.grid-switch-content li').forEach(function (value, index) {
          value.style.backgroundColor = '#1080CC';
          value.style.color = '#fff';
        });
      }
    }
  };
</script>
<style scoped>
  .grid-switch-content {
    position: absolute;
    height: 37px;
    z-index: 1;
    top: 20px;
    left: 360px;
  }

  .grid-switch-content ul {
    height: 37px;
    border: solid 1px #1080CC;
  }

  .grid-switch-content li {
    list-style: none;
    float: left;
    height: 35px;
    width: 120px;
    line-height: 35px;
    color: #fff;
    background-color: #1080CC;
  }

  .grid-switch-content li:hover{
    cursor:pointer;
  }

  .grid-switch-content li:first-child {
    color: #1080CC;
    background-color: #fff;
  }
</style>
