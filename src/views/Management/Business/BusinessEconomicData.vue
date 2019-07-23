<!--后台管理-经济数据管理-->
<template>
    <div class="economic">
		<!---->
		<div class="gf-title"><i></i><span>经济数据</span></div>
		<!---->
		<div class="gf-conbtn">
			<!---->
			<div class="jj-left">
				<!---->
				<div style="float: left;width: 240px;margin-top: 8px;">
					<div style="float: left;padding-right: 15px">名称</div><el-input style="width: 180px" v-model="input" placeholder="请输入内容"></el-input>
				</div>
				<!---->
				<div style="float: left;margin-left: 30px;margin-top: 8px;">
					<span style="padding-right: 10px">类别</span>
					<el-select v-model="value" placeholder="请选择" @change="handerchage">
						<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
						</el-option>
					</el-select>
				</div>
			</div>
			<!---->
			<div style="margin-top: 15px;float: left;margin-left: 20px">
				<!---->
				<el-button type="primary" @click="QueryData">查询</el-button>
				<!---->
				<el-button type="primary" @click="Addmeetclee">添加经济数据</el-button>
			</div>
		</div>
		<!---->
		<div class="gf-title"><i></i><span>列表</span></div>
		<!---->
		<div class="gfbg-tables">
			<!--表格-->
			<div class="table-contin">
				<el-table
						:data="tableData"
						border
						style="width: 100%">
					<el-table-column
							prop="fileName"
							label="名称"
							width="300">
					</el-table-column>
					<el-table-column
							prop="fileType"
							label="类别"
							>
					</el-table-column>
					<el-table-column
							prop="time"
							label="上传时间"
							>
					</el-table-column>
					<el-table-column
							label="操作"
							width="200">
						<template scope="scope">
							<el-button @click="handleClick(scope.row)" type="text" size="small" class='eidt'>下载</el-button>
							<span style="color: #eee;">|</span>
							<span class="OverBox">
			        	<el-button type="text" size="small" class='InfoEnd' @click="deleteClick(scope.row)">删除</el-button>
			        </span>
						</template>
					</el-table-column>
				</el-table>
			</div>

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
		</div>
		<!-- 弹窗 -->
		<el-dialog :title="popTit" :visible.sync="dialogFormVisibleKrp">
			<!--弹窗-->
			<el-col :span="24" class="warp-main">
				<el-form ref="infoForm" :model="infoForm" label-width="120px">
					<div class="busin-class">
						<el-form-item label="类别">
							<el-select v-model="infoForm.a_leibie" placeholder="请选择类别">
								<el-option
										v-for="item in a_leibieoptions"
										:key="item.value"
										:label="item.label"
										:value="item.value">
								</el-option>
							</el-select>

						</el-form-item>
						<!---->
						<div class="" style="width: 320px;height: 50px">
							<el-form-item label="名称">
								<el-input v-model="infoForm.a_mingcheng"></el-input>
							</el-form-item>
						</div>
						<!---->
						<div class="" style="margin-left: 100px">
							<div class="content">
									<input type="text" class="Insert" style="padding-left: 15px"/>
								<!--http://gkpt.zq12369.com:8013-->
									<el-upload
											class="upload-demo"
											method:="post"
											ref="upload"
											multiple
											:action="updataurl"
											:file-list="fileList"
											:limit="1"
											name="uploadFile"
											:beforeUpload="beforeAvatarUpload"
											:on-change="changeFileList"
											:on-preview="handlePreview"
											:on-exceed="handleExceed"
											:on-remove="handleRemove"
											:before-remove="beforeRemove"
									>
										<el-button style="margin-left: 10px;float: left;height: 36px" slot="trigger" size="small">选择附件</el-button>
									</el-upload>
							</div>
						</div>

					</div>
					<!---->
					<div class="bj-bottom">
						<el-form-item>
							<el-button type="primary"  @click="onSubmit">确定</el-button>
							<el-button  @click="dialogFormVisibleKrp = false">取消</el-button>
						</el-form-item>
					</div>
				</el-form>
			</el-col>
		</el-dialog>
    </div>
</template>

