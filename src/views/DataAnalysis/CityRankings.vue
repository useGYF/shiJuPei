<template>
    <div class="CityRankings">
        <!--城市排名-->
        <v-header></v-header>
        <!---->
        <div class="warp3">
            <el-tabs v-model="TitleName" @tab-click="handleClick">
                <el-tab-pane label="2+26城市" name="first">
                    <!---->
                    <div class="kass">
                        <div class="wbiaoti">
                            <a>查询条件</a>
                        </div>
                    </div>
                    <!--查询条件-->
                    <div class="chaxuntiaojian">
                        <div class="float001">
                            <el-radio-group v-model="StatisticalRankingsName" @change='GetSixParamCityRank'>
                                <el-radio-button label="日报"></el-radio-button>
                                <el-radio-button label="月报"></el-radio-button>
                                <el-radio-button label="年报"></el-radio-button>
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
                            <el-button type="primary" @click='GetSixParamCityRank'>查询</el-button>
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
                                :data="statePageData"
                                border
                                @sort-change='StatesortChange'
                                style="width: 100%"
                                height="450">
                            <el-table-column
                                    prop="Ranking"
                                    label="排名"
                                    width="160">
                            </el-table-column>
                            <el-table-column
                                    prop="Name"
                                    label="名称"
                                    width="160">
                            </el-table-column>
                            <el-table-column
                                    prop="PM25"
                                    sortable='custom'
                                    label="PM2.5">
                            </el-table-column>
                            <el-table-column
                                    prop="PM10"
                                    sortable='custom'
                                    label="PM10">
                            </el-table-column>
                            <el-table-column
                                    prop="SO2"
                                    sortable='custom'
                                    label="SO2">
                            </el-table-column>
                            <el-table-column
                                    prop="NO2"
                                    sortable='custom'
                                    label="NO2">
                            </el-table-column>
                            <el-table-column
                                    prop="CO"
                                    sortable='custom'
                                    label="CO">
                            </el-table-column>
                            <el-table-column
                                    prop="O3"
                                    sortable='custom'
                                    label="O3">
                            </el-table-column>
                            <el-table-column
                                    prop="Com_Index"
                                    sortable='custom'
                                    label="综合指数">
                            </el-table-column>
                        </el-table>
                        <!--分页-->
                        <!--<div class="block">
                            <el-pagination
                                    background
                                    @size-change="handleSizeChange"
                                           @current-change="handleCurrentChangeState"
                                           :current-page="currentPage"
                                           :page-size="pagesize"
                                           layout="total, prev, pager, next, jumper"
                                           :total="totalCountState">
                            </el-pagination>
                        </div>-->
                    </div>
                
                </el-tab-pane>
               	<!--京津冀城市-->
                <el-tab-pane label="京津冀城市" name="second">
                    <div class="kass">
                        <div class="wbiaoti">
                            <a>查询条件</a>
                        </div>
                    </div>
                    <!--查询条件-->
                    <div class="chaxuntiaojian">
                        <div class="float001">
                            <el-radio-group v-model="ProStatisticalRankingsName" @change='GetSixParamCityRankJJ'>
                                <el-radio-button label="日报"></el-radio-button>
                                <el-radio-button label="月报"></el-radio-button>
                                <el-radio-button label="年报"></el-radio-button>
                                <el-radio-button label="自定义"></el-radio-button>
                            </el-radio-group>
                        </div>
                        <div class="float002">
                            <!--日月年选择-->
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
                            <el-button type="primary" @click='GetSixParamCityRankJJ'>查询</el-button>
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
                                :data="CityData"
                                border
                                @sort-change='sortChange'
                                style="width: 100%"
                                height="450">
                            <el-table-column
                                    prop="Ranking"
                                    label="排名"
                                    width="160">
                            </el-table-column>
                            <el-table-column
                                    prop="Name"
                                    label="名称"
                                    width="160">
                            </el-table-column>
                            <el-table-column
                                    prop="PM25"
                                     sortable='custom'
                                    label="PM2.5">
                            </el-table-column>
                            <el-table-column
                                    prop="PM10"
                                    sortable='custom'
                                    label="PM10">
                            </el-table-column>
                            <el-table-column
                                    prop="SO2"
                                    sortable='custom'
                                    label="SO2">
                            </el-table-column>
                            <el-table-column
                                    prop="NO2"
                                    sortable='custom'
                                    label="NO2">
                            </el-table-column>
                            <el-table-column
                                    prop="CO"
                                    sortable='custom'
                                    label="CO">
                            </el-table-column>
                            <el-table-column
                                    prop="O3"
                                    sortable='custom'
                                    label="O3">
                            </el-table-column>
                            <el-table-column
                                    prop="Com_Index"
                                    sortable='custom'
                                    label="综合指数">
                            </el-table-column>
                        </el-table>
                        <!--分页-->
                        <!--<div class="block">
                            <el-pagination
                                    background
                                    @size-change="handleSizeChange"
                                           @current-change="handleCurrentChange"
                                           :current-page="currentPage"
                                           :page-size="pagesize"
                                           layout="total, prev, pager, next, jumper"
                                           :total="totalCount">
                            </el-pagination>
                        </div>-->
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import {bus} from '@/js/bus.js'
    import api from '../../api/index'

    export default {
        name: 'CityRankings',
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
                //
                CityData: [],
               	timevalue1:'',
		        value: '',
		        value1:'',
		        statePageData:[],
		        //2+26城市数据
		        deadStateData:[],
		        //京津冀城市数据
		        deadProData:[],
		        pageIndex:1,
		        //2+26
		        page:1,
		        tableStateData:[],
		        timevalue2:''
            }
        },
        created() {
        	
        },
        mounted() {
        	//2+26城市列表数据
			this.GetSixParamCityRank();
			//京津冀城市列表数据
			this.GetSixParamCityRankJJ();
        },
        methods: {
        	//切换2+26城市、京津冀城市
        	handleClick(){
        		this.timevalue1 = '';
        		this.timevalue2 = '';
        		this.timevalue = '';
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
        	//2+26城市数据获取
        	GetSixParamCityRank(){
        		var type='';
        		var starttime='';
        		var endtime='';
				if(this.StatisticalRankingsName=='日报'){
					type = '0';
					endtime = $('.day01 input').val()?$('.day01 input').val():this.getYesterday();
					starttime = '';
				}
				if(this.StatisticalRankingsName=='月报'){
					type = '1';
					endtime = $('.day01 input').val()?$('.day01 input').val():this.getYesterday();
					starttime = '';
				}
				if(this.StatisticalRankingsName=='年报'){
					type = '2';
					endtime = $('.day01 input').val()?$('.day01 input').val():this.getYesterday();
					starttime = '';
				}
				if(this.StatisticalRankingsName=='自定义'){
					type = '3';
					starttime = $('.day02 input').val();
					endtime = $('.day03 input').val();
				}
        		api.GetSixParamCityRank(type,starttime,endtime).then(res=>{
        			console.log(res)
        			let t = this;
        			let allData = res.data.Data;
        			if(allData){
        				let stateData=[];
        				let proData=[];
        				allData.forEach(item=>{
        					if(item.Is226City){
        						stateData.push(item)
        					}
        				})
        				t.statePageData = [];
        				this.totalCountState = stateData.length;
		                stateData.sort(this.compare('Complexindex'));
		                this.deadStateData = stateData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	v['Name']=v.city;
		                	v['Com_Index']=v.Complexindex;
		                	v['PM25']=v.pm25;
		                	v['SO2']=v.so2;
		                	v['PM10']=v.pm10;
		                	v['NO2']=v.no2;
		                	v['CO']=v.co;
		                	v['O3']=v.o3;
		                	return v});
		                let i = 1;
		                stateData.forEach(item => {
		                    let tableData = {};//数据
		                    tableData.Ranking = item.Ranking;//排名
		                    tableData.Name = item.Name;//名称
		                    tableData.Com_Index = item.Com_Index;//综合指数
		                    tableData.PM25 = item.PM25;//Pm25
		                    tableData.SO2 = item.SO2;//SO2
		                    tableData.PM10 = item.PM10;//PM10
		                    tableData.NO2 = item.NO2;//NO2
		                    tableData.CO = item.CO;//CO
		                    tableData.O3 = item.O3;//O3
		                    t.statePageData.push(tableData);
		                })
//		                this.setStatePageTable(10, this.page);
        			}
        		})
        	},
        	//京津冀城市数据获取
        	GetSixParamCityRankJJ(){
        		var type='';
        		var starttime='';
        		var endtime='';
				if(this.ProStatisticalRankingsName=='日报'){
					type = '0';
					endtime = $('.day01 input').val();
					starttime = '';
				}
				if(this.ProStatisticalRankingsName=='月报'){
					type = '1';
					endtime = $('.day01 input').val();
					starttime = '';
				}
				if(this.ProStatisticalRankingsName=='年报'){
					type = '2';
					endtime = $('.day01 input').val();
					starttime = '';
				}
				if(this.ProStatisticalRankingsName=='自定义'){
					type = '3';
					starttime = $('.day02 input').val();
					endtime = $('.day03 input').val();
				}
        		api.GetSixParamCityRank(type,starttime,endtime).then(res=>{
        			console.log(res)
        			let t = this;
        			let allData = res.data.Data;
        			if(allData){
        				let stateData=[];
        				let proData=[];
        				allData.forEach(item=>{
        					if(item.IsJjjCity){
        						proData.push(item)
        					}
        				})
		                this.totalCount = proData.length;
		                this.totalCounts = proData.length;
		                proData.sort(this.compare('Complexindex'));
		                this.deadProData = proData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	v['Name']=v.city;
		                	v['Com_Index']=v.Complexindex;
		                	v['PM25']=v.pm25;
		                	v['SO2']=v.so2;
		                	v['PM10']=v.pm10;
		                	v['NO2']=v.no2;
		                	v['CO']=v.co;
		                	v['O3']=v.o3;
		                	return v});
		                let j = 1;
		                t.CityData = [];
		                proData.forEach(item => {
		                    let tableData = {};//数据
		                    tableData.Ranking = item.Ranking;//排名
		                    tableData.Name = item.Name;//名称
		                    tableData.Com_Index = item.Com_Index;//综合指数
		                    tableData.PM25 = item.PM25;//Pm25
		                    tableData.SO2 = item.SO2;//SO2
		                    tableData.PM10 = item.PM10;//PM10
		                    tableData.NO2 = item.NO2;//NO2
		                    tableData.CO = item.CO;//CO
		                    tableData.O3 = item.O3;//O3
		                    t.CityData.push(tableData);
		                })
//		                this.setPageTable(10, this.pageIndex);
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
            //2+26城市排序
            StatesortChange(column, prop, order){
            	if(column.prop=='Com_Index'){
        			//倒序
	        		if(column.order=='descending'){
	        			var [ ...deadStateData2 ] = this.deadStateData;
						this.statePageData=deadStateData2.sort(this.compare('Com_Index'));
						this.statePageData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}
               		//正序
	        		if(column.order=='ascending'){
	        			var [ ...deadStateData3 ] = this.deadStateData;
						this.statePageData=deadStateData3.sort(this.compare('Com_Index')).reverse();
						console.log(this.CityData);
						this.statePageData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}	
        			this.setStatePageTable(10, this.page);
        		}
        		if(column.prop=='O3'){
        			//倒序
	        		if(column.order=='descending'){
	        			var [ ...deadStateData4 ] = this.deadStateData;
						this.statePageData=deadStateData4.sort(this.compare('O3'));
						this.statePageData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}
               		//正序
	        		if(column.order=='ascending'){
	        			var [ ...deadStateData5 ] = this.deadStateData;
						this.statePageData=deadStateData5.sort(this.compare('O3')).reverse();
						this.statePageData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}	
        			this.setStatePageTable(10, this.page);
        		}
        		if(column.prop=='CO'){
        			//倒序
	        		if(column.order=='descending'){
	        			var [ ...deadStateData6 ] = this.deadStateData;
						this.statePageData=deadStateData6.sort(this.compare('CO'));
						this.statePageData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}
               		//正序
	        		if(column.order=='ascending'){
	        			var [ ...deadStateData7 ] = this.deadStateData;
						this.statePageData=deadStateData7.sort(this.compare('CO')).reverse();
						this.statePageData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}	
        			this.setStatePageTable(10, this.page);
        		}
        		if(column.prop=='NO2'){
        			//倒序
	        		if(column.order=='descending'){
	        			var [ ...deadStateData8 ] = this.deadStateData;
						this.statePageData=deadStateData8.sort(this.compare('NO2'));
						this.statePageData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}
               		//正序
	        		if(column.order=='ascending'){
	        			var [ ...deadStateData9 ] = this.deadStateData;
						this.statePageData=deadStateData9.sort(this.compare('NO2')).reverse();
						this.statePageData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}	
        			this.setStatePageTable(10, this.page);
        		}
        		if(column.prop=='SO2'){
        			//倒序
	        		if(column.order=='descending'){
	        			var [ ...deadStateData10 ] = this.deadStateData;
						this.statePageData=deadStateData10.sort(this.compare('SO2'));
						this.statePageData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}
               		//正序
	        		if(column.order=='ascending'){
	        			var [ ...deadStateData11 ] = this.deadStateData;
						this.statePageData=deadStateData11.sort(this.compare('SO2')).reverse();
						this.statePageData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}	
        			this.setStatePageTable(10, this.page);
        		}
        		if(column.prop=='PM10'){
        			//倒序
	        		if(column.order=='descending'){
	        			var [ ...deadStateData12 ] = this.deadStateData;
						this.statePageData=deadStateData12.sort(this.compare('PM10'));
						this.statePageData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}
               		//正序
	        		if(column.order=='ascending'){
	        			var [ ...deadStateData13 ] = this.deadStateData;
						this.statePageData=deadStateData13.sort(this.compare('PM10')).reverse();
						this.statePageData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}	
        			this.setStatePageTable(10, this.page);
        		}
        		if(column.prop=='PM25'){
        			//倒序
	        		if(column.order=='descending'){
	        			var [ ...deadStateData14 ] = this.deadStateData;
						this.statePageData=deadStateData14.sort(this.compare('PM25'));
						this.statePageData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}
               		//正序
	        		if(column.order=='ascending'){
	        			var [ ...deadStateData15 ] = this.deadStateData;
						this.statePageData=deadStateData15.sort(this.compare('PM25')).reverse();
						this.statePageData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}	
        			this.setStatePageTable(10, this.page);
        		}
            },
            //京津冀城市排序
            sortChange(column, prop, order){
        		if(column.prop=='Com_Index'){
        			//倒序
	        		if(column.order=='descending'){
	        			var [ ...deadProData2 ] = this.deadProData;
						this.CityData=deadProData2.sort(this.compare('Com_Index'));
						this.CityData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}
               		//正序
	        		if(column.order=='ascending'){
	        			var [ ...deadProData3 ] = this.deadProData;
						this.CityData=deadProData3.sort(this.compare('Com_Index')).reverse();
						this.CityData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}	
        			this.setPageTable(10, this.pageIndex);
        		}
        		if(column.prop=='O3'){
        			//倒序
	        		if(column.order=='descending'){
	        			var [ ...deadProData4 ] = this.deadProData;
						this.CityData=deadProData4.sort(this.compare('O3'));
						this.CityData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}
               		//正序
	        		if(column.order=='ascending'){
	        			var [ ...deadProData5 ] = this.deadProData;
						this.CityData=deadProData5.sort(this.compare('O3')).reverse();
						this.CityData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}	
        			this.setPageTable(10, this.pageIndex);
        		}
        		if(column.prop=='CO'){
        			//倒序
	        		if(column.order=='descending'){
	        			var [ ...deadProData6 ] = this.deadProData;
						this.CityData=deadProData6.sort(this.compare('CO'));
						this.CityData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}
               		//正序
	        		if(column.order=='ascending'){
	        			var [ ...deadProData7 ] = this.deadProData;
						this.CityData=deadProData7.sort(this.compare('CO')).reverse();
						this.CityData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}	
        			this.setPageTable(10, this.pageIndex);
        		}
        		if(column.prop=='NO2'){
        			//倒序
	        		if(column.order=='descending'){
	        			var [ ...deadProData8 ] = this.deadProData;
						this.CityData=deadProData8.sort(this.compare('NO2'));
						this.CityData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}
               		//正序
	        		if(column.order=='ascending'){
	        			var [ ...deadProData9 ] = this.deadProData;
						this.CityData=deadProData9.sort(this.compare('NO2')).reverse();
						this.CityData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}	
        			this.setPageTable(10, this.pageIndex);
        		}
        		if(column.prop=='SO2'){
        			//倒序
	        		if(column.order=='descending'){
	        			var [ ...deadProData10 ] = this.deadProData;
						this.CityData=deadProData10.sort(this.compare('SO2'));
						this.CityData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}
               		//正序
	        		if(column.order=='ascending'){
	        			var [ ...deadProData11 ] = this.deadProData;
						this.CityData=deadProData11.sort(this.compare('SO2')).reverse();
						this.CityData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}	
        			this.setPageTable(10, this.pageIndex);
        		}
        		if(column.prop=='PM10'){
        			//倒序
	        		if(column.order=='descending'){
	        			var [ ...deadProData12 ] = this.deadProData;
						this.CityData=deadProData12.sort(this.compare('PM10'));
						this.CityData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}
               		//正序
	        		if(column.order=='ascending'){
	        			var [ ...deadProData13 ] = this.deadProData;
						this.CityData=deadProData13.sort(this.compare('PM10')).reverse();
						this.CityData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}	
        			this.setPageTable(10, this.pageIndex);
        		}
        		if(column.prop=='PM25'){
        			//倒序
	        		if(column.order=='descending'){
	        			var [ ...deadProData14 ] = this.deadProData;
						this.CityData=deadProData14.sort(this.compare('PM25'));
						this.CityData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}
               		//正序
	        		if(column.order=='ascending'){
	        			var [ ...deadProData15 ] = this.deadProData;
						this.CityData=deadProData15.sort(this.compare('PM25')).reverse();
						this.CityData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	return v
						})
	        		}	
        			this.setPageTable(10, this.pageIndex);
        		}
        		
        	},
            //每页显示数据量变更
            handleSizeChange(val) {
            },
            //2+26城市点击页码换页
            handleCurrentChangeState(val) {
                this.setStatePageTable(10, val);
            },
            //京津冀城市点击页码换页
            handleCurrentChange(val) {
                this.setPageTable(10, val);
            },
            //京津冀城市分页数据
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
            //2+26城市分页数据
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

    .CityRankings {
        width: 100%;
        height: auto;
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
                    text-align: left;
                    border-bottom: solid 1px #ccc;
                    width: 100%;
                    height: 40px;
                    margin-top: 10px;
                    margin-bottom: 20px;
                    margin-left: 10px;
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
