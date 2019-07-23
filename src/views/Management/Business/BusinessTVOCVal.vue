<!--后台管理-业务数据管理-->
<template>
    <div class="businessmanagement">
		<div class="TVOC">
			<!----------TVOC指标管理-->
			<div class="box">
                <div class="warning">
                    <a>TVOC指标管理</a>
                </div>
           </div>
            <div class="warningValSet">
            	<div class="blueBox" style="">• TVOC指标设置</div>		
            	<div class="ValueSet">
	            	<div class="PM25">
	            		<span class="demonstration"><span class="ColorRed">*</span>优</span>
	            		<el-input
						  placeholder="请输入内容"
						  v-model="best"
						  clearable>
						</el-input>
	            	</div>
	            	<div class="PM25">
	            		<span class="demonstration"><span class="ColorRed">*</span>良</span>
	            		<el-input
						  placeholder="请输入内容"
						  v-model="fine"
						  clearable>
						</el-input>
	            	</div>
	            	<div class="PM25" style="margin-right: 0;">
	            		<span class="demonstration"><span class="ColorRed">*</span>轻</span>
	            		<el-input
						  placeholder="请输入内容"
						  v-model="light"
						  clearable>
						</el-input>
	            	</div>
	            	<div class="PM25">
	            		<span class="demonstration"><span class="ColorRed">*</span>中度</span>
	            		<el-input
						  placeholder="请输入内容"
						  v-model="middle"
						  clearable>
						</el-input>
	            	</div>
	            	<div class="PM25">
	            		<span class="demonstration"><span class="ColorRed">*</span>重度</span>
	            		<el-input
						  placeholder="请输入内容"
						  v-model="heavy"
						  clearable>
						</el-input>
	            	</div>
	            	<div class="PM25" style="margin-right: 0;">
	            		<span class="demonstration"><span class="ColorRed">*</span>严重</span>
	            		<el-input
						  placeholder="请输入内容"
						  v-model="severe"
						  clearable>
						</el-input>
	            	</div>
	            	<div class="time" style="">
	            		<div class="updateTime">数据更新时间：{{CreateTime}}</div>
	            		<el-button class='btn' type="primary" @click='TVOCLevelValueSetting'>更改</el-button>
	            	</div>
            	</div>
            </div>
            <div class="warningValSet" style=''>
            	<div class="blueBox" style="">• TVOC预警值设置</div>		
            	<div class="ValueSet" style="">
            		<div class="PM25">
	            		<span class="demonstration">安次区</span>
	            		<el-input
						  placeholder="请输入内容"
						  v-model="AnCi"
						  clearable>
						</el-input>
	            	</div>
	            	<div class="PM25">
	            		<span class="demonstration">开发区</span>
	            		<el-input
						  placeholder="请输入内容"
						  v-model="KaiFa"
						  clearable>
						</el-input>
	            	</div>
	            	<div class="time" style="">
	            		<div class="updateTime">数据更新时间：{{updateTime}}</div>
	            		<el-button class='btn' type="primary" @click='TVOCAlarmValueSetting'>更改</el-button>
	            	</div>
            	</div>
           	</div>
		</div>
	<!--------------弹框部分--------------->
		<div class="popUp" v-if="isShow">
            <div class="mask"></div>
            <div class="succ-pop">
                <div class="title">
                    <a id="newCreate">提示</a>
                    <div class="el-icon-close" @click="closeWin"></div>
                </div>
                <div class="content">
            		<img src="../../../../static/imgs/main/Tw.png" />
					<p>必填项不可为空！</p>
               </div>
            </div>
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
            	isShow:false,
				//TVOC指标设置
				best:'',
				fine:'',
				light:'',
				middle:'',
				heavy:'',
				severe:'',
				CreateTime:'',
				//TVOC预警值设置
				AnCi:'',
				KaiFa:'',
				updateTime:'',
				id:''
            }
        },
        created(){
        	
        },
        mounted() {
        	this.GetTVOCLevleValue();
        	this.GetTVOCAlarmValue();
        },
        computed: {
            
        },
        methods: {
        	//获取TVOC预警值
        	GetTVOCAlarmValue(){
        		let t = this;
            	api.GetTVOCAlarmValue().then(result=>{
					let res = result.data.Data;
					t.AnCi = res.AcqTvocValue;
					t.KaiFa = res.KfqTvocValue;
					let dateStr = res.UpdateTime.replace('T',' ');
					t.updateTime = dateStr.slice(0,dateStr.indexOf("."));
				});
        	},
        	//TVOC预警值设置
        	TVOCAlarmValueSetting(){
        		let t = this;
        		let KfqTvocValue = this.KaiFa;
        		let AcqTvocValue = this.AnCi;
            	api.TVOCAlarmValueSetting(KfqTvocValue,AcqTvocValue).then(result=>{
					console.log(result)
					let res = result.data.Data;
					if(res){
						t.GetTVOCAlarmValue();
					}
				});
        	},
        	//获取TVOC指标
        	GetTVOCLevleValue(){
        		let t = this;
        		api.GetTVOCLevleValue().then(result=>{
					let res = result.data.Data[0];
					t.best = res.Excellent_Value;
					t.fine = res.Good_Value;
					t.light = res.Mild_Value;
					t.middle = res.Mod_Value;
					t.heavy = res.Severe_Value;
					t.severe = res.Serious_Value;
					t.id = res.Id;
					let dateStr = res.CreateTime.replace('T',' ');
					t.CreateTime = dateStr.slice(0,dateStr.indexOf("."));
				});
        	},
        	//TVOC指标设置
        	TVOCLevelValueSetting(){
        		let t = this;
        		let id = t.id;
        		let Excellent_Value = t.best;
				let Good_Value = t.fine;
				let Mild_Value = t.light;
				let Mod_Value = t.middle;
				let Severe_Value = t.heavy;
				let Serious_Value = t.severe;
        		if(!t.best||!t.fine||!t.light||!t.middle||!t.heavy||!t.severe){
        			this.isShow = true;
        		}else{
        					api.TVOCLevelValueSetting(id,Excellent_Value,Good_Value,Mild_Value,Mod_Value,Severe_Value,Serious_Value).then(result=>{
						let res = result.data.Data;
						if(res){
							t.GetTVOCLevleValue();
						}
					});
        		}
        	},
        	//必填提示关闭
        	closeWin(){
        		this.isShow = false;
        	}
 		}
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
.ColorRed{
	color: red;
}
.TVOC{
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
		margin-top: 20px;
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
			/*width: 260px;*/
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
/*************弹出框**********/
.popUp {
    /*灰色遮罩层*/
    .mask {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        position: fixed;
        left: 0;
        top: 0;
        z-index: 998;
    }
    /*****弹出框内容********/
    .succ-pop {
        width: 500px;
        height: 295px;
        background: #fff;
        position: fixed;
        left: 50%;
        top: 50%;
        margin-left: -250px;
        margin-top: -147px;
        z-index: 999;
        border-radius: 10px;
        .title {
            width: 100%;
            height: 50px;
            line-height: 50px;
            text-align: left;
            border-bottom: 2px solid #3a90b3;
            a {
                color: #3a90b3;
                font-size: 18px;
                padding-left: 20px;
            }
            div {
                margin-top: 15px;
                float: right;
                width: 24px;
                height: 24px;
                color: #363636;
                margin-right: 6px;
            }
        }
        .content{
        	position: absolute;
        	top: 50%;
        	left: 50%;
        	margin-top: -50px;
        	margin-left: -50px;
        	text-align: center;
        	img{
        		display: inline-block;
        	}
        	p{
        		padding-top: 30px;
        	}
        }
    }
}  
</style>
