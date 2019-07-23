<template>
    <div class="DustEmissionStatistics">
        <!--扬尘源统计-->
        <v-header></v-header>
        <div class="chaxun">
            <div class="chaxunkuang">
                <div class="wbiaoti">
                    <a>查询条件</a>
                </div>
                <div class="input">
                    <strong>工地名称</strong>
                    <input v-model="upData.BuildingSiteName" type="text">
                </div>
                <div class="cxtyope">
                    <span>所属区域</span>
                    <el-select v-model="upData.Area" clearable placeholder="请选择">
                        <el-option v-for="item in oneoptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="cxtime">
                    <el-select v-model="upData.Type" clearable placeholder="请选择">
                        <el-option v-for="item in timeZone" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div v-show="upData.Type == '2'" class="day">
                    <el-date-picker v-model="startDay" type="date" placeholder="选择开始日期">
                    </el-date-picker>
                    <el-date-picker v-model="endDay" type="date" placeholder="选择结束日期">
                    </el-date-picker>
                </div>
                <div v-show="upData.Type == '1'" class="startend">
                    <el-date-picker v-model="startHour" type="datetime" placeholder="选择开始日期时间">
                    </el-date-picker>
                    <el-date-picker v-model="endHour" type="datetime" placeholder="选择结束日期时间">
                    </el-date-picker>
                </div>
                <div class="button">
                    <el-button type="primary" v-on:click="query">查询<span
                            style="color: #333333;position: absolute;margin-top: 50px;margin-left: -50px;">{{myError}}</span>
                    </el-button>

                </div>
            </div>
        </div>
        <!--table-->
        <div class="tables">
            <div class="wbiaoti">
                <a>列表</a>
            </div>
            <el-table border :data="tableData" style="width: 100%">
                <el-table-column prop="name" label="工地名称">
                </el-table-column>
                <el-table-column prop="region" label="位置">
                </el-table-column>
                <el-table-column prop="pm10" label="PM10">
                </el-table-column>
                <el-table-column prop="pm2_5" label="PM2.5">
                </el-table-column>
                <el-table-column prop="windDirection" label="风向统计">
                    <template scope="scope">
                        <el-button @click="tanchukuang(scope.$index, scope.row)" type="text" size="small">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--弹出框-->
        <div class="tanchukuang" v-if="tanchu">
            <div class="fadess"></div>
            <div class="succ-pop">
                <div class="title">
                    <a>风向占比</a>
                    <div class="el-icon-close" @click="guanbitanchukuang"></div>
                </div>
                <!---->
                <canvas id="wcanvas">
                    抱歉，您的浏览器不支持Canvas。请升级您的浏览器！
                </canvas>
                <!---->
                <ol>
                    <li v-for="item in colorArr" :style="{color:item.color}"><p v-text="toPercent(item.counts)"></p>
                    </li>
                </ol>
                <ul>
                    <li v-for="item in colorArr"><i :style="{background : item.color}"></i>{{item.name}}</li>
                </ul>
            </div>
        </div>
        <!--分页-->
        <div class="block">
            <el-pagination
                    background
                    @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="currentPage" :page-size="pagesize" layout="total, prev, pager, next, jumper"
                           :total="totalCount">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'index',
        data() {
            return {
                fullscreenLoading: false,
                tanchu: false,
                currentPage4: 100,
                tableData: [],
                allData: [],
                pickerOptions0: {},
                currentRow: null,
                pagesize: 10,
                currentPage: 1,
                totalCount: 0,
                oneoptions: [{
                    value: '市区',
                    label: '市区'
                }, {
                    value: '广阳区',
                    label: '广阳区'
                }, {
                    value: '安次区',
                    label: '安次区'
                }],
                timeZone: [{
                    value: 1,
                    label: '小时',
                }, {
                    value: 2,
                    label: '日',
                }],
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
                    BuildingSiteName: '',
                    Area: '请选择',
                    Type: '请选择',
                    Time: '',
                    endTime: ''
                },
                //错误
                myError: '',
                //颜色
                colorArr: []
            }
        },
        created() {

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
                    BuildingSiteName: '',
                    Area: '市区',
                    Type: 0,
                    Time: '',
                    endTime: ''
                })
            },
            //查询
            query() {
                this.myError = ''

                if (this.upData.Type == 2) {
                    if (!this.startDay) {
                        this.myError = '选择开始时间'
                        return
                    }

                    if (!this.endDay) {
                        this.myError = '选择结束时间'
                        return
                    }
                    var dateNow = this.startDay;
                    var dateNowEnd = this.endDay;

                    this.upData.Time = dateNow.getFullYear() + '-' + (dateNow.getMonth() + 1) + '-' + dateNow.getDate();
                    this.upData.endTime = dateNowEnd.getFullYear() + '-' + (dateNowEnd.getMonth() + 1) + '-' + dateNowEnd.getDate();
                } else if (this.upData.Type == 1) {
                    if (!this.startHour) {
                        this.myError = '选择开始时间'
                        return
                    }

                    if (!this.endHour) {
                        this.myError = '选择结束时间'
                        return
                    }
                    var startHour = this.startHour
                    var endHour = this.endHour

                    this.upData.Time = `${startHour.getFullYear()}-${(startHour.getMonth() + 1)}-${startHour.getDate()} ${startHour.getHours()}:${startHour.getMinutes()}`

                    this.upData.endTime = `${endHour.getFullYear()}-${(endHour.getMonth() + 1)}-${endHour.getDate()} ${endHour.getHours()}:${endHour.getMinutes()}`

                } else {
                    this.initlistData({
                        BuildingSiteName: '',
                        Area: '市区',
                        Type: 0,
                        Time: '',
                        endTime: ''
                    })
                    return
                }
                //console.log(this.upData)

                //获取数据
                this.initlistData(this.upData)
            },
            toPercent(point) {
                var str = Number(point * 100).toFixed(1);
                str += "%";
                return str;
            },
            //弹出框
            tanchukuang(index, item) {
                this.data = []
                this.colorArr = []
                let that = this;
                let ndt = new Date();
                let ndt7 = new Date(ndt);
                ndt7.setDate(ndt.getDate() - 7);
                this.$axios({
                    url: 'http://117.119.97.150:8063/api/Dust/GetWindDirectionPie',
                    //url: 'http://117.119.97.150:8063/api/Dust/GetWindDirectionPie',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        startTime: this.upData.Time || (ndt7.getFullYear() + '-' + (ndt7.getMonth() + 1) + '-' + ndt7.getDate()),
                        endTime: this.upData.endTime || (ndt.getFullYear() + '-' + (ndt.getMonth() + 1) + '-' + ndt.getDate()),
                        name: item.name
                    },
                    data: {}
                }).then(res => {
                    //console.log(res)

                    this.tanchu = true;
                    setTimeout(function () {
                        that.bingtucanvas(res)
                    }, 500)

                }, res => {
                    console.log('失败了')
                })

            },
            guanbitanchukuang() {
                this.tanchu = false
            },
            //echarts
            PieEchartscanvas(res) {

                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('pie'));
                //data
                //let PieData = res.data.ExtraData;
                let PieData = res.data.Data;
                PieData = typeof PieData === 'string' ? JSON.parse(PieData) : PieData;
                //
                let weatherIcons = {};
                //
                let color = ['#e6cf0f', '#d67b80', '#2fc7ca', '#59b1f0', '#fdc79b', '#b7a2dd', '#8c98b0', '#97b553'];
                //
                for (let i = 0; i < PieData.length; i++) {
                    PieData[i].color = color.pop()
                }
                this.colorArr = PieData;
                let option = {

                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },

                    series: [
                        {
                            type: 'pie',
                            radius: '65%',
                            center: ['50%', '50%'],
                            selectedMode: 'single',

                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
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
                        // orient: 'vertical',
                        // top: 'middle',
                        bottom: 10,
                        left: 'center',
//                        data: ['西凉', '益州','兖州','荆州','幽州']
                    },
                    series: [{
                        data: [
//                            {value:535, name: '荆州'},
//                            {value:510, name: '兖州'},
//                            {value:634, name: '益州'},
//                            {value:735, name: '西凉'}
                        ],
//                        color: color
                    }]
                })
            },
            bingtucanvas(res) {
                //var data = res.data.ExtraData
                var data = res.data.Data;
                data = typeof data === 'string' ? JSON.parse(data) : data;
                //console.log('canvas数据')
                //console.log(data)
                let canvas = document.getElementById("wcanvas");
                canvas.border = "1px solid #000";
                canvas.backgroundColor = "#FFFFFF";
                canvas.width = 490;
                canvas.height = 300;
                let ctx = canvas.getContext("2d");

                var color = ['#e6cf0f', '#d67b80', '#2fc7ca', '#59b1f0', '#fdc79b', '#b7a2dd', '#8c98b0', '#97b553']

                for (var i = 0; i < data.length; i++) {
                    data[i].color = color.pop()
                }
                this.colorArr = data
                //console.log(data)

                let tempAngle = -90;
                for (let i = 0; i < data.length; i++) {
                    // 开始绘制新状态的扇形
                    ctx.beginPath();
                    ctx.moveTo(240, 140);
                    ctx.fillStyle = data[i].color;
                    let angle = data[i].counts * 360;
                    let startAngle = tempAngle * Math.PI / 180;
                    let endAngle = (tempAngle + angle) * Math.PI / 180;
                    ctx.arc(240, 140, 120, startAngle, endAngle);
                    ctx.fill();
                    tempAngle += angle;
                }

            },
            initlistData(params) {
                this.$axios({
                    url: 'http://117.119.97.150:8063/api/Dust/GetDustStatistics',
                    //url: 'http://117.119.97.150:8063/api/Dust/GetDustStatistics',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    params: params,
                    data: {}
                }).then(res => {
                    //console.log(res)
                    //let dt = res.data.ExtraData || '';
                    let dt = res.data.Data || '';
                    dt = typeof dt === 'string' ? JSON.parse(dt) : dt;
                    //console.table(dt)
                    this.totalCount = dt.length;
                    this.allData = dt;
                    this.setPageTable(10, 1);
                    //console.log(dt);

                }, res => {
                    console.log('失败了')
                })
            },
            //每页显示数据量变更
            handleSizeChange(val) {
                //this.pagesize = val;
            },
            //页码变更
            handleCurrentChange(val) {
                this.setPageTable(10, val);
                //console.log(val)
            },
            setPageTable(pageSize, pageNum) {
                let rtValue = [];
                let startNum = pageSize * (pageNum - 1);
                for (let i = 0; i < pageSize; i++) {
                    if ((startNum + i + 1) > this.allData.length)
                        break;
                    rtValue.push(this.allData[startNum + i]);
                }
                this.tableData = rtValue;
            }
        },
        components: {} //
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .DustEmissionStatistics {
        width: 100%;
        min-height: 800px;
        height: 100%;
        background: rgb(250, 250, 250);
        .tanchukuang {
            /*灰色遮罩层*/
            .fadess {
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                position: fixed;
                left: 0;
                top: 0;
                z-index: 998;
            }
            /*弹出层*/
            .succ-pop {
                width: 490px;
                height: 390px;
                background: #fff;
                position: fixed;
                left: 50%;
                top: 50%;
                margin-left: -200px;
                margin-top: -150px;
                z-index: 999;
                border-radius: 5px;
                border: solid 1px #357ebd;
                #canvas {
                    width: 490px;
                }
                .title {
                    width: 100%;
                    height: 32px;
                    line-height: 30px;
                    text-align: left;
                    background: #1080cc;
                    a {
                        color: #fff;
                        font-size: 18px;
                        padding-left: 20px;
                    }
                    div {
                        margin-top: 8px;
                        float: right;
                        width: 24px;
                        height: 24px;
                        color: #fff;
                        margin-right: 6px;
                    }
                }
                ul {
                    width: 100% !important;
                    height: 20px;

                    li {

                        height: 20px;
                        list-style: none;
                        float: left;
                        margin-left: 4px;

                        i {
                            border-radius: 4px;
                            display: inline-block;
                            width: 18px;
                            height: 10px;
                            margin-right: 3px;
                        }
                    }
                }
                ol {
                    width: 100% !important;
                    height: 20px;

                    li {
                        width: 49px;

                        height: 20px;
                        list-style: none;
                        float: left;
                        padding-right: 4px;
                        margin-left: 7px;
                        p {
                            padding-left: 6px;
                            padding-right: 6px;
                        }
                    }
                }
            }
        }
        .chaxun {
            width: 96%;
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
                    margin-left: 15px;
                }
                .cxtime {
                    float: left;
                    margin-left: 15px;
                }
                .day {
                    float: left;
                    margin-left: 15px;
                }
                .startend {
                    float: left;
                    margin-left: 15px;
                }
                .button {
                    float: left;
                    margin-left: 15px;
                }
            }
        }
        .tables {
            width: 96%;
            margin-top: 30px;
            margin-bottom: 20px;
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
                width: 100%;
                height: 40px;
                margin-top: 30px;
                margin-bottom: 0px;
            }
            height: auto;
            margin: 0 auto;
        }
    }
</style>
