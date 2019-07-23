<template>
    <div class="AirStation">
        <!--乡镇空气站统计-->
        <v-header></v-header>
        <!---->
        <div class="warp3">
            <el-tabs v-model="TitleName" @tab-click="">
                <el-tab-pane label="统计排名" name="first">
                    <!---->
                    <div class="kass">
                        <div class="wbiaoti">
                            <a>查询条件</a>
                            <div class="ExportBtn" v-show="StatisticalRankingsName=='自定义选择'?true:false">
                            <el-button v-show="$store.state.responsibility===false" type="primary" @click='isExport=true'>导出</el-button>
                        	</div>
                        </div>
                    </div>
                    <!--查询条件-->
                    <div class="chaxuntiaojian">
                        <div class="float001">
                            <el-radio-group v-model="StatisticalRankingsName" @change='clickChangeData'>
                                <el-radio-button label="实时"></el-radio-button>
                                <el-radio-button label="日累计"></el-radio-button>
                                <el-radio-button label="日报"></el-radio-button>
                                <el-radio-button label="月报"></el-radio-button>
                                <!--<el-radio-button label="季报"></el-radio-button>-->
                                <el-radio-button label="年报"></el-radio-button>
                                <!-- :disabled="$store.state.Superadministrator" -->
                                <el-radio-button label="自定义选择"></el-radio-button>
                            </el-radio-group>
                        </div>
                        <div class="float002">
                            <!--日选择-->
                            <div class="day01" v-show="StatisticalRankingsName=='日报'?true:false">
                                <el-date-picker
                                        v-model="timevalue"
                                        type="date"
                                        placeholder="选择日期"
                                        :picker-options="pickerOptions0"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </div>
                            <!--月选择-->
                            <div class="day02" v-show="StatisticalRankingsName=='月报'?true:false">
                                <el-date-picker
                                        v-model="timevalueM"
                                        type="month"
                                        placeholder="选择月"
                                        format="yyyy-MM"
                                        value-format="yyyy-MM">
                                </el-date-picker>
                            </div>
                            <!--季报-->
                            <div class="day03" v-show="StatisticalRankingsName=='季报'?true:false">
                                <el-select v-model="timevalue" placeholder="请选择">
                                    <el-option
                                            v-for="item in Optionvaluejb"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                            <!--年选择-->
                            <div class="day04" v-show="StatisticalRankingsName=='年报'?true:false">
                                <el-date-picker
                                        v-model="timevalue"
                                        align="right"
                                        type="year"
                                        placeholder="选择年"
                                        format="yyyy"
                                        value-format="yyyy">
                                </el-date-picker>
                            </div>
                            <div  v-show="StatisticalRankingsName=='自定义选择'?true:false">
                            	<span class="demonstration">选择日期</span>
                            	<span class="day05">
	                                <el-date-picker
                                        v-model="timevalueStart"
                                        type="date"
                                        placeholder="选择日期"
                                        :picker-options="pickerOptions0">
	                                </el-date-picker>-
                                </span>
                                <span class="day06">
	                                <el-date-picker
                                        v-model="timevalueEnd"
                                        type="date"
                                        placeholder="选择日期"
                                        :picker-options="pickerOptions0">
	                                </el-date-picker>
                                </span>
                            </div>
                        </div>
                        <div class="float003">
                            <el-button type="primary" @click='GetDayDataByTime'>查询</el-button>
                        </div>
                    </div>
                    <!---->
                    <div class="kass">
                        <div class="wbiaoti">
                            <a>筛选区域</a>
                        </div>
                    </div>
                    <!--查询条件-->
                    <div class="chaxuntiaojian">
                        <div class="float001">
                            <el-radio-group v-model="StatisticalScreeningName" @change="clickChangeData">
                                <el-radio-button label="全市"></el-radio-button>
                                <el-radio-button label="片区"></el-radio-button>
                                <el-radio-button label="区县"></el-radio-button>
                            </el-radio-group>
                        </div>
                        <div class="float002 country" v-show="StatisticalScreeningName=='区县'?true:false">
                            <el-select v-model="Tjvalue" clearable placeholder="请选择" @change='clickChangeData'>
                                <el-option
                                        v-for="item in Optionvaluexx"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="float002 " v-show="StatisticalScreeningName=='片区'?true:false">
                            <el-select v-model="Pqvalue" clearable placeholder="请选择" @change='clickChangeData'>
                                <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </div>

                    </div>
                    <!--表格-->
                    <div class="xuanxiantable">
                        <el-table
                                :data="tableData"
                                 @sort-change='StatesortChange'
                                border
                                style="width: 100%">
                            <el-table-column
                                    prop="Ranking"
                                    label="排名"
                                    width="160">
                            </el-table-column>
                            <el-table-column
                                    prop="Name"
                                    label="乡镇">
                            </el-table-column>
                            <el-table-column
                                    prop="AnalysisTime"
                                    label="更新时间">
                            </el-table-column>
                            <el-table-column
                                    prop="Pm25"
                                    sortable='custom'
                                    label="PM2.5">
                            </el-table-column>
                            <el-table-column
                                    prop="SO2"
                                    sortable='custom'
                                    label="SO2">
                            </el-table-column>
                            <el-table-column
                                    prop="Com_Index"
                                    sortable='custom'
                                    label="综合指数">
                            </el-table-column>
                        </el-table>
                        <!--更多-->
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
                    <!--------------导出弹框部分--------------->
					<div class="popUp" v-if="isExport">
			            <div class="mask"></div>
			            <div class="succ-pop distribute">
			                <div class="title">
			                    <a id="newCreate">数据导出</a>
			                    <div class="el-icon-close" @click="isExport=false"></div>
			                </div>
			                <div class="content">
		                		<div id="Export">
		                            <el-radio-group v-model="ExportOption" @change=''>
		                                <el-radio-button label="日数据"></el-radio-button>
		                                <el-radio-button label="小时数据"></el-radio-button>
		                            </el-radio-group>
                        		</div>
                        		<div class="" v-show="ExportOption=='日数据'?true:false">
                        			<span>开始时间</span>
	                                <el-date-picker
	                                        v-model="timeDayStart"
	                                        type="date"
	                                        placeholder="选择日期"
	                                        :picker-options="pickerOptions0"
	                                        value-format="yyyy-MM-dd">
	                                </el-date-picker>
	                                <span>结束时间</span>
	                                 <el-date-picker
	                                        v-model="timeDayEnd"
	                                        type="date"
	                                        placeholder="选择日期"
	                                        :picker-options="pickerOptions0"
	                                        value-format="yyyy-MM-dd">
	                                </el-date-picker>
                            	</div>
                            	<div class="HourData" v-show="ExportOption=='小时数据'?true:false">
                            		<span>开始时间</span>
	                                <el-date-picker
	                                        v-model="timeHourStart"
	                                        type="datetime"
	                                        placeholder="选择日期"
	                                        :picker-options="pickerOptions0"
	                                        value-format="yyyy-MM-dd HH:00:00">
	                                </el-date-picker>
	                                <span>结束时间</span>
	                                 <el-date-picker
	                                        v-model="timeHourEnd"
	                                        type="datetime"
	                                        placeholder="选择日期"
	                                        :picker-options="pickerOptions0"
	                                        value-format="yyyy-MM-dd HH:00:00"
	                                        >
	                                </el-date-picker>
                            	</div>
								<el-row style='position: absolute;bottom: 20px;right: 30px;'>
									<el-button type="primary" @click='conExport'>导出</el-button>
									<el-button plain @click='isExport=false'>取消</el-button>
								</el-row>
			               </div>
			            </div>
			        </div>
                    <!---->
                </el-tab-pane>
                <!--<el-tab-pane label="乡镇考核" name="second">
                    <div class="kass">
                        <div class="wbiaoti">
                            <a>查询条件</a>
                        </div>
                    </div>
                    <div class="chaxuntiaojian">
                        <div class="float001">
                            <el-select v-model="Xcvalue1" placeholder="请选择">
                                <el-option
                                        v-for="item in Optionvaluebox"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </div>-->
                        <!--月度-->
                        <!--<div class="float002" v-show="Xcvalue1=='月度'?true:false">
                            <el-select v-model="Xcvalue2" placeholder="请选择">
                                <el-option
                                        v-for="item in Optionvalue2"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </div>-->
                        <!--季度-->
                        <!--<div class="float002" v-show="Xcvalue1=='季度'?true:false">
                            <el-select v-model="Xcvalue3" placeholder="请选择">
                                <el-option
                                        v-for="item in Optionvalue1"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>-->
                    <!---->
                    <!--<div class="kass">
                        <div class="wbiaoti">
                            <a>筛选区域</a>
                        </div>
                    </div>-->
                    <!---->
                    <!--<div class="chaxuntiaojian">
                        <div class="float001">
                            <el-radio-group v-model="TownshipScreeningName">
                                <el-radio-button label="全市"></el-radio-button>
                                <el-radio-button label="区县"></el-radio-button>
                            </el-radio-group>
                        </div>
                        <div class="float000">
                            图例
                        </div>
                    </div>-->
                    <!--视图切换-->
                    <!--<div class="shituquanshi" v-show="TownshipScreeningName=='全市'?true:false">
                        <div class="tubiao001">
                            <el-table
                                    :data="WholeCityData"
                                    style="width: 100%">
                                <el-table-column
                                        prop="Inverted"
                                        label="倒排"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="Township"
                                        label="乡镇"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="PM25"
                                        label="PM2.5"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="SO2"
                                        label="SO2"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="CompositeIndex"
                                        label="综合指数"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="InvertedNumber"
                                        label="进入倒排次数"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="EarlyWarning"
                                        label="处罚预警"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="Operation"
                                        label="操作">
                                </el-table-column>
                            </el-table>

                            <div class="genduo">
                                更多
                            </div>
                        </div>
                    </div>
                    <div class="shituquxian" v-show="TownshipScreeningName=='区县'?true:false">-->

                        <!---->
                        <!--<el-tabs :tab-position="tabPosition" style="height:auto;">
                            <el-tab-pane label="北部县区">
                                <div class="tubiao001">
                                    <el-table
                                            :data="WholeCityData"
                                            style="width: 100%">
                                        <el-table-column
                                                prop="Inverted"
                                                label="倒排"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                prop="Township"
                                                label="乡镇"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                prop="PM25"
                                                label="PM2.5"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                prop="SO2"
                                                label="SO2"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                prop="CompositeIndex"
                                                label="综合指数"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                prop="InvertedNumber"
                                                label="进入倒排次数"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                prop="EarlyWarning"
                                                label="处罚预警"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                prop="Operation"
                                                label="操作">
                                        </el-table-column>
                                    </el-table>

                                    <div class="genduo">
                                        更多
                                    </div>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="中部县区">
                                <div class="tubiao001">
                                    <el-table
                                            :data="WholeCityData"
                                            style="width: 100%">
                                        <el-table-column
                                                prop="Inverted"
                                                label="倒排"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                prop="Township"
                                                label="乡镇"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                prop="PM25"
                                                label="PM2.5"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                prop="SO2"
                                                label="SO2"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                prop="CompositeIndex"
                                                label="综合指数"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                prop="InvertedNumber"
                                                label="进入倒排次数"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                prop="EarlyWarning"
                                                label="处罚预警"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                prop="Operation"
                                                label="操作">
                                        </el-table-column>
                                    </el-table>

                                    <div class="genduo">
                                        更多
                                    </div>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="南部县区">
                                <div class="tubiao001">
                                    <el-table
                                            :data="WholeCityData"
                                            style="width: 100%">
                                        <el-table-column
                                                prop="Inverted"
                                                label="倒排"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                prop="Township"
                                                label="乡镇"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                prop="PM25"
                                                label="PM2.5"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                prop="SO2"
                                                label="SO2"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                prop="CompositeIndex"
                                                label="综合指数"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                prop="InvertedNumber"
                                                label="进入倒排次数"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                prop="EarlyWarning"
                                                label="处罚预警"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                prop="Operation"
                                                label="操作">
                                        </el-table-column>
                                    </el-table>

                                    <div class="genduo">
                                        更多
                                    </div>
                                </div>
                            </el-tab-pane>-->
                        <!--</el-tabs>-->

                    <!--</div>-->
                    <!---->
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import {bus} from '@/js/bus.js'
    import api from '../../api/index'

    export default {
        name: 'AirStation',
        data() {
            return {
                //
                tabPosition: 'top',
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
                //
                currentPage: 1,
                //数据量/分页
                totalCount: 1000,
                //页面大标题
                TitleName: 'first',
                //统计排名查询条件
                StatisticalRankingsName: '实时',
                //统计排名筛选条件
                StatisticalScreeningName: '全市',
                //乡镇考核筛选条件
                TownshipScreeningName: '全市',
                //
                pickerOptions0: {
//                  disabledDate(time) {
//                      return time.getTime() <= Date.now() - 8.64e7;
//                  }
                },
                //
                timevalue: '',
                timevalueM:'',
                //区县选项值
                Tjvalue: '',
                //片区选项值
                Pqvalue:'北部县区',
                //
                Optionvaluejb: [
                    {
                        value: '一季度',
                        label: '一季度'
                    },
                    {
                        value: '二季度',
                        label: '二季度'
                    },
                    {
                        value: '三季度',
                        label: '三季度'
                    },
                    {
                        value: '四季度',
                        label: '四季度'
                    }
                ],
                //乡镇区县列表 选择框部分
                Optionvaluexx: [],
                //数据1
                Xcvalue1: '月度',
                //数据2
                Xcvalue2: '',
                //数据3
                Xcvalue3: '',
                //
                Optionvaluebox: [{
                    value: '季度',
                    label: '季度'
                }, {
                    value: '月度',
                    label: '月度'
                }],
                //季度选项
                Optionvalue1: [
                    {
                        value: '一季度',
                        label: '一季度'
                    },
                    {
                        value: '二季度',
                        label: '二季度'
                    },
                    {
                        value: '三季度',
                        label: '三季度'
                    },
                    {
                        value: '四季度',
                        label: '四季度'
                    }
                ],
                //月度选项
                Optionvalue2: [
                    {
                        value: '1月',
                        label: '1月'
                    },
                    {
                        value: '2月',
                        label: '2月'
                    },
                    {
                        value: '3月',
                        label: '3月'
                    },
                    {
                        value: '4月',
                        label: '4月'
                    },
                    {
                        value: '5月',
                        label: '5月'
                    },
                    {
                        value: '6月',
                        label: '6月'
                    },
                    {
                        value: '7月',
                        label: '7月'
                    },
                    {
                        value: '8月',
                        label: '8月'
                    },
                    {
                        value: '9月',
                        label: '9月'
                    },
                    {
                        value: '10月',
                        label: '10月'
                    },
                    {
                        value: '11月',
                        label: '11月'
                    },
                    {
                        value: '12月',
                        label: '12月'
                    }
                ],
                //全市表格数据
                WholeCityData: [
                    {
                        Inverted: '倒排名',
                        Township: '乡镇',
                        PM25: 'PM2.5',
                        SO2: 'SO2',
                        CompositeIndex: '综合指数',
                        InvertedNumber: '倒排次数',
                        EarlyWarning: '处罚预警',
                        Operation: '操作'
                    },
                    {
                        Inverted: '倒排名',
                        Township: '乡镇',
                        PM25: 'PM2.5',
                        SO2: 'SO2',
                        CompositeIndex: '综合指数',
                        InvertedNumber: '倒排次数',
                        EarlyWarning: '处罚预警',
                        Operation: '操作'
                    },
                    {
                        Inverted: '倒排名',
                        Township: '乡镇',
                        PM25: 'PM2.5',
                        SO2: 'SO2',
                        CompositeIndex: '综合指数',
                        InvertedNumber: '倒排次数',
                        EarlyWarning: '处罚预警',
                        Operation: '操作'
                    },
                    {
                        Inverted: '倒排名',
                        Township: '乡镇',
                        PM25: 'PM2.5',
                        SO2: 'SO2',
                        CompositeIndex: '综合指数',
                        InvertedNumber: '倒排次数',
                        EarlyWarning: '处罚预警',
                        Operation: '操作'
                    },
                    {
                        Inverted: '倒排名',
                        Township: '乡镇',
                        PM25: 'PM2.5',
                        SO2: 'SO2',
                        CompositeIndex: '综合指数',
                        InvertedNumber: '倒排次数',
                        EarlyWarning: '处罚预警',
                        Operation: '操作'
                    }
                ],
                //片区选项
                options: [{
                    value: '北部县区',
                    label: '北部县区'
                }, {
                    value: '中部县区',
                    label: '中部县区'
                }, {
                    value: '南部县区',
                    label: '南部县区'
                }],
                value4: '',
                //统计排名全市数据  实时数据
                CityData: [],
                deadListData:[],
                page:1,
                timevalueStart:'',
                timevalueEnd:'',
                //导出
		        isExport:false,
		        ExportOption:'日数据',
		        timeDayStart:'',
		        timeDayEnd:'',
		        timeHourStart:'',
		        timeHourEnd:'',
            }
        },
        created() {
            let t = this;
            //乡镇企业列表展示
            api.GetTownList().then(res => {
//              console.log('乡镇企业列表展示')
//              console.log(res.data.Data)
            })
            //乡镇企业想洗数据展示
            api.GetSingleTown("9705040020021").then(res => {
//              console.log('乡镇企业详细数据展示')
//              console.log(res.data.Data)
            })
            //获取实时数据
            api.GetTownAnalysisList('').then(res => {
//              let i = 1;
                let townListData = res.data.Data;//所有的乡镇数据
                this.totalCount = townListData.length;
                this.totalCounts = townListData.length;
//              this.CityData = [];
                townListData.sort(this.compare('Com_Index')).reverse();
                this.deadListData = townListData.map((v,i)=>{
                	v['Ranking']=i+1;
                	v['Name']=v.Name;
                	v['AnalysisTime']=v.AnalysisTime.replace('T', ' ');
                	v['Com_Index']=v.Com_Index;
                	v['PM25']=v.Pm25;
                	v['SO2']=v.SO2;
                	return v});
                townListData.forEach(item => {
                    let tableData = {};//实时数据
                    tableData.Ranking = item.Ranking;//排名
                    tableData.Name = item.Name;//乡镇名称
                    tableData.AnalysisTime = item.AnalysisTime.replace('T', ' ');//更新时间
                    tableData.Com_Index = item.Com_Index;//综合指数
                    tableData.Pm25 = item.Pm25;//Pm25
                    tableData.SO2 = item.SO2;//SO2
                    t.CityData.push(tableData);
                })
                this.setPageTable(10, this.page);
            })
            //乡镇区县列表  选择框部分
            api.GetTownRegion().then(res => {
                let allTownData = res.data.Data;//所有的乡镇区县名称
                allTownData.forEach(item => {
                    let townData = {};
                    townData.value = item;
                    townData.label = item;
                    t.Optionvaluexx.push(townData);
                })
            })
        },
        mounted() {

        },
        methods: {
        	//导出
        	conExport(){
        		let ranktype;
        		let starttime;
        		let endtime;
        		let fl;
        		if(this.StatisticalScreeningName == '全市' && this.ExportOption=='日数据'){
        			ranktype='';
        			starttime = this.timeDayStart;
        			endtime = this.timeDayEnd;
        			fl = '';
        		}
        		if(this.StatisticalScreeningName == '全市' && this.ExportOption=='小时数据'){
        			ranktype=1;
        			starttime = this.timeHourStart;
        			endtime = this.timeHourEnd;
        			fl = '';
        		}
        		if(this.StatisticalScreeningName == '片区' && this.ExportOption=='日数据'&&this.Pqvalue){
        			ranktype='';
        			starttime = this.timeDayStart;
        			endtime = this.timeDayEnd;
        			fl=this.Pqvalue;
        		}
        		if(this.StatisticalScreeningName == '片区' && this.ExportOption=='小时数据'&&this.Pqvalue){
        			ranktype=1;
        			starttime = this.timeHourStart;
        			endtime = this.timeHourEnd;
        			fl=this.Pqvalue;
        		}
        		if(this.StatisticalScreeningName == '区县' && this.ExportOption=='日数据'&&this.Tjvalue){
        			ranktype='';
        			starttime = this.timeDayStart;
        			endtime = this.timeDayEnd;
        			fl=this.Tjvalue;
        		}
        		if(this.StatisticalScreeningName == '区县' && this.ExportOption=='小时数据'&&this.Tjvalue){
        			ranktype=1;
        			starttime = this.timeHourStart;
        			endtime = this.timeHourEnd;
        			fl = this.Tjvalue;
        		}
        		console.log(ranktype);
        		console.log(starttime);
        		console.log(endtime);
        		console.log(fl);
        		api.GetTownExcelOutPut(encodeURI(ranktype),starttime,endtime,fl);
        		this.isExport = false;
        	},
        	//排序
            StatesortChange(column, prop, order){
            	console.log(column)
            	if(column.prop=='Com_Index'){
        			//倒序
	        		if(column.order=='descending'){
	        			var [ ...deadListData2 ] = this.deadListData;
						this.CityData=deadListData2.sort(this.compare('Com_Index'));
						console.log(this.CityData);
						this.CityData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}
               		//正序
	        		if(column.order=='ascending'){
	        			var [ ...deadListData3 ] = this.deadListData;
						this.CityData=deadListData3.sort(this.compare('Com_Index')).reverse();
						console.log(this.CityData);
						this.CityData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}	
        			this.setPageTable(10, this.page);
        		}
        		if(column.prop=='SO2'){
        			//倒序
	        		if(column.order=='descending'){
	        			var [ ...deadListData10 ] = this.deadListData;
						this.CityData=deadListData10.sort(this.compare('SO2'));
						this.CityData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}
               		//正序
	        		if(column.order=='ascending'){
	        			var [ ...deadListData11 ] = this.deadListData;
						this.CityData=deadListData11.sort(this.compare('SO2')).reverse();
						this.CityData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}	
        			this.setPageTable(10, this.page);
        		}
        		if(column.prop=='Pm25'){
        			//倒序
	        		if(column.order=='descending'){
	        			var [ ...deadListData14 ] = this.deadListData;
						this.CityData=deadListData14.sort(this.compare('Pm25'));
						this.CityData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}
               		//正序
	        		if(column.order=='ascending'){
	        			var [ ...deadListData15 ] = this.deadListData;
						this.CityData=deadListData15.sort(this.compare('Pm25')).reverse();
						this.CityData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}	
        			this.setPageTable(10, this.page);
        		}
            },
            clickChangeData() {
//          	this.timevalue = '';
                let Time = $('.day01 input').val();
                let time = $('.day02 input').val();
                console.log(time)
                let quarter = $('.day03 input').val();
                let year = $('.day04 input').val();
                let beginTime = $('.day05 input').val();
                let endTime = $('.day06 input').val();
                switch(quarter){
                	case '一季度':
                		quarter = 1;
                	break;
                	case '二季度':
                		quarter = 2;
                	break;
                	case '三季度':
                		quarter = 3;
                	break;
                	case '四季度':
                		quarter = 4;
                	break;
                }
               //实时
                if (this.StatisticalRankingsName == '实时' && this.StatisticalScreeningName == '全市') {
                    let region = '';
                    this.getAllCityData(region);
                } else if (this.StatisticalRankingsName == '实时' && this.StatisticalScreeningName == '区县' && this.Tjvalue) {
                    let region = this.Tjvalue;
                    this.getAllCityData(encodeURI(region));
                }else if (this.StatisticalRankingsName == '实时' && this.StatisticalScreeningName == '片区' && this.Pqvalue) {
                    let region = this.Pqvalue;
                    console.log(region)
                    this.getAllCityData(encodeURI(region));
                }
                //
                if (this.StatisticalRankingsName == '日累计' && this.StatisticalScreeningName == '全市') {
                    let region = '';
                    this.GetTownAnalysisListForDay(region);
                } else if (this.StatisticalRankingsName == '日累计' && this.StatisticalScreeningName == '区县' && this.Tjvalue) {
                    let region = this.Tjvalue;
                    this.GetTownAnalysisListForDay(encodeURI(region));
                }else if (this.StatisticalRankingsName == '日累计' && this.StatisticalScreeningName == '片区' && this.Pqvalue) {
                    let region = this.Pqvalue;
                    this.GetTownAnalysisListForDay(encodeURI(region));
                }
                //
                if (this.StatisticalRankingsName == '日报' && this.StatisticalScreeningName == '全市' && !Time) {
                    let region = '';
                    let Time = this.getYesterday();
                    this.getDayData(Time, region);
                } else if (this.StatisticalRankingsName == '日报' && this.StatisticalScreeningName == '全市' && Time) {
               
                    let region = '';
                    this.getDayData(Time, region);
                } else if (this.StatisticalRankingsName == '日报' && this.StatisticalScreeningName == '区县' && !Time && this.Tjvalue) {
                    let region = this.Tjvalue;
                    let Time = '';
                    this.getDayData(Time, encodeURI(region));
                } else if (this.StatisticalRankingsName == '日报' && this.StatisticalScreeningName == '区县' && Time && this.Tjvalue) {
                    let region = this.Tjvalue;
                    this.getDayData(Time, encodeURI(region));
                }else if (this.StatisticalRankingsName == '日报' && this.StatisticalScreeningName == '片区' && !Time && this.Pqvalue) {
                    let region = this.Pqvalue;
                    let Time = '';
                    this.getDayData(Time, encodeURI(region));
                } else if (this.StatisticalRankingsName == '日报' && this.StatisticalScreeningName == '片区' && Time && this.Pqvalue) {
                    let region = this.Pqvalue;
                    this.getDayData(Time, encodeURI(region));
                }
                //月报
                if (this.StatisticalRankingsName == '月报' && this.StatisticalScreeningName == '全市' && !time) {
                    let region = '';
                    let time = this.getCurrentMonth();
                    this.getForMonthData(time, region);
                } else if (this.StatisticalRankingsName == '月报' && this.StatisticalScreeningName == '全市' && time) {
                	time = $('.day02 input').val()+'-01';
                    let region = '';
//                  time = time+'-01';
                    this.getForMonthData(time, region);
                } else if (this.StatisticalRankingsName == '月报' && this.StatisticalScreeningName == '区县' && !time && this.Tjvalue) {
                    let region = this.Tjvalue;
                    let time = '';
                    this.getForMonthData(time, encodeURI(region));
                } else if (this.StatisticalRankingsName == '月报' && this.StatisticalScreeningName == '区县' && time && this.Tjvalue) {
                    let region = this.Tjvalue;
                    time = $('.day02 input').val()+'-01';
                    this.getForMonthData(time, encodeURI(region));
                }else if (this.StatisticalRankingsName == '月报' && this.StatisticalScreeningName == '片区' && !time && this.Pqvalue) {
                    let region = this.Pqvalue;
                    let time = '';
                    this.getForMonthData(time, encodeURI(region));
                } else if (this.StatisticalRankingsName == '月报' && this.StatisticalScreeningName == '片区' && time && this.Pqvalue) {
                    let region = this.Pqvalue;
                    time = $('.day02 input').val()+'-01';
                    this.getForMonthData(time, region);
                }else if (this.StatisticalRankingsName == '季报' && this.StatisticalScreeningName == '全市' && !quarter) {
                	let year = '';
                	let quarter = '';
                    let region = '';
                    this.GetTownAnalysisListForQuarter(year, quarter,region);
                }else if (this.StatisticalRankingsName == '季报' && this.StatisticalScreeningName == '全市' && quarter) {
                	let year = '';
                    let region = '';
                    this.GetTownAnalysisListForQuarter(year, quarter,region);
                }else if (this.StatisticalRankingsName == '季报' && this.StatisticalScreeningName == '片区' && quarter && this.Pqvalue) {
                	let year = '';
                    let region = this.Pqvalue;
                    this.GetTownAnalysisListForQuarter(year, quarter,encodeURI(region));
                }else if (this.StatisticalRankingsName == '季报' && this.StatisticalScreeningName == '片区' && !quarter && this.Pqvalue) {
                	let year = '';
                	let quarter = '';
                    let region = this.Pqvalue;
                    this.GetTownAnalysisListForQuarter(year, quarter,encodeURI(region));
                }else if (this.StatisticalRankingsName == '季报' && this.StatisticalScreeningName == '区县' && quarter && this.Tjvalue) {
                	let year = '';
                    let region = this.Tjvalue;
                    this.GetTownAnalysisListForQuarter(year, quarter,encodeURI(region));
                }else if (this.StatisticalRankingsName == '季报' && this.StatisticalScreeningName == '区县' && !quarter && this.Tjvalue) {
                	let year = '';
                	let quarter = '';
                    let region = this.Tjvalue;
                    this.GetTownAnalysisListForQuarter(year, quarter,encodeURI(region));
                }else if (this.StatisticalRankingsName == '年报' && this.StatisticalScreeningName == '全市' && !year) {
                	let year = '';
                    let region = '';
                    this.GetTownAnalysisListForYear(year,region);
                }else if (this.StatisticalRankingsName == '年报' && this.StatisticalScreeningName == '全市' && year) {
                    let region = '';
                    this.GetTownAnalysisListForYear(year,region);
                }else if (this.StatisticalRankingsName == '年报' && this.StatisticalScreeningName == '片区' && year && this.Pqvalue) {
                    let region = this.Pqvalue;
                    this.GetTownAnalysisListForYear(year,encodeURI(region));
                }else if (this.StatisticalRankingsName == '年报' && this.StatisticalScreeningName == '片区' && !year && this.Pqvalue) {
                	let year = '';
                    let region = this.Pqvalue;
                    this.GetTownAnalysisListForYear(year,encodeURI(region));
                }else if (this.StatisticalRankingsName == '年报' && this.StatisticalScreeningName == '区县' && year && this.Tjvalue) {
                    let region = this.Tjvalue;
                    this.GetTownAnalysisListForYear(year,encodeURI(region));
                }else if (this.StatisticalRankingsName == '年报' && this.StatisticalScreeningName == '区县' && !year && this.Tjvalue) {
                	let year = '';
                    let region = this.Tjvalue;
                    this.GetTownAnalysisListForYear(year,encodeURI(region));
                } 
                if (this.StatisticalRankingsName == '自定义选择' && this.StatisticalScreeningName == '全市' && beginTime && endTime) {
                    let region = ''; 
                    this.GetTownAnalysisListForCustom(beginTime,endTime,region);
                }else if (this.StatisticalRankingsName == '自定义选择' && this.StatisticalScreeningName == '片区' && beginTime && endTime && this.Pqvalue) {
                    let region = this.Pqvalue; 
                    this.GetTownAnalysisListForCustom(beginTime,endTime,encodeURI(region));
                }else if (this.StatisticalRankingsName == '自定义选择' && this.StatisticalScreeningName == '区县' && beginTime && endTime && this.Tjvalue) {
                    let region = this.Tjvalue; 
                    this.GetTownAnalysisListForCustom(beginTime,endTime,encodeURI(region));
                }
            },
            getYesterday() {
                let d = new Date(new Date().getTime() - 86400000);
                let datetime;
                let year = d.getFullYear();
                let month = d.getMonth() + 1;
                let day = d.getDate();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                return datetime = year + '-' + month + '-' + day;
            },
            //获取当月第一天
            getCurrentMonth() {
                let d = new Date(new Date().getTime() - 86400000);
                let datetime;
                let year = d.getFullYear();
                let month = d.getMonth()+1;
                if (month < 10) {
                    month = "0" + month;
                }
                return datetime = year + '-' + month + '-01';
            },
            //日报根据时间获取数据
            GetDayDataByTime() {
                let Time = $('.day01 input').val();
                //let Time = this.timevalue;
                let t = this;
                let quarter = $('.day03 input').val();
                let year = $('.day04 input').val();
                let beginTime = $('.day05 input').val();
                let endTime = $('.day06 input').val();
                switch(quarter){
                	case '一季度':
                		quarter = 1;
                	break;
                	case '二季度':
                		quarter = 2;
                	break;
                	case '三季度':
                		quarter = 3;
                	break;
                	case '四季度':
                		quarter = 4;
                	break;
                };
                switch (t.StatisticalRankingsName){
                    case '日报':
                        if (t.StatisticalRankingsName == '日报' && t.StatisticalScreeningName == '全市' && Time) {
                            t.getDayData(Time, '');
                        } else if (t.StatisticalRankingsName == '日报' && t.StatisticalScreeningName == '区县' && Time && t.Tjvalue) {
                            let region = t.Tjvalue;
                            t.getDayData(Time, encodeURI(region));
                        }else if (this.StatisticalRankingsName == '日报' && t.StatisticalScreeningName == '片区' && Time && t.Pqvalue) {
                            let region = t.Pqvalue;
                            t.getDayData(Time, encodeURI(region));
                        }
                        break;
                    case '月报':
                     	let time = $('.day02 input').val();
                        if (t.StatisticalRankingsName == '月报' && t.StatisticalScreeningName == '全市' && time) {
                        	time = time +'-01';
                            t.getForMonthData(time, '');
                        } else if (t.StatisticalRankingsName == '月报' && t.StatisticalScreeningName == '区县' && time && t.Tjvalue) {
                        	time = time + '-01';
                            let region = t.Tjvalue;
                            t.getForMonthData(time, encodeURI(region));
                        }else if (this.StatisticalRankingsName == '月报' && t.StatisticalScreeningName == '片区' && time && t.Pqvalue) {
                        	time = time + '-01';
                            let region = t.Pqvalue;
                            t.getForMonthData(time, encodeURI(region));
                        }
                        break;
                    case '季报':
                        if (this.StatisticalRankingsName == '季报' && this.StatisticalScreeningName == '全市' && quarter) {
                	let year = '';
                    let region = ''; 
                    this.GetTownAnalysisListForQuarter(year, quarter,region);
                }else if (this.StatisticalRankingsName == '季报' && this.StatisticalScreeningName == '片区' && quarter&& this.Pqvalue) {
                	let year = '';
                    let region = this.Pqvalue; 
                    this.GetTownAnalysisListForQuarter(year, quarter,encodeURI(region));
                }else if (this.StatisticalRankingsName == '季报' && this.StatisticalScreeningName == '区县' && quarter&& this.Tjvalue) {
                	let year = '';
                    let region = this.Tjvalue; 
                    this.GetTownAnalysisListForQuarter(year, quarter,encodeURI(region));
                }     
                        break;
                    case '年报':
                        if (this.StatisticalRankingsName == '年报' && this.StatisticalScreeningName == '全市' && year) {
                    let region = ''; 
                    this.GetTownAnalysisListForYear(year,region);
                }else if (this.StatisticalRankingsName == '年报' && this.StatisticalScreeningName == '片区' && year && this.Pqvalue) {
                    let region = this.Pqvalue; 
                    this.GetTownAnalysisListForYear(year,encodeURI(region));
                }else if (this.StatisticalRankingsName == '年报' && this.StatisticalScreeningName == '区县' && year && this.Tjvalue) {
                    let region = this.Tjvalue; 
                    this.GetTownAnalysisListForYear(year,encodeURI(region));
                } 
                	case '自定义选择':
                		if (this.StatisticalRankingsName == '自定义选择' && this.StatisticalScreeningName == '全市' && beginTime && endTime) {
                    let region = ''; 
                    this.GetTownAnalysisListForCustom(beginTime,endTime,region);
                }else if (this.StatisticalRankingsName == '自定义选择' && this.StatisticalScreeningName == '片区' && beginTime && endTime && this.Pqvalue) {
                    let region = this.Pqvalue; 
                    this.GetTownAnalysisListForCustom(beginTime,endTime,encodeURI(region));
                }else if (this.StatisticalRankingsName == '自定义选择' && this.StatisticalScreeningName == '区县' && beginTime && endTime && this.Tjvalue) {
                    let region = this.Tjvalue; 
                    this.GetTownAnalysisListForCustom(beginTime,endTime,encodeURI(region));
                }else if(this.StatisticalRankingsName == '自定义选择' && !beginTime && !endTime){
                	this.$message({
			          message: '请输入查询时间',
			          type: 'warning'
			        });
                }
                        break;
                }

            },
			//获取季报数据
			GetTownAnalysisListForQuarter(year,quarter,region){
				this.CityData = [];
                let t = this;
				api.GetTownAnalysisListForQuarter(year,quarter,region).then(res => {
//                  let i = 1;
                    let quarterData = res.data.Data;
                    this.totalCount = quarterData.length;
                    this.totalCounts = quarterData.length;
                    quarterData.sort(this.compare('Com_Index')).reverse();
                this.deadListData = quarterData.map((v,i)=>{
                	v['Ranking']=i+1;
                	v['Name']=v.Name;
                	v['AnalysisYear']=v.AnalysisYear;
                	v['Com_Index']=v.Com_Index;
                	v['PM25']=v.Pm25;
                	v['SO2']=v.SO2;
                	return v});
                    quarterData.forEach(item => {
                        let tableData = {};//实时数据
                        tableData.Ranking = item.Ranking;//排名
                        tableData.Name = item.Name;//乡镇名称
                        tableData.AnalysisTime = item.AnalysisYear;//更新时间
                        tableData.Com_Index = item.Com_Index;//综合指数
                        tableData.Pm25 = item.Pm25;//Pm25
                        tableData.SO2 = item.SO2;//SO2
                        t.CityData.push(tableData);
                    })
                    this.setPageTable(10, this.page);
                })
			},
			//自定义数据
			GetTownAnalysisListForCustom(beginTime,endTime,region){
				this.CityData = [];
                let t = this;
				api.GetTownAnalysisListForCustom(beginTime,endTime,region).then(res => {
					console.log(res.data.Data)
                    let i = 1;
                    let yearData = res.data.Data;
                    this.totalCount = yearData.length;
                    this.totalCounts = yearData.length;
                    yearData.sort(this.compare('Com_Index')).reverse();
	                this.deadListData = yearData.map((v,i)=>{
	                	v['Ranking']=i+1;
	                	v['Name']=v.Name;
	                	v['AnalysisTime']=v.AnalysisYear;
	                	v['Com_Index']=v.Com_Index;
	                	v['PM25']=v.Pm25;
	                	v['SO2']=v.SO2;
	                	return v});
                    yearData.forEach(item => {
                        let tableData = {};//实时数据
                        tableData.Ranking = item.Ranking;//排名
                        tableData.Name = item.Name;//乡镇名称
                        tableData.AnalysisTime = item.AnalysisYear;//更新时间
                        tableData.Com_Index = item.Com_Index;//综合指数
                        tableData.Pm25 = item.Pm25;//Pm25
                        tableData.SO2 = item.SO2;//SO2
                        t.CityData.push(tableData);
                    })
                    this.setPageTable(10, 1);
                })
			},
			//获取年报数据
			GetTownAnalysisListForYear(year,region){
				this.CityData = [];
                let t = this;
				api.GetTownAnalysisListForYear(year,region).then(res => {
					console.log(res.data.Data)
                    let i = 1;
                    let yearData = res.data.Data;
                    this.totalCount = yearData.length;
                    this.totalCounts = yearData.length;
                    yearData.sort(this.compare('Com_Index')).reverse();
	                this.deadListData = yearData.map((v,i)=>{
	                	v['Ranking']=i+1;
	                	v['Name']=v.Name;
	                	v['AnalysisTime']=v.AnalysisTime;
	                	v['Com_Index']=v.Com_Index;
	                	v['PM25']=v.Pm25;
	                	v['SO2']=v.SO2;
	                	return v});
                    yearData.forEach(item => {
                        let tableData = {};//实时数据
                        tableData.Ranking = item.Ranking;//排名
                        tableData.Name = item.Name;//乡镇名称
                        tableData.AnalysisTime = item.AnalysisTime;//更新时间
                        tableData.Com_Index = item.Com_Index;//综合指数
                        tableData.Pm25 = item.Pm25;//Pm25
                        tableData.SO2 = item.SO2;//SO2
                        t.CityData.push(tableData);
                    })
                    this.setPageTable(10, 1);
                })
			},
            //获取日报数据
            getDayData(Time, region) {
                this.CityData = [];
                let t = this;
                //乡镇统计日报数据
                api.GetTownAnalysisListForDaily(Time, region).then(res => {
//                  let i = 1;
                    let dayData = res.data.Data;
                    this.totalCount = dayData.length;
                    this.totalCounts = dayData.length;
                    dayData.sort(this.compare('Com_Index')).reverse();
	                this.deadListData = dayData.map((v,i)=>{
	                	v['Ranking']=i+1;
	                	v['Name']=v.Name;
	                	v['AnalysisTime']=v.AnalysisTime.replace('T', ' ');
	                	v['Com_Index']=v.Com_Index;
	                	v['PM25']=v.Pm25;
	                	v['SO2']=v.SO2;
	                	return v});
                    dayData.forEach(item => {
                        let tableData = {};//实时数据
                        tableData.Ranking = item.Ranking;//排名
                        tableData.Name = item.Name;//乡镇名称
                        tableData.AnalysisTime = item.AnalysisTime.replace('T', ' ');//更新时间
                        tableData.Com_Index = item.Com_Index;//综合指数
                        tableData.Pm25 = item.Pm25;//Pm25
                        tableData.SO2 = item.SO2;//SO2
                        t.CityData.push(tableData);
                    })
                    this.setPageTable(10, 1);
                })
            },
            //获取月报数据
            getForMonthData(time, region) {
                this.CityData = [];
                let t = this;
                //乡镇统计月报数据
                api.GetTownAnalysisListForMonth(time, region).then(res => {
//                  let i = 1;
                    let dayData = res.data.Data;
                    this.totalCount = dayData.length;
                    this.totalCounts = dayData.length;
                    dayData.sort(this.compare('Com_Index')).reverse();
	                this.deadListData = dayData.map((v,i)=>{
	                	v['Ranking']=i+1;
	                	v['Name']=v.Name;
	                	v['AnalysisTime']=v.AnalysisTime.replace('T', ' ');
	                	v['Com_Index']=v.Com_Index;
	                	v['PM25']=v.Pm25;
	                	v['SO2']=v.SO2;
	                	return v});
                    dayData.forEach(item => {
                        let tableData = {};//实时数据
                        tableData.Ranking = item.Ranking;//排名
                        tableData.Name = item.Name;//乡镇名称
                        tableData.AnalysisTime = item.AnalysisTime.replace('T', ' ');//更新时间
                        tableData.Com_Index = item.Com_Index;//综合指数
                        tableData.Pm25 = item.Pm25;//Pm25
                        tableData.SO2 = item.SO2;//SO2
                        t.CityData.push(tableData);
                    })
                    this.setPageTable(10, 1);
                })
            },
            //获取日累计数据
            GetTownAnalysisListForDay(region) {
                if (this.StatisticalRankingsName == '日累计') {
                    this.CityData = [];
                    let t = this;
                    api.GetTownAnalysisListForDay(region).then(res => {
//                      let i = 1;
                        let dayData = res.data.Data;
                        this.totalCount = dayData.length;
                        this.totalCounts = dayData.length;
                        dayData.sort(this.compare('Com_Index')).reverse();
		                this.deadListData = dayData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	v['Name']=v.Name;
		                	v['AnalysisTime']=v.AnalysisTime.replace('T', ' ');
		                	v['Com_Index']=v.Com_Index;
		                	v['PM25']=v.Pm25;
		                	v['SO2']=v.SO2;
		                	return v});
                        dayData.forEach(item => {
                            let tableData = {};//实时数据
                            tableData.Ranking = item.Ranking;//排名
                            tableData.Name = item.Name;//乡镇名称
                            tableData.AnalysisTime = item.AnalysisTime.replace('T', ' ');//更新时间
                            tableData.Com_Index = item.Com_Index;//综合指数
                            tableData.Pm25 = item.Pm25;//Pm25
                            tableData.SO2 = item.SO2;//SO2
                            t.CityData.push(tableData);
                        })
                        this.setPageTable(10, 1);
                    })
                }
            },
