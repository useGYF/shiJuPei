<!--实时监测--预警信息-->
<template>
  <div class="publicInfo" v-if="hasData">
  	<ul>
  		<li><i>|</i>预警级别：{{warningLevel}}</li>
  		<li class="content"><i>|</i><marquee direction=left>{{content}}</marquee></li>
  		<li><i>|</i>企业应急状态：{{Responded}}家已响应, {{UnResponded}}家未响应</li>
  	</ul>
  </div>
</template>

<script>
import api from '../api/index'
export default {
  name: 'publicInfo',
  data () {
    return {
      warningLevel:'',
      content:'',
      Responded:'',
      UnResponded:'',
      hasData:false
    }
  },
  created(){
  },
  mounted(){
//	let t = this;
//		api.GetEmergencyInfo().then(result=>{
//			let warnInfo = result.data.Data;
//			t.warningLevel = warnInfo.Warning;
//			t.content = warnInfo.Content;
//			t.Responded = warnInfo.Responded;
//			t.UnResponded = warnInfo.UnResponded;
//		})
  },
  methods: {

  },
  activated(){
  	this.hasData = false;
  	let t = this;
		api.GetEmergencyInfo().then(result=>{
			let warnInfo = result.data.Data;
			if(warnInfo){
				t.hasData = true;
				t.warningLevel = warnInfo.Warning;
				t.content = warnInfo.Content;
				t.Responded = warnInfo.Responded;
				t.UnResponded = warnInfo.UnResponded;
			}
			
		})
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.publicInfo{
   width: 100%;
   height: 35px;
   border-bottom: 1px solid #cac7b4;
   font-size: 12px;
   position: absolute;
   background: #f4f4f4;
   line-height: 35px;
   text-align: left;
   padding-left: 40px;
   ul{
   		li{
   			list-style: none;
   			float: left;
   			margin-right: 20px;
   			i{
   				float: left;
   				font-style: normal;
   				color: #005BEA;
   				padding-right: 10px;
   			}
   		}
   		.content{
   			width: 400px;
   			overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
   		}
   }
}
</style>
