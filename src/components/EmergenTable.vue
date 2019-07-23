<template>
    <div class="emergentable">
        <div class="scrollBox">
            <table class="table-class" border="1" style="border: solid 1px #dedede;">
                <tr class="tablebox">
                    <!-- 表头 -->
                    <th rowspan="2" colspan="3" style="width: 180px;">
                        <div>企业名称</div>
                    </th>
                    <th rowspan="2" colspan="1" style="width: 45px;">
                        <div>行政区</div>
                    </th>
                    <th  colspan="4" style="width: 243px;height: 23px;">
                        <div>应急状态</div>
                    </th>
                    <th rowspan="2"  colspan="2" style="width: 100px;height: 43px;">
                        <div>是否为错峰企业</div>
                    </th>
                    <th rowspan="2"  colspan="2" style="width: 100px;height: 43px;">
                        <div>措施落实负责人</div>
                    </th>
                    <th rowspan="2"  colspan="2" style="width: 100px;height: 43px;">
                        <div>驻厂监督员</div>
                    </th>
                    <th rowspan="2"  colspan="2" style="width: 100px;height: 43px;">
                        <div>监督电话</div>
                    </th>
                </tr>
                <tr class="tablebox">
                    <td>蓝色预警</td>
                    <td>黄色预警</td>
                    <td>橙色预警</td>
                    <td>红色预警</td>
                </tr>
           
                <tr class="tableBady"  v-for="(item,index) in ComponyData" :key="index">
                    <td colspan="3">{{item.companyname}}</td>
                    <td colspan="1" >{{item.region}}</td>
                    <td colspan="1">
                        <img :src="getColorImg(item.buttonmodel.blue)" alt="">
                    </td>
                    <td colspan="1">
                        <img :src="getColorImg(item.buttonmodel.yellow)" alt="">
                    </td>
                    <td colspan="1">
                        <img :src="getColorImg(item.buttonmodel.orange)" alt="">
                    </td>
                    <td colspan="1">
                        <img :src="getColorImg(item.buttonmodel.red)" alt="">
                    </td>
                    <td colspan="2">{{getPeakCompany(item.whetherpeak)}}</td>
                    <td colspan="2">{{item.chargecontact}}</td>
                    <td colspan="2">{{item.residentcontace}}</td>
                    <td colspan="2">{{item.residentphone}}</td>
                </tr> 
            </table>
        </div>
        <ul class="showYujing">
            <li>
                <img src="../../static/imgs/colorimg/gray.png">
                <span>未发布预警</span>
            </li>
             <li>
                <img src="../../static/imgs/colorimg/blue.png">
                <span>蓝色预警</span>
            </li>
             <li>
                <img src="../../static/imgs/colorimg/yellow.png">
                <span>黄色预警</span>
            </li>
             <li>
                <img src="../../static/imgs/colorimg/orange.png">
                <span>橙色预警</span>
            </li>
             <li>
                <img src="../../static/imgs/colorimg/red.png">
                <span>红色预警</span>
            </li>          
        </ul>
    </div>
</template>
<script>
    import {bus} from '@/js/bus.js'
    import api from '../api/index'

    export default {
        name : 'emergentable',
        data(){
            return {
                ComponyData : [],
                imggray:'../../static/imgs/colorimg/gray.png',
                imgblue:'../../static/imgs/colorimg/blue.png',
                imgyellow:'../../static/imgs/colorimg/yellow.png',
                imgorange:'../../static/imgs/colorimg/orange.png',
                imgred:'../../static/imgs/colorimg/red.png',
                isPeakCompany: "是",
                noPeakCompany: "否"
            };
        },
        beforeCreate() {
            //beforeCreate 创建前状态====

        },
        created() {
            //created 创建完毕状态====
            api.GetCompanyList().then(res=>{
                let data = res.data.Data;
                //console.log('你好牛逼啊')
                //console.log(data)
                this.ComponyData = data;
            })
        },
        beforeMount() {
            //beforeMount 挂载前状态===
        },
        mounted() {

        },
        methods: {
            getColorImg(path){
                let colorpath = '';
                let that = this;
                switch (path) {
                    case 0:
                        colorpath = that.imggray;
                        break;
                    case 1:
                        colorpath = that.imgred;
                        break;
                    case 2:
                        colorpath = that.imgorange;
                        break;
                    case 8:
                        colorpath = that.imgblue;
                        break;
                    case 4:
                        colorpath = that.imgyellow;
                        break;
                }
                return colorpath;
            },
            getPeakCompany(peak) {
                let peakCompany = '';
                let that = this;
                switch (peak) {
                    case 0:
                        peakCompany = that.noPeakCompany;
                        break;
                    case 1:
                        peakCompany = that.isPeakCompany;
                        break;
                }
                return peakCompany;
            }
        },
        components: {}
    };
</script>
<style lang="scss" scoped> 
    .emergentable{
        width: 100%;
        height: 100%;
        font-size: 11px;
        padding:10px 20px;
        position: relative;
        .table-class{
            th,td{
                border: 1px solid #eeeeee;
            }
        }
        .scrollBox{
            width: 100%;
            height: 540px;
            overflow-y: auto;
            .tableBady{
                height: 45px;
            }
            
        }
        .tablebox{
            background: #ebebeb;
            td{
                height: 20px;
            }
        }
        .showYujing{  
            position: absolute;
            top: 560px;
            padding-top: 20px;    
            li{
                list-style: none;
                float: left;
                margin-right: 20px;
            }
        }

    }   
</style>

