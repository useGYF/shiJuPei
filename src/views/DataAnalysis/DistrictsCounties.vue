<template>
    <div class="DistrictsCounties">
        <!--区县打分-->
        <v-header></v-header>
        <iframe
                frameborder="0"
                width="100%"
                height="100%"
                :src="DistrictsCountiesUrl"
                scrolling="no"
        >

        </iframe>
    </div>
</template>

<script>
    export default {
        name: 'DistrictsCounties',
        data() {
            return {
                DistrictsCountiesUrl: 'http://60.10.135.153:3005/api/v1/lf_palm/quxiandafen_page_load_api',
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
                }, 4000);
            }
        }
    }

</script>

<style lang="scss" scope>
    .DistrictsCounties {
        width: 100%;
        height: calc(100% - 64px);
    }
</style>