<!--后台管理-业务数据管理-->
<template>
    <div class="businessmanagement">
    	<!--------左侧导航部分-------->
    	<div class="left" v-if="isDuty">

			<el-col :span="8">
				<el-col :span="8">
					<el-menu default-active="Case-Review" :unique-opened=true router  class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
						<el-submenu index="active1" >
							<template slot="title">
								<!--<i class="el-icon-message"></i>-->
								<img src="../../../../static/imgs/main/业务数据.png" />
								业务数据</template>
							<!--<el-menu-item index="Business-point">国控点管理</el-menu-item>-->
							<!--<el-menu-item index="Business-Province">省控点管理</el-menu-item>-->
							<!--<el-menu-item index="Business-Params">六参数传感器管理</el-menu-item>-->
							<!--<el-menu-item index="Business-TVOC">TVOC管理</el-menu-item>-->
							<!--<el-menu-item index="Business-Video">监控视频管理</el-menu-item>-->
							<!--<el-menu-item index="Business-Weather">气象站管理</el-menu-item>-->
							<!--<el-menu-item index="Business-Slite">工地管理</el-menu-item>-->
							<el-menu-item index="Business-Warning">预警信息管理</el-menu-item>
							<el-menu-item index="Business-TVOCVal">TVOC指标管理</el-menu-item>
							<el-menu-item index="Business-WarningVal">预警值管理</el-menu-item>
							<el-menu-item index="Business-Presentation">官方报告</el-menu-item>
							<el-menu-item index="Business-Economic">经济数据管理</el-menu-item>
							<el-menu-item index="Business-DayData">日数据管理</el-menu-item>
							<el-menu-item index="Business-Operation">运维记录管理</el-menu-item>
							<el-menu-item index="Business-Electricity">用电量管理</el-menu-item>
						</el-submenu>
						<el-submenu index="active2" >
							<template slot="title">
								<!--<i class="el-icon-menu"></i>-->
								<img src="../../../../static/imgs/main/案件管理.png" />
								案件管理</template>
							<el-menu-item index="Case-Review">案件审核</el-menu-item>
						</el-submenu>
						<!--<el-menu-item index="active3"><i class="el-icon-setting"></i>设置管理</el-menu-item>-->
					</el-menu>
				</el-col>
			</el-col>
		</div>
		<div class="left" v-else>

			<el-col :span="8">
				<el-col :span="8">
					<el-menu default-active="Case-Review" :unique-opened=true router  class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
						<el-submenu index="active2" >
							<template slot="title">
								<!--<i class="el-icon-menu"></i>-->
								<img src="../../../../static/imgs/main/案件管理.png" />
								案件管理</template>
							<el-menu-item index="Case-Review">案件审核</el-menu-item>
						</el-submenu>
					</el-menu>
				</el-col>
			</el-col>
		</div>
    </div>
</template>

<script>
    import {Message} from 'element-ui';
    import api from '../../../api/index'
    export default {
        name: 'businessmanagement',
        data() {
            return {
				isDuty: false
            }
        },
        created(){
        	
        },
        
        mounted() {
        	this.isDuty = this.getlocal('userInfo').isDuty;
        	console.log(this.isDuty)
        },
        computed: {
            
        },
        methods: {
        	//获取本地
		    getlocal(name) {
		        let data = sessionStorage.getItem(name)
		        if (data != null && data != '') {
		            try {
		                let obj = eval('(' + data + ')')
		                return obj
		            } catch (e) {
		                return ''
		            }
		        } else {
		            return ''
		        }
		    },
	 		handleOpen(key, keyPath) {
//       		console.log(key, keyPath);
	  		},
	        handleClose(key, keyPath) {
				//console.log(key, keyPath);
	        },
	        handleSelect(key, keyPath){
	        	
	        },
		},
		activated(){
			alert()
        	
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.businessmanagement{
	width: 200px;
	float: left;

}
.el-menu-vertical-demo{
	border: 0;
}
.left{
	height: 100%;
	li{
		width: 200px;
	}
}
</style>
