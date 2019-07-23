<template>
    <div class="SixParamRange">
        <!--六参数排名-->
        <v-header></v-header>
        <!---->
        <div class="warp3">
            <el-tabs v-model="TitleName" @tab-click="handleClick">
                <el-tab-pane label="六参数排名" name="first">
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
                            <el-radio-group v-model="StatisticalRankingsName" @change='GetSixParamDayRank'>
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
                            <el-button type="primary" @click='GetSixParamDayRank'>查询</el-button>
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
                                    label="名称">
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
        name: 'SixParamRange',
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
                //查询条件
                StatisticalRankingsName: '日报',
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
		        //国控点
		        page:1,
		        tableStateData:[],
		        timevalue2:'',
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
            
        },
        mounted() {
			this.GetSixParamDayRank();
        },
        methods: {
        	//导出
        	conExport(){
        		let type;
        		let starttime;
        		let endtime;
        		let fl = '';
        		if(this.ExportOption=='日数据'){
        			type=0;
        			starttime = this.timeDayStart;
        			endtime = this.timeDayEnd;
        		}else{
        			type=1;
        			starttime = this.timeHourStart;
        			endtime = this.timeHourEnd;
        		}
        		api.GetSixParamAirExcelOutPut(type,starttime,endtime,fl);
        		this.isExport = false;
        	},
        	handleClick(){
        		this.timevalue1 = '';
        		this.timevalue2 = '';
        		this.timevalue = '';
        	},
        	//数据获取
        	GetSixParamDayRank(){
        		var type='';
        		var starttime='';
        		var endtime='';
				if(this.StatisticalRankingsName=='日报'){
					type = '0';
					endtime = $('.day01 input').val();
					starttime= '';
				}
				if(this.StatisticalRankingsName=='月报'){
					type = '1';
					endtime = $('.day01 input').val();
					starttime = '';
				}
				if(this.StatisticalRankingsName=='年报'){
					type = '2';
					endtime = $('.day01 input').val();
					starttime = '';
				}
				if(this.StatisticalRankingsName=='自定义'){
					type = '3';
					starttime = $('.day02 input').val();
					endtime = $('.day03 input').val();
				}
        		api.GetSixParamDayRank(type,starttime,endtime).then(res=>{
        			console.log(res)
        			let t = this;
        			let stateData = [];
        			if(res.status==200){
        				stateData = res.data.Data;
        				t.statePageData = [];
        				this.totalCountState = stateData.length;
		                stateData.sort(this.compare('Complexindex'));
		                this.deadStateData = stateData.map((v,i)=>{
		                	v['Ranking']=i+1;
		                	v['Name']=v.stationname;
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
		                    let tableData = {};//实时数据
		                    tableData.Ranking = item.Ranking;//排名
		                   tableData.Name = item.Name;//名称
		                    tableData.Com_Index = item.Com_Index;//综合指数
		                    tableData.PM25 = item.PM25;//Pm25
		                    tableData.SO2 = item.SO2;//SO2
		                    tableData.PM10 = item.PM10;//SO2
		                    tableData.NO2 = item.NO2;//SO2
		                    tableData.CO = item.CO;//SO2
		                    tableData.O3 = item.O3;//SO2
		                    t.statePageData.push(tableData);
		                })
		                this.setStatePageTable(10, this.page);
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
            //六参数排序
            StatesortChange(column, prop, order){
            	console.log(column)
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
						console.log(this.CityData);
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
						console.log(this.CityData);
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
            //每页显示数据量变更
            handleSizeChange(val) {
            },
            //点击页码换页
            handleCurrentChangeState(val) {
                this.setStatePageTable(10, val);
            },
            //分页数据
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

    .SixParamRange {
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
        /*//title标题*/
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
