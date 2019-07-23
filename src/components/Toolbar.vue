<template>
    <div class="toolbar">
        <!--搜索模块-->
        <div class="lein_1">
            <search-module></search-module>
        </div>
        <!--工具模块-->
        <div class="lein_2" id="gjbox" @click="radioClick2">
            <img src="../../static/imgs/toor/icon_tool_1.png" alt="">
            <span>工具</span>
            <img src="../../static/imgs/toor/btn_jiantou_1.png" alt="">
            <div id="gj" class="css_toolbar">
                <slot name="toors"></slot>
            </div>
        </div>
        <!--网格筛选-->
        <div class="clolrbr" style="float: left;height:28px;width: 1px;border-right: solid 1px #ccc"></div>
        <div class="lein_3" id="tcbox" @click="radioClick3">
            <img src="../../static/imgs/toor/icon_layer_1.png" alt="">
            <span>网格筛选</span>
            <img src="../../static/imgs/toor/btn_jiantou_1.png" alt="">
            <layer-switch id="tc" class="css_switch"></layer-switch>
        </div>
    </div>
</template>
<script>
    import LayerSwitch from '@/map/controls/LayerSwitch'
    import SearchModule from '@/components/SearchModule'
    export default {
        name: 'toolbar',
        data() {
            return {
                //页面数据
                tysrc: '../../static/imgs/toor/icon_Statistics_1.png',
                tychesrc: '../../static/imgs/toor/icon_Statistics_2.png',
                gjsrc: '../../static/imgs/toor/icon_tool_2.png',
                gjchesrc: '../../static/imgs/toor/icon_tool_1.png',
                tcsrc: '../../static/imgs/toor/icon_layer_2.png',
                tcchesrc: '../../static/imgs/toor/icon_layer_1.png',
                jtsrc: '../../static/imgs/toor/btn_jiantou_1.png',
                jtchesrc: '../../static/imgs/toor/btn_jiantou_2.png',
                layerId: 0
            };
        },
        beforeCreate() {
            //beforeCreate 创建前状态====

        },
        created() {
            //created 创建完毕状态====
        },
        beforeMount() {
            //beforeMount 挂载前状态===
        },
        mounted() {
            $(".lein_1").click(function () {
                $(this).toggleClass('activecolor')
            });
            $(".lein_2").click(function () {
                $(this).toggleClass('activecolor')
            });
            $(".lein_3").click(function () {
                $(this).toggleClass('activecolor')
            });
            $("#gjbox").click(function () {
                //$(this).text($("#content").is(":hidden") ? "收起" : "展开");
                $("#gj").slideToggle();
            });
            $("#tcbox").click(function () {
                //$(this).text($("#content").is(":hidden") ? "收起" : "展开");
                $("#tc").slideToggle();
            });
        },
        methods: {
            // 所有方法
            radioClick(e) {
                this.$emit('RightslideToggle');
                let childElement = e.currentTarget;
                let imgElement = childElement.querySelector('img');
                imgElement.getAttribute('src') !== this.tysrc ? (imgElement.src = this.tysrc) : (imgElement.src = this.tychesrc);
            },
            radioClick2(e) {
                //let t = this;
                let childElement = e.currentTarget;
                let imgElement = childElement.querySelector('img');
                imgElement.getAttribute('src') !== this.gjsrc ? (imgElement.src = this.gjsrc) : (imgElement.src = this.gjchesrc);
            },
            radioClick3(e) {
                //let t = this;
                let childElement = e.currentTarget;
                let imgElement = childElement.querySelector('img');
                imgElement.getAttribute('src') !== this.tcsrc ? (imgElement.src = this.tcsrc) : (imgElement.src = this.tcchesrc);
            },
        },
        components: {LayerSwitch,SearchModule}
    };
</script>
<style lang="scss" scoped>
    .toolbar {
        width: 100%;
        height: 100%;
        font-size: 14px;
        .lein_1 {
            margin-left: 4px;
            float: left;
            width: 260px;
            line-height: 40px;
        }
        .lein_2 {
            float: left;
            width: 106px;
            line-height: 40px;
            padding-right:10px;
            margin-top: 3px;
            position: relative;
            .css_toolbar {
                display: none;
                position: absolute;
                top: 42px;
                left: 0px;
            }
        }
        .lein_3 {
            float: left;
            width: 132px;
            line-height: 40px;
            padding: 0 10px;
            margin-top: 3px;
            position: relative;
            .css_switch {
                display: none;
                position: absolute;
                top: 42px;
                left: 0px;
            }
        }
        :hover {
            cursor: pointer;
        }
        .activecolor {
            color: #2494F2;
        }
        .clolrbr {
            margin-top: 10px;
        }
    }
</style>

