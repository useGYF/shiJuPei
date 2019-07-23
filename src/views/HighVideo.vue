<template>
    <div class="heighvideos">
        <!--高点视频监测-->
        <v-header v-show="mheader"></v-header>
        <!---->
        <div class="vidoe-float" v-show="videomodel">
            <!--视频上部控件-->
            <div class="tv-kongjian">
                <span></span>
                <i title="关闭窗口" style="color: #666;margin-top: 15px;float: right;margin-right: 20px"
                   class="el-icon-close" @click="btnClose"></i>
            </div>
            <!--视频-->
            <div class="shiping">
                <div class="v-title2">{{casName_xt}} <span title="点击全屏或者退出全屏" id="quanpin1">{{mheader == true?'全屏播放':'退出全屏'}}</span> <span
                        title="点击重新载入播放" @click="btnClick(vCode,votype)">播放</span>
                    <router-link to="/"><span title="点击返回到实时监控" @click="onblackclick">返回</span></router-link>
                </div>
                <div class="v-video2 gk1">
                    <iframe id="i_real" style="height:100%;width:100%;border:none;"
                            src="/static/video/realtimeplay.html"></iframe>
                </div>
            </div>
            <!--视频底部-->
        </div>
        <div class="video-bottom">
            <!--左边-->
            <div class="v-left">
                <div class="v-l-title">实时视频监控列表</div>
                <div class="v-l-conter">
                    <!--搜索过滤-->
                    <el-input
                            placeholder="输入关键字进行过滤"
                            icon="search"
                            v-model="filterText">
                    </el-input>
                    <!--树形图-->
                    <el-tree
                            class="filter-tree"
                            :data="TreeFigureData"
                            :props="defaultProps"
                            accordion
                            @node-click="handleNodeBlickClick"
                            :filter-node-method="filterNode"
                            ref="tree2">
                    </el-tree>
                </div>

            </div>
            <!--中间-->
            <div class="v-conent">
                <div class="vi-itemobj">
                    <div class="v-title">{{gktitle}}</div>
                    <div class="v-video" style="width: 100%;height: 100%">
                        <img :src="spbjImg" style="border: none;width: 96%;height: 100%;z-index: 500;margin: 2% auto">
                    </div>
                </div>
            </div>
            <!--右边-->
            <div class="v-right">
                <!---->
                <div class="v-l-title">基本信息</div>
                <!---->
                <div class="table-from">
                    <table border="1" style="width: 100%">
                        <tr>
                            <td width="80" style="background: #ebebeb">
                                <div class="t-item">企业名称</div>
                            </td>
                            <td>
                                <div class="t-item2">{{casName}}</div>
                            </td>
                        </tr>
                        <tr>
                            <td style="background: #ebebeb">
                                <div class="t-item">行业类别</div>
                            </td>
                            <td>
                                <div class="t-item2">{{IndustryCategory}}</div>
                            </td>
                        </tr>
                        <tr>
                            <td style="background: #ebebeb">
                                <div class="t-item">产品</div>
                            </td>
                            <td>
                                <div class="t-item2">{{product}}</div>
                            </td>
                        </tr>
                        <tr>
                            <td style="background: #ebebeb">
                                <div class="t-item">所属区县</div>
                            </td>
                            <td>
                                <div class="t-item2">{{DistrictCounty}}</div>
                            </td>
                        </tr>
                        <tr>
                            <td style="background: #ebebeb">
                                <div class="t-item">企业地址</div>
                            </td>
                            <td>
                                <div class="t-item2">{{EnterpriseAddress}}</div>
                            </td>
                        </tr>
                        <tr>
                            <td style="background: #ebebeb">
                                <div class="t-item">所属网格</div>
                            </td>
                            <td>
                                <div class="t-item2">{{Grid}}</div>
                            </td>
                        </tr>
                        <tr>
                            <td style="background: #ebebeb">
                                <div class="t-item">网格员</div>
                            </td>
                            <td>
                                <div class="t-item2">{{Gridman}}</div>
                            </td>
                        </tr>
                        <tr>
                            <td style="background: #ebebeb">
                                <div class="t-item">网格员联系方式</div>
                            </td>
                            <td>
                                <div class="t-item2">{{GridmanPhone}}</div>
                            </td>
                        </tr>
                        <tr>
                            <td style="background: #ebebeb">
                                <div class="t-item">监控类型</div>
                            </td>
                            <td>
                                <div class="t-item2">{{MonitoringType}}</div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import api from '../api/index'

    export default {
        name: 'heighvideos',
        data() {
            return {
                //行业类别
                IndustryCategory: '----',
                //产品
                product: '----',
                //所属区县
                DistrictCounty: '----',
                //企业地址
                EnterpriseAddress: '----',
                //所属网格
                Grid: '----',
                //网格员
                Gridman: '----',
                //网格员联系方式
                GridmanPhone: '----',
                //监控类型
                MonitoringType: '----',
                //
                spbjImg: 'static/imgs/gdvideo/gkbj.png',
                //
                gktitle: '高空五公里监控',
                //
                casName: '企业监控点',
                //
                casName_xt:'',
                //
                Cname:'',
                //
                videomodel: false,
                //页面数据
                vCode: '',
                //
                votype: '',
                //
                mheader: true,
                //
                filterText: '',
                //树形图数据
                TreeFigureData: [
                    {
                        code: '',
                        label: '散乱污视频监控',
                        disabled: true,
                        children: []//{code: '001562',label: '天拓钢材'}保存此格式对象
                    },
                    {
                        code: '',
                        label: 'VOCs视频监控',
                        disabled: true,
                        children: []
                    }, {
                        code: '',
                        label: '高空五公里监控',
                        disabled: true,
                        children: []
                    }],
                //
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },

            };
        },
        created() {},

        mounted() {
            //mounted 挂载结束状态=====
            const _this = this;
           
            //全屏开关样式点击添加删除
            $('#quanpin1').click(function () {
                $(".gk1").toggleClass('max');
                _this.mheader = !_this.mheader;
            });
            //获取列表
            api.GetVideoInfoByTypeResourceData().then(res =>{
                //console.log(res.data.Data);
                let sp_data = res.data.Data;
                // 循环数据
                sp_data.forEach(item =>{

                    if(item.label === '散乱污企业' || item.label === '小散乱污'){
                        let Data_slw = item.child;
                        //散乱污视频
                        Data_slw.forEach(item => {
                            const tableData = {};
                            tableData.boxInformation = false;//弹出框状态
                            tableData.label = item.compname;//名称
                            tableData.gridname = item.gridname;//分类
                            tableData.children = item.gchild.map(ite =>{
                                return {
                                    code : ite.code,
                                    label:ite.label,
                                    type :item.gridname
                                }
                            });//子菜单
                            tableData.type = 'SLW';
                            this.TreeFigureData[0].children.push(tableData);
                        })
                    }
                    if(item.label === 'VOCs企业' || item.label === 'VOC企业'){
                        let Data_voc = item.child;
                        //VOC视频
                        Data_voc.forEach(item => {
                            const tableData2 = {};
                            tableData2.boxInformation = false;//弹出框状态
                            tableData2.label = item.compname;//名称
                            tableData2.gridname = item.gridname;//分类
                            //.children = item.gchild;//子菜单
                            tableData2.children = item.gchild.map(ite =>{
                                return {
                                    code : ite.code,
                                    label:ite.label,
                                    type :item.gridname
                                }
                            });//子菜单
                            tableData2.type = 'VOC';
                            this.TreeFigureData[1].children.push(tableData2);
                        })
                    }
                    if(item.label === '高空五公里'){
                        let Data_gkw = item.child;
                        //高空五公里视频
                        Data_gkw.forEach(item => {
                            const tableData3 = {};
                            tableData3.boxInformation = false;//弹出框状态
                            tableData3.label = item.compname;//名称
                            tableData3.gridname = item.gridname;//分类
                            //tableData3.children = item.gchild;//子菜单
                            tableData3.children = item.gchild.map(ite =>{
                                return {
                                    code : ite.code,
                                    label:ite.label,
                                    type :item.gridname
                                }
                            });//子菜单
                            tableData3.type = 'GKW';
                            this.TreeFigureData[2].children.push(tableData3);
                        })

                    }

                    //console.log(this.TreeFigureData[0].children);
                })
            })
           //程序初始化
            if(_this.idcode){
                setTimeout(()=>{
                    _this.JudgeInitializationProgram()
                },1500)
            };

        },
        watch: {
            //监听过滤数据
            filterText(val) {
                this.$refs.tree2.filter(val);
            },
            //监听是否有参数
            idcode(val){
                console.log(val);
                if(val){
                    this.JudgeInitializationProgram()
                }
            },
            //
            '$route':'isRouterChange'
        },
        computed :{
            //传递数据
            idcode(){
                return this.$route.query.id
            }
        },
        methods: {
            //监听路由变化
            isRouterChange(){
               // window.location.reload();
                const _this = this;
                //当返回实时监控页面时候监控路由情况
                let currentPath = window.location.hash.slice(1);
               ///
            },
            //请求企业信息
            RequestEnterpriseInformation(name ,type){
                const t = this;
                //设置前设置为空
                t.IndustryCategory = '暂无数据';
                t.product = '暂无数据';
                t.DistrictCounty = '暂无数据';
                t.EnterpriseAddress = '暂无数据';
                t.Grid ='暂无数据';
                t.Gridman = '暂无数据';
                t.GridmanPhone = '暂无数据';
                t.MonitoringType = '暂无数据';
                //设置请求地址
                let dataurl;
                //企业分类请求地址
                let slwurl = api.GetVideoScatterInfoRes();
                let vocurl = api.GetVocsVideoInfoRes();
                let Vname = name;
                let Vtype = type;
                //判断企业类型
                switch (Vtype) {
                    case 'VOC':
                        dataurl = vocurl;
                        break;
                    case 'SLW':
                        dataurl = slwurl;
                        break;
                    case 'GKW':
                        dataurl = '';
                        break;
                }
                //請求企業信息
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: dataurl + encodeURI(Vname),
                    success: function (data) {
                        console.log('获取成功')
                        //console.log(data)
                        if (data) {
                            //alldatalist
                            let textdata = data.Data || null;
                            //行业类别
                            t.IndustryCategory = textdata.Industry ? textdata.Industry : '----';//行业类别
                            //产品
                            t.product = textdata.ProductionContent ? textdata.ProductionContent : '----';//产品
                            //所属区县
                            t.DistrictCounty = textdata.Area ? textdata.Area : '----';//所属区县
                            //企业地址
                            t.EnterpriseAddress = textdata.CompanyAddress ? textdata.CompanyAddress : '----';//企业地址
                            //所属网格
                            t.Grid = textdata.Grid ? textdata.Grid : '----';//所属网格
                            //网格员
                            t.Gridman = textdata.Contact ? textdata.Contact : '----';//网格员
                            //网格员联系方式
                            t.GridmanPhone = textdata.Phone ? textdata.Phone : '----';//联系方式
                            //监控类型
                            t.MonitoringType = textdata.MonitoringType ? textdata.MonitoringType : '----';//监控类型
                        }
                    }
                });
            },
            //列表点击事件
            handleNodeBlickClick(data) {
                //点击携带信息
                //console.log(data);
                //视频编码
                let vcode = data.code;
                //let votype;
                //记录当前视频ID
                this.vCode = data.code;
               //
                this.Cname = data.label;
                //console.log(this.Cname);
                //视频弹出框
                this.videomodel = true;
                //防止点击就弹出全屏
                $(".gk1").removeClass('max');
                //防止点击主树干分支弹出视频
                if (data.label == '高空五公里监控' || data.label == 'VOCs视频监控' || data.label == '散乱污视频监控' || data.boxInformation == false) {
                    this.videomodel = false;
                   // alert('yes!!!')

                }
                //请求企业信息
                if(data.children){
                    //搞得不错
                    if(data.label == '高空五公里监控' || data.label == 'VOCs视频监控' || data.label == '散乱污视频监控'){
                        //console.log('不想用你们啊');
                    }else {
                        //视频名称
                        this.casName = data.label;
                        //区别视频类别请求企业信息
                        this.RequestEnterpriseInformation(this.casName ,data.type);
                    }
                };
                //console.log('测试测试');
                this.votype = data.type =='高空'? 0 : (data.type =='广阳区' ? 1 : 2);
                //视频插件传递调用
                this.btnClick(vcode,this.votype);
                console.log(`测试${this.votype}`);
                //切换中间背景加文字
                switch (data.label) {
                    case '高空五公里监控':
                        this.spbjImg = 'static/imgs/gdvideo/gkbj.png';
                        this.gktitle = '高空五公里监控';
                        break;
                    case 'VOCs视频监控':
                        this.spbjImg = 'static/imgs/gdvideo/vocbj.png';
                        this.gktitle = 'VOCs视频监控';
                        break;
                    case '散乱污视频监控':
                        this.spbjImg = 'static/imgs/gdvideo/slwbj.png';
                        this.gktitle = '散乱污视频监控';
                        break;
                    default:
                        this.spbjImg = 'static/imgs/gdvideo/gkbj.png';
                        this.gktitle = '高空五公里监控';
                }
                //视频名称
                this.casName_xt = this.Cname;
            },
            //调用视频方法
            btnClick(Vcode,votype) {
                //
                if(!Vcode){
                    Vcode = this.idcode;
                    votype = this.votype;
                }
                let fm = document.getElementById('i_real');
                fm.contentWindow.setVideoState(Vcode,votype);
            },
            //过滤数据
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            //关闭弹出视频窗口
            btnClose() {
                //fun.clearIframe(i_real);
                this.videomodel = false;
                if (this.mheader == false) {
                    this.mheader = true;
                }

            },
            //返回按钮，防止返回全屏
            onblackclick() {
                //防止返回就弹出全屏
                $(".gk1").removeClass('max');
                if (this.mheader == false) {
                    this.mheader = true;
                }
            },
            //判断初始化程序
            JudgeInitializationProgram(){
                const _this = this;
                //视频弹出框
                _this.videomodel = true;
                //
                let votp = _this.votype || 2;
                //视频插件传递调用
                _this.btnClick(_this.idcode,votp);
                //
                console.log('调用成功')
            }
        },
        components: {}//
    };
