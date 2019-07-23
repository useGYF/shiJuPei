<template>
    <div class="Meanratiosensornetwork">
        <!--国省控均值比-->
        <v-header></v-header>
        <!---->
        <div class="warp6">
            <!---->
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="小时平均值" name="first">
                    <!---->
                    <!---->
                    <div class="kass">
                        <div class="wbiaoti">
                            <a>查询条件</a>
                        </div>
                    </div>
                    <!--查询条件-->
                    <div class="chaxuntiaojian">
                        <div class="float001">
                            <el-radio-group v-model="region" @change="GetChangeofData">
                                <el-radio-button label="市区"></el-radio-button>
                                <el-radio-button label="环京县市"></el-radio-button>
                                <el-radio-button label="南部县市"></el-radio-button>
                                <el-radio-button label="自定义"></el-radio-button>
                            </el-radio-group>
                        </div>
                        <div class="float002 day01">
                            <el-date-picker
                                    v-model="timevalue"
                                    type="date"
                                    placeholder="选择日期"
                                    :picker-options="pickerOptions0">
                            </el-date-picker>
                        </div>
                        <div class="float003">
                            <el-button type="primary" @click='GetDayDataByTime'>查询</el-button>
                        </div>
                    </div>
                    <!--自定义选择框-->
                    <div class="custom" v-show="region =='自定义'? true:false">
                        <!--国控点-->
                        <div class="gs_box">
                            <div class="gs_classtitle">国控点：</div>
                            <div class="gs_classright">
                                <el-checkbox-group
                                        v-model="checkedCities1"
                                        @change = "checkedCitieTable"
                                        :min="1"
                                        :max="4">
                                    <el-checkbox v-for="city in cities1" :label="city" :key="city">{{city}}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                        <!--省控点-->
                        <div class="gs_box">
                            <div class="gs_classtitle">省控点：</div>
                            <div class="gs_classright">
                                <el-checkbox-group
                                        v-model="checkedCities2"
                                        @change = "checkedCitieTable"
                                        :min="1"
                                        :max="8">
                                    <el-checkbox v-for="city in cities2" :label="city" :key="city">{{city}}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                    </div>
                    <!---->
                    <div class="kass">
                        <div class="wbiaoti">
                            <a>数据列表</a>
                        </div>
                    </div>
                    <!--查询条件-->
                    <div class="chaxuntiaojian">
                        <div class="float001">
                            <el-radio-group v-model="StatisticalRankingsName" @change='GetChangeofData'>
                                <el-radio-button label="PM2.5"></el-radio-button>
                                <el-radio-button label="PM10"></el-radio-button>
                                <el-radio-button label="SO2"></el-radio-button>
                                <el-radio-button label="NO2"></el-radio-button>
                                <el-radio-button label="CO"></el-radio-button>
                                <el-radio-button label="O3"></el-radio-button>
                                <el-radio-button label="O3_8H"></el-radio-button>
                            </el-radio-group>
                        </div>

                    </div>
                    <!--表格-->
                    <div class="neirong">
                        <!---->
                        <div class="lie_teble">
                            <table id="testTable1" border="0" borderColor="#fff" width="500">
                                <tr style="background: #4CC18F;color: #000;">
                                    <td style="width: 70px;height: 40px"> <span class="t_title">时间</span></td>
                                    <td style="width: 70px;height: 40px"> <span class="t_title">平均浓度</span></td>
                                    <td v-for="name in epeclass"> <span class="t_title">{{name.pointname}}</span></td>
                                </tr>
                                <tr v-for="item in alldatalist">
                                    <td bgcolor="#4CC18F"><span class="t_items">{{item.mtime}}点</span> </td>
                                    <td :bgcolor="AccordingToNumericalColor(item.avgratio)"><span class="t_items"  :style="{color:item.avgratio >= 80 ?'#fff':''}">{{item.avgratio}}</span></td>
                                    <td v-for="ite in item.list" :bgcolor="AccordingToNumericalColor2(ite.meanratio)" :style="{color:ite.meanratio >= 0.6?'#fff':''}"><span class="t_items">{{parseInt(ite.meanratio*100)}}%</span></td>
                                </tr>
                                <tr>
                                    <td bgcolor="#4CC18F"><span class="t_items">均值</span></td>
                                    <td v-for="(v,i) in lsLastRowData"  :bgcolor="AccordingToNumericalColor2(v)" :style="{color:v >= 0.6?'#fff':''}"><span class="t_items">{{i===0 ? v : (parseInt(v*100)+'%')}}</span></td>
                                    <!--<td v-for="EpName in epelements"><span class="t_items">{{EpName}}</span></td>-->
                                </tr>
                            </table>
                        </div>
                        <!---->
                    </div>
                    <!---->
                    <div style="width: 100%;height: 30px"></div>
                    <!---->
                </el-tab-pane>
                <el-tab-pane label="小时浓度" name="second">
                    <!---->
                    <!---->
                    <div class="kass">
                        <div class="wbiaoti">
                            <a>查询条件</a>
                        </div>
                    </div>
                    <!--查询条件-->
                    <div class="chaxuntiaojian">
                        <div class="float001">
                            <el-radio-group v-model="region">
                                <el-radio-button label="市区"></el-radio-button>
                                <el-radio-button label="环京县市"></el-radio-button>
                                <el-radio-button label="南部县市"></el-radio-button>
                                <el-radio-button label="自定义"></el-radio-button>
                            </el-radio-group>
                        </div>
                        <div class="float002 day01">
                            <el-date-picker
                                    v-model="timevalue"
                                    type="date"
                                    placeholder="选择日期"
                                    :picker-options="pickerOptions0">
                            </el-date-picker>
                        </div>
                        <div class="float003">
                            <el-button type="primary" @click='GetDayDataByTime'>查询</el-button>
                        </div>
                    </div>
                    <!--自定义选择框-->
                    <div class="custom" v-show="region =='自定义'? true:false">
                        <!--国控点-->
                        <div class="gs_box">
                            <div class="gs_classtitle">国控点：</div>
                            <div class="gs_classright">
                                <el-checkbox-group
                                        v-model="checkedCities1"
                                        @change = "checkedCitieTable"
                                        :min="1"
                                        :max="4">
                                    <el-checkbox v-for="city in cities1" :label="city" :key="city">{{city}}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                        <!--省控点-->
                        <div class="gs_box">
                            <div class="gs_classtitle">省控点：</div>
                            <div class="gs_classright">
                                <el-checkbox-group
                                        v-model="checkedCities2"
                                        @change = "checkedCitieTable"
                                        :min="1"
                                        :max="8">
                                    <el-checkbox v-for="city in cities2" :label="city" :key="city">{{city}}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                    </div>
                    <!---->
                    <div class="kass">
                        <div class="wbiaoti">
                            <a>数据列表</a>
                        </div>
                    </div>
                    <!--查询条件-->
                    <div class="chaxuntiaojian">
                        <div class="float001">
                            <el-radio-group v-model="StatisticalRankingsName" @change='GetChangeHoerData'>
                                <el-radio-button label="PM2.5"></el-radio-button>
                                <el-radio-button label="PM10"></el-radio-button>
                                <el-radio-button label="SO2"></el-radio-button>
                                <el-radio-button label="NO2"></el-radio-button>
                                <el-radio-button label="CO"></el-radio-button>
                                <el-radio-button label="O3"></el-radio-button>
                                <el-radio-button label="O3_8H"></el-radio-button>
                            </el-radio-group>
                        </div>

                    </div>
                    <!--表格-->
                    <div class="neirong">
                        <!---->
                        <div class="lie_teble">
                            <table id="testTable2" border="0" borderColor="#fff" width="500">
                                <tr style="background: #4CC18F;color: #000;">
                                    <td style="width: 70px;height: 40px"> <span class="t_title">时间</span></td>
                                    <td style="width: 70px;height: 40px"> <span class="t_title">平均浓度</span></td>
                                    <td v-for="name in epeclass"> <span class="t_title">{{name.pointname}}</span></td>
                                </tr>
                                <tr v-for="item in alldatalist">
                                    <td bgcolor="#4CC18F"><span class="t_items">{{item.mtime}}点</span> </td>
                                    <td :bgcolor="AccordingToNumericalColor(item.avgratio)"><span class="t_items"  :style="{color:item.avgratio >= 80?'#fff':''}">{{item.avgratio}}</span></td>
                                    <td v-for="ite in item.list" :bgcolor="AccordingToNumericalColor(ite.ratio)" ><span class="t_items" :style="{color:ite.ratio >= 80?'#fff':''}">{{ite.ratio}}</span></td>
                                </tr>
                                <tr>
                                    <td bgcolor="#4CC18F"><span class="t_items">均值</span></td>
                                    <td v-for="(v,i) in lsLastRowData2"  :bgcolor="AccordingToNumericalColor(v)"><span class="t_items"  :style="{color:v >= 80?'#fff':''}">{{v}}</span></td>
                                    <!--<td v-for="EpName in epelements"><span class="t_items">{{EpName}}</span></td>-->
                                </tr>
                            </table>
                        </div>
                        <!---->
                    </div>
                    <!---->
                    <div style="width: 100%;height: 30px"></div>
                    <!---->
                </el-tab-pane>
                <el-tab-pane label="日均值比" name="third">
                    <!---->
                    <!---->
                    <div class="kass">
                        <div class="wbiaoti">
                            <a>查询条件</a>
                        </div>
                    </div>
                    <!--查询条件-->
                    <div class="chaxuntiaojian">
                        <div class="float001">
                            <el-radio-group v-model="region" @change="GetChangeDayData">
                                <el-radio-button label="市区"></el-radio-button>
                                <el-radio-button label="环京县市"></el-radio-button>
                                <el-radio-button label="南部县市"></el-radio-button>
                                <el-radio-button label="自定义"></el-radio-button>
                            </el-radio-group>
                        </div>
                        <div class="float002">
                            <el-date-picker v-model="startDay" type="date" placeholder="选择开始日期">
                            </el-date-picker>
                            <el-date-picker v-model="endDay" type="date" placeholder="选择结束日期">
                            </el-date-picker>
                        </div>
                        <div class="float003">
                            <el-button type="primary" @click='GetDayDataByTime'>查询</el-button>
                        </div>
                    </div>
                    <!--自定义选择框-->
                    <div class="custom" v-show="region =='自定义'? true:false">
                        <!--国控点-->
                        <div class="gs_box">
                            <div class="gs_classtitle">国控点：</div>
                            <div class="gs_classright">
                                <el-checkbox-group
                                        v-model="checkedCities1"
                                        @change = "checkedCitieTable"
                                        :min="1"
                                        :max="4">
                                    <el-checkbox v-for="city in cities1" :label="city" :key="city">{{city}}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                        <!--省控点-->
                        <div class="gs_box">
                            <div class="gs_classtitle">省控点：</div>
                            <div class="gs_classright">
                                <el-checkbox-group
                                        v-model="checkedCities2"
                                        @change = "checkedCitieTable"
                                        :min="1"
                                        :max="8">
                                    <el-checkbox v-for="city in cities2" :label="city" :key="city">{{city}}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                    </div>
                    <!---->
                    <div class="kass">
                        <div class="wbiaoti">
                            <a>数据列表</a>
                        </div>
                    </div>
                    <!--查询条件-->
                    <div class="chaxuntiaojian">
                        <div class="float001">
                            <el-radio-group v-model="StatisticalRankingsName" @change='GetChangeDayData'>
                                <el-radio-button label="PM2.5"></el-radio-button>
                                <el-radio-button label="PM10"></el-radio-button>
                                <el-radio-button label="SO2"></el-radio-button>
                                <el-radio-button label="NO2"></el-radio-button>
                                <el-radio-button label="CO"></el-radio-button>
                                <el-radio-button label="O3"></el-radio-button>
                                <el-radio-button label="O3_8H"></el-radio-button>
                            </el-radio-group>
                        </div>

                    </div>
                    <!--表格-->
                    <div class="neirong">
                        <!---->
                        <div class="lie_teble">
                            <table id="testTable3" border="0" borderColor="#fff" width="500">
                                <tr style="background: #4CC18F;color: #000;">
                                    <td style="width: 120px;height: 40px"> <span class="t_title">时间</span></td>
                                    <td style="width: 70px;height: 40px"> <span class="t_title">平均浓度</span></td>
                                    <td v-for="name in epeclass2"> <span class="t_title">{{name.pointname}}</span></td>
                                </tr>
                                <tr v-for="item in alldatalist2">
                                    <td bgcolor="#4CC18F"><span class="t_items">{{item.mtime}}日</span> </td>
                                    <td :bgcolor="AccordingToNumericalColor(item.avgratio)"><span class="t_items"  :style="{color:item.avgratio >= 80 ?'#fff':''}">{{item.avgratio}}</span></td>
                                    <td v-for="ite in item.list" :bgcolor="AccordingToNumericalColor2(ite.meanratio)" :style="{color:ite.meanratio >= 0.6?'#fff':''}"><span class="t_items">{{parseInt(ite.meanratio*100)}}%</span></td>
                                </tr>
                                <tr>
                                    <td bgcolor="#4CC18F"><span class="t_items">均值</span></td>
                                    <td v-for="(v,i) in lsLastRowData3"  :bgcolor="AccordingToNumericalColor2(v)" :style="{color:v >= 0.6?'#fff':''}"><span class="t_items">{{i===0 ? v : (parseInt(v*100)+'%')}}</span></td>
                                    <!--<td v-for="EpName in epelements"><span class="t_items">{{EpName}}</span></td>-->
                                </tr>
                            </table>
                        </div>
                        <!---->
                    </div>
                    <!---->
                    <div style="width: 100%;height: 30px"></div>
                    <!---->
                </el-tab-pane>
                <el-tab-pane label="日浓度" name="fourth">
                    <!---->
                    <!---->
                    <div class="kass">
                        <div class="wbiaoti">
                            <a>查询条件</a>
                        </div>
                    </div>
                    <!--查询条件-->
                    <div class="chaxuntiaojian">
                        <div class="float001">
                            <el-radio-group v-model="region" @change="GetChangeDayNdData">
                                <el-radio-button label="市区"></el-radio-button>
                                <el-radio-button label="环京县市"></el-radio-button>
                                <el-radio-button label="南部县市"></el-radio-button>
                                <el-radio-button label="自定义"></el-radio-button>
                            </el-radio-group>
                        </div>
                        <div class="float002">
                            <el-date-picker v-model="startDay" type="date" placeholder="选择开始日期">
                            </el-date-picker>
                            <el-date-picker v-model="endDay" type="date" placeholder="选择结束日期">
                            </el-date-picker>
                        </div>
                        <div class="float003">
                            <el-button type="primary" @click='GetDayDataByTime'>查询</el-button>
                        </div>
                    </div>
                    <!--自定义选择框-->
                    <div class="custom" v-show="region =='自定义'? true:false">
                        <!--国控点-->
                        <div class="gs_box">
                            <div class="gs_classtitle">国控点：</div>
                            <div class="gs_classright">
                                <el-checkbox-group
                                        v-model="checkedCities1"
                                        @change = "checkedCitieTable"
                                        :min="1"
                                        :max="4">
                                    <el-checkbox v-for="city in cities1" :label="city" :key="city">{{city}}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                        <!--省控点-->
                        <div class="gs_box">
                            <div class="gs_classtitle">省控点：</div>
                            <div class="gs_classright">
                                <el-checkbox-group
                                        v-model="checkedCities2"
                                        @change = "checkedCitieTable"
                                        :min="1"
                                        :max="8">
                                    <el-checkbox v-for="city in cities2" :label="city" :key="city">{{city}}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                    </div>
                    <!---->
                    <div class="kass">
                        <div class="wbiaoti">
                            <a>数据列表</a>
                        </div>
                    </div>
                    <!--查询条件-->
                    <div class="chaxuntiaojian">
                        <div class="float001">
                            <el-radio-group v-model="StatisticalRankingsName" @change='GetChangeDayNdData'>
                                <el-radio-button label="PM2.5"></el-radio-button>
                                <el-radio-button label="PM10"></el-radio-button>
                                <el-radio-button label="SO2"></el-radio-button>
                                <el-radio-button label="NO2"></el-radio-button>
                                <el-radio-button label="CO"></el-radio-button>
                                <el-radio-button label="O3"></el-radio-button>
                                <el-radio-button label="O3_8H"></el-radio-button>
                            </el-radio-group>
                        </div>

                    </div>
                    <!--表格-->
                    <div class="neirong">
                        <!---->
                        <div class="lie_teble">
                            <table id="testTable4" border="0" borderColor="#fff" width="500">
                                <tr style="background: #4CC18F;color: #000;">
                                    <td style="width: 120px;height: 40px"> <span class="t_title">时间</span></td>
                                    <td style="width: 70px;height: 40px"> <span class="t_title">平均浓度</span></td>
                                    <td v-for="name in epeclass2"> <span class="t_title">{{name.pointname}}</span></td>
                                </tr>
                                <tr v-for="item in alldatalist2">
                                    <td bgcolor="#4CC18F"><span class="t_items">{{item.mtime}}日</span> </td>
                                    <td :bgcolor="AccordingToNumericalColor(item.avgratio)"><span class="t_items"  :style="{color:item.avgratio >= 80?'#fff':''}">{{item.avgratio}}</span></td>
                                    <td v-for="ite in item.list" :bgcolor="AccordingToNumericalColor(ite.ratio)" ><span class="t_items" :style="{color:ite.ratio >= 80?'#fff':''}">{{ite.ratio}}</span></td>
                                </tr>
                                <tr>
                                    <td bgcolor="#4CC18F"><span class="t_items">均值</span></td>
                                    <td v-for="(v,i) in lsLastRowData4"  :bgcolor="AccordingToNumericalColor(v)"><span class="t_items"  :style="{color:v >= 80?'#fff':''}">{{v}}</span></td>
                                    <!--<td v-for="EpName in epelements"><span class="t_items">{{EpName}}</span></td>-->
                                </tr>
                            </table>
                        </div>
                        <!---->
                    </div>
                    <!---->
                    <div style="width: 100%;height: 30px"></div>
                    <!---->
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
    import {bus} from '@/js/bus.js'
    import api from '../../api/index'
    export default {
        name: 'Meanratiosensornetwork',
        data() {
            return {
                //页面数据
                tanchu: false,
                //小时平均值数值
                lsLastRowData:[],
                //小时浓度值
                lsLastRowData2:[],
                //日平均值数值
                lsLastRowData3:[],
                //日浓度值
                lsLastRowData4:[],
                //页面大标题
                TitleName: 'first',
                //统计排名查询条件
                StatisticalRankingsName: 'PM2.5',
                //平均值001
                data1:10,
                //时间选择器
                pickerOptions0: {},
                //选择时间值
                timevalue: '',
                //开始日期
                startDay:'',
                //结束日期
                endDay:'',
                //开始时间
                startTime: '',
                //结束时间
                endTime: '',
                //小时平均值&&浓度
                alldatalist:'',
                //日平均值&&浓度
                alldatalist2:'',
                //小时表头名称
                epeclass:[],
                //日表头名称
                epeclass2:[],
                //默认选项值
                activeName: 'first',
                //地区值
                region: '市区',
                //初始值
                epelements:['北华航天学院','河北工业大学','开发区','药材公司'],
                //初始选项值1
                checkedCities1: [],
                //初始选项值2
                checkedCities2: ['文安县环保局','文安县一中'],
                //国控点选项
                cities1: [],
                //省控点选项
                cities2: [],
                //现在时间
                nowtime:'',

            };
        },
        beforeCreate() {
            //beforeCreate 创建前状态====
        },
        created() {
            //默认初始值
            this.getTimeNow();
            this.getHourConcentrationData('SQ','pm25',this.nowtime,'');
            this.getDayConcentrationData('SQ','pm25',this.startDay,this.endDay,'')
        },
        beforeMount() {
            //beforeMount 挂载前状态===
        },
        mounted() {
            //mounted 挂载结束状态=====
            let t = this;
            api.GetPointInfoName().then(res =>{
               // console.log(res);
                let listdata = res.data.Data;
                if (listdata) {
                    for (let i = 0, length = listdata.length; i < length; i++) {
                        let item = listdata[i];
                        if (item.pointlevel == "国控点") {
                            t.cities1.push(listdata[i].pointname);
                        }else if(item.pointlevel == "省控点"){
                            t.cities2.push(listdata[i].pointname);
                        }
                    }
                }
            }).catch( error => {
                console.log(error);
            });
        },
        beforeUpdate() {
            //beforeUpdate 更新前状态====
        },
        methods: {
            // 所有方法
            handleClick(tab, event) {
                console.log(tab, event);
            },
            //每页显示数据量变更
            handleSizeChange(val) {
            },
            //点击页码换页
            handleCurrentChange(val) {
                this.setPageTable(10, val);
            },
            //小时均值
            GetChangeofData(){
                let t = this;
                let nt = this.nowtime;
                //小时平均值
                let Time1 = $('.day01 input').val()?$('.day01 input').val():nt;
                //let Time1 = '2018-02-01';
                //console.log(Time1);
                //查询条件分类
                let region = this.region;
                //console.log(region);
                //分类请求
                switch (region){
                    //市区
                    case '市区':
                        //获取下面指标
                        let staticname1 = this.StatisticalRankingsName;
                        let ar = 'SQ';
                        let ty = 'pm25';
                        let montm = Time1;
                        let poin = '';
                        //分类请求数据
                        switch (staticname1){
                            case 'PM2.5':
                                //
                                ty = 'pm25';
                                //console.log('pm2.5')
                                t.getHourConcentrationData(ar,ty,montm,poin);
                                break;
                            case 'PM10':
                                ty = 'pm10';
                                //console.log('pm10')
                               t.getHourConcentrationData(ar,ty,montm,poin);
                                break;
                            case 'SO2':
                                ty = 'so2';
                                //console.log('so2')
                               t.getHourConcentrationData(ar,ty,montm,poin);
                                break;
                            case 'NO2':
                                ty = 'no2';
                                //console.log('no2')
                                t.getHourConcentrationData(ar,ty,montm,poin);
                                break;
                            case 'CO':
                                ty = 'co';
                               // console.log('co2')
                                t.getHourConcentrationData(ar,ty,montm,poin);
                                break;
                            case 'O3':
                                ty = 'o3';
                                //console.log('o3')
                               t.getHourConcentrationData(ar,ty,montm,poin);
                                break;
                            case 'O3_8H':
                                window.alert('数据开发中');
                                break;
                        }
                        break;
                    //琼京县区
                    case '环京县市':
                        //获取下面指标
                        let staticname2 = this.StatisticalRankingsName;
                        let ar2 = 'HJXS';
                        let ty2 = 'pm25';
                        let montm2 = Time1;
                        let poin2 = '';
                        //分类请求数据
                        switch (staticname2){
                            case 'PM2.5':
                                //
                                ty2 = 'pm25';
                                //console.log('pm2.5')
                                t.getHourConcentrationData(ar2,ty2,montm2,poin2);
                                break;
                            case 'PM10':
                                ty2 = 'pm10';
                                //console.log('pm10')
                                t.getHourConcentrationData(ar2,ty2,montm2,poin2);
                                break;
                            case 'SO2':
                                ty2 = 'so2';
                                //console.log('so2')
                                t.getHourConcentrationData(ar2,ty2,montm2,poin2);
                                break;
                            case 'NO2':
                                ty2 = 'no2';
                                //console.log('no2')
                                t.getHourConcentrationData(ar2,ty2,montm2,poin2);
                                break;
                            case 'CO':
                                ty2 = 'co';
                                //console.log('co2')
                                t.getHourConcentrationData(ar2,ty2,montm2,poin2);
                                break;
                            case 'O3':
                                ty2 = 'o3';
                               // console.log('o3')
                                t.getHourConcentrationData(ar2,ty2,montm2,poin2);
                                break;
                            case 'O3_8H':
                                window.alert('数据开发中');
                                break;
                        }
                        break;
                    //南部县区
                    case '南部县市':
                        //获取下面指标
                        let staticname3 = this.StatisticalRankingsName;
                        let ar3 = 'NBXS';
                        let ty3 = 'pm25';
                        let montm3 = Time1;
                        let poin3 = '';
                        //分类请求数据
                        switch (staticname3){
                            case 'PM2.5':
                                //
                                ty3 = 'pm25';
                                //console.log('pm2.5')
                                t.getHourConcentrationData(ar3,ty3,montm3,poin3);
                                break;
                            case 'PM10':
                                ty3 = 'pm10';
                                //console.log('pm10')
                                t.getHourConcentrationData(ar3,ty3,montm3,poin3);
                                break;
                            case 'SO2':
                                ty3 = 'so2';
                                //console.log('so2')
                                t.getHourConcentrationData(ar3,ty3,montm3,poin3);
                                break;
                            case 'NO2':
                                ty3 = 'no2';
                                //console.log('no2')
                                t.getHourConcentrationData(ar3,ty3,montm3,poin3);
                                break;
                            case 'CO':
                                ty3 = 'co';
                                //console.log('co')
                                t.getHourConcentrationData(ar3,ty3,montm3,poin3);
                                break;
                            case 'O3':
                                ty3 = 'o3';
                                //console.log('o3')
                                t.getHourConcentrationData(ar3,ty3,montm3,poin3);
                                break;
                            case 'O3_8H':
                                window.alert('数据开发中');
                                break;
                        }
                        break;
                    //自定义
                    case '自定义':
                        //获取下面指标
                        let staticname4 = this.StatisticalRankingsName;
                        let ar4 = 'ZDY';
                        let ty4 = 'pm25';
                        let montm4 = Time1;
                        let poin4 = t.epelements.toString();
                        //分类请求数据
                        switch (staticname4){
                            case 'PM2.5':
                                //当pm25时候请求数据
                                ty4 = 'pm25';
                                //console.log(poin);
                                t.getHourConcentrationData(ar4,ty4,montm4,poin4);
                                break;
                            case 'PM10':
                                //当pm25时候请求数据
                                ty4 = 'pm10';
                                //console.log('pm10')
                                t.getHourConcentrationData(ar4,ty4,montm4,poin4);
                                break;
                            case 'SO2':
                                //当pm25时候请求数据
                                ty4 = 'so2';
                                //console.log('so2')
                                t.getHourConcentrationData(ar4,ty4,montm4,poin4);
                                break;
                            case 'NO2':
                                //当pm25时候请求数据
                                ty4 = 'no2';
                               // console.log('no2')
                                t.getHourConcentrationData(ar4,ty4,montm4,poin4);
                                break;
                            case 'CO':
                                //当pm25时候请求数据
                                ty4 = 'co';
                                //console.log('co')
                                t.getHourConcentrationData(ar4,ty4,montm4,poin4);
                                break;
                            case 'O3':
                                //当pm25时候请求数据
                                ty4 = 'o3';
                                //console.log('o3')
                                t.getHourConcentrationData(ar4,ty4,montm4,poin4);
                                break;
                            case 'O3_8H':
                                window.alert('数据开发中');
                                break;
                        }
                        break;
                }
            },
            //小时浓度
            GetChangeHoerData(){
                let t = this;
                let nt = this.nowtime;
                //小时平均值
                let Time1 = $('.day01 input').val()?$('.day01 input').val():nt;
                //console.log(Time1);
                //查询条件分类
                let region = this.region;
                //console.log(region);
                //分类请求
                switch (region){
                    //市区
                    case '市区':
                        //获取下面指标
                        let staticname1 = this.StatisticalRankingsName;
                        let ar = 'SQ';
                        let ty = 'pm25';
                        let montm = Time1;
                        let poin = '';
                        //分类请求数据
                        switch (staticname1){
                            case 'PM2.5':
                                //
                                ty = 'pm25';
                                //console.log('pm2.5')
                                t.getHourConcentrationData(ar,ty,montm,poin);
                                break;
                            case 'PM10':
                                ty = 'pm10';
                                //console.log('pm10')
                                t.getHourConcentrationData(ar,ty,montm,poin);
                                break;
                            case 'SO2':
                                ty = 'so2';
                                //console.log('so2')
                                t.getHourConcentrationData(ar,ty,montm,poin);
                                break;
                            case 'NO2':
                                ty = 'no2';
                                //console.log('no2')
                                t.getHourConcentrationData(ar,ty,montm,poin);
                                break;
                            case 'CO':
                                ty = 'co';
                                //console.log('co2')
                                t.getHourConcentrationData(ar,ty,montm,poin);
                                break;
                            case 'O3':
                                ty = 'o3';
                               // console.log('o3')
                                t.getHourConcentrationData(ar,ty,montm,poin);
                                break;
                            case 'O3_8H':
                                window.alert('数据开发中');
                                break;
                        }
                        break;
                    //琼京县区
                    case '环京县市':
                        //获取下面指标
                        let staticname2 = this.StatisticalRankingsName;
                        let ar2 = 'HJXS';
                        let ty2 = 'pm25';
                        let montm2 = Time1;
                        let poin2 = '';
                        //分类请求数据
                        switch (staticname2){
                            case 'PM2.5':
                                //
                                ty2 = 'pm25';
                                //console.log('pm2.5')
                                t.getHourConcentrationData(ar2,ty2,montm2,poin2);
                                break;
                            case 'PM10':
                                ty2 = 'pm10';
                               // console.log('pm10')
                                t.getHourConcentrationData(ar2,ty2,montm2,poin2);
                                break;
                            case 'SO2':
                                ty2 = 'so2';
                                //console.log('so2')
                                t.getHourConcentrationData(ar2,ty2,montm2,poin2);
                                break;
                            case 'NO2':
                                ty2 = 'no2';
                                //console.log('no2')
                                t.getHourConcentrationData(ar2,ty2,montm2,poin2);
                                break;
                            case 'CO':
                                ty2 = 'co';
                               // console.log('co2')
                                t.getHourConcentrationData(ar2,ty2,montm2,poin2);
                                break;
                            case 'O3':
                                ty2 = 'o3';
                                //console.log('o3')
                                t.getHourConcentrationData(ar2,ty2,montm2,poin2);
                                break;
                            case 'O3_8H':
                                window.alert('数据开发中');
                                break;
                        }
                        break;
                    //南部县区
                    case '南部县市':
                        //获取下面指标
                        let staticname3 = this.StatisticalRankingsName;
                        let ar3 = 'NBXS';
                        let ty3 = 'pm25';
                        let montm3 = Time1;
                        let poin3 = '';
                        //分类请求数据
                        switch (staticname3){
                            case 'PM2.5':
                                //
                                ty3 = 'pm25';
                                //console.log('pm2.5')
                                t.getHourConcentrationData(ar3,ty3,montm3,poin3);
                                break;
                            case 'PM10':
                                ty3 = 'pm10';
                                //console.log('pm10')
                                t.getHourConcentrationData(ar3,ty3,montm3,poin3);
                                break;
                            case 'SO2':
                                ty3 = 'so2';
                                //console.log('so2')
                                t.getHourConcentrationData(ar3,ty3,montm3,poin3);
                                break;
                            case 'NO2':
                                ty3 = 'no2';
                                //console.log('no2')
                                t.getHourConcentrationData(ar3,ty3,montm3,poin3);
                                break;
                            case 'CO':
                                ty3 = 'co';
                                //console.log('co')
                                t.getHourConcentrationData(ar3,ty3,montm3,poin3);
                                break;
                            case 'O3':
                                ty3 = 'o3';
                                //console.log('o3')
                                t.getHourConcentrationData(ar3,ty3,montm3,poin3);
                                break;
                            case 'O3_8H':
                                window.alert('数据开发中');
                                break;
                        }
                        break;
                    //自定义
                    case '自定义':
                        //获取下面指标
                        let staticname4 = this.StatisticalRankingsName;
                        let ar4 = 'ZDY';
                        let ty4 = 'pm25';
                        let montm4 = Time1;
                        let poin4 = t.epelements.toString();
                        //分类请求数据
                        switch (staticname4){
                            case 'PM2.5':
                                //当pm25时候请求数据
                                ty4 = 'pm25';
                                //console.log(poin);
                                t.getHourConcentrationData(ar4,ty4,montm4,poin4);
                                break;
                            case 'PM10':
                                //当pm25时候请求数据
                                ty4 = 'pm10';
                                //console.log('pm10')
                                t.getHourConcentrationData(ar4,ty4,montm4,poin4);
                                break;
                            case 'SO2':
                                //当pm25时候请求数据
                                ty4 = 'so2';
                                //console.log('so2')
                                t.getHourConcentrationData(ar4,ty4,montm4,poin4);
                                break;
                            case 'NO2':
                                //当pm25时候请求数据
                                ty4 = 'no2';
                                // console.log('no2')
                                t.getHourConcentrationData(ar4,ty4,montm4,poin4);
                                break;
                            case 'CO':
                                //当pm25时候请求数据
                                ty4 = 'co';
                                //console.log('co')
                                t.getHourConcentrationData(ar4,ty4,montm4,poin4);
                                break;
                            case 'O3':
                                //当pm25时候请求数据
                                ty4 = 'o3';
                                //console.log('o3')
                                t.getHourConcentrationData(ar4,ty4,montm4,poin4);
                                break;
                            case 'O3_8H':
                                window.alert('数据开发中');
                                break;
                        }
                        break;
                }
            },
            //日均值
            GetChangeDayData(){
                let t = this;
                //小时平均值
                let ndt = new Date();
                let ndt2 = new Date(ndt);
                ndt2.setDate(ndt.getDate() - 2);
                //时间选择器
                let dateNow = this.startDay || new Date() ;
                let dateNowEnd = this.endDay || new Date();
                let strT2= (ndt2.getFullYear() + '-' + (ndt2.getMonth() + 1) + '-' + ndt2.getDate());
                let endT2= (ndt.getFullYear() + '-' + (ndt.getMonth() + 1) + '-' + ndt.getDate());
                let strT1 = `${dateNow.getFullYear()}-${(dateNow.getMonth() + 1)}-${dateNow.getDate()}`;
                let endT1 = `${dateNowEnd.getFullYear()}-${ (dateNowEnd.getMonth() + 1)}-${ dateNowEnd.getDate()}`;
                //开始-结束时间
                let strT = strT1 || strT2;
                let endT = endT1 || endT2;
                //console.log(strT);
                //console.log(endT);
                //查询条件分类
                let region = this.region;
                //console.log(region);
                //分类请求
                switch (region){
                    //市区
                    case '市区':
                        //获取下面指标
                        let staticname1 = this.StatisticalRankingsName;
                        let ar = 'SQ';
                        let ty = 'pm25';
                        let str = strT ;
                        let end = endT ;
                        let poin = '';
                        //分类请求数据
                        switch (staticname1){
                            case 'PM2.5':
                                //
                                ty = 'pm25';
                               // console.log('pm2.5')
                                t.getDayConcentrationData(ar,ty,str,end,poin);
                                break;
                            case 'PM10':
                                ty = 'pm10';
                               // console.log('pm10')
                                t.getDayConcentrationData(ar,ty,str,end,poin);
                                break;
                            case 'SO2':
                                ty = 'so2';
                              //  console.log('so2')
                                t.getDayConcentrationData(ar,ty,str,end,poin);
                                break;
                            case 'NO2':
                                ty = 'no2';
                               // console.log('no2')
                                t.getDayConcentrationData(ar,ty,str,end,poin);
                                break;
                            case 'CO':
                                ty = 'co';
                              //  console.log('co2')
                                t.getDayConcentrationData(ar,ty,str,end,poin);
                                break;
                            case 'O3':
                                ty = 'o3';
                              //  console.log('o3')
                                t.getDayConcentrationData(ar,ty,str,end,poin);
                                break;
                            case 'O3_8H':
                                window.alert('数据开发中');
                                break;
                        }
                        break;
                    //琼京县区
                    case '环京县市':
                        //获取下面指标
                        let staticname2 = this.StatisticalRankingsName;
                        let ar2 = 'HJXS';
                        let ty2 = 'pm25';
                        let str2 = strT ;
                        let end2 = endT ;
                        let poin2 = '';
                        //分类请求数据
                        switch (staticname2){
                            case 'PM2.5':
                                //
                                ty2 = 'pm25';
                              //  console.log('pm2.5')
                                t.getDayConcentrationData(ar2,ty2,str2,end2,poin2);
                                break;
                            case 'PM10':
                                ty2 = 'pm10';
                              //  console.log('pm10')
                                t.getDayConcentrationData(ar2,ty2,str2,end2,poin2);
                                break;
                            case 'SO2':
                                ty2 = 'so2';
                              //  console.log('so2')
                                t.getDayConcentrationData(ar2,ty2,str2,end2,poin2);
                                break;
                            case 'NO2':
                                ty2 = 'no2';
                               // console.log('no2')
                                t.getDayConcentrationData(ar2,ty2,str2,end2,poin2);
                                break;
                            case 'CO':
                                ty2 = 'co';
                               // console.log('co2')
                                t.getDayConcentrationData(ar2,ty2,str2,end2,poin2);
                                break;
                            case 'O3':
                                ty2 = 'o3';
                               // console.log('o3')
                                t.getDayConcentrationData(ar2,ty2,str2,end2,poin2);
                                break;
                            case 'O3_8H':
                                window.alert('数据开发中');
                                break;
                        }
                        break;
                    //南部县区
                    case '南部县市':
                        //获取下面指标
                        let staticname3 = this.StatisticalRankingsName;
                        let ar3 = 'NBXS';
                        let ty3 = 'pm25';
                        let str3 = strT ;
                        let end3 = endT ;
                        let poin3 = '';
                        //分类请求数据
                        switch (staticname3){
                            case 'PM2.5':
                                //
                                ty3 = 'pm25';
                                //console.log('pm2.5')
                                t.getDayConcentrationData(ar3,ty3,str3,end3,poin3);
                                break;
                            case 'PM10':
                                ty3 = 'pm10';
                                //console.log('pm10')
                                t.getDayConcentrationData(ar3,ty3,str3,end3,poin3);
                                break;
                            case 'SO2':
                                ty3 = 'so2';
                                //console.log('so2')
                                t.getDayConcentrationData(ar3,ty3,str3,end3,poin3);
                                break;
                            case 'NO2':
                                ty3 = 'no2';
                                //console.log('no2')
                                t.getDayConcentrationData(ar3,ty3,str3,end3,poin3);
                                break;
                            case 'CO':
                                ty3 = 'co';
                                //console.log('co')
                                t.getDayConcentrationData(ar3,ty3,str3,end3,poin3);
                                break;
                            case 'O3':
                                ty3 = 'o3';
                                //console.log('o3')
                                t.getDayConcentrationData(ar3,ty3,str3,end3,poin3);
                                break;
                            case 'O3_8H':
                                window.alert('数据开发中');
                                break;
                        }
                        break;
                    //自定义
                    case '自定义':
                        //获取下面指标
                        let staticname4 = this.StatisticalRankingsName;
                        let ar4 = 'ZDY';
                        let ty4 = 'pm25';
                        let str4 = strT ;
                        let end4 = endT ;
                        let poin4 = t.epelements.toString();
                        //分类请求数据
                        switch (staticname4){
                            case 'PM2.5':
                                //当pm25时候请求数据
                                ty4 = 'pm25';
                                //console.log(poin);
                                t.getDayConcentrationData(ar4,ty4,str4,end4,poin4);
                                break;
                            case 'PM10':
                                //当pm25时候请求数据
                                ty4 = 'pm10';
                                //console.log('pm10')
                                t.getDayConcentrationData(ar4,ty4,str4,end4,poin4);
                                break;
                            case 'SO2':
                                //当pm25时候请求数据
                                ty4 = 'so2';
                                //console.log('so2')
                                t.getDayConcentrationData(ar4,ty4,str4,end4,poin4);
                                break;
                            case 'NO2':
                                //当pm25时候请求数据
                                ty4 = 'no2';
                                // console.log('no2')
                                t.getDayConcentrationData(ar4,ty4,str4,end4,poin4);
                                break;
                            case 'CO':
                                //当pm25时候请求数据
                                ty4 = 'co';
                                //console.log('co')
                                t.getDayConcentrationData(ar4,ty4,str4,end4,poin4);
                                break;
                            case 'O3':
                                //当pm25时候请求数据
                                ty4 = 'o3';
                                //console.log('o3')
                                t.getDayConcentrationData(ar4,ty4,str4,end4,poin4);
                                break;
                            case 'O3_8H':
                                window.alert('数据开发中');
                                break;
                        }
                        break;

                }
            },
            //日浓度
            GetChangeDayNdData(){
                let t = this;
                //小时平均值
                let ndt = new Date();
                let ndt2 = new Date(ndt);
                ndt2.setDate(ndt.getDate() - 2);
                //时间选择器
                let dateNow = this.startDay || new Date();
                let dateNowEnd = this.endDay || new Date();
                let strT2= (ndt2.getFullYear() + '-' + (ndt2.getMonth() + 1) + '-' + ndt2.getDate());
                let endT2= (ndt.getFullYear() + '-' + (ndt.getMonth() + 1) + '-' + ndt.getDate());
                let strT1 = `${dateNow.getFullYear()}-${(dateNow.getMonth() + 1)}-${dateNow.getDate()}`;
                let endT1 = `${dateNowEnd.getFullYear()}-${ (dateNowEnd.getMonth() + 1)}-${ dateNowEnd.getDate()}`;
                //小时平均值
                let strT = strT1 || strT2;
                let endT = endT1 || endT2;
               // console.log(strT);
               // console.log(endT);
                //查询条件分类
                let region = this.region;
              //  console.log(region);
                //分类请求
                switch (region){
                    //市区
                    case '市区':
                        //获取下面指标
                        let staticname1 = this.StatisticalRankingsName;
                        let ar = 'SQ';
                        let ty = 'pm25';
                        let str = strT ;
                        let end = endT ;
                        let poin = '';
                        //分类请求数据
                        switch (staticname1){
                            case 'PM2.5':
                                //
                                ty = 'pm25';
                           //     console.log('pm2.5')
                                t.getDayConcentrationData(ar,ty,str,end,poin);
                                break;
                            case 'PM10':
                                ty = 'pm10';
                          //      console.log('pm10')
                                t.getDayConcentrationData(ar,ty,str,end,poin);
                                break;
                            case 'SO2':
                                ty = 'so2';
                           //     console.log('so2')
                                t.getDayConcentrationData(ar,ty,str,end,poin);
                                break;
                            case 'NO2':
                                ty = 'no2';
                          //      console.log('no2')
                                t.getDayConcentrationData(ar,ty,str,end,poin);
                                break;
                            case 'CO':
                                ty = 'co';
                           //     console.log('co2')
                                t.getDayConcentrationData(ar,ty,str,end,poin);
                                break;
                            case 'O3':
                                ty = 'o3';
                           //     console.log('o3')
                                t.getDayConcentrationData(ar,ty,str,end,poin);
                                break;
                            case 'O3_8H':
                                window.alert('数据开发中');
                                break;
                        }
                        break;
                    //琼京县区
                    case '环京县市':
                        //获取下面指标
                        let staticname2 = this.StatisticalRankingsName;
                        let ar2 = 'HJXS';
                        let ty2 = 'pm25';
                        let str2 = strT ;
                        let end2 = endT ;
                        let poin2 = '';
                        //分类请求数据
                        switch (staticname2){
                            case 'PM2.5':
                                //
                                ty2 = 'pm25';
                           //     console.log('pm2.5')
                                t.getDayConcentrationData(ar2,ty2,str2,end2,poin2);
                                break;
                            case 'PM10':
                                ty2 = 'pm10';
                            //    console.log('pm10')
                                t.getDayConcentrationData(ar2,ty2,str2,end2,poin2);
                                break;
                            case 'SO2':
                                ty2 = 'so2';
                            //    console.log('so2')
                                t.getDayConcentrationData(ar2,ty2,str2,end2,poin2);
                                break;
                            case 'NO2':
                                ty2 = 'no2';
                            //    console.log('no2')
                                t.getDayConcentrationData(ar2,ty2,str2,end2,poin2);
                                break;
                            case 'CO':
                                ty2 = 'co';
                            //    console.log('co2')
                                t.getDayConcentrationData(ar2,ty2,str2,end2,poin2);
                                break;
                            case 'O3':
                                ty2 = 'o3';
                            //    console.log('o3')
                                t.getDayConcentrationData(ar2,ty2,str2,end2,poin2);
                                break;
                            case 'O3_8H':
                                window.alert('数据开发中');
                                break;
                        }
                        break;
                    //南部县区
                    case '南部县市':
                        //获取下面指标
                        let staticname3 = this.StatisticalRankingsName;
                        let ar3 = 'NBXS';
                        let ty3 = 'pm25';
                        let str3 = strT ;
                        let end3 = endT ;
                        let poin3 = '';
                        //分类请求数据
                        switch (staticname3){
                            case 'PM2.5':
                                //
                                ty3 = 'pm25';
                                //console.log('pm2.5')
                                t.getDayConcentrationData(ar3,ty3,str3,end3,poin3);
                                break;
                            case 'PM10':
                                ty3 = 'pm10';
                                //console.log('pm10')
                                t.getDayConcentrationData(ar3,ty3,str3,end3,poin3);
                                break;
                            case 'SO2':
                                ty3 = 'so2';
                                //console.log('so2')
                                t.getDayConcentrationData(ar3,ty3,str3,end3,poin3);
                                break;
                            case 'NO2':
                                ty3 = 'no2';
                                //console.log('no2')
                                t.getDayConcentrationData(ar3,ty3,str3,end3,poin3);
                                break;
                            case 'CO':
                                ty3 = 'co';
                                //console.log('co')
                                t.getDayConcentrationData(ar3,ty3,str3,end3,poin3);
                                break;
                            case 'O3':
                                ty3 = 'o3';
                                //console.log('o3')
                                t.getDayConcentrationData(ar3,ty3,str3,end3,poin3);
                                break;
                            case 'O3_8H':
                                window.alert('数据开发中');
                                break;
                        }
                        break;
                    //自定义
                    case '自定义':
                        //获取下面指标
                        let staticname4 = this.StatisticalRankingsName;
                        let ar4 = 'ZDY';
                        let ty4 = 'pm25';
                        let str4 = strT ;
                        let end4 = endT ;
                        let poin4 = t.epelements.toString();
                        //分类请求数据
                        switch (staticname4){
                            case 'PM2.5':
                                //当pm25时候请求数据
                                ty4 = 'pm25';
                                //console.log(poin);
                                t.getDayConcentrationData(ar4,ty4,str4,end4,poin4);
                                break;
                            case 'PM10':
                                //当pm25时候请求数据
                                ty4 = 'pm10';
                                //console.log('pm10')
                                t.getDayConcentrationData(ar4,ty4,str4,end4,poin4);
                                break;
                            case 'SO2':
                                //当pm25时候请求数据
                                ty4 = 'so2';
                                //console.log('so2')
                                t.getDayConcentrationData(ar4,ty4,str4,end4,poin4);
                                break;
                            case 'NO2':
                                //当pm25时候请求数据
                                ty4 = 'no2';
                                // console.log('no2')
                                t.getDayConcentrationData(ar4,ty4,str4,end4,poin4);
                                break;
                            case 'CO':
                                //当pm25时候请求数据
                                ty4 = 'co';
                                //console.log('co')
                                t.getDayConcentrationData(ar4,ty4,str4,end4,poin4);
                                break;
                            case 'O3':
                                //当pm25时候请求数据
                                ty4 = 'o3';
                                //console.log('o3')
                                t.getDayConcentrationData(ar4,ty4,str4,end4,poin4);
                                break;
                            case 'O3_8H':
                                window.alert('数据开发中');
                                break;
                        }
                        break;
                }
            },
            //分类查询数据
            GetDayDataByTime(){
                let t = this;
                //模块class名称
                let mname = this.activeName;
                //不同页面自定义模块调用方法
                switch (mname){
                    //小时均值
                    case 'first':
                        t.GetChangeofData();
                        break;
                    //小时浓度
                    case 'second':
                        t.GetChangeHoerData();
                        break;
                    //日均值
                    case 'third':
                        t.GetChangeDayData();
                        break;
                    //日浓度
                    case 'fourth':
                        t.GetChangeDayNdData();
                        break;
                }
            },
            //自定义选项事件
            checkedCitieTable(){
                let t = this;
                //console.log('改变改变');
                let NewArray = this.checkedCities1.concat(this.checkedCities2);
                //累计选项集合
                this.epelements = NewArray;
                //模块class名称
                let mname = this.activeName;
                //不同页面自定义模块调用方法
                switch (mname){
                    //小时均值
                    case 'first':
                        t.GetChangeofData();
                        break;
                    //小时浓度
                    case 'second':
                        t.GetChangeHoerData();
                        break;
                    //日均值
                    case 'third':
                        t.GetChangeDayData();
                        break;
                    //日浓度
                    case 'fourth':
                       t.GetChangeDayNdData();
                        break;
                }

            },
            //根据浓度数值区分颜色模块1
            AccordingToNumericalColor(num){
                let rtValue;
                //判断数值对应颜色
                if (0 >= num && num <= 0.8){
                    rtValue = '#02ed4d';
                }else if(0.8 >= num && num <= 1.2){
                    rtValue = '#02ed22';
                }else if (1.2 >= num && num <= 1.6){
                    rtValue = '#39ed02';
                }else if (1.6 >= num && num <= 1.8){
                    rtValue = '#5aed02';
                }else if (1.8 >= num && num <= 3){
                    rtValue = '#75ed02';
                }else if (3 >= num && num <= 5){
                    rtValue = '#89ed02';
                }else if (5 >= num && num <= 10){
                    rtValue = '#a0ed02';
                }else if(10 >= num && num <= 20){
                    rtValue = '#abed02';
                }else if(20 >= num && num <= 40){
                    rtValue = '#d9ed02';
                }else if(40 >= num && num <= 50){
                    rtValue = '#e9ed02';
                }else if(50 >= num && num <= 60){
                    rtValue = '#eddc02';
                }else if(60 >= num && num <= 80){
                    rtValue = '#edcf02';
                }else if(80 >= num && num <= 120){
                    rtValue = '#ed8a02';
                }else if(120 >= num && num <= 160){
                    rtValue = '#ed6902';
                }else if(160 >= num && num <= 200){
                    rtValue = '#ed3702';
                }else if(200 >= num && num <= 240){
                    rtValue = '#ed0208';
                }else if(240 >= num && num <= 240){
                    rtValue = '#ed1d02';
                }else if(num > 240){
                    rtValue = '#56121b';
                }
                return rtValue;
            },
            //根据平均值颜色
            AccordingToNumericalColor2(num){
                let rtValue;
                if (-1 <= num && num <= -0.8){
                    rtValue = '#02ed4d';
                }else if(-0.8 <= num && num <= -0.7){
                    rtValue = '#02ed22';
                }else if (-0.7 <= num && num <= -0.6){
                    rtValue = '#39ed02';
                }else if (-0.6 <= num && num <= -0.5){
                    rtValue = '#5aed02';
                }else if (-0.5 <= num && num <= -0.4){
                    rtValue = '#75ed02';
                }else if (-0.4 <= num && num <= -0.3){
                    rtValue = '#89ed02';
                }else if (-0.3 <= num && num <= -0.2){
                    rtValue = '#a0ed02';
                }else if(-0.2 <= num && num <= -0.1){
                    rtValue = '#abed02';
                }else if(0 == num){
                    rtValue = '#c4ed02';
                }else if(0.2 >= num && num >= 0.1){
                    rtValue = '#d9ed02';
                }else if(0.3 >= num && num >= 0.2){
                    rtValue = '#e9ed02';
                }else if(0.4 >= num && num >= 0.3){
                    rtValue = '#eddc02';
                }else if(0.5 >= num && num >= 0.4){
                    rtValue = '#edcf02';
                }else if(0.6 >= num && num >= 0.5){
                    rtValue = '#ed8a02';
                }else if(0.7 >= num && num >= 0.6){
                    rtValue = '#ed6902';
                }else if(0.8 >= num && num >= 0.7){
                    rtValue = '#ed3702';
                }else if(0.9 >= num && num >= 0.8){
                    rtValue = '#ed1d02';
                }else if(2 >= num && num >= 1){
                    rtValue = '#ed0208';
                }else if(num > 2){
                    rtValue = this.AccordingToNumericalColor(num);
                }else {
                    rtValue = '#02ed4d';
                }
                return rtValue;
            },
            //获取小时浓度及均值比
            getHourConcentrationData(ar,ty,montm,poin){
                let t = this;
                //类型 市区-SQ 环京县市-HJXS 南部县市-NBXS 自定义--ZDY
                let area = ar;
                //类型 pm25 pm10 so2 co no o3
                let type = ty;
                //时间   2018-01-18
                let monitortime = montm;
                //自定义时传入监控点名称，以逗号分隔
                let pointname = poin;//'北华航天学院';
                //
                let jzbUrl = api.GetHourConcentrationRes();
                //数据请求
                $.ajax({
                    ///
                    url: jzbUrl,//"http://117.119.97.150:8063/api/MeanRatio/GetHourConcentration",
                    //url: "http://gkpt.zq12369.com:8016/api/MeanRatio/GetHourConcentration",
                    type: "post",
                    data: {
                        area:area,
                        type:type,
                        monitortime:monitortime,
                        pointname:pointname
                    },
                    dataType: "json",
                    success: function (data) {
                        //console.log('测试数据以一次');
                        let content = data.Data;
                        //第一行表头名字
                        t.epeclass = content[2].list;
                        //所有获取数据
                        t.alldatalist = content;
                        //浓度值数据
                        t.getLastRow(content);
                        //平均值数据
                        t.getLastMeanrRow(content);
                    },
                    error: function (result) {
                        console.log(result);
                    }
                });
            },
            //平均浓度值计算001
            getLastRow(lsData){
                let c = 0;
                let rtValue = [];
                for(let i=0,length=lsData.length;i<length;i++){
                  let v1= lsData[i];
                  c+=v1.avgratio;
                 let lsd = v1.list;
                 for(let j=0,count=lsd.length;j<count;j++){
                     //浓度
                     rtValue[j] = (rtValue[j] || 0) + (!lsd[j].ratio ? 0 : lsd[j].ratio);
                     //均值比
                 }
                }
                //记录数据行数量
                let Anum = lsData.length;
                //console.log('数据数量：'+lsData.length);
                let c1 = rtValue.map(v=>(v/Anum).toFixed(2));
                c1.unshift((c/Anum).toFixed(2));
                //设置数据
                this.lsLastRowData2 = c1;

            },
            //平均值计算001
            getLastMeanrRow(lsData){
                let c = 0;
                let rtValue = [];
                for(let i=0,length=lsData.length;i<length;i++){
                    let v1= lsData[i];
                    c+=v1.avgratio;
                    let lsd = v1.list;
                    for(let j=0,count=lsd.length;j<count;j++){
                        rtValue[j] = (rtValue[j] || 0) + (!lsd[j].meanratio ? 0 : lsd[j].meanratio) *100;
                    }
                }
                let Anum = lsData.length;
                console.log('数据数量：'+lsData.length);
                let c1 = rtValue.map(v=>(v/Anum/100).toFixed(2));
                c1.unshift((c/Anum).toFixed(2));
                this.lsLastRowData = c1;

            },
            //平均浓度值计算001
            getLastRow2(lsData){
                let c = 0;
                let rtValue = [];
                for(let i=0,length=lsData.length;i<length;i++){
                    let v1= lsData[i];
                    c+=v1.avgratio;
                    let lsd = v1.list;
                    for(let j=0,count=lsd.length;j<count;j++){
                        //浓度
                        rtValue[j] = (rtValue[j] || 0) + (!lsd[j].ratio ? 0 : lsd[j].ratio);
                        //均值比
                    }
                }
                //记录数据行数量
                let Anum = lsData.length;
                //console.log('数据数量：'+lsData.length);
                let c1 = rtValue.map(v=>(v/Anum).toFixed(2));
                c1.unshift((c/Anum).toFixed(2));
                //设置数据
                this.lsLastRowData4 = c1;
            },
            //平均值计算001
            getLastMeanrRow2(lsData){
                let c = 0;
                let rtValue = [];
                for(let i=0,length=lsData.length;i<length;i++){
                    let v1= lsData[i];
                    c+=v1.avgratio;
                    let lsd = v1.list;
                    for(let j=0,count=lsd.length;j<count;j++){
                        rtValue[j] = (rtValue[j] || 0) + (!lsd[j].meanratio ? 0 : lsd[j].meanratio) *100;
                    }
                }
                let Anum = lsData.length;
                console.log('数据数量：'+lsData.length);
                let c1 = rtValue.map(v=>(v/Anum/100).toFixed(2));
                c1.unshift((c/Anum).toFixed(2));
                this.lsLastRowData3 = c1;
            },
            //获取获取日浓度及均值比
            getDayConcentrationData(ar,ty,str,end,poin){
                let t = this;
                //类型 市区-SQ 环京县市-HJXS 南部县市-NBXS 自定义--ZDY
                let area = ar;
                //类型 pm25 pm10 so2 co no o3
                let type = ty;
                //开始时间   2018-01-18
                let starttime = str;
                //结束时间   2018-01-18
                let endtime = end;
                //自定义时传入监控点名称，以逗号分隔
                let pointname = poin;//'北华航天工业学院';
                //
                let jzbdayUrl =api.GetDayConcentrationRes();
                //
                $.ajax({
                    //url: "http://gkpt.zq12369.com:8016/api/MeanRatio/GetDayConcentration",
                    url: jzbdayUrl ,//"http://117.119.97.150:8063/api/MeanRatio/GetDayConcentration",
                    type: "post",
                    data: {
                        area:area,
                        type:type,
                        starttime:starttime,
                        endtime:endtime,
                        pointname:pointname
                    },
                    dataType: "json",
                    success: function (data) {
                        //console.log('测试数据以一次');
                        console.log(data)
                        let content = data.Data;
                        //第一行表头名字
                        t.epeclass2 = content[0].list || content[1].list || content[2].list;
                        //所有获取数据
                        t.alldatalist2 = content;
                        //浓度值数据
                        t.getLastRow2(content);
                        //平均值数据
                        t.getLastMeanrRow2(content);
                    },
                    error: function (result) {
                        console.log(result);
                    }
                });
            },
            //列表排列
            getSummaries(param) {
                const {columns, data} = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '总价';
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[index] += ' 元';
                    } else {
                        sums[index] = 'N/A';
                    }
                });

                return sums;
            },
            //timeNOW
            getTimeNow(){
                //设置
                let ndt = new Date();
                //返回
                this.nowtime = (ndt.getFullYear() + '-' + (ndt.getMonth() + 1) + '-' + ((ndt.getDate() - 1)?(ndt.getDate() - 1):1));

                let ndt1 = new Date(ndt);
                ndt1.setDate(ndt.getDate() - 7);
                // this.startHour =  (ndt1.getFullYear() + '-' + (ndt1.getMonth() + 1) + '-' + ndt1.getDate()+' '+ ndt1.getHours()+':00');
                // this.endHour =  (ndt.getFullYear() + '-' + (ndt.getMonth() + 1) + '-' + ndt.getDate()+' '+ ndt.getHours()+':00');
                this.startDay = ndt1;
                this.endDay = ndt;


            }
        }

    };
