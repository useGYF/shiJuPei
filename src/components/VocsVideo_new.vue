<template>
    <!--VOCs视频监控右侧面板-->
    <div class="main">
                    <div class="tables">
                        <!--选项-->
                        <a id="shishi">视频设备统计</a>
                        <div class="xian"></div>
                    </div>
                    <div class="yuanzhan">
                        <div class="jdflaot" style="margin-left: 30px">
                            <div id="piekaifaqu" style="width: 90px;height: 90px;"></div>
                            <div class="texts">{{kfnum}}</div>
                            <p>开发区</p>
                        </div>
                        <div class="jdflaot">
                            <div id="pieguangyangqu" style="width: 90px;height: 90px"></div>
                            <div class="texts">{{gynum}}</div>
                            <p>广阳区</p>
                        </div>
                        <div class="jdflaot">
                            <div id="pieanciqu" style="width: 90px;height: 90px"></div>
                            <div class="texts">{{acnum}}</div>
                            <p>安次区</p>
                        </div>
                    </div>
                    <div class="sousuo">
                        <div class="sleft">
                            <el-input v-model="filters.name" @keyup.enter.native="searchData" placeholder="名称"></el-input>
                        </div>
                        <div class="sright">
                            <el-button type="primary"  @click="searchData()">搜索</el-button>
                        </div>

                    </div>
                    <div class="table_video">
                        <el-table
                                :data="tableData"
                                border
                                @current-change="RowCurrentChange"
                                style="width: 100%">
                            <el-table-column
                                    prop="SerialNumber"
                                    label="序号"
                                    width="80">
                            </el-table-column>
                            <el-table-column
                                    property="Grid"
                                    label="网格名称"
                                    width="80">
                            </el-table-column>
                            <el-table-column
                                    prop="CamName"
                                    label="视频名称"
                                    width="160">
                            </el-table-column>
                            <el-table-column
                                    prop="TypeName"
                                    label="监控类型">
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
                    <div class="zhichi">
                        <p style="color: #666;padding-top: 10px">技术支持单位：开发区管委会，广阳区政府，安次区政府</p>
                    </div>
                </div>
