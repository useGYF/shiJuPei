<!--后台管理-业务数据管理-->
<template>
    <div class="businessmanagement">
		<!--------------预警信息右侧数据展示------>
		<div id="right">
			<!----------预警信息管理-->
			<div class="box">
                <div class="warning">
                    <a>日数据管理</a>
                </div>
            </div>
            <!-----------查询部分------->
			<div class="search" style="">
				<div class="block" style="">
				    <span class="demonstration">时间</span>
				    <el-date-picker
				      v-model="value2"
				      type="date"
				      value-format="yyyy-MM-dd"
				      placeholder="选择日期时间"
				      @change='startChange'>
				    </el-date-picker>
				    -
				    <el-date-picker
				      v-model="value3"
				      type="date"
				      value-format="yyyy-MM-dd"
				      placeholder="选择日期时间"
				      @change='endChange'>
				    </el-date-picker>
				</div>
				<div class="searchBox" style="">
				    <span>县(市、区)</span>
				    <el-select v-model="value1" @change="selectChange" clearable placeholder="请选择">
				        <el-option
				          v-for="item in options"
				          :key="item.value"
				      	  :label="item.gridName"
				          :value="item.gridName">
				        </el-option>
				    </el-select>
				</div>
				<el-button type="primary" class='btns' @click='GetMonitoringDay'>查询</el-button>
				<div class="InsertOrOut">
					<span>
						<img src="../../../../static/imgs/main/In.png"/>
						<a @click="OpenInsert">批量导入</a>
					</span>
					<span>
						<img src="../../../../static/imgs/main/Out.png"/>
						<a @click="ImportExel">Excel导出</a>
					</span>
				
				</div>
			</div>
			
			<!--------------列表部分---------->
			<div class="box">
                <div class="warning">
                    <a>列表</a>
                </div>
           </div>
           	<v-table
	            is-horizontal-resize
	            style="width:100%"
	            :columns="columns"
	            :table-data="tableData"
	            row-hover-color="#eee"
	            row-click-color="#edf7ff"
	            :cell-edit-done="cellEditDone"
    		></v-table>
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
			<!--------------提示弹框部分--------------->
			<div class="popUp" v-if="isConfirm">
	            <div class="mask"></div>
	            <div class="succ-pop">
	                <div class="title">
	                    <a id="newCreate">提示</a>
	                    <div class="el-icon-close" @click="CloseWin"></div>
	                </div>
	                <div class="content">
                		<div class="info">是否按照修改后的数据进行计算</div>
						<el-row style='position: absolute;bottom: 40px;right: 30px;'>
							<el-button type="primary" @click=''>确定</el-button>
							<el-button plain @click='CloseWin'>取消</el-button>
						</el-row>
	               </div>
	            </div>
	        </div>
	        <!--------------批量导入弹框部分--------------->
			<div class="popUp" v-if="Upload">
	            <div class="mask"></div>
	            <div class="succ-pop">
	                <div class="title">
	                    <a id="newCreate">批量导入</a>
	                    <div class="el-icon-close" @click="CloseInsert"></div>
	                </div>
	                <div class="content">
	                	<form id="Form" name="fileForm" action="url" method="post" enctype="multipart/form-data" target="targetIfr">
		                	<input type="text" class="Insert"/>
	                		<el-upload
								class="upload-demo"
								ref="upload"
								action=""
								:on-preview="handlePreview"
								:on-remove="handleRemove"
								:file-list="fileList"
								:auto-upload="false"
								:show-file-list="false"
								:multiple="true"
								:on-change="changeFileList">
							  	<el-button style="margin-left: 10px;float: left;" slot="trigger" size="small">选择附件</el-button>
							</el-upload>
							<span>Excel样例&nbsp;:&nbsp;<a href="./static/Download/template.xlsx" download="国省控点数据修正批量导入模板.xlsx">国省控点数据修正批量导入模板</a></span>
							<el-button type="button" @click='subimtBtn' style="width: 100px;position: absolute;bottom: 40px;right: 30px;" value="">开始上传</el-button>
						</form>
						<iframe name="targetIfr" style="display:none"></iframe>
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
            	//县市区选择
               	options: [],
               	gridCode:'',
		        value1: '',//县(市、区)
		        value2: '',//开始时间
		        value3: '',//结束时间
		        value4: '',
		        value5: '',
		        value6: '',
		        tableData:[],
			    currentPage: 1,
			    pagesize:10,
			    isConfirm: false,
			    Upload: false,
				//查询
				startTime:'',
				endTime:'',
				TotalRowsCount:null,
				totalCount:'',
				InfoData:[],
				ListData:[],
				Id:'',
				fileList: [],
				isEdit:false,
				SO2:'',
				NO2:'',
				PM10:'',
				CO:'',
				O3:'',
				PM25:'',
				url:'',
				//日数据列表
				columns:  [
	                 {field: 'gridName', title:'县(市、区)', width: 130, titleAlign: 'center',columnAlign:'center',isEdit:false,isResize:true},
	                 {field: 'time', title: '时间',width: 130, titleAlign: 'center',columnAlign:'center',isEdit:false,isResize:true},
	                 {field: 'SO2', title: 'SO2', width: 100, titleAlign: 'center',columnAlign:'center',isEdit:true,isResize:true},
	                 {field: 'NO2', title: 'NO2', width: 100, titleAlign: 'center',columnAlign:'center',isEdit:true,isResize:true},
	                 {field: 'PM10', title:'PM10', width: 100, titleAlign: 'center',columnAlign:'center',isEdit:true,isResize:true},
	                 {field: 'CO', title: 'CO', width: 100, titleAlign: 'center',columnAlign:'center',isEdit:true,isResize:true},
	                 {field: 'O3', title: 'O3-8h', width: 100, titleAlign: 'center',columnAlign:'center',isEdit:true,isResize:true},
	                 {field: 'PM25', title: 'PM2.5', width: 100, titleAlign: 'center',columnAlign:'center',isEdit:true,isResize:true},
	                 {field: 'quality', title:'空气质量指数类别', width: 100, titleAlign: 'center',columnAlign:'center',isEdit:false,isResize:true},
	                 {field: 'aqi', title: 'AQI', width: 100, titleAlign: 'center',columnAlign:'center',isEdit:false,isResize:true},
	                 {field: 'primarypollutant', title: '首要污染物', width: 100, titleAlign: 'center',columnAlign:'center',isEdit:false,isResize:true}
	         ]
            }
        },
        created(){
        	this.GetFirstGridDropDown();
        	this.GetMonitoringDay();
        },
        mounted() {
        	this.url = api.DayDataUrl();
        },
        computed: {
            
        },
        methods: {
        	 // 单元格编辑回调
            cellEditDone(newValue,oldValue,rowIndex,rowData,field){
				let t = this;
				let lowerField;
				switch (field){
					case 'SO2':
						lowerField = 'so2';
					break;
					case 'NO2':
						lowerField = 'no2';
					break;
					case 'PM10':
						lowerField = 'pm10';
					break;
					case 'CO':
						lowerField = 'co';
					break;
					case 'O3-8h':
						lowerField = 'o3';
					break;
					case 'PM2.5':
						lowerField = 'pm25';
					break;
				}
				let id = rowData.id;
                api.UpdateMonitoringDay(id,lowerField,newValue).then(res=>{
                	if(res.data.Status==-1){
                		this.$message({
					        message: '请输入正确的数值',
					        type: 'warning',
					        duration: 1000
					    });
                	}else{
                		t.tableData[rowIndex][field] = newValue;
                	}
                })
            },
           	//上传文件
            subimtBtn() {  
            	let t = this;
		        var form = $("form[name=fileForm]");  
		        var options  = {    
//		            url:'http://gkpt.zq12369.com:8016/api/Monitoring/UploadFile',
					url:this.url,
		            type:'post',    
		            success:function(data){
		            	//console.log(data)
		            	if(data.Status==-1){
		            		t.$message({
						        message: '上传失败,请选择正确文件',
						        type: 'warning',
						        duration: 1500,
					    	});
					    	t.Upload = false;
		            	}else{
		            		t.$message({
						        message: '上传成功',
						        type: 'success',
						        duration: 1000
					    	});
					    	t.Upload = false;
		            	}
		            }
		        };    
		        form.ajaxSubmit(options);   
		    } ,
            //开始时间选择
        	startChange(val){
        		this.startTime = val;
        	},
        	//结束时间选择
        	endChange(val){
        		this.endTime = val;
        	},
      		//分页
      		 handleSizeChange(val) {
        		console.log(`每页 ${val} 条`);
      		},
      		handleCurrentChange(val) {
        		this.setPageTable(10, val);
      		},
      		//关闭提示
      		CloseWin(){
      			this.isConfirm = false;
      		},
      		//打开批量导入弹框
      		OpenInsert(){
      			this.Upload = true;
      		},
      		//关闭批量导入弹框
      		CloseInsert(){
      			this.Upload = false;
      		},
      		//县区市选择
      		selectChange(value){
      			let obj = {};
			    obj = this.options.find((item)=>{
			        return item.gridName === value;
			    });
			    this.gridCode = obj?obj.gridCode:'';
      		},
      		//获取日数据列表
      		GetMonitoringDay(){
      			let t = this;
      			let start = t.startTime?t.startTime:'';
      			let end = t.endTime?t.endTime:'';
      			let gridCode = t.gridCode;
      			this.ListData = [];
      			api.GetMonitoringDay(start,end,gridCode).then(result=>{
      				if(result){
      					let InfoData = result.data.Data;
      					t.totalCount = InfoData.length;
						InfoData.forEach(item=>{
							let tableData = {};
							tableData.id = item.id;//县名称
	                        tableData.gridName = item.gridName;//县名称
	                        tableData.time = item.time.replace('T',' ');;//时间
	                        tableData.SO2 = item.so2;//SO2
	                        tableData.NO2 = item.no2;//NO2
	                        tableData.PM10 = item.pm10;//PM10
	                        tableData.CO = item.co;//CO
	                        tableData.O3 = item.o3_8h;//O3
	                        tableData.PM25 = item.pm25;//PM25
	                        tableData.quality = item.quality;//空气质量
	                        tableData.aqi = item.aqi;//aqi
	                        tableData.primarypollutant = item.primarypollutant;//首要污染物
	                        t.ListData.push(tableData);
						})
						this.setPageTable(10, 1);
      				}
				});
      		},
      		//导出
      		ImportExel(){
      			let t = this;
      			let start = t.startTime?t.startTime:'';
      			let end = t.endTime?t.endTime:'';
      			let gridCode = t.gridCode;
      			api.ImportExel(start,end,gridCode);
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
            submitUpload() {
		        this.$refs.upload.submit();
		    },
		    handleRemove(file, fileList) {
		        console.log(file, fileList);
		    },
		    handlePreview(file) {
		        console.log(file);
		    },
		    changeFileList(file){
		    	this.fileList.push(file);
//		    	console.log(this.fileList);
		    	let dd = [];
		    	this.fileList.forEach(item=>{
		    		dd.push(item.name);
		    	})
//		    	console.log(dd)
		    	$(".Insert").val(dd);
		    },
		    //获取县市区数据（下拉框）
	        GetFirstGridDropDown(){
	        	let t = this;
	        	api.GetFirstGridDropDown().then(res=>{
	        		t.options = res.data.Data;
	        	})
	        }
        }, 
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.el-input, .el-input__inner{
	width: 200px;
}
.edit-input{
	width: 100px;
}
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
    	.InsertOrOut{
    		margin-top: 10px;
    		span{
    			a{
	    			color: #000000;
	    			font-size: 14px;
	    			margin-right: 40px;
    			}
    			:hover{
    				cursor: pointer;
    				color: #1797ff;
    				text-decoration: underline;
	    		}
    		}
    		
    	}
    }
    .page{
    	text-align: left;
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
            width: 400px;
            height: 224px;
            background: #fff;
            position: fixed;
            left: 50%;
            top: 50%;
            margin-left: -200px;
            margin-top: -112px;
            z-index: 999;
            border-radius: 10px;
            .title {
                width: 100%;
                height: 50px;
                line-height: 50px;
                text-align: left;
                border-bottom: 2px solid #3a90b3;
                margin-bottom:26px;
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
            	.info{
            		width: 204px;
            		margin: 0 auto;
            	}
            	.Insert{
            		border: none;
            		border: 1px solid #c8c9cb;
            		border-radius:5px;
            		outline: none;
            		width: 250px;
            		height: 30px;
            		float: left;
            	}
            }
            
        }
        /*//编辑弹框*/
	    .editPop{
	    	width: 800px;
	    	height: 400px;
	    	margin-left: -400px;
	    	margin-top: -200px;
	    	.warningValSet{
				padding-top: 20px;
				width:100%;
				/*height: 250px;*/
				background: #fff;
				border:1px solid #eee;
				text-align: left;
				.ValueSet{
					padding-left: 20px;
					padding-bottom: 20px;
				}
				.PM25{
					width: 260px;
					display: inline-block;
					margin-right: 10px;
					margin-top: 20px;
					.demonstration{
						display: inline-block;
						float: left;
						width: 50px;
						height: 40px;
						line-height: 40px;
						text-align: right;
						margin-right: 10px;
					}
				}
			}
	    }    
    } 
      
}
</style>
