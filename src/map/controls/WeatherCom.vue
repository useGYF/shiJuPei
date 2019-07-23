<template>
  <div class="weather_panel">
    <div class="weather_ang" :style="'background-image:url('+windAngleSrc+')'"></div>
    <div class="weather_des">{{windDescription}}</div>
  </div>
</template>

<script>
  import ax from '@/api/index'

  export default {
    name: "Weather",
    data() {
      return {
        windAngleSrc: 'static/imgs/wind/北-0.png',
        windDescription: '北风一级'
      }
    },
    created() {
      this.ready();
    },
    mounted() {

    },
    methods: {
      ready() {
        const t = this;
        ax.GetLfAirData().then(result => {
          let res = result.data;
          if(res.Status){
            let dt = res.Data;
            let wd = dt.wd.replace(/风/g,'');
            let wl = parseInt(dt.wl) - 1;//dt.wl.replace(/级/g,'');
            t.windDescription = dt.wd + dt.wl;
            t.windAngleSrc = 'static/imgs/wind/' + wd + '-' + (wl > 6 ? 5 : wl) + '.png';
          }
        }).catch(ex => {
        });
      }
    }
  }
</script>

<style scoped>
  .weather_panel {
    position: absolute;
    background: #fff;
  }

  .weather_panel div {
    float: left;
    color: #333;
    height: 46px;
  }

  .weather_panel .weather_ang {
    width: 46px;
    background-repeat: no-repeat;
    background-position: center;
  }

  .weather_panel .weather_des {
    height: 32px;
    width: 83px;
    float: left;
    margin:7px 0;
    line-height: 32px;
    border-left: solid 1px #ccc;
  }
</style>
