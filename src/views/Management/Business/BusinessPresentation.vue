<!--后台管理-官方报告-->
<template>
    <div class="Presentation">
		<!---->
		<div class="gf-title"><i></i><span>官方报告</span></div>
		<!---->
		<div class="gf-conbtn">
			<div style="width: 20%;margin-top: 15px;float: left;margin-left: 0px">
				<!---->
				<el-button type="primary" @click="Addmeetclee">添加官方报告</el-button>
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
							prop="Title"
							label="标题"
							width="300">
					</el-table-column>
					<el-table-column
							prop="Source"
							label="文件来源"
							>
					</el-table-column>
					<el-table-column
							prop="Category"
							label="文件类别"
							>
					</el-table-column>
					<el-table-column
							prop="UpdateTime"
							label="上传时间"
							>
					</el-table-column>
					<el-table-column
							label="操作"
							width="200">
						<template scope="scope">
							<el-button @click="handleClick(scope.row)" type="text" size="small" class='eidt'>编辑</el-button>
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
		<el-dialog :title="popTit" style="height: auto" :visible.sync="dialogFormVisible">
			<!--弹窗-->
			<el-col :span="24" class="warp-main">
				<el-form ref="infoForm" :model="infoForm" :rules="rules" label-width="120px">
					<div class="class-bjbg">
						<div class="bj-left">
							<el-form-item label="文件来源" prop="a_laiyuan">
								<el-select v-model="infoForm.a_laiyuan" placeholder="请选择" @change="xunaChange">
									<el-option
											v-for="item in a_laiyuanoptions"
											:key="item.value"
											:label="item.label"
											:value="item.value">
									</el-option>
								</el-select>

							</el-form-item>
						</div>
						<div class="bj-right">
							<!---->
							<el-form-item label="文件类别" prop="a_leibie">
								<el-select v-model="infoForm.a_leibie" placeholder="请选择" @change="xuanChange2">
									<el-option
											v-for="item in a_leibieoptions"
											:key="item.Key"
											:label="item.Value"
											:value="item.Key">
									</el-option>
								</el-select>

							</el-form-item>
						</div>
					</div>
					<!---->
					<el-form-item label="标题" prop="a_title">
						<el-input v-model="infoForm.a_title"></el-input>
					</el-form-item>
					<!---->
					<el-form-item label="内容" prop="a_content">
						<!-- :options="editorOption"-->
						<div class="edit_container">
							<quill-editor v-model="infoForm.a_content"
										  ref="myQuillEditor"
										  class="editer"
										  @ready="onEditorReady($event)">
							</quill-editor>
						</div>
					</el-form-item>
					<!---->
					<div class="bj-bottom">
						<el-form-item>
							<el-button type="primary" @click="onSubmit">确定</el-button>
							<el-button  @click="dialogFormVisible=false">取消</el-button>
						</el-form-item>
					</div>

				</el-form>
			</el-col>
		</el-dialog>
    </div>
</template>

