<template>
    <div class="DynamicWindField">
        <!--动态风场-->
        <v-header></v-header>
        <iframe
                frameborder="0"
                width="100%"
                height="100%"
                :src="DynamicWindFieldUrl"
                scrolling="no"
                id="iframetest"
        >

        </iframe>
        <!--https://airwise.zc12369.com/-->
    </div>
</template>

<script>

    export default {
        name: 'dynamicweather',
        data() {
            return {
                DynamicWindFieldUrl: 'https://airwise.zc12369.com/',

            }
        },
        mounted() {

        },
        methods:{

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .DynamicWindField {
        width: 100%;
        height: calc(100% - 64px);
    }
</style>
