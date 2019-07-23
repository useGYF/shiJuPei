<template>
    <!--冬防战报进度条部件-->
    <div class="winterprogress">
        <div class="leiji_Img" :style="{left:left + '%'}">
            <img class="positin_img2" src="../assets/img/dq-lj.png" alt="">
            <p>当前累计:{{CurrentCumulative}}</p>
        </div>
        <div class="Speed" :style="{background:color,width:width + '%'}"></div>
        <div class="guding_yj">
            <img class="positin_img1" src="../assets/img/icon_yj.png" alt="">
            <p>预警值:{{WarningValue}}</p>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'winterprogress',
        data() {
            return {
                //页面数据
            };
        },
        props: {
            color: {
                type: String,
                default: ''
            },
            width: {
                type: Number,
                default: ''
            },
            left: {
                type: Number,
                default: ''
            },
            text: '',
            CurrentCumulative: '',
            WarningValue: ''
        },
        methods: {
            // 所有方法

        }

    };
</script>
<style lang="scss" scoped>
    .winterprogress {
        margin-top: 3px;
        width: 70%;
        margin-left: 3%;
        height: 12px;
        background: #ccc;
        border-radius: 2px;
        position: relative;
        box-shadow: 0px 0px 4px #687D89;
        .leiji_Img {
            position: absolute;
            top: -26px;
            margin-left: -43px;
            p {
                position: absolute;
                top: 4px;
                left: 8px;
                font-size: 10px;
            }
        }
        .Speed {
            width: 100%;
            height: 100%;
            text-align: right;
            color: #fff;

            line-height: 14px;
            border-radius: 2px;
            padding-right: 4px;
            position: relative;
        }

        .guding_yj {
            width: 100%;
            height: 40px;
            position: absolute;
            top: 16px;
            left: 174px;
            background: url("../assets/img/yu-z.png") no-repeat;
            .positin_img1 {
                position: absolute;
                top: -24px;
                left: 30px;
            }
            p {
                position: absolute;
                top: 4px;
                left: 8px;
                font-size: 10px;
            }
        }
    }
</style>