<script>

    import api from '../../../api/index'
    import { quillEditor } from 'vue-quill-editor' //调用编辑器
    export default {
        name: 'Presentation',
        data() {
            return {
                //
                a_laiyuanoptions:[],
				//
                a_leibieoptions:[],
				//
                popTit:'添加官方报告',
                //
                dialogFormVisible:false,
				//
                tableData:[],
				//
                totalCount:100,
				//
                pagesize:10,
				//
                currentPage:10,
				//保存的id
                cunId:'',
				//
                infoForm: {
                    a_title: '',
                    a_leibie: '',
                    a_laiyuan: '',
                    a_content:'',
                    editorOption: {}
                },
				//
                firstKey:'',
				//
                secondKey:'',
                //表单验证
                rules: {
                    a_leibie: [
                        {required: true, message: '请选择类别', trigger: 'change'}
                    ],
                    a_laiyuan: [
                        {required: true, message: '请选择来源', trigger: 'change'}
                    ],
                    a_title: [
                        {required: true, message: '请输入标题', trigger: 'blur'}
                    ],
                    a_content: [
                        {required: true, message: '请输入详细内容', trigger: 'blur'}
                    ]
                },
				//
                allData:[]
            }
        },
        created(){
			//
			//

        },
        computed: {
            editor() {
                return this.$refs.myQuillEditor.quill
            }
        },
        mounted() {
            $(".el-dialog").css("width","900px");
            //
			this.initRequest();
            //
            this.ListRequest();
        },
        methods: {
            //
            initRequest(){
                //
                api.GetgfbgGetSourcer().then(res =>{
                    console.log(res);
                    let list = res.data.Data;
                    //
                    list.forEach(item =>{
                        const lost ={
                            label:item.Source.Value,
                            value:item.Source.Key,
                        }
                        this.a_laiyuanoptions.push(lost);
                    })
                    //默认值设置
                    this.SwitchMenuChange(this.a_laiyuanoptions[0].value);
                    this.firstKey = 1;
                })

			},
            //
            xunaChange(val){
                console.log(val)
                this.firstKey = val;
				this.SwitchMenuChange(val);
			},
			//
            xuanChange2(val){
                console.log(val);
                this.secondKey = val;
			},
            //
            SwitchMenuChange(value){
                let keyvalue = value;
                this.a_leibieoptions =[];
                api.GetgfbgGetSourcer().then(res =>{
                    //console.log(res);
                    let list = res.data.Data;
                    list.forEach(item =>{
                        if(item.Source.Key === keyvalue){
                            this.a_leibieoptions = item.Category
                        }
                    })
                    //获取默认值
                    this.secondKey = this.a_leibieoptions[0].value;
                })
            },
            //添加
            Addmeetclee(){
                this.popTit = '添加官方报告';
                this.dialogFormVisible = true;
                this.infoForm = {
                    a_title: '',
                        a_leibie: '',
                        a_laiyuan: '',
                        a_content:'',
                        editorOption: {}
                }
			},
			//
            htmlEncode(str) {
                let s = "";
                if(str.length == 0) return "";
				s = str.replace(/&/g,"&amp;");
				s = s.replace(/</g,"&lt;");
				s = s.replace(/>/g,"&gt;");
				s = s.replace(/ /g,"&nbsp;");
				s = s.replace(/\'/g,"&#39;");
				s = s.replace(/\"/g,"&quot;");
                return s
            },
			//
            htmlDecodeByRegExp(str) {
				let s = "";
				if(str.length == 0) return "";
				s = str.replace(/&amp;/g,"&");
				s = s.replace(/&lt;/g,"<");
				s = s.replace(/&gt;/g,">");
				s = s.replace(/&nbsp;/g," ");
				s = s.replace(/&#39;/g,"\'");
				s = s.replace(/&quot;/g,"\"");
				return s;
			},
			//修改方法
            ModifyRequest(ID,Source,Category,Content,Title){
                api.PostgfbgUpdateR(ID,Source,Category,Content,Title).then(res =>{
                    console.log(res)
                    if(res.data.Status === 1){
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                    }
				})
			},
			//删除方法
            DeleteRequest(Id){
                api.GetgfbgDeleteR(Id).then(res =>{
                    console.log(res)
                    if(res.data.Status === 1){
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    }
                    //
                    this.ListRequest();
				})
			},
			//新增方法
            newAddRequest(Source,Category,Content,Title){
                api.PostgfbgInsertR(Source,Category,Content,Title).then(res =>{
                    console.log(res);
					if(res.data.Status === 1){
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
					}
				})
			},
			//获取单个
            GetSingleRequest(Id){
                api.GetgfbgSingleRe(Id).then(res =>{
                    console.log(res)
					let item = res.data.Data.data;
                    console.log(item)
                     const infoForm = {
                            a_title: item.Title,
                            a_leibie: this.getImagesTarget2(item.Source),
                            a_laiyuan: this.getImagesTarget(item.Category),
                            a_content:this.htmlDecodeByRegExp(item.Content)
                     }
                    //
					this.infoForm = infoForm;
					//修改默认值
                    this.firstKey = item.Source;
                    this.secondKey = item.Category;
				})

			},
            //请求列表
            ListRequest(){
                this.tableData = [];
                this.allData = [];
                api.GetgfbgGetListR('','','').then(res =>{
                    let data = res.data.Data;
                    this.totalCount = data.length;
                    console.log(data)
                    data.forEach(item =>{
                        const dalist ={
                            id:item.ID,
                            Title:item.Title,
                            Source:item.Source,
                            Category:item.Category,
                            UpdateTime:(item.UpdateTime).replace('T',' ')
                        }
                        this.allData.push(dalist);
                    })
                    this.setPageTable(10, 1);
                })
            },
            //转换001
            getImagesTarget(type) {
                let rtValue;
                console.log(typeof type);
                switch (type) {
                    case 1:
                        rtValue = '生态环境部';
                        break;
                    case 2:
                        rtValue = '河北省发布';
                        break;
                    case 3:
                        rtValue = '廊坊市监测站发布';
                        break;
                    case 4:
                        rtValue = '廊坊市政府发布';
                        break;
                    case 5:
                        rtValue = '廊坊日报发布';
                        break;
                    case 6:
                        rtValue = '廊坊市环保局发布';
                        break;
                }

                return rtValue;
            },
            //转换002
            getImagesTarget2(type) {
                let rtValue;
                switch (type) {
                    case 1:
                        rtValue = '报告类';
                        break;
                    case 2:
                        rtValue = '方案类';
                        break;
                    case 3:
                        rtValue = '新闻类';
                        break;
                }
                return rtValue;
            },
			//
            handleCurrentChange(val){
                console.log(val)
                this.setPageTable(10, val);
			},
			//
            handleSizeChange(val){
                console.log(val)
			},
            //分页效果
            setPageTable(pageSize, pageNum) {
                let rtValue = [];
                let startNum = pageSize * (pageNum - 1);
                for (let i = 0; i < pageSize; i++) {
                    if ((startNum + i + 1) > this.allData.length)
                        break;
                    rtValue.push(this.allData[startNum + i]);
                }
                this.tableData = rtValue;
            },
			//编辑按钮
            handleClick(row){
                this.popTit = '编辑官方报告';
				console.log(row);
                this.dialogFormVisible = true;
                //
                let Id = row.id;
                //
                this.cunId = Id;
                //获取单个
                this.GetSingleRequest(Id);
			},
			//
            deleteClick(val){
                //
                let Id = val.id;
                //
                this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                   //
                    this.DeleteRequest(Id);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
			},
			//
            onEditorReady(editor) {
				console.log(editor)
            },
			//
            onSubmit() {
                //提交
				console.log(this.infoForm)
				let Content = this.htmlEncode(this.infoForm.a_content);
				let Source = this.infoForm.a_laiyuan;
				let Category = this.infoForm.a_leibie;
				let Title = this.infoForm.a_title;
				let ID = this.cunId;
				//
				console.log(Content);
				if(this.popTit === '编辑官方报告'){
                    Source = this.firstKey;
                    Category = this.secondKey;
				    //
                    this.ModifyRequest(ID,Source,Category,Content,Title)
				}else {
				    //
                    this.newAddRequest(Source,Category,Content,Title);
				}
                //
				setTimeout(() =>{
                    this.dialogFormVisible = false;
                    this.ListRequest()
				},1000)
            }
		},
        components: {
			//使用编辑器
            quillEditor
        }

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
	.Presentation{
		width: calc(100% - 200px);
		overflow: hidden;
		padding: 20px;
		background-color: #f6fbff;
		.gf-conbtn{
			width: 100%;
			height: 50px;
			text-align: left;
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
		.warp-main{
			width: 900px;
			background: #fff;
			margin-left: -20px;
			padding-right: 25px;
			border-bottom-left-radius: 10px;
			border-bottom-right-radius: 10px;
			.class-bjbg{
				text-align: left;
				width: 100%;
				height: 50px;
				.bj-left{
					float: left;
					width: 50%;
				}
				.bj-right{
					float: left;
					width: 50%;
				}
			}
			.bj-bottom{
				text-align: right;
			}
		}
	}
</style>
