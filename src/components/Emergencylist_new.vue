<template>
    <div class="newyingjiliest">
        <!--企业应急清单-->
        <div class="caodui">
                <!--详情一览表格-->
                <div class="emergen" v-show="emergen">
                    <div class="title_em">
                        <span>一企一策详情一览</span>
                        <i class="el-icon-close" @click="emergen=false"></i>
                    </div>
                    <emergen-table></emergen-table>
                </div>
                <!--预警信息统计-->
                <div class="emergen2" v-show="emergen2">
                    <div class="title_em">
                        <span>预警信息统计</span>
                        <i class="el-icon-close" @click="emergen2=false"></i>
                    </div>
                    <meet-table></meet-table>
                </div>
                <!--页面底部图例-->
                <div class="line_bottom">
                    <div class="tuli_02">
                        <ul>
                            <li>
                                <img style="position: inherit;margin: 12px 4px;"
                                     src="../../static/imgs/yingji/icon_1.png" alt="">
                                <span>采暖期错峰企业</span>

                            </li>
                            <li>
                                <img style="position: inherit;margin: 12px 6px;"
                                     src="../../static/imgs/yingji/icon_2.png" alt="">
                                <span>应急企业</span>
                            </li>
                        </ul>
                    </div>
                    <div class="tuli_01">
                        <dl>
                            <dt style="background: #2a92eb"></dt>
                            <dt style="background: #fee71d"></dt>
                            <dt style="background: #ffb31a"></dt>
                            <dt style="background: #d31213"></dt>
                            <dd>蓝色预警</dd>
                            <dd>黄色预警</dd>
                            <dd>橙色预警</dd>
                            <dd>红色预警</dd>
                        </dl>
                    </div>
                </div>
            </div>
        <!---->
        <div class="main">
                    <!--顶部title-->
                    <div class="tables" style="position: relative;">
                        <!--选项-->
                        <a style="margin-left: -280px;">应急污染源统计</a>
                        <strong style="position: absolute;right: 20px;color: #666" @click="showwarp = !showwarp">{{showwarp?'收起∧':'展开∨'}}</strong>

                        <div class="xian"></div>
                    </div>
                    <!--统计饼图-->
                    <transition name="el-zoom-in-top">
                        <div v-show="showwarp" class="bing" id="content">
                            <!---->
                            <div class="look">
                                <div class="bing_item1" id="bing_item_01" style="width: 210px;height: 260px;"></div>

                            </div>
                            <!---->
                            <div class="look">
                                <div class="bing_item2" id="bing_item_02" style="width: 210px;height: 260px;"></div>

                            </div>
                        </div>
                    </transition>
                    <!--统计表title-->
                    <div class="tables qyNumber">
                        <!--选项-->
                        <a style="color:#2494f2">应急污染企业数量:{{totalCount}}</a>
                        <div class="xian"></div>
                    </div>
                    <!--按钮-->
                    <div class="anniu">
                        <div class="sousuo">
                            <div class="sleft">
                                <el-input v-model="filters.name"  @keyup.enter.native="searchData" placeholder="名称"></el-input>
                            </div>
                            <div class="sright">
                                <el-button type="primary" @click="searchData()">搜索</el-button>
                            </div>
                            <!---->
                            <el-button type="primary" @click="emergen=true">详情一览</el-button>
                        </div>

                    </div>
                    <!--列表-->
                    <div class="table_container">
                        <el-table
                                :data="tableData"
                                border
                                stripe
                                highlight-current-row
                                @current-change="RowCurrentChange"
                                style="width: 400px">
                            <el-table-column
                                    property="NetworkName"
                                    label="污染源名称"
                                    width="220">
                            </el-table-column>
                            <!--<el-table-column-->
                            <!--property="StartingState"-->
                            <!--label="启动状态"-->
                            <!--width="100">-->
                            <!--</el-table-column>-->
                            <el-table-column
                                    property="Statues"
                                    label="行业"
                                    width="100"
                            >
                            </el-table-column>
                            <el-table-column
                                    property="WanggeName"
                                    label="所属网格"
                            >
                            </el-table-column>
                        </el-table>
                        <!--分页条-->
                        <div class="Pagination" style="text-align: left;margin-top: 10px;">
                            <el-pagination
                                    background
                                    @current-change="handleCurrentChange"
                                    :current-page="currentPage"
                                    :page-size="pagesize"
                                    layout="total, prev, pager, next"
                                    :total="totalCount">
                            </el-pagination>
                        </div>

                    </div>
                    <!---->
                    <div style="width: 20%;margin-top: 15px;float: right;margin-right: 50px">
                        <!---->
                        <el-button type="primary" @click="yjxxactive">预警信息统计</el-button>
                    </div>
                </div>
        <!---->
    </div>
</template>

