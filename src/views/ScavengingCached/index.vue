<template>
    <div class="scinindex">
        <!--官方报告详情-->
        <v-header></v-header>
        <!---->
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "scinindex"
    }
</script>

<style scoped>
    .scinindex{
        width: 100%;
        height: auto;
    }
</style>