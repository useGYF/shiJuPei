<template>
    <div class="Paneldatavideo">
                <!--企业污染源-->
                <div class="main">
                    <!--顶部title-->
                    <div class="tables">
                        <!--选项-->
                        <a id="shishi">网格污染源数量超标统计</a>
                        <div class="xian"></div>
                    </div>
                    <!--污染数量表格-->
                    <div class="table_container" style="margin-top: 15px">
                        <el-table
                                :data="tableList"
                                border
                                stripe
                                highlight-current-row
                                style="width: 400px">
                            <el-table-column
                                    property="NetworkName"
                                    label="网格名称"
                                    width="100">
                            </el-table-column>
                            <el-table-column
                                    property="PollutionSourceNum"
                                    label="污染源数量"
                                    width="140">
                            </el-table-column>
                            <el-table-column
                                    property="PollutionSourceCBNum"
                                  label="超标污染源数量"
                            >
                            </el-table-column>
                        </el-table>
                    </div>
                    <!--企业污染表格-->
                    <div class="table_container" style="margin-top: 15px">
                        <el-table
                                :data="tableData"
                                border
                                stripe
                                highlight-current-row
                                @current-change="RowCurrentChange"
                                style="width: 400px">
                            <el-table-column
                                    property="WanggeName"
                                    label="网格名称"
                                    width="80">
                            </el-table-column>
                            <el-table-column
                                    property="NetworkName"
                                    label="企业名称"
                                    width="220">
                            </el-table-column>

                            <el-table-column
                                    property="Statues"
                                    label="是否超标"
                            >
                            </el-table-column>
                        </el-table>
                        <!--分页条-->
                        <div class="Pagination" style="text-align: left;margin-top: 10px;">
                            <el-pagination
                                    background
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
    import Toolbar from '@/components/Toolbar'

    export default {
        name: 'enterprise',
        data() {
            return {
                //
                tableData: [],
                //
                tableList: [
                    {
                        NetworkName: '开发区',
                        PollutionSourceNum: '--',
                        PollutionSourceCBNum: '--'
                    },
                    {
                        NetworkName: '广阳区',
                        PollutionSourceNum: '--',
                        PollutionSourceCBNum: '--'
                    },
                    {
                        NetworkName: '安次区',
                        PollutionSourceNum: '--',
                        PollutionSourceCBNum: '--'
                    }
                ],
                //
                allData: [],
                //
                labelType: "NOX排放量",
                //
                currentRow: null,
                //
                pagesize: 10,
                //
                currentPage: 1,
                //
                totalCount: 0,
                //
                value2: '',
                //
                filters: {name: ''},

            }
        },
        created() {
            ////
            bus.$on('targetPollution', this.changeTypeCer);
            ////
            this.GetListqyData()
        },

        mounted() {

            //实时累计切换
            $('.first .tables a').on('click', function () {
                $(this).addClass('bai').siblings().removeClass('bai')
            })

        },
        methods: {
            //初始化数据
            InitializationDataMethod(data) {
                let sudata = data;
                this.SetDataList(sudata)
                this.totalCount = this.allData.length;

                this.setPageTable(10, 1);
            },
            //排序
            compare(propertyName) {
                return function (object1, object2) {
                    let value1 = object1[propertyName]
                    let value2 = object2[propertyName]
                    return value2 - value1
                }
            },
            //table行点击
            RowCurrentChange(val) {
                this.currentRow = val;
                //地图联动
                bus.$emit('locationClick', 'layer_qy', this.currentRow ,'');
            },
            //页码变更
            handleCurrentChange(val) {
                this.setPageTable(10, val);
                //console.log(val)
            },
            changeTypeCer(val,val2){
                //this.allData = [];
                let consup ;
                switch (val2){
                    case 'smookeStatus':
                        consup = 'smokeStatus';
                        break;
                    case 'so2Status':
                        consup = 'so2Status';
                        break;
                    case 'noxStatus':
                        consup = 'noxStatus';
                        break;
                }
                this.SetDataList(this.data,consup);
            },
            //分页功能
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
            //设置分页所需要数据
            SetDataList(data,consup) {
                let consupd =(consup || 'smokeStatus') ;
                this.data = data;
                this.allData = [];
                // let op = [];
                let i = 1;
                this.data.forEach(item => {
                    const tableData = {};
                    tableData.SerialNumber = i++;//序号
                    tableData.NetworkName = item.psname;//企业名称
                    tableData.pscode = item.pscode;//城市id
                    tableData.Statues = item[consupd] == 3? '是' : '否';//是否超标
                    tableData.WanggeName = item.gridName ? item.gridName : '----';//网格名称item.WanggeName
                    tableData.latitude = item.latitude;//纬度
                    tableData.longitude = item.longitude;//经度
                    // op.push(item[consupd]);
                    this.allData.push(tableData);
                })
               
            },
            //数据
            GetListqyData() {
                //污染源统计
                api.GetCompanyStatistics().then(res => {
                    let data = res.data.Data;
                    this.tableList = [];
                    data.forEach(item => {
                        const tData = {};
                        tData.NetworkName = item.GridName;//序号
                        tData.PollutionSourceNum = item.PollutionCount;//企业名称
                        tData.PollutionSourceCBNum = item.PollutionOverCount;//城市id
                        this.tableList.push(tData);
                    })
                })
                //污染企业列表
                api.GetCompanyPointList().then(res => {

                    let sudata = res.data.Data;
                    this.SetDataList(sudata, this.type)
                    this.totalCount = this.allData.length;
                    this.setPageTable(10, 1);
                })
            },
            //时间转换
            TimeConversion(fmt, date) {
                var o = {
                    "M+": date.getMonth() + 1,                 //月份
                    "d+": date.getDate(),                    //日
                    "h+": date.getHours(),                   //小时
                    "m+": date.getMinutes(),                 //分
                    "s+": date.getSeconds(),                 //秒
                    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                    "S": date.getMilliseconds()             //毫秒
                };
                if (/(y+)/.test(fmt))
                    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            },
            ////搜索
            search() {
                let _this = this;
                if (this.filters.name) {
                    let data = _this.data;
                    _this.tableData = [];
                    let i = 1;
                    data.forEach(item => {
                        const Data = {};
                        if (item.CamName == _this.filters.name) {
                            Data.SerialNumber = i++;//序号
                            Data.VideoName = item.CamName;//行业
                            Data.MonitoringType = item.TypeName;//类型
                            Data.Id = item.Id;//城市id
                            Data.Latitude = item.Latitude;//纬度
                            Data.Longitude = item.Longitude;//经度
                            _this.tableData.push(Data);
                        }
                    })

                } else {
                    _this.$message({
                        message: '请输入筛选条件!',
                        type: 'success'
                    });
                }
                ;
            }
        },
        components: {Toolbar}
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

    .Paneldatavideo {
        width: 430px;
        height: auto;
        right: 0;
        .table_container {
            margin-left: 15px;
        }
        img {
                position: absolute;
                top: 40%;
                left: -17px;
                cursor: pointer;
                float: left;
            }
        .main {
                width: 100%;
                height: auto;
                float: left;
                .tables {
                    width: 100%;
                    line-height: 38px;
                    a {
                        margin-left: -200px;
                        display: inline-block;
                        color: #4696FF;
                        font-size: 16px;
                        border-bottom: solid 2px #4696FF;
                        padding: 0 20px;
                        margin-bottom: -2px;
                    }
                    .xian {
                        width: 100%;
                        border: solid 1px #ccc;
                    }
                }
            }

    }


</style>
