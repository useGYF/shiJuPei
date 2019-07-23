<template>
    <div class="Fixedsourcestatistics">
        <!--固定源统计-->
        <v-header></v-header>
        <!---->
        <div class="warp4">
            <el-tabs v-model="TitleName">
                <el-tab-pane label="监测数据" name="first">
                    <!---->
                    <div class="kass">
                        <div class="wbiaoti">
                            <a>查询条件</a>
                        </div>
                    </div>
                    <!--查询条件-->
                    <div class="chaxuntiaojian">
                        <div class="float001">
                            <span>企业名称</span>
                            <!--选择器-->
                            <el-select v-model="QyValue" placeholder="请选择企业" @change="changeoptions">
                                <el-option
                                        v-for="item in QyOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                            <!--排气口筛选-->
                            <span>排气口</span>
                            <!--选择器-->
                            <el-select v-model="pqValue" placeholder="请选择排气口" @change="changepaiqi">
                                <el-option
                                        v-for="item in pqOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="float3">
                            <el-date-picker v-model="startHour" type="datetime" placeholder="选择开始日期时间">
                            </el-date-picker>
                            <el-date-picker v-model="endHour" type="datetime" placeholder="选择结束日期时间">
                            </el-date-picker>
                        </div>
                        <div class="float5">
                            <el-button type="primary" @click="getListData">查询</el-button>
                            <el-button type="primary" @click="ExcelListData">导出</el-button>
                        </div>
                    </div>
                    <!---->
                    <div class="kass">
                        <div class="wbiaoti">
                            <a>监测数据表格</a>
                            <div class="f_right">
                                <div class="float_tl">
                                    <span class="css001"></span>
                                    <span>正常</span>
                                </div>
                                <div class="float_tl">
                                    <span class="css002"></span>
                                    <span>超标</span>
                                </div>
                                <div class="float_tl">
                                    <span class="css003"></span>
                                    <span>异常</span>
                                </div>
                                <div class="float_tl">
                                    <span class="css004"></span>
                                    <span>离线或维护</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!--表格-->
                    <div class="ell_table">
                        <!---->
                        <el-table :data="GetListtableData" show-summary :summary-method="getSummaries" border style="width: 100%">
                            <el-table-column label="监测时间">
                                <template scope="scope">
                                    <span>{{scope.row.time}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="企业名称">
                                <template scope="scope">
                                    <span>{{scope.row.psname}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="排气口名称">
                                <template scope="scope">
                                    <span>{{scope.row.outputname}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="烟尘(毫克/立方米)">
                                <el-table-column label="实测浓度">
                                    <template scope="scope">
                                        <span :style="{color:scope.row.smokeColor}">{{scope.row.smoke}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="折算浓度">
                                    <template scope="scope">
                                        <span :style="{color:scope.row.smoke_convertColor}">{{scope.row.smoke_convert}}</span>

                                    </template>
                                </el-table-column>
                            </el-table-column>
                            <el-table-column label="二氧化硫(毫克/立方米)">
                                <el-table-column label="实测浓度">
                                    <template scope="scope">
                                        <span :style="{color:scope.row.so2Color}">{{scope.row.so2}}</span>

                                    </template>
                                </el-table-column>
                                <el-table-column label="折算浓度">
                                    <template scope="scope">
                                        <span :style="{color:scope.row.so2_convertColor}">{{scope.row.so2_convert}}</span>

                                    </template>
                                </el-table-column>
                            </el-table-column>
                            <el-table-column label="氮氧化物(毫克/立方米)">
                                <el-table-column label="实测浓度">
                                    <template scope="scope">
                                        <span :style="{color:scope.row.noxColor}">{{scope.row.nox}}</span>

                                    </template>
                                </el-table-column>
                                <el-table-column label="折算浓度">
                                    <template scope="scope">
                                        <span :style="{color:scope.row.nox_convertColor}">{{scope.row.nox_convert}}</span>

                                    </template>
                                </el-table-column>
                            </el-table-column>
                            <el-table-column label="总排放量(毫克/立方米)">
                                <template scope="scope">
                                    <span :style="{color:scope.row.gasoutputflowColor}">{{scope.row.gasoutputflow}}</span>

                                </template>
                            </el-table-column>
                            <el-table-column label="含氧量(%)">
                                <template scope="scope">
                                    <span :style="{color:scope.row.o2Color}">{{scope.row.o2}}</span>

                                </template>
                            </el-table-column>
                        </el-table>
                        <!--分页-->
                        <div class="block">
                            <el-pagination
                                    background
                                    @size-change="handleSizeChange2"
                                           @current-change="handleCurrentChange2"
                                           :current-page="currentPage"
                                           :page-size="pagesize"
                                           layout="total, prev, pager, next, jumper"
                                           :total="totalCount2">
                            </el-pagination>
                        </div>
                    </div>
                    <!---->
                </el-tab-pane>
                <el-tab-pane label="超标统计" name="second">
                    <!--查询条件-->
                    <div class="kass">
                        <div class="wbiaoti">
                            <a>查询条件</a>
                        </div>
                    </div>
                    <!---->
                    <div class="chaxuntiaojian">
                        <!--查询条件-->
                        <div class="float001">
                            <span>企业名称</span>
                            <!--选择器-->
                            <el-select v-model="QyValue" placeholder="请选择" @change="changeoptions">
                                <el-option
                                        v-for="item in QyOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="float3">
                            <el-date-picker v-model="startHour" type="datetime" placeholder="选择开始日期时间">
                            </el-date-picker>
                            <el-date-picker v-model="endHour" type="datetime" placeholder="选择结束日期时间">
                            </el-date-picker>
                        </div>
                        <div class="float5">
                            <el-button type="primary" @click="getchaobiaoListData">查询</el-button>
                            <el-button type="primary" @click="SwitchingModule">{{tabletext}}</el-button>
                            <el-button type="primary" @click="ExcelchaobiaoListData">导出</el-button>
                        </div>
                    </div>
                    <!--视图切换-->
                    <div class="v-table" v-show="tableAall">
                        <div class="kass">
                            <div class="wbiaoti">
                                <a>图表</a>
                            </div>
                        </div>
                        <!---->
                        <div class="neirong">
                            <div class="text_con">
                                <span>{{stime}}-{{etime}}</span>
                                <select id="selectID" @change="chengeTimeGetData">
                                    <option value="烟尘">烟尘</option>
                                    <option value="SO2">SO2</option>
                                    <option value="氮氧化物">氮氧化物</option>
                                </select>
                                <span>超排情况</span>
                            </div>

                            <div class="tuxing" id="waper" width="1200px" height="450px"></div>
                        </div>
                    </div>

                    <div class="v-table" v-show="tableTell">
                        <div class="kass">
                            <div class="wbiaoti">
                                <a>列表</a>
                            </div>
                        </div>
                        <!---->
                        <div class="neirong">
                            <div class="lie_teble">
                                <el-table
                                        :data="OverStandardData"
                                        border
                                        style="width: 100%">
                                    <el-table-column
                                            prop="SerialNumber"
                                            label="序号"
                                            width="100"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="EnterpriseName"
                                            label="企业名称"
                                            >
                                    </el-table-column>
                                    <el-table-column
                                            prop="Excessindex"
                                            label="超标指数"
                                            >
                                    </el-table-column>
                                    <el-table-column
                                            prop="Exceedinghour"
                                            label="超标小时">
                                    </el-table-column>
                                    <el-table-column
                                            prop="MaximumExcessNumber"
                                            label="最大超标数">
                                    </el-table-column>
                                </el-table>
                                <!--分页-->
                                <div class="block">
                                    <el-pagination
                                            background
                                            @size-change="handleSizeChange"
                                            @current-change="handleCurrentChange"
                                            :current-page="currentPage"
                                            :page-size="pagesize"
                                            layout="total, prev, pager, next, jumper"
                                            :total="totalCount">
                                    </el-pagination>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
    import api from '../../api/index'
    export default {
        name: 'Fixedsourcestatistics',
        data() {
            return {
                //排气口值
                pqValue:'排气口1',
                //排气口名称
                pqOptions:[
                    {
                        value:"1",
                        label:'排气口1'
                    },
                    {
                        value:"2",
                        label:'排气口2'
                    },
                ],
                //排气口id
                exhaustData:'',
                //页面数据
                currentPage4: 100,
                //表格页码
                totalCount2:'',
                //图表展示标题开始时间
                stime:'',
                //图表展示标题结束时间
                etime:'',
                //测试表格数据
                tableData: [],
                //获取到的数据
                GetListtableData:[],
                //分页存储数据1
                allData: [],
                //分页存储数据2
                allData2: [],
                //按钮切换文字
                tabletext:'切换图表',
                //时间选择器
                pickerOptions0: {},
                //图表展示
                tableAall:false,
                //列表展示
                tableTell:true,
                //行
                currentRow: null,
                //默认每页数值
                pagesize: 10,
                //8888
                currentPage: 1,
                //数据量/分页
                totalCount: '',
                //页面大标题
                TitleName: 'first',
                //统计排名查询条件
                StatisticalRankingsName: 'PM2.5',
                //统计排名筛选条件
                StatisticalScreeningName: '全市',
                //乡镇考核筛选条件
                TownshipScreeningName: '全市',
                //企业下拉选项
                QyOptions: [
                    {
                        value:'',
                        label:'全部企业'
                    }
                ],
                //开始时间
                startHour:'',
                //结束时间
                endHour:'',
                //选择code值
                codevalue:'',
                //企业默认值
                QyValue: '三河热力总公司',
                //超标列表数据
                OverStandardData: [],
                //默认时间值
                timevalue: '',
                //模拟数据
                QyMoniData: [],
                //排放限量
                limitData:''
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
            this.DefaultTimeInit();
        },
        mounted() {
            //企业列表
            api.GetcompanyListTablaDataName().then(res =>{
                //console.log('测试接口列表')
                //console.log(res)
                let listData = res.data.Data;
                listData.forEach(item => {
                    const tableData = {};
                    tableData.value = item.pscode;//
                    tableData.label = item.psname;//企业名称
                    this.QyOptions.push(tableData);
                })
            });
            //默认数据
            this.getListData();
            //默认超标数据
            this.getchaobiaoListData();
            //
            setTimeout(()=>{
                this.ElectricityConsumption('烟尘');
            },500)
        },
        methods: {
            // 所有方法
            SwitchingModule(){
                if(this.tabletext == '切换图表'){
                    this.tabletext = '切换表格';
                    this.tableAall = true;
                    this.tableTell = false;
                }else if(this.tabletext == '切换表格'){
                    this.tabletext = '切换图表';
                    this.tableAall = false;
                    this.tableTell = true;
                    this.ElectricityConsumption('烟尘');
                }
            },
            //每页显示数据量变更
            handleSizeChange(val) {},
            //每页显示数据量变更2
            handleSizeChange2(val) {},
            //点击页码换页
            handleCurrentChange(val) {
                this.setPageTable(10, val);
            },
            //分页数据
            setPageTable(pageSize, pageNum) {
                let i = 1;
                let rtValue = [];
                let startNum = pageSize * (pageNum - 1);
                for (let i = 0; i < pageSize; i++) {
                    if ((startNum + i + 1) > this.allData.length)
                        break;
                    rtValue.push(this.allData[startNum + i]);
                }
                this.OverStandardData = rtValue;
            },
            //点击页码换页
            handleCurrentChange2(val) {
                this.setPageTable2(10, val);
            },
            //分页数据
            setPageTable2(pageSize, pageNum) {
                let i = 1;
                let rtValue = [];
                let startNum = pageSize * (pageNum - 1);
                for (let i = 0; i < pageSize; i++) {
                    if ((startNum + i + 1) > this.allData2.length)
                        break;
                    rtValue.push(this.allData2[startNum + i]);
                }
                this.GetListtableData = rtValue;
            },
            //企业详情表格
            setQYInfoWindow(data) {
                //console.log(data);
                let edata = data;
                //页面页码
                this.totalCount2 = edata.length;
                //let dts = data || [];
                this.GetListtableData = edata || [];
                //设置分页数组
                this.allData2 = this.GetListtableData;
                this.setPageTable2(10, 1);
            },
            //超标统计表数据
            StatisticalGenerationOverStandardData(data){
                this.data = data;
                this.OverStandardData = [];
                this.totalCount = data.length;
                let i = 1;
                this.data.forEach(item => {
                    const tableData = {};
                    tableData.SerialNumber = i++;//序号
                    tableData.EnterpriseName = item.Psname;//
                    tableData.Excessindex = item.OverItem;//
                    tableData.Exceedinghour = item.OverHourCount;//
                    tableData.MaximumExcessNumber = item.OverMultiple;//
                    this.OverStandardData.push(tableData);
                })
                this.allData = this.OverStandardData;
                this.setPageTable(10, 1);
            },
            //默认开始结束时间
            DefaultTimeInit(){
                let ndt = new Date();
                let ndt1 = new Date(ndt);
                ndt1.setDate(ndt.getDate() - 1);
               // this.startHour =  (ndt1.getFullYear() + '-' + (ndt1.getMonth() + 1) + '-' + ndt1.getDate()+' '+ ndt1.getHours()+':00');
               // this.endHour =  (ndt.getFullYear() + '-' + (ndt.getMonth() + 1) + '-' + ndt.getDate()+' '+ ndt.getHours()+':00');
                this.startHour = ndt1;
                this.endHour = ndt;
            },
            //请求正常数据数据
            getListData(){

              let start =  `${this.startHour.getFullYear()}-${(this.startHour.getMonth() + 1)}-${this.startHour.getDate()} ${this.startHour.getHours()}:00`;
              let end =  `${this.endHour.getFullYear()}-${(this.endHour.getMonth() + 1)}-${this.endHour.getDate()} ${this.endHour.getHours()}:00`;
              let code = this.codevalue || '131000000030';
              let outputcode = this.exhaustData || 1;
              api.GetCompanyHistoryDataResourceData(start, end, code ,outputcode).then(res =>{
               // console.log('测试接口001')
                //console.log(res)
                let listData = res.data.Data;
                this.limitData = res.data.ExtraData;
                this.setQYInfoWindow(listData);
              })
            },
            //请求超标数据
            getchaobiaoListData(){
              //超标数据
              let val = $("#selectID").val();
              let start =  `${this.startHour.getFullYear()}-${(this.startHour.getMonth() + 1)}-${this.startHour.getDate()} ${this.startHour.getHours()}:00`;
              let end =  `${this.endHour.getFullYear()}-${(this.endHour.getMonth() + 1)}-${this.endHour.getDate()} ${this.endHour.getHours()}:00`;
              let code = this.codevalue || '';
              api.GetCompanyOverLimitResourceData(start, end, code).then(res =>{
                //console.log('测试接口003')
                //console.log(res)
                let listData = res.data.Data;
                this.StatisticalGenerationOverStandardData(listData);
              })
              //
              this.stime = `${this.startHour.getFullYear()}年${(this.startHour.getMonth() + 1)}月${this.startHour.getDate()}日${this.startHour.getHours()}时`;
              this.etime = `${this.endHour.getFullYear()}年${(this.endHour.getMonth() + 1)}月${this.endHour.getDate()}日${this.endHour.getHours()}时`;
              //请求刷新图表
              setTimeout(()=>{
                  this.ElectricityConsumption(val);
              },500)
            },
            //导出正常数据
            ExcelListData(){
              //导出企业数据
              let start = `${this.startHour.getFullYear()}-${(this.startHour.getMonth() + 1)}-${this.startHour.getDate()} ${this.startHour.getHours()}:00`;
              let end =  `${this.endHour.getFullYear()}-${(this.endHour.getMonth() + 1)}-${this.endHour.getDate()} ${this.endHour.getHours()}:00`;
              let code = this.codevalue || '131000000030';
              let outputcode = this.exhaustData || 1;
              api.ExcelHistoryDataResourceData(start,end,code,outputcode);
            },
            //导出超标数据
            ExcelchaobiaoListData(){
              //导出超标数据
              let start =  `${this.startHour.getFullYear()}-${(this.startHour.getMonth() + 1)}-${this.startHour.getDate()} ${this.startHour.getHours()}:00`;
              let end =  `${this.endHour.getFullYear()}-${(this.endHour.getMonth() + 1)}-${this.endHour.getDate()} ${this.endHour.getHours()}:00`;
              let code = this.codevalue || '';
              api.ExcelOverLimitStatisticsResourceData(start,end,code)
            },
            //改变事件
            changeoptions(value){
              this.codevalue = value;
              //console.log(value)
              //请求排气口数据
                api.GetCompanyOutPutRes(value).then(res =>{
                    console.log(res)
                    this.pqOptions = [];
                    res.data.Data.forEach(item =>{
                        const leite ={
                            value:item.outputcode,
                            label:item.outputname
                        }
                        this.pqOptions.push(leite);
                    })
                })
            },
            //排气口数据
            changepaiqi(value){
                console.log('code号码')
                console.log(value)
                this.exhaustData = value;
            },
            //切换指标更改图形展示
            chengeTimeGetData(){
                let indexcode = $("#selectID").val();
                // console.log(indexcode);
                switch (indexcode) {
                    case '氮氧化物':
                        this.ElectricityConsumption('氮氧化物');
                        // this.DataConsumption(this.pm25);
                        console.log('氮氧化物大大的数据');
                        break;
                    case '烟尘':
                        this.ElectricityConsumption('烟尘');
                        // this.DataConsumption(this.pm10);
                        console.log('烟尘大大的数据');
                        break;
                    case 'SO2':
                        this.ElectricityConsumption('SO2');
                        // this.DataConsumption(this.so2);
                        console.log('SO2大大的数据')
                        break;
                }
            },
            //筛选数据
            getPointByType(type, data) {
                let rtValue = [];
                let dt = data;
                if (dt) {
                    for (let i = 0, length = dt.length; i < length; i++) {
                        let item = dt[i];
                        if (item.Excessindex == type) {
                            rtValue.push(dt[i]);
                        }
                    }
                }
                return rtValue;
            },
            //图形显示页面
            ElectricityConsumption(type) {
                let data = this.getPointByType(type, this.OverStandardData);
                //超标公司
                let seriesData = data.map(function (v) {return v.EnterpriseName;}) || [];
                //最大小时
                let xAxisData = data.map(function (v) {return v.Exceedinghour;}) || [];
                //最大超标
                let xAxisData2 = data.map(function (v) {return v.MaximumExcessNumber;}) || [];
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('waper'));
                // 指定图表的配置项和数据
                let option = {

                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#fff'
                            }
                        }
                    },
                    legend: {
                        data: ['最大超标倍数', '累计超排小时数'],
                        left: 'center',
                        textStyle: {
                            color: '#666'
                        },
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: seriesData,
                            axisPointer: {
                                type: 'shadow'
                            },
                            axisLabel: {
                                textStyle: {
                                    color: '#666'
                                }
                            },
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '',
                            axisLabel: {
                                formatter: '{value}',
                                textStyle: {
                                    color: '#666',
                                }
                            },
                            nameTextStyle: {
                                color: '#666'
                            },
                        },
                        {
                            type: 'value',
                            name: '',
                            axisLabel: {
                                formatter: '{value}',
                                textStyle: {
                                    color: '#666'
                                }
                            },
                            nameTextStyle: {
                                color: '#666'
                            },
                        }
                    ],
                    series: [
                        {
                            name: '累计超排小时数',
                            type: 'bar',
                            data:xAxisData,
                            itemStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: '#83bff6'},
                                            {offset: 0.5, color: '#188df0'},
                                            {offset: 1, color: '#188df0'}
                                        ]
                                    )
                                },
                                emphasis: {
                                    color: new echarts.graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: '#2378f7'},
                                            {offset: 0.7, color: '#2378f7'},
                                            {offset: 1, color: '#83bff6'}
                                        ]
                                    )
                                }
                            },
                        },
                        {
                            name: '最大超标倍数',
                            type: 'line',
                            yAxisIndex: 1,
                            data:xAxisData2,
                        }
                    ]
                };
                // 使用刚指定的配置项和数据显示图表。

                myChart.setOption(option);

            },
            //底部
            getSummaries(param) {
                const { columns } = param;
                const sums = [];
                let emissionLimits = this.limitData;
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '排放限值';
                        return;
                    }
                    if (index === 4) {
                        sums[index] = (emissionLimits.SmokeLimit || '----');
                        return;
                    }
                    if (index === 6) {
                        sums[index] = (emissionLimits.So2Limit || '----');
                        return;
                    }if (index === 8) {
                        sums[index] = (emissionLimits.NoxLimit || '----');
                        return;
                    }else {
                        sums[index] = '----';
                    }
                });

                return sums;
            }

        }

    };
