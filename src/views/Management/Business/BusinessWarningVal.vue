<!--后台管理-业务数据管理-->
<template>
    <div class="businessmanagement">
		<!-----------------预警值管理--------------->
		<div class="warningVal">
			<!----------预警值管理-->
			<div class="box">
                <div class="warning">
                    <a>预警值管理</a>
                </div>
            </div>
            <div class="warningValSet">
            	<div class="blueBox" style="">• 控制进度预警值设置</div>		
            	<div class="ValueSet" style="">
	            	<div class="PM25">
	            		<span class="demonstration">PM2.5</span>
	            		<el-input
						  placeholder="请输入内容"
						  v-model="PM25"
						  clearable>
						</el-input>
	            	</div>
	            	<div class="PM25">
	            		<span class="demonstration">PM10</span>
	            		<el-input
						  placeholder="请输入内容"
						  v-model="PM10"
						  clearable>
						</el-input>
	            	</div>
	            	<div class="PM25" style="margin-right: 0;">
	            		<span class="demonstration">NO2</span>
	            		<el-input
						  placeholder="请输入内容"
						  v-model="NO2"
						  clearable>
						</el-input>
	            	</div>
	            	<div class="PM25">
	            		<span class="demonstration">SO2</span>
	            		<el-input
						  placeholder="请输入内容"
						  v-model="SO2"
						  clearable>
						</el-input>
	            	</div>
	            	<div class="PM25">
	            		<span class="demonstration">CO</span>
	            		<el-input
						  placeholder="请输入内容"
						  v-model="CO"
						  clearable>
						</el-input>
	            	</div>
	            	<div class="PM25" style="margin-right: 0;">
	            		<span class="demonstration">O3</span>
	            		<el-input
						  placeholder="请输入内容"
						  v-model="O3"
						  clearable>
						</el-input>
	            	</div>
	            	<div class="time" style="">
	            		<div class="updateTime">数据更新时间：{{updateTime}}</div>
	            		<el-button class='btn' type="primary" @click='MonitorPointAlarmValueSetting'>更改</el-button>
	            	</div>
            	</div>
            </div>
		</div>
    </div>
</template>

<script>
    import {Message} from 'element-ui';
    import api from '../../../api/index';
    export default {
        name: 'businessmanagement',
        data() {
            return {
				//预警值管理
				PM25:'',
				PM10:'',
				NO2:'',
				SO2:'',
				CO:'',
				O3:'',
				updateTime:''
            }
        },
        created(){
        	
        },
        mounted() {
        	this.GetMonitorPointAlarmValue();
        },
        computed: {
            
        },
        methods: {
            /////////国控点预警值
            //获取国控点预警值
            GetMonitorPointAlarmValue(){
            	let t = this;
            	api.GetMonitorPointAlarmValue().then(result=>{
					let res = result.data.Data;
					console.log(res)
					t.CO = res.CO;
					t.NO2 = res.NO2;
					t.O3 = res.O3;
					t.PM10 = res.PM10;
					t.PM25 = res.PM25;
					t.SO2 = res.SO2;
					let dateStr = res.UpdateTime.replace('T',' ');
					t.updateTime = dateStr.slice(0,dateStr.indexOf("."));
				});
            },
            //国控点预警值设置
            MonitorPointAlarmValueSetting(){
            	let t = this;
            	let PM25 = this.PM25;
            	let PM10 = this.PM10;
            	let SO2 = this.SO2;
            	let NO2 = this.NO2;
            	let CO = this.CO;
            	let O3 = this.O3;
            	api.MonitorPointAlarmValueSetting(PM25,PM10,SO2,NO2,CO,O3).then(result=>{
					let res = result.data.Data;
					if(res){
						t.GetMonitorPointAlarmValue();
					}
				});
            }
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.businessmanagement{
	width: 100%;
}
/*预警值管理*/
.el-input, .el-input__inner{
	width: 200px;
}
.warningVal{
	overflow: hidden;
	padding: 20px;
	background-color: #f6fbff;
	.box {
        width: 100%;
        height: auto;
        .warning {
        	text-align: left;
            border-bottom: solid 1px #ccc;
            width: 100%;
            height: 40px;
            margin-top: 10px;
            margin-bottom: 20px;
            margin-left: 10px;
            a {
                display: inline-block;
                height: 20px;
                border-left: solid 3px #428bca;
                padding-left: 13px;
                font-size: 16px;
                line-height: 20px;
            }
        }
    }
	.warningValSet{
		padding-top: 20px;
		width:100%;
		/*height: 250px;*/
		background: #fff;
		border:1px solid #eee;
		text-align: left;
		.ValueSet{
			padding-left: 20px;
			padding-bottom: 20px;
		}
		.blueBox{
			width: 200px;
			height: 40px;
			background: #2394f2;
			color: #fff;
			border-radius: 0 23px 23px 0;
			font-size: 12px;
			line-height: 40px;
			text-align: left;
			padding-left: 10px;
			
		}
		.PM25{
			width: 33%;
			display: inline-block;
			/*margin-right: 120px;*/
			margin-top: 20px;
			.demonstration{
				display: inline-block;
				float: left;
				width: 50px;
				height: 40px;
				line-height: 40px;
				text-align: right;
				margin-right: 10px;
			}
		}
		.time{
			height: 36px;
			line-height: 36px;
			padding-right: 20px;
			margin-top: 10px;
			.updateTime{
				float: left;
			}
			.btn{
				float: right;
			}
		}
	}
}

</style>