<script>
    import {bus} from '@/js/bus.js'
    import api from '../api/index'
    import EmergenTable from '@/components/EmergenTable'
    import MeetTable from '@/components/MeetTable'
    export default {
        name: 'emergencylist',
        data() {
            return {
                emergen2:false,
                //
                showwarp:true,
                //
                tableData: [],
                //
                allData: [],
                //
                labelType: "----",
                //
                currentRow: null,
                //
                pagesize: 10,
                //
                currentPage: 1,
                //
                totalCount: 0,
                //
                value2: '',
                //
                filters: {name: ''},
                //
                emergen: false,
                //
                Aalllist: []
            }
        },
        created() {
            //初始化数据
            this.GetListqyData()
            //初始化图表数据
            this.getEcharsData()
        },
        mounted() {

            //
            $('.first .tables a').on('click', function () {
                $(this).addClass('bai').siblings().removeClass('bai')
            })

        },
        methods: {
            //
            yjxxactive(){
                this.emergen2 = true;
                bus.$emit('yjative', '', '' ,'','');
            },
            //获取图表数据
            getEcharsData(){
                //地区图表
                api.GetChartByRegion().then(res =>{
                    //
                    let data = res.data.Data;
                    //
                    console.log(data);
                    //
                    this.RegionalStatisticsPie(data);
                })
                //企业分类
                api.GetChartByClassification().then(res =>{
                    //
                    let data = res.data.Data;
                    //
                    this.EmergencyEnterprisePie(data);
                })
            },
            //初始化数据
            InitializationDataMethod(data) {
                this.Aalllist = data;
                //console.log(data.ExtraData)
                let sudata = data;
                this.SetDataList(sudata)
                this.totalCount = this.ALLdata.length;
                this.allData = this.ALLdata;
                this.setPageTable(10, 1);
                //地图传送线
                bus.$emit('loadCumulative', sudata, 'layer_yj','','companyname');
            },
            //排序
            compare(propertyName) {
                return function (object1, object2) {
                    let value1 = object1[propertyName]
                    let value2 = object2[propertyName]
                    return value2 - value1
                }
            },
            //table行点击
            RowCurrentChange(val) {
                this.currentRow = val;
                //地图联动
                bus.$emit('locationClick', 'layer_yj', this.currentRow, '');
            },
            //页码变更
            handleCurrentChange(val) {
                this.setPageTable(10, val);
                //console.log(val)
            },
            //
            handleSizeChange() {
            },
            //数据筛选
            getPointByType(data) {
                let rtValue = [];
                let dt = data;
                if (dt) {
                    for (let i = 0, length = dt.length; i < length; i++) {
                        let item = dt[i];
//                        if (item.type === type) {
                        rtValue.push(dt[i]);
//                        }
                    }
                }
                return rtValue;
            },
            //应急企业图1
            EmergencyEnterprisePie(data) {
                let vdata = data.seriesData.data;
                let vlegend = data.legend;
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('bing_item_01'));
                // 指定图表的配置项和数据
                let option = {

                    series: [
                        {
                            name: '---',
                            type: 'pie',
                            //图大小
                            radius: ['0%', '65%'],
                            //图上下
                            center:['100','40%'],
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
                    legend: {
                        bottom: 10,
                        left: 'center',
                        data:vlegend
                    },
                    series: [{
                        data: vdata,

                    }]
                })
            },
            //分区图2
            RegionalStatisticsPie(data) {
                let vdata = data.seriesData.data;
                let vlegend = data.legend;
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('bing_item_02'));
                // 指定图表的配置项和数据
                let option = {
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    series: [
                        {
                            name: '统计占比',
                            type: 'pie',
                            radius: ['0%', '65%'],
                            center:['106','40%'],
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
                                        length: 5,
                                    }
                                }
                                // normal: {
                                //     label: {
                                //         show: true,
                                //         position: 'inside',
                                //         formatter: '{d}%'
                                //     },
                                //     labelLine: {
                                //         show: false
                                //     }
                                // }
                            }
                        }
                    ]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
                //动态设置参数
                myChart.setOption({
                    legend: {
                        bottom: 0,
                        left: 'center',
                        data:vlegend
                    },
                    series: [{
                        data: vdata,

                    }]
                })
            },
            //分页
            setPageTable(pageSize, pageNum) {
                let rtValue = [];
                let startNum = pageSize * (pageNum - 1);
                for (let i = 0; i < pageSize; i++) {
                    if ((startNum + i + 1) > this.allData.length)
                        break;
                    rtValue.push(this.allData[startNum + i]);
                }
                this.tableData = rtValue;
            },
            //设置分页所需要数据
            SetDataList(data) {
                this.data = this.filterTimeConversion(this.getPointByType(data));
                this.ALLdata = [];
                let i = 1;
                this.data.forEach(item => {
                    const tableData = {};
                    tableData.SerialNumber = i++;//序号
                    tableData.NetworkName = item.companyname;//企业名称
                    tableData.pscode = item.id;//城市id
                    tableData.Statues = item.category ? item.category : '----';//行业
                    // tableData.StartingState = item.buttonstate ? '启动' : '关闭';//状态
                    tableData.WanggeName = item.threeGridName ? item.threeGridName : '----';//网格名称item.WanggeName
                    tableData.latitude = item.latitude;//纬度
                    tableData.longitude = item.longitude;//经度
                    this.ALLdata.push(tableData);
                })
            },
            //数据
            GetListqyData() {
                //污染企业列表
                api.GetEmergencyList().then(res => {
                    let data = res.data.Data;
                    //console.log(data)
                    this.InitializationDataMethod(data)
                })
            },
            //搜索过滤数据
            filterTimeConversion(data) {
                const t = this;
                this.ALLdata = [];
                let rtValue = [];
                let dt = data;
                if (dt) {
                    for (let i = 0, length = dt.length; i < length; i++) {
                        let item = dt[i];
                        if (item.companyname.indexOf(t.filters.name) >= 0) {
                            rtValue.push(dt[i]);
                        }
                    }
                }
                return rtValue;
            },
            //
            searchData() {
                // 声明变量
                this.InitializationDataMethod(this.Aalllist);
            },
        },
        components: {EmergenTable,MeetTable}
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

    .newyingjiliest {
        width: 430px;
        height: auto;
        /**/
        @media only screen and (min-width: 1400px) {
            .emergen2,.emergen{
                top: 18%!important;
            }
        }
        .anniu {
            margin-top: 6px;
            width: 100%;
            height: 38px;
            button {
                margin-right: 15px;
                float: right;
            }
            .sousuo {
                width: 96%;
                margin-top: 10px;
                margin-left: 4%;
                float: left;
                margin-bottom: 25px;
                height: 40px;
                padding-top: 15px;
                .sleft {
                    float: left;
                }
                .sright {
                    margin-left: 10px;
                    float: left;
                }
            }
        }
        .emergen {
            position: fixed;
            top: 10px;
            left: 50%;
            margin-left: -500px;
            width: 1000px;
            height: 660px;
            z-index: 5000;
            padding: 10px;
            border: solid 1px #ccc;
            background: #fff;
            .title_em {
                width: 100%;
                height: 32px;
                line-height: 32px;
                font-size: 16px;
                border-bottom: 1px solid #ccc;
                span {
                    float: left;
                    padding-left: 15px;
                }
                i {
                    display: inline-block;
                    float: right;
                    padding-right: 10px;
                    line-height: 32px;
                }
            }
        }
        .emergen2 {
            position: fixed;
            top: 60px;
            left: 50%;
            width: 900px;
            margin-left: -450px;
            z-index: 5000;
            height:auto;
            border: solid 1px #ccc;
            background: #fff;
            padding: 10px;
            .title_em {
                width: 100%;
                height: 32px;
                line-height: 32px;
                font-size: 16px;
                border-bottom: 1px solid #ccc;
                span {
                    float: left;
                    padding-left: 15px;
                }
                i {
                    display: inline-block;
                    float: right;
                    padding-right: 10px;
                    line-height: 32px;
                }
            }
        }
        .table_container {
            margin-left: 10px;
            margin-top: 6px;
        }
        .bing {
            width: 420px;
            height: 280px;
            margin: 0 auto;
            margin-top: 20px;
            .look {
                width: 49%;
                height: auto;
                float: left;
                ul {
                    li {
                        list-style: none;
                        font-size: 10px;
                        width: 80px;
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
        .caodui {
                .line_top {
                    position: absolute;
                    left: -580px;
                    top: 24px;
                    width: 560px;
                    height: 46px;
                    background: #fff;
                    border-radius: 4px;
                    box-shadow: 0 0 4px #ccc;
                }
                .line_bottom {
                    position: absolute;
                    width: 610px;
                    height: 44px;
                    //background: rgba(0,0,0,0.6);
                    bottom: 56px;
                    left: -610px;
                    .tuli_01 {
                        width: 340px;
                        height: 44px;

                        float: left;
                        dl {
                            width: 100%;
                            height: 44px;
                            dt {
                                float: left;
                                height: 6px;
                                width: 85px;
                            }
                            dd {
                                float: left;
                                width: 85px;
                                height: 38px;
                                line-height: 38px;
                                background: rgba(0, 0, 0, 0.6);
                                color: #fff;
                            }
                        }
                    }
                    .tuli_02 {
                        width: 240px;
                        height: 38px;
                        background: rgba(0, 0, 0, 0.6);
                        float: left;
                        margin-top: 6px;
                        margin-right: 30px;
                        ul {
                            li {
                                list-style: none;
                                height: 38px;
                                width: 50%;
                                line-height: 38px;
                                text-align: left;
                                float: left;
                                color: #fff;
                                padding-left: 10px;
                                img {
                                }
                                span {
                                }
                            }
                        }
                    }
                }
            }
        img {
                position: absolute;
                top: 40%;
                left: -17px;
                cursor: pointer;
                float: left;
            }
        .main {
                height: auto;
                .tables {
                    width: 100%;
                    line-height: 38px;
                    a {
                        margin-left: -240px;
                        display: inline-block;
                        font-size: 16px;
                        color: #4696FF;
                        border-bottom: solid 2px #4696FF;
                        padding: 0 20px;
                        margin-bottom: -2px;
                    }
                    .xian {
                        width: 100%;
                        border: solid 1px #ccc;
                    }
                }
            }
    }


</style>
