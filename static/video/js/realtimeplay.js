var ocx;
var preWindowIndex = 0;
var indexcodes = [];
var pictype = "jpeg";
var picpath = "C:\Users\Public\Pictures\\";
var videosize = "256";
var videopath = "C:\Users\Public\Videos\\";
var decode = "5";
var PTZ_CMD_ZOOM_IN = 11 /* 焦距以速度SS变大(倍率变大) */
var PTZ_CMD_ZOOM_OUT = 12 /* 焦距以速度SS变小(倍率变小) */
var PTZ_CMD_FOCUS_NEAR = 13 /* 焦点以速度SS前调 */
var PTZ_CMD_FOCUS_FAR = 14 /* 焦点以速度SS后调 */
var PTZ_CMD_IRIS_OPEN = 15 /* 光圈以速度SS扩大 */
var PTZ_CMD_IRIS_CLOSE = 16 /* 光圈以速度SS缩小 */
var PTZ_CMD_TILT_UP = 21 /* 云台以SS的速度上仰 */
var PTZ_CMD_TILT_DOWN = 22 /* 云台以SS的速度下俯 */
var PTZ_CMD_PAN_LEFT = 23 /* 云台以SS的速度左转 */
var PTZ_CMD_PAN_RIGHT = 24 /* 云台以SS的速度右转 */
var PTZ_CMD_UP_LEFT = 25 /* 云台以SS的速度上仰和左转 */
var PTZ_CMD_UP_RIGHT = 26 /* 云台以SS的速度上仰和右转 */
var PTZ_CMD_DOWN_LEFT = 27 /* 云台以SS的速度下俯和左转 */
var PTZ_CMD_DOWN_RIGHT = 28 /* 云台以SS的速度下俯和右转 */
var PTZ_CMD_PAN_AUTO = 29 /* 云台以SS的速度左右自动扫描 */
var PRESET_CMD_SET_PRESET = 8 /* 设置预置点 */
var PRESET_CMD_CLE_PRESET = 9 /* 清除预置点 */
var PRESET_CMD_GOTO_PRESET = 39 /* 转到预置点 */
var PTZ_CMD_START = 0; /* 开始命令 */
var PTZ_CMD_STOP = 1; /* 结束命令 */
var SUCCESS = 0; /* 控件操作成功 */
var FAILED = 1; /* 控件操作失败 */
var ERROR = -1; /* 控件操作错误 */
var ISPREVIEW = 1; /* 正在预览 */
var NOTPREVIEW = 0; /* 没在预览 */
var OPRATION_PTZ = 10004;
var OPRATION_CUTVIDEO = 10003;
var OPRATION_VIDEOPARAM = 10002;
var theme = "Red";
// 添加注释，开发时不需要这个方法
/*
 * function showCode(type){ debugger; switch (type) { case 1: $.showCode({
 * msg:$("#ztreeCode").text(), closeTime:150000, type:'获取资源树' }); break; case 2:
 * $.showCode({ msg:$("#ztreeJavaCode").text(), closeTime:150000, type:'获取资源树'
 * }); break; //云台控制js case 3: $.showCode({ msg:$("#ptzJsCode").text(),
 * closeTime:150000, type:'控件js' }); break; case 4: $.showCode({
 * msg:$("#globalParamCode").text(), closeTime:150000, type:'控件js' }); break;
 * case 5: $.showCode({ msg:$("#stopOneCode").text(), closeTime:150000,
 * type:'控件js' }); break; case 6: $.showCode({ msg:$("#stopAllCode").text(),
 * closeTime:150000, type:'控件js' }); break; case 7: $.showCode({
 * msg:$("#getWindowStateCode").text(), closeTime:150000, type:'控件js' }); break;
 * case 8: $.showCode({ msg:$("#getWindowCode").text(), closeTime:150000,
 * type:'控件js' }); break; case 9: $.showCode({
 * msg:$("#selectWindowCode").text(), closeTime:150000, type:'控件js' }); break;
 * case 10: $.showCode({ msg:$("#selectWindowTypeCode").text(),
 * closeTime:150000, type:'控件js' }); break; case 11: $.showCode({
 * msg:$("#selectOcxSkinTypeCode").text(), closeTime:150000, type:'控件js' });
 * break; case 12: $.showCode({ msg:$("#deviceTalkOpenCode").text(),
 * closeTime:150000, type:'控件js' }); break; case 13: $.showCode({
 * msg:$("#deviceTalkCloseCode").text(), closeTime:150000, type:'控件js' });
 * break; case 14: $.showCode({ msg:$("#playSoundOpenCode").text(),
 * closeTime:150000, type:'控件js' }); break; case 15: $.showCode({
 * msg:$("#playSoundCloseCode").text(), closeTime:150000, type:'控件js' }); break;
 * default: break; }
 *  }
 */

