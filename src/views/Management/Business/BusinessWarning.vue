<!--后台管理-业务数据管理-->
<template>
    <div class="businessmanagement">
		<!--------------预警信息右侧数据展示------>
		<div id="right">
			<!----------预警信息管理-->
			<div class="box">
                <div class="warning">
                    <a>预警信息管理</a>
                </div>
            </div>
            <!-----------查询部分------->
			<div class="search">
				<div class="searchBox">
				    <span>预警级别</span>
				    <el-select v-model="value1" clearable placeholder="请选择">
				        <el-option
				          v-for="item in options"
				          :key="item.value"
				      	  :label="item.label"
				          :value="item.value">
				        </el-option>
				    </el-select>
				</div>
				<div class="block" style="">
				    <span class="demonstration">预警发布时间</span>
				    <el-date-picker
				      v-model="value2"
				      type="datetime"
				      placeholder="选择日期时间"
				      @change='startChange'>
				    </el-date-picker>
				    -
				    <el-date-picker
				      v-model="value3"
				      type="datetime"
				      placeholder="选择日期时间"
				      @change='endChange'>
				    </el-date-picker>
				</div>
				<el-button type="primary" class='btns' @click='SearchNotice'>查询</el-button>
				<el-button type="primary" class='btns' @click="openWin">新建预警信息</el-button>
			</div>
			
			<!--------------列表部分---------->
			<div class="box">
                <div class="warning">
                    <a>列表</a>
                </div>
            </div>
            <el-table
			    :data="tableData"
			    style="width: 100%">
			    <el-table-column
			      prop="Warning"
			      label="预警级别"
			      width="200">
			    </el-table-column>
			    <el-table-column
			      prop="Content"
			      label="预警内容"
			      width="350">
			    </el-table-column>
			    <el-table-column
			      prop="BeginTime"
			      label="预警发布时间"
			      width="">
			    </el-table-column>
			    <el-table-column
			      prop="EndTime"
			      label="预警结束时间"
			      width="">
			    </el-table-column>
			    <el-table-column
			      label="操作"
			      width="200">
			      <template scope="scope">
			        <el-button @click="handleClick(scope.row)" type="text" size="small" class='eidt'>编辑</el-button>
			        <span style="color: #eee;">|</span>
			        <span class="OverBox">
			        	<el-button v-if='scope.row.IsEnd' @click="" type="text" size="small" class='noeidt'>结束</el-button>
			        	<el-button v-else @click="clickEnd(scope.row)" type="text" size="small" class='eidt'>结束</el-button>
			        </span>
			      </template>
			    </el-table-column>
			</el-table>
		   	<div class="page" style="">
			    <span class="demonstration">共找到{{totalCount}}条记录</span>
			    <el-pagination
						background
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="currentPage"
			      :page-size="pagesize"
			      layout="prev, pager, next, jumper"
			      :total="totalCount">
			    </el-pagination>
			</div>
			<!--------------弹框部分--------------->
			<div class="popUp" v-if="isNew">
	            <div class="mask"></div>
	            <div class="succ-pop">
	                <div class="title">
	                    <a id="newCreate">{{title}}</a>
	                    <div class="el-icon-close" @click="closeWin"></div>
	                </div>
	                <div class="content">
                		<div class="" style="margin-left: 38px;">
						    <span>预警级别</span>
						    <el-select v-model="value4" clearable placeholder="请选择">
						        <el-option
						          v-for="item in options"
						          :key="item.value"
						          :label="item.label"
						          :value="item.value">
						    	</el-option>
						    </el-select>
						</div>
						<div class="" style="overflow: hidden;">
							<div class="block" style="margin: 20px 0;float: left;">
							    <span class="demonstration"><span style="color: red;margin-right: 5px;">*</span>预警发布时间</span>
							    <el-date-picker
							      v-model="value5"
							      type="datetime"
							      placeholder="选择日期时间"
							      @change='startChange'
						          format="yyyy-MM-dd HH:mm:ss"
						          value-format="yyyy-MM-dd HH:mm:ss">
							    </el-date-picker>
						  	</div>
						  	<div class="block" style="margin: 20px 0;float: right;">
							    <span class="demonstration">预警结束时间</span>
							    <el-date-picker
							      v-model="value6"
							      type="datetime"
							      placeholder="选择日期时间"
							      @change='endChange'
						      	  format="yyyy-MM-dd HH:mm:ss"
						          value-format="yyyy-MM-dd HH:mm:ss">
							    </el-date-picker>
						  	</div>
					  	</div>
					  	<div>
					  		<span style="float: left;
