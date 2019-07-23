<template>
    <div class="CityCheck">
        <!--乡镇考核-->
        <v-header></v-header>
        <!---->
        <div class="warp3">
            <el-tabs v-model="TitleName" @tab-click="">
                <el-tab-pane label="乡镇考核" name="first">
                    <div class="kass">
                        <div class="wbiaoti">
                            <a>查询条件</a>
                        </div>
                    </div>
                    <div class="chaxuntiaojian">
                        <div class="float001">
						    <el-date-picker
						      v-model="dateTime"
						      type="date"
						      placeholder="选择日期"
						      :picker-options="pickerOptions0">
						    </el-date-picker>
						  </div>
                        <el-button class="SearchBtn" type="primary" @click='GetAssessment'>查询</el-button>
                    </div>
                    <!---->
                    <div class="kass">
                        <div class="wbiaoti">
                            <a>筛选区域</a>
                        </div>
                    </div>
                    <!---->
                    <div class="chaxuntiaojian">
                        <div class="float001">
                            <el-radio-group v-model="TownshipScreeningName" @change='clickChangeData'>
                                <el-radio-button label="全市"></el-radio-button>
                                <el-radio-button label="区县"></el-radio-button>
                            </el-radio-group>
                        </div>
                       
                    </div>
                    <!--视图切换-->
                    <div class="shituquanshi" v-show="TownshipScreeningName=='全市'?true:false">
                    	<div class="kass">
	                        <div class="wbiaoti">
	                            <div class="legend">
	                            	<span class="circleRed"></span>连续进入倒排第十
                    				<span class="circleOrange"></span>单次进入倒排第十
	                            </div>
	                        </div>
	                    </div>
                        <div class="tubiao001">
                            <el-table
                                    :data="CityTableData"
                                    style="width: 100%">
                                <el-table-column
                                        prop="Range"
                                        label="倒排"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="Name"
                                        label="乡镇"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="Com_Index"
                                        label="综合指数"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="Waring_Num"
                                        label="累计进入倒排第十次数"
                                >
                                </el-table-column>
                                <el-table-column align="center" label="预警状态">
								    <template scope="scope">
								      <span v-if="scope.row.Waring_Num>'1'" class="circleRed"></span>
								      <span v-if="scope.row.Waring_Num=='1'" class="circleOrange"></span>
								    </template>
								</el-table-column>
                                <el-table-column
							      	label="操作"
							      	width="">
							      	<template scope="scope">
							      		<el-popover
							      			:disabled="!scope.row.Waring_Num"
											placement="right"
											width="100%"
											trigger="click">
											<el-table :data="gridData">
											    <el-table-column width="150" property="Name" label="乡镇"></el-table-column>
											    <el-table-column width="100" property="Rank_Num" label="倒排详情"></el-table-column>
											    <el-table-column width="300" property="Com_Index" label="综合指数"></el-table-column>
											</el-table>
											<el-button @click="handleClick(scope.row)" :class="{hasColor:!scope.row.Waring_Num}" type="text" size="small" slot="reference">详情</el-button>
										</el-popover>
			      					</template>
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
                            <!--<div class="genduo"  @click="GetAssessment">更多</div>-->
                        </div>
                    </div>
                    <div class="shituquxian" v-show="TownshipScreeningName=='区县'?true:false">
                        <div class="kass">
	                        <div class="wbiaoti">
	                            <a>北部县区</a>
	                            <div class="legend">
	                            	<span class="circleRed"></span>连续进入倒排第三
                    				<span class="circleOrange"></span>单次进入倒排第三
	                            </div>
	                        </div>
	                    </div>
                        <div class="tubiao001">
                            <el-table
                                    :data="NorTableData"
                                    style="width: 100%">
                                <el-table-column
                                        prop="Range"
                                        label="倒排"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="Name"
                                        label="乡镇"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="Com_Index"
                                        label="综合指数"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="Waring_Num"
                                        label="累计进入倒排第三次数"
                                >
                                </el-table-column>
                                <el-table-column align="center" label="预警状态" width="">
								    <template scope="scope">
								      <span v-if="scope.row.Waring_Num>'1'" class="circleRed"></span>
								      <span v-if="scope.row.Waring_Num=='1'" class="circleOrange"></span>
								    </template>
								</el-table-column>
                                <el-table-column
							      	label="操作"
							      	width="100">
							      	<template scope="scope">
							      		<el-popover
							      			:disabled="!scope.row.Waring_Num"
											placement="right"
											width="100%"
											trigger="click">
											<el-table :data="gridData">
											    <el-table-column width="150" property="Name" label="乡镇"></el-table-column>
											    <el-table-column width="100" property="Rank_Num" label="倒排详情"></el-table-column>
											    <el-table-column width="300" property="Com_Index" label="综合指数"></el-table-column>
											</el-table>
											<el-button @click="handleClick(scope.row)" :class="{hasColor:!scope.row.Waring_Num}" type="text" size="small" slot="reference">详情</el-button>
										</el-popover>
			      					</template>
								</el-table-column>
                            </el-table>
                            <!--分页-->
	                        <div class="block">
	                            <el-pagination
									background
									@size-change=""
                                   	@current-change="handleCurrentChangeNor"
                                  	:current-page="currentPage"
                                   	:page-size="pagesize"
                                   	layout="total, prev, pager, next, jumper"
                                   	:total="totalCountNor">
	                            </el-pagination>
	                        </div>
                            <!--<div class="genduo">更多</div>-->
                        </div>
                    	<div class="kass">
	                        <div class="wbiaoti">
	                            <a>中部县区</a>
	                        </div>
	                    </div>
                        <div class="tubiao001">
                            <el-table
                                    :data="MidTableData"
                                    style="width: 100%">
                                <el-table-column
                                        prop="Range"
                                        label="倒排"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="Name"
                                        label="乡镇"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="Com_Index"
                                        label="综合指数"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="Waring_Num"
                                        label="累计进入倒排第三次数"
                                >
                                </el-table-column>
                                <el-table-column align="center" label="预警状态">
								    <template scope="scope">
								      <span v-if="scope.row.Waring_Num>'1'" class="circleRed"></span>
								      <span v-if="scope.row.Waring_Num=='1'" class="circleOrange"></span>
								    </template>
								</el-table-column>
                                <el-table-column
							      	label="操作"
							      	width="100">
							      	<template scope="scope">
							      		<el-popover
							      			:disabled="!scope.row.Waring_Num"
											placement="right"
											width="100%"
											trigger="click">
											<el-table :data="gridData">
											    <el-table-column width="150" property="Name" label="乡镇"></el-table-column>
											    <el-table-column width="100" property="Rank_Num" label="倒排详情"></el-table-column>
											    <el-table-column width="300" property="Com_Index" label="综合指数"></el-table-column>
											</el-table>
											<el-button @click="handleClick(scope.row)" :class="{hasColor:!scope.row.Waring_Num}" type="text" size="small" slot="reference">详情</el-button>
										</el-popover>
			      					</template>
								</el-table-column>
                            </el-table>
                            <!--分页-->
	                        <div class="block">
	                            <el-pagination
									background
									@size-change=""
                                   	@current-change="handleCurrentChangeMid"
                                  	:current-page="currentPage"
                                   	:page-size="pagesize"
                                   	layout="total, prev, pager, next, jumper"
                                   	:total="totalCountMid">
	                            </el-pagination>
	                        </div>
                            <!--<div class="genduo">更多</div>-->
                        </div>
                    	<div class="kass">
	                        <div class="wbiaoti">
	                            <a>南部县区</a>
	                        </div>
	                    </div>
                        <div class="tubiao001">
                            <el-table
                                    :data="SouTableData"
                                    style="width: 100%">
                                <el-table-column
                                        prop="Range"
                                        label="倒排"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="Name"
                                        label="乡镇"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="Com_Index"
                                        label="综合指数"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="Waring_Num"
                                        label="累计进入倒排第三次数"
                                >
                                </el-table-column>
                                <el-table-column align="center" label="预警状态">
								    <template scope="scope">
								      <span v-if="scope.row.Waring_Num>'1'" class="circleRed"></span>
								      <span v-if="scope.row.Waring_Num=='1'" class="circleOrange"></span>
								    </template>
								</el-table-column>
                                <el-table-column
							      	label="操作"
							      	width="100">
							      	<template scope="scope">
							      		<el-popover
							      			:disabled="!scope.row.Waring_Num"
											placement="right"
											width="100%"
											trigger="click">
											<el-table :data="gridData">
											    <el-table-column width="150" property="Name" label="乡镇"></el-table-column>
											    <el-table-column width="100" property="Rank_Num" label="倒排详情"></el-table-column>
											    <el-table-column width="300" property="Com_Index" label="综合指数"></el-table-column>
											</el-table>
											<el-button @click="handleClick(scope.row)" :class="{hasColor:!scope.row.Waring_Num}" type="text" size="small" slot="reference">详情</el-button>
										</el-popover>
			      					</template>
								</el-table-column>
                            </el-table>
                             <!--分页-->
	                        <div class="block">
	                            <el-pagination
									background
									@size-change=""
                                   	@current-change="handleCurrentChangeSou"
                                  	:current-page="currentPage"
                                   	:page-size="pagesize"
                                   	layout="total, prev, pager, next, jumper"
                                   	:total="totalCountSou">
	                            </el-pagination>
	                        </div>
                            <!--<div class="genduo">更多</div>-->
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
        name: 'CityCheck',
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
                pagesizeNor: 10,
                //
                currentPage: 1,
                currentPageNor: 1,
                //数据量/分页
                totalCount: 1000,
                totalCountNor:100,
                totalCountMid:100,
                totalCountSou:100,
                //页面大标题
                TitleName: 'first',
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
                WholeCityData: [],
                CityTableData:[],
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
                gridData: [],
                //选择日期
                dateTime:'',
                //全市
                isQuarter:true,
                //
                page:1,
                //北部县区
                NorthData:[],
                NorTableData:[],//北部县区列表数据
                //中部县区
                MiddleData:[],
                MidTableData:[],//中部县区列表数据
                //南部县区
                SouthData:[],
                SouTableData:[],//南部县区列表数据
            }
        },
        created() {
        	
        },
        mounted() {
			this.GetAssessment();
        },
        methods: {
        	//获取乡镇考核数据
        	GetAssessment(){
        		switch (this.TownshipScreeningName){
        			case '全市':
        				this.isQuarter = true;
        			break;
        			case '区县':
        				this.isQuarter = false;
        			break;
        			default:
        			break;
        		}
        		let t = this;
        		let Time = $('.el-input__inner').val();
        		let isQuarter = this.isQuarter;
        		t.WholeCityData = [];
        		api.GetAssessment(Time,isQuarter).then(res=>{
        			let i = 1;
        			if(res&&isQuarter){
        				let allData = res.data.Data;
        				this.totalCount = allData.length;
                    	this.totalCounts = allData.length;
        				allData.forEach(item=>{
        					let table = {};
        					table.Range = i++;
        					table.Com_Index = item.Com_Index;
   							table.list = item.list;
   							table.Name = item.Name;
   							table.Waring_Num = item.Waring_Num;
   							t.WholeCityData.push(table);
        				})
        			}
        			this.setPageTable(10, 1);
        			if(res&&!isQuarter){
        				let allData = res.data.Data;
        				t.NorthData = [];
	           			t.MiddleData = [];
	           			t.SouthData = [];
	           			let NData = [];
	           			let MData = [];
	           			let SData = [];
	           			let i = 1;
	           			let j = 1;
	           			let k = 1;
//      				this.totalCount = allData.length;
//                  	this.totalCounts = allData.length;
//						console.log(allData)
        				allData.forEach(item=>{
        					if(item.Region == '北部县区'){
								NData.push(item)
           					}
           					if(item.Region == '中部县区'){
								MData.push(item)
           					}
           					if(item.Region == '南部县区'){
								SData.push(item)
           					}
//	           				item.group == '市区组'&&t.shiQuData.push(item);
//	           				item.group == '环京县(市)组'&&t.huanJingData.push(item);
//	           				item.group == '南部县(市)'&&t.nanBuData.push(item);
           				})
        				this.totalCountNor = NData.length;
           				NData.forEach(item=>{
       						let table = {};
   							table.Range = i++;
   							table.Com_Index = item.Com_Index;
   							table.list = item.list;
   							table.Name = item.Name;
   							table.Waring_Num = item.Waring_Num;
   							t.NorthData.push(table);
       					});
       					this.setPageTableNor(10, 1);
       					this.totalCountMid = MData.length;
       					MData.forEach(item=>{
       						let tableHuan = {};
   							tableHuan.Range = j++;
   							tableHuan.Com_Index = item.Com_Index;
   							tableHuan.list = item.list;
   							tableHuan.Name = item.Name;
   							tableHuan.Waring_Num = item.Waring_Num;
   							t.MiddleData.push(tableHuan);
       					})
       					this.setPageTableMid(10, 1);
       					this.totalCountSou = SData.length;
       					SData.forEach(item=>{
       						let tableNan = {};
   							tableNan.Range = k++;
   							tableNan.Com_Index = item.Com_Index;
   							tableNan.list = item.list;
   							tableNan.Name = item.Name;
   							tableNan.Waring_Num = item.Waring_Num;
   							t.SouthData.push(tableNan);
       					})
        				this.setPageTableSou(10, 1);
        			}
        		})
        	},
        	//详情
	        handleClick(row) {
	        	this.gridData = [];
	        	this.gridData = row.list.map(v=>{v['Rank_Num'] = v['Time']+"月倒排第"+v['Rank_Num'];v['Name'] = row.Name;return v});
//	        	console.log(this.gridData)
      		},
            clickChangeData() {
               	this.GetAssessment();
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
            //每页显示数据量变更
            handleSizeChange(val) {
            },
            //点击页码换页
            handleCurrentChange(val) {
                this.setPageTable(10, val);
            },
            handleCurrentChangeNor(val) {
                this.setPageTableNor(10, val);
            },
            //中部点击页码换页
            handleCurrentChangeMid(val) {
                this.setPageTableMid(10, val);
            },
            //南部点击页码换页
            handleCurrentChangeSou(val) {
                this.setPageTableSou(10, val);
            },
            //分页数据
            setPageTable(pageSize, pageNum) {
                let i = 1;
                let rtValue = [];
                let startNum = pageSize * (pageNum - 1);
                for (let i = 0; i < pageSize; i++) {
                    if ((startNum + i + 1) > this.WholeCityData.length)
                        break;
                    rtValue.push(this.WholeCityData[startNum + i]);
                }
                this.CityTableData = rtValue;
            },
            //中部分页数据
            setPageTableMid(pageSize, pageNum) {
                let i = 1;
                let rtValue = [];
                let startNum = pageSize * (pageNum - 1);
                for (let i = 0; i < pageSize; i++) {
                    if ((startNum + i + 1) > this.MiddleData.length)
                        break;
                    rtValue.push(this.MiddleData[startNum + i]);
                }
                this.MidTableData = rtValue;
            },
            //北部分页数据
            setPageTableNor(pageSize, pageNum) {
                let i = 1;
                let rtValue = [];
                let startNum = pageSize * (pageNum - 1);
                for (let i = 0; i < pageSize; i++) {
                    if ((startNum + i + 1) > this.NorthData.length)
                        break;
                    rtValue.push(this.NorthData[startNum + i]);
                }
                this.NorTableData = rtValue;
            },
            //南部分页数据
            setPageTableSou(pageSize, pageNum) {
                let i = 1;
                let rtValue = [];
                let startNum = pageSize * (pageNum - 1);
                for (let i = 0; i < pageSize; i++) {
                    if ((startNum + i + 1) > this.SouthData.length)
                        break;
                    rtValue.push(this.SouthData[startNum + i]);
                }
                this.SouTableData = rtValue;
            },
        },
        components: {}
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
	.hasColor{
		color: #c1c1c1;
	}
    .CityCheck {
        width: 100%;
        height: auto;
        //title标题
         /*红圆*/
        .circleRed{
    		display: inline-block;
    		width: 10px;
    		height: 10px;
    		border-radius: 5px;
    		background: red;
    	}
    	/*橙圆*/
    	.circleOrange{
    		display: inline-block;
    		width: 10px;
    		height: 10px;
    		border-radius: 5px;
    		background: orange;
    	}
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
                    .legend{
                    	float: right;
                    	margin-right: 30px;
                    	.circleRed{
                    		display: inline-block;
                    		width: 10px;
                    		height: 10px;
                    		border-radius: 5px;
                    		background: red;
                    	}
                    	.circleOrange{
                    		display: inline-block;
                    		width: 10px;
                    		height: 10px;
                    		border-radius: 5px;
                    		background: orange;
                    		margin-left: 20px;
                    	}
                    }
                    text-align: left;
                    border-bottom: solid 1px #ccc;
                    width: 100%;
                    height: 40px;
                    line-height: 40px;
                    margin-top: 10px;
                    margin-bottom: 20px;
                    margin-left: 10px;
                }
            }
            .chaxuntiaojian {
                width: 100%;
                height: 50px;
                .float001 {
                	margin-left: 20px;
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
                .SearchBtn{
                	float: left;
                	margin-left: 20px;
                }
            }

        }
    }
</style>