//token设置事件通知，这个必须有
	function tokenCallEvent(reqID) {

		$.ajax({
			url : "/api/stream/getVmsTokenAction",
			type : "post",
			dataType : "text",
			success : function(token) {
				//alert(token);
				ocx.setToken(reqID, token);
			}
		});
	}
// 预览消息事件，9800 v4.2版本，需要支持chrome浏览器时才使用
/*
 * function OnfireEventNotify(EventType,WndIndex,EventXml) { debugger; var
 * RealTimePlayOcx=document.getElementById("PreviewOCX"); switch(EventType) {
 * case 0x02000001: //抓图 break; case 0x02000002: //紧急录像 break; case 0x02000005:
 * //开始预览 break; case 0x02000006: //停止预览 break; case 0x0200000E: //获取令牌 //var
 * reqId = new new Number(EventXml); $.ajax({ url :
 * "../../../stream/getVmsTokenAction", type : "post", dataType : "text",
 * success : function(token) { //alert(token);
 * RealTimePlayOcx.SetToken(EventXml, token); } }); break; case 0x02000011:
 * //窗口选中改变 break; case 0x02000007: //控件初始化完毕事件 break; case 0x02000012: //窗口交换改变
 * break; default: // } }
 */
// 设置控件主题颜色
/*
 * function selectOcxSkinType(){ debugger; var theme =
 * $("#ocxSkinSelect").val(); var ocxType ="previewOcx"; $.ajax({ type:"post",
 * url:"../../../param/setOcxSkinAction", dataType:"text", data:{ theme:theme,
 * ocxType:ocxType }, success:function(data){
 * window.location.href=window.location.href; } });
 * window.location.href=window.location.href; }
 */
// 参数设置dialog
/*
 * var settingDialog = $('#settingDialog').dialog({ autoOpen : false, modal :
 * true, width : 600, height : 500, draggable : true, buttons : { "ok" : { text :
 * '确认', 'class' : 'bPrimary', click : function(dialog) {
 * if(saveParam()==SUCCESS){ dialog.close(); jAlert('全局参数设置成功', '全局参数', 'ok');
 * }else{ jAlert('全局参数设置失败', '全局参数', 'error'); } } }, "cancel" : { text : '关闭',
 * click : function(dialog) { dialog.close(); } } } });
 */
// 初始化全局参数：即设置控件抓图默认存放路径，紧急录像存放路径等
/*
 * function initParam(isTrue){ debugger; $.ajax({ type:"post",
 * url:"../../../param/getParmAction", dataType:"text", success:function(data){
 * var param=jQuery.parseJSON(data);
 * $("input[data-value='"+param.picType+"']").attr("checked","checked");
 * $("#captureSavePath").val(param.picPath); $("select
 * option[value='"+param.videoSize+"']").attr("selected","selected");
 * $("Select").uniform(); $("#videoClibsSavePath").val(param.videoPath);
 * $("#slideValue").text(param.decode);
 * $("#slide").slider({value:param.decode}); if(isTrue){ var
 * xml=getParmXml(param.picType,param.picPath,param.videoSize,param.videoPath,param.decode);
 * if(ocx.setGlobalParam(xml)==FAILED){ jAlert('全局参数初始化失败', '全局参数', 'error'); }
 * }else{ settingDialog.dialog("open"); } } }); }
 */

// 窗口交换改变事件通知

 function windowExchangeEvent(index) { 

	 }
 
