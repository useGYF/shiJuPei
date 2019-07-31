<!--后台管理-案件审核-->
<template>
    <div class="CaseReview">
		<!--案件审核右侧数据展示-->
		<div id="right">
            <span v-if='userInfo.classfication=="0"'>
                <div class="box">
                    <div class="warning">
                        <a>案件录入</a>
                    </div>
                </div>
                <div style="width: 86%;margin:20px auto">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                   <!--  <el-form-item label="案件编号" prop="casecode">
                        <el-input v-model="ruleForm.casecode" placeholder="输入案件编号"></el-input>
                    </el-form-item> -->
                    <el-form-item label="案件等级" prop="caselevel">
                        <el-select v-model="ruleForm.caselevel" placeholder="请选案件等级" @change="selectanjdj">
                            <el-option label="普通" value="0"></el-option>
                            <el-option label="紧急" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="案件来源" prop="casesource">
                        <el-select v-model="ruleForm.casesource" placeholder="请选案件来源" @change="selectanjly">
                            <el-option label="信访平台" value="1"></el-option>
                            <el-option label="信访电话" value="2"></el-option>
                            <el-option label="平台发现" value="3"></el-option>
                            <el-option label="巡查" value="4"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="案件位置" prop="location">
                        <el-input v-model="ruleForm.location" placeholder="例如：北京市朝阳区酒仙桥路2002号"></el-input>
                    </el-form-item>
                    <el-form-item label="经纬度" prop="lonlat">
                        <el-input v-model="ruleForm.lonlat" placeholder="例如：123.44,39.22"></el-input>
                    </el-form-item>
                    <el-form-item label="责任科室" prop="zrksryid">
                        <el-select  placeholder="请选择责任科室" v-model="ruleForm.zrksryid">
                            <el-option v-for="item in ksryoptions" :key="item.id" :label="item.realname" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input type="textarea" rows="4" v-model="ruleForm.description"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">立即录入</el-button>
                    </el-form-item>
                </el-form>
                </div>
                <div class="box">
                    <div class="warning">
                        <a>案件列表</a>
                    </div>
                </div>
                <div style="width: 86%;margin:20px auto">
                    <!--  -->
                    <el-table :data="zhzxdata" style="width: 100%">
                        <el-table-column prop="level" label="案件等级"></el-table-column>
                        <el-table-column prop="location" label="案件地址"></el-table-column>
                        <el-table-column prop="source" label="案件来源"></el-table-column>
                        <el-table-column prop="status" label="案件状态"></el-table-column>
                        <el-table-column prop="zrks" label="案件责任科室"></el-table-column>
                        <el-table-column prop="descript" label="案件描述"></el-table-column>
                    </el-table>
                    <div class="page">
                        <span class="demonstration">共找到{{totalzhzx}}条记录</span>
                        <el-pagination
                        background
                        @current-change="handleChangezhzx"
                        :current-page="pageNo"
                        :page-size="pagesize"
                        :total="totalzhzx">
                        </el-pagination>
                    </div>
                </div>
            </span>
            <span v-if='userInfo.classfication=="1"'>
                <div class="box">
                    <div class="warning">
                        <a>责任科室案件列表</a>
                    </div>
                </div>
                <el-table
                    :data="zrksdata"
                    style="width: 100%">
                    <el-table-column
                    prop="code"
                    label="案件编号">
                    </el-table-column>
                    <el-table-column
                    prop="casesource"
                    label="案件来源">
                    </el-table-column>
                    <el-table-column
                    prop="casestatus"
                    label="案件状态">
                    </el-table-column>
                    <el-table-column
                    prop="description"
                    label="案件描述">
                    </el-table-column>
                    <el-table-column
                    prop="createTime"
                    label="案发时间"
                    width='200'>
                    </el-table-column>
                    <el-table-column
                    prop="location"
                    label="位置">
                    </el-table-column>
                    <el-table-column
                    label="操作"
                    width="100">
                    <template scope="scope">
                        <div v-if="scope.row.casestatus=='待处理'">
                            <el-button  @click="handleDistrbuteClick(scope.row)" type="text" size="small" class='eidt'>通过</el-button>
                        </div>
                        <div v-if="scope.row.casestatus=='处理中'">
                            <el-button @click="handleDubanClick(scope.row)" type="text" size="small" class='eidt'>督办</el-button>
                        </div>
                    </template>
                    </el-table-column>
                </el-table>
                <div class="page">
                    <span class="demonstration">共找到{{totalzrks}}条记录</span>
                    <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleChangezrks"
                    :current-page="pageNo"
                    :page-size="pagesize"
                    layout="prev, pager, next, jumper"
                    :total="totalzrks">
                    </el-pagination>
                </div>
            </span>
            <span v-if='userInfo.classfication=="2"'>
                <div class="box">
                    <div class="warning">
                        <a>处理部门案件列表</a>
                    </div>
                </div>

                <el-table
                    :data="chuliData"
                    style="width: 100%">
                    <el-table-column
                    prop="code"
                    label="案件编号">
                    </el-table-column>
                    <el-table-column
                    prop="caselevel"
                    label="案件等级">
                    </el-table-column>
                    <el-table-column
                    prop="casesource"
                    label="案件来源">
                    </el-table-column>
                    <el-table-column
                    prop="description"
                    label="案件描述">
                    </el-table-column>
                    <el-table-column
                    prop="casestatus"
                    label="案件状态">
                    </el-table-column>
                    <el-table-column
                    prop="createTime"
                    label="案发时间"
                    width='200'>
                    </el-table-column>
                    <el-table-column
                    prop="location"
                    label="位置">
                    </el-table-column>
                    <el-table-column
                    label="操作"
                    width='100'>
                    <template scope="scope">
                        <div v-if="scope.row.casestatus!=='处理完成'">
                            <el-button  @click="handleAfterClick(scope.row)" type="text" size="small" class='eidt'>处理</el-button>
                        </div>
                    </template>
                    </el-table-column>
                </el-table>
                <div class="page">
                    <span class="demonstration">共找到{{totalchuli}}条记录</span>
                    <el-pagination
                    background
                    @current-change="handleCurrentchuli"
                    :current-page="pageNum"
                    :page-size="pagesize"
                    layout="prev, pager, next, jumper"
                    :total="totalchuli">
                    </el-pagination>
                </div>
            </span>
	        <!--分配弹框部分-->
			<div class="popUp" v-if="isDistribute">
	            <div class="mask"></div>
	            <div class="succ-pop distribute">
	                <div class="title">
	                    <a>提示</a>
	                    <div class="el-icon-close" @click="isDistribute=false"></div>
	                </div>
	                <div class="content">
                		<span>责任主体</span>
                		<el-select v-model="distributePopVal" placeholder="请选择" @change="selectFenPeiChangeDuty">
						    <el-option
						      v-for="item in optionsDistributePop"
						      :key="item.id"
						      :label="item.realname"
						      :value="item.id">
						    </el-option>
						</el-select>
                        <div class="block" style="margin-top:5px">
                            <span class="demonstration">设置时限</span>
                            <el-date-picker
                                v-model="limitTime"
                                type="datetime"
                                format='yyyy-MM-dd HH:mm:ss'
                                value-format='yyyy-MM-dd HH:mm:ss'
                                placeholder="选择日期">
                            </el-date-picker>
                        </div>
						<el-row style='position: absolute;bottom: 20px;right: 30px;'>
							<el-button type="primary" @click='GetEditCase'>确定</el-button>
							<el-button plain @click='isDistribute=false'>取消</el-button>
						</el-row>
	               </div>
	            </div>
	        </div>
            <!-- 处理部门案后描述 -->
            <div class="popUp" v-if="isClose">
	            <div class="mask"></div>
	            <div class="succ-pop distribute">
	                <div class="title">
	                    <a>提示</a>
	                    <div class="el-icon-close" @click="isClose=false"></div>
	                </div>
	                <div class="content">
                		<span>案后描述</span>
                		<el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="chuliarea">
                        </el-input>
						<el-row style='position: absolute;bottom: 20px;right: 30px;'>
							<el-button type="primary" @click='chuliEnter'>确定</el-button>
							<el-button plain @click='isClose=false'>取消</el-button>
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
                ruleForm: {
                    //casecode:'',
                    caselevel: '',
                    casesource: '',
                    location: '',
                    lonlat:'',
                    zrksryid:'',
                    zhzxryid:'',
                    description: ''
                },
                rules: {
                    // casecode: [
                    //     { required: true, message: '请输入案件编号', trigger: 'blur' }
                    //   ],
                    caselevel: [
                        { required: true, message: '请选择案件等级', trigger: 'change' }
                      ],
                      casesource: [
                        { required: true, message: '请选择案件来源', trigger: 'change' }
                      ],
                      zrksryid: [
                       { required: true, message: '请选择责任科室', trigger: 'change' }
                      ],
                      location: [
                        { required: true, message: '请输入案件位置', trigger: 'blur' }
                      ],
                      lonlat: [
                        { required: true, message: '请输入经纬度', trigger: 'blur' }
                      ],
                },
                zhzxdata:[],
                totalzhzx:1,
                anjVisible:false,
                ksryoptions:[
                    {
                        value: '1',
                        label: 'ingeleisi'
                    }
                ],
            	progress: 0,//上传进度
				pass: null,//是否上传成功
				isEnlargeImage: false,//放大图片
		//		enlargeImage: '',//放大图片地址
				imagelist: [],
				params: {
//					action:
//					'http://gkpt.zq12369.com:8013/servicePlatform/admin/caseData/uploadAnalysisFile',
					data: {}
				},
            	//上传图片
            	dialogImageUrl: '',
		        //责任主体
            	optionsDuty: [],
		        //污染类别
            	optionsPollution: [],
		        //分配弹框责任主体选择
		        optionsDistributePop: [],
            	//县市区选择
               	options: [],
               	gridCode:'',
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
             imgUrl:'',
             userInfo:{},
             chuliData:[],
             isClose:false,
             chuliarea:'',
             totalchuli:10,
             pageNum:1,
             pageNo:1,
             zrksdata:[],
             limitTime:'',
             dispatchId:'',
             totalzrks:10
            }
        },
        created(){
            console.log(this.getlocal('userInfo'));
            this.userInfo = this.getlocal('userInfo').data;
            this.selectClbmCasePage();//处理部门案件
            this.selectZrksCasePage();//责任科室案件
        },
        mounted() {
        	this.getzhzxlist();
            this.GetCaseAll();//分配单位
            this.GetCaseAllZhzx();
        	// this.GetPollutionType();//污染类别
        	this.imgUrl = api.CaseImgUp();
        	//console.log(this.imgUrl)
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
            //案件入录
            submitForm(formName) {
                const _this = this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let parmdata = {
                            zrksryid:_this.ruleForm.zrksryid,//责任科室人员id,多个用逗号分隔
                            zhzxryid:_this.userInfo.id//指挥中心人员id
                        };
                        console.log(parmdata);
                        let params = Object.assign(_this.ruleForm,parmdata);
                        api.addcaseResource(params).then(res=>{
                            if(res.data.status == 1){
                                _this.$message.success("入录成功")
                                setTimeout(()=>{
                                    _this.ruleForm = {
                                        //casecode:'',
                                        caselevel: '',
                                        casesource: '',
                                        location: '',
                                        lonlat:'',
                                        zrksryid:[],
                                        zhzxryid:'',
                                        description: ''
                                    };
                                    _this.$refs[formName].resetFields();
                                    _this.getzhzxlist();
                                },600)
                            }
                        })

                    } else {
                        _this.$message.error("入录失败")
                        return false;
                    }
                });

            },
            //
            handleChangezhzx(val){
                 this.pageNo = val;
                 this.getzhzxlist();
            },
            selectzrks(value){
                this.ruleForm.zrksryid = value;
            },
            selectanjdj(value) {
                this.ruleForm.caselevel = value;
            },
            selectanjly(value) {
                this.ruleForm.casesource = value;
            },
        	uploadOnProgress(e,file){//开始上传
				//console.log(e.percent,file)
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
           //指挥中心案件列表
           getzhzxlist(){
                let userId = this.userInfo.id;
                let pageNum = this.pageNo;
                let pageSize ='10';
                api.GetpostzhzxlistResource(userId,pageNum,pageSize).then(res=>{
                    console.log(res)
                    this.totalzhzx = res.data.data.total;
                    this.zhzxdata = res.data.data.list;
                })
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
        		this.dispatchId = row.id;
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
      		//获取分配单位
      		GetCaseAll(){
                  let t = this;
                  let type = '2';
      			api.GetCaseAll(type).then(result=>{
                      console.log(result)
                      if(result.data.status == 1){
                        t.optionsDistributePop = result.data.data;
                      }
      			})
              },
              GetCaseAllZhzx(){
                  let t = this;
                  let type = '1';
      			api.GetCaseAll(type).then(result=>{
                      console.log(result)
                      if(result.data.status == 1){
                         t.ksryoptions = result.data.data;
                      }
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
      		//责任科室分配案件
      		GetEditCase(){
      			let t = this;
      			let id = this.dispatchId;
      			let assignuserid  = this.distributePopVal;
                  let date = this.limitTime;
                  console.log(date)
      			api.GetEditCase(id,assignuserid,date).then(res=>{
                    if(res.data.status ==1){
                        t.isDistribute = false;
                          t.selectZrksCasePage();
                          this.$message({type:'success',message:'分配成功'})
                    }
      				
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
            },
             getlocal(name) {
		        let data = sessionStorage.getItem(name)
		        if (data != null && data != '') {
		            try {
		                let obj = eval('(' + data + ')')
		                return obj
		            } catch (e) {
		                return ''
		            }
		        } else {
		            return ''
		        }
            },
            //获取处理部门案件列表
            selectClbmCasePage(){
                let userId = this.userInfo.id;
                let pageNum = this.pageNum;
                let pageSize = 10;
                this.chuliData = [];
                api.selectClbmCasePage(userId,pageNum,pageSize).then(res=>{
                    if(res.data.status==1){
                        let data = res.data.data.list;
                        this.totalchuli = res.data.data.total;
                         console.log(res)
                         data.forEach(item=>{
                                let tableData = {};
                                if(item.casestatus!=='3'){
                                    if(item.isOversee){
                                        tableData.casestatus = '督办中';
                                    }else{
                                        tableData.casestatus = '待处理';
                                    }
                                }else{
                                    tableData.casestatus = '处理完成';
                                }
								// tableData.casestatus = this.changeStatus(item.casestatus);
								tableData.createTime = item.createTime;
								tableData.caselevel = this.changeLevel(item.caselevel);
								tableData.location = item.location;
								tableData.code = item.code;
								tableData.id = item.id;
								tableData.description = item.description;
								tableData.casesource = this.changeCaseSource(item.casesource);
								tableData.isOversee = item.isOversee?'督办中':'待处理';
		                        this.chuliData.push(tableData);
							})
                    }
                   
                })
            },
            changeStatus(code){
                switch (code) {
                    case '2':
                        return '处理人员待操作'
                        break;
                    case '3':
                        return '处理完成'
                        break;
                    default:
                        break;
                }
            },
            changeLevel(code){
                switch (code) {
                    case 0:
                        return '普通'
                        break;
                    case 1:
                        return '紧急'
                        break;
                    default:
                        break;
                }
            },
            changeCaseSource(code){
                switch (code) {
                    case '1':
                        return '信访平台'
                        break;
                    case '2':
                        return '信访电话'
                        break;
                    case '3':
                        return '平台发现'
                        break;
                        case '4':
                        return '巡查'
                        break;
                    default:
                        break;
                }
            },
            handleAfterClick(row){
                this.isClose = true;
                this.chuliId = row.id;
            },
            chuliEnter(){
                let id = this.chuliId;
                let afterRemake = this.chuliarea;
                api.disposeCase(id,afterRemake).then(res=>{
                    console.log(res)
                    if(res.data.status==1){
                        this.$message({type:'success',message:'处理成功'});
                        this.selectClbmCasePage();
                        this.isClose = false;
                    }else{
                        this.$message({type:'error',message:'处理失败'});
                        this.isClose = false;
                    }
                })
            },
            handleCurrentchuli(val){
                this.pageNum = val;
                this.selectClbmCasePage();
            },
            //获取责任科室案件列表
            selectZrksCasePage(){
                let userId = this.userInfo.id;
                let pageNum = this.pageNo;
                let pageSize = 10;
                this.zrksdata = [];
                api.selectZrksCasePage(userId,pageNum,pageSize).then(res=>{
                    if(res.data.status==1){
                        let data = res.data.data.list;
                        this.totalzrks = res.data.data.total;
                         console.log(res)
                         data.forEach(item=>{
                                let tableData = {};
                                if(item.casestatus=='1'){
                                    tableData.casestatus = '待处理';
                                }else if(item.casestatus=='2'){
                                    tableData.casestatus = '处理中';
                                    if(item.caselevel == '3'){
                                        // tableData.casestatus = '待督办';
                                        tableData.casestatus = '处理中';
                                    }else{
                                        tableData.casestatus = '督办中';
                                    }
                                    // if(item.caselevel == '0'){
                                    //     // tableData.casestatus = '待督办';
                                        
                                    // }
                                }else{
                                    tableData.casestatus = '处理完成';
                                }
								// tableData.casestatus = item.casestatus;
								tableData.description = item.description;
								tableData.createTime = item.createTime;
								tableData.caselevel = item.caselevel;
								tableData.location = item.location;
								tableData.code = item.code;
								tableData.casesource = this.changeCaseSource(item.casesource);
								tableData.id = item.id;
		                        this.zrksdata.push(tableData);
							})
                    }
                   
                })
            },
            handleChangezrks(val){
                this.pageNo = val;
                this.selectZrksCasePage();
            },
            handleDubanClick(row){
                let id = row.id;
                api.duBanCase(id).then(res=>{
                    if(res.data.status ==1){
                        this.$message({type:'success',message:'督办成功'});
                        this.selectZrksCasePage();
                    }else{
                        this.$message({type:'error',message:'督办失败'});
                    }
                })
            }
        }, 
    }
</script>
<!---->
<style lang="scss">
    .CaseReview{
        .el-form-item__content{
            margin-right: 20px;
            .el-select,.el-input{
                width: 100%!important;
            }
        }
    }
</style>
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
                padding: 20px;
                .el-textarea{
                    width: 250px;
                }
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
