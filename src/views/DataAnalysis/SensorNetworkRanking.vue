<template>
    <div class="Sensornetworkranking">
        <!--传感网统计-->
        <v-header></v-header>
        <!---->
        <div class="warp5">

                <!--查询条件-->
                <div class="kass">
                    <div class="wbiaoti">
                        <a>查询条件</a>
                    </div>
                </div>
                <!---->
                <div class="chaxuntiaojian">
                    <!--查询条件-->
                    <div class="float001">
                        <el-radio-group v-model="upData.Type">
                            <el-radio-button v-for="item in timeZone" :key="item.value" :label="item.label"
                                             :disabled="item.disabled"></el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="float3">
                        <el-date-picker v-model="startHour" type="datetime" placeholder="选择开始日期时间">
                        </el-date-picker>
                        <el-date-picker v-model="endHour" type="datetime" placeholder="选择结束日期时间">
                        </el-date-picker>
                    </div>
                    <div class="float5">
                        <el-button type="primary">查询</el-button>
                        <el-button type="primary">导出</el-button>
                    </div>
                </div>
                <!--视图切换-->
                <div class="v-table" v-show="false">
                    <div class="kass">
                        <div class="wbiaoti">
                            <a>图表</a>
                        </div>
                    </div>
                    <!---->
                    <div class="neirong">
                        <div class="" id=""></div>
                    </div>
                </div>

                <div class="v-table" v-show="true">
                    <div class="kass">
                        <div class="wbiaoti">
                            <a>列表</a>
                        </div>
                    </div>
                    <!---->
                    <div class="neirong">
                        <div class="lie_teble">
                            <el-table
                                    :data="tableData"
                                    border
                                    style="width: 100%">
                                <el-table-column
                                        prop="SerialNumber"
                                        label="序号"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="SiteName"
                                        label="站点名称"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="DistrictCounty"
                                        label="所属区县"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="pm25"
                                        sortable
                                        label="PM2.5">
                                </el-table-column>
                                <el-table-column
                                        prop="pm10"
                                        sortable
                                        label="PM10">
                                </el-table-column>
                                <el-table-column
                                        prop="so2"
                                        sortable
                                        label="SO2">
                                </el-table-column>
                                <el-table-column
                                        prop="no2"
                                        sortable
                                        label="NO2">
                                </el-table-column>
                                <el-table-column
                                        prop="co"
                                        sortable
                                        label="CO">
                                </el-table-column>
                                <el-table-column
                                        prop="o3"
                                        sortable
                                        label="O3">
                                </el-table-column>
                            </el-table>
                            <!--分页-->
                            <div class="block">
                                <el-pagination
                                        background
                                        @size-change="handleSizeChange"
                                               @current-change="handleCurrentChange"
                                               :current-page="currentPage"
                                               :page-size="pagesize"
                                               layout="total, prev, pager, next, jumper"
                                               :total="totalCount">
                                </el-pagination>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'Sensornetworkranking',
        data() {
            return {
                //页面数据
                isActive: false,
                //
                timeZone: [
                    {
                    value: 1,
                    label: '小时',
                    disabled: false
                    },
                    {
                    value: 2,
                    label: '天',
                    disabled: true
                    }
                ],
                //
                fullscreenLoading: false,
                //
                tanchu: false,
                //
                currentPage4: 100,
                //
                tableData: [],
                //
                allData: [],
                //
                pickerOptions0: {},
                //
                currentRow: null,
                //
                pagesize: 10,
                //
                currentPage: 1,
                //数据量/分页
                totalCount: 100,
                //开始小时
                startHour: '',
                //结束小时
                endHour: '',
                upData: {
                    pointName: '',
                    startTime: '',
                    endTime: '',
                    Type: '小时'
                },
                //列表数据
                tableData: [

                    {
                        SerialNumber: '100001',
                        SiteName: '東方種工業集團',
                        DistrictCounty: '上海市普陀区',
                        pm25: '221',
                        pm10: '101',
                        so2: '221',
                        no2: '101',
                        co: '221',
                        o3: '101'
                    },
                    {
                        SerialNumber: '100002',
                        SiteName: '東方種工業集團',
                        DistrictCounty: '上海市普陀区',
                        pm25: '222',
                        pm10: '102',
                        so2: '222',
                        no2: '102',
                        co: '222',
                        o3: '102'
                    },
                    {
                        SerialNumber: '100003',
                        SiteName: '東方種工業集團',
                        DistrictCounty: '上海市普陀区',
                        pm25: '223',
                        pm10: '103',
                        so2: '223',
                        no2: '103',
                        co: '223',
                        o3: '103'
                    },
                    {
                        SerialNumber: '100004',
                        SiteName: '東方種工業集團',
                        DistrictCounty: '上海市普陀区',
                        pm25: '224',
                        pm10: '104',
                        so2: '224',
                        no2: '104',
                        co: '224',
                        o3: '104'
                    },
                    {
                        SerialNumber: '100005',
                        SiteName: '東方種工業集團',
                        DistrictCounty: '上海市普陀区',
                        pm25: '225',
                        pm10: '105',
                        so2: '225',
                        no2: '105',
                        co: '225',
                        o3: '105'
                    },
                    {
                        SerialNumber: '100006',
                        SiteName: '東方種工業集團',
                        DistrictCounty: '上海市普陀区',
                        pm25: '226',
                        pm10: '106',
                        so2: '226',
                        no2: '106',
                        co: '226',
                        o3: '106'
                    },
                    {
                        SerialNumber: '100007',
                        SiteName: '東方種工業集團',
                        DistrictCounty: '上海市普陀区',
                        pm25: '227',
                        pm10: '107',
                        so2: '227',
                        no2: '107',
                        co: '227',
                        o3: '107'
                    },
                    {
                        SerialNumber: '100008',
                        SiteName: '東方種工業集團',
                        DistrictCounty: '上海市普陀区',
                        pm25: '228',
                        pm10: '108',
                        so2: '228',
                        no2: '108',
                        co: '228',
                        o3: '108'
                    },
                    {
                        SerialNumber: '100009',
                        SiteName: '東方種工業集團',
                        DistrictCounty: '上海市普陀区',
                        pm25: '229',
                        pm10: '109',
                        so2: '229',
                        no2: '109',
                        co: '229',
                        o3: '109'
                    },
                    {
                        SerialNumber: '100010',
                        SiteName: '東方種工業集團',
                        DistrictCounty: '上海市普陀区',
                        pm25: '210',
                        pm10: '110',
                        so2: '212',
                        no2: '110',
                        co: '212',
                        o3: '110'
                    }
                ],
            };
        },
        beforeCreate() {
            //beforeCreate 创建前状态====

        },
        created() {
            //created 创建完毕状态====

        },
        beforeMount() {
            //beforeMount 挂载前状态===

        },
        mounted() {
            //mounted 挂载结束状态=====

        },

        beforeUpdate() {
            //beforeUpdate 更新前状态====

        },
        updated() {
            //updated 更新完成状态===

        },
        beforeDestroy() {
            //beforeDestroy 销毁前状态====

        },
        destroyed() {
            //destroyed 销毁完成状态===

        },
        methods: {
            // 所有方法
        }

    };
</script>
<style lang="scss" scoped>
    .Sensornetworkranking {
        width: 100%;
        height: auto;
        //title标题
        .warp5 {
            width: 98%;
            height: auto;
            margin: 0 auto;
            .lie_teble{
                width: 98%;
                height: auto;
                margin: 0 auto;
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
                    .f_right {
                        width: 240px;
                        float: right;
                        .float_tl {
                            float: left;
                            margin-left: 10px;
                            font-weight: bold;
                        }
                    }
                }
            }
            .chaxuntiaojian {
                width: 100%;
                height: 50px;
                .float001 {
                    float: left;
                    margin-left: 30px;
                }
                .float3 {
                    float: left;
                    margin-left: 20%;
                }
                .float5 {
                    float: left;
                    margin-left: 20px;
                }
            }
        }
        //媒体查询
        @media only screen and (min-width: 1400px) {
            .float3 {
                margin-left: 40%!important;
            }
        }
    }
</style>