<script>

    import api from '../../../api/index'
    export default {
        name: 'economic',
        data() {
            return {
                //
                infoForm: {
                        a_mingcheng:'',
                        a_leibie:'全市生产总值',
                        fileList:[]
					},
				//
                fileList:[],
				//
                a_leibieoptions:[
					{
					    value:'1',
						label:'全市生产总值'
					},
                    {
                        value:'2',
                        label:'规模以上工业分行业增加值'
                    },
                    {
                        value:'3',
                        label:'规模以上工业生产'
                    },
                    {
                        value:'4',
                        label:'能源消耗'
                    }
				],
				//
                options:[
                    {
                        value:'1',
                        label:'全市生产总值'
                    },
                    {
                        value:'2',
                        label:'规模以上工业分行业增加值'
                    },
                    {
                        value:'3',
                        label:'规模以上工业生产'
                    },
                    {
                        value:'4',
                        label:'能源消耗'
                    }
				],
				//
                popTit:'添加经济数据',
                //
                dialogFormVisibleKrp:false,
				//
                value:'全市生产总值',
                //
                input: '',
                //
                tableData:[
					{
                        Warning:'2018年第一季度空气质量报告',
                        Content:'生态环境部',
                        BeginTime:'报告类',
                        EndTime:'2018-04-13 15:20:29'
					},
                    {
                        Warning:'2018年第一季度空气质量报告',
                        Content:'生态环境部',
                        BeginTime:'报告类',
                        EndTime:'2018-04-13 15:20:29'
                    },
                    {
                        Warning:'2018年第一季度空气质量报告',
                        Content:'生态环境部',
                        BeginTime:'报告类',
                        EndTime:'2018-04-13 15:20:29'
                    },
                    {
                        Warning:'2018年第一季度空气质量报告',
                        Content:'生态环境部',
                        BeginTime:'报告类',
                        EndTime:'2018-04-13 15:20:29'
                    },
                    {
                        Warning:'2018年第一季度空气质量报告',
                        Content:'生态环境部',
                        BeginTime:'报告类',
                        EndTime:'2018-04-13 15:20:29'
                    },{
                        Warning:'2018年第一季度空气质量报告',
                        Content:'生态环境部',
                        BeginTime:'报告类',
                        EndTime:'2018-04-13 15:20:29'
                    },
                    {
                        Warning:'2018年第一季度空气质量报告',
                        Content:'生态环境部',
                        BeginTime:'报告类',
                        EndTime:'2018-04-13 15:20:29'
                    },
                    {
                        Warning:'2018年第一季度空气质量报告',
                        Content:'生态环境部',
                        BeginTime:'报告类',
                        EndTime:'2018-04-13 15:20:29'
                    },{
                        Warning:'2018年第一季度空气质量报告',
                        Content:'生态环境部',
                        BeginTime:'报告类',
                        EndTime:'2018-04-13 15:20:29'
                    },
                    {
                        Warning:'2018年第一季度空气质量报告',
                        Content:'生态环境部',
                        BeginTime:'报告类',
                        EndTime:'2018-04-13 15:20:29'
                    },
                    {
                        Warning:'2018年第一季度空气质量报告',
                        Content:'生态环境部',
                        BeginTime:'报告类',
                        EndTime:'2018-04-13 15:20:29'
                    }

				],
				//
                totalCount:100,
				//
                pagesize:10,
				//
                currentPage:10,
				//已选择value
                callvalue:"",
				//
                updataurl:'',
            }
        },
        created(){

        },
        mounted() {
            $(".el-dialog").css("width","500px");
            //
            this.QueryDataRequests('', '',10,1);
            //
			this.updataurl = api.UploadAnalysisFileRes();
        },
        computed: {

        },
        methods: {
            //添加
            Addmeetclee(){
                this.popTit = '添加经济数据';
                this.dialogFormVisibleKrp = true;
			},
			//查询数据
            QueryData(){
                let fileName = this.input;
                let fileType = this.callvalue || 1;
                let pageSize = 10;
                let pageNo = 1;
                this.QueryDataRequests(fileName,fileType,pageSize,pageNo)
			},
			//
            handerchage(val){
                //console.log(val)
				this.callvalue = val;
			},
			//
            handleCurrentChange(){},
			//
            handleSizeChange(){},
			//下载事件
            handleClick(val){
                //console.log(val)
                let id = val.id;
                //下载方法
                api.GetFileByIdResource(id);
			},
			//选择上传文件改变事件
            changeFileList(file){
                console.log(file)
                //
                $(".Insert").val(file.name);
                //
				setTimeout(()=>{
                    this.infoForm.fileList = file.response.path_filename;
				},500)
				//console.log(file.response[path_filename])
            },
            //初数据始化列表
            InitonData(data) {
                const _this = this;
                //
                _this.tableData = [];
                //
                data.forEach(item => {
                    const tableData = {};
                    tableData.time = this.timestampToTime(item.createTime);//时间
                    tableData.fileName = item.fileName;//名称
                    tableData.fileType = this.typePagechange(item.fileType);//类型
                    tableData.id = item.id;//id
                    tableData.remark = item.remark;//描述
                    ///
                    _this.tableData.push(tableData)
                })

            },
            //删除方法
            deleteClick(val){
                let id = val.id;
                this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    //删除方法地区
                    this.deletclick(id);

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //
            typePagechange(val){
                let data;
                switch (val){
                    case '1':
                        data = '全市生产总值';
                        break;
                    case '2':
                        data = '规模以上工业分行业增加值'
                        break;
                    case '3':
                        data = '规模以上工业生产'
                        break;
                    case '4':
                        data = '能源消耗'
                        break;
                }
                return data;
            },
			//提交数据
            onSubmit(){
                ///
				let fileName = this.infoForm.a_mingcheng;
                let fileType = this.infoForm.a_leibie;
                let filePath = this.infoForm.fileList;
                let remark = '测试文件';
				//
                this.SaveDataRequests(fileName,fileType,filePath,remark)
				console.log(this.infoForm)
				//
				setTimeout(() =>{
                    this.QueryDataRequests('',this.callvalue,10,1);
                    this.dialogFormVisibleKrp = false;
				},600)

			},
			//
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
			//弹出移除是否
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
			//提示上传数量
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
			//上传类型以及大小控制
            beforeAvatarUpload(file) {
                let testmsg = file.name.substring(file.name.lastIndexOf('.')+1)
                const extension = testmsg === 'xls'
                const extension2 = testmsg === 'xlsx'
                const isLt2M = file.size / 1024 / 1024 < 1
                if(!extension && !extension2) {
                    this.$message({
                        message: '上传文件只能是 xls、xlsx格式!',
                        type: 'warning'
                    });
                }
                if(!isLt2M) {
                    this.$message({
                        message: '上传文件大小不能超过 1MB!',
                        type: 'warning'
                    });
                }
                return extension || extension2 && isLt2M
            },
			//时间戳转换时间
            timestampToTime(timestamp) {
                let date = new Date(timestamp);//如果date为10位不需要乘1000
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
                let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
                let m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
                let s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
                return Y+M+D+h+m+s;
			},
            //
            handlePreview(file) {
                console.log(file);
               // console.log(file.name)
            },
            //根据id查询经济数据
            SaveDataRequests(id){
                //id;id名称
                api.GetsaveEconomicData3(id).then(res =>{
                    console.log(res);
                    ///
                })
            },
            //保存经济数据
            SaveDataRequests(fileName,fileType,filePath,remark){
                //fileName;名称
                //fileType;文件类型
                //filePath;文件路径
                //remark;备注
                api.GetsaveEconomicData2(fileName,fileType,filePath,remark).then(res =>{
                    console.log(res);
                    if(res.data.status === 1){
                        //
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
					}else{
                        this.$message.error(res.data.msg);
					}

                })
            },
			//删除方法
			deletclick(Id){
                //
                api.GetdeteletedById(Id).then(res =>{
                    console.log(res);
                    if(res.data.status === 1){
                        //
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        //
                        setTimeout(() =>{
                            this.QueryDataRequests('',this.callvalue,10,1);
                        },600)
                    }else{
                        this.$message.error(res.data.msg);
                    }
				})
			},
            //分页查询经济数据列表
            QueryDataRequests(fileName,fileType,pageSize,pageNo){
                //fileName;名称
                //fileType;文件类型
                //pageSize;一页数量
                //pageNo;页码
                api.GetsaveEconomicData1(fileName,fileType,pageSize,pageNo).then(res =>{
                    console.log(res);
                    let data = res.data.list;
                    this.totalCount = data.length;
                    this.InitonData(data)
                })
            },
		}

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
	.economic{
		width: calc(100% - 200px);
		overflow: hidden;
		padding: 20px;
		background-color: #f6fbff;
		.warp-main{
			width: 500px;
			background: #fff;
			margin-left: -20px;
			padding-right: 25px;
			border-bottom-left-radius: 10px;
			border-bottom-right-radius: 10px;
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
				margin-left: -10px;
				border: none;
				border: 1px solid #c8c9cb;
				border-radius:5px;
				outline: none;
				width: 200px;
				height: 36px;
				float: left;
			}
		}

		.busin-class{
			text-align: left;
			margin-left: -20px;
		}
		.gf-conbtn{
			width: 100%;
			height: 60px;
			text-align: left;
			overflow: hidden;
			.jj-left{
				width: 550px;
				height: 50px;
				line-height: 50px;
				float: left;
			}
		}
		.gf-title{
			margin-top: 10px;
			width: 100%;
			text-align: left;
			height: 36px;
			line-height: 36px;
			font-size: 16px;
			border-bottom: solid 1px #ccc;
			span{
				display: block;
				float: left;
			}
			i{
				display: block;
				float: left;
				width: 2px;
				height: 20px;
				background: #1080cc;
				margin-top: 8px;
				padding-right: 3px;
				margin-right: 10px;
			}
		}
		.gfbg-tables{
			.table-contin{
				margin-top: 15px;
			}
			.page{
				.demonstration{
					float: left;
				}
			}
		}
	}
</style>
