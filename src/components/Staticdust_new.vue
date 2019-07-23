<template>
    <div class="StaticDustwarp">
        <!--静态原清单测面板-->
       <div class="main">
                    <!---->
                    <div class="tables">
                        <!--选项-->
                        <strong class="font-color">大气排放源清单</strong>
                        <font @click="showwarp2 = !showwarp2">{{showwarp2?'收起∧':'展开∨'}}</font>
                    </div>
                    <div class="warp-t">
                        <div class="title-daqi">
                            <div class="shuxian"></div>
                            <div class="title-text">
                                部门分类
                            </div>
                        </div>
                        <div class="title-box">
                            <el-checkbox-group
                                    v-model="checkedCities1"
                                    @change="changeIschecked"
                                    :min="1"
                                    :max="4"
                            >
                                <el-checkbox v-for="city in cities" :label="city.value" :key="city.value">{{city.label}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                    <!---->
                    <transition name="el-zoom-in-top">
                       <div v-show="showwarp2"  id="content">

                           <!--图标-->
                               <div class="title-daqi">
                                   <div class="shuxian"></div>
                                   <div class="title-text">
                                       县（市、区）排放量分布
                                   </div>
                               </div>
                           <!---->
                               <div class="bing_item_one" id="bing_item_twoo" style="width: 360px;height: 180px;padding-left: 15px"></div>
                              <!---->
                               <div class="title-daqi">
                                   <div class="shuxian"></div>
                                   <div class="title-text">
                                       行业排放量分布
                                   </div>
                               </div>
                               <!---->
                               <div class="bing_item_one" id="bing_item_one" style="width: 360px;height: 180px;padding-left: 15px"></div>
                           <!---->
                       </div>
                   </transition>
                    <!---->
                    <div class="sousuo">
                        <!--<div class="sleft">-->
                            <!--<el-input v-model="filters.name" @keyup.enter.native="searchAsName" placeholder="名称"></el-input>-->
                        <!--</div>-->
                        <!--<div class="sright">-->
                            <!--<el-button type="primary"  @click="searchAsName">搜索</el-button>-->
                        <!--</div>-->
                        <div class="title-daqi">
                            <div class="shuxian"></div>
                            <div class="title-text">
                                <!--SO2排放总量：{{so2Name}}（吨）-->
                                <div class="bing_text"> <span>企业总数量：{{qiyeNum}}</span></div>
                            </div>
                        </div>

                    </div>
                    <!---->
                    <div class="table_container">
                        <el-table
                                :data="tableData"
                                border
                                stripe
                                highlight-current-row
                                @current-change="RowCurrentChange"
                                style="width: 430px">
                            <el-table-column
                                    property="name"
                                    label="名称"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    property="Industry"
                                    label="行业"
                                    >
                            </el-table-column>
                            <!--<el-table-column-->
                                    <!--property="Emission"-->
                                    <!--label="排放物"-->
                                   <!--&gt;-->
                            <!--</el-table-column>-->
                            <el-table-column
                                    property="EmissionAmount"
                                    label="排放量(吨)"

                            >
                            </el-table-column>
                            <el-table-column
                                    property="netName"
                                    label="网络名称">
                            </el-table-column>
                        </el-table>
                        <!--分页条-->
                        <div class="Pagination" style="text-align: left;margin-top: 10px;">
                            <el-pagination
                                    background
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :current-page="currentPage"
                                    :page-size="pagesize"
                                    layout="total, prev, pager, next"
                                    :total="totalCount">
                            </el-pagination>
                        </div>
                    </div>
                </div>
    </div>
</template>

<script>
    import {bus} from '@/js/bus.js'
    import api from '../api/index'

    export default {
        name: 'staticdust',
        data() {
            return {
                //污染源展开关闭开关
                showwarp2:true,
                //污染类型
                type: 'so2',
                //企业总量
                qiyeNum:0,
                //so2排放总量
                so2Name:'----',
                //lable类型
                labelType: 'so2',
                //存放数据
                ALLdata: [],
                //输入框
                filters: {name: ''},
                //列表数据
                tableData: [],
                //
                allData: [],
                //
                currentRow: null,
                //
                pagesize: 10,
                //
                currentPage: 1,
                //
                totalCount: 0,
                //
                value1: '',
                //
                value2: '',
                //用来存储搜索后的数据
                choiceData: [],
                //用来存储全部数据(变化)
                totolData: [],
                //用来存储全部数据(不变)
                dataL: [],
                //
                Allchecked:[],
                //分页当前页数
                page: 1,
                //污染类别
                CategoryPollution:'so2',
                //查询数据总数
                totalCounts: '',
                //
                checkedCities1: ['0001'],
                //
                cities: []
            }
        },
        created() {
            //初始化数据
            this.listClassDataGet('0001','1');
            //左侧指标切换
            bus.$on('setStaticTarget', this.switchRender);
        },

        mounted() {
            //右侧收放
            const that = this;
            //部门分类菜单请求
            api.PostselectAllParent().then(res =>{
                console.log(res);
                that.cities = [];
                res.data.data.forEach(item =>{
                    //
                      const condata = {
                            value:item.id,
                            label:item.className
                        }
                    that.cities.push(condata);
                })
            })
            ///
            this.changeIschecked('0001',1,false);
        },
        methods: {
            //部门分类切换请求
            changeIschecked(val,typeN,hasLoaded=true){
                console.log(val);
                this.Allchecked = val;
                let ids = val.toString();
                let TpubCode =typeN || 1;
                let WpubCode =typeN || 1;
                //类型
                this.classChangeget(ids,TpubCode);
                //网格
                this.netChangeget(ids,WpubCode);
                //列表数据
                this.listClassDataGet(ids,'1');
                //地图传递数据
                hasLoaded && bus.$emit('loadCumulative',{ids:ids},'layer_yqd',this.labelType,'name');
            },
            //排序
            compare(propertyName) {
                return function (object1, object2) {
                    let value1 = object1[propertyName]
                    let value2 = object2[propertyName]
                    return value2 - value1
                }
            },
            //按类型分类
            classChangeget(ids,pubCode){
                api.PostselectClassIdsGroup(ids,pubCode).then(res =>{
                    console.log(res)
                    let data = res.data.data;
                    ////
                    this.IndustryEmissionsPie(data);
                })
            },
            //按网格分类
            netChangeget(ids,pubCode){

                api.PostselectByPubAndClassNet(ids,pubCode).then(res =>{
                    console.log(res)
                    let data = res.data.data;
                    this.quyuEmissionsPie(data);
                })
            },
            //列表数据
            listClassDataGet(ids,page){
                api.PostselectPollutantDischarg(ids,page).then(res =>{
                    console.log(res)
                    ///请求总数据
                    let rows = res.data.data.rows;
                    //企业总数
                    this.qiyeNum = res.data.data.total;
                    ///数据总数
                    this.totalCount = res.data.data.total;
                    ///初始化数据
                    this.InitializationDataMethod(rows, 1);

                })
            },
            //初始化数据
            InitializationDataMethod(data, type) {
                // console.log(data)
                this.type = type;
                let sudata = data;
                this.SetDataList(sudata, type)
               //////////
            },
            //污染源类别
            getPollutionNume(type) {
                let rtValue = type;
                //
                switch (type) {
                    case 'pm25':
                        rtValue = '5';
                        break;
                    case 'pm10':
                        rtValue = '4';
                        break;
                    case 'nh3':
                        rtValue = '7';
                        break;
                    case 'so2':
                        rtValue = '1';
                        break;
                    case 'nox':
                        rtValue = '2';
                        break;
                    case 'bc':
                        rtValue = '8';
                        break;
                    case 'co':
                        rtValue = '3';
                        break;
                    case 'oc':
                        rtValue = '9';
                        break;
                    case 'voc':
                        rtValue = '6';
                        break;
                }
                //console.log(rtValue);
                return rtValue;
            },
            //指标转换
            getPollution(type) {
                let rtValue = type;
                //
                switch (type.toUpperCase()) {
                    case 'PM25':
                        rtValue = 'pm25';
                        break;
                    case 'PM10':
                        rtValue = 'pm10';
                        break;
                    case 'NH3':
                        rtValue = 'nh3';
                        break;
                    case 'SO2':
                        rtValue = 'so2';
                        break;
                    case 'NOX':
                        rtValue = 'nox';
                        break;
                    case 'BC':
                        rtValue = 'bc';
                        break;
                    case 'CO':
                        rtValue = 'co';
                        break;
                    case 'OC':
                        rtValue = 'oc';
                        break;
                    case 'VOC':
                        rtValue = 'voc';
                        break;
                }
                //console.log(rtValue);
                return rtValue;
            },
            //行业分布请求
            GetselectAllChild(ids){
                ////
                api.PostselectAllChild(ids).then(res =>{
                    console.log(res);
                })
            },
            //table点击事件
            RowCurrentChange(val) {
                this.currentRow = val;
                console.log(val);
                //地图联动
                bus.$emit('locationClick', 'layer_yqd', this.currentRow ,'');
            },
            //设置表格数据
            SetDataList(data, type) {
                const t = this;
                data = typeof data === 'string' ? JSON.parse(data) : data;
                this.data = data;
                this.tableData = [];
                let i = 1;
                let dt1 = this.getPointByType(type);
                dt1.forEach(item => {
                    // console.log(item)
                    const tableData = {};
                    tableData.id = item.id;//id
                    tableData.netName = item.netName;//网格名称
                    tableData.name = item.name;//名称
                    tableData.classId = item.classId;//名称
                    tableData.Industry = item.className;//行业
                    tableData.latitude = item.latitude;//纬度
                    tableData.longitude = item.longitude;//经度
                    tableData.EmissionAmount = parseFloat(item[t.labelType]).toFixed(2);//排放量
                    this.tableData.push(tableData);
                })
            },
            //每页显示数据量变更
            handleSizeChange(val) {
                this.pagesize = val;
            },
            //页码变更
            handleCurrentChange(val) {
                //this.setPageTable(10, val);
                this.page = val;
                let ids = this.Allchecked.toString() || '0001';
                //列表数据请求
                this.listClassDataGet(ids,val);
            },
            //区域排放量分布图
            quyuEmissionsPie(data) {
                const _this = this;
                let showData = data.map(function (v) {
                    return {value: v.pubnum, name: v.name}
                }) || [];
                let lenData = data.map(function (v) {
                    return {name: v.name}
                }) || [];
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('bing_item_twoo'));
                // 指定图表的配置项和数据
                let option = {

                    legend: {
                        orient: 'right',
                        y:'center',
                        left: 165,
                        //data: ['广阳区','安次区','永清','大厂','香河','文安','开发区']
                        data:lenData
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '70%',
                            center: ['20%', '50%'],
                            hoverAnimation: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '20',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            data: [
                                {value: 335, name: '广阳区'},
                                {value: 310, name: '安次区'},
                                {value: 234, name: '永清'},
                                {value: 135, name: '大厂'},
                                {value: 548, name: '香河'},
                                {value: 500, name: '文安'},
                                {value: 500, name: '开发区'}
                            ],

                        }
                    ]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
                //动态设置参数
                myChart.setOption({
                    series: [{
                       data:showData,
                        color: [
                            '#08a1ed',
                            '#a2c73b',
                            '#f2cd49',
                            '#85dbce',
                            '#ce93e3',
                            '#6c68e1',
                            '#e5763f'
                        ]
                    }]
                });
            },
            //行业排放量分布图
            IndustryEmissionsPie(data) {
                const _this = this;
                let showData = data.map(function (v) {
                    return {value: v.pubnum, name: v.name}
                }) || [];
                let lenData = data.map(function (v) {
                    return {name: v.name}
                }) || [];
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('bing_item_one'));
                // 指定图表的配置项和数据
                let option = {

                    legend: {
                        orient: 'right',
                        y:'center',
                        left: 165,
                        //data: ['工业企业源','汽修','干洗','餐饮油烟','移动源','加油站','施工扬尘源']
                        data:lenData
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '70%',
                            center: ['20%', '50%'],
                            hoverAnimation: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '20',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            data: [
                                {value: 335, name: '工业企业源'},
                                {value: 310, name: '汽修'},
                                {value: 234, name: '干洗'},
                                {value: 135, name: '餐饮油烟'},
                                {value: 548, name: '移动源'},
                                {value: 500, name: '加油站'},
                                {value: 500, name: '施工扬尘源'}
                            ],

                        }
                    ]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
                //动态设置参数
                myChart.setOption({
                    series: [{
                       data: showData,
                        color: [
                            '#08a1ed',
                            '#a2c73b',
                            '#f2cd49',
                            '#85dbce',
                            '#ce93e3',
                            '#6c68e1',
                            '#e5763f'
                        ]
                    }]
                });
                //
                //let checkarr = [];
                //触动当前方法
                // myChart.on('legendselectchanged', function(obj) {
                //     let selected = obj.selected;
                //     let legend = obj.name;
                //
                //     //判断selected对象中是否被选中
                //     if(selected[legend] == false){
                //         //点击时候添加至数组
                //         console.log('选中我了')
                //         console.log(obj.name)
                //         switch (obj.name){
                //             case '工业企业源':
                //                 checkarr.push('ps001');
                //                 break;
                //             case '干洗':
                //                 checkarr.push('ps002');
                //                 break;
                //             case '汽修':
                //                 checkarr.push('ps003');
                //                 break;
                //             case '施工扬尘源':
                //                 checkarr.push('ps004');
                //                 break;
                //             case '餐饮油烟':
                //                 checkarr.push('ps005');
                //                 break;
                //             case '加油站':
                //                 checkarr.push('ps006');
                //                 break;
                //             case '移动源':
                //                 checkarr.push('ps007');
                //                 break;
                //         }
                //
                //     }else {
                //         //取消时候删除
                //         console.log('取消我了')
                //         console.log(obj.name)
                //         let data = '';
                //         switch (obj.name){
                //             case '工业企业源':
                //                 data = 'ps001';
                //                 break;
                //             case '干洗':
                //                 data = 'ps002';
                //                 break;
                //             case '汽修':
                //                 data = 'ps003';
                //                 break;
                //             case '施工扬尘源':
                //                 data = 'ps004';
                //                 break;
                //             case '餐饮油烟':
                //                 data = 'ps005';
                //                 break;
                //             case '加油站':
                //                 data = 'ps006';
                //                 break;
                //             case '移动源':
                //                 data = 'ps007';
                //                 break;
                //         }
                //         checkarr.splice(checkarr.indexOf(data), 1);
                //     }
                //     //
                //     _this.InitialClass = checkarr.toString();
                //     //
                //     console.log(checkarr);
                //     //列表数据请求
                //     _this.ChenageGetDataList(('&sourceType='+ _this.InitialClass), _this.CategoryPollution, _this.page);
                // });

            },
            //分页数据
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
            //数据筛选
            getPointByType(type) {
                const t = this;
                let rtValue = [];
                let dt = this.data;
                if (dt) {
                    for (let i = 0, length = dt.length; i < length; i++) {
                        let item = dt[i];
                        //if (item.jdjcBasGyqySn.co === type) {
                        rtValue.push(dt[i]);
                        //}
                    }
                }
                return rtValue;
            },
            //type更改
            refreshTable(type) {
                this.type = type;
                this.labelType = this.getPollutionTarget(type);
                this.totalCount = this.tableData.length;
                this.InitializationDataMethod(this.data, 1)
            },
            //地图模块专递切换指标
            switchRender(type) {
                //console.log(type)
                this.type = type;
                //
                this.labelType = type;
                //
                let potin =this.getPollutionNume(this.getPollution(type));
                //
                let ids = this.Allchecked.toString();
                //列表数据请求
                this.changeIschecked(ids,potin);
                //
            },
            //通过输入名称获取数据
            searchAsName() {
                if (this.filters.name == '') {
                    this.allData = this.dataL
                    this.totalCount = this.totalCounts;
                    this.setPageTable(10, 1);
                } else {
                    this.choiceData = []
                    for (var i = 0; i < this.totolData.length; i++) {
                        if (this.totolData[i].Name.indexOf(this.filters.name) >= 0) {
                            this.choiceData.push(this.totolData[i])
                        }
                    }
                    this.totalCount = this.choiceData.length;
                    this.allData = this.choiceData
                    this.setPageTable(10, 1);
                }
            },
            //////////////////////
        },
        components: {}
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

    .StaticDustwarp {
        width: 430px;
        height: auto;
        .warp-t{
            .title-box{
                width: 100%;
                text-align: left;
            }
        }
        /**/
        .title-daqi{
            width: 100%;
            height: 36px;
            .shuxian{
                width: 3px;
                height: 24px;
                background: #1FA1FF;
                float: left;
                margin-left: 10px;
            }
            .title-text{
                float: left;
                font-weight: bold;
                line-height: 24px;
                padding-left: 10px;
                text-align: left;
            }
        }
        .tables {
            border-bottom: solid 1px #ccc;
            margin-bottom: 10px;
            height: 40px;

            .font-color{
                display: inline-block;
                text-align: center;
                width: 180px;
                font-size: 16px;
                color: #1FA1FF;
                float: left;
                margin-left: 5px;
                border-bottom: solid 2px #1FA1FF;
            }
            font {
                    float: right;
                    margin-right: 20px;
                }
            }
        .symume {
                width: 100%;
                height: 68px;
                margin-left: 17px;
                padding-bottom: 15px;
                .YuanType {
                    width: 30%;
                    height: 28px;
                    float: left;
                    text-align: left;
                    padding-left: 8%;
                    label {
                        margin: 0;
                        vertical-align: middle;
                        color: #666;
                    }
                    .labeled {
                        color: #2494f2;
                    }
                    input {
                        width: 15px;
                        height: 15px;
                        background-size: 15px 15px;
                        background-repeat: no-repeat;
                        outline: none;
                        appearance: none;
                        -webkit-appearance: none;
                        vertical-align: middle;
                        margin: 0;
                    }
                    .bg1 {
                        background-image: url('../../static/imgs/originallist/ps001.png');
                    }
                    .bg2 {
                        background-image: url('../../static/imgs/originallist/ps002.png');
                    }
                    .bg3 {
                        background-image: url('../../static/imgs/originallist/ps003.png');
                    }
                    .bg4 {
                        background-image: url('../../static/imgs/originallist/ps004.png');
                    }
                    .bg5 {
                        background-image: url('../../static/imgs/originallist/ps005.png');
                    }
                    .bg6 {
                        background-image: url('../../static/imgs/originallist/ps006.png');
                    }
                    .checked1 {
                        background-image: url('../../static/imgs/originallist/ps001checked.png');
                    }
                    .checked2 {
                        background-image: url('../../static/imgs/originallist/ps002checked.png');
                    }
                    .checked3 {
                        background-image: url('../../static/imgs/originallist/ps003checked.png');
                    }
                    .checked4 {
                        background-image: url('../../static/imgs/originallist/ps004checked.png');
                    }
                    .checked5 {
                        background-image: url('../../static/imgs/originallist/ps005checked.png');
                    }
                    .checked6 {
                        background-image: url('../../static/imgs/originallist/ps006checked.png');
                    }
                }
                border-bottom: solid 1px #ccc;
            }
        .fenbutu {
                padding-top: 20px;
                width: 100%;
                height: 220px;
                .bing_text {
                    text-align: left;
                    font-weight: bold;
                    margin-left: -20px;
                }
                .bing_item_one {
                    width: 180px;
                    margin-left: 20px;
                    float: left;
                }
                .bing_item_lable {
                    float: left;
                    width: 160px;
                    padding-top: 58px;
                    ul {
                        li {
                            text-align: left;
                            font-size: 12px;
                            width: 80px;
                            list-style: none;
                            margin-top: 5px;
                            float: left;
                            i {
                                display: inline-block;
                                width: 18px;
                                height: 8px;
                                border-radius: 5px;
                            }
                        }
                    }
                }
            }
        img {
                position: absolute;
                top: 40%;
                left: -17px;
                cursor: pointer;
                float: left;
            }
        .sousuo {
                width: 100%;
                border-bottom: solid 1px #ccc;
                height: 50px;
                padding-top: 15px;
                .sleft {
                    float: left;
                }
                .sright {
                    margin-left: 10px;
                    float: left;
                }
                .bing_text {
                    width: 100%;
                    text-align: left;
                    padding-left: 3px;
                    font-weight: 600;
                }
            }
        .table_container {
                margin-top: 20px;
                margin-left: 5px;
            }
        .main {
                height: auto;
                .tables {
                    width: 100%;
                    line-height: 38px;
                    a {
                        margin-left: -248px;
                        display: inline-block;
                        font-weight: bold;
                        font-size: 16px;
                        padding: 0 20px;
                        margin-bottom: -2px;
                    }
                }

            }
    }

</style>
