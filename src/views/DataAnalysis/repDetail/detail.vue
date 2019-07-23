<template>
    <div class="repdetail">
        <!---->
        <div class="r-warp">
            <div class="con-title">
                <a class="f-hui" @click="$router.go(-1)">返回上级</a>
                <h1>{{w_title}} <span class="con-time">{{time}}</span></h1>
            </div>
            <div class="content">
                <div class="con-calss" v-html='w_content'></div>
            </div>
        </div>
    </div>
</template>

<script>
    import api from '../../../api/index'
    export default {
        name: "index",
        data(){
            return{
                //
                w_title:'',
                //
                w_content:'',
                //
                time:''
            }
        },
        created(){

        },
        computed:{
            OperatorId() {
                return this.$route.query.id
            },
        },
        mounted(){
            console.log(this.OperatorId);
            this.GetSingleRequest(this.OperatorId);

        },
        methods:{
            //获取单个
            GetSingleRequest(Id){
                api.GetgfbgSingleRe(Id).then(res =>{
                    console.log(res)
                    let item = res.data.Data.data;
                    console.log(item)
                    //修改默认值
                    this.time = (item.UpdateTime).replace('T',' ');
                    this.w_title = item.Title;
                    this.w_content = this.htmlDecodeByRegExp(item.Content);
                })

            },
            //
            htmlDecodeByRegExp(str) {
                let s = "";
                if(str.length == 0) return "";
                s = str.replace(/&amp;/g,"&");
                s = s.replace(/&lt;/g,"<");
                s = s.replace(/&gt;/g,">");
                s = s.replace(/&nbsp;/g," ");
                s = s.replace(/&#39;/g,"\'");
                s = s.replace(/&quot;/g,"\"");
                return s;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .repdetail{
        width: 100%;
        background: #0A142C;
        height: auto;

        .con-title{
            width: 80%;
            padding: 10px;
            background: #fff;
            border-bottom: solid 1px #494949;
            margin: 0 auto;
            position: relative;
            .f-hui{
                position: absolute;
                top: 10px;
                left: 10px;
            }
            .con-time{
                position: absolute;
                bottom:6px ;
                right:10px;
                font-size: 14px;

            }
        }
        .content{
            width: 80%;
            background: #fff;
            margin: 0 auto;
            min-height: 824px;
            .con-calss{

                text-align: left;
                padding: 20px 40px;
                p{
                    text-align: justify; text-justify: inter-ideograph; text-indent: 2em!important;
                }
            }

        }
    }
</style>