</script>
<style lang="scss" scoped>
    .heighvideos {
        width: 100%;
        height: 100%;
        //遮罩层
        .vidoe-float {
            width: 100%;
            height: 100%;
            position: fixed;
            background: rgba(0, 0, 0, 0.6);
            z-index: 1000;
            padding: 0;
            margin: 0;
            .shiping {
                width: 100%;
                height: calc(100% - 98px);
                margin: 0 auto;
            }
            .v-title2 {
                width: 100%;
                height: 42px;
                background: #fff;
                text-align: left;
                padding-left: 2%;
                line-height: 42px;
                color: #000;
                font-weight: bold;
                span {
                    display: inline-block;
                    float: right;
                    background: #1d90e6;
                    color: #fff;
                    line-height: 10px;
                    padding: 10px 15px;
                    height: 30px;
                    margin-top: 5px;
                    margin-right: 24px;
                    border-radius: 3px;
                    cursor: pointer;
                }
            }
            .v-video2 {
                width: calc(60% - 4px);
                height: 100%;
                margin: 0px auto;
            }
        }
        //新单元
        .video-bottom {
            width: 100%;
            height: calc(100% - 56px);
            overflow: hidden;
            .v-left {
                float: left;
                background: #fff;
                width: 20%;
                height: 100%;
                overflow: auto;
                .v-l-title {
                    width: 100%;
                    height: 42px;
                    background: #fff;
                    color: #666;
                    text-align: left;
                    padding-left: 4%;
                    border-bottom: solid 1px #ccc;
                    line-height: 42px;
                    font-weight: bold;
                }
                .v-l-conter {
                    width: 80%;
                    margin-left: 10%;
                    margin-top: 4%;
                }
            }
            .v-conent {
                float: left;
                width: 60%;
                height: 100%;
                background: #f5f5f5;
                .vi-itemobj {
                    width: 94%;
                    margin: 0 auto;
                    .v-title {
                        width: 100%;
                        height: 42px;
                        background: #f5f5f5;
                        text-align: left;
                        padding-left: 2%;
                        line-height: 42px;
                        color: #666;
                        border-bottom: solid 1px #ccc;
                        font-weight: bold;
                    }
                    .v-video {
                        width: 100%;
                        height: calc(100% - 42px);
                    }
                }
            }
            .v-right {
                float: left;
                background: #fff;
                width: 20%;
                height: 100%;
                .v-l-title {
                    width: 100%;
                    height: 42px;
                    background: #fff;
                    color: #666;
                    text-align: left;
                    padding-left: 4%;
                    border-bottom: solid 1px #ccc;
                    line-height: 42px;
                    font-weight: bold;
                }
                .table-from {
                    width: 92%;
                    margin-left: 4%;
                    margin-top: 4%;
                    table {
                        border: solid 1px #ccc;
                        color: #6d6d6d;
                        font-weight: bold;
                        tr {
                            border: solid 1px #ccc;
                        }
                        td {
                            height: 44px;
                            border: solid 1px #ccc;
                        }
                        .t-item {
                            text-align: center;
                            font-size: 16px;
                            color: #6d6d6d;
                        }
                        .t-item2 {
                            text-align: left;
                            padding-left: 15px;
                            font-size: 16px;
                            color: #6d6d6d;
                        }
                    }
                }
            }
        }
        .max {
            position: fixed !important;
            top: 42px !important;
            left: 0 !important;
            width: 100% !important;
            height: calc(100% - 42px) !important;
            margin: 0 !important;
        }
        .iconplay {
            cursor: pointer;
            display: inline-block;
            width: 36px;
            height: 36px;
            margin-top: 2px;
            margin-right: 2px;
            float: right;
            background: url("../assets/img/play.png") no-repeat center;
            background-size: cover;
        }
        //媒体查询
        @media only screen and (min-width: 1400px) {

        }

    }
</style>