// 控件初始化完成事件通知

 function windowInitOK() { 

	 var layoutType =Number(1);
	  if(ocx.setWindowsLayout(layoutType)!=SUCCESS){
		 alert('窗口布局设置失败', '窗口布局', 'error'); 
	  }else{
		  //print("窗口布局设置成功");
	  }
	 }

// 窗口选择改变事件通知
/*
 * function windowChangeEvent(index){ debugger; var windIndex=showptz();
 * print("窗口选中改变，当前窗口索引为：" + windIndex+"编号"+indexcodes[windIndex]); }
 */
// 开始预览事件通知
function startPreviewEvent() {
	var windIndex = showptz();

}
// 停止预览事件通知
/*
 * function stopPreviewEvent(){ debugger; var windIndex=ocx.getSelectWindow();
 * print("窗口" + windIndex+"：停止预览"); }
 */
// 抓图完成事件通知
/*
 * function picCutEvent(param){ debugger; var windIndex=ocx.getSelectWindow();
 * if(param==SUCCESS){ print("窗口" + windIndex+"：抓图成功"); }else{ print("窗口" +
 * windIndex+"：抓图失败"); } }
 */
// 录像完成事件通知
/*
 * function videoCutEvent(param){ debugger; var windIndex=ocx.getSelectWindow();
 * if(param==SUCCESS){ print("窗口" + windIndex+"：录像成功"); }else{ print("窗口" +
 * windIndex+"：录像失败"); } }
 */
// 选择窗口布局

 function selectWindowType() { 

 var layoutType =Number(1);
  if(ocx.setWindowsLayout(layoutType)!=SUCCESS){
	 alert('窗口布局设置失败', '窗口布局', 'error'); 
  }else{
	  // print("窗口布局设置成功");
  }
 }

// 记录窗口之前选中的index
/*
 * function remember(id){ debugger; preWindowIndex=$("#"+id).val(); }
 */
// 选择当前窗口

 function selectWindow() {

 var wndIndex = Number($("#windowselect").val());
 if(ocx.setSelectWindow(wndIndex)==ERROR){
  $("#windowselect").val(preWindowIndex) 
  } }
 
// 获取当前窗口
/*
 * function getwindow() { debugger; var getwindow = $("#console"); var index =
 * ocx.getSelectWindow(); getwindow.text("当前窗口索引为：" + index); }
 */

// 设置操作权限
/*
 * function setOpration(indexCode) { debugger; var xml = []; xml.push("<?xml
 * version=\"1.0\" encoding=\"utf-8\" ?> "); xml.push("<Privileges>");
 * xml.push("<Privilege type=\"12\" /> "); $.ajax({ type:"post",
 * url:"../../../stream/checkResourcePrivilegeAction", dataType:"text", data:{
 * indexCode : indexCode, operCode : OPRATION_CUTVIDEO },
 * success:function(data){ var a = $.parseXML(data); var result =
 * $(a).find('result').attr("result_code"); if(result=="0"){ xml.push("<Privilege
 * type=\"10\" /> "); } $.ajax({ type:"post",
 * url:"../../../stream/checkResourcePrivilegeAction", dataType:"text", data:{
 * indexCode : indexCode, operCode : OPRATION_PTZ }, success:function(data){ var
 * a = $.parseXML(data); var result = $(a).find('result').attr("result_code");
 * if(result=="0"){ xml.push("<Privilege type=\"9\" /> "); } xml.push("</Privileges>");
 * var index = ocx.getSelectWindow(); if
 * (ocx.setOperAuth(xml.join(""))==SUCCESS) { print("窗口"+index+"操作权限设置成功");
 * }else{ print("窗口"+index+"操作权限设置失败"); } } }); } }); }
 */

// 获取窗口预览状态
/*
 * function getWindowState() { debugger; var index = ocx.getSelectWindow(); var
 * status = ocx.getPreviewStatus(index); if (status == ISPREVIEW) {
 * $("#console").text("当前窗口预览状态：正在预览"); } if (status == NOTPREVIEW) {
 * $("#console").text("当前窗口预览状态：没有预览"); } }
 */
