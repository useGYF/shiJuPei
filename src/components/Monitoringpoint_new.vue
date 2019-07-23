<template>
        <!--监测点面板-->
  <div class="main">

                    <!--选项查询-->
                    <div class="first">
                        <div class="tables">
                            <!--选项-->
                            <a id="shishi" @click="RealTimeFatchtoo()" class="bai">实时</a>
                            <a id="leiji" @click="CumulativeFatchtoo()">累计</a>
                            <font class="time2">更新时间：{{NewUptime}}</font>
                        </div>
                    </div>

                    <!--详细天气-->
                    <div class="tqbiaoti">廊坊市空气质量</div>
                    <strong v-if="tianqiyuji" class="strong">今日空气质量预计为：{{Datalist.qulity}}</strong>
                    <div class="Second">
                        <div class="tianqi">
                            <!--天气-->
                            <div class="tqbj">
                                <img class="beijing" :src="'static/imgs/weather/'+ Datalist.weather+'.png'"
                                     :title="Datalist.weather">
                            </div>
                            <p>温度：{{Datalist.temp}}°C</p>
                            <p>湿度：{{Datalist.humi}}%</p>
                            <p>风力：{{Datalist.wl}}{{Datalist.wd}}</p>
                            <p>降雨量：{{Datalist.rain}}mm</p>
                        </div>
                        <div class="yuanjindu">
                            <div class="jdflaot">
                                <div id="main_x" style="width: 90px;height: 90px"></div>
                                <div class="texts">{{Datalist.aqi}}</div>
                                <p>小时AQI</p>
                            </div>

                            <div class="jdflaot">
                                <div id="main_y" style="width: 90px;height: 90px"></div>
                                <div class="texts">{{Datalist.aqiAccu}}</div>
                                <p>当日累计AQI</p>
                            </div>
                            <div class="jdflaot">
                                <div id="main_z" style="width: 90px;height: 90px"></div>
                                <div class="texts">{{Datalist.ComplexIndex}}</div>
                                <p>小时综合指数</p>
                            </div>
                        </div>
                        <div class="ph" style="margin-bottom:4px" v-show="shishi">
                            <ul>
                                <li :style="{background:Datalist.pm25Color,color:Datalist.pm25 > 100?changeColor:''}">
                                    PM2.5
                                </li>
                                <li :style="{background:Datalist.pm10Color,color:Datalist.pm10 > 150?changeColor:''}">
                                    PM10
                                </li>
                                <li :style="{background:Datalist.so2Color,color:Datalist.so2 > 150?changeColor:''}">
                                    SO2
                                </li>
                                <li :style="{background:Datalist.coColor,color:Datalist.co > 150?changeColor:''}">CO
                                </li>
                                <li :style="{background:Datalist.no2Color,color:Datalist.no2 > 100?changeColor:''}">
                                    NO2
                                </li>
                                <li :style="{background:Datalist.o3Color,color:Datalist.o3 > 150?changeColor:''}">O3
                                </li>
                            </ul>
                            <ol>
                                <li>{{Datalist.pm25}}</li>
                                <li>{{Datalist.pm10}}</li>
                                <li>{{Datalist.so2}}</li>
                                <li>{{Datalist.co}}</li>
                                <li>{{Datalist.no2}}</li>
                                <li>{{Datalist.o3}}</li>
                            </ol>
                        </div>
                        <div class="ph" style="margin-bottom:4px" v-show="leiji">
                            <ul>
                                <li :style="{background:CumulativeData.pm25Color}">PM2.5</li>
                                <li :style="{background:CumulativeData.pm10Color}">PM10</li>
                                <li :style="{background:CumulativeData.so2Color}">SO2</li>
                                <li :style="{background:CumulativeData.coColor}">CO</li>
                                <li :style="{background:CumulativeData.no2Color}">NO2</li>
                                <li :style="{background:CumulativeData.o3Color}">O3</li>
                            </ul>
                            <ol>
                                <li>{{CumulativeData.pm25}}</li>
                                <li>{{CumulativeData.pm10}}</li>
                                <li>{{CumulativeData.so2}}</li>
                                <li>{{CumulativeData.co}}</li>
                                <li>{{CumulativeData.no2}}</li>
                                <li>{{CumulativeData.o3}}</li>
                            </ol>
                        </div>
                        <div class="wrjingdu">
                            <p>首要污染物：{{Datalist.mainpoll || '--'}}</p>
                            <div class="tqbiaoti" style="margin: 10px">169城市排名</div>
                            <div class="jdhezi">
                                <div class="font">日倒排</div>
                                <div class="tiaojd">
                                    <v-progress :width="YearMonthDay(Datalist.dayrank_74)"
                                                :text="(170 - Datalist.dayrank_74)"
                                                :color="YearMonthDayColor(170 - Datalist.dayrank_74)"></v-progress>
                                </div>
                            </div>
                            <div class="jdhezi">
                                <div class="font">月倒排</div>
                                <div class="tiaojd">
                                    <v-progress :width="YearMonthDay(Datalist.monthrank_74)"
                                                :text="(170 - Datalist.monthrank_74)"
                                                :color="YearMonthDayColor(170 - Datalist.monthrank_74)"></v-progress>
                                </div>
                            </div>
                            <div class="jdhezi">
                                <div class="font">年倒排</div>
                                <div class="tiaojd">
                                    <v-progress :width="YearMonthDay(Datalist.yearrank_74)"
                                                :text="(170 - Datalist.yearrank_74)"
                                                :color="YearMonthDayColor(170 - Datalist.yearrank_74)"></v-progress>
                                </div>
                            </div>

                        </div>
                    </div>
                    <!--table表格-->
                    <div class="table">
                        <el-tabs v-model="activeName" @tab-click="handleClick">
                            <el-tab-pane label="国省控点" name="guokongdian">
                                <el-table
                                        :data="tableData"
                                        border
                                        @current-change="RowCurrentChange"
                                        style="width: 100%">
                                    <el-table-column
                                            prop="ranking"
                                            label="排名"
                                            width="52">
                                    </el-table-column>
                                    <el-table-column
                                            prop="pointname"
                                            label="国省控点"
                                            width="150"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="AirQualityGrade"
                                            label="空气质量等级"
                                            width="75"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="aqi"
                                            :label="labelType"
                                            width="60"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="PrimaryPollutant"
                                            label="首要污染物"
                                    >
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>

                            <el-tab-pane label="京津冀城市排名" name="daoshuqianshi">
                                <el-table
                                        :data="tableCityData"
                                        border
                                        @current-change=""
                                        style="width: 100%">
                                    <el-table-column
                                            prop="ranking"
                                            label="排名"
                                            width="52">
                                    </el-table-column>
                                    <el-table-column
                                            prop="City"
                                            label="城市"
                                            width="120"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="AirQualityGrade"
                                            label="空气质量等级"
                                            width="105"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="aqi"
                                            :label="ClabelType"
                                            width="60"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="PrimaryPollutant"
                                            label="首要污染物"
                                    >
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>

                             <el-tab-pane label="区县排名" name="quxianRange">
                                <el-table
                                        :data=" DistrictCountyData"
                                        border
                                        :header-row-style="headercolor"
                                        @current-change="RowCurrentChange"
                                        style="width: 100%">
                                    <el-table-column
                                            prop="ranking"
                                            label="排名"
                                            width="52">
                                    </el-table-column>
                                    <el-table-column
                                            prop="GridName"
                                            label="县区名称"
                                            width="150"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="AirQualityGrade"
                                            label="空气质量"
                                            width="75"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="aqi"
                                            label="AQI"
                                            width="60"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="PrimaryPollutant"
                                            label="首要污染物"
                                    >
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>

                        </el-tabs>
                    </div>
                </div>
