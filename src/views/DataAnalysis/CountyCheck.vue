<template>
    <div class="AirStation">
        <!--区县考核-->
        <v-header></v-header>
        <!---->
        <div class="warp3">
            <el-tabs v-model="TitleName" @tab-click="">
                <el-tab-pane label="区县考核" name="first">
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
						      :picker-options="pickerOptions0"
						      class="SearchData">
						    </el-date-picker>
						  </div>
                        <el-button class="SearchBtn" type="primary" @click="GetMonthCheck">查询</el-button>
                    </div>
                 
                    <div class="shituquxian">
                        <div class="kass">
	                        <div class="wbiaoti">
	                            <a>市区组</a>
	                            <div class="legend">
	                            	<span class="circleRed"></span>连续进入倒排第一
                    				<span class="circleOrange"></span>单次进入倒排第一
	                            </div>
	                        </div>
	                    </div>
                        <div class="tubiao001">
                            <el-table
                                    :data="shiQuData"
                                    style="width: 100%">
                                <el-table-column
                                        prop="Range"
                                        label="倒排"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="gridname"
                                        label="县(市、区)"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="complexindex"
                                        label="综合指数"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="lastonetime"
                                        label="累计进入倒排第一次数"
                                >
                                </el-table-column>
                                <el-table-column align="center" label="预警状态">
								    <template scope="scope">
								      <span v-if="scope.row.lastonetime>'1'" class="circleRed"></span>
								      <span v-if="scope.row.lastonetime=='1'" class="circleOrange"></span>
								    </template>
								  </el-table-column>
                                <el-table-column
							      	label="操作"
							      	width="100">
							      	<template scope="scope">
							      		<el-popover
							      			:disabled="!scope.row.lastonetime"
											placement="right"
											width="100%"
											trigger="click"
											>
											<el-table :data="gridData">
											    <el-table-column width="150" property="gridname" label="乡镇"></el-table-column>
											    <el-table-column width="150" property="detail" label="倒排详情"></el-table-column>
											    <el-table-column width="150" property="complexindex" label="综合指数"></el-table-column>
											</el-table>
											<el-button @click="handleClick(scope.row)" type="text" size="small" slot="reference" :class="{hasColor:!scope.row.lastonetime}">详情</el-button>
										</el-popover>
			      					</template>
								</el-table-column>
                            </el-table>
                        </div>
                    	<div class="kass">
	                        <div class="wbiaoti">
	                            <a>环京县市组</a>
	                        </div>
	                    </div>
                        <div class="tubiao001">
                            <el-table
                                    :data="huanJingData"
                                    style="width: 100%">
                                <el-table-column
                                        prop="Range"
                                        label="倒排"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="gridname"
                                        label="县(市、区)"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="complexindex"
                                        label="综合指数"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="lastonetime"
                                        label="累计进入倒排第一次数"
                                >
                                </el-table-column>
                                <el-table-column align="center" label="预警状态">
								    <template scope="scope">
								      <span v-if="scope.row.lastonetime>'1'" class="circleRed"></span>
								      <span v-if="scope.row.lastonetime=='1'" class="circleOrange"></span>
								    </template>
								</el-table-column>
                                <el-table-column
							      	label="操作"
							      	width="100">
							      	<template scope="scope">
							      		<el-popover
							      			:disabled="!scope.row.lastonetime"
											placement="right"
											width="100%"
											trigger="click"
											>
											<el-table :data="gridData">
											    <el-table-column width="150" property="gridname" label="乡镇"></el-table-column>
											    <el-table-column width="150" property="detail" label="倒排详情"></el-table-column>
											    <el-table-column width="150" property="complexindex" label="综合指数"></el-table-column>
											</el-table>
											<el-button @click="handleClick(scope.row)" type="text" size="small" slot="reference" :class="{hasColor:!scope.row.lastonetime}">详情</el-button>
										</el-popover>
			      					</template>
								</el-table-column>
                            </el-table>
                        </div>
                    	<div class="kass">
	                        <div class="wbiaoti">
	                            <a>南部县市组</a>
	                        </div>
	                    </div>
                        <div class="tubiao001">
                            <el-table
                                    :data="nanBuData"
                                    style="width: 100%">
                                <el-table-column
                                        prop="Range"
                                        label="倒排"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="gridname"
                                        label="县(市、区)"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="complexindex"
                                        label="综合指数"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="lastonetime"
                                        label="累计进入倒排第一次数"
                                >
                                </el-table-column>
                                <el-table-column align="center" label="预警状态">
								    <template scope="scope">
								      <span v-if="scope.row.lastonetime>'1'" class="circleRed"></span>
								      <span v-if="scope.row.lastonetime=='1'" class="circleOrange"></span>
								    </template>
								</el-table-column>
                                <el-table-column
							      	label="操作"
							      	width="100">
							      	<template scope="scope">
							      		<el-popover
							      			:disabled="!scope.row.lastonetime"
											placement="right"
											width="100%"
											trigger="click">
											<el-table :data="gridData">
											    <el-table-column width="150" property="gridname" label="乡镇"></el-table-column>
											    <el-table-column width="150" property="detail" label="倒排详情"></el-table-column>
											    <el-table-column width="150" property="complexindex" label="综合指数"></el-table-column>
											</el-table>
											<el-button @click="handleClick(scope.row)" type="text" size="small" slot="reference" :class="{hasColor:!scope.row.lastonetime}">详情</el-button>
										</el-popover>
			      					</template>
								</el-table-column>
                            </el-table>
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
        name: 'AirStation',
        data() {
            return {
                pickerOptions0: {
//		            disabledDate(time) {
//		                return time.getTime() < Date.now() - 8.64e7;
//		            }
		        },
                fullscreenLoading: false,
                //页面大标题
                TitleName: 'first',
                //详情数据
                gridData: [],
                //市区组数据
                shiQuData:[],
                //环京县市组数据
                huanJingData:[],
                //南部县市组数据
                nanBuData:[],
                //选择日期
                dateTime:'',
            }
        },
        created() {
        },
        mounted() {
			this.GetMonthCheck();
			
        },
        methods: {
        	//详情
	        handleClick(row) {
//	        	console.log(row)
	        	this.gridData = [];
	        	this.gridData = row.details;
      		},
      		//获取区县考核列表数据
           	GetMonthCheck(){
				let time = $('.el-input__inner').val();
				//let time = '2018-06-04';
           		let t = this;
           		api.GetMonthCheck(time).then(res => {
           			let allData = res.data.Data;
           			t.shiQuData = [];
           			t.huanJingData = [];
           			t.nanBuData = [];
           			let shiData = [];
           			let huanData = [];
           			let nanData = [];
           			let i = 1;
           			let j = 1;
           			let k = 1;
           			if(allData){
           				allData.forEach(item=>{
           					if(item.group == '市区组'){
								shiData.push(item)
           					}
           					if(item.group == '环京县(市)组'){
								huanData.push(item)
           					}
           					if(item.group == '南部县(市)'){
								nanData.push(item)
           					}
           					
//	           				item.group == '市区组'&&t.shiQuData.push(item);
//	           				item.group == '环京县(市)组'&&t.huanJingData.push(item);
//	           				item.group == '南部县(市)'&&t.nanBuData.push(item);
           				})
           				shiData.forEach(item=>{
       						let table = {};
   							table.Range = i++;
   							table.complexindex = item.complexindex;
   							table.details = item.details;
   							table.gridname = item.gridname;
   							table.lastonetime = item.lastonetime;
   							t.shiQuData.push(table);
   							
       					});
       					huanData.forEach(item=>{
       						let tableHuan = {};
   							tableHuan.Range = j++;
   							tableHuan.complexindex = item.complexindex;
   							tableHuan.details = item.details;
   							tableHuan.gridname = item.gridname;
   							tableHuan.lastonetime = item.lastonetime;
   							t.huanJingData.push(tableHuan);
       					})
       					nanData.forEach(item=>{
       						let tableNan = {};
   							tableNan.Range = k++;
   							tableNan.complexindex = item.complexindex;
   							tableNan.details = item.details;
   							tableNan.gridname = item.gridname;
   							tableNan.lastonetime = item.lastonetime;
   							t.nanBuData.push(tableNan);
       					})
           			}
                })
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
    .AirStation {
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
