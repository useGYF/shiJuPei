<template>
    <div class="LargeDataResources">
        <!--大数据资源-->
        <v-header></v-header>
        <!---->
        <div class="warp_conters">
            <el-tabs v-model="activeName" >
                <el-tab-pane label="参数对比" name="first">

                </el-tab-pane>
                <el-tab-pane label="站点对比" name="second">

                </el-tab-pane>
            </el-tabs>
        </div>
        <!---->
        <div class="warp_conter" v-show="activeName ==='first'">
            <!---->
            <div class="chaxun">
                <div class="chaxunkuang">
                    <div class="wbiaoti">
                        <a>查询条件</a>
                    </div>
                    <div class="cxtyope">
                        <span>监测点</span>
                        <el-select v-model="upData.pointName" clearable placeholder="请选择">
                            <el-option v-for="item in oneoptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="cxtime">
                        <el-radio-group v-model="upData.Type">
                            <el-radio-button v-for="item in timeZone" :key="item.value" :label="item.label"
                                             :disabled="item.disabled"></el-radio-button>
                        </el-radio-group>
                    </div>
                    <div v-show="upData.Type == '天'" class="day">
                        <el-date-picker v-model="startDay" type="date" placeholder="选择开始日期">
                        </el-date-picker>
                        <el-date-picker v-model="endDay" type="date" placeholder="选择结束日期">
                        </el-date-picker>
                    </div>
                    <div v-show="upData.Type == '小时'" class="startend">
                        <el-date-picker v-model="startHour" type="datetime" placeholder="选择开始日期时间">
                        </el-date-picker>
                        <el-date-picker v-model="endHour" type="datetime" placeholder="选择结束日期时间">
                        </el-date-picker>
                    </div>
                    <div class="button">
                        <el-button type="primary" v-on:click="query">查询<span
                                style="color: #333333;position: absolute;margin-top: 12px;margin-left: -300px;border:1px solid #bfcbd9;padding:10px;"
                                class="pop" :class="{prompt:isActive}">{{myError}}</span></el-button>

                    </div>
                </div>
            </div>
            <!---->
            <div class="DataChart">
                <div class="wbiaoti">
                    <a>变化趋势</a>
                </div>
                <div class="canvaszx">
                    <div class="zxt" id="canvaszx" width="1300" height="550"></div>
                </div>
            </div>
            <!---->
        </div>
        <div class="warp_conter" v-show="activeName ==='second'">
            <!--<h2>正在开发中</h2>-->
            <!---->
            <div class="chaxun">
                <div class="chaxunkuang">
                    <div class="wbiaoti">
                        <a>查询条件</a>
                    </div>
                    <div class="cxtyope">
                        <span>污染物</span>
                        <el-select v-model="upData.index" clearable placeholder="请选择" @change="selectchange">
                            <el-option v-for="item in twooptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="cxtime">
                        <el-radio-group v-model="upData.Type">
                            <el-radio-button v-for="item in timeZone" :key="item.value" :label="item.label"
                                             :disabled="item.disabled"></el-radio-button>
                        </el-radio-group>
                    </div>
                    <div v-show="upData.Type == '天'" class="day">
                        <el-date-picker v-model="startDay" type="date" placeholder="选择开始日期">
                        </el-date-picker>
                        <el-date-picker v-model="endDay" type="date" placeholder="选择结束日期">
                        </el-date-picker>
                    </div>
                    <div v-show="upData.Type == '小时'" class="startend">
                        <el-date-picker v-model="startHour" type="datetime" placeholder="选择开始日期时间">
                        </el-date-picker>
                        <el-date-picker v-model="endHour" type="datetime" placeholder="选择结束日期时间">
                        </el-date-picker>
                    </div>
                    <div class="button">
                        <el-button type="primary" v-on:click="zhandianquery">查询<span
                                style="color: #333333;position: absolute;margin-top: 12px;margin-left: -300px;border:1px solid #bfcbd9;padding:10px;"
                                class="pop" :class="{prompt:isActive}">{{myError}}</span></el-button>

                    </div>
                </div>
            </div>

            <div class="DataChart">
                <div class="wbiaoti">
                    <a>变化趋势</a>
                </div>
                <div class="canvaszx">
                    <div class="zxt" id="canvasquxian" width="1300" height="550"></div>
                </div>
            </div>
            <!---->
        </div>
        <!---->
    </div>
</template>

