<template>
    <div class="toolbarsearch">
        <div class="search_css">
            <div class="css_toolbar">
               <!---->
                <div class="search_warp">
                    <!--搜索模块-->
                    <div class="input-warp">
                        <!---->
                        <el-input v-model="InputBoxValue" :title="InputBoxValue" placeholder="请输入站点、企业名称等"></el-input>
                        <!---->
                    </div>
                    <div class="down-warp" v-loading="loading2" element-loading-text="拼命加载中"
                         element-loading-spinner="el-icon-loading"
                         element-loading-background="rgba(0, 0, 0, 0.5)" v-if="PullDownData" v-show="classdown">
                        <!---->
                        <ul>
                            <li v-for="item in PullDownData" @click="changeUlinput(item)">
                                <strong style="color: #000000">{{item.names}}</strong>
                                <span style="color:#0000ff;padding-left: 20px">{{item.indexname}}</span>
                            </li>
                        </ul>

                        <!--分页条-->
                        <div class="Pagination">
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
                <i style="display: inline-block;width: 30px"
                   class="el-input__icon el-icon-search"
                   @click="submitSub"
                   title="点击此处搜索"
                ></i>
            </div>
        </div>
        <!--竖线-->
        <div class="clolrbr" style="float: left;height:26px;width: 1px;border-right: solid 1px #ccc"></div>
    </div>
</template>
<script>
    import {bus} from '@/js/bus.js'
    import api from '../api/index'

    export default {
        name: 'toolbarsearch',
        data() {
            return {
                //
                loading2:false,
                //选择器
                options: [{value: '0001', label: '全部',}],
                //
                width:0,
                //
                value: '',
                //搜索框
                PullDownData: [],
                //输入框值
                InputBoxValue: '',
                //下拉弹出框值
                list: [],
                //
                PullDown:false,
                //搜索效果
                loading: false,
                //搜索框所以数据
                states: [],
                //
                classdown:false,
                //
                currentPage:0,
                //
                totalCount:0,
                //
                pagesize:10,
                //
                cunValue:''
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

        },
        watch:{
            InputBoxValue(query){
                this.remoteMethod(query);
                if(!query){
                    this.classdown = false
                }
            }
        },
        methods: {
            //
            // 所有方法
            remoteMethod(searchname) {
                const _this = this;
                //TUCENG
                let layer = '';
                //
                console.log(searchname);
                if (searchname !== '') {
                    _this.classdown = true;
                    _this.loading2 = true;
                    //请求数据
                    api.GetSearchAllRes(layer,encodeURI(searchname)).then(res =>{
                        console.log(res);
                        _this.list = res.data.Data;
                        //
                        _this.loading2 = false;
                        //设置参数
                        _this.PullDownData = _this.list
                        //分页数量
                        _this.totalCount = _this.list.length;
                        //分页
                        _this.setPageTable(10, 1);
                    })
                    //设置分页搜索
                    // setTimeout(() => {
                    //
                    // }, 500);
                } else {
                    _this.PullDownData = [];
                    _this.classdown = false;
                }

            },
            //点击li事件
            changeUlinput(value){
                //
                this.cunValue = value;
                //赋值选中的值显示在input中
                this.InputBoxValue = value.names;
                //清空数组
                this.PullDownData = [];
                //关闭窗口
                setTimeout(() =>{
                    this.classdown = false
                },500);
              //
                bus.$emit('locationClick', null, value, null, true);
            },
            //查询提交
            submitSub(){
                let into;
                //如果没有输入内容
                if(!this.InputBoxValue){
                    into = '搜索内容不能为空  '
                };
                let value = this.cunValue;
                //element创建标签方法
                const h = this.$createElement;
                //console.log(h);
                this.$message({
                    message: h('p', null, [
                        h('span', null, into),
                        h('i', { style: 'color: teal' }, '搜索成功')
                    ])
                });
                //
                bus.$emit('locationClick', null, value, null, true);

            },
            //每页显示数据量变更
            handleSizeChange(val) {
                //this.pagesize = val;
            },
            //页码变更
            handleCurrentChange(val) {
                this.setPageTable(10, val);
                console.log(val)
            },
            //分页效果
            setPageTable(pageSize, pageNum) {
                let rtValue = [];
                let startNum = pageSize * (pageNum - 1);
                for (let i = 0; i < pageSize; i++) {
                    if ((startNum + i + 1) > this.list.length)
                        break;
                    rtValue.push(this.list[startNum + i]);
                }
                this.PullDownData = rtValue;
            },
        },
        components: {}
    };
</script>
<style lang="scss" scoped>
    .toolbarsearch {
        width: 100%;
        font-size: 14px;
        position: relative;
        .selest_warp {
            float: left;
        }
        .search_warp {
            margin-left: 10px;
            float: left;
            position: relative;
            .input-warp{
                position: relative;
            }
            .down-warp{
                position: absolute;
                top: 45px;
                left: -14px;
                width: 430px;
                padding-left: 10px;
                background: #fff;
                height: auto;
                box-shadow: 0 0 3px #ccc;
                border-radius: 3px;
                ul{
                    li{
                        text-align: left;
                        width: auto;
                        padding: 0px 5px;
                        list-style: none;
                        background: #fff;
                    }
                    li:hover{
                        background: #C1C0C0;
                    }
                }
                .Pagination{
                    width: 90%;
                    height: 40px;
                }
            }
        }
        .search_css {
            float: left;
            height: 40px;
            line-height: 40px;
            margin-left: 4px;
            margin-top: 3px;
            position: relative;

        }
        .clolrbr {
            margin-top: 10px;
        }
        .el-icon-search:active{
            font-size: 24px;
            font-weight: bold;
            color: #666;
        }
    }
</style>

