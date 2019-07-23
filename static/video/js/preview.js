/**
 * 预览视频功能
 */
"use strict";

/** *********预览事件消息通知类型************ */
// 抓图结束通知
var PREVIEW_EVENT_SNAP     = 33554433;
// 紧急录像结束通知
var PREVIEW_EVENT_VEDIO    = 33554434;
// 开始预览通知
var PREVIEW_EVENT_START    = 33554437;
// 停止预览通知
var PREVIEW_EVENT_STOP     = 33554438;
// 控件初始化完毕消息
var PREVIEW_EVENT_INIT_OK  = 33554439;
// 获取token消息通知
var PREVIEW_EVENT_TOKEN    = 33554446;
// 窗口选中改变通知
var PREVIEW_EVENT_SELECTED = 33554449;
// 窗口交换改变
var PREVIEW_EVENT_CHANGE   = 33554450;

// 记录控件对象
var previewOcxObj;

/**
 * 预览控件类
 * 
 * @param:divId 控件所在DIV的ID
 */
function PreviewOCX(options) {
    //debugger;
	/**
	 * 初始化
	 */
	this.init = function(options) {
		  //debugger;
		this.divId = options.divId;
		this.theme  = options.theme;
		// 获取控件所在DIV
		var divObj = document.getElementById(this.divId);
		if (isBrowserIE() == 2) {// IE11
			// 加载控件
			var o = document.createElement("object");
			var o2 = document.createElement("PARAM");
			o2.setAttribute("NAME","THEME");
            //o2.setAttribute("wmode","transparent");
			o2.setAttribute("VALUE",this.theme);
			o.setAttribute("classid",
					"clsid:6DABF69C-7610-4D25-BC4F-664003130B94");
			o.setAttribute("width", "100%");
			o.setAttribute("height", "100%");
			o.setAttribute("id", "PreviewOCX");
			o.setAttribute("name", "PreviewOCX");
			o.appendChild(o2);
			divObj.appendChild(o);
			
			var script = document.createElement("script");
			script.setAttribute("language", "javascript");
			script.setAttribute("for", "PreviewOCX");
			script.setAttribute("event",
					"EventNotify(event_type, wnd_index, param)");
			script.innerHTML = "EventNotify(event_type, wnd_index, param);";
			divObj.appendChild(script);
		} else {
			if (-[ 1, ]) {// IE9,IE10
				 //加载控件
				var object = document.createElement("object");
				object.setAttribute("classid",
						"clsid:6DABF69C-7610-4D25-BC4F-664003130B94");
				object.setAttribute("width", "100%");
				object.setAttribute("height", "100%");
				object.setAttribute("id", "PreviewOCX");
				object.setAttribute("name", "PreviewOCX");
                //object.setAttribute("wmode", "transparent");
				object.setAttribute("Theme", this.theme);
				//object.object.Theme =this.theme;
				divObj.appendChild(object);
               //debugger;
				var script = document.createElement("script");
				script.setAttribute("language", "javascript");
				script.setAttribute("for", "PreviewOCX");
				script.setAttribute("event",
						"EventNotify(event_type, wnd_index, param)");
				script.innerHTML = "EventNotify(event_type, wnd_index, param);";
				divObj.appendChild(script);
			} else {// IE6,7,8
				divObj.innerHTML = '<object id=\"PreviewOCX\"skin=\"'+this.skin+'\" classid=\"clsid:6DABF69C-7610-4D25-BC4F-664003130B94\" width="100%" height="100%" ><param name="Theme" value =\"'+this.theme+'\"></object>'
						+ '<script language=\"javascript\" for=\"PreviewOCX\" event=\"EventNotify(event_type, wnd_index, param)\">EventNotify(event_type, wnd_index, param);</script>';
			}
		}

		// 预览控件
		this.previewOCX = document.getElementById("PreviewOCX");
		// 存放预览控件回调函数的数组
		this.callback = new Array();

		// 预览对象保存
		previewOcxObj = this;
	}


	/**
	 * 设置窗口布局
	 * 
	 * @param:layoutType 布局格式枚举见示例
	 * @returns:成功返回0；失败返回错误码
	 */
	this.setWindowsLayout = function(layoutType) {
		  //debugger;
		try {
			var result = this.previewOCX.SetLayoutType(layoutType);		
			//debugger;
			return result;
		} catch (e) {
			return 1;
		}
	}

	/**
	 * 开始预览
	 * 
	 * @param:xml 预览参数
	 * @param:wndIdx 当前预览的窗口索引号
	 * @returns:操作发起成功0；失败返回错误码
	 */
	this.startPreview = function(wndIdx, xml) {
		//debugger;
		try {
			var result = this.previewOCX.StartPreview(xml, wndIdx);
			return result;
		} catch (e) {
			return 1;
		}
	}

	/**
	 * 停止预览
	 * 
	 * @param:index 窗口索引，-1表示停止所有窗口的预览
	 * @returns:操作发起成功0；失败返回错误码
	 */
	this.stopPreview = function(index) {
		  //debugger;
		try {
			var result = this.previewOCX.StopPreview(index);
			return result;
		} catch (e) {
			return 1;
		}
	}
	/**
	 * 语音对讲
	 * @param:bOpen 1代表打开 0代表关闭
	 * @param:wndIndex 窗口索引
	 * @returns:操作发起成功0；失败返回错误码
	 */
	/*this.DeviceTalk = function(wndIndex, bOpen) {
		  debugger;
		try{
			var result = this.previewOCX.DeviceTalk(wndIndex, bOpen);
			
			return result;
		   }catch(e) {
				return 1;
		}
	}*/
	/**
	 * 打开声音
	 * @param:bOpen 1代表打开 0代表关闭
	 * @returns:操作发起成功0；失败返回错误码
	 */
/*	this.PlaySound = function(bOpen) {
		  debugger;
		try{
			var result = this.previewOCX.PlaySound(bOpen);
			return result;
		   }catch(e) {
				return 1;
		}
	}*/

	/**
	 * 云镜控制
	 * 
	 * @param:cmdId 云台控制参数
	 * @param:xml 云台控制参数
	 * @returns:操作发起成功0；失败返回错误码
	 */
/*	this.ptzControl = function(cmdId, xml) {
		  debugger;
		try {
			var result = this.previewOCX.PtzControl(cmdId, xml);
			return result;
		} catch (e) {
			return 1;
		}
	}*/

	/**
	 * 视频参数设置
	 * 
	 * @param:xml 设置的视频参数
	 * @returns:成功返回0；失败返回错误码
	 */
/*	this.setPreviewParam = function(xml) {
		  debugger;
		try {
			var result = this.previewOCX.SetVideoParam(xml);
			return result;
		} catch (e) {
			return 1;
		}
	}*/

	/**
	 * 视频参数获取
	 * 
	 * @returns:视频参数
	 */
/*	this.getPreviewParam = function() {
		  debugger;
		try {
			var cfgXml = this.previewOCX.GetVideoParam();
			return cfgXml;
		} catch (e) {
			return "";
		}
	}
*/
	/**
	 * 预览状态获取
	 * 
	 * @param:wndIndex 指定窗口的窗口索引值
	 * @returns:0表示没有预览，1表示正在预览
	 */
/*	this.getPreviewStatus = function(wndIndex) {
		  debugger;
		try {
			var status = this.previewOCX.IsPreview(wndIndex);
			return status;
		} catch (e) {
			return 0;
		}
	}*/

	/**
	 * 设置当前选中窗口
	 * 
	 * @param:wndIndex 指定窗口的窗口索引值
	 * @returns:操作发起成功0；失败返回错误码
	 */
	this.setSelectWindow = function(wndIndex) {
		 // debugger;
		try {
			var result = this.previewOCX.SelectWindow(wndIndex);
			return result;
		} catch (e) {
			return -1;
		}
	}

	/**
	 * 获取当前选中窗口
	 * 
	 * @returns:选中窗口索引
	 */
	this.getSelectWindow = function() {
		 // debugger;
		try {
			var index = this.previewOCX.GetCurrentSelectWindow();
			return index;
		} catch (e) {
			return 0;
		}
	}
	/**
	 * 注册回调方法
	 * 
	 * @param:callbackType 回调类型
	 * @param:fn 回调方法
	 */
	this.registerCallback = function(callbackType, fn) {
		this.callback[callbackType] = fn;
	}
	this.init(options);
}

