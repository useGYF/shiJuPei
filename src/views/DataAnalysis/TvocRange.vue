<template>
    <div class="TvocRange">
        <!--TVOC排名-->
        <v-header></v-header>
        <!---->
        <div class="warp3">
            <el-tabs v-model="TitleName" @tab-click="handleClick">
            	<el-tab-pane label="全市" name="first">
                    <!---->
                    <div class="kass">
                        <div class="wbiaoti">
                            <a>查询条件</a>
                            <div class="ExportBtn" v-show="allStatisticalRankingsName=='自定义'?true:false">
                            <el-button type="primary" v-show="$store.state.responsibility===false" @click='isExport=true'>导出</el-button>
                        	</div>
                        </div>
                    </div>
                    <!--查询条件-->
                    <div class="chaxuntiaojian">
                        <div class="float001">
                            <el-radio-group v-model="allStatisticalRankingsName" @change='GetTVOCRank'>
                                <el-radio-button label="日报"></el-radio-button>
                                <el-radio-button label="周报"></el-radio-button>
                                <el-radio-button label="月报"></el-radio-button>
                                <el-radio-button label="自定义"></el-radio-button>
                            </el-radio-group>
                        </div>
                        <div class="float002">
                            <!--日选择-->
                            <div class="day01" v-show="allStatisticalRankingsName!=='自定义'?true:false">
                            	<span class="demonstration">选择日期</span>
                                <el-date-picker
                                        v-model="timevalue"
                                        type="date"
                                        placeholder="选择日期"
                                        :picker-options="pickerOptions0">
                                </el-date-picker>
                            </div>
                            <!--自定义-->
                            <div class="" v-show="allStatisticalRankingsName=='自定义'?true:false">					
                            	<span class="day02">
	                            	<el-date-picker
	                                    v-model="timevalue1"
	                                    type="date"
	                                    placeholder="选择日期"
	                                    :picker-options="pickerOptions0">
	                               </el-date-picker>-
                                </span>
                               <span class="day03">
	                            	<el-date-picker
	                                    v-model="timevalue2"
	                                    type="date"
	                                    placeholder="选择日期"
	                                    :picker-options="pickerOptions0">
	                               </el-date-picker>
                                </span>
                            </div>
                        </div>
                        <div class="float003">
                            <el-button type="primary" @click='GetTVOCRank'>查询</el-button>
                        </div>
                    </div>
                    <!---->
                    <div class="kass">
                        <div class="wbiaoti">
                            <a>筛选区域</a>
                        </div>
                    </div>
                    <!--表格-->
                    <div class="xuanxiantable">
                        <el-table
                                :data="tableAllData"
                                border
                                ref="singleTable"
                                @sort-change='allSortChange'
                                style="width: 100%">
                            <el-table-column
                                    prop="Ranking"
                                    label="排名"
                                    width="160">
                            </el-table-column>
                            <el-table-column
                                    prop="Name"
                                    label="名称"
                                    width="200">
                            </el-table-column>
                            <el-table-column
                                    prop="TVOC"
                                    sortable='custom'
                                    label="TVOC">
                            </el-table-column>
                            
                        </el-table>
                        <!--分页-->
                        <div class="block">
                            <el-pagination
                                    background
                                    @size-change="handleSizeChange"
                                           @current-change="handleCurrentChangeAll"
                                           :current-page="currentPage"
                                           :page-size="pagesize"
                                           layout="total, prev, pager, next, jumper"
                                           :total="totalCountAll">
                            </el-pagination>
                        </div>
                    </div>
                
                </el-tab-pane>
                <el-tab-pane label="开发区" name="second">
                    <!---->
                    <div class="kass">
                        <div class="wbiaoti">
                            <a>查询条件</a>
                            <div class="ExportBtn" v-show="StatisticalRankingsName=='自定义'?true:false">
                            <el-button v-show="$store.state.responsibility===false" type="primary" @click='isExport=true'>导出</el-button>
                        	</div>
                        </div>
                    </div>
                    <!--查询条件-->
                    <div class="chaxuntiaojian">
                        <div class="float001">
                            <el-radio-group v-model="StatisticalRankingsName" @change='GetTVOCRankKai'>
                                <el-radio-button label="日报"></el-radio-button>
                                <el-radio-button label="周报"></el-radio-button>
                                <el-radio-button label="月报"></el-radio-button>
                                <el-radio-button label="自定义"></el-radio-button>
                            </el-radio-group>
                        </div>
                        <div class="float002">
                            <!--日选择-->
                            <div class="day01" v-show="StatisticalRankingsName!=='自定义'?true:false">
                            	<span class="demonstration">选择日期</span>
                                <el-date-picker
                                        v-model="timevalue"
                                        type="date"
                                        placeholder="选择日期"
                                        :picker-options="pickerOptions0">
                                </el-date-picker>
                            </div>
                            <!--自定义-->
                            <div class="" v-show="StatisticalRankingsName=='自定义'?true:false">					
                            	<span class="day02">
	                            	<el-date-picker
	                                    v-model="timevalue1"
	                                    type="date"
	                                    placeholder="选择日期"
	                                    :picker-options="pickerOptions0">
	                               </el-date-picker>-
                                </span>
                               <span class="day03">
	                            	<el-date-picker
	                                    v-model="timevalue2"
	                                    type="date"
	                                    placeholder="选择日期"
	                                    :picker-options="pickerOptions0">
	                               </el-date-picker>
                                </span>
                            </div>
                        </div>
                        <div class="float003">
                            <el-button type="primary" @click='GetTVOCRankKai'>查询</el-button>
                        </div>
                    </div>
                    <!---->
                    <div class="kass">
                        <div class="wbiaoti">
                            <a>筛选区域</a>
                        </div>
                    </div>
                    <!--表格-->
                    <div class="xuanxiantable">
                        <el-table
                                :data="tableStateData"
                                border
                                ref="singleTable"
                                @sort-change='StatesortChange'
                                style="width: 100%">
                            <el-table-column
                                    prop="Ranking"
                                    label="排名"
                                    width="160">
                            </el-table-column>
                            <el-table-column
                                    prop="Name"
                                    label="名称"
                                    width="200">
                            </el-table-column>
                            <el-table-column
                                    prop="TVOC"
                                    sortable='custom'
                                    label="TVOC">
                            </el-table-column>
                            
                        </el-table>
                        <!--分页-->
                        <div class="block">
                            <el-pagination
                                    background
                                    @size-change="handleSizeChange"
                                           @current-change="handleCurrentChangeState"
                                           :current-page="currentPage"
                                           :page-size="pagesize"
                                           layout="total, prev, pager, next, jumper"
                                           :total="totalCountState">
                            </el-pagination>
                        </div>
                    </div>
                
                </el-tab-pane>
               	<!--省控点-->
                <el-tab-pane label="安次区" name="third">
                    <div class="kass">
                        <div class="wbiaoti">
                            <a>查询条件</a>
                            <div class="ExportBtn" v-show="ProStatisticalRankingsName=='自定义'?true:false">
                            <el-button type="primary" v-show="$store.state.responsibility===false" @click='isExport=true'>导出</el-button>
                        	</div>
                        </div>
                    </div>
                    <!--查询条件-->
                    <div class="chaxuntiaojian">
                        <div class="float001">
                            <el-radio-group v-model="ProStatisticalRankingsName" @change='GetTVOCRankAnCi'>
                                <el-radio-button label="日报"></el-radio-button>
                                <el-radio-button label="周报"></el-radio-button>
                                <el-radio-button label="月报"></el-radio-button>
                                <el-radio-button label="自定义"></el-radio-button>
                            </el-radio-group>
                        </div>
                        <div class="float002">
                            <!--日选择-->
                            <div class="day01" v-show="ProStatisticalRankingsName!=='自定义'?true:false">
                            	<span class="demonstration">选择日期</span>
                                <el-date-picker
                                        v-model="timevalue"
                                        type="date"
                                        placeholder="选择日期"
                                        :picker-options="pickerOptions0">
                                </el-date-picker>
                            </div>
                            
                             <!--自定义-->
                            <div class="" v-show="ProStatisticalRankingsName=='自定义'?true:false">					
                            	<span class="day02">
	                            	<el-date-picker
	                                    v-model="timevalue1"
	                                    type="date"
	                                    placeholder="选择日期"
	                                    :picker-options="pickerOptions0">
	                               </el-date-picker>-
                                </span>
                               <span class="day03">
	                            	<el-date-picker
	                                    v-model="timevalue2"
	                                    type="date"
	                                    placeholder="选择日期"
	                                    :picker-options="pickerOptions0">
	                               </el-date-picker>
                                </span>
                            </div>
                        </div>
                        <div class="float003">
                            <el-button type="primary" @click='GetTVOCRankAnCi'>查询</el-button>
                        </div>
                    </div>
                    <!---->
                    <div class="kass">
                        <div class="wbiaoti">
                            <a>筛选区域</a>
                        </div>
                    </div>
                    <!--表格-->
                    <div class="xuanxiantable">
                        <el-table
                                :data="tableData"
                                border
                                @sort-change='sortChange'
                                style="width: 100%">
                            <el-table-column
                                    prop="Ranking"
                                    label="排名"
                                    width="160">
                            </el-table-column>
                            <el-table-column
                                    prop="Name"
                                    label="名称"
                                    width="200">
                            </el-table-column>
                            <el-table-column
                                    prop="TVOC"
                                     sortable='custom'
                                    label="TVOC">
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
                </el-tab-pane>
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
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import {bus} from '@/js/bus.js'
    import api from '../../api/index'

    export default {
        name: 'TvocRange',
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
                //国控点分页
                totalCountState:100,
                //页面大标题
                TitleName: 'first',
                //国控点查询条件
                StatisticalRankingsName: '日报',
                //省控点查询条件
                ProStatisticalRankingsName: '日报',
                allStatisticalRankingsName:'日报',
                pickerOptions0: {
//                  disabledDate(time) {
//                      return time.getTime() <= Date.now() - 8.64e7;
//                  }
                },
                //
                timevalue: '',
                //数据1
                Xcvalue1: '月度',
                //数据2
                Xcvalue2: '',
                //数据3
                Xcvalue3: '',
              
                value4: '',
                //统计排名全市数据  实时数据
                CityData: [],
               	timevalue1:'',
		        value: '',
		        value1:'',
		        statePageData:[],
		        //国控数据
		        deadStateData:[],
		        //省控点数据
		        deadProData:[],
		        pageIndex:1,
		        //国控点
		        page:1,
		        tableStateData:[],
		        timevalue2:'',
		        //全市
		        deadAllData:[],
		        allPageData:[],
		        pageAll:1,
		        totalCountAll:100,
		        tableAllData:[],
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
            
        },
        mounted() {
			this.GetTVOCRank();
			this.GetTVOCRankKai();
			this.GetTVOCRankAnCi();
        },
        methods: {
        	//导出
        	conExport(){
        		let ranktype;
        		let starttime;
        		let endtime;
        		let fl;
        		if(this.ExportOption=='日数据'){
        			ranktype=0;
        			starttime = this.timeDayStart;
        			endtime = this.timeDayEnd;
        		}else{
        			ranktype=1;
        			starttime = this.timeHourStart;
        			endtime = this.timeHourEnd;
        		}
        		if(this.TitleName=='first'){
        			fl = 3;
        		}else if(this.TitleName=='second'){
        			fl = 1;
        		}else if(this.TitleName=='third'){
        			fl = 2;
        		}
        		api.GetTVOCExcelOutPut(ranktype,starttime,endtime,fl);
        		this.isExport = false;
        	},
        	handleClick(){
        		this.timevalue1 = '';
        		this.timevalue2 = '';
        		this.timevalue = '';
        	},
        	//获取前一天
        	GetYesterday(){
        		var day1 = new Date();
				day1.setTime(day1.getTime()-24*60*60*1000);
				var s1 = day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();
				return s1;
        	},
        	//全市数据获取
        	GetTVOCRank(){
        		var ranktype='';
        		var starttime='';
        		var endtime='';
				if(this.allStatisticalRankingsName=='日报'){
					ranktype = '0';
					starttime = $('.day01 input').val()?$('.day01 input').val():this.GetYesterday();
					endtime = '';
				}
				if(this.allStatisticalRankingsName=='周报'){
					ranktype = '1';
					endtime = $('.day01 input').val()?$('.day01 input').val():this.GetYesterday();
					starttime = '';
				}
				if(this.allStatisticalRankingsName=='月报'){
					ranktype = '2';
					endtime = $('.day01 input').val()?$('.day01 input').val():this.GetYesterday();
					starttime = '';
				}
				if(this.allStatisticalRankingsName=='自定义'){
					ranktype = '3';
					starttime = $('.day02 input').val();
					endtime = $('.day03 input').val();
				}
        		api.GetTVOCRank(ranktype,starttime,endtime).then(res=>{
        			console.log(res)
        			let t = this;
        			let allData = res.data.Data;
        			this.totalCountAll = allData.length;
        			if(allData){
        				//全市
        				allData.sort(this.compare('tvoc')).reverse();
		                this.deadAllData = allData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	v['Name']=v.name;
		                	v['TVOC']=v.tvoc;
		                	return v});
		                this.allPageData = [];
		                allData.forEach(item => {
		                    let tableData = {};
		                    tableData.Ranking = item.Ranking;//排名
		                    tableData.Name = item.Name;//名称
		                    tableData.TVOC = item.TVOC?item.TVOC:'--';//tvoc
		                    t.allPageData.push(tableData);
		                })
		                this.setAllPageTable(10, this.pageAll);
        			}
        		})
        	},
        	//开发区数据获取
        	GetTVOCRankKai(){
        		var ranktype='';
        		var starttime='';
        		var endtime='';
				if(this.StatisticalRankingsName=='日报'){
					ranktype = '0';
					starttime = $('.day01 input').val()?$('.day01 input').val():this.GetYesterday();
					endtime = '';
				}
				if(this.StatisticalRankingsName=='周报'){
					ranktype = '1';
					endtime = $('.day01 input').val()?$('.day01 input').val():this.GetYesterday();
					starttime = '';
				}
				if(this.StatisticalRankingsName=='月报'){
					ranktype = '2';
					endtime = $('.day01 input').val()?$('.day01 input').val():this.GetYesterday();
					starttime = '';
				}
				if(this.StatisticalRankingsName=='自定义'){
					ranktype = '3';
					starttime = $('.day02 input').val();
					endtime = $('.day03 input').val();
				}
        		api.GetTVOCRank(ranktype,starttime,endtime).then(res=>{
        			console.log(res)
        			let t = this;
        			let allData = res.data.Data;
        			this.totalCountAll = allData.length;
        			if(allData){
        				let stateData=[];//开发区数据
        				allData.forEach(item=>{
        					if(item.area=='开发区'){
        						stateData.push(item)
        					}
        				})
        				//开发区
        				t.statePageData = [];
        				this.totalCountState = stateData.length;
		                stateData.sort(this.compare('tvoc')).reverse();
		                this.deadStateData = stateData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	v['Name']=v.name;
		                	v['TVOC']=v.tvoc;
		                	return v});
		                let i = 1;
		                stateData.forEach(item => {
		                    let tableData = {};
		                    tableData.Ranking = item.Ranking;//排名
		                    tableData.Name = item.Name;//名称
		                    tableData.TVOC = item.TVOC?item.TVOC:'--';//TVOC
		                    t.statePageData.push(tableData);
		                })
		                this.setStatePageTable(10, this.page);
        			}
        		})
        	},
        	//安次区数据获取
        	GetTVOCRankAnCi(){
        		var ranktype='';
        		var starttime='';
        		var endtime='';
				if(this.ProStatisticalRankingsName=='日报'){
					ranktype = '0';
					starttime = $('.day01 input').val()?$('.day01 input').val():this.GetYesterday();
					endtime = '';
				}
				if(this.ProStatisticalRankingsName=='周报'){
					ranktype = '1';
					endtime = $('.day01 input').val()?$('.day01 input').val():this.GetYesterday();
					starttime = '';
				}
				if(this.ProStatisticalRankingsName=='月报'){
					ranktype = '2';
					endtime = $('.day01 input').val()?$('.day01 input').val():this.GetYesterday();
					starttime = '';
				}
				if(this.ProStatisticalRankingsName=='自定义'){
					ranktype = '3';
					starttime = $('.day02 input').val();
					endtime = $('.day03 input').val();
				}
        		api.GetTVOCRank(ranktype,starttime,endtime).then(res=>{
        			console.log(res)
        			let t = this;
        			let allData = res.data.Data;
        			this.totalCountAll = allData.length;
        			if(allData){
        				let proData=[];//安次区数据
        				allData.forEach(item=>{
        					if(item.area=='安次区'){
        						proData.push(item)
        					}
        				})
						//安次区
		                this.totalCount = proData.length;
		                this.totalCounts = proData.length;
		                proData.sort(this.compare('tvoc')).reverse();
		                this.deadProData = proData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	v['Name']=v.name;
		                	v['TVOC']=v.tvoc;
		                	return v});
		                let j = 1;
		                t.CityData = [];
		                proData.forEach(item => {
		                    let tableData = {};//实时数据
		                    tableData.Ranking = item.Ranking;//排名
		                    tableData.Name = item.Name;//名称
		                    tableData.TVOC = item.TVOC?item.TVOC:'--';//综合指数
		                    t.CityData.push(tableData);
		                })
		                this.setPageTable(10, this.pageIndex);
        			}
        		})
        	},
          	//排序
            compare(propertyName) {
                return function (object1, object2) {
                    let value1 = object1[propertyName];
                    let value2 = object2[propertyName];
                    return value2 - value1
                }
            },
            //开发区排序
            StatesortChange(column, prop, order){
    			//倒序
        		if(column.order=='descending'){
        			var [ ...deadStateData2 ] = this.deadStateData;
					this.statePageData=deadStateData2.sort(this.compare('TVOC'));
					this.statePageData.map((v,i)=>{
	                	v['Ranking']=i+1;
	                	return v
					})
        		}
           		//正序
        		if(column.order=='ascending'){
        			var [ ...deadStateData3 ] = this.deadStateData;
					this.statePageData=deadStateData3.sort(this.compare('TVOC')).reverse();
					this.statePageData.map((v,i)=>{
	                	v['Ranking']=i+1;
	                	return v
					})
        		}	
    			this.setStatePageTable(10, this.page);
            },
            //安次区排序
            sortChange(column, prop, order){
    			//倒序
        		if(column.order=='descending'){
        			var [ ...deadProData2 ] = this.deadProData;
					this.CityData=deadProData2.sort(this.compare('TVOC'));
					this.CityData.map((v,i)=>{
	                	v['Ranking']=i+1;
	                	return v
					})
        		}
           		//正序
        		if(column.order=='ascending'){
        			var [ ...deadProData3 ] = this.deadProData;
					this.CityData=deadProData3.sort(this.compare('TVOC')).reverse();
					this.CityData.map((v,i)=>{
	                	v['Ranking']=i+1;
	                	return v
					})
        		}	
    			this.setPageTable(10, this.pageIndex);
        	},
        	//全市排序
            allSortChange(column, prop, order){
    			//倒序
        		if(column.order=='descending'){
        			var [ ...deadAllData2 ] = this.deadAllData;
					this.allPageData=deadAllData2.sort(this.compare('TVOC'));
					this.allPageData.map((v,i)=>{
	                	v['Ranking']=i+1;
	                	return v
					})
        		}
           		//正序
        		if(column.order=='ascending'){
        			var [ ...deadAllData3 ] = this.deadAllData;
					this.allPageData=deadAllData3.sort(this.compare('TVOC')).reverse();
					this.allPageData.map((v,i)=>{
	                	v['Ranking']=i+1;
	                	return v
					})
        		}	
    			this.setAllPageTable(10, this.pageAll);
            },
            //每页显示数据量变更
            handleSizeChange(val) {
            },
            //开发区点击页码换页
            handleCurrentChangeState(val) {
                this.setStatePageTable(10, val);
            },
            //安次区点击页码换页
            handleCurrentChange(val) {
                this.setPageTable(10, val);
            },
            //全市点击页码换页
            handleCurrentChangeAll(val) {
                this.setAllPageTable(10, val);
            },
            //全市分页
            setAllPageTable(pageSize, pageNum) {
                let i = 1;
                let rtValue = [];
                let startNum = pageSize * (pageNum - 1);
                for (let i = 0; i < pageSize; i++) {
                    if ((startNum + i + 1) > this.allPageData.length)
                        break;
                    rtValue.push(this.allPageData[startNum + i]);
                }
                this.tableAllData = rtValue;
            },
            //安次区分页数据
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
            //开发区分页数据
            setStatePageTable(pageSize, pageNum) {
                let i = 1;
                let rtValue = [];
                let startNum = pageSize * (pageNum - 1);
                for (let i = 0; i < pageSize; i++) {
                    if ((startNum + i + 1) > this.statePageData.length)
                        break;
                    rtValue.push(this.statePageData[startNum + i]);
                }
                this.tableStateData = rtValue;
            },
        },
        components: {}
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

    .TvocRange {
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
