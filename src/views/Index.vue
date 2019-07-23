<template>
    <div class="indexwarp">
        <!--首页部分-->
        <v-header></v-header>
        <!--地图部分-->
        <main-map></main-map>
        <!--应急信息-->
        <public-info></public-info>
        <!--右侧面板-->
        <indexpanel></indexpanel>
    </div>
</template>

<script>
    import MainMap from '@/map/MainMap' //0809
    import indexpanel from '@/components/index_new'
    import publicInfo from '@/components/PublicInformation'//应急信息

    export default {
        name: 'index',
        data() {
            return {
                stateType: 1,
                fullscreenLoading: false
            }
        },
        created(){
        	let t = this;
			if(!this.getlocal('userInfo')){
                t.$router.push('/Login')
			}
        },
        mounted() {
            this.openFullScreen()
        },
        methods: {
            //加载动画
            openFullScreen() {
                this.fullscreenLoading = true;
                //
                setTimeout(() => {
                    this.fullscreenLoading = false;
                }, 2000);
            },
            //获取本地
		    getlocal(name) {
		        let data = sessionStorage.getItem(name)
		        if (data != null && data != '') {
		            try {
		                let obj = eval('(' + data + ')')
		                return obj
		            } catch (e) {
		                return ''
		            }
		        } else {
		            return ''
		        }
		    },
        },
        components: {MainMap, indexpanel,publicInfo}
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .indexwarp {
        width: 100%;
        height: 100%;
        position: relative;
        .v-video {
            position: absolute;
            top: 200px;
            left: 200px;
        }
        .fliex {
            position: fixed;
            right: 50px;
            top: 68%;
        }
    }
</style>
