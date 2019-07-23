<template>
    <div class="OnlineList">
        <!--工地-->
       <div class="main">
                    <!--选项查询-->
                    <div class="first">
                        <div class="tables">
                            <!--选项-->
                            <a style="background: #fff">当前时间</a>
                        </div>
                        <div class="shijian">
                            <!--时间选择-->
                            <div class="block">
                                <el-date-picker
                                        v-model="value2"
                                        type="datetime"
                                        placeholder="选择日期时间"
                                        align="right"
                                        :picker-options="pickerOptions1">
                                </el-date-picker>
                            </div>
                        </div>
                        <div class="btnns">
                            <button @click="btnClickEvent">查询</button>
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
                                    property="ranking"
                                    label="排名"
                                    width="80">
                            </el-table-column>
                            <el-table-column
                                    property="Grid"
                                    label="网格名称"
                                    width="80">
                            </el-table-column>
                            <el-table-column
                                    property="name"
                                    label="名称"
                                    width="160">
                            </el-table-column>
                            <el-table-column
                                    property="aqi"
                                    :label="labelType"
                                    width="100">
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
        name: 'onlinelist',
        data() {
            return {
                //
                type: 'PM2.5',
                //
                labelType: 'PM2.5',
                //
                ALLdata: [],
                //
                tableData: [],
                //
                allData: [],
                //
                currentRow: null,
                //
                pagesize: 10,
                //
                currentPage: 1,
                //
                totalCount: 0,
                //
                pickerOptions1: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                //
                value1: '',
                //
                value2: '',
            }
        },
        created() {
            //初始化数据接入
            this.InitializationDataMethod();
            //指标切换
            bus.$on('refreshDustTarget', this.refreshTable);
        },
        mounted() {
            //右侧收放
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
            InitializationDataMethod() {
                //
                api.GetDustHourRanking().then(res => {
                    let data = res.data.Data;
                    //
                    this.SetDataList(data, this.type);
                    this.totalCount = this.ALLdata.length;
                    this.allData = this.ALLdata;
                    this.setPageTable(10, 1);
                })

            },
            //指标转换
            getPollution(type) {
                let rtValue = type;
                switch (type.toUpperCase()) {
                    case 'PM2.5':
                        rtValue = 'pm25';
                        break;
                    case 'PM10':
                        rtValue = 'pm10';
                        break;
                    case 'TEMP':
                        rtValue = 'temp';
                        break;
                    case 'HUMI':
                        rtValue = 'humi';
                        break;
                    case 'WINDSPEED':
                        rtValue = 'windspeed';
                        break;
                    case 'WINDDIRECTION':
                        rtValue = 'winddirection';
                        break;
                }
                //console.log(rtValue);
                return rtValue;
            },
            //指标转换
            getPollutionTarget(type) {
                let rtValue = type;
                switch (type.toUpperCase()) {
                    case 'INDEX':
                        rtValue = '综指';
                        break;
                    case 'TEMP':
                        rtValue = '温度';
                        break;
                    case 'HUMI':
                        rtValue = '湿度';
                        break;
                    case 'WINDSPEED':
                        rtValue = '风级';
                        break;
                    case 'WINDDIRECTION':
                        rtValue = '风向';
                        break;
                }
                console.log(rtValue);
                return rtValue;
            },
            //table点击事件
            RowCurrentChange(val) {
                this.currentRow = val;
                //地图联动
                bus.$emit('locationClick', 'layer_gd', this.currentRow ,this.type);
            },
            //设置表格
            SetDataList(data, type) {
                //console.log(data)
                let ptype = type;
                this.data = data;
                this.ALLdata = [];
                let i = 1;
                let dt1 = this.getPointByType(this.ptType);
                let dt2 = dt1.sort(this.compare(this.getPollution(type)));
                dt2.forEach(item => {
                    const tableData = {};
                    tableData.ranking = i++;//排名
                    tableData.name = item.name;//类型
                    tableData.deviceid = item.deviceid;//城市id
                    tableData.latitude = item.latitude;//纬度
                    tableData.longitude = item.longitude;//经度
                    tableData.sourcetype = item.sourcetype;//监测点类型 XH或开发区
                    tableData.Grid = item.gridname || item.gridName ||item.firstgridname|| '----';//网格
                    tableData.aqi = item[this.getPollution(ptype)] || '--';//数值
                   // console.log(this.getPollution(ptype))
                    this.ALLdata.push(tableData);
                })
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
                    if ((startNum + i + 1) > this.allData.length)
                        break;
                    rtValue.push(this.allData[startNum + i]);
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
                let time = this.TimeConversion('yyyy-MM-dd hh:00:00', this.value2);
                //console.log(time)
                api.GetDustHourRanking(time).then(res => {
                    let data = res.data.Data;
                    data = typeof data === 'string' ? JSON.parse(data) : data;
                    //
                    this.SetDataList(data, this.type)
                    this.totalCount = this.ALLdata.length;
                    this.allData = this.ALLdata;
                    this.setPageTable(10, 1);
                    //
                    bus.$emit('loadCumulative', data, 'layer_gd', t.type,'name');
                })
            },
            //type更改
            refreshTable(type) {
                this.type = type;
                this.labelType = this.Tochangelabeltype(type);
                this.SetDataList(this.data, type);
                this.totalCount = this.ALLdata.length;
                this.allData = this.ALLdata;
                this.setPageTable(10, 1);
            },
            //转列表显示值
            Tochangelabeltype(type){
                let rtValue = type;
                // console.log(type.toUpperCase());
                switch (type.toUpperCase()) {
                    case 'AQI':
                        rtValue = 'AQI';
                        break;
                    case 'PM25':
                        rtValue = 'PM2.5';
                        break;
                    case 'PM10':
                        rtValue = 'PM10';
                        break;
                    case 'SO2':
                        rtValue = 'SO2';
                        break;
                    case 'NO2':
                        rtValue = 'NO2';
                        break;
                    case 'CO':
                        rtValue = 'CO';
                        break;
                    case 'O3':
                        rtValue = 'O3';
                        break;
                    case 'COMPLEXINDEX':
                        rtValue = '综指';
                        break;
                    case 'TEMP':
                        rtValue = '温度';
                        break;
                    case 'HUMI':
                        rtValue = '湿度';
                        break;
                    case 'WINDANGLE':
                        rtValue = '风向';
                        break;
                    case 'WINDSPEED':
                        rtValue = '风力';
                        break;
                }
                return rtValue;
            },
            //指标切换
            switchRender(type) {
                this.type = type;
                this.labelType = this.getPollutionTarget(type);
                this.setdata(this.data, this.type)
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

        },
        components: {}
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

    .OnlineList {
        width: 430px;
        height: auto;
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
                            background: #4696FF;
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
