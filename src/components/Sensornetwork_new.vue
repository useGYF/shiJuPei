<template>
    <div class="sensornetwork">
        <!--六参数面板-->
       <div class="main">
                    <!--选项查询-->
                    <div class="first">
                        <div class="tables">
                            <!--选项-->
                            <a id="shishi" @click="RealTimeFatch()" class="bai">实时</a>
                            <a id="leiji" @click="CumulativeFatch()">累计</a>
                            <font class="time2">更新时间：{{uptime}}</font>
                        </div>
                        <div class="query24" style="width: 100%;height: 50px;padding-top: 49px;padding-left: 10px">
                           <!---->
                            <div class="shijian">
                                <!--时间选择-->
                                <span style="font-size: 15px;font-weight: bold;padding-right: 10px">监测点分类</span>
                                <el-select v-model="KeyDvalue" placeholder="请选择">
                                    <el-option
                                            v-for="item in FENoptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                                <span style="padding-right: 8px"></span>
                            </div>
                            <div class="btnns">
                                <button @click="ChaXunJianCe">查询</button>
                            </div>
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
                                    >
                            </el-table-column>
                            <el-table-column
                                    property="Grid"
                                    label="网格名称"
                                    >
                            </el-table-column>
                            <el-table-column
                                    property="stationname"
                                    label="名称"
                                    width="160">
                            </el-table-column>
                            <el-table-column
                                    property="aqi"
                                    :label="type"
                                    >
                            </el-table-column>
                        </el-table>
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
                </div>
    </div>
</template>

