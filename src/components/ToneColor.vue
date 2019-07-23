<template>
    <div class="Tone">
        <ul>
            <li style="background:#b6b6b6 "></li>
            <li style="background:#2ae232 "></li>
            <li style="background:#fde73b "></li>
            <li style="background:#feb534 "></li>
            <li style="background:#fc5c46 "></li>
            <li style="background:#da285c "></li>
            <li style="background:#9d0c35 "></li>
        </ul>
        <ol>
            <li>离线</li>
            <li>优</li>
            <li>良</li>
            <li>轻度</li>
            <li>中度</li>
            <li>重度</li>
            <li>严重</li>
        </ol>
    </div>
</template>
<script>
    import {bus} from '@/js/bus.js'


    export default {
        data() {
            return {
                //页面数据
            };
        },
        methods: {
            // 所有方法
        }
    };
</script>
<style lang="scss" scoped>
    .Tone {
        width: 100%;
        height: 100%;
        ol {
            li {
                list-style: none;
                width: 44px;
                height: 24px;
                float: left;
                background: rgba(0, 0, 0, 0.6);
                text-align: center;
                line-height: 24px;
                font-size: 10px;
                color: #fff;
            }
        }
        ul {

            li {
                list-style: none;
                width: 44px;
                height: 6px;
                float: left;

            }
        }
    }
</style>

