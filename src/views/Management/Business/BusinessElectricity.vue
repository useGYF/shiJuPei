<!--后台管理-用电量管理-->
<template>
    <div class="electricity">
		<!---->
		<div class="right">
			<!----------预警信息管理-->
			<div class="box">
                <div class="warning">
                    <a>区县用电量管理</a>
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
                                label="全部县区"
                                value="全部县区">
                        </el-option>
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
						<a @click="ElectricityReport">用电量报表</a>
					</span>
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
			<!--表格-->
			<div class="table-contin">
				<el-table

						:data="tableData"
						border
						style="width: 100%">
					<el-table-column
							prop="time"
							label="时间"
							width="220">
					</el-table-column>
                    <el-table-column
                            prop="gax"
                            label="固安县"
                            v-if="gax"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="acq"
                            label="安次区"
                            v-if="acq"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="kfq"
                            label="开发区"
                            v-if="kfq"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="gyq"
                            label="广阳区"
                            v-if="gyq"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="yqx"
                            label="永清县"
                            v-if="yqx"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="xhx"
                            label="香河县"
                            v-if="xhx"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="dcx"
                            label="大城县"
                            v-if="dcx"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="wax"
                            label="文安县"
                            v-if="wax"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="dcz"
                            label="大厂县"
                            v-if="dcz"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="bzs"
                            label="霸州市"
                            v-if="bzs"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="shs"
                            label="三河市"
                            v-if="shs"
                    >
                    </el-table-column>
				</el-table>
			</div>
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

		</div>
        <!-- 弹窗 -->
        <el-dialog title="批量导入" :visible.sync="dialogFormVisible">
            <!--弹窗-->
            <el-col :span="24" class="warp-main">
                <el-form ref="infoForm" :model="infoForm" label-width="120px">
                    <div class="bucrt-class">
                        <!---->
                        <div class="" style="margin-left: 140px">
                            <div class="content">
                              <!---->
                               <input type="text" class="Insert" style="padding-left: 15px"/>
                               <!--http://gkpt.zq12369.com:8016-->
                                <el-upload
                                        class="upload-demo"
                                        method:="post"
                                        ref="upload"
                                        multiple
                                        :action="yongdianurl"
                                        :file-list="fileList"
                                        name="UploadFile"
                                        :beforeUpload="beforeAvatarUpload"
                                        :on-change="changeFileList"
                                        :on-preview="handlePreview"
                                        :on-exceed="handleExceed"
                                        :on-remove="handleRemove"
                                        :before-remove="beforeRemove"
                                >
                                    <div>Excel样例&nbsp;:&nbsp;<a href="./static/Download/templateyd.xlsx" download="国省控点数据修正批量导入模板.xlsx">廊坊市每日工业电量情况表</a></div>
                                    <el-button style="margin-left: 10px;float: left;height: 36px" slot="trigger" size="small">选择附件</el-button>
                                </el-upload>
                            </div>
                        </div>

                    </div>
                    <!---->
                    <div class="bj-bottom">
                        <el-form-item>
                            <el-button type="primary"  @click="onSubmit">开始上传</el-button>
                        </el-form-item>
                    </div>
                </el-form>
            </el-col>
        </el-dialog>
        <!-- 弹窗 -->
        <el-dialog title="用电量填报" :visible.sync="dialogFormVisible2">
            <!--弹窗-->
            <el-col :span="24" class="warp-main">
                <el-form ref="infoFormk" :model="infoFormk" label-width="120px">
                    <el-form-item label="日期" required>
                        <el-col :span="11">
                            <el-form-item prop="date1">
                                <el-date-picker type="date" placeholder="选择日期" @change="timecreatChange" v-model="infoFormk.date" style="width: 100%;"></el-date-picker>
                            </el-form-item>
                        </el-col>

                    </el-form-item>
                    <div class="busin-class">
                        <!---->
                        <div class="divkaet">
                            <el-form-item label="三河市">
                                <el-input v-model="infoFormk.sanheshi"></el-input>
                            </el-form-item>
                            <!---->
                        </div>
                        <div class="divkaet">
                            <el-form-item label="大厂县">
                                <el-input v-model="infoFormk.dachangxian"></el-input>
                            </el-form-item>
                            <!---->
                        </div>
                        <div class="divkaet">
                            <el-form-item label="香河县">
                                <el-input v-model="infoFormk.xianghexian"></el-input>
                            </el-form-item>
                        </div>
                        <!---->
                    </div>
                    <div class="busin-class">
                        <!---->
                        <div class="divkaet">
                            <el-form-item label="永清县">
                                <el-input v-model="infoFormk.yongqingxian"></el-input>
                            </el-form-item>
                        </div>
                        <div class="divkaet">
                            <!---->
                            <el-form-item label="固安县">
                                <el-input v-model="infoFormk.guanxian"></el-input>
                            </el-form-item>
                        </div>
                        <div class="divkaet">
                            <!---->
                            <el-form-item label="霸州市">
                                <el-input v-model="infoFormk.bazhoushi"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="busin-class">
                        <!---->
                        <div class="divkaet">
                            <el-form-item label="文安县">
                                <el-input v-model="infoFormk.wenanxian"></el-input>
                            </el-form-item>

                        </div>
                        <div class="divkaet">
                            <!---->
                            <el-form-item label="大城县">
                                <el-input v-model="infoFormk.dachengxian"></el-input>
                            </el-form-item>
                        </div>
                        <div class="divkaet">
                            <!---->
                            <el-form-item label="开发区">
                                <el-input v-model="infoFormk.kaifaqu"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="busin-class">
                        <!---->
                        <div class="divkaet">
                            <el-form-item label="广阳区">
                                <el-input v-model="infoFormk.guangyangqu"></el-input>
                            </el-form-item>
                            <!---->
                        </div>
                        <div class="divkaet">
                            <el-form-item label="安次区">
                                <el-input v-model="infoFormk.anciqu"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <!---->
                    <div class="bj-bottom">
                        <el-form-item>
                            <el-button type="primary"  @click="onSubmit2">确定</el-button>
                            <el-button  @click="dialogFormVisible2=false">取消</el-button>
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
        name: 'electricity',
        data() {
            return {
                //
                dialogFormVisible:false,
                //
                dialogFormVisible2:false,
                //
                infoForm: {
                        a_mingcheng:'',
                        a_leibie:'',
                        fileList:''
                    },
                gridCode:'',
                value1: '',//县(市、区)
                value2: '',//开始时间
                value3: '',//结束时间
                value4: '',
                value5: '',
                value6: '',
                //
                yongdianurl:'',
                //
                infoFormk: {
                        date:'',
                        sanheshi:'',
                        dachangxian:'',
                        xianghexian:'',
                        yongqingxian:'',
                        guanxian:'',
                        bazhoushi:'',
                        wenanxian:'',
                        dachengxian:'',
                        kaifaqu:'',
                        guangyangqu:'',
                        anciqu:''
                    },
                //
                fileList:[],
            	//县市区选择
               	options: [],
		        tableData:[],
			    currentPage: 1,
			    pagesize:10,
			    isConfirm: false,
			    Upload: false,
				//查询
				startTime:'',
				endTime:'',
				TotalRowsCount:null,
				totalCount:1,
				InfoData:[],
				ListData:[],
				Id:'',
				fileList: [],
                gax:true,
                acq:true,
                kfq:true,
                gyq:true,
                yqx:true,
                xhx:true,
                dcx:true,
                wax:true,
                dcz:true,
                bzs:true,
                shs:true,
				isEdit:false,
                tableData:[
					{
					    time:'2018-11-11',
                        gax:222,
                        acq:111,
                        kfq:333,
                        gyq:444,
                        yqx:555,
                        xhx:666,
                        dcx:777,
                        wax:888,
                        dcz:999,
                        bzs:121,
                        shs:334
					}
				],
                //
                StatusChange:'',
                //
                city:'',
                //
                allData:[],
                //
                creatTime:'',
            }
        },
        created(){

        },
        mounted() {
            //弹出框样式
            $(".el-dialog").css("width","600px");
            //区县数据
            this.GetFirstGridDropDown();
            //获取默认数据
            let ndt = new Date();
            let ndt7 = new Date(ndt);
            ndt7.setDate(ndt.getDate() - 100);
            let start =  (ndt7.getFullYear() + '-' + (ndt7.getMonth() + 1) + '-' + ndt7.getDate());
            let end = (ndt.getFullYear() + '-' + (ndt.getMonth() + 1) + '-' + ndt.getDate());
            this.UsingElectriclistQuery(start,end,'全部县区');
            //
            this.yongdianurl = api.DianUploadFileRes();
        },
        computed: {
            
        },
        methods: {
            //填报数据
            ElectricityDataFilling(time,sh,dcx,xh,ga,bz,wa,dc,kf,gy,ac,yq){
                //上传数据
                api.PostydInsertR(time,sh,dcx,xh,ga,bz,wa,dc,kf,gy,ac,yq).then(res =>{
                    console.log(res)
                    if(res.data.Status === 1){
                        this.$message({
                            message: '填报成功',
                            type: 'success'
                        });
                    }else{
                        this.$message.error('填报失败');
                    }
                })
            },
            //查询列表
            UsingElectriclistQuery(startTime,endTime,city){
                /////
                api.PostydList(startTime,endTime).then(res =>{
                    console.log(res)
                    let data = res.data.Data;
                    this.totalCount = data.length;
                    this.InitonData(data);
                })

                const _this = this;
                let dataCt = city;
                //隐藏相应的地区表格
                switch (dataCt){
                    case '全部县区':
                        _this.gax=true;
                        _this.acq=true;
                        _this.kfq=true;
                        _this.gyq=true;
                        _this.yqx=true;
                        _this.xhx=true;
                        _this.dcx=true;
                        _this.wax=true;
                        _this.dcz=true;
                        _this.bzs=true;
                        _this.shs=true;
                        break;
                    case '固安县':
                        _this.gax=true;
                        _this.acq=false;
                        _this.kfq=false;
                        _this.gyq=false;
                        _this.yqx=false;
                        _this.xhx=false;
                        _this.dcx=false;
                        _this.wax=false;
                        _this.dcz=false;
                        _this.bzs=false;
                        _this.shs=false;
                        break;
                    case '大厂回族自治县':
                        _this.gax=false;
                        _this.acq=false;
                        _this.kfq=false;
                        _this.gyq=false;
                        _this.yqx=false;
                        _this.xhx=false;
                        _this.dcx=false;
                        _this.wax=false;
                        _this.dcz=true;
                        _this.bzs=false;
                        _this.shs=false;
                        break;
                    case '安次区':
                        _this.gax=false;
                        _this.acq=true;
                        _this.kfq=false;
                        _this.gyq=false;
                        _this.yqx=false;
                        _this.xhx=false;
                        _this.dcx=false;
                        _this.wax=false;
                        _this.dcz=false;
                        _this.bzs=false;
                        _this.shs=false;
                        break;
                    case '廊坊开发区':
                        _this.gax=false;
                        _this.acq=false;
                        _this.kfq=true;
                        _this.gyq=false;
                        _this.yqx=false;
                        _this.xhx=false;
                        _this.dcx=false;
                        _this.wax=false;
                        _this.dcz=false;
                        _this.bzs=false;
                        _this.shs=false;
                        break;
                    case '广阳区':
                        _this.gax=false;
                        _this.acq=false;
                        _this.kfq=false;
                        _this.gyq=true;
                        _this.yqx=false;
                        _this.xhx=false;
                        _this.dcx=false;
                        _this.wax=false;
                        _this.dcz=false;
                        _this.bzs=false;
                        _this.shs=false;
                        break;
                    case '永清县':
                        _this.gax=false;
                        _this.acq=false;
                        _this.kfq=false;
                        _this.gyq=false;
                        _this.yqx=true;
                        _this.xhx=false;
                        _this.dcx=false;
                        _this.wax=false;
                        _this.dcz=false;
                        _this.bzs=false;
                        _this.shs=false;
                        break;
                    case '香河县':
                        _this.gax=false;
                        _this.acq=false;
                        _this.kfq=false;
                        _this.gyq=false;
                        _this.yqx=false;
                        _this.xhx=true;
                        _this.dcx=false;
                        _this.wax=false;
                        _this.dcz=false;
                        _this.bzs=false;
                        _this.shs=false;
                        break;
                    case '大城县':
                        _this.gax=false;
                        _this.acq=false;
                        _this.kfq=false;
                        _this.gyq=false;
                        _this.yqx=false;
                        _this.xhx=false;
                        _this.dcx=true;
                        _this.wax=false;
                        _this.dcz=false;
                        _this.bzs=false;
                        _this.shs=false;
                        break;
                    case '文安县':
                        _this.gax=false;
                        _this.acq=false;
                        _this.kfq=false;
                        _this.gyq=false;
                        _this.yqx=false;
                        _this.xhx=false;
                        _this.dcx=false;
                        _this.wax=true;
                        _this.dcz=false;
                        _this.bzs=false;
                        _this.shs=false;
                        break;
                    case '霸州市':
                        _this.gax=false;
                        _this.acq=false;
                        _this.kfq=false;
                        _this.gyq=false;
                        _this.yqx=false;
                        _this.xhx=false;
                        _this.dcx=false;
                        _this.wax=false;
                        _this.dcz=false;
                        _this.bzs=true;
                        _this.shs=false;
                        break;
                    case '三河市':
                        _this.gax=false;
                        _this.acq=false;
                        _this.kfq=false;
                        _this.gyq=false;
                        _this.yqx=false;
                        _this.xhx=false;
                        _this.dcx=false;
                        _this.wax=false;
                        _this.dcz=false;
                        _this.bzs=false;
                        _this.shs=true;
                        break;
                }
            },
           	//批量上传文件
            onSubmit() {
                setTimeout(() =>{
                    this.dialogFormVisible = false;
                },1000)
                if(this.StatusChange === 1){
                    //
                    this.$message({
                        message: '上传成功！',
                        type: 'success'
                    });
                }else{
                    this.$message.error('上传失败！！！');
                }
		    } ,
            //填报数据上传
            onSubmit2(){
                let time = this.creatTime;
                let sh = this.infoFormk.sanheshi;
                let dcx = this.infoFormk.dachangxian;
                let xh = this.infoFormk.xianghexian;
                let ga = this.infoFormk.guanxian;
                let bz = this.infoFormk.bazhoushi;
                let wa = this.infoFormk.wenanxian;
                let dc = this.infoFormk.dachengxian;
                let kf = this.infoFormk.kaifaqu;
                let gy = this.infoFormk.guangyangqu;
                let ac = this.infoFormk.anciqu;
                let yq = this.infoFormk.yongqingxian;
                //数据填报
                this.ElectricityDataFilling(time,sh,dcx,xh,ga,bz,wa,dc,kf,gy,ac,yq);
                //
                setTimeout(()=>{
                    let ndt = new Date();
                    let ndt7 = new Date(ndt);
                    ndt7.setDate(ndt.getDate() - 100);
                    let start =  (ndt7.getFullYear() + '-' + (ndt7.getMonth() + 1) + '-' + ndt7.getDate());
                    let end = (ndt.getFullYear() + '-' + (ndt.getMonth() + 1) + '-' + ndt.getDate());
                    this.UsingElectriclistQuery(start,end,'全部县区');
                    this.dialogFormVisible2 = false;
                },1000)
                //

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
            //开始时间选择
        	startChange(val){
        		this.startTime = val;
        	},
        	//结束时间选择
        	endChange(val){
        		this.endTime = val;
        	},
            //
            timecreatChange(val){
                this.creatTime = val;
            },
      		//分页
      		 handleSizeChange(val) {
        		//console.log(`每页 ${val} 条`);
      		},
            //
      		handleCurrentChange(val) {
        		this.setPageTable(10, val);
      		},
            //数据填报
            ElectricityReport(){
                //
                this.dialogFormVisible2 = true;
            },
            //初数据始化列表
            InitonData(data) {
                const _this = this;
                ////
                _this.tableData = [];
                _this.allData = [];
                //
                data.forEach(item => {
                    const tableData = {};
                    tableData.time = (item.CreateTime).replace('T',' ');//时间
                    tableData.gax = item.ga;//
                    tableData.acq = item.ac;//
                    tableData.kfq = item.kf;//
                    tableData.gyq = item.gy;//
                    tableData.xhx = item.xh;//
                    tableData.dcx = item.dcx;//
                    tableData.wax = item.wa;//
                    tableData.dcz = item.dc;//
                    tableData.bzs = item.bz;//
                    tableData.shs = item.sh;//
                    tableData.yqx = item.yq;//
                    ///
                    _this.allData.push(tableData)
                })
                this.setPageTable(10, 1);
            },
      		//打开批量导入弹框
      		OpenInsert(){
      			//this.Upload = true;
                this.dialogFormVisible = true
      		},
      		//县区市选择
      		selectChange(value){
      			console.log(value);
      			this.city = value;
      		},
      		//获取日数据列表
      		GetMonitoringDay(){
                const t = this;
                let startTime = t.startTime?t.startTime:'';
                let endTime = t.endTime?t.endTime:'';
                let city = t.city;
                if(!startTime || !endTime){
                    this.$message({
                        message: '请选择开始和结束时间！！！',
                        type: 'warning'
                    });
                }
                if(startTime&&endTime){
                   this.UsingElectriclistQuery(startTime,endTime,city)
                }

      		},
      		//导出
      		ImportExel(){
      			const t = this;
      			let startTime = t.startTime?t.startTime:'';
      			let endTime = t.endTime?t.endTime:'';
      			console.log(startTime)
                console.log(endTime)
                if(startTime&&endTime){
                    api.GetydImportExel(startTime,endTime);
                }

      		},
      		 //分页数据
            setPageTable(pageSize, pageNum) {
                let i = 1;
                let rtValue = [];
                let startNum = pageSize * (pageNum - 1);
                for (let i = 0; i < pageSize; i++) {
                    if ((startNum + i + 1) > this.allData.length)
                        break;
                    rtValue.push(this.allData[startNum + i]);
                }
                this.tableData = rtValue;
            },
            //
            submitUpload() {
		       // this.$refs.upload.submit();
		    },
            //
		    handleRemove(file, fileList) {
		        console.log(file, fileList);
		    },
            //
		    handlePreview(file) {
		        console.log(file);
		    },
            //
		    changeFileList(file){
                console.log(file);
                this.StatusChange = '';
                //
                $(".Insert").val(file.name);
                //
                setTimeout(()=>{
                    this.StatusChange = file.response.Status;
                },500)

		    },
		    //获取县市区数据（下拉框）
	        GetFirstGridDropDown(){
	        	const t = this;
	        	api.GetFirstGridDropDown().then(res=>{
	        		t.options = res.data.Data;
	        	})
	        }
        }, 
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .electricity{
        //
        width: calc(100% - 200px);
        overflow: hidden;
        padding: 20px;
        background-color: #f6fbff;
        .right{
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


        }
        //

        .warp-main{
            width: 600px;
            background: #fff;
            margin-left: -20px;
            padding-right: 25px;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;

        }
        .bucrt-class{
            width: 100%;
            height: auto;
            .content{
                min-height: 80px;
            }

        }

    .bj-bottom{
        width: 100%;
        height: 50px;
        padding-left: 300px;
        padding-bottom: 15px;
    }
    .busin-class{
        width: 100%;
        height: 50px;
        overflow: hidden;
        .divkaet{
            width: 33%;
            float: left;
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
}


</style>