// 云台移动，变焦
/*
 * function ptzControllerMove(command, action) { debugger; var xml = [];
 * xml.push("<?xml version=\"1.0\" encoding=\"utf-8\"?>"); xml.push("<PtzControl>");
 * xml.push("<Action>" + action + "</Action>"); xml.push("<Priority>50</Priority>");
 * xml.push("<Speed>5</Speed>"); //xml.push("<Preset Index =1 DwellTime=50
 * Speed=5 />"); xml.push("</PtzControl>"); if (ocx.ptzControl(command,
 * xml.join("")) == SUCCESS) { print("云台操作："+command+",操作："+action+"成功"); }else{
 * print("云台操作："+command+",操作："+action+"失败"); } }
 */

// 云台预置点设置
/*
 * function ptzSetPoint(pointIndex,action){ debugger; var xml = []; xml.push("<?xml
 * version=\"1.0\" encoding=\"utf-8\"?>"); xml.push("<PtzControl>"); xml.push("<Action>" +
 * action + "</Action>"); xml.push("<Priority>50</Priority>"); xml.push("<Speed>5</Speed>");
 * xml.push("<Preset Index ="+pointIndex+" DwellTime=50 Speed=5 />");
 * xml.push("</PtzControl>"); if (ocx.ptzControl(PRESET_CMD_SET_PRESET,
 * xml.join("")) == SUCCESS) { return SUCCESS; }else{ return FAILED; } }
 */

// 云台调用预置点
/*
 * function ptzGetPoint(pointIndex,action){ debugger; var xml = []; xml.push("<?xml
 * version=\"1.0\" encoding=\"utf-8\"?>"); xml.push("<PtzControl>"); xml.push("<Action>" +
 * action + "</Action>"); xml.push("<Priority>50</Priority>"); xml.push("<Speed>5</Speed>");
 * xml.push("<Preset Index ="+pointIndex+" DwellTime=50 Speed=5 />");
 * xml.push("</PtzControl>"); if (ocx.ptzControl(PRESET_CMD_GOTO_PRESET,
 * xml.join("")) == SUCCESS) { return SUCCESS; }else{ return FAILED; } }
 */
// 视频参数设置
/*
 * function videoParameterUpdate() { debugger; var paramxml =
 * ocx.getPreviewParam(); var a = $.parseXML(paramxml); var bright =
 * $(a).find('Bright').text(); //alert(paramxml); var contrast =
 * $(a).find('Contrast').text(); var saturation =
 * $(a).find('Saturation').text(); var hue = $(a).find('Hue').text();
 * $("#videoParameterL").attr("data-default", bright);
 * $("#videoParameterM").attr("data-default", contrast);
 * $("#videoParameterS").attr("data-default", hue);
 * $("#videoParameterB").attr("data-default", saturation);
 * 
 * $("#videoParameterL").val(bright).trigger('change');
 * $("#videoParameterM").val(contrast).trigger('change');
 * $("#videoParameterS").val(hue).trigger('change');
 * $("#videoParameterB").val(saturation).trigger('change'); }
 */
// 拼接视频参数的xml
/*
 * function getVideoParameterXml(bright,contrast,saturation,hue) { debugger; var
 * xml = []; xml.push("<?xml version=\"1.0\" encoding=\"utf-8\"?>"); xml.push("<VideoEffect>");
 * //亮度 xml.push("<Bright>"+bright+"</Bright>"); //对比度 xml.push("<Contrast>"+contrast+"</Contrast>");
 * //饱和度 xml.push("<Saturation>"+saturation+"</Saturation>"); //色调 xml.push("<Hue>"+hue+"</Hue>");
 * xml.push("</VideoEffect>"); return xml.join(""); }
 */