margin-left: 26px;"><span style="color: red;margin-right: 5px;">*</span>预警内容</span>
						  	<el-input
								type="textarea"
								:rows="8"
								required
								placeholder="请输入内容"
								v-model="textarea">
							</el-input>
						</div>
						<el-row style='position: absolute;bottom: 40px;right: 30px;'>
							<el-button type="primary" @click='NewOrEdit(title,Id)'>发布</el-button>
							<el-button plain @click='closeWin'>取消</el-button>
						</el-row>
	               </div>
	            </div>
	        </div>
		</div>
    </div>
</template>

<script>
    import {Message} from 'element-ui';
    import api from '../../../api/index'
    export default {
        name: 'businessmanagement',
        data() {
            return {
            	//预警状态
               options: [{
		          value: '蓝色预警',
		          label: '蓝色预警'
		        }, {
		          value: '红色预警',
		          label: '红色预警'
		        }, {
		          value: '黄色预警',
		          label: '黄色预警'
		        }, {
		          value: '橙色预警',
		          label: '橙色预警'
		        }],
		        value1: '',
		        value2: '',
		        value3: '',
		        value4: '',
		        value5: '',
		        value6: '',
		        tableData:[],
			    currentPage: 1,
			    pagesize:10,
			    isNew: false,
			    textarea: '',
			    title:'新建预警信息',
				//新建预警信息
				startTime:'',
				endTime:'',
				TotalRowsCount:null,
				totalCount:'',
				InfoData:[],
				ListData:[],
				Id:'',
				isend:false
            }
        },
        created(){
        	this.getNotice();
        },
        mounted() {
//      	window.onload = function(){
//      		$('.OverBox').click(function(e){
//	        		let ev = e || window.event;
//	　　　　			let target = ev.target || ev.srcElement;
//	        		$(target).css({'color':'#eee'});
//      		})
//      	}
        },
        computed: {
            
        },
        methods: {
        	///新建预警信息发布
        	publish(){
        		this.Insert();
        		
        		
        	},
            //预警发布时间选择
        	startChange(val){
        		this.startTime = val;
        	},
        	//预警结束时间选择
        	endChange(val){
        		this.endTime = val;
        	},
			//编辑
	        handleClick(row) {
	        	this.isEdit = true;
	        	if(this.isEdit){
	        		this.title = '编辑预警信息';
	        		this.value4 = row.Warning;
	        		this.value5 = row.BeginTime;
	        		this.value6 = row.EndTime;
	        		this.Id = row.Id;
	        		this.textarea = row.Content;
	        	}
	        	this.isNew = true;
      		},
      		//结束
      		clickEnd(row){
      			let t = this;
      			api.GetEmergencyEnd(row.Id).then(res=>{
      				if(res.data.Status ==1){
      					row.IsEnd = true;
      				}
      			})
      		},
      		//判断是新建还是编辑信息
      		NewOrEdit(title,id){
      			switch(title){
      				case '新建预警信息':
      					return this.publish();
      				break;
      				case '编辑预警信息':
      					return this.EditUpdate(id);
      				break;
      			}
      		},
      		//编辑发布
      		EditUpdate(id){
      			let t = this;
      			let WarningStatus = t.warningLevel(t.value4);
      			let BeginTime = t.value5;
      			let EndTime = t.value6;
      			let Content = t.textarea;
      			if(!BeginTime||!EndTime||!Content){
      				this.$message({
			          message: '必填项不可为空',
			          type: 'warning'
			        });
      			}else{
      					api.GetEmergencyInfoUpdate(id,WarningStatus,BeginTime,EndTime,Content).then(result=>{
						t.getNotice();
					});
					this.closeWin();
      			}
      			
      		},
      		//分页
      		 handleSizeChange(val) {
        		console.log(`每页 ${val} 条`);
      		},
      		handleCurrentChange(val) {
        		this.setPageTable(10, val);
      		},
      		openWin(){
      			this.isEdit = false;
      			this.title = '新建预警信息';
      			this.isNew = true;
      			this.value4 = '';
      			this.value5 = '';
      			this.value6 = '';
      			this.textarea = '';
      		},
      		closeWin(){
      			this.isNew = false;
      		},
      		//预警级别判断
      		warningLevel(val){
      			switch(val){
      				case '红色预警' :
      					return 1;
      				break;
      				case '橙色预警' :
      					return 2;
      				break;
      				case '黄色预警' :
      					return 4;
      				break;
      				case '蓝色预警' :
      					return 8;
      				break;
      			}
      		},
      		//新建预警信息点击发布
      		Insert(){
      			let t = this;
      			let WarningStatus = t.warningLevel(t.value4);
      			let BeginTime = t.startTime;
      			let EndTime = t.endTime;
      			let Content = t.textarea;
      			if(!BeginTime||!EndTime||!Content){
      				this.$message({
			          message: '必填项不可为空',
			          type: 'warning'
			        });
      			}else{
      					api.EmergencyInfoInsert(Content,WarningStatus,BeginTime,EndTime).then(result=>{
      					this.getNotice();
						this.closeWin();
					});
      			}
				
      		},
      		//查询
      		SearchNotice(){
				let t = this;
				let WarningStatus = '';
      			if(t.value1){
      				WarningStatus = t.warningLevel(t.value1);
      			}
      			let BeginTime = t.startTime;
      			let EndTime = t.endTime;
      			this.ListData = [];
				api.GetEmergencyInfoList(WarningStatus,BeginTime,EndTime).then(result=>{
					//console.log(result)
					let InfoData = result.data.Data.dataList;
					t.totalCount = InfoData.length;
					InfoData.forEach(item=>{
						let tableData = {};//预警信息列表
                        tableData.Content = item.Content;//预警内容
                        tableData.BeginTime = item.BeginTime.replace('T',' ');//预警发布时间
                        tableData.EndTime = item.EndTime.replace('T',' ');//预警结束时间
                        tableData.Warning = item.Warning;//预警等级
                        tableData.Id = item.Id;//预警信息id
                        t.ListData.push(tableData);
					})
					this.setPageTable(10, 1);
				});
      		},
      		//获取预警信息列表
      		getNotice(){
      			let t = this;
      			this.ListData = [];
      			api.GetEmergencyInfoList('','','').then(result=>{
					let InfoData = result.data.Data.dataList;
					console.log(InfoData)
					t.totalCount = InfoData.length;
					InfoData.sort(this.compare('BeginTime'));
					InfoData.forEach(item=>{
						let tableData = {};//预警信息列表
                        tableData.Content = item.Content;//预警内容
                        tableData.BeginTime = item.BeginTime.replace('T',' ');//预警发布时间
                        tableData.EndTime = item.EndTime.replace('T',' ');//预警结束时间
                        tableData.Warning = item.Warning;//预警等级
                        tableData.Id = item.Id;//预警信息id
                        tableData.IsEnd = item.IsEnd;//预警信息是否结束
                        t.ListData.push(tableData);
					})
					this.setPageTable(10, 1);
				});
      		},
      		//排序
            compare(propertyName) {
                return function (object1, object2) {
                    let value1 = Date.parse(object1[propertyName].replace('T',' '));//将日期对象转为时间戳
                    let value2 = Date.parse(object2[propertyName].replace('T',' '));
                    return value2 - value1
                }
            },
      		 //分页数据
            setPageTable(pageSize, pageNum) {
                let i = 1;
                let rtValue = [];
                let startNum = pageSize * (pageNum - 1);
                for (let i = 0; i < pageSize; i++) {
                    if ((startNum + i + 1) > this.ListData.length)
                        break;
                    rtValue.push(this.ListData[startNum + i]);
                }
                this.tableData = rtValue;
            },
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#right{
	width: calc(100% - 200px);
	overflow: hidden;
	padding: 20px;
	background-color: #f6fbff;
	.box {
        width: 100%;
        height: auto;
        .warning {
        	text-align: left;
            border-bottom: solid 1px #ccc;
            width: 100%;
            height: 40px;
            margin-top: 10px;
            margin-bottom: 20px;
            margin-left: 10px;
            a {
                display: inline-block;
                height: 20px;
                border-left: solid 3px #428bca;
                padding-left: 13px;
                font-size: 16px;
                line-height: 20px;
            }
        }
    }
    .search{
    	text-align: left;
    	margin-bottom: 24px;
    	.searchBox{
    		display: inline-block; 
    		margin-right: 20px;
    	}
    	.block{
    		display: inline-block;
    	}
    	.btns{
    		margin-left: 40px;
    	}
    }
    .page{
    	text-align: left;
    }
    .eidt{
		color: #000;
		:hover{
	    	color: #20a0ff;
	    	text-decoration: underline;
    	}
    }
    .noeidt{
    	color: #c1c1c1;
    }
    .InfoEnd{
    	color: #000;
    	:hover{
    		color: #BF3831;
	    	text-decoration: underline;
    	}
    }
    
    .el-pagination{
    	display: inline-block;
    	margin-left: 170px;
    	padding-bottom: 90px;
    }
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
        /*****弹出框内容********/
        .succ-pop {
            width: 718px;
            height: 486px;
            background: #fff;
            position: fixed;
            left: 50%;
            top: 50%;
            margin-left: -359px;
            margin-top: -243px;
            z-index: 999;
            border-radius: 10px;
            .title {
                width: 100%;
                height: 50px;
                line-height: 50px;
                text-align: left;
                border-bottom: 2px solid #3a90b3;
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
            	padding: 30px;
            	padding-top: 10px;
            	text-align: left;
            	.el-textarea{
					float: right;
					width: 558px;
				}
				
            }
            
        }
    }    
}
</style>
