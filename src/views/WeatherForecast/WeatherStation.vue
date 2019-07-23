<template>
    <div class="weatherstation">
        <!--气象站-->
        <v-header></v-header>
        <iframe
                frameborder="0"
                width="100%"
                height="100%"
                :src="WeatherStationUrl"
                scrolling="no"
        >

        </iframe>
    </div>
</template>

<script>
    export default {
        name: 'weatherstation',
        data() {
            return {
                WeatherStationUrl: 'http://222.222.116.203:8090/new/module/weatherpoint.php',
                fullscreenLoading: false
            }
        },
        mounted() {
            this.openFullScreen()
        },
        methods: {
            //加载动画
            openFullScreen() {
                this.fullscreenLoading = true;
                setTimeout(() => {
                    this.fullscreenLoading = false;
                }, 2000);
            }
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .weatherstation {
        width: 100%;
        height: calc(100% - 56px);
        overflow: hidden;
    }
</style>
