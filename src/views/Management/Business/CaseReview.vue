<!--后台管理-案件审核-->
<template>
    <div class="CaseReview">
		<!--------------案件审核右侧数据展示------>
		<div id="right">
			<!----------上传案件-->
			<div class="box">
                <div class="warning">
                    <a>上传案件列表</a>
                </div>
            </div>
            <!-----------查询部分------->
			<div class="search">
				<div class="searchBox">
				    <span>案件状态</span>
				    <el-select v-model="CaseStatusVal" @change="selectChangeStatus" clearable placeholder="请选择">
				        <el-option
				          v-for="item in optionsCase"
				          :key="item.value"
				      	  :label="item.label"
				          :value="item.value">
				        </el-option>
				    </el-select>
				</div>
				<div class="searchBox" v-show="$store.state.responsibility===false">
				    <span>责任主体</span>
				    <el-select v-model="DutyMainVal" @change="selectChangeDuty" clearable placeholder="请选择">
				        <el-option
				          v-for="item in optionsDuty"
				          :key="item.value"
				      	  :label="item.name"
				          :value="item.code">
				        </el-option>
				    </el-select>
				</div>
				<div class="searchBox">
				    <span>污染类别</span>
				    <el-select v-model="PollutionClassVal" @change="selectChangePollution" clearable placeholder="请选择">
				        <el-option
				          v-for="item in optionsPollution"
				          :key="item.value"
				      	  :label="item.name"
				          :value="item.code">
				        </el-option>
				    </el-select>
				</div>
				<div class="block" style="margin-top: 20px;">
				    <span class="demonstration">案件时间</span>
				    <el-date-picker
				      v-model="CaseStartTime"
				      type="date"
				      value-format="yyyy-MM-dd"
				      placeholder="选择日期时间"
				      @change='startChange'>
				    </el-date-picker>
				    -
				    <el-date-picker
				      v-model="CaseEndTime"
				      type="date"
				      value-format="yyyy-MM-dd"
				      placeholder="选择日期时间"
				      @change='endChange'>
				    </el-date-picker>
				    <el-button type="primary" class='btns' @click='GetMonitoringDay'>查询</el-button>
				    <div class="InsertOrOut">
						<span>
							<img src="../../../../static/imgs/main/Out.png"/>
							<a @click="GetExportCase">Excel导出</a>
						</span>
					</div>
				</div>
			</div>
			
			<!--------------列表部分---------->
			<div class="box">
                <div class="warning">
                    <a>列表</a>
                </div>
           	</div>
           	<el-table
			    :data="ListData"
			    style="width: 100%">
			    <el-table-column
			      prop="pollutiontype"
			      label="污染类别"
			      width="200">
			    </el-table-column>
			    <el-table-column
			      prop="status"
			      label="案件状态"
			      width="350">
			    </el-table-column>
			    <el-table-column
			      prop="createtime"
			      label="案发时间"
			      width="">
			    </el-table-column>
			    <el-table-column
			      prop="location"
			      label="位置">
			    </el-table-column>
			    <el-table-column
			      prop="departmenttype"
			      label="责任主体">
			    </el-table-column>
			    <el-table-column
			      label="操作"
			      width="200">
			      <template scope="scope">
			      	<div v-if="scope.row.status=='未处理'">
						<el-button v-show="$store.state.responsibility" type="text" size="small" class='eidt' style="color: #C1C0C0">分配</el-button>
			      		<el-button v-show="$store.state.responsibility === false" @click="handleDistrbuteClick(scope.row)" type="text" size="small" class='eidt'>分配</el-button>
				        <span style="color: #eee;">|</span>
				        <span class="OverBox">
				        	<el-button @click="handleReplyClick(scope.row)" type="text" size="small" class='noeidt'>回复</el-button>
				        </span>
			      	</div>
			        <div v-else>
			        	<el-button @click="handleExamineClick(scope.row)" type="text" size="small" class='eidt'>查看</el-button>
			        </div>
			      </template>
			    </el-table-column>
			</el-table>
		   	<div class="page">
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
			<!--------------回复弹框部分--------------->
			<div class="popUp" v-if="isUpdate">
	            <div class="mask"></div>
	            <div class="succ-pop reply">
	                <div class="title">
	                    <a id="newCreate">提示</a>
	                    <div class="el-icon-close" @click="isUpdate=false"></div>
	                </div>
	                <div class="content">
                		<div class="block" style="margin-right: 40px;">
						    <span>污染类别</span>
						    <el-input v-model="PollutionClassPop" placeholder="" disabled></el-input>
						</div>
						<div class="block">
						    <span>案发时间</span>
						    <el-input v-model="CaseTimePop" placeholder="" disabled></el-input>
						</div>
						<div class="block">
						    <span>位置</span>
						    <el-input v-model="CasePositionPop" placeholder="" style='width:504px' disabled></el-input>
					  	</div>
					  	<div class="block" style="margin-right: 40px;">
						    <span>案件状态</span>
						    <el-input v-model="CaseStatusPop" placeholder="" disabled></el-input>
					  	</div>
					  	<div class="block">
						    <span>责任主体</span>
						    <el-input v-model="CaseDutyPop" placeholder="" disabled></el-input>
					  	</div>
					  	<div class="block" style="margin-bottom: 20px;">
					  		<span class="left">内容</span>
						  	<el-input
								type="textarea"
								:rows="3"
								placeholder=""
								v-model="textarea"
								disabled>
							</el-input>
						</div>
						<div>
							<div class="block imgBox left" style="margin:0;">
								<span class="left">案件照片</span>
							    <el-carousel height="200px">
							        <el-carousel-item v-for="(item,index) in tupian" :key="index">
						        <!--<img src="../../../assets/img/bj_denglu.jpg"/>-->
						        <!--<img :src="'http://gkpt.zq12369.com:8013/servicePlatform/'+item.attachment" />-->
						        <img :src="imgUrl+item.attachment" />
						      </el-carousel-item>
							    </el-carousel>
							</div>
							<span class="left" style="margin-left: 50px;">案后照片</span>
							<div class="left">
								<div class="img-list">
									<div v-if="imagelist">
										<div class="img-content" v-for="(item,key) in imagelist" :key="key">
											<img :src="item.url" >
											<!-- 删除icon -->
											<div class="del">
												<i @click="handleFileRemove(item,key)" class="el-icon-delete"></i>
											</div>
											
										</div>
									</div>
									<!--<div v-if="!pass && progress !== 0" class="img-content img-progress">
										<el-progress type="circle" :percentage="progress" :status="proStatus"></el-progress>
									</div>-->
									<div class="img-upload" v-if="!imagelist.length">
										<el-upload class="uploader"
										  ref="upload"
										  list-type="picture-card"
										  :show-file-list="false"
										  :action="imgUrl+'admin/caseData/uploadAnalysisFile'"
										  :data="params.data"
										  name='uploadFile'
										  :before-upload="beforeAvatarUpload"
										  :on-change="uploadOnChange"
										  :on-success="uploadOnSuccess"
										  :on-error="uploadOnError"
										  :on-progress="uploadOnProgress">
										<img src="../../../../static/imgs/main/点击添加图片.png" />
								        <div class="el-upload__text">点击选择图片<br>支持jpg/png格式<br>不超过5M</div>
										</el-upload>
									</div>
									
								</div>
								<!--<div v-if="!dialogVisible">
								    <el-upload
								        class="upload-demo"
								        action="https://jsonplaceholder.typicode.com/posts/"
									  	list-type="picture-card"
									  	:on-preview="handlePictureCardPreview"
									  	:on-remove="handleRemove"
									  	:on-success='success'
									  	accept=".jpg, .png"
									  	:before-upload='beforeAvatarUpload'
									  	:limit=1>
								        <img src="../../../../static/imgs/main/点击添加图片.png" />
								        <div class="el-upload__text">点击选择图片<br>支持jpg/png格式<br>不超过5M</div>
								    </el-upload>
							   </div>
							   	<div v-else>
							   		<img style="width: 200px;height: 200px;"  :src="dialogImageUrl" alt="">
							   	</div>-->
							</div>
						</div>
						<div class="block">
						    <span>处理结果</span>
						    <el-input v-model="CaseDealPop" placeholder="" style='width:504px'></el-input>
					  	</div>
						<el-row style='position: absolute;bottom: 30px;right: 30px;'>
							<el-button type="primary" @click='GetEditResult'>发布</el-button>
							<el-button plain @click='isUpdate=false'>取消</el-button>
						</el-row>
	               </div>
	            </div>
	        </div>
	        <!--------------查看弹框部分--------------->
			<div class="popUp" v-if="Examine">
	            <div class="mask"></div>
	            <div class="succ-pop examine">
	                <div class="title">
	                    <a id="newCreate">提示</a>
	                    <div class="el-icon-close" @click="Examine=false"></div>
	                </div>
	                <div class="content">
                		<div class="block" style="margin-right: 40px;">
						    <span>污染类别</span>
						    <el-input v-model="PollutionClassPopExamine" placeholder="" disabled></el-input>
						</div>
						<div class="block">
						    <span>案发时间</span>
						    <el-input v-model="CaseTimePopExamine" placeholder="" disabled></el-input>
						</div>
						<div class="block">
						    <span>位置</span>
						    <el-input v-model="CasePositionPopExamine" placeholder="" style='width:504px' disabled></el-input>
					  	</div>
					  	<div class="block" style="margin-right: 40px;">
						    <span>案件状态</span>
						    <el-input v-model="CaseStatusPopExamine" placeholder="" disabled></el-input>
					  	</div>
					  	<div class="block">
						    <span>责任主体</span>
						    <el-input v-model="CaseDutyPopExamine" placeholder="" disabled></el-input>
					  	</div>
					  	<div class="block">
					  		<span class="left">内容</span>
						  	<el-input
								type="textarea"
								:rows="3"
								placeholder="请输入内容"
								v-model="textareaExamine"
								disabled>
							</el-input>
						</div>
						<div class="block imgBox">
							<span>案件照片</span>
						    <el-carousel height="200px">
						      <el-carousel-item v-for="(item,index) in tupian" :key="index">
						        <!--<img src="../../../assets/img/bj_denglu.jpg"/>-->
						        <!--<img :src="'http://gkpt.zq12369.com:8013/servicePlatform/'+item.attachment" />-->
						        <img v-if='item.attachment' :src="imgUrl+item.attachment" />
						      </el-carousel-item>
						    </el-carousel>
						</div>
						<div class="block imgBox secSpan">
							<span>案后照片</span>
						    <el-carousel height="200px">
						      <el-carousel-item>
						        <!--<img src="../../../assets/img/bj_denglu.jpg"/>-->
						        <!--<img :src="'http://gkpt.zq12369.com:8013/servicePlatform/'+afterCaseImg" />-->
						        <img v-if='afterCaseImg' :src="imgUrl+afterCaseImg" />
						      </el-carousel-item>
						    </el-carousel>
						</div>
						<div class="block">
						    <span>处理结果</span>
						    <el-input v-model="CaseDealPopExamine" placeholder="" style='width:504px;' disabled></el-input>
					  	</div>
						<el-row style='position: absolute;bottom: 30px;right: 30px;'>
							<el-button plain @click='Examine=false'>取消</el-button>
						</el-row>
						
	               </div>
	            </div>
	        </div>
	        	<!--------------分配弹框部分--------------->
			<div class="popUp" v-if="isDistribute">
	            <div class="mask"></div>
	            <div class="succ-pop distribute">
	                <div class="title">
	                    <a id="newCreate">提示</a>
	                    <div class="el-icon-close" @click="isDistribute=false"></div>
	                </div>
	                <div class="content">
                		<span>责任主体</span>
                		<el-select v-model="distributePopVal" placeholder="请选择" @change="selectFenPeiChangeDuty">
						    <el-option
						      v-for="item in optionsDistributePop"
						      :key="item.value"
						      :label="item.name"
						      :value="item.code">
						    </el-option>
						</el-select>
						<el-row style='position: absolute;bottom: 20px;right: 30px;'>
							<el-button type="primary" @click='GetEditCase'>确定</el-button>
							<el-button plain @click='isDistribute=false'>取消</el-button>
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
        name: 'CaseReview',
        data() {
            return {
            		progress: 0,//上传进度
					pass: null,//是否上传成功
					isEnlargeImage: false,//放大图片
		//			enlargeImage: '',//放大图片地址
					imagelist: [
					],
					params: {
//						action: 
//						'http://gkpt.zq12369.com:8013/servicePlatform/admin/caseData/uploadAnalysisFile',
						data: {}
					},
            	//上传图片
            	dialogImageUrl: '',
        		dialogVisible: false,
            	//案件状态
            	optionsCase: [{
		          value: '0',
		          label: '未处理'
		        }, {
		          value: '1',
		          label: '处理完毕'
		        }],
		        //责任主体
            	optionsDuty: [],
		        //污染类别
            	optionsPollution: [],
		        //分配弹框责任主体选择
		        optionsDistributePop: [],
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
				pageNo:1,
	         //案件状态
	         CaseStatusVal:'',
	         //责任主体
	         DutyMainVal:'',
	         //污染类别
	         PollutionClassVal:'',
	         //案件时间
	         CaseStartTime:'',
	         CaseEndTime:'',
	         //回复提交弹框
	         isUpdate:false,
	         PollutionClassPop:'',//污染类别
	         CaseTimePop:'',//案发时间
	         CasePositionPop:'',//位置
	         CaseStatusPop:'',//案件状态
	         CaseDutyPop:'',//责任主体
	         textarea:'',//内容
	         CaseDealPop:'',//处理结果
	         //分配弹框
	         isDistribute:false,
	         distributePopVal: '',
	         //查看
	         Examine:false,
	         PollutionClassPopExamine:'',//污染类别
	         CaseTimePopExamine:'',//案发时间
	         CasePositionPopExamine:'',//位置
	         CaseStatusPopExamine:'',//案件状态
	         CaseDutyPopExamine:'',//责任主体
	         textareaExamine:'',//内容
	         CaseDealPopExamine:'',//处理结果
	         tupian:[],
	         status:'',
	         departmenttype:'',
	         pollutiontype:'',
	         id:'',
	         zrxtCode:'',
	         afterCaseImg:'',
	         imgUrl:''
            }
        },
        created(){
        	
        },
        mounted() {
        	this.GetMonitoringDay();
        	this.GetCaseAll();//责任主体
        	this.GetPollutionType();//污染类别
        	this.imgUrl = api.CaseImgUp();
        	console.log(this.imgUrl)
        },
        computed: {
            proStatus(){//上传状态
				if(this.pass){
					return 'success'
				}else if(this.pass == false){
					return 'exception'
				}else{
					return ''
				}
			}
        },
        methods: {
        	uploadOnProgress(e,file){//开始上传
				console.log(e.percent,file)
				this.progress = Math.floor(e.percent)
			},
			uploadOnChange(file){
				console.log("——————————change——————————")
				// console.log(file)
				if(file.status == 'ready'){
					console.log("ready")
					this.pass = null;
					this.progress = 0;
				}else if(file.status == 'fail'){
					this.$message.error("图片上传出错，请刷新重试！")
				}
			},
			uploadOnSuccess(e,file){//上传附件
				console.log("——————————success——————————")
				console.log(file)
				this.fileUrl = file.response;
				this.pass = true;
				this.$message.success("上传成功")
				this.imagelist.push({
					url: file.url,
					name: '新增图片'
				})
			},
			uploadOnError(e,file){
				console.log("——————————error——————————")
				console.log(e)
				this.pass = false;
			},
        	handleFileRemove(file,i){//删除图片
				console.log(file,i)
				if(!file.url){
					return false;
				}
				let that = this;
				this.$confirm('是否删除此图片？','提示',{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					//可添加ajax
					this.$message.success("删除成功")
					this.$message({
						type: 'success',
						message: '删除成功',
						onClose: () => {
							that.imagelist.splice(i,1)
						}
					})
				}).catch((meg) => console.log(meg))
			},
			beforeAvatarUpload(file) {
		        const isJPG = file.type === 'image/jpeg'||'image/png';
		        const isLt5M = file.size / 1024 / 1024 < 5;
		
		        if (!isJPG) {
		          this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
		        }
		        if (!isLt5M) {
		          this.$message.error('上传头像图片大小不能超过 5MB!');
		        }
		        return isJPG && isLt5M;
		   },
		   //处理结果
		   GetEditResult(){
		   		let t = this;
		   		let id = this.id;
		   		let handlingResult = this.CaseDealPop;
		   		let afterPath = this.fileUrl;
		   		api.GetEditResult(id,handlingResult,afterPath).then(res=>{
		   			console.log(res)
		   			if(res.data.status){
		   				t.GetMonitoringDay();
		   				t.$message.success("填写处理结果成功")
		   				t.isUpdate=false;
		   			}
		   			
		   		})
		   },
        	//上传图片
//      	handleRemove(file, fileList) {
//		        console.log(file, fileList);
//		    },
//		    handlePictureCardPreview(file) {
//		        this.dialogImageUrl = file.url;
//		        this.dialogVisible = true;
//		    },
//		    success(response, file, fileList){
//		    	 this.dialogVisible = true;
//		    },
		     // 上传前对文件的大小的判断
//		    beforeAvatarUpload (file) {
//			    const extension = file.name.split('.')[1] === 'jpg'
//			    const extension2 = file.name.split('.')[1] === 'png'
//			    const isLt2M = file.size / 1024 / 1024 < 5
//			    if (!extension && !extension2) {
//			        console.log('上传模板只能是jpg/png 格式!')
//			    }
//			    if (!isLt2M) {
//			        console.log('上传模板大小不能超过 10MB!')
//			    }
//			    return extension || extension2 && isLt2M
//		    },
		     // 文件上传前
//			beforeImgUpload (file) {
//			    const self = this;  //这个很重要！
//			    var reader = new FileReader();
//			    reader.readAsDataURL(file);
//			    reader.onloadend = function() {
//			        self.form.upLoadData.img_base64 = this.result;
//			        console.log(self.form.upLoadData.img_base64);
//			    };
//			},
//			// 上传成功后的回调
//			uploadSuccess (response, file, fileList) {
//			    console.log('上传文件', response)
//			    this.$alert(response.retData.msg);
//			    console.log(this.form.upLoadData.img_base64);
//			},
//			uploadError(){
//				
//			},
			GetUploadImg(){
				
			},
			GetCaseImg(caseCode){
				api.GetCaseImg(caseCode).then(res=>{
					console.log(res)
				})
			},
        	//点击分配
        	handleDistrbuteClick(row){
        		console.log(row)
        		this.isDistribute = true;
        		this.id = row.id;
        	},
        	//点击回复
        	handleReplyClick(row){
        		this.isUpdate = true;
	         	this.PollutionClassPop = row.pollutiontype;//污染类别
		        this.CaseTimePop = row.createtime;//案发时间
		        this.CasePositionPop = row.location;//位置
		        this.CaseStatusPop = row.status;//案件状态
		        this.CaseDutyPop = row.departmenttype;//责任主体
		        this.textarea = row.description;//内容
		        this.tupian = row.tupian;
		        this.id = row.id;
        	},
        	//点击查看
        	handleExamineClick(row){
        		this.Examine = true;
        		console.log(row);
        		let casecode = row.casecode;
        		this.PollutionClassPopExamine = row.pollutiontype;//污染类别
		        this.CaseTimePopExamine = row.createtime;//案发时间
		        this.CasePositionPopExamine = row.location;//位置
		        this.CaseStatusPopExamine = row.status;//案件状态
		        this.CaseDutyPopExamine = row.departmenttype;//责任主体
		        this.textareaExamine = row.description;//内容
		        this.CaseDealPopExamine = row.handlingResult;//处理结果
		        this.tupian = row.tupian;
		        this.afterCaseImg = row.afterCaseImg;
		        console.log(this.tupian)
        	},
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
//      		this.GetMonitoringDay(10,val);
      		},
      		handleCurrentChange(val) {
      			let t = this;
				let status;
				if(this.CaseStatusVal){
					status = this.status;
				}else{
					status = -1;
				}
				let departmenttype;
				if(this.DutyMainVal){
					departmenttype = this.departmenttype;
				}else{
					departmenttype = -1;
				}
				let pollutiontype;
				if(this.PollutionClassVal){
					pollutiontype = this.pollutiontype;
				}else{
					pollutiontype = -1;
				}
				let starTime = this.CaseStartTime?this.CaseStartTime:'';
				let endTime = this.CaseEndTime?this.CaseEndTime:'';
				let pageSize = 10;
				let pageNo = val;
      			this.ListData = [];
      			api.GetCaseList(status,departmenttype,pollutiontype,starTime,endTime,pageSize,pageNo).then(result=>{
      				console.log(result)
      				if(result){
      					let InfoData = result.data.list;
      					t.totalCount = result.data.count;
      					console.log(InfoData)
      					console.log('11')
      					if(InfoData){
      						InfoData.forEach(item=>{
								let tableData = {};
								tableData.casecode = item.casecode;
		                        tableData.createtime = item.createtime.replace('T',' ');//案发时间
		                        tableData.description = item.description;
		                        tableData.departmenttype = item.departmenttype;//责任主体
		                        tableData.location = item.location;//位置
		                        tableData.pollutiontype = item.pollutiontype;//污染类型
		                        tableData.status = item.status?'处理完毕':'未处理';//处理状态
		                        tableData.tupian = item.tupian;//图片
		                        tableData.afterCaseImg = item.afterCaseImg;//安后图片
		                        tableData.username = item.username;
		                        tableData.id = item.id;
		                        tableData.handlingResult = item.handlingResult;//处理结果
		                        t.ListData.push(tableData);
							})
      					}
						
//						this.setPageTable(10000, 1);
      				}
				});
      		},
      		//关闭分配提示
      		closeWin(){
      			this.isUpdate = false;
      		},
      		//案件状态选择
      		selectChangeStatus(val){
      			this.status = val;
      		},
      		//责任主体选择
      		selectChangeDuty(val){
      			this.departmenttype = val;
      		},
      		//分配责任主体选择
      		selectFenPeiChangeDuty(val){
      			this.zrxtCode = val;
      		},
      		//污染类型选择
      		selectChangePollution(val){
      			this.pollutiontype = val;
      		},
      		//获取污染类型
      		GetCaseAll(){
      			let t = this;
      			api.GetCaseAll().then(result=>{
      				t.optionsPollution = result.data.polltion_type;
      			})
      		},
      		//获取责任主体
      		GetPollutionType(){
      			api.GetPollutionType().then(result=>{
      				let t = this;
      				console.log(result)
      				t.optionsDuty = result.data.depart_type;
      				t.optionsDistributePop = result.data.depart_type;
      			})
      		},
      		//获取列表
      		GetMonitoringDay(){
      			let t = this;
				let status;
				if(this.CaseStatusVal){
					status = this.status;
				}else{
					status = -1;
				}
				let departmenttype;
				if(this.DutyMainVal){
					departmenttype = this.departmenttype;
				}else{
					departmenttype = -1;
				}
				let pollutiontype;
				if(this.PollutionClassVal){
					pollutiontype = this.pollutiontype;
				}else{
					pollutiontype = -1;
				}
				let starTime = this.CaseStartTime?this.CaseStartTime:'';
				let endTime = this.CaseEndTime?this.CaseEndTime:'';
				let pageSize = 10;
				let pageNo = this.pageNo;
      			this.ListData = [];
      			api.GetCaseList(status,departmenttype,pollutiontype,starTime,endTime,pageSize,pageNo).then(result=>{
      				console.log(result)
      				if(result){
      					let InfoData = result.data.list;
      					t.totalCount = result.data.count;
      					console.log(InfoData)
      					console.log('11')
      					if(InfoData){
      						InfoData.forEach(item=>{
								let tableData = {};
								tableData.casecode = item.casecode;
		                        tableData.createtime = item.createtime.replace('T',' ');//案发时间
		                        tableData.description = item.description;
		                        tableData.departmenttype = item.departmenttype;//责任主体
		                        tableData.location = item.location;//位置
		                        tableData.pollutiontype = item.pollutiontype;//污染类型
		                        tableData.status = item.status?'处理完毕':'未处理';//处理状态
		                        tableData.tupian = item.tupian;//图片
		                        tableData.afterCaseImg = item.afterCaseImg;//安后图片
		                        tableData.username = item.username;
		                        tableData.id = item.id;
		                        tableData.handlingResult = item.handlingResult;//处理结果
		                        t.ListData.push(tableData);
							})
      					}
						
//						this.setPageTable(10000, 1);
      				}
				});
      		},
      		//分配责任主体
      		GetEditCase(){
      			let t = this;
      			let id = this.id;
      			let zrxtCode = this.zrxtCode;
      			api.GetEditCase(id,zrxtCode).then(res=>{
      				t.isDistribute = false;
      				t.GetMonitoringDay();
      			})
      		},
      		//导出
      		GetExportCase(){
      			let t = this;
      			let status;
				if(this.CaseStatusVal){
					status = this.status;
				}else{
					status = -1;
				}
				let departmenttype;
				if(this.DutyMainVal){
					departmenttype = this.departmenttype;
				}else{
					departmenttype = -1;
				}
				let pollutiontype;
				if(this.PollutionClassVal){
					pollutiontype = this.pollutiontype;
				}else{
					pollutiontype = -1;
				}
				let starTime = this.CaseStartTime?this.CaseStartTime:'';
				let endTime = this.CaseEndTime?this.CaseEndTime:'';
				let pageSize = 10;
				let pageNo = 1;
      			api.GetExportCase(status,departmenttype,pollutiontype,starTime,endTime,pageSize,pageNo);
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
            
		    handleRemove(file, fileList) {
		        console.log(file, fileList);
		    },
		    handlePreview(file) {
		        console.log(file);
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
*{
	box-sizing: border-box;
}
.img-list{
	overflow:hidden;
	width:100%;
}
.img-list .img-content{
	float:left;
	text-align:left;
	position:relative;
	display:inline-block;
	width:200px;
	height:200px;
	/*padding:5px;*/
	/*margin:5px 20px 20px 0;*/
	border:1px solid #d1dbe5;
	/*border-radius:4px;*/
	/*transition:all .3s;*/
	/*box-shadow:0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);*/
}
.img-list .img-upload{
	float:left;
	width:200px;
	height:200px;
	display:table;
	text-align:center;
}
.img-list .uploader{
	width:100%;
	display:table-cell;
	vertical-align:middle;
}
.img-list .img-progress{
	text-align:center;
	padding-top:30px;
}
.img-list .img-content img{
	display:block;
	width:100%;
	height:200px;
	margin:0 auto;
	/*border-radius:4px;*/
}
.img-list .img-content .name{
	margin-top:10px;
}
.img-list .img-content .name>div{
	width:90%;
	text-overflow:ellipsis;
	overflow:hidden;
	height:25px;
	line-height:25px;
}
.img-list .img-content:hover .del,
.img-list .img-content:hover .layer{
	opacity:1;
}
.img-list .img-content .del,
.img-list .img-content .layer{
	opacity:0;
	transition:all .3s;
}
.img-list .img-content .del{
	position:absolute;
	bottom:10px;
	right:10px;
	color:#8492a6;
	cursor:pointer;
	font-size:1.1em;
}
.img-list .img-content .layer{
	position:absolute;
	left:0;
	right:0;
	top:0;
	height:200px;
	color:#fff;
	text-align:center;
	z-index:5;
	background-color:rgba(0,0,0,.4);
}
.img-list .img-content .layer i{
	font-size:1.6em;
	margin-top:80px;
}


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
	.left{
		float: left;
	}
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
    	margin-left: 20px;
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
    		display: inline-block;
    		margin-left: 40px;
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
        /*****回复弹出框内容********/
        .reply {
            width: 655px;
            height: 690px;
            background: #fff;
            position: fixed;
            left: 50%;
            top: 50%;
            margin-left: -327px;
            margin-top: -345px;
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
            	padding: 0 40px;
            	text-align: right;
            	.block{
            		float:left;
            		margin-top:20px;
            		span{
            			display: inline-block;
            			width: 60px;
            			text-align: right;
            		}
            	}
            	.el-textarea{
					width: 506px;
				}
				.el-upload .el-upload--picture-card{
					width: 200px!important;
					height: 200px!important;
					line-height: none;
				}
            }
            
        }
        /*//分配弹框*/
        .distribute{
        	width: 400px;
        	height: 224px;
        	margin-left: -200px;
	    	margin-top: -112px;
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
	    		margin-left: 30px;
	    		margin-top: 20px;
	    	}
        }
        /*查看弹框*/
        .examine{
        	width: 655px;
            height: 690px;
            background: #fff;
            position: fixed;
            left: 50%;
            top: 50%;
            margin-left: -327px;
            margin-top: -345px;
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
            	padding: 0 40px;
            	text-align: right;
            	.block{
            		float:left;
            		margin-top:20px;
            		span{
            			display: inline-block;
            			width: 60px;
            			text-align: right;
            		}
            	}
            	.el-textarea{
					width: 506px;
				}
	    	}
        	
        } 
        .imgBox{
			img{
				width: 200px;
				height: 200px;
			}
			span{
				vertical-align: top;
			}
			
		}
		.secSpan{
			margin-left: 35px;
		}  
    } 
      
}
</style>
