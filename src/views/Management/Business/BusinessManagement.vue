<!--后台管理-业务数据管理-->
<template>
    <div class="businessmanagement">
  		<business-side-bar></business-side-bar>
   		<keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
</template>

<script>
	import BusinessSideBar from '@/views/Management/Business/BusinessSideBar'
    export default {
        name: 'businessmanagement',
        data() {
            return {
      
            }
        },
        created(){
        	
        },
        mounted() {
        	
        },
        computed: {
            
        },
        methods: {
        },
        components:{BusinessSideBar}
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.businessmanagement{
	width: 100%;
	height: 100%;
}
</style>
