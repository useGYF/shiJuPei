<template>
    <!--滚动通知栏展示页面-->
    <div class="ScrollBar">
        <div class="ScrollBar_box">
            <div class="t_news_left">
                <b>传感器状态：</b>
                <font>传感器共{{CGQnum}}个，正常{{zcnum}}个，离线{{lxnum}}个</font>
            </div>
            <div class="zhongjian">|</div>
            <div class="t_news swiper_wrap">
                <b style="float: left;line-height: 35px">通知公告：</b>
                <div class="wrapper">
                    <div class="demo3">
                        <ul>
                            <li>11月11日安次区日和印刷厂PM5严重超标！！</li>
                            <li>11月11日广阳区日和印刷厂so2严重超标！！</li>
                            <li>11月11日大厂县日和印刷厂PM10严重超标！！</li>
                            <li>11月11日三河市日和印刷厂co严重超标！！</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                //页面数据
                CGQnum: '188',//
                zcnum: '178',//
                lxnum: '10',//

            };
        },
        created() {
            //created 创建完毕状态====

        },
        beforeMount() {
            //beforeMount 挂载前状态===

        },
        mounted() {
            $('.demo1').easyTicker({
                direction: 'up',
                easing: 'swing'
            });
            $('.demo3').easyTicker({
                visible: 1,
                interval: 4000
            });
            $('.demo5').easyTicker({
                direction: 'up',
                visible: 3,
                interval: 2500,
                controls: {
                    up: '.btnUp',
                    down: '.btnDown',
                    toggle: '.btnToggle'
                }
            });
        },

        beforeUpdate() {
            //beforeUpdate 更新前状态====

        },
        updated() {
            //updated 更新完成状态===

        },
        beforeDestroy() {
            //beforeDestroy 销毁前状态====

        },
        destroyed() {
            //destroyed 销毁完成状态===

        },
        methods: {
            // 所有方法
            aotuplay() {


            }
        }

    };
</script>
<style lang="scss" scoped>
    .ScrollBar {
        width: 100%;
        height: 35px;
        .wrapper {
            width: 500px;
            margin: 0 auto;
        }
        .demof {
            border: 1px solid #ccc;
            margin: 25px 0;
        }
        .demof ul {
            padding: 0;
            list-style: none;
        }
        .demof li {
            padding: 20px;
            border-bottom: 1px dashed #ccc;
        }
        .demof li.odd {
            background: #fafafa;
        }
        .demof li:after {
            content: '';
            display: block;
            clear: both;
        }
        .demof img {
            float: left;
            width: 177px;
            margin: 5px 15px 0 0;
        }
        .demof a {
            font-family: Arial, sans-serif;
            font-size: 20px;
            font-weight: bold;
            color: #06f;
        }
        .demof p {
            margin: 15px 0 0;
            font-size: 14px;
        }
        .demo3 {
            font-family: Arial, sans-serif;
            font-style: italic;
            position: relative;
        }

        .demo3 ul li {
            text-align: left;
            list-style: none;
        }
        .demo5 {
            margin-top: 10px;
            border-radius: 10px;
            width: 500px;
            -webkit-box-shadow: inset 0px 0px 10px 1px rgba(0, 0, 0, 0.3);
            -moz-box-shadow: inset 0px 0px 10px 1px rgba(0, 0, 0, 0.3);
            box-shadow: inset 0px 0px 10px 1px rgba(0, 0, 0, 0.3);
        }
        .demo5 ul {
            padding: 0;
        }
        .demo5 ul li {
            line-height: 35px;
            border-bottom: 1px solid #FF3333;
            border-radius: 10px;
            list-type: none;
            margin: 0;
        }
        .et-run {
            background-color: #0cf;
            color: white;
            border: 1px solid black;
        }
        .ScrollBar_box {
            height: 35px;
            background: #fff;
            border-bottom: 2px solid #ccc;
            opacity: 0.6;
            .zhongjian {
                padding-left: 100px;
                float: left;
                line-height: 33px;
                font-size: 18px;
                color: #1080cc;
            }
            .t_news_left {
                float: left;
                color: #000;
                padding-left: 20px;

                line-height: 35px;
                padding-right: 30px;

            }
            .t_news {
                float: left;
                height: 19px;
                color: #000;
                padding-left: 10px;
                margin: 8px 0;
                overflow: hidden;
                position: relative;
                b {
                    line-height: 19px;
                    font-weight: bold;
                    display: inline-block;
                }
            }
            .swiper_wrap {
                position: relative;
                width: 695px;
                height: 30px;
                margin: 0 auto;
                overflow: hidden;
            }
            ul {
                position: relative;
                top: 0;
                left: 0;
                width: 695px;
                float: right;
                color: #000;
                font-size: 14px;
                margin-top: 1px;
            }
            ul li {
                line-height: 35px;

            }
            .swiper_wrap .font_inner a {
                color: #000;
            }
            .swiper_wrap a:hover {
                color: #FA9101;
            }

            .font_inner {
                width: auto;
                line-height: 35px;
                display: inline-block;
                position: absolute;
                top: 0;
                left: 62px;
                list-style: none;
            }

        }
    }
</style>