//			获取全市实时的数据
            getAllCityData(region) {
                let t = this;
                api.GetTownAnalysisList(region).then(res => {
                    let i = 1;
                    t.CityData = [];
                    let townListData = res.data.Data;//所有的乡镇数据
//                  console.log(townListData)
                    this.totalCount = townListData.length;
                    this.totalCounts = townListData.length;
//                  this.CityData = [];
                townListData.sort(this.compare('Com_Index')).reverse();
                this.deadListData = townListData.map((v,i)=>{
                	v['Ranking']=i+1;
                	v['Name']=v.Name;
                	v['AnalysisTime']=v.AnalysisTime.replace('T', ' ');
                	v['Com_Index']=v.Com_Index;
                	v['PM25']=v.Pm25;
                	v['SO2']=v.SO2;
                	return v});
                    townListData.forEach(item => {
                        let tableData = {};//实时数据
                        tableData.Ranking = item.Ranking;//排名
                        tableData.Name = item.Name;//乡镇名称
                        tableData.AnalysisTime = item.AnalysisTime.replace('T', ' ');//更新时间
                        tableData.Com_Index = item.Com_Index;//综合指数
                        tableData.Pm25 = item.Pm25;//Pm25
                        tableData.SO2 = item.SO2;//SO2
                        t.CityData.push(tableData);
                    })
                    this.setPageTable(10, this.page);
                })
            },
            //每页显示数据量变更
            handleSizeChange(val) {
            },
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
                    if ((startNum + i + 1) > this.CityData.length)
                        break;
                    rtValue.push(this.CityData[startNum + i]);
                }
                this.tableData = rtValue;
            },
            //排序
            compare(propertyName) {
                return function (object1, object2) {
                    let value1 = object1[propertyName];
                    let value2 = object2[propertyName];
                    return value2 - value1
                }
            },
            //
            getSummaries(param) {
                const {columns, data} = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '总价';
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[index] += ' 元';
                    } else {
                        sums[index] = 'N/A';
                    }
                });

                return sums;
            }
        },
        components: {}
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

    .AirStation {
        width: 100%;
        height: auto;
         /*************弹出框**********/
	    .popUp {
	        /*灰色遮罩层*/
	        .mask {
	            width: 100%;
	            height: 100%;
	            background: rgba(0, 0, 0, 0.8);
	            position: fixed;
	            left: 0;
	            top: 0;
	            z-index: 998;
	        }
	        /*//分配弹框*/
	        .distribute{
	        	width: 600px;
	        	height: 280px;
	        	margin-left: -300px;
		    	margin-top: -140px;
		    	background: #fff;
	            position: fixed;
	            left: 50%;
	            top: 50%;
	            z-index: 999;
	            border-radius: 10px;
	            .title {
	                width: 100%;
	                height: 50px;
	                line-height: 50px;
	                text-align: left;
	                border-bottom: 2px solid #3a90b3;
	                /*margin-bottom:26px;*/
	                a {
	                    color: #3a90b3;
	                    font-size: 18px;
	                    padding-left: 20px;
	                }
	                div {
	                    margin-top: 15px;
	                    float: right;
	                    width: 24px;
	                    height: 24px;
	                    color: #363636;
	                    margin-right: 6px;
	                }
	            }
		    	.content{
		    		margin-left: 0px;
		    		margin-top: 20px;
		    	}
	        }
        }
        //title标题
        .warp3 {
            width: 96%;
            height: auto;
            margin: 0 auto;
            .shituquxian{
                width: 100%;
                height: auto;
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
                    .ExportBtn{
                    	float: right;
                    	margin-right: 30px;
                    }
                    text-align: left;
                    border-bottom: solid 1px #ccc;
                    width: 100%;
                    height: 40px;
                    margin-top: 10px;
                    margin-bottom: 20px;
                    margin-left: 10px;
                    line-height: 40px;
                }
            }
            .chaxuntiaojian {
                width: 100%;
                height: 50px;
                .float001 {
                    float: left;
                }
                .float002 {
                    float: left;
                    margin-left: 40px;
                }
                .float003 {
                    float: left;
                    margin-left: 40px;
                }
            }

        }
    }
</style>
