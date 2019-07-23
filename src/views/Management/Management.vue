<template>
    <div class="management">
        <!---->
   		<management-header></management-header>
   		<!---->
        <router-view></router-view>
    </div>
</template>

<script>
    import {Message} from 'element-ui';
	import ManagementHeader from '@/components/ManagementHeader'
    export default {
        name: 'management',
        data() {
            return {
             
            }
        },
        mounted() {
        	
        },
        computed: {
            
        },
        methods: {
     
        },
        components:{ManagementHeader}
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.management{
	width: 100%;
	height: calc(100% - 64px);
}
</style>
