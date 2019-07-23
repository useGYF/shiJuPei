<template>
    <div id="app">
        <!--需要缓存的页面缓存-->
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>

<script>
    import router from './router/index.js'

    export default {
        name: 'app',
        data() {
            return {
                layerId: 0,
            }
        },
        computed: {
            userState() {
                return this.$store.state.userData
            }
        },
        mounted() {
            const _this = this;
            router.beforeEach((to, from, next) => {
                if (!this.$cookies.get('auth')) {
                    next()
                    this.$router.push('/login')
                }
                next();
            });
            if (!this.$cookies.get('auth')) {
                if (window.location.href.indexOf('login') > -1) {
                    return
                } else {
                    this.$router.push('/login')
                }
            } else {
                console.log(2)
            }
 	      //解决IE11路由不跳转
            if ('-ms-scroll-limit' in document.documentElement.style && 
              '-ms-ime-align' in document.documentElement.style) { 
              // detect it's IE11
              console.log('test测试路由跳转');
              window.addEventListener("hashchange", function(event) {
                let currentPath = window.location.hash.slice(1);
                if (_this.$route.path !== currentPath) {
                  router.push(currentPath)
                }
              }, false);
            }
        },
    }
</script>

<style lang="scss">
    @import "styles/tabandprogres";
    //tab切换全局布局
    @import "styles/scrollbar";
    //滚动条全局布局
    @import "styles/baidumap";
    //百度地图全局部分
    @import "styles/elementui";
    //elementui部分全局修改
    @import "styles/rightposition";
    //右侧面板部分样式
    @import "styles/jingbao"; //警报样式
    * {
        margin: 0;
        padding: 0;
    }

    a:hover {
        text-decoration: none;
    }

    p {
        margin: 0 !important;
    }

    ul, ol {
        margin-top: 0 !important;
        margin-bottom: 0px !important;
    }
	.el-submenu .el-menu{
		background: none;
	}
	.el-menu{
		background: none;
	}
    html, body {
        height: 100%;
        border: none;
        #tip-arrow-bottom {
            display: none;
        }
        #tip-arrow-top {
            display: none;
        }
        #trans-tooltip {
            display: none;
        }
        #app {
            font-family: '微软雅黑';
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-align: center;
            height: 100%;
            canvas {
                width: 100% !important;
            }
        }
    }
</style>