</template>

<script>
    import {bus} from '@/js/bus.js'
    import api from '../api/index'

    export default {
        name: 'monitoring',
        data() {
            return {
                //默认选中国控点
                activeName: 'guokongdian',
                //
                changeColor: '#fff',
                //tables数据
                ptType: '国控点',
                //
                type: 'AQI',
                //
                labelType: 'AQI',
                //
                ClabelType: 'AQI',
                //国省控点排名
                tableData: [],
                //京津冀排名
                tableCityData: [],
                //区县数据
                DistrictCountyData:[],
                //
                allData: [],
                //
                value1: '',
                //
                histrData: '',
                //
                value2: '',
                //实时数据
                Datalist: {},
                //预计天气状态
                tianqiyuji: true,
                //累计数据
                CumulativeData: {},
                //实时展示
                shishi: true,
                //累计展示
                leiji: false,
                //更新数据
                NewUptime: ''
            }
        },
        created() {
            bus.$on('switchRender', this.switchRender);
            //列表1
            api.GetLfAirData().then(res => {
                let shoulist = res.data.Data;
                //shoulist = typeof shoulist === 'string' ? JSON.parse(shoulist) : shoulist;
                this.Datalist = shoulist
                // 跟新时间
                this.NewUptimesData(this.Datalist.time)
            })
            //
            api.GetMonitoringPointReal().then(res => {
                let shoulist = res.data.Data;
                //
                this.ObjectFactoryData(shoulist, this.type);
            })
            //京津冀排名
            api.GetJingJinJiHourList().then(res => {
                let citylist = res.data.Data;
                this.ObjectFactoryCitydata(citylist, this.type)
            })
            //区县排名
            api.GetQxHourRankData().then(res => {
                let Xqlist = res.data.Data;
                this.ObjectFactoryDistrictCounty(Xqlist);
            })
        },
        activated() {

        },
        mounted() {
            //右侧收放
            const that = this;
            //实时累计切换
            $('.first .tables a').on('click', function () {
                $(this).addClass('bai').siblings().removeClass('bai')
            })
            //初始化实时数据
            api.GetMonitoringPointReal().then(res => {
                let shoulist = res.data.Data;
                //shoulist = typeof shoulist === 'string' ? JSON.parse(shoulist) : shoulist;
                that.ObjectFactoryData(shoulist, that.type);

            })
            //圆进度图
            setTimeout(function () {
                that.GetHourAPIcolortu();
                that.GetCumulativeAPIcolortu();
                that.GetcompositeIndexcolortu();
            }, 500)

        },
        methods: {
            headercolor({ row, rowIndex}){

                    if (rowIndex === 0) {
                        return 'background:#ccc'
                    } else {
                        return ''
                    }

            },
            //跟新数据时间
            NewUptimesData(times) {
                //console.log(times)
                let timevale = times.replace("T", " ");
                this.NewUptime = timevale;
            },
            //排序
            compare(propertyName) {
                return function (object1, object2) {
                    let value1 = object1[propertyName];
                    let value2 = object2[propertyName];
                    return value2 - value1
                }
            },
            //table点击事件
            RowCurrentChange(val) {
                this.currentRow = val;

                //地图联动
                bus.$emit('locationClick', 'layer_gs', this.currentRow ,this.type);
            },
            //京津冀排名数据
            ObjectFactoryCitydata(data, type) {
                this.data = data;
                this.tableCityData = [];
                //console.log(type)
                let i = 1;
                //let dt1 = this.getPointByType(this.ptType);
                let dt1 = data;
                let dt2 = dt1.sort(this.compare(type.toLowerCase()));
                dt2.forEach(item => {
                    const tableData2 = {};
                    tableData2.ranking = i++;
                    tableData2.City = item.cityname;//城市名
                    tableData2.AirQualityGrade = item.quality;
                    tableData2.aqi = item[this.getPollution(type.toLowerCase())];//数值
                    tableData2.PrimaryPollutant = item.primary_pollutant;
                    this.tableCityData.push(tableData2);

                })
            },
            //区县小时排名
            ObjectFactoryDistrictCounty(data){
                this.data = data;
                this.DistrictCountyData = [];
                //console.log(type)
                let plldata = this.data
                let i = 1;
                plldata.forEach(item => {
                    const tableData3 = {};
                    tableData3.ranking = i++;//
                    tableData3.GridName = item.GridName;//城市名
                    tableData3.AirQualityGrade = item.Quality;//
                    tableData3.aqi = item.Aqi;//
                    tableData3.PrimaryPollutant = item.PrimaryPollution;//
                    this.DistrictCountyData.push(tableData3);

                })
            },
            //监听数据
            ObjectFactoryData(data, type) {
                this.data = data;
                this.histrData = data;
                this.tableData = [];
                //console.log(data);
                let i = 1;
                //let dt1 = this.getPointByType(this.ptType);
                let dt1 = data;
                let dt2 = dt1.sort(this.compare((type.toLowerCase()=='pm2.5'?'pm25':(type.toLowerCase()=='index'?'complexindex':type.toLowerCase()))));
                dt2.forEach(item => {
                    const tableData = {};
                    tableData.ranking = i++;
                    tableData.pointname = item.pointname;//
                    tableData.citygid = item.citygid;//城市id
                    tableData.latitude = item.latitude;//纬度
                    tableData.longitude = item.longitude;//经度
                    tableData.AirQualityGrade = item.quality;//
                    tableData.aqi = item[this.getPollution(type.toLowerCase())];//数值
                    tableData.PrimaryPollutant = item.primary_pollutant;//
                    this.tableData.push(tableData);

                })

            },
            //渲染
            switchRender(type) {
                this.type = type;
                console.log(this.type)
                this.labelType = this.Tochangelabeltype(type);
                console.log(this.labelType)
                this.ObjectFactoryData(this.histrData, this.type);
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
                    case 'WINDANGLE':
                        rtValue = 'winddirection';
                        break;
                }
                return rtValue;
            },
            //
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
                    case 'WS':
                        rtValue = '风级';
                        break;
                    case 'WD':
                        rtValue = '风向';
                        break;
                }
                return rtValue;
            },
            //年月日占比
            YearMonthDay(cantext) {
                return (170 - cantext)/170*100
            },
            //年月日背景颜色
            YearMonthDayColor(codata) {
                let Degrees = codata;
                let Vcolor = '';
                if (Degrees > 11) {//64
                    //倒数10
                    Vcolor = '#0f0'
                } else if (20 <= Degrees && Degrees <= 11) {//55\\64
                    //倒数11到20
                    Vcolor = '#ff0'
                } else if (Degrees < 20) {//55
                    //倒数21-74
                    Vcolor = '#f00'
                }
                return Vcolor;
            },
            //切换
            handleClick(tab, event) {
                this.ptType = tab.label
                //console.log(tab);
                // console.log(event)
            },
            //数据筛选
            // getPointByType(type) {
            //     //console.log(type);
            //     let rtValue = [];
            //     let dt = this.data;
            //     if (dt) {
            //         for (let i = 0, length = dt.length; i < length; i++) {
            //             let item = dt[i];
            //             rtValue.push(dt[i]);
            //            if (item.type === type) {
            //                rtValue.push(dt[i]);
            //            }
            //         }
            //     }
            //     return rtValue;
            // },
            //圆图api
            GetHourAPIcolortu() {
                let Datavlue = 500 - this.Datalist.aqi;
                let Bianvlue = this.Datalist.aqi;
                let Color = this.Datalist.aqiColor;
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('main_x'));
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
                            name: '小时AQI',
                            type: 'pie',
                            radius: ['100%', '90%'],
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
                            {value: Datavlue, name: '占比'},
                            {value: Bianvlue, name: 'AQI'}

                        ],
                        color: [
                            '#ccc',
                            Color
                        ]
                    }]
                })
            },
            //圆图累计api
            GetCumulativeAPIcolortu() {
                let Datavlue = 500 - this.Datalist.aqiAccu;
                let Bianvlue = this.Datalist.aqiAccu;
                let Color = this.Datalist.accuAqiColor;
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('main_y'));
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
                            name: '累计AQI',
                            type: 'pie',
                            radius: ['100%', '90%'],
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
                            {value: Datavlue, name: '占比'},
                            {value: Bianvlue, name: '累计AQI'}

                        ],
                        color: [
                            '#ccc',
                            Color
                        ]
                    }]
                })
            },
            //圆图综合
            GetcompositeIndexcolortu() {
                let Datavlue = 112.53 - this.Datalist.ComplexIndex;
                let Bianvlue = this.Datalist.ComplexIndex;
                let Color = this.Datalist.aqiColor;
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('main_z'));
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
                            name: '综合指数',
                            type: 'pie',
                            radius: ['100%', '90%'],
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
                            {value: Datavlue, name: '占比'},
                            {value: Bianvlue, name: '综合指数'}

                        ],
                        color: [
                            '#ccc',
                            Color
                        ]
                    }]
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
            //页码分组
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
            //实时切换请求
            RealTimeFatchtoo() {
                const t = this;
                this.leiji = false;
                this.shishi = true;
                this.tianqiyuji = true;
                api.GetMonitoringPointReal().then(res => {
                    let shoulist = res.data.Data;
                    //shoulist = typeof shoulist === 'string' ? JSON.parse(shoulist) : shoulist;
                    t.ObjectFactoryData(shoulist, t.type);
                    // 地图切换
                    bus.$emit('loadCumulative', shoulist, 'layer_gs', t.type,'pointname');
                })

            },
            //累计切换请求
            CumulativeFatchtoo() {
                const t = this;
                this.leiji = true;
                this.shishi = false;
                this.tianqiyuji = false;
                //国省控空气质量颜色列表
                api.GetLfAirPollution().then(res => {
                    let shoulist = res.data.Data;
                    //shoulist = typeof shoulist === 'string' ? JSON.parse(shoulist) : shoulist;
                    this.CumulativeData = shoulist
                    //console.log(this.CumulativeData)
                })
                //累计列表数据
                api.GetMonitoringPointAccu().then(res => {
                    let shoulist = res.data.Data;
                    //shoulist = typeof shoulist === 'string' ? JSON.parse(shoulist) : shoulist;
                    t.ObjectFactoryData(shoulist, t.type);
                    //地图切换
                    bus.$emit('loadCumulative', shoulist, 'layer_gs', t.type,'pointname');
                    //console.log(shoulist.obj)
                })

            },
            ///////
        },
        components: {}
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .strong {
        width: 100%;
        padding: 10px 0;
        display: inherit;
        margin-left: 18px;
        text-align: left;
    }
    img {
        position: absolute;
        top: 40%;
        left: -17px;
        cursor: pointer;
        float: left;
    }
    .main {
        width: 430px;
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
            height: 90px;
            margin-top: 10px;
            .tables {
                float: left;
                margin-left: 14px;
                margin-top: 44px;
                width: 100%;
                border-bottom: solid 1px #ccc;
                .bai {
                    color: #4696FF;
                    border-bottom: solid 2px #4696FF;
                }
                a {
                    float: left;
                    text-decoration: none;
                    font-size: 16px;
                    font-weight: bold;
                    color: #666;
                    display: inline-block;
                    line-height: 34px;
                    padding: 0 30px;
                    width: auto;
                    height: 34px;
                }
                :hover {
                    cursor: pointer;
                }
                .time2 {
                    line-height: 34px;
                    padding-right: 20px;
                    font-size: 12px;
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
                    background: #1080cc;
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
            border-left: solid 3px #4696FF;
        }
        .Second {
            width: 100%;
            height: auto;
            .tianqi {
                float: left;
                margin-left: 20px;
                /*margin-right: 20px;*/
                .tqbj {
                    width: 64px;
                    height: 64px;
                    position: relative;
                    .beijing {
                        width: 45px;
                        position: absolute;
                        top: 10px;
                        left: 12px;
                    }
                }
                p {
                    text-align: left;
                    font-size: 12px;
                    margin: 0 !important;
                }
            }
            .yuanjindu {
                /*APP写进去*/
                width: 100%;
                height: 150px;
                .jdflaot {
                    margin-top: 15px;
                    margin-bottom: 8px;
                    float: left;
                    margin-left: 8px;
                    p {
                        text-align: center;
                        font-size: 14px;
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
                    }
                }
            }
            .ph {
                ul {
                    padding-left: 20px;
                    width: 100%;
                    height: 30px;
                    padding-bottom: 0;
                    li {
                        font-size: 14px;
                        width: 64px;
                        height: 30px;
                        line-height: 30px;
                        float: left;
                        list-style: none;
                        //border: solid 1px #ccc;
                        margin-left: 1px;
                    }
                }
                ol {
                    padding-left: 20px;
                    width: 100%;
                    height: 30px;
                    margin-bottom: 6px;
                    li {
                        margin-top: 1px;
                        font-size: 14px;
                        width: 64px;
                        height: 30px;
                        line-height: 30px;
                        float: left;
                        list-style: none;
                        //border: solid 1px #ccc;
                        margin-left: 1px;
                        background: #ccc;
                    }
                }
            }
            .wrjingdu {
                width: 100%;
                height: auto;
                p {
                    text-align: left;
                    padding: 4px 20px;
                }
                .jdhezi {
                    height: 24px;
                    overflow: hidden;
                    .font {
                        margin-left: 30px;
                        margin-right: 10px;
                        text-align: center;
                        width: 45px;
                        font-size: 14px;
                        float: left;
                    }
                    .tiaojd {
                        float: left;
                        width: 300px;
                    }
                }
            }
        }
        .table {
            //表格部分 overflow: auto;
            font-size: 10px !important;
        }
    }
</style>