</script>
<style lang="scss" scoped>
    .Fixedsourcestatistics {
        width: 100%;
        height: auto;
        //title标题
        .warp4 {
            width: 98%;
            height: auto;
            margin: 0 auto;
            .neirong {
                width: 96%;
                height: 600px;
                overflow-x: hidden;
                overflow-y: auto;
                margin: 0 auto;
                text-align: center;
                .text_con{
                    width: 100%;
                    height: 40px;
                    line-height: 40px;
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 15px;
                }
                .tuxing{
                    margin: 0 auto;
                    width: 1300px;
                    height: 400px;
                }
                .fitem {
                    border: 1px solid #DDDDDD;
                    margin: 2px 15px;
                    line-height: 18px;
                }
                .fitem th {
                    width: 65px;
                    font-size: 12px;
                    font-weight: normal;
                    text-align: center;
                    border: 1px solid #DDDDDD;
                }
                .fitem td {
                    font-size: 12px;
                    text-align: center;
                    border: 1px solid #DDDDDD;
                }
                .qyNumber {
                    color: #333333;
                }
                .t_item {
                    display: inline-block;
                    height: 36px;
                    line-height: 36px;
                    width: 100%;
                    background: #6d6d6d;
                    color: #666;
                }
            }
            .genduo {
                width: 100%;
                height: 34px;
                border: solid 1px #ccc;
                margin-top: 15px;
                line-height: 34px;
                cursor: pointer
            }
            .kass {
                width: 100%;
                height: auto;
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
                    margin-left: 10px;
                    .f_right{
                        width: 328px;
                        float: right;
                        .float_tl{
                            float: left;
                            margin-left: 10px;
                            font-weight: bold;
                            .css001{
                                display: inline-block;
                                background: #00ff00;
                                width: 15px;
                                height: 15px;
                                border-radius: 50%;
                            }
                            .css002{
                                display: inline-block;
                                background: red;
                                width: 15px;
                                height: 15px;
                                border-radius: 50%;
                            }
                            .css003{
                                display: inline-block;
                                background: #ffff00;
                                width: 15px;
                                height: 15px;
                                border-radius: 50%;
                            }
                            .css004{
                                display: inline-block;
                                background: #7f7f7f;
                                width: 15px;
                                height: 15px;
                                border-radius: 50%;
                            }
                        }
                    }
                }
            }
            .chaxuntiaojian {
                width: 100%;
                height: 50px;
                .float001 {
                    float: left;
                    margin-left: 30px;
                }
                .float3 {
                    float: left;
                    margin-left: 16%;
                }
                .float5{
                    float: left;
                    margin-left: 20px;
                }
            }

        }
        //媒体查询
        @media only screen and (min-width: 1400px) {
            .float3 {
                margin-left: 40%!important;
            }
            .tuxing{
                width: 1700px!important;
                height: 500px!important;
            }
        }
    }
</style>
