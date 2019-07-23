<template>
    <div class="Report-people">
        <!--全民举报-->
       <div class="main">
                    <!--选项查询-->
                    <div class="first">
                        <div class="shijian time-qm">
                            <!--时间选择-->
                            <div class="block"  style="float: left;margin-left: 10px">
                                <el-date-picker
                                        v-model="starttime"
                                        type="date"
                                        placeholder="选择日期"
                                        :picker-options="pickerOptions0">
                                </el-date-picker>
                            </div>
                            <div style="float: left;line-height: 34px;padding: 0 3px">-</div>
                            <div class="block"  style="float: left">
                                <el-date-picker
                                        v-model="endtime"
                                        type="date"
                                        placeholder="选择日期"
                                        :picker-options="pickerOptions1">
                                </el-date-picker>
                            </div>
                        </div>
                        <div class="btnns">
                            <button @click="btnClickEvent">查询</button>
                        </div>
                    </div>
                    <!--图表-->
                    <div class="chars-tubiao">
                        <!--案件网格数量占比-->
                        <div class="title-daqi">
                            <div class="shuxian"></div>
                            <div class="title-text">
                                <div class="bing_text">案件数量占比</div>
                            </div>
                        </div>
                        <div class="">
                            <div id="bing_item_1p" style="width: 390px;height: 180px;padding-left: 14px"></div>
                        </div>
                        <!---->
                        <div class="title-daqi">
                            <div class="shuxian"></div>
                            <div class="title-text">
                                <div class="bing_text">案件类型占比</div>
                            </div>
                        </div>
                        <!--案件类型占比-->
                        <div class="">
                            <div id="bing_item_2p" style="width: 390px;height: 180px;padding-left: 14px"></div>
                        </div>
                    </div>
                    <!--排名-->
                    <div class="table_container">
                        <el-table
                                :data="tableData"
                                border
                                stripe
                                highlight-current-row
                                @current-change="RowCurrentChange"
                                style="width: 400px">
                            <el-table-column
                                    property="time"
                                    label="时间"
                                    width="160"
                                    >
                            </el-table-column>
                            <el-table-column
                                    property="reportType"
                                    label="案件类型"
                                    >
                            </el-table-column>
                            <el-table-column
                                    property="grid"
                                    label="所属网格"
                                    >
                            </el-table-column>

                        </el-table>
                        <!--分页条-->
                        <div class="Pagination" style="text-align: left;margin-top: 10px;">
                            <el-pagination
                                    background
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :current-page="currentPage"
                                    :page-size="pagesize"
                                    layout="total, prev, pager, next"
                                    :total="totalCount">
                            </el-pagination>
                        </div>
                    </div>
                </div>
    </div>
</template>

