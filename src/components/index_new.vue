<template>
    <div class="Paneldataindex">
        <!--首页面板-->
        <div id="list">
            <div class="gensui">

                <div class="line_top">
                    <toolbar>
                        <map-handle slot="toors"></map-handle>
                    </toolbar>
                    <!---->
                    <div class="fengxiang" v-show="true">
                      <weather></weather>
                    </div>
                </div>
                <div class="line_bottom" v-show="Legendswtch">
                    <!--<div class="fd-tuli">-->
                        <!--<img v-show="imgtuli" src="../../static/imgs/indeximgs/tuli/litu-001.png">-->
                    <!--</div>-->
                    <!--<div class="fd-off">-->
                        <!--<img :src="imgkey" @click="changeimggengai()">-->
                    <!--</div>-->
                    <tone-color></tone-color>
                </div>
            </div>
            <div class="panel">
                <img class="shrink" @click="kaiguan" src="../assets/img/左.png" v-if="zuo"/>
                <img class="shrink" @click="kaiguan" src="../assets/img/右.png" v-if="you"/>
                <!--首页统计面板-->
                <div class="main" v-show="StatisticsSwitch">
                    <!--切换部分-->
                    <el-tabs v-model="activeName">
                        <el-tab-pane label="统计一览" name="first">
                            <!--统计部分-->
                            <div class="tongji" v-if="tongji">
                                <div class="table_item">
                                    <strong>{{Statistics.AirCount}}</strong>
                                    <p>接入空气传感器</p>
                                </div>
                                <div class="table_item">
                                    <strong>{{Statistics.DustCount}}</strong>
                                    <p>接入工地监测</p>
                                </div>
                                <div class="table_item">
                                    <strong>{{Statistics.VideoCount}}</strong>
                                    <p>接入视频</p>
                                </div>
                                <div class="table_item">
                                    <strong>{{Statistics.CompanyCount}}</strong>
                                    <p>接入企业监测</p>
                                </div>
                                <div class="table_item">
                                    <strong>{{Statistics.GridCount}}</strong>
                                    <p>网格总数</p>
                                </div>
                                <div class="table_item">
                                    <strong>{{Statistics.GridMemberCount}}</strong>
                                    <p>网格员总数</p>
                                </div>
                                <div class="table_item">
                                    <!--<strong>{{Statistics.PollutionCount ? Statistics.PollutionCount : '&#45;&#45;'}}</strong>-->
                                    <strong>2698</strong>
                                    <p>源清单企业总数</p>
                                </div>
                                <div class="table_item">
                                    <strong>{{Statistics.CoalToGasCount ? Statistics.CoalToGasCount : '100%'}}</strong>
                                    <p>煤改气进度</p>
                                </div>
                                <div class="table_item">
                                    <strong>{{Statistics.ColaToEle ? Statistics.ColaToEle : '100%'}}</strong>
                                    <p>煤改电进度</p>
                                </div>
                            </div>
                            <!--饼图展示-->
                            <div class="bing">
                                <div class="look" style="margin-left: 6px">
                                    <p>空气传感器占比</p>
                                    <div class="bing_item1" id="bing_item1" style="width: 203px;height: 180px;"></div>
                                    <div class="tuli">
                                        <ul>
                                            <li><img src="../../static/imgs/piebiao/icon_lan1.png" alt="">六参数传感器</li>
                                            <li><img src="../../static/imgs/piebiao/icon_huang2.png" alt="">TVOC传感器</li>
                                            <li><img src="../../static/imgs/piebiao/icon_lu3.png" alt="">工地传感器</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="look">
                                    <p>视频类型占比</p>
                                    <div class="bing_item2" id="bing_item2" style="width: 203px;height: 180px;"></div>
                                    <div class="tuli">
                                        <ul>
                                            <li><img src="../../static/imgs/piebiao/icon_lan1.png" alt="">VOCs企业</li>
                                            <li><img src="../../static/imgs/piebiao/icon_huang2.png" alt="">高空五公里</li>
                                            <li><img src="../../static/imgs/piebiao/icon_lu3.png" alt="">散乱污企业</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="look" style="margin-top: 20px;margin-left: 6px">
                                    <p>网格类型占比</p>
                                    <div class="bing_item3" id="bing_item3" style="width: 203px;height: 180px;"></div>
                                    <div class="tuli">
                                        <ul>
                                            <li style="width: 66px"><img src="../../static/imgs/piebiao/icon_lan1.png"
                                                                         alt="">一级
                                            </li>
                                            <li style="width: 66px"><img src="../../static/imgs/piebiao/icon_huang2.png"
                                                                         alt="">二级
                                            </li>
                                            <li style="width: 66px"><img src="../../static/imgs/piebiao/icon_lu3.png"
                                                                         alt="">三级
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="look" style="margin-top: 20px">
                                    <p>网格员占比</p>
                                    <div class="bing_item4" id="bing_item4" style="width: 203px;height: 180px;"></div>
                                    <div class="tuli">
                                        <ul>
                                            <li style="width: 66px"><img src="../../static/imgs/piebiao/icon_lan1.png"
                                                                         alt="">开发区
                                            </li>
                                            <li style="width: 66px"><img src="../../static/imgs/piebiao/icon_huang2.png"
                                                                         alt="">广阳区
                                            </li>
                                            <li style="width: 66px"><img src="../../static/imgs/piebiao/icon_lu3.png"
                                                                         alt="">安次区
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="各局数据接入进度" name="second">
                            <!--表格-->
                            <ul class="table_tie">
                                <li class="table_title" style="background:#ddd">
                                    <div class="item-table1">排名</div>
                                    <div class="item-table2">机关单位</div>
                                    <div class="item-table3">接入状态</div>
                                </li>
                                <li>
                                    <div class="item-table1" style="height: 40px;line-height: 40px">1</div>
                                    <div class="item-table2" style="height: 40px;line-height: 40px">市环保局</div>
                                    <div class="item-table3" style="height: 40px;line-height: 40px">
                                        <p>
                                            接入在线监测企业{{RightStatistics.companyCount}}个，正常{{RightStatistics.CompanyCountOnline}}个，离线{{RightStatistics.companyCountUnline}}个</p>
                                    </div>
                                </li>
                                <li>
                                    <div class="item-table1" style="height: 240px;line-height: 240px">2</div>
                                    <div class="item-table2" style="height: 240px;line-height: 240px">开发区管委会</div>
                                    <div class="item-table3" style="height: 240px;">
                                        <p>
                                            接入六参数空气质量传感器{{RightStatistics.kfqSixCount}}个，正常{{RightStatistics.kfqSixCountOnline}}个，离线{{RightStatistics.kfqSixCountUnline}}个</p>
                                        <p>
                                            接入扬尘传感器{{RightStatistics.kfqDustCount}}个，正常{{RightStatistics.kfqDustCountOnline}}个，离线{{RightStatistics.kfqDustCountUnline}}个</p>
                                        <p>
                                            接入TVOC传感器{{RightStatistics.kfqVocCount}}个，正常{{RightStatistics.kfqVocCountOnline}}个，离线{{RightStatistics.kfqVocCountUnline}}</p>
                                        <p>接入TVOC企业视频监控{{RightStatistics.kfqVideoVoc}}个</p>
                                        <p>接入小散乱污企业视频{{RightStatistics.kfqVideoSlw}}个</p>
                                    </div>
                                </li>
                                <li>
                                    <div class="item-table1" style="height: 80px;line-height: 80px">3</div>
                                    <div class="item-table2" style="height: 80px;line-height: 80px">广阳区政府</div>
                                    <div class="item-table3" style="height: 80px;">
                                        <p>接入TVOC企业视频监控{{RightStatistics.gyqVideoVoc}}个</p>
                                        <p>接入小散乱污视频{{RightStatistics.gyqVideoSlw}}个</p>
                                    </div>
                                </li>
                                <li>
                                    <div class="item-table1" style="height: 240px;line-height: 240px">4</div>
                                    <div class="item-table2" style="height: 240px;line-height: 240px">安次区政府</div>
                                    <div class="item-table3" style="height: 240px;">
                                        <p>
                                            接入六参数空气质量传感器{{RightStatistics.acqSixCount}}个，正常{{RightStatistics.acqSixCountOnline}}个，离线{{RightStatistics.acqSixCountUnline}}个</p>
                                        <p>
                                            接入扬尘传感器{{RightStatistics.acqDustCount}}个，正常{{RightStatistics.acqDustCountOnline}}个，离线{{RightStatistics.acqDustCountUnline}}个</p>
                                        <p>
                                            接入TVOC传感器{{RightStatistics.acqVocCount}}个，正常{{RightStatistics.acqVocCountOnline}}个，离线{{RightStatistics.acqVocCountUnline}}个</p>
                                        <p>接入TVOC企业视频监控{{RightStatistics.acqVideoVoc}}个</p>
                                        <p>接入小散乱污企业视频{{RightStatistics.acqVideoSlw}}个</p>
                                    </div>
                                </li>
                                <li>
                                    <div class="item-table1" style="height: 80px;line-height: 80px">5</div>
                                    <div class="item-table2" style="height: 80px;line-height: 80px">市建设局</div>
                                    <div class="item-table3" style="height: 80px;">
                                        <p>煤改气数据最近更新时间：---</p>
                                        <p>接入工地视频监控--个，正常--个，离线--个</p>
                                    </div>
                                </li>
                                <li>
                                    <div class="item-table1" style="height: 40px;line-height: 40px">6</div>
                                    <div class="item-table2" style="height: 40px;line-height: 40px">供电公司</div>
                                    <div class="item-table3" style="height: 40px;">
                                        <p>用电量数据最近更新时间：---</p>
                                    </div>
                                </li>
                                <li>
                                    <div class="item-table1" style="height: 40px;line-height: 40px">7</div>
                                    <div class="item-table2" style="height: 40px;line-height: 40px">市统计局</div>
                                    <div class="item-table3" style="height: 40px;">
                                        <p>经济运行数据最近更新时间：---</p>
                                    </div>
                                </li>
                                <li>
                                    <div class="item-table1" style="height: 40px;line-height: 40px">8</div>
                                    <div class="item-table2" style="height: 40px;line-height: 40px">市气象局</div>
                                    <div class="item-table3" style="height: 40px;">
                                        <p>接入气象站--个</p>
                                    </div>
                                </li>
                                <li>
                                    <div class="item-table1" style="height: 40px;line-height: 40px">9</div>
                                    <div class="item-table2" style="height: 40px;line-height: 40px">市综合执法局</div>
                                    <div class="item-table3" style="height: 40px;">
                                        <p>接入车辆--个</p>
                                    </div>
                                </li>
                                <li>
                                    <div class="item-table1" style="height: 40px;line-height: 40px">10</div>
                                    <div class="item-table2" style="height: 40px;line-height: 40px">市环卫局</div>
                                    <div class="item-table3" style="height: 40px;">
                                        <p>接入车辆--个</p>
                                    </div>
                                </li>
                                <li>
                                    <div class="item-table1" style="height: 40px;line-height: 40px">11</div>
                                    <div class="item-table2" style="height: 40px;line-height: 40px">市交警支队</div>
                                    <div class="item-table3" style="height: 40px;">
                                        <p>接入监控视频--个</p>
                                    </div>
                                </li>
                            </ul>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <!--面板切换视图区域-->
                <router-view></router-view>
                <!---->
            </div>
            <!--右侧菜单-->
            <div class="meun_right">
                <ul>
                    <!--默认选项-->
                    <!-- <li @click="selectRightNavData('统计')" :class="isSelect === '统计' ? 'backgroundColor' : ''">
                        <el-tooltip class="item" effect="dark" :content="'统计'" placement="left">
                            <img :src="Jtimgurl">
                        </el-tooltip>
                    </li> -->
                    <!--动态生成-->
                    <li v-for="item in RightNavData" @click="selectRightNavData(item.title)" :class="isSelect === item.title ? 'backgroundColor' : ''">
                        <!--<p :class="isSelect === item.title ? 'active' : ''">{{item.title}}</p>-->
                        <el-tooltip class="item" effect="dark" :content="item.title_tx" placement="left">
                            <img :src="isSelect === item.title ? item.url_one : item.url">
                        </el-tooltip>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import {bus} from '@/js/bus.js'
    import api from '../api/index'
    //页面图例组件
    import Toolbar from '@/components/Toolbar'
    import ToneColor from '@/components/ToneColor'
    import Weather from '@/map/controls/WeatherCom'
    //
    export default {
        name: 'paneldata',
        data() {
            return {
                //图例默认展开
                imgtuli:true,
                //默认图例
                imgkey:'../../static/imgs/indeximgs/tuli/fd-suoxiao.png',
                //图例缩小
                imgkeyss:'../../static/imgs/indeximgs/tuli/fd-suoxiao.png',
                //图例展开
                imgkeyzk:'../../static/imgs/indeximgs/tuli/fd-zhankai.png',
                //收缩右侧面板
                zuo: false,
                //默认展开右侧面板
                you: true,
                //
                table: false,
                //
                tongji: true,
                //图例开关
                Legendswtch:true,
                //
                activeName: 'first',
                //风向
                windDirection:false,
                //
                tableData: [],
                //
                Statistics: {},
                //传感器
                AirPie: [],
                //视频
                VideoPie: [],
                //网格类
                GridPie: [],
                //网格员
                GridMemberPie: [],
                //右侧栏统计2
                RightStatistics: {},
                //默认面板值
                isSelect: '统计',
                //
                Jtimgurl:'static/imgs/indeximgs/morenimg/tongji.png',
                //右侧菜单栏项目
                RightNavData: [],
                //右侧栏统计开关
                StatisticsSwitch:false,
                //
                constFlag:true,
            }
        },
        activated() {
            api.GetXhHbPoints().then(res => {
                let data = res.data.Data;
                this.Statistics = data;
            })
            api.GetOfficeProgess().then(res => {
                let data = res.data.Data;
                this.RightStatistics = data;
            })
            this.GetEcharsData()
        },
        mounted() {
            //分类切换模块
            $('.first .tables a').on('click', function () {
                $(this).addClass('bai').siblings().removeClass('bai')
            })
            //根源菜单赋值
            this.RightNavData = this.$store.state.menuData;
            //
            bus.$on('menuative', this.selectRightNavData);
            //
            this.selectRightNavData ('国省')
        },
        updated(){
            //跟新数据后调用功能
            if(this.RightNavData == false){
                console.log('我现在没有东西了')
                $('#list')[0].style.WebkitTransform = "translate(467px)"
                $('#list')[0].style.transform = "translate(467px)"
            }else{
                $('#list')[0].style.transform = "translate(0)"
                this.constFlag = true;
            }

        },
        computed:{

        },
        watch:{
            //监听路由
            '$route':'isTabChange',
        },
        methods: {
            //
            kaiguan(){
                let that = this;
                 $('#list')[0].style.transition = "all 500ms"
                if (that.constFlag) {
                    that.zuo = true;
                    that.you = false;
                    $('#list')[0].style.WebkitTransform = "translate(467px)"
                    $('#list')[0].style.transform = "translate(467px)"
                    that.constFlag = false;
                } else {
                    that.zuo = false;
                    that.you = true;
                    $('#list')[0].style.transform = "translate(0)"
                    that.constFlag = true;
                }
            },
            //图例开关
            changeimggengai(){
                const _this = this;
                //console.log('惦记我了啊')
                //console.log(_this.imgtuli);
                if(_this.imgtuli == false){
                    _this.imgtuli = true;
                    _this.imgkey = _this.imgkeyss;

                }else if(_this.imgtuli == true){
                    _this.imgtuli = false;
                    _this.imgkey = _this.imgkeyzk;

                }
            },
            //路由监控
            isTabChange(){
                //当返回实时监控页面时候监控路由情况
                if(this.$route.path==='/'){
                     //
                    this.selectRightNavData ('国省')
                }
            },
            //排序
            compare(propertyName) {
                return function (object1, object2) {
                    let value1 = object1[propertyName]
                    let value2 = object2[propertyName]
                    return value2 - value1
                }
            },
            //table点击事件
            RowCurrentChange(val) {
                //this.currentRow = val;
                // let citygid = this.currentRow.citygid;//城市id
                // let latitude = this.currentRow.latitude;//纬度
                // let longitude = this.currentRow.longitude;//经度
                // // console.log(this.currentRow)
                // bus.$emit('showWindowInfo', longitude, latitude, citygid)
            },
            //渲染
            switchRender(type) {
                this.type = type;
                this.labelType = this.getPollutionTarget(type);

            },
            //
            getPollution(type) {
                let rtValue = type;
                switch (type.toUpperCase()) {
                    case 'PM2.5':
                        rtValue = 'pm25';
                        break;
                    case 'INDEX':
                        rtValue = 'complexindex';
                        break;
                    case 'WS':
                        rtValue = 'windspeed';
                        break;
                    case 'WD':
                        rtValue = 'windangle';
                        break;
                }
                return rtValue;
            },
            //空气传感器占比图
            AirSensorRatio() {
                let data = this.AirPie.map(function (v) {
                    return {value: v.count, name: v.name}
                }) || [];
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('bing_item1'));
                // 指定图表的配置项和数据
                let option = {
                    series: [
                        {
                            name: '空气传感器占比',
                            type: 'pie',
                            radius: ['0%', '75%'],
                            hoverAnimation: false,
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,
                                        position: 'inside',
                                        formatter: '{d}%'
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                }
                            }
                        }
                    ]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
                //动态设置参数
                myChart.setOption({

                    series: [{
                        data: data,
                        color: [
                            '#0392e0',
                            '#f7cc5c',
                            '#a0cb3e',
                        ]
                    }]
                })
            },
            //视频类型占比
            VideoratioPie() {
                let data = this.VideoPie.map(function (v) {
                    return {value: v.count, name: v.name}
                }) || [];
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('bing_item2'));
                // 指定图表的配置项和数据
                let option = {

                    series: [
                        {
                            name: '视频类型占比',
                            type: 'pie',
                            radius: ['0%', '75%'],
                            hoverAnimation: false,
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,
                                        position: 'inside',
                                        formatter: '{d}%'
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                }
                            }
                        }
                    ]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
                //动态设置参数
                myChart.setOption({
//                    legend: {
//                        data: data.map(function (v) {
//                            return v.name
//                        })
//                    },
                    series: [{
                        data: data,
                        color: [
                            '#0392e0',
                            '#f7cc5c',
                            '#a0cb3e',
                        ]
                    }]
                })
            },
            //网格类型占比
            GridTypeProportionPie() {
                let data = this.GridPie.map(function (v) {
                    return {value: v.count, name: v.name}
                }) || [];
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('bing_item3'));
                // 指定图表的配置项和数据
                let option = {
                    calculable: true,
                    series: [
                        {
                            name: '网格类型占比',
                            type: 'pie',
                            radius: ['0%', '75%'],
                            hoverAnimation: false,
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,
//                                        position: 'inside',
//                                        formatter: '{d}%'
                                        formatter: '{d}%'
                                    },
                                    labelLine: {
                                        show: true,
                                        length: 10,
                                    }
                                }
                            }
                        }
                    ]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
                //动态设置参数
                myChart.setOption({
//                    legend: {
//                        data: data.map(function (v) {
//                            return v.name
//                        })
//                    },
                    series: [{
                        data: data,
                        color: [
                            '#0392e0',
                            '#f7cc5c',
                            '#a0cb3e',
                        ]
                    }],
                })
            },
            //网格员占比
            GridSharePie() {
                let data = this.GridMemberPie.map(function (v) {
                    return {value: v.count, name: v.name}
                }) || [];
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('bing_item4'));
                // 指定图表的配置项和数据
                let option = {
                    series: [
                        {
                            name: '网格员占比',
                            type: 'pie',
                            radius: ['0%', '75%'],
                            hoverAnimation: false,
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,
                                        position: 'inside',
                                        formatter: '{d}%'
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                },

                            }
                        }
                    ]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
                //动态设置参数
                myChart.setOption({
//                    legend: {
//                        data: data.map(function (v) {
//                            return v.name
//                        })
//                    },
                    series: [{
                        data: data,
                        color: [
                            '#f7cc5c',
                            '#0392e0',
                            '#a0cb3e',
                        ]
                    }],
                })
            },
            //图标数据请求
            GetEcharsData() {
                let t = this;
                //传感器
                api.GetAirPie().then(res => {
                    let data = res.data.Data;
                    t.AirPie = data;
                    t.AirSensorRatio();
                })
                //视频
                api.GetVideoPie().then(res => {
                    let data = res.data.Data;
                    t.VideoPie = data;
                    t.VideoratioPie();
                })
                //网格类
                api.GetGridPie().then(res => {
                    let data = res.data.Data;
                    t.GridPie = data;
                    t.GridTypeProportionPie();
                })
                //网格员
                api.GetGridMemberPie().then(res => {
                    let data = res.data.Data;
                    t.GridMemberPie = data;

                    t.GridSharePie();
                })
            },
            //右侧切换菜单栏
            selectRightNavData (title) {
                this.isSelect = title;
                //console.log(title)
                switch (title) {
                    case '统计':
                        this.StatisticsSwitch = true;
                        this.$router.push('/');
                        break
                    case '国省':
                         this.StatisticsSwitch = false;
                        this.$router.push('/MonitoringPoint');
                        this.Legendswtch = true;
                        break
                    case '六参':
                         this.StatisticsSwitch = false;
                        this.$router.push('/SenPanel');
                        this.Legendswtch = true;
                        break
                    case '乡镇':
                        this.StatisticsSwitch = false;
                        this.$router.push('/TownshipPanel');
                        this.Legendswtch = true;
                        break
                    case '工地':
                        this.StatisticsSwitch = false;
                        this.$router.push('/OnlineListPanel');
                        this.Legendswtch = true;
                        break
                    case '企业':
                        this.StatisticsSwitch = false;
                        this.$router.push('/EnterprisePanel');
                        this.Legendswtch = false;
                        break
                    case '静态':
                        this.StatisticsSwitch = false;
                        this.$router.push('/StaticdustPanel');
                        this.Legendswtch = false;
                        break
                    case '应急':
                        this.StatisticsSwitch = false;
                        this.$router.push('/EmergencylistPanel');
                        this.Legendswtch = false;
                        break
                    case 'VOC':
                        this.StatisticsSwitch = false;
                        this.$router.push('/tvocPanel');
                        this.Legendswtch = true;
                        break
                    case '散乱视频':
                        this.StatisticsSwitch = false;
                        this.$router.push('/ScatteredDirtData');
                        this.Legendswtch = true;
                        break
                    case 'VOC视频':
                        this.StatisticsSwitch = false;
                        this.$router.push('/VocsVideoData');
                        this.Legendswtch = true;
                        break;
                    case '全民举报':
                        this.StatisticsSwitch = false;
                        this.$router.push('/ReportWholePeople');
                        this.Legendswtch = true;
                        break;
                    default:
                        this.StatisticsSwitch = true;
                        this.$router.push('/');
                        this.Legendswtch = true;
                        break
                }
            }
        },
        components: {
            Toolbar,
            ToneColor,
            Weather
        }
    }
 </script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

    .Paneldataindex {
        width: 410px;
        height: auto;
        background-color: #666;
        position: absolute;
        top: 60px;
        right: 0;

        .border_bottom {
            width: 100%;
            height: 1px;
            border-bottom: 1px solid #ccc;
            margin-bottom: 20px;
        }

        #list {
            background: #fff;
            position: fixed;
            width: 467px;
            height: 100%;
            top: 56px;
            right: 0;
            z-index: 9;
            box-shadow: 0px 5px 15px #333333;
            .gensui {

                .line_top {
                    position: absolute;
                    left: -515px;
                    top: 48px;
                    height: 46px;
                    background: #fff;
                    border-radius: 4px;
                    box-shadow: 0 0 4px #ccc;
                    .fengxiang{
                        width: 130px;
                        height: 46px;
                        background: #fff;
                        border-radius: 4px;
                        box-shadow: 0 0 4px #ccc;
                        position: absolute;
                        line-height: 46px;
                        top: 0;
                        left: -140px;
                    }
                }

                .line_bottom {
                    width: 320px;
                    position: absolute;
                    left: -309px;
                    bottom: 56px;
                    .fd-tuli{
                        position: absolute;
                        top: -294px;
                        right: 60px;
                    }
                    .fd-off{
                        position: absolute;
                        right: 30px;
                        bottom: 40px;
                    }
                }
            }


            .panel{
                float: left;
                img {
                    position: absolute;
                    top: 40%;
                    left: -17px;
                    cursor: pointer;
                    float: left;
                }
                .main {
                    height: auto;
                    .table_tie {
                    width: 430px;
                    height: 405px;
                    margin: 0px auto;
                    padding-top: 15px;
                    li {
                        list-style: none;
                        height: auto;
                        .item-table1 {
                            border: solid 1px #ccc;
                            border-top: none;
                            width: 44px;
                            float: left;
                        }
                        .item-table2 {
                            border: solid 1px #ccc;
                            border-top: none;
                            border-left: none;
                            border-right: none;
                            width: 89px;
                            float: left;
                        }
                        .item-table3 {
                            border: solid 1px #ccc;
                            border-top: none;
                            width: 296px;
                            float: left;
                            p {
                                line-height: 40px;
                                font-size: 12px;
                                text-align: left;
                                padding-left: 10px;
                            }
                        }
                    }
                    .table_title {
                        color: #333;
                        .item-table1 {
                            background: #f6f6f6;
                            border: solid 1px #ccc;
                            height: 56px;
                            line-height: 56px;
                        }
                        .item-table2 {
                            background: #f6f6f6;
                            border: solid 1px #ccc;
                            border-left: none;
                            border-right: none;
                            height: 56px;
                            line-height: 56px;
                        }
                        .item-table3 {
                            background: #f6f6f6;
                            border: solid 1px #ccc;
                            height: 56px;
                            line-height: 56px;
                        }

                    }
                }
                    .tongji {
                    width: 427px;
                    height: 306px;
                    margin: 0 auto;
                    margin-top: 14px;
                    border: solid 1px #ccc;
                    background: #F6F6F6;
                    .table_item {
                        float: left;
                        margin-top: 13px;
                        margin-left: 18px;
                        width: 118px;
                        height: 83px;
                        text-align: center;
                        background: #fff;
                        border: 1px solid #C8C8C8;
                        strong {
                            line-height: 48px;
                            font-size: 24px;
                            color: #555;
                        }
                        p {
                            font-size: 14px;
                            color: #888;
                        }
                    }
                }
                    .bing {
                    width: 430px;
                    height: 366px;
                    margin: 0 auto;
                    margin-top: 20px;
                    .look {
                        width: 49%;
                        height: auto;
                        float: left;
                        p {
                            color: #434D55;
                            font-size: 14px;
                            font-weight: bold;
                        }
                        ul {
                            li {
                                list-style: none;
                                font-size: 12px;
                                width: 104px;
                                height: 20px;
                                float: left;
                                text-align: left;
                                padding-left: 5px;
                                img {
                                    position: inherit;
                                    width: 14px;
                                    height: auto;
                                    vertical-align: middle;
                                    margin-top: 4px;
                                    margin-right: 5px;
                                }
                            }
                        }
                    }
                    .bing_item1 {
                        width: 203px;
                        height: 180px;
                        float: left;
                    }
                    .bing_item2 {
                        width: 203px;
                        height: 180px;
                        float: left;
                    }

                    .bing_item3 {
                        width: 203px;
                        height: 180px;
                        float: left;
                    }

                    .bing_item4 {
                        width: 203px;
                        height: 180px;
                        float: left;
                    }

                }
                }
            }
            .meun_right{
                position: absolute;
                top: 0;
                right: 0;
                width: 34px;
                height: 100%;
                background: rgba(160,160,160,0.6);
                z-index: 60;
                ul{
                    padding-top: 42px;
                    li{
                        width: 34px;
                        height: 40px;
                        line-height: 40px;
                        text-align: center;
                        list-style: none;
                        cursor: pointer;
                        :hover{
                            -webkit-transform:scale(1.5);
                            -moz-transform:scale(1.5) ;
                            -o-transform:scale(1.5) ;
                            transform:scale(1.5) ;
                        }
                    }

                    p{
                        font-size: 0.2rem;
                        color: #666;
                    }
                    img{
                        display: inline-block;
                        width: 24px;
                        height: 24px;
                        position: static;
                    }
                    .active{
                        color: #0d0d0d;
                    }
                    .backgroundColor{
                        background: #fff;
                    }
                }
            }
        }
    }


</style>
