<template>
    <div class="Official-report">
        <!--官方报告-->
        <v-header></v-header>
        <!---->
        <div class="gf-warp">
            <div class="gf-dh-left">
                <!--导航-->
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane v-for="item in tabsClass" :label="item.label" :name="item.name" :key="item.key"></el-tab-pane>
                    <!--<el-tab-pane label="河北省发布" name="second"></el-tab-pane>-->
                    <!--<el-tab-pane label="廊坊市政府发布" name="third"></el-tab-pane>-->
                    <!--<el-tab-pane label="廊坊市监测站发布" name="fourth"></el-tab-pane>-->
                    <!--<el-tab-pane label="廊坊日报发布" name="fifth"></el-tab-pane>-->
                    <!--<el-tab-pane label="廊坊市环保局发布" name="sixth"></el-tab-pane>-->
                </el-tabs>
            </div>
            <!---->
            <div class="gf-dh-right">
                <!--搜索-->
                <div>
                    <i class="el-icon-search" @click="activeSearch = !activeSearch"></i>
                    <transition name="el-zoom-in-center">
                        <!---->
                        <input v-model="inputKey" title="点击搜索框弹出" v-show="activeSearch" class="inputs" type="text" placeholder="请输入搜索内容" name="fname" />
                    </transition>
                    <span @click="chaojiniubi">搜索</span>
                </div>
            </div>
            <!---->
            <div class="gf-warp-01">
                <div class="gf-title"><i></i><span>查询条件</span></div>
                <!---->
                <div class="gf-buttom">
                    <div class="gf-co">
                        <el-radio-group v-model="radio4" @change="radiochange">
                            <!--<el-radio-button label="报告类" :disabled="true"></el-radio-button>-->
                            <el-radio-button v-for="item in lostClass" :label="item.Key"  :key="item.Key">{{item.Value}}</el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
                <!---->
                <div class="gf-title"><i></i><span>列表</span></div>
                <!---->
                <div class="gf-tables">
                    <!---->
                    <ul>
                        <li class="gf-list" v-for="item in context">
                            <div>
                                <router-link :to="{path: '/ScavengingCached/repDetail', query: { id:item.ID }}">
                                    {{item.text}}
                                </router-link>
                                <span>{{item.time}}</span>
                            </div>
                        </li>
                    </ul>
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
        <!---->

    </div>
</template>