<script>
    import {bus} from '@/js/bus.js'
    import api from '../../api/index'

    export default {
        name: 'LargeDataResources',
        data() {
            return {
                //
                activeName:'first',
                //
                fullscreenLoading: false,
                //
                tanchu: false,
                //
                currentPage4: 100,
                //
                tableData: [],
                //
                allData: [],
                //
                pickerOptions0: {},
                //
                currentRow: null,
                //
                pagesize: 10,
                currentPage: 1,
                totalCount: 0,
                //
                twooptions: [
                    {
                        value: 'AQI',
                        label: 'AQI',
                    },
                    {
                        value: 'PM25',
                        label: 'PM2.5',
                    },
                    {
                        value: 'PM10',
                        label: 'PM10',
                    },
                    {
                        value: 'CO',
                        label: 'CO',
                    },
                    {
                        value: 'SO2',
                        label: 'SO2',
                    },
                    {
                        value: 'NO2',
                        label: 'NO2',
                    },
                    {
                        value: 'O3',
                        label: 'O3',
                    },
                    {
                        value: 'COMPLEXINDEX',
                        label: '综指',
                    }
                ],
                //
                oneoptions: [],
                //
                isActive: false,
                timeZone: [
                    {
                        value: 1,
                        label: '小时',
                        disabled: false
                    },
                    {
                        value: 2,
                        label: '天',
                        disabled: false
                    }
                    ],
                //开始时间
                startTime: '',
                //结束时间
                endTime: '',
                value4: '',
                //开始天
                startDay: '',
                //结束天
                endDay: '',
                //开始小时
                startHour: '',
                //结束小时
                endHour: '',
                upData: {
                    index:'AQI',
                    pointName: '河北工业大学',
                    startTime: '',
                    endTime: '',
                    Type: '小时'
                },
                //错误
                myError: '',
                //颜色
                colorArr: [],
                //
                compindex:'',
            }
        },
        created() {
            this.GetPointName();
        },
        mounted() {
            this.openFullScreen()
            //饼图canvas
        },
        methods: {
            //加载动画
            openFullScreen() {
                this.fullscreenLoading = true;
                setTimeout(() => {
                    this.fullscreenLoading = false;
                }, 2000);
                this.initlistData({
                    pointName: '',
                    startTime: '',
                    endTime: ''
                })
                this.GetElectricityIndexChart({
                    index: '',
                    startTime: '',
                    endTime: ''
                })
            },
            //站点对比污染物值
            selectchange(val){
                console.log(val);
                this.compindex = val;
                this.GetElectricityIndexChart({
                    index:this.compindex,
                    startTime: '',
                    endTime: ''
                });
            },
            //参数对比查询
            query() {
                this.myError = ''
                this.isActive =false;
                if (this.upData.Type == '天') {
                    if (!this.startDay) {
                        this.isActive = true;
                        this.myError = '请选择开始时间！！'
                        return
                    }

                    if (!this.endDay) {
                        this.isActive = true;
                        this.myError = '请选择结束时间！！'
                        return
                    }
                    var dateNow = this.startDay;
                    var dateNowEnd = this.endDay;

                    this.upData.startTime = dateNow.getFullYear() + '-' + (dateNow.getMonth() + 1) + '-' + dateNow.getDate()

                    this.upData.endTime = dateNowEnd.getFullYear() + '-' + (dateNowEnd.getMonth() + 1) + '-' + dateNowEnd.getDate()
                } else if (this.upData.Type == '小时') {
                    if (!this.startHour) {
                        this.isActive = true;
                        this.myError = '请选择开始时间！'
                        return
                    }

                    if (!this.endHour) {
                        this.isActive = true;
                        this.myError = '请选择结束时间！'
                        return
                    }
                    var startHour = this.startHour
                    var endHour = this.endHour

                    this.upData.startTime = `${startHour.getFullYear()}-${(startHour.getMonth() + 1)}-${startHour.getDate()} ${startHour.getHours()}:${startHour.getMinutes()}`

                    this.upData.endTime = `${endHour.getFullYear()}-${(endHour.getMonth() + 1)}-${endHour.getDate()} ${endHour.getHours()}:${endHour.getMinutes()}`

                } else {

                    this.initlistData({
                        pointName: '',
                        startTime: '',
                        endTime: ''
                    })
                    return
                }
                //获取数据
                this.initlistData(this.upData)
            },
            //站点对比查询
            zhandianquery() {
                this.myError = ''
                this.isActive =false;
                if (this.upData.Type == '天') {
                    if (!this.startDay) {
                        this.isActive = true;
                        this.myError = '请选择开始时间！！'
                        return
                    }

                    if (!this.endDay) {
                        this.isActive = true;
                        this.myError = '请选择结束时间！！'
                        return
                    }
                    var dateNow = this.startDay;
                    var dateNowEnd = this.endDay;

                    this.upData.startTime = dateNow.getFullYear() + '-' + (dateNow.getMonth() + 1) + '-' + dateNow.getDate()

                    this.upData.endTime = dateNowEnd.getFullYear() + '-' + (dateNowEnd.getMonth() + 1) + '-' + dateNowEnd.getDate()
                } else if (this.upData.Type == '小时') {
                    if (!this.startHour) {
                        this.isActive = true;
                        this.myError = '请选择开始时间！'
                        return
                    }

                    if (!this.endHour) {
                        this.isActive = true;
                        this.myError = '请选择结束时间！'
                        return
                    }
                    var startHour = this.startHour
                    var endHour = this.endHour

                    this.upData.startTime = `${startHour.getFullYear()}-${(startHour.getMonth() + 1)}-${startHour.getDate()} ${startHour.getHours()}:${startHour.getMinutes()}`

                    this.upData.endTime = `${endHour.getFullYear()}-${(endHour.getMonth() + 1)}-${endHour.getDate()} ${endHour.getHours()}:${endHour.getMinutes()}`

                } else {

                    this.GetElectricityIndexChart({
                        index: '',
                        startTime: '',
                        endTime: ''
                    })
                    return
                }
                //获取数据
                this.GetElectricityIndexChart(this.upData)
            },
            //
            toPercent(point) {
                var str = Number(point * 100).toFixed(1);
                str += "%";
                return str;
            },
            //转化数据
            ConversionData(data) {
                let newdata = data;
                switch (data) {
                    case 'AQI':
                        newdata = 'AQI'
                        break;
                    case 'pm25':
                        newdata = 'PM2.5'
                        break;
                    case 'pm10':
                        newdata = 'PM10'
                        break;
                    case 'so2':
                        newdata = 'SO2'
                        break;
                    case 'no2':
                        newdata = 'NO2'
                        break;
                    case 'co':
                        newdata = 'CO'
                        break;
                    case 'o3':
                        newdata = 'O3'
                        break;
                    case 'complexindex':
                        newdata = '综合指数'
                        break;
                }
                return newdata;
            },
            //参数对比图
            PieEchartscanvas(data) {
                //console.log(data)
                if (data) {
                    var legend = data.Legend || ['aqi'];
                    var seriesData = data.seriesData;
                    var xAxisData = data.xAxisData;
                    // 基于准备好的dom，初始化echarts实例
                    var myChart = echarts.init(document.getElementById('canvaszx'));
                    // 指定图表的配置项和数据
                    var option = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {},
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '10%',
                            containLabel: true
                        },
                        toolbox: {
                            feature: {
                                saveAsImage: {}
                            }
                        },
                        xAxis: {},
                        yAxis: {
                            type: 'value'
                        },
                        series: []
                    };
                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                    //动态设置参数
                    myChart.setOption({
                        legend: {
                            data: legend,
                            bottom: 5
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: xAxisData
                        },
                        series: seriesData
                    })

                }
            },
            //区县站点对比
            PieEchartXianqu(data) {
                //console.log(data)
                if (data) {
                    var legend = data.Legend || ["药材公司"];
                    var seriesData = data.seriesData;
                    var xAxisData = data.xAxisData;
                    // 基于准备好的dom，初始化echarts实例
                    var myChart = echarts.init(document.getElementById('canvasquxian'));
                    // 指定图表的配置项和数据
                    var option = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {},
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '20%',
                            containLabel: true
                        },
                        toolbox: {
                            feature: {
                                saveAsImage: {}
                            }
                        },
                        xAxis: {},
                        yAxis: {
                            type: 'value'
                        },
                        series: []
                    };
                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                    //动态设置参数
                    myChart.setOption({
                        legend: {
                            data: legend,
                            bottom: 5
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: xAxisData
                        },
                        series: seriesData
                    })

                }
            },
            //获取列表监测点
            GetPointName() {
                api.GetPointNameListData().then(res => {
                    //console.log('获取监测数据成功！')
                    // console.log(res);
                    let pointNames = res.data.Data;//
                    pointNames.forEach(item => {
                        const tableData1 = {};//
                        tableData1.value = item;//
                        tableData1.label = item;//
                        this.oneoptions.push(tableData1);//
                    })
                })
            },
            //参数对比
            initlistData(params) {
                let ndt = new Date();
                let ndt7 = new Date(ndt);
                ndt7.setDate(ndt.getDate() - 3);
                //pointName监测点名称；startTime开始时间；endTime结束时间
                let pointName = encodeURI(params.pointName) || encodeURI('河北工业大学');
                let startTime = params.startTime || (ndt7.getFullYear() + '-' + (ndt7.getMonth() + 1) + '-' + ndt7.getDate());
                let endTime = params.endTime || (ndt.getFullYear() + '-' + (ndt.getMonth() + 1) + '-' + ndt.getDate());
                if (this.upData.Type == '天'){
                    console.log('获取天数据成功');
                    api.GetElectricityChartForDayRes(pointName, startTime, endTime).then(res => {
                        ///
                        let data = res.data.Data;
                        console.log('获取天数据成功');
                        setTimeout(() => {
                            this.PieEchartscanvas(data);
                        }, 300)
                    }, res => {
                        console.log('失败了');
                    })
                }else{
                    api.GetElectricityChart2(pointName, startTime, endTime).then(res => {
                        ///
                        let data = res.data.Data;
                        setTimeout(() => {
                            this.PieEchartscanvas(data);
                        }, 300)
                    }, res => {
                        console.log('失败了');
                    })
                }
            },
            //站点对比
            GetElectricityIndexChart(params) {
                let ndt = new Date();
                let ndt7 = new Date(ndt);
                ndt7.setDate(ndt.getDate() - 3);
                //index监测物；startTime开始时间；c结束时间
                let index = params.index || 'AQI';
                let startTime = params.startTime || (ndt7.getFullYear() + '-' + (ndt7.getMonth() + 1) + '-' + ndt7.getDate());
                let endTime = params.endTime || (ndt.getFullYear() + '-' + (ndt.getMonth() + 1) + '-' + ndt.getDate());
                if (this.upData.Type == '天'){
                    api.GetElectricityIndexChartForDayRes(index, startTime, endTime).then(res => {
                    //
                    let data = res.data.Data;
                    console.log('获取天数据成功');
                    console.log(data);
                    setTimeout(() => {
                        this.PieEchartXianqu(data);
                    }, 300)
                }, res => {
                    console.log('失败了');
                })
                }else{
                    api.GetElectricityIndexChartRes(index, startTime, endTime).then(res => {
                        //
                        let data = res.data.Data;
                        console.log('获取数据成功');
                        console.log(data);
                        setTimeout(() => {
                            this.PieEchartXianqu(data);
                        }, 300)
                    }, res => {
                        console.log('失败了');
                    })
                }
            },
            //每页显示数据量变更
            handleSizeChange(val) {
                this.pagesize = val;
            },
            //页码变更
            handleCurrentChange(val) {
                this.setPageTable(10, val);
            },
            //分页
            setPageTable(pageSize, pageNum) {
                //100,1
                let rtValue = [];
                let startNum = pageSize * (pageNum - 1);
                for (let i = 0; i < pageSize; i++) {
                    //console.log(pageSize)
                    if ((startNum + i + 1) > this.allData.length)
                        break;
                    rtValue.push(this.allData[startNum + i]);
                }
                this.tableData = rtValue;
            }
        },
        components: {} //0809
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .pop {
        display: none;
    }

    .prompt {
        display: block;
    }

    .LargeDataResources {
        width: 100%;
        min-height: 800px;
        height: 100%;
        background: rgb(250, 250, 250);
        .warp_conters{
            width: 1330px;
            margin: 0 auto;
        }
        .chaxun {
            width: 1300px;
            height: 100px;
            margin: 0 auto;
            .wbiaoti {
                a {
                    display: inline-block;
                    height: 20px;
                    border-left: solid 3px #428bca;
                    padding-left: 13px;
                    font-size: 16px;
                    line-height: 20px;
                }

                text-align: left;
                border-bottom: solid 1px #ccc;
                width: 100%;
                height: 40px;
                margin-top: 10px;
                margin-bottom: 20px;
            }
            .chaxunkuang {
                width: 100%;
                height: 40px;
                line-height: 45px;
                .input {
                    float: left;
                    width: 300px;
                    height: 40px;
                    input {
                        height: 34px;
                        border-radius: 4px;
                        border: solid 1px #bfcbd9;
                    }
                }
                .cxtyope {
                    float: left;
                    margin-left: 90px;
                    span{
                        padding-right: 15px;
                    }
                }
                .cxtime {
                    float: left;
                    margin-left: 90px;
                }
                .day {
                    float: left;
                    margin-left: 90px;
                }
                .startend {
                    float: left;
                    margin-left: 90px;
                }
                .button {
                    float: left;
                    margin-left: 25px;
                }
            }
        }
        .DataChart {
            width: 1300px;
            margin-top: 30px;
            margin-bottom: 20px;
            height: 500px;
            margin: 0 auto;
            .wbiaoti {
                a {
                    display: inline-block;
                    height: 20px;
                    border-left: solid 3px #428bca;
                    padding-left: 13px;
                    font-size: 16px;
                    line-height: 20px;
                }
                text-align: left;
                border-bottom: solid 1px #ccc;
                width: 100%;
                height: 40px;
                margin-top: 40px;
                margin-bottom: 10px;
            }

            .canvaszx {
                width: 1300px;
                height: 550px;
                .zxt {
                    width: 1300px;
                    height: 550px;
                }
            }
        }
    }
</style>
