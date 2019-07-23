<template>
    <div class="tvoc">
        <!--TVOC右侧面板-->
        <div class="main">
                    <!--选项查询-->
                    <div class="first">
                        <el-tabs v-model="activeNametoc" @tab-click="handleClick">
                            <el-tab-pane label="全市" name="first2"></el-tab-pane>
                            <el-tab-pane label="开发区" name="second2"></el-tab-pane>
                            <el-tab-pane label="安次区" name="third2"></el-tab-pane>
                        </el-tabs>
                    </div>
                    <!--排名-->
                    <div class="table_container">
                        <el-table
                                :data="tableData"
                                border
                                stripe
                                highlight-current-row
                                @current-change="RowCurrentChange"
                                style="width: 400px">
                            <el-table-column
                                    property="ranking"
                                    label="排名"
                                    width="80">
                            </el-table-column>
                            <el-table-column
                                    property="gridName"
                                    label="网格名称"
                                    width="80">
                            </el-table-column>
                            <el-table-column
                                    property="pointName"
                                    label="名称"
                                    width="160">
                            </el-table-column>
                            <el-table-column
                                    property="tVOC_V"
                                    label="TVOC"
                                   >
                            </el-table-column>
                        </el-table>
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

    export default {
        name: 'tvoc',
        data () {
            return {
                //
                activeNametoc: 'first2',
                //
                ALLdata: [],
                //
                tableData: [],
                //
                HistoryData: [],
                //
                allData: [],
                //
                type: '全市',
                //
                currentRow: null,
                //
                pagesize: 10,
                //
                currentPage: 1,
                //
                totalCount: 0,
            }
        },
        created() {

        },
        mounted() {
            //区县排名
            api.GetXhHbPointsVocData().then(res => {
                let Xqlist = res.data.Data;
                this.InitializationDataMethod(Xqlist, this.type);
            })
        },
        methods: {
            //排序
            compare(propertyName) {
                return function (object1, object2) {
                    let value1 = object1[propertyName]
                    let value2 = object2[propertyName]
                    return value2 - value1
                }
            },
            //切换事件
            handleClick(tab, event) {
                //
                this.type = tab.label;
                //历史数据重新分配
                this.InitializationDataMethod(this.HistoryData, this.type)
            },
            //初始数据
            InitializationDataMethod(data, type) {
                this.type = type;
                this.HistoryData = data;
                let sudata = data;
                this.SetDataList(sudata, type)
                this.totalCount = this.ALLdata.length;
                this.allData = this.ALLdata;
                this.setPageTable(10, 1);

            },
            //type更改
            refreshTable(type) {
                this.type = type;
                this.SetDataList(this.data, type);
                this.totalCount = this.ALLdata.length;
                this.allData = this.ALLdata;
                this.setPageTable(10, 1);
            },
            //设置分页所需要数据
            SetDataList(data, type) {
                this.data = data;
                this.ALLdata = [];
                let i = 1;
                if(this.type == '全市'){
                    let dt1 = data;
                    //console.log(dt1)
                    dt1.forEach(item => {
                        const tableData = {};
                        tableData.ranking = i++;//排名
                        tableData.pointName = item.pointName;//名称
                        tableData.gridName = item.gridName;//网格
                        tableData.tVOC_V = item.tVOC_V || '--';//数值
                        tableData.id = item.stationId;//id
                        tableData.latitude = item.latitude;//纬度
                        tableData.longitude = item.longitude;//经度
                        tableData.pianQu = item.pianQu;//片区
                        this.ALLdata.push(tableData);
                    })
                    //地图传送线
                    bus.$emit('loadCumulative', dt1, 'layer_cgq_voc', 'tVOC_V', 'pointName');
                }else{
                    let dt1 = this.getPointByType(this.type);
                    dt1.forEach(item => {
                        const tableData = {};
                        tableData.ranking = i++;//排名
                        tableData.pointName = item.pointName;//名称
                        tableData.gridName = item.gridName;//网格
                        tableData.tVOC_V = item.tVOC_V;//数值
                        tableData.id = item.stationId;//id
                        tableData.latitude = item.latitude;//纬度
                        tableData.longitude = item.longitude;//经度
                        tableData.pianQu = item.pianQu;//片区
                        this.ALLdata.push(tableData);
                    });
                    //地图传送线
                    bus.$emit('loadCumulative', dt1, 'layer_cgq_voc', 'tVOC_V', 'pointName');
                }

            },
            //table点击事件
            RowCurrentChange(val) {
                this.currentRow = val;
                bus.$emit('locationClick', 'layer_cgq_voc', this.currentRow ,this.type);
            },
            //页码变更
            handleCurrentChange(val) {
                this.setPageTable(10, val);
            },
            //分页部分功能
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
            //渲染部分
            switchRender(type) {
                this.type = type;
                this.setdata(this.data, this.type);
            },
            //数据筛选
            getPointByType(type) {
                let rtValue = [];
                let dt = this.data;
                if (dt) {
                    for (let i = 0, length = dt.length; i < length; i++) {
                        let item = dt[i];
                        if (item.pianQu === type) {
                            rtValue.push(dt[i]);
                        }
                    }
                }

                return rtValue;
            },
        },
        components: {}
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

    .tvoc {
        width: 430px;
        height: auto;
        .main {
           .first {
                    width: 100%;
                    height: 56px;

                }
           .table_container {
                    margin-left: 5px;
                }
        }
    }

</style>
