<template>
    <div class="header">
        <div class="navbox">
            <!--环境监测-->
            <div class="logo">
                <img src="../assets/img/logo1.png" alt="logo">
                <a style="color: #fff;font-size:21px;font-weight: 500;line-height: 56px;font-family: 'Microsoft YaHei' ">廊坊市空气质量智能管控平台</a>
            </div>
            <div style="color: #fff;float: left;height: 56px;line-height: 66px;margin-left: 4px">2018版</div>
            <ul class="bnav">
            	<div>
                    <img src="../assets/img/sy-z.png" alt="">
                    <a href="#/">首页</a>
                </div>
                <div>
                    <img src="../assets/img/tc-z.png" alt="">
                    <a style="padding: 0 10px" @click="exit">退出</a>
                </div>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'header',
        data () {
            return {
                msg: 'App',
                houtaiSrc: '../../static/imgs/mues/header/btn_Backstage2.png',
                houtaiChesSrc: '../../static/imgs/mues/header/btn_Backstage1.png',
                tuichuSrc: '../../static/imgs/mues/header/btn_quit2.png',
                tuichuChesSrc: '../../static/imgs/mues/header/btn_quit1.png'
            }
        },
        mounted(){
            let t = this;
            $(".houtai").hover(function () {
                $(".houtai img").attr('src', t.houtaiSrc);
            }, function () {
                $(".houtai img").attr('src', t.houtaiChesSrc);
            });
            //
            $(".tuichu").hover(function () {
                $(".tuichu img").attr('src', t.tuichuSrc);
            }, function () {
                $(".tuichu img").attr('src', t.tuichuChesSrc);
            });
           // this.DropDownAnimation('li');
        },
        methods: {
            exit(){
                this.$cookies.remove('auth')
                setTimeout(() => {

                    this.$router.push('/login')
                })
            },
            //下拉动画
            // DropDownAnimation(_this){
            //     $(_this).each(function () {
            //         var $this = $(this);
            //         var theMenu = $this.find(".submenu");
            //         var tarHeight = theMenu.height() + 20;
            //         theMenu.css({height: 0});
            //         $this.hover(
            //             function () {
            //                 theMenu.stop().show().animate({height: tarHeight}, 400);
            //             },
            //             function () {
            //                 theMenu.stop().animate({height: 0}, 400, function () {
            //                     $(this).css({display: "none"});
            //                 });
            //             }
            //         );
            //     });
            // }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .header {
        width: 100%;
        height: 56px;
        background: #2494F2;
        .logo {
            float: left;
            width: auto;

            img {
                width: 40px;
                height: 40px;
                margin-top: -9px;
                margin-left: 20px;
                margin-right: 2px;
            }

        }
        .bnav {
            float: right;
            height: 56px;
            margin-right: 20px;
            div {
                float: left;
                width: auto;
                height: 56px;
                list-style: none;
                line-height: 56px;
                position: relative;
                margin-left:20px;
                text-align: left;
                img{
                    display: inline-block;
                    vertical-align: middle;
                }
                a {
                    color: #dee9f5;
                    font-size: 16px;
                    font-family: '微软雅黑';
                    cursor: pointer;
                    padding: 0;
                }
                :hover {
                    text-decoration: none;
                }
           }
        }
    }

</style>