</script>
<style lang="scss" scoped>
    .Meanratiosensornetwork {
        width: 100%;
        height: auto;
        //title标题
        .warp6 {
            width: 96%;
            height: auto;
            margin: 0 auto;
            .neirong {
                width: 98%;
                height: auto;
                margin: 0 auto;
                .lie_teble{
                    width: 100%;
                    table{
                        width: 100%;

                        td{
                            padding: 0;
                            margin: 0;
                            border: solid 1px #fff;
                        }
                        .t_items{
                            display: inline-block;
                            height: 28px;
                            line-height: 28px;
                        }
                        .t_title{
                            font-weight: bold;
                        }
                    }
                }
                .t_item {
                    display: inline-block;
                    height: 36px;
                    line-height: 36px;
                    width: 100%;
                    background: #6d6d6d;

                }
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
                    text-align: left;
                    border-bottom: solid 1px #ccc;
                    width: 100%;
                    height: 40px;
                    margin-top: 10px;
                    margin-bottom: 20px;
                    margin-left: 10px;
                }
            }
            .custom{
                width: 99%;
                height: auto;
                border: solid 1px #4CC18F;
                padding: 20px;
                border-radius: 6px;
                background: #DDDDDD;
                margin: 0 auto;
                .gs_box:nth-child(1){
                    height: 32px;
                }
                .gs_box{
                    width: 100%;
                    height: 62px;

                    .gs_classtitle{
                        height: auto;
                        margin-right: 15px;
                        //line-height: 28px;
                        float: left;
                    }
                    .gs_classright{
                        height: auto;
                        width: 90%;
                        margin-right: 15px;
                        //line-height: 28px;
                        float: left;
                        .el-checkbox-group{
                            text-align: left;
                            .el-checkbox:nth-child(9){
                                margin-left: 0;
                            }
                            .el-checkbox:nth-child(18){
                                margin-left: 0;
                            }
                        }
                    }
                }
            }
            .chaxuntiaojian {
                width: 100%;
                height: 50px;
                .float001 {
                    float: left;
                }
                .float002 {
                    float: left;
                    margin-left: 20%;
                }
                .float003 {
                    float: left;
                    margin-left: 40px;
                }
            }

        }
        //媒体查询
        @media only screen and (min-width: 1400px) {
            .gs_box:nth-child(1){
                height: 40px!important;
            }
            .el-checkbox:nth-child(13){
                margin-left: 0;
            }
            .el-checkbox:nth-child(9){
                margin-left: 15px!important;
            }
            .el-checkbox:nth-child(16){
                margin-left: 15px!important;
            }
        }
    }
</style>