<script>
    import api from '../../api/index'
    export default {
        name: 'Officialreport',
        data() {
            return {
                activeSearch:false,
                //
                activeName:'name1',
                //
                firstKey:'',
                //
                secondKey:'',
                //
                inputKey:'',
                //
                radio4: '方案类',
                //
                context:[],
                //
                currentRow: null,
                //
                pagesize: 10,
                //
                currentPage: 1,
                //
                totalCount: 100,
                //
                tabsClass:[],
                //
                lostClass:[],
                //
                allData:[]
            }
        },
        created(){

        },
        mounted() {
            api.GetgfbgGetSourcer().then(res =>{
                console.log(res);
                let list = res.data.Data;
                let first = 1;
                list.forEach(item =>{
                    const lost ={
                        label:item.Source.Value,
                        value:item.Source.Key,
                        key:item.Source.Key,
                        name:'name'+ item.Source.Key
                    }
                    this.tabsClass.push(lost);
                })
                //console.log(this.tabsClass);
                this.SwitchMenuChange(this.tabsClass[0].value);
                this.firstKey = this.tabsClass[0].key;
            })
            //
            this.handleClick({label:'生态环境部',name:'name1'});
        },
        methods:{
            //分页效果
            setPageTable(pageSize, pageNum) {
                let rtValue = [];
                let startNum = pageSize * (pageNum - 1);
                for (let i = 0; i < pageSize; i++) {
                    if ((startNum + i + 1) > this.allData.length)
                        break;
                    rtValue.push(this.allData[startNum + i]);
                }
                this.context = rtValue;
            },
            //
            SwitchMenuChange(value){
                let keyvalue = value;
                this.lostClass =[];
                api.GetgfbgGetSourcer().then(res =>{
                    //console.log(res);
                    let list = res.data.Data;
                    list.forEach(item =>{
                        if(item.Source.Value === keyvalue){
                            this.lostClass = item.Category
                        }
                    })
                   // console.log(this.lostClass);
                    this.radio4 = this.lostClass[0].Key;
                    this.secondKey = this.lostClass[0].Key;
                })
            },
            //请求列表
            ListRequest(){
                let Source = this.firstKey;
                let Category = this.secondKey;
                let Title = this.inputKey;
                this.context = [];
                this.allData = [];
                api.GetgfbgGetListQ(Source,Category,Title).then(res =>{
                    let data = res.data.Data;
                    this.totalCount = data.length;
                    console.log(data)
                    data.forEach(item =>{
                        const dalist ={
                            ID:item.ID,
                            text:item.Title,
                            time:(item.UpdateTime).replace('T',' ')
                        }
                        this.allData.push(dalist);
                    })
                    this.setPageTable(10, 1);
                })
            },
            //
            radiochange(val){
                console.log(val)
                this.secondKey = val;
                this.ListRequest()
                this.totalCount = this.allData.length;
            },
            //
            handleClick(val){
                //console.log(val.name);
                let s = val.name;
                this.firstKey = s.replace('name','');
                //console.log(this.firstKey)
                this.SwitchMenuChange(val.label);
                setTimeout(() =>{
                    this.ListRequest()
                    this.totalCount = this.allData.length;
                },600)
            },
            //
            handleCurrentChange(val){
                console.log(val)
                this.setPageTable(10, val);
            },
            //
            handleSizeChange(){},
            //
            chaojiniubi(){
               // alert('卧槽你牛逼')
                this.ListRequest()
            }
        },

    }

</script>

<style lang="scss" scope>
    .Official-report {
        width: 100%;
        height: 100%;

        .gf-warp{
            position: relative;
            .inputs{
                width: 200px;
                height: 30px;
                border:none;
                border-bottom: solid 1px #D5D5D5;
            }
            .gf-dh-right{
                float: right;
                width: 20%;
                border-bottom: solid 2px #ccc;
                line-height: 42px;
                height: 40px;
            }
            .gf-dh-left{
                float: left;
                padding-left: 20px;
                width: 80%;
            }
            /*001mok*/
            .gf-warp-01{
                padding-top: 44px;
                width: 96%;
                height: auto;
                margin: 0 auto;
                .gf-title{
                    margin-top: 10px;
                    width: 100%;
                    text-align: left;
                    height: 36px;
                    line-height: 36px;
                    font-size: 16px;
                    border-bottom: solid 1px #ccc;
                    span{
                        display: block;
                        float: left;
                    }
                    i{
                        display: block;
                        float: left;
                        width: 2px;
                        height: 20px;
                        background: #1080cc;
                        margin-top: 8px;
                        padding-right: 3px;
                        margin-right: 10px;
                    }
                }
                .gf-buttom{
                    width: 100%;
                    height: 50px;
                    margin-top: 15px;
                    position: relative;
                    .gf-co{

                        height: 46px;
                       position: absolute;
                        left: 0;
                }

                }
                .gf-tables{
                    margin-top: 20px;
                    li:nth-child(1){
                        border-top:solid 1px #ccc ;
                    }
                    .gf-list{
                        list-style: none;
                        width: 100%;
                        height: 38px;
                        line-height: 38px;
                        text-align: left;
                        border: solid 1px #ccc;
                        border-top: none;
                        overflow: hidden;
                        div{

                            a{
                                color: #666;
                                padding-left: 20px;
                            }
                            a:hover{
                                color: #1ce405;
                            }
                            span{
                                float: right;
                                padding-right: 20px;
                            }
                        }

                    }
                }
            }
        }
    }
</style>