<script>
    import {bus} from '@/js/bus.js'
    import api from '../api/index'

    export default {
        name: 'Reportpeople',
        data() {
            return {
                //列表数据
                tableData: [],
                //存储分页数据
                alldata: [],
                //
                currentRow: null,
                //分页每页
                pagesize: 10,
                //当前页码
                currentPage: 1,
                //分页总数量
                totalCount: 10,
                //开始时间控制区
                pickerOptions0: {},
                //结束时间控制区
                pickerOptions1: {},
                //开始时间
                starttime: '',
                //结束时间
                endtime: '',
            }
        },
        created() {
            //初始化数据接入
            api.GetpeortpleselectCases().then(res =>{
               //案件列表
                let data = res.data.case;
                //案件数量比
                let grid = res.data.grid;
                //案件类型比
                let type = res.data.type;
               // console.log(data)
                this.InitializationDataMethod(data);
                //数量表图例
                this.NumberCasesChars(grid);
                //类型比图例
                this.TypeCasesChars(type);
            })

        },
        mounted() {
            //右侧收放
            setTimeout(()=>{
                //
                this.NumberCasesChars();
                //
                this.TypeCasesChars();
            },500)
        },
        methods: {
            //排序
            compare(propertyName) {
                return function (object1, object2) {
                    let value1 = object1[propertyName]
                    let value2 = object2[propertyName]
                    return value2 - value1
                }
            },
            //初数据始化列表
            InitializationDataMethod(data) {
                const _this = this;
                //
                _this.alldata = [];
                //
                data.forEach(item => {
                    const tableData = {};
                    tableData.time = item.createtime;//时间
                    tableData.reportType = item.pollutiontype;//
                    tableData.casecode = item.casecode;//城市id
                    tableData.latitude = item.latitude;//纬度
                    tableData.longitude = item.longitude;//经度
                    tableData.grid = item.departmenttype;//网格
                    _this.alldata.push(tableData);
                    //this.tableData.push(tableData)
                })
                console.log(this.alldata)
                this.totalCount = this.alldata.length;
                //
                this.setPageTable(10, 1);
            },
            //table点击事件
            RowCurrentChange(val) {
                this.currentRow = val;
                //地图联动
                //bus.$emit('locationClick', 'layer_gd', this.currentRow ,this.type);
            },
            //每页显示数据量变更
            handleSizeChange(val) {
                //this.pagesize = val;
            },
            //页码变更
            handleCurrentChange(val) {
                this.setPageTable(10, val);
                console.log(val)
            },
            //分页效果
            setPageTable(pageSize, pageNum) {
                let rtValue = [];
                let startNum = pageSize * (pageNum - 1);
                for (let i = 0; i < pageSize; i++) {
                    if ((startNum + i + 1) > this.alldata.length)
                        break;
                    rtValue.push(this.alldata[startNum + i]);
                }
                this.tableData = rtValue;
            },
            //数据筛选
            getPointByType(type) {
                let rtValue = [];
                let dt = this.data;
                if (dt) {
                    for (let i = 0, length = dt.length; i < length; i++) {
                        let item = dt[i];
                        if (item.type === type) {
                            rtValue.push(dt[i]);
                        }
                    }
                }
                return rtValue;
            },
            //查询事件
            btnClickEvent() {
                const t = this;
                //开始时间
                let starttime = this.TimeConversion('yyyy-MM-dd hh:00:00', this.starttime);
                //结束时间
                let endtime = this.TimeConversion('yyyy-MM-dd hh:00:00', this.endtime);
                //
                console.log('开始时间' + starttime);
                console.log('结束时间' + endtime);
            },
            //时间转换
            TimeConversion(fmt, date) {
                var o = {
                    "M+": date.getMonth() + 1,                 //月份
                    "d+": date.getDate(),                    //日
                    "h+": date.getHours(),                   //小时
                    "m+": date.getMinutes(),                 //分
                    "s+": date.getSeconds(),                 //秒
                    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                    "S": date.getMilliseconds()             //毫秒
                };
                if (/(y+)/.test(fmt))
                    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            },
            //案件数量占比
            NumberCasesChars(data){
                let showData = data.map(function (v) {
                    return {value: (v.percent).replace('%',''), name: v.name}
                }) || [];
                let lenData = data.map(function (v) {
                    return {name: v.name}
                }) || [];
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('bing_item_1p'));
                // 指定图表的配置项和数据
                let option = {

                    legend: {
                        orient: 'right',
                        y:'center',
                        left:160,
                       // data: ['广阳区','安次区','开发区']
                        data:lenData
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '70%',
                            center: ['20%', '50%'],
                            hoverAnimation: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '20',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            // data: [
                            //     {value: 335, name: '广阳区'},
                            //     {value: 310, name: '安次区'},
                            //     {value: 234, name: '开发区'},
                            //
                            // ],

                        }
                    ]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
                //动态设置参数
                myChart.setOption({
                    series: [{
                       data: showData,
                        color: [
                            // '#08a1ed',
                            // '#a2c73b',
                            // '#f2cd49',
                            // '#85dbce',
                            // '#ce93e3',
                            // '#6c68e1',
                            // '#e5763f'
                        ]
                    }]
                })
            },
            //案件类型占比
            TypeCasesChars(data){
                let showData = data.map(function (v) {
                    return {value: (v.percent).replace('%',''), name: v.name}
                }) || [];
                let lenData = data.map(function (v) {
                    return {name: v.name}
                }) || [];
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('bing_item_2p'));
                // 指定图表的配置项和数据
                let option = {

                    legend: {
                        orient: 'right',
                        y:'center',
                        left: 'right',
                        // data: ['垃圾堆放','土壤裸露','露天烧烤','垃圾焚烧','餐饮油烟','建筑扬尘','废气排放','汽车尾气']
                        data:lenData
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '70%',
                            center: ['20%', '50%'],
                            hoverAnimation: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '20',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            data: [
                                {value: 335, name: '垃圾堆放'},
                                {value: 310, name: '土壤裸露'},
                                {value: 234, name: '露天烧烤'},
                                {value: 135, name: '垃圾焚烧'},
                                {value: 548, name: '餐饮油烟'},
                                {value: 500, name: '建筑扬尘'},
                                {value: 500, name: '废气排放'},
                                {value: 300, name: '汽车尾气'}
                            ],

                        }
                    ]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
                //动态设置参数
                myChart.setOption({
                    series: [{
                       data: showData,
                        color: [
                            // '#08a1ed',
                            // '#a2c73b',
                            // '#f2cd49',
                            // '#85dbce',
                            // '#ce93e3',
                            // '#6c68e1',
                            // '#e5763f'
                        ]
                    }]
                })
                //触动当前方法
                myChart.on('legendselectchanged', function(obj) {
                    let selected = obj.selected;
                    let legend = obj.name;
                    if(selected[legend] == false){
                        console.log(legend);
                    }
                });
            },
            //
        },
        components: {}
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

    .Report-people {
        width: 430px;
        height: auto;
        /**/
        .title-daqi{
            width: 100%;
            height: 36px;
            .shuxian{
                width: 3px;
                height: 24px;
                background: #1FA1FF;
                float: left;
                margin-left: 10px;
            }
            .title-text{
                float: left;
                font-weight: bold;
                line-height: 24px;
                padding-left: 10px;
                text-align: left;
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

                .kbiaoti {
                    padding: 10px 0px;
                }

                .bluexian {
                    width: 26px;
                    border: 1px solid #1080cc;
                    margin: 0 auto;
                }

                .first {
                    width: 100%;
                    height: 44px;
                    margin-top: 30px;

                    .tables {
                        float: left;
                        margin-left: 14px;

                        a {
                            padding: 0 15px;
                            float: left;
                            text-decoration: none;
                            color: #666;
                            display: inline-block;
                            line-height: 34px;
                            width: 100px;
                            height: 34px;
                            margin-right: 16px;
                            border: solid 1px #ccc;
                            background: #fff;
                            border-radius: 2px;
                        }

                    }
                    .shijian {
                        float: left;
                        margin-left: 6px;
                    }

                    .btnns {
                        float: left;
                        margin-left: 6px;

                        button {
                            border: none;
                            width: 80px;
                            height: 34px;
                            background: #1FA1FF;
                            color: #fff;
                            border-radius: 4px;
                        }

                    }
                }
                .tqbiaoti {
                    width: 100%;
                    height: 22px;
                    padding-left: 20px;
                    text-align: left;
                    margin-left: 16px;
                    border-left: solid 3px #2a6496;
                }

                .table_container {
                    margin-left: 16px;
                }

            }
    }

</style>