// 视频参数获取
/*
 * function videoParameterGet() { debugger; var indexCode =
 * indexcodes[ocx.getSelectWindow()]; var bright = $("#videoParameterL").val();
 * var contrast = $("#videoParameterM").val(); var saturation =
 * $("#videoParameterB").val(); var hue = $("#videoParameterS").val(); var
 * xml=getVideoParameterXml(bright,contrast,saturation,hue);
 * //alert(xml.join("")); $.ajax({ type:"post",
 * url:"../../../stream/checkResourcePrivilegeAction", dataType:"text", data:{
 * indexCode : indexCode, operCode : OPRATION_VIDEOPARAM },
 * success:function(data){ var a = $.parseXML(data); var result =
 * $(a).find('result').attr("result_code"); if(result=="0"){
 * if(ocx.setPreviewParam(xml)!=SUCCESS){
 * $("#videoParameterL").attr("data-default", bright);
 * $("#videoParameterM").attr("data-default", contrast);
 * $("#videoParameterS").attr("data-default", hue);
 * $("#videoParameterB").attr("data-default", saturation); jAlert('视频参数设置失败',
 * '视频参数', 'error'); }else{ jAlert('视频参数设置成功', '视频参数', 'ok'); } }else{
 * jAlert("没有视频参数设置权限"); } } }); }
 */
// 显示参数设置表单
/*
 * function showDetail(e) { debugger; var name = $(e).attr('name'); var id =
 * $(e).attr('id'); $("a[name='" + name + "']").parent().removeClass('active');
 * $(".form-inline").addClass('div-none'); $(e).parent().addClass("active");
 * $("#" + id + name).removeClass('div-none');
 *  }
 */
// 显示录像分包选项
/*
 * function getOptions(e) { var id = $(e).attr("id");
 * $("div[name='capture.option']").addClass("div-none"); $("#" + id +
 * "s").removeClass("div-none"); }
 */

// 开启语音对讲
/*
 * $("#deviceTalkOpen").click(function(){ debugger;
 * ocx.DeviceTalk(ocx.getSelectWindow(),1); });
 */

// 关闭语音对讲
/*
 * $("#deviceTalkClose").click(function(){
 * ocx.DeviceTalk(ocx.getSelectWindow(),0); });
 */

// 开启声音
/*
 * $("#playSoundOpen").click(function(){ debugger; ocx.PlaySound(1); });
 */

// 关闭声音
/*
 * $("#playSoundClose").click(function(){ debugger; ocx.PlaySound(0); });
 */

// 单窗口预览停止
/*
 * function stopOne() { debugger; var index = ocx.getSelectWindow(); if
 * (ocx.stopPreview(index) != SUCCESS) { print("窗口"+index+":停止预览失败"); }else{
 * showptz(); } }
 */

// 选择本地文件夹路径
/*
 * function browseFolder(id) { debugger; try { var Message = "选择文件路径"; //选择框提示信息
 * var Shell = new ActiveXObject("Shell.Application"); //var Folder =
 * Shell.BrowseForFolder(0, Message, 64, 17); //起始目录为：我的电脑 var Folder =
 * Shell.BrowseForFolder(0, Message, 0); //起始目录为：桌面 if (Folder != null) {
 * document.getElementById(id).value = Folder.self.path; return Folder; } }
 * catch (e) { jAlert(e.message); } }
 */

// 全局参数xml拼接
/*
 * function getParmXml(picType,picPath,videoSize,videoPath,decode){ var xml =
 * []; debugger; xml.push("<?xml version=\"1.0\" encoding=\"utf-8\"?><global>");
 * xml.push("<snap picture=\""+picType+"\" save=\""+picPath+"\"/>"); xml.push("<record
 * packSize=\""+videoSize+"\" save=\""+videoPath+"\"/>"); xml.push("
 * <performance decode=\""+decode+"\"/>"); xml.push("</global>"); return
 * xml.join(""); }
 */

