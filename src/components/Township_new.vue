<template>
    <div class="township">
        <!--乡镇右侧面板-->
       <div class="main">
                    <!--选项查询-->
                    <div class="first">
                        <el-tabs v-model="activeNamexz" @tab-click="handleClick">
                            <el-tab-pane label="全市" name="first3"></el-tab-pane>
                            <el-tab-pane label="北部县区" name="second3"></el-tab-pane>
                            <el-tab-pane label="中部县区" name="third3"></el-tab-pane>
                            <el-tab-pane label="南部县区" name="fourth3"></el-tab-pane>
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
                                    v-if="false"
                                    property="gridname"
                                    label="网格名称"
                                    width="80">
                            </el-table-column>
                            <el-table-column
                                    property="name"
                                    label="名称"
                                    width="160">
                            </el-table-column>
                            <el-table-column
                                    property="com_index"
                                    label="综合指数"
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
        name: 'township',
        data() {
            return {
                //
                activeNamexz:'first3',
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
                //
            }
        },
        created() {

        },
        mounted() {
            //获取列表数据
            api.GetTownListDataRe('').then(res =>{
                let Xqlist = res.data.Data;
                this.InitializationDataMethod(Xqlist);
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
            //初始数据
            InitializationDataMethod(data) {
                //this.type = type;
                this.HistoryData = data;
                let sudata = data;
                this.SetDataList(sudata)
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
            //切换展示表格数据
            handleClick(tab, event) {
                //
                this.type = tab.label;
                //历史数据重新分配
                if(this.type == '全市'){
                    api.GetTownListDataRe('').then(res =>{
                        let Xqlist = res.data.Data;
                        this.InitializationDataMethod(Xqlist);
                        //地图传递
                        bus.$emit('loadCumulative', Xqlist, 'layer_cx', 'pm25', 'name');
                    })
                }else{
                    api.GetTownListDataRe(encodeURI(this.type)).then(res =>{
                        let Xqlist = res.data.Data;
                        this.InitializationDataMethod(Xqlist);
                        //地图传递
                        bus.$emit('loadCumulative', Xqlist, 'layer_cx', 'pm25', 'name');
                    })
                }
            },
            //设置分页所需要数据
            SetDataList(data) {
                this.data = data;
                this.ALLdata = [];
                console.log(data);
                let i = 1;
                this.data.forEach(item => {
                        const tableData = {};
                        tableData.ranking = i++;//排名
                        tableData.gridname = item.gridname ? item.gridname : '----';//网格
                        tableData.name = item.name;//名称
                        tableData.com_index = item.com_index;//数值
                        tableData.id = item.deviceid;//ID
                        tableData.latitude = item.latitude;//纬度
                        tableData.longitude = item.longitude;//经度
                       // tableData.pianQu = item.pianQu;//片区
                        this.ALLdata.push(tableData);
                    })

            },
            //table点击事件
            RowCurrentChange(val) {
                //
                this.currentRow = val;
                //地图联动
                bus.$emit('locationClick', 'layer_cx', this.currentRow ,this.type);
            },
            //页码变更
            handleCurrentChange(val) {
                this.setPageTable(10, val);
            },
            //数据筛选
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
            //分页部分功能
            getPointByType(type) {
                let rtValue = [];
                let dt = this.data;
                if (dt) {
                    for (let i = 0, length = dt.length; i < length; i++) {
                        let item = dt[i];
                        if (item.type === type) {
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

    .township {
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
