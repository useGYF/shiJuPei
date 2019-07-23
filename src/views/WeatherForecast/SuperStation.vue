<template>
    <div class="superstation">
        <!--超级站-->
        <v-header></v-header>
        <iframe
                frameborder="0"
                width="100%"
                height="100%"
                :src="SuperStationUrl"
                scrolling="no"
        >

        </iframe>
        <!--弹出框-->
        <div class="dingwei">
            <el-button type="primary" @click="MaintenanceOpen()">运维记录</el-button>
        </div>
        <!---->
        <el-dialog title="运维记录" style="height: auto" :visible.sync="tanchu">
            <!---->
            <!---->
            <div class="gfbg-tables">
                <!--表格-->
                <div class="table-contin">
                    <el-table
                            :data="tableData"
                            border
                            style="width: 100%">
                        <el-table-column
                                prop="DeviceName"
                                label="设备名称"
                                >
                        </el-table-column>
                        <el-table-column
                                prop="parameters"
                                label="设备参数"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="model"
                                label="设备型号"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="cycle"
                                label="巡查周期"
                                >
                        </el-table-column>
                        <el-table-column
                                prop="purpose"
                                label="用途描述"
                                width="300"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="chargePer"
                                label="负责人"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="opertime"
                                label="最近运维时间"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="replace"
                                label="备品备件更换情况"
                        >
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
        </el-dialog>
    </div>
</template>

<script>
    import api from '../../api/index'
    export default {
        name: 'superstation',
        data() {
            return {
                //
                pagesize:10,
                //
                currentPage:1,
                //
                totalCount:100,
                //
                tableData:[
                    {
                        DeviceName:'大颗粒污染物激光雷达',
                        parameters:'中科光电',
                        model:'AGHJ-LIDAR',
                        cycle:'每周',
                        purpose:'通过消化系数，拓华振臂，边缘街，勿让大妲打开萨杜端萨杜',
                        chargePer:'习书记',
                        opertime:'2018-07-09',
                        replace:'更换',
                    },
                    {
                        DeviceName:'大颗粒污染物激光雷达',
                        parameters:'中科光电',
                        model:'AGHJ-LIDAR',
                        cycle:'每周',
                        purpose:'通过消化系数，拓华振臂，边缘街，勿让大妲打开萨杜端萨杜',
                        chargePer:'习书记',
                        opertime:'2018-07-09',
                        replace:'更换',
                    },
                    {
                        DeviceName:'大颗粒污染物激光雷达',
                        parameters:'中科光电',
                        model:'AGHJ-LIDAR',
                        cycle:'每周',
                        purpose:'通过消化系数，拓华振臂，边缘街，勿让大妲打开萨杜端萨杜',
                        chargePer:'习书记',
                        opertime:'2018-07-09',
                        replace:'更换',
                    },
                    {
                        DeviceName:'大颗粒污染物激光雷达',
                        parameters:'中科光电',
                        model:'AGHJ-LIDAR',
                        cycle:'每周',
                        purpose:'通过消化系数，拓华振臂，边缘街，勿让大妲打开萨杜端萨杜',
                        chargePer:'习书记',
                        opertime:'2018-07-09',
                        replace:'更换',
                    }
                ],
                //
                SuperStationUrl: 'http://222.222.116.203:8090/new/module/superpoint_new.php',
                //
                fullscreenLoading: false,
                //
                tanchu: false,
                //
                ListData:[]
            }
        },
        mounted() {
            //
            $(".el-dialog").css("width","1200px");
            //
            this.openFullScreen()
            //
            this. getNotice()
        },
        methods: {
            handleSizeChange(){},
            //
            handleCurrentChange(val){
                this.setPageTable(10, val);
            },
            //加载动画
            openFullScreen() {
                this.fullscreenLoading = true;
                setTimeout(() => {
                    this.fullscreenLoading = false;
                }, 4000);
            },
            //运维弹出
            MaintenanceOpen() {
                this.tanchu = true;
            },
            //运维关闭
            MaintenanceShut() {
                this.tanchu = false
            },
            //分页数据
            setPageTable(pageSize, pageNum) {
                let i = 1;
                let rtValue = [];
                let startNum = pageSize * (pageNum - 1);
                for (let i = 0; i < pageSize; i++) {
                    if ((startNum + i + 1) > this.ListData.length)
                        break;
                    rtValue.push(this.ListData[startNum + i]);
                }
                this.tableData = rtValue;
            },
            //获取运维记录列表
            getNotice(){
                let t = this;
                this.ListData = [];
                api.GetOperatorInfo().then(result=>{
                    let InfoData = result.data.Data;
                    t.totalCount = InfoData.length;
                    InfoData.forEach(item=>{
                        let tableData = {};
                        tableData.DeviceName = item.DeviceName;//设备名称
                        tableData.opertime = item.CreateTime.replace('T',' ');//运维时间
                        tableData.cycle = item.CheckCycle;//巡查周期
                        tableData.purpose = item.Description;//用途描述
                        tableData.DeviceId = item.DeviceId;//设备id
                        tableData.Id = item.Id;//设备id
                        tableData.replace = item.DeviceChangeInfo;//设备更换情况
                        tableData.parameters = item.DeviceParam;//设备参数
                        tableData.model = item.DeviceVersion;//设备型号
                        tableData.chargePer = item.ChargeMan;//负责人
                        t.ListData.push(tableData);
                    })
                    this.setPageTable(10, 1);
                });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .superstation {
        width: 100%;
        height: calc(100% - 64px);
        position: relative;
        .dingwei {
            position: absolute;
            right: 30px;
            bottom: -48px;
        }
        .gfbg-tables{
            .page{
                .demonstration{
                    float: left;
                }
            }
        }
    }
</style>