// 把要放置控件的div的id以参数赋予这个对象，赋予全局变量ocx。
function initOcx() {
	var preview = {
		divId : "preview_1",
		// theme属性如果不用的话，得把preview.js里面初始化时相关的方法删掉；
		theme : theme
	}
	//debugger;
	ocx = new PreviewOCX(preview);

	// 下面的回调函数除了token回调，其他都是可选的，用户选取自己的业务需要做适当的增删方法；

	// 设置token回调
	ocx.registerCallback(PREVIEW_EVENT_TOKEN, tokenCallEvent);
	// 抓图回调函数
	//ocx.registerCallback(PREVIEW_EVENT_SNAP, picCutEvent);
	// 录像回调
	//ocx.registerCallback(PREVIEW_EVENT_VEDIO, videoCutEvent);
	// 开始预览回调
	//ocx.registerCallback(PREVIEW_EVENT_START, startPreviewEvent);
	// 停止预览回调
	//ocx.registerCallback(PREVIEW_EVENT_STOP, stopPreviewEvent);
	// 窗口选中改变回调
	//ocx.registerCallback(PREVIEW_EVENT_SELECTED, windowChangeEvent);
	// 窗口交换改变
	ocx.registerCallback(PREVIEW_EVENT_CHANGE, windowExchangeEvent);
	// 控件初始化完毕消息
	ocx.registerCallback(PREVIEW_EVENT_INIT_OK, windowInitOK);
	$('#tabContent').tabs();
	// 初始化全局参数，如果不需要控件抓拍、录像等功能，可以不用
	// initParam(true);

}

$(document).ready(function() {
	//debugger;
	// ztree
	var settingRes = {
		// 页面加载时先获取组织资源
		ajax : {
			url : "../../stream/getResource",
			type : "post",
			data : {
				resType : 1000
			// 资源类型
			},
			dataType : "text"
		},
		data : {
			simpleData : {
				enable : true
			},
			key : {
				name : "name"
			}
		},
		// 异步加载监控点 ，参数为组织资源的indexCode
		async : {
			enable : true,
			url : '../../stream/getCamera',
			autoParam : [ "indexCode" ],
			type : 'post',
			dataFilter : filter
		},
		// 事件回调
		callback : {
			beforeExpand : zTreeBeforeExpand,
			onDblClick : zTreeOnDblClick
		}
	};

	// 处理监控点节点的id属性，在每个监控点的id属性值前面加上 "camera"
	function filter(treeId, parentNode, childNodes) {
		//debugger;
		if (!childNodes)
			return null;
		for (var i = 0, l = childNodes.length; i < l; i++) {
			childNodes[i].id = "camera" + childNodes[i].id;
		}
		return childNodes;
	}
	function zTreeBeforeExpand(treeId, treeNode) {
		//debugger;
		var treea = $("#zTreea").tree();
		if (!treeNode.isExpand) {
			treea.reAsyncChildNodes(treeNode, "!refresh");
			treeNode.isExpand = 1;
		}
		return true;
	}

	/*
	 * $("#clearAll").click(function(){ debugger; $("#console").val(""); });
	 * click
	 *
	 */

	// ztree双击事件
	function zTreeOnDblClick(event, treeId, treeNode) {
		//debugger;
		// 双击开始预览
		if (treeNode.tag == "camera") {
			// alert(treeNode.indexCode);
			$.ajax({
				url : "http://gkpt.zq12369.com:8014/VideoPlatform/stream/getStream",
				type : "post",
				data : {
					indexCode : treeNode.indexCode
				},
				dataType : "text",
				success : function(xml) {

					var winindex = ocx.getSelectWindow();
					if (ocx.startPreview(winindex, xml) == 0) {
						if (ocx.setSelectWindow(winindex + 1) == -1) {

							ocx.setSelectWindow(0);
						}
					}
					indexcodes[winindex] = treeNode.indexCode;
				}
			});

		}
	}	;

//	var treea = $("#zTreea").tree(settingRes);

	// 云台遮罩
	// $('.control-mask').show();
	// 设置预置点点击事件
	/*
	 * $('#pointset').click(function() { var selectedpoint =
	 * $("#selectedpoint").val();
	 * if(ptzSetPoint(selectedpoint,PTZ_CMD_START)==0){ }else{ jAlert('预置点设置失败',
	 * '预置点', 'error'); } });
	 */
	// 调用预置点的点击事件
	/*
	 * $('#btn-call-preset').click(function() { var selectedpoint =
	 * $("#selectedpoint").val(); if(selectedpoint==null || selectedpoint==""){
	 * alert('请选择预置点'); } ptzGetPoint(selectedpoint,0); });
	 */
	// getOcxSkin();
	// 初始化控件
	initOcx();
});