<script>
    import {bus} from '@/js/bus.js'
    import api from '../api/index'

    export default {
        name: 'sensornetwork',
        data() {
            return {
                //
                tableData: [],
                //
                HistoryData: [],
                //
                allData: [],
                //
                type: 'AQI',
                //
                currentRow: null,
                //
                pagesize: 10,
                //
                currentPage: 1,
                //
                totalCount: 0,
                //
                value1: '',
                //
                value2: '',
                //现在时间
                uptime: '',
                //下拉列表数据
                FENoptions:[
                    {
                        value:'',
                        label:'全部'
                    }
                ],
                //下拉列表值
                KeyDvalue:'请选择分类',
                //面板状态
                zhuangtai:'实时'
            }
        },
        created() {
            //初始化地图数据监听展示页面
            api.GetSixParmAirListRes().then(res =>{
                const _this = this;
                //
                _this.InitializationDataMethod(res.data.Data, _this.type);
            })
            //左侧切换指标
            bus.$on('refreshTarget', this.refreshTable);
            //下拉列表
            api.GetSixParamTypeListRes().then(res =>{
                //console.log('我上场了啊')
                let carter = res.data.Data;
                console.log(carter);
                carter.forEach(item =>{
                    const tData = {};
                    tData.value = item;//排名
                    tData.label = item;//
                    this.FENoptions.push(tData);
                })
            })

        },
        mounted() {
            //实时累计切换样式
            $('.first .tables a').on('click', function () {
                $(this).addClass('bai').siblings().removeClass('bai')
            })
            //
            setInterval(() => {
                //console.log('开始时间')
                this.uptime = this.UpTimesData()
            }, 5000)
        },
        methods: {
            //跟新数据时间
            UpTimesData() {
                var date = new Date(),
                    Y = date.getFullYear(),
                    m = date.getMonth() + 1,
                    d = date.getDate(),
                    H = date.getHours() - 1,
                    i = date.getMinutes(),
                    s = date.getSeconds();
                if (m < 10) {
                    m = '0' + m;
                }
                if (d < 10) {
                    d = '0' + d;
                }
                if (H < 10) {
                    H = '0' + H;
                }
                if (i < 10) {
                    i = '0' + i;
                }
                if (s < 10) {
                    s = '0' + s;
                }
                var t = Y + '-' + m + '-' + d + ' ' + H + ':' + i + ':' + s;
                return t;
            },
            //排序
            compare(propertyName) {
                return function (object1, object2) {
                    let value1 = object1[propertyName]
                    let value2 = object2[propertyName]
                    return value2 - value1
                }
            },
            //初始数据
            InitializationDataMethod(data, type) {
                console.log(data);
                this.type = type;
               // this.HistoryData = data;
               // let sudata = data;
                this.SetDataList(data, type)
                this.totalCount = this.allData.length;
                this.setPageTable(10, 1);
            },
            //对象去重
            ObjectDeweighting(array) {
                let a = array;
                let map = {};
                let b = [];
                for (var i = 0; i < a.length; i++) {
                    var ai = a[i],
                        key = ai.stationname;
                    if (!map[key]) {
                        b.push(ai);
                        map[key] = ai;
                    }
                }
                return b
            },
            //type更改
            refreshTable(type) {
                this.type = this.Tochangelabeltype(type);
                this.SetDataList(this.data, type);
                this.totalCount = this.allData.length;

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
            //设置分页所需要数据
            SetDataList(data, type) {
                this.data = data//this.ObjectDeweighting(data);
                this.allData = [];
                let i = 1;
                let dt1 = this.getPointByType(this.ptType);
                let dt2 = dt1.sort(this.compare(type.toLowerCase()));
                dt2.forEach(item => {
                    const tableData = {};
                    tableData.ranking = i++;//排名
                    tableData.stationname = item.stationname;//类型
                    tableData.stationid = item.stationid;//城市id
                    tableData.latitude = item.latitude;//纬度
                    tableData.longitude = item.longitude;//经度
                    tableData.Grid = item.gridName ? item.gridName :  '----';//网格
                    tableData.aqi = item[type.toLowerCase()];//数值
                    tableData.dataType = item.hasOwnProperty('dataType') ? item['dataType'] : undefined;
                    this.allData.push(tableData);
                })
            },
            //查询
            ChaXunJianCe() {
                const t = this;
                //分类查询监测点数据
                let keyvalue = this.zhuangtai;
                //选中项  this.KeyDvalue
                console.log(this.KeyDvalue);
                switch (keyvalue){
                    case '实时':
                        t.ClassificationQuery(keyvalue);
                        break;
                    case '累计':
                        t.ClassificationQuery(keyvalue);
                        break;
                }
            },
            //分类查询
            ClassificationQuery(value){
                //
                const t = this;
                //let RecordTime = t.TimeConversion('yyyy-MM-dd hh:00:00', new Date());
                let Classification = encodeURI(this.KeyDvalue);
               //根据类型请求
                switch (value){
                    case '实时':
                        console.log('实时监控测试')
                        api.GetClassification(Classification).then(res =>{
                            let data = res.data.Data;
                            t.InitializationDataMethod(data, t.type);
                            //传递地图数据
                            bus.$emit('loadCumulative', data,'layer_cgq_lcs', t.type, 'stationname');
                        });
                        break;
                    case '累计':
                        console.log('累计监控测试')
                        api.GetClassificationleijiR(Classification).then(res =>{
                            let data = res.data.Data;
                            t.InitializationDataMethod(data, t.type);
                            //传递地图数据
                            bus.$emit('loadCumulative', data,'layer_cgq_lcs', t.type, 'stationname');
                        });
                        break;
                }
            },
            //实时
            RealTimeFatch() {
                const t = this;
                this.zhuangtai = '实时';
                api.GetSixParmAirListRes().then(res =>{
                    const _this = this;
                    let data =res.data.Data;
                    //
                    _this.InitializationDataMethod(data, _this.type);
                    //传递地图数据
                    bus.$emit('loadCumulative', data,'layer_cgq_lcs', t.type, 'stationname');
                })

            },
            //累计
            CumulativeFatch() {
                const t = this;
                this.zhuangtai = '累计';
                let cumudata = [];
                //源传感网数据
                api.GetClassificationleijiR('').then(res => {
                    cumudata = res.data.Data;
                    //
                    this.InitializationDataMethod(cumudata, t.type);
                    //传递地图数据
                    bus.$emit('loadCumulative', cumudata,'layer_cgq_lcs', t.type, 'stationname');
                })


            },
            //table点击事件
            RowCurrentChange(val) {
                this.currentRow = val;
                //地图联动
                bus.$emit('locationClick','layer_cgq_lcs', this.currentRow ,this.type);
            },
            //页码变更
            handleCurrentChange(val) {
                ///
                this.setPageTable(10, val);
            },
            //分页部分功能
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
            //渲染部分
            switchRender(type) {
                this.type = type;
                this.setdata(this.data, this.type)
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
            //时间转换
            TimeConversion(fmt, date) {
                var o = {
                    "M+": date.getMonth() + 1,   //月份
                    "d+": date.getDate(),        //日
                    "h+": date.getHours() - 1,       //小时
                    "m+": date.getMinutes(),     //分
                    "s+": date.getSeconds(),     //秒
                    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                    "S": date.getMilliseconds()   //毫秒
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

    .sensornetwork {
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
                    height: 96px;
                    margin-top: 10px;
                    .tables {
                        float: left;
                        margin-left: 14px;
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