/**
 * 预览事件消息通知
 * 
 * @param:event_type 事件类型
 * @param:wnd_index 窗口索引
 * @param:xml 事件携带的参数
 */
function EventNotify(event_type, wnd_index, xml) {
	switch (event_type) {
	case PREVIEW_EVENT_SNAP:
		if (previewOcxObj.callback[event_type]) {
			previewOcxObj.callback[event_type].call(this, xml);
		}
		break;
	case PREVIEW_EVENT_VEDIO:
		if (previewOcxObj.callback[event_type]) {
			previewOcxObj.callback[event_type].call(this, xml);
		}
		break;
	case PREVIEW_EVENT_START:
		if (previewOcxObj.callback[event_type]) {
			previewOcxObj.callback[event_type].call();
		}
		break;
	case PREVIEW_EVENT_STOP:
		if (previewOcxObj.callback[event_type]) {
			previewOcxObj.callback[event_type].call();
		}
		break;
	case PREVIEW_EVENT_INIT_OK:
		if (previewOcxObj.callback[event_type]) {
			previewOcxObj.callback[event_type].call();
		}
		break;
	case PREVIEW_EVENT_TOKEN:
		if (previewOcxObj.callback[event_type]) {
			previewOcxObj.callback[event_type].call(this, xml);
		}
		break;
	case PREVIEW_EVENT_SELECTED:
		if (previewOcxObj.callback[event_type]) {
			previewOcxObj.callback[event_type].call(this, wnd_index);
		}
		break;
	case PREVIEW_EVENT_CHANGE:
		if (previewOcxObj.callback[event_type]) {
			previewOcxObj.callback[event_type].call(this, wnd_index);
		}
		break;
	
	default:
		// alert("视频预览通知消息类型错误！");
	}
}
/**
 * 判断浏览器类型
 * 
 * @returns:0-IE8~IE10,1-Chrome,2-IE11
 */
function isBrowserIE() {
	  //debugger;
	var appName = navigator.userAgent;
	if (appName.indexOf('MSIE') > -1) {
		return 0;
	} else if (appName.indexOf('Chrome') > -1) {
		return 1;
	} else if (!!window.ActiveXObject || "ActiveXObject" in window) {
		// 判断是否是IE11
		return 2;
	}
	return 0;
}

/**
 * 接受参数
 *
 * @returns:0-IE8~IE10,1-Chrome,2-IE11
 */