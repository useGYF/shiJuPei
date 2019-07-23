<template>
    <!--国省控进度条部件-->
    <div class="progress">
        <div class="jindu" :style="{background:color,width:width + '%'}">
            <p>{{text}}</p>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'Progress',
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
            text: ''
        },
        methods: {
            // 所有方法
        }

    };
</script>
<style lang="scss" scoped>
    .progress {
        margin-top: 3px;
        width: 100%;
        height: 14px;
        background: #ccc;
        border-radius: 7px;
        .jindu {
            height: 100%;
            text-align: right;
            color: #fff;
            text-shadow: 1px 1px #000;
            line-height: 14px;
            border-radius: 7px;
            padding-right: 4px;
        }
    }
</style>