</template>
<!---->
<script>
    import {bus} from '@/js/bus.js'
    import api from '../api/index'

    export default {
        name: 'vocvideo',
        data() {
            return {
                //
                tableData: [],
                //
                allData: [],
                //
                kfnum:'',
                //
                gynum:'',
                //
                acnum:'',
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
                type: 'VOCs企业',
                //
                filters: {
                    name: ''
                },
                //
                styresdata: [],
                //
                Aalllist: []
            }
        },
        created() {
            //页面初始化数据
            api.GetVideoDeviceInfoData().then(res =>{
                //
                let shoulist= res.data.Data;
                //
                this.InitializationDataMethod(shoulist);
            })
            //获取安装视频数量
            api.GetTotalCountRes().then(res =>{
                let numdata = res.data.Data;
                console.log(numdata);
                let guangyang = '';
                let kaifa = '';
                let anci = '';
                numdata.forEach(item =>{
                    if(item.type == 'VOC企业' || item.type == 'VOCs企业'){
                        if(item.area == '广阳区'){
                            guangyang = item.total?item.total:0;
                        }
                        if(item.area == '开发区'){
                            kaifa = item.total?item.total:0;
                        }else{
                            anci = 0;
                        }
                    }
                })
                //
                this.gynum = guangyang;
                this.kfnum = kaifa;
                this.acnum = anci;
            })
        },
        mounted() {
            const that = this;
            //视频进度图
            setTimeout(function () {
                that.KaiFaQuProgressPie();
                that.GuangYangQuProgressPie();
                that.AnCiQuProgressPie();
            }, 500)
        },
        methods: {
            //初始化数据
            InitializationDataMethod(data) {
                this.Aalllist = data;
                let sudata = data;
                this.styresdata = sudata;
                this.SetDataList(sudata)
                this.totalCount = this.ALLdata.length;
                this.allData = this.ALLdata;
                this.setPageTable(10, 1);
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
                // 地图联的
                bus.$emit('locationClick', 'layer_sp_voc', this.currentRow ,this.type);
            },
            //开发区进度
            KaiFaQuProgressPie() {
                let value = this.kfnum;
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('piekaifaqu'));
                app.title = '';
                // 指定图表的配置项和数据
//
                let option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',

                    },
                    series: [
                        {
                            name: '在线监测',
                            type: 'pie',
                            radius: ['100%', '80%'],
                            avoidLabelOverlap: false,
                            hoverAnimation: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: false,
                                    textStyle: {
                                        fontSize: '20',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
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
                        data: [
                            {value: 200, name: '未铺设'},
                            {value: value, name: '设备'}

                        ],
                        color: [
                            '#ccc',
                            "#00e401"
                        ]
                    }]
                })
            },
            //广阳区进度
            GuangYangQuProgressPie() {
                let value = this.gynum;
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('pieguangyangqu'));
                app.title = '';
                // 指定图表的配置项和数据

                let option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                    },
                    series: [
                        {
                            name: '在线监测',
                            type: 'pie',
                            radius: ['100%', '80%'],
                            avoidLabelOverlap: false,
                            hoverAnimation: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: false,
                                    textStyle: {
                                        fontSize: '20',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
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
                        data: [
                            {value: 200, name: '未铺设'},
                            {value: value, name: '设备'}

                        ],
                        color: [
                            '#ccc',
                            "#00e401"
                        ]
                    }]
                })
            },
            //安次区进度
            AnCiQuProgressPie() {
                let value = this.acnum;
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('pieanciqu'));
                app.title = '';
                // 指定图表的配置项和数据
                let option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',

                    },
                    series: [
                        {
                            name: '在线监测',
                            type: 'pie',
                            radius: ['100%', '80%'],
                            avoidLabelOverlap: false,
                            hoverAnimation: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: false,
                                    textStyle: {
                                        fontSize: '20',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
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
                        data: [
                            {value: 200, name: '未铺设'},
                            {value: value, name: '设备'}

                        ],
                        color: [
                            '#ccc',
                            "#00e401"
                        ]
                    }]
                })
            },
            //页码变更
            handleCurrentChange(val) {
                this.setPageTable(10, val);
                //console.log(val)
            },
            //分页部分功能
            getPointByType(type, data) {
                let rtValue = [];
                let dt = data;
                //console.log(dt)
                if (dt) {
                    for (let i = 0, length = dt.length; i < length; i++) {
                        let item = dt[i];
                        if (item.TypeName === type || item.TypeName ==='VOC企业') {
                            rtValue.push(dt[i]);
                        }
                    }
                }
                return rtValue;
            },
            //筛选数据
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
                this.data = this.filterTimeConversion(this.getPointByType(this.type, data));
                this.ALLdata = [];
                let i = 1;
                this.data.forEach(item => {
                    const tableData = {};
                    tableData.SerialNumber = i++;//序号
                    tableData.CamName = item.CamName;//行业
                    tableData.TypeName = item.TypeName;//类型
                    tableData.Id = item.Id;//城市id
                    tableData.latitude = item.Latitude;//纬度
                    tableData.longitude = item.Longitude;//经度
                    tableData.Grid = item.Area ? item.Area : '----';//网格
                    this.ALLdata.push(tableData);
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
                        if (item.CamName.indexOf(t.filters.name) >= 0) {
                            rtValue.push(dt[i]);
                        }
                    }
                }
                return rtValue;
            },
            //搜索事件
            searchData() {
                // 声明变量
                this.InitializationDataMethod(this.Aalllist);
            },

        },
        components: {}
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .mapdw {
            width: 25px;
            height: 25px;
            display: block;
            margin: -5px 43px;
        }
  img {
     position: absolute;
     top: 40%;
     left: -17px;
     cursor: pointer;
     float: left;
   }
  .main {
      width:430px;
      height: auto;
      .tables {
                    width: 100%;
                    line-height: 38px;
                    a {
                        margin-left: -270px;
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
      .sousuo {
                    width: 96%;
                    margin-top: 10px;
                    margin-left: 4%;
                    border-top: solid 1px #ccc;
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
      .yuanzhan {
                    /*APP写进去*/
                    width: 100%;
                    height: 150px;
                    .jdflaot {
                        margin-top: 25px;
                        margin-bottom: 25px;
                        float: left;
                        margin-left: 40px;
                        p {
                            text-align: center;
                            font-size: 14px;
                            font-weight: bold;
                        }
                    }
                    div {
                        margin-bottom: 8px;
                        position: relative;
                        .texts {
                            width: 100%;
                            height: 30px;
                            position: absolute;
                            top: 32px;
                            text-align: center;
                            font-size: 18px;
                            font-weight: bold;
                        }
                    }
                }
   }
</style>
