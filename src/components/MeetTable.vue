<template>
    <div class="meettable">
        <!--查询-->
        <div class="search">
            <!---->
            <div class="searchBox">
                <span>预警级别</span>
                <el-select v-model="yujing" clearable placeholder="请选择" @change="changeYujing">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <!---->
            <div class="block">
                <span class="demonstration">预警发布时间</span>
                <!---->
                <el-date-picker
                        v-model="starttime"
                        type="datetime"
                        placeholder="选择起始日期"
                       >
                </el-date-picker>
                -
                <el-date-picker
                        v-model="endtime"
                        type="datetime"
                        placeholder="选择结束日期"
                       >
                </el-date-picker>
            </div>
            <!---->
            <el-button type="primary" class='btns' @click='SearchNotice'>查询</el-button>
        </div>
        <!---->
        <div style="padding: 0 10px">
            <el-table
                    border
                    :data="tableData"
                    style="width: 100%">
                <el-table-column
                        prop="Warning"
                        label="预警级别"
                >
                </el-table-column>
                <!--<el-table-column-->
                <!--prop="Content"-->
                <!--label="具体内容"-->
                <!--&gt;-->
                <!--</el-table-column>-->
                <el-table-column
                        prop="BeginTime"
                        label="预警发布时间"
                >
                </el-table-column>
                <el-table-column
                        prop="EndTime"
                        label="预警结束时间"
                >
                </el-table-column>
            </el-table>
        </div>
        <!---->
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
        <!---->
        <div class="yjbg-butttom">
            <span v-if="yujxixi">
                {{(yujxixi.beginTime).replace('T','  ')}} - {{(yujxixi.endTime).replace('T','  ').split('.')[0]}}期间，
                共发生{{yujxixi.countNum}}次重污染预警，共{{yujxixi.countHour}}小时，
                其中{{yujxixi.redNum}}次红色预警（{{yujxixi.redHour}}小时），
                {{yujxixi.orangeNum}}次橙色预警（{{yujxixi.orangeHour}}小时），
                {{yujxixi.yellowNum}}次黄色预警（{{yujxixi.yellowHour}}小时），
                {{yujxixi.blueNum}}次蓝色预警（{{yujxixi.blueHour}}小时）。
            </span>
        </div>
    </div>
</template>
<script>
    import {bus} from '@/js/bus.js'
    import api from '../api/index'

    export default {
        name : 'meettable',
        data(){
            return {
                //
                ComponyData : [],
                //
                totalCount:200,
                //
                currentPage:1,
                //
                pagesize:5,
                //
                starttime:'',
                //
                endtime:'',
                //
                yujing:'',
                //预警状态
                options: [{
                    value: '8',
                    label: '蓝色预警'
                }, {
                    value: '1',
                    label: '红色预警'
                }, {
                    value: '4',
                    label: '黄色预警'
                }, {
                    value: '2',
                    label: '橙色预警'
                }],
                //
                tableData:[
                    {
                        Warning:'橙色预警',
                        BeginTime:'2018/2/28 12:22:20',
                        EndTime:'2018/2/28 12:22:20'
                    },
                    {
                        Warning:'橙色预警',
                        BeginTime:'2018/2/28 12:22:20',
                        EndTime:'2018/2/28 12:22:20'
                    },
                    {
                        Warning:'橙色预警',
                        BeginTime:'2018/2/28 12:22:20',
                        EndTime:'2018/2/28 12:22:20'
                    },
                    {
                        Warning:'橙色预警',
                        BeginTime:'2018/2/28 12:22:20',
                        EndTime:'2018/2/28 12:22:20'
                    },
                    {
                        Warning:'橙色预警',
                        BeginTime:'2018/2/28 12:22:20',
                        EndTime:'2018/2/28 12:22:20'
                    },
                    {
                        Warning:'橙色预警',
                        BeginTime:'2018/2/28 12:22:20',
                        EndTime:'2018/2/28 12:22:20'
                    },
                ],
                //预警信息
                yujxixi:{},
                //
                allData:[],
                //
                yjindex:''
            };
        },
        beforeCreate() {
            //beforeCreate 创建前状态====

        },
        created() {
            bus.$on('yjative', this.Getdatalist);//
        },
        beforeMount() {
            //beforeMount 挂载前状态===
        },
        mounted() {
            this.Getdatalist('','','','')
        },
        methods: {
            //
            changeYujing(val){
                console.log(val)
                this.yjindex = val;
            },
            //点击查询
            SearchNotice(){
                // let ndt = new Date();
                // let ndt7 = new Date(ndt);
                // ndt7.setDate(ndt.getDate() - 2);
                this.totalCount = 0;
                let WarningStatus = this.yjindex;
                let PageIndex = 1;
                //
                if(!this.starttime && !this.endtime &&!this.yujing ){
                    console.log('都没有')
                    //
                    this.Getdatalist('','','','')
                }else if (!this.starttime && !this.endtime) {
                    console.log('没有时间')
                    //
                    this.Getdatalist(WarningStatus, '', '', PageIndex)
                } else {

                    let StartTime = `${this.starttime.getFullYear()}-${(this.starttime.getMonth() + 1)}-${this.starttime.getDate()} ${this.starttime.getHours()}:${this.endtime.getMinutes()}` ;
                    let EndTime = `${this.endtime.getFullYear()}-${(this.endtime.getMonth() + 1)}-${this.endtime.getDate()} ${this.endtime.getHours()}:${this.endtime.getMinutes()}` ;

                    if (!this.yujing) {
                        console.log('没有预警')
                        //
                        this.Getdatalist('', StartTime, EndTime, PageIndex)
                    } else {
                        console.log('都有')
                        //
                        this.Getdatalist(WarningStatus, StartTime, EndTime, PageIndex);
                    }
                }
            },
            //
            handleSizeChange(val){
                console.log(val)
            },
            //切换页数请求数据
            handleCurrentChange(val){
                console.log(val);
                this.setPageTable(5, val);
            },
            //获取数据
            Getdatalist(WarningStatus,StartTime,EndTime,PageIndex){
                this.allData = [];
                this.tableData = [];
                api.GetBulletinNotices(WarningStatus,StartTime,EndTime,PageIndex).then(res =>{
                    let data = res.data.Data;
                    console.log(data);
                    data.dataList.forEach(item =>{

                        const table = {
                            Warning:item.Warning,
                            BeginTime:item.BeginTime.replace('T','  '),
                            EndTime:item.EndTime.replace('T','  '),
                            Content:item.Content
                        }
                        this.allData.push(table);
                    })
                    this.setPageTable(5, 1);
                    this.currentPage = 1;
                    this.yujxixi = data.dataNum;
                    this.totalCount = data.dataList.length;
                })

            },
            //分页设置
            setPageTable(pageSize, pageNum) {
                let rtValue = [];
                let startNum = pageSize * (pageNum - 1);
                for (let i = 0; i < pageSize; i++) {
                    if ((startNum + i + 1) > this.allData.length)
                        break;
                    rtValue.push(this.allData[startNum + i]);
                }
                this.tableData = rtValue;
            }
        },
        components: {}
    };
</script>
<style lang="scss" scoped> 
    .meettable{
        width: 100%;
        height: 100%;
        .search{
            padding: 10px 0;
            .searchBox{
                margin-left: 10px;
                float: left;
            }
            .block{
                float: left;

            }
        }
        .page{
            .demonstration{
                float: left;
                padding: 2px 20px;
            }
        }
        .yjbg-butttom{
            margin-top: 15px;
            text-align: left;
            padding: 2px 15px;
        }
    }   
</style>

