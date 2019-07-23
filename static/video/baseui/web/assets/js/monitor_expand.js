$(document).bind('cookieReady',function() {
				// start-------------------------------------------------------------
				var selectWindowIndex = 0;
				var pfc = 1;
				var pfc_stats={};
				var init_flag = {};
				var originalSize = 1;// 1---原来是小窗口，0----原来就是大窗口
				

				// 视频窗口播放情况,记录是否在播放，云镜状态，锁定状态等。
				var win_status = {};
				var ptz_panel_status = {};
				
			    setVideoParam('bright',0);
				setVideoParam('light',0);
				setVideoParam('saturation',0);
				setVideoParam('tone',0);
				
				var init_win_index = 0;
				
				$(".win_container").click(function() {
					var lWndId = parseInt($(this).attr('data-index'));
					clearLastWinStatus(lWndId);
					clearVideoParam(lWndId);
					$('#ocx_container_' + selectWindowIndex).removeClass('selected');
					$('#ocx_container_' + lWndId).addClass('selected');
					if (!init_flag[lWndId]) {
						init_win(lWndId);
						init_flag[lWndId] = 1
						selectWindowIndex = lWndId;
					}
				});
				
				$('.closeB').click(function(){// 点击关闭退出鱼眼模式
					ocxPanel.resetScreenStyle();
					for(var i = 0; i<25;i++){
						if($('#preview_' + i).hikui() /*
														 * &&
														 * win_status[i].yuyan
														 */ && yuyanMode){
							$('#preview_' + i).hikui().ExitFishEye();
						
							$('.monitor-toolbar .act-save').css('display','none');
							// yuyanMode = true;
							if(isSingle && originalSize == 1){
								leftMouseDblClick($('#preview_' + i).hikui(), "", "", i);
							}
						}
					}
					yuyanMode = false;
					$('.yuyanTab').css('display','none');
					$('.monitor-container').css('padding-top', '0');
					$("#btn_close_all").removeClass("disabled");
				});
				function notSupportFisheye(ocx,lErrorCode, szDetail, lWndId) {
    				jAlert('该监控点不支持鱼眼功能','提示','attention');
				}

				var messageMap = {
						0x0201 : leftMouseDown,
						0x0202 : leftMouseUp,
						0x0203 : leftMouseDblClick,
						0x0204 : rightMouseDown,
						0x0205 : rightMouseUp,
						0x0206 : rightMouseDblClick,

						0x02000001 : catchPicture,
						0x02000002 : record,
						0x02000005 : startPreview,
						0x02000006 : stopPreview,
						0x02000007 : initComlete,
						0x02000013 : msgHanler,
						0x02000015 : startFishPreview,
						0x02100011 : startFocalZoom,
						0x02100012 : startFocalNarrow,
						0x02100013 : get3DZoomArea,
						0x02100014 : endFocalZoom,
						0x02100015 : endFocalNarrow,
						0x02000016 : notSupportFisheye,
						0x02000900 : violation, 
						// 以下云镜相关
						0x02100001 : startWestNorth,
						0x02100002 : endWestNorth,
						
						0x02100003 : startNorth,
						0x02100004 : endNorth,
						
						0x02100005 : startEastNorth,
						0x02100006 : endEastNorth,
						
						0x02100007 : startEast,
						0x02100008 : endEast,
						
						0x02100009 : startEastSouth,
						0x0210000A : endEastSouth,
							
						0x0210000B : startSouth,
						0x0210000C : endSouth,
						
						0x0210000D : startWestSouth,
						0x0210000E : endWestSouth,
						
						0x0210000F : startWest,
						0x02100010 : endWest,
						0x02000111 : talkHandler,
						
						0x0200000E : getToken
					};
					
				setInterval(sendKeepLiveRequest, 5 * 60 * 1000);
				
				function sendKeepLiveRequest(){
					 $.ajax( {
						url : 'keepLive.action',
						type : 'POST',
						dataType : "json"
					});
				}
				var random = function(min,max){
					return min + Math.round(Math.random()*(max-min)); 
				}; 
				
				var getTokenHandler_index = 0;
				function getToken(ocx,lErrorCode, szDetail, lWndId){
					$.ajax({
						type : "post",
						async : false,
						url : 'generatorTocken.action',
						dataType : "json",
						success : function(json) {
							if (json.token) {
								ocx.SetToken(lErrorCode, json.token);
							} else {
								jSticky('页面已过期，获取令牌失败', {
									type : "attention"
								});
							}
						}
					})
					
					// startRequest("generatorTocken.action","",ocx,lErrorCode);
// var randomNo = (getTokenHandler_index++)+"_"+random(1,100);
// $.ajax( {
// type : "get",
// async : false,
// url : tokenUrl,
// dataType : "jsonp",
// jsonp : "callbackparam",// 服务端用于接收callback调用的function名的参数
// jsonpCallback : "success_jsonpCallback"+randomNo,// callback的function名称
// success : function(json) {
// var res = $.parseJSON(json);
// if(res.ResultCode == 0)
// ocx.SetToken(lErrorCode,res.token);
// }
// });
				}
				
				function violation(ocx, lErrorCode, szDetail, lWndId){
// szDetail = '{"IndexCode":"112233","time":"2005-05-05T10:10:10"}';
					if(lErrorCode==52||lErrorCode=='52'){// 能源代码
						 settingPanel.openIoSwitch(win_status[lWndId].cameraName,win_status[lWndId].indexCode);
						 return;
					}
					if(ispcUrl==null){
						jAlert('请在服务管理中添加业务辅助平台');
						return;
					}
					var obj = $.parseJSON(szDetail);
					var time = new Date(parseInt(obj.Time+'000')).format('yyyy-M-d h:m:s');
					var url = ispcUrl+'/web/module/pad-police/showVoilationInfoRecordPage.action?' +
            		'cameraIndexCode='+ obj.IndexCode+
            		'&userId='+ userId+
            		'&happenTime=\''+ time+'\''+
            		'&roomIndexCode='+ win_status[lWndId].roomIndexCode;
					location.href = url;
// $.dialog({
// width : 800,
// height : 600,
// id : 'violation_iframe',
// title : '违规上报',
// iframeSrc : url
// });
// http://127.0.0.1:80/web/module/pad-police/showVoilationInfoRecordPage.action?cameraIndexCode=00000001005000000017
// &userId=1&happenTime='2010-10-10：10:10:10’&roomIndexCode=00000001005000000017

				}
				
				function msgHanler(ocx, lErrorCode, szDetail, lWndId){
					if (5 == lErrorCode) {// 打开声音
						for ( var i = 0; i < ocxInScreen; i++) {
							if(i == lWndId) continue;
							if ($('#preview_' + i).hikui())
								$('#preview_' + i).hikui().PlaySound(0);
						}
						recordLog(win_status[lWndId].cameraId,'open_sound',1);
					}else if(6 == lErrorCode || 53 == lErrorCode){
						if(szDetail == "MAIN"){
							recordLog(win_status[lWndId].cameraId,'main_stream',1);
						}else if(szDetail == "SUB"){
							recordLog(win_status[lWndId].cameraId,'sub_stream',1);
						}else if(szDetail == "SUB2"){//切换至第三码流
								recordLog(win_status[lWndId].cameraId,'third_stream',1);
						}
					}else if(7 == lErrorCode){
						win_status[lWndId]["3d"] = 0;
						if (lWndId == selectWindowIndex) {
							$('.ptz-btn-operation-3d').removeClass("selected");
						}
					}else if(10 == lErrorCode){// 开始紧急录像
						if(szDetail == '1')
							recordLog(win_status[lWndId].cameraId,'start_record',1);
					}else if(15 == lErrorCode){
						recordLog(win_status[lWndId].cameraId,'close_sound',1);
					}else if(109 == lErrorCode){
						recordLog(win_status[lWndId].cameraId,'adjust_sound,'+szDetail,1);
					}else if (19 == lErrorCode){
						uploadBreakdown(win_status[lWndId].indexCode);
					}else if(21 == lErrorCode){
						$('.yuyanTab').css('display','block');
						$('.monitor-container').css('padding-top', '30px');
						$('.yuyanTab').children()[0].innerHTML= win_status[lWndId].cameraName + " 鱼眼预览";
						win_status[lWndId].yuyan = true;
						// ocxPanel.setScreenStyle();
						if(!isSingle){
							originalSize = 0;
							leftMouseDblClick(ocx, lErrorCode, szDetail, lWndId);
						}else{
							isSingle = false;
							leftMouseDblClick(ocx, lErrorCode, szDetail, lWndId);
						}
						yuyanMode = true;
						
						$('.monitor-toolbar .act-save').css('display','block');
					}else if(24 == lErrorCode){
						if(szDetail == "true"){
							recordLog(win_status[lWndId].cameraId,'open_talk',1);
						}else if(szDetail == "false"){
							recordLog(win_status[lWndId].cameraId,'stop_talk',1);
						}
						
					}else if(10001 == lErrorCode){
						$('.monitor-toolbar .act-save').css('display','none');
						yuyanMode = true;
					}else if(22 == lErrorCode){
						if(szDetail == '1'){
							win_status[lWndId]&&(win_status[lWndId]["3d"] = 1);
							$('#controller .act-zoom3d').addClass('selected');
						}else{
							win_status[lWndId]&&(win_status[lWndId]["3d"] = 0);
							$('#controller .act-zoom3d').removeClass('selected');
						}
					}else if(lErrorCode==8){// 禁用
						win_status[lWndId].onVedioParam = 0;
						clearVideoParam(lWndId);
						clearLastWinStatus(lWndId); 
						clearPtzWinStatus(lWndId);
						$('.control-mask').show();
					}else if(lErrorCode==103){// 启用
						win_status[lWndId].onVedioParam = 1;
						initVideoParam(lWndId);
						initCurrentWinStatus(lWndId);
						$('.control-mask').hide();
					}
				}
				
				function startFishPreview(ocx, lErrorCode, szDetail, lWndId){
					if(!win_status[lWndId].fishIndexCode || win_status[lWndId].fishIndexCode == null){
						win_status[lWndId].fishIndexCode = win_status[lWndId].indexCode;
					}
					$.ajax( {
							url : 'getConfigFishXml.action',
							type : 'POST',
							data : {
		 						'indexCode' : win_status[lWndId].fishIndexCode
							},
							dataType : "json",
							success : function(result) {
								ocxPanel.setScreenStyle();
								if(result.msg != ''){
									ocx.SetFishEyeParam(result.msg);
									var xml = $($.parseXML(result.msg));
									var layout = xml.find('fisheye').attr('layout');
									var template = "square4";
									if(layout == 1){
										template = "square1";
									}else if(layout == 51){
										template = "square2";
									}else if(layout == 52){
										template = "prominent3";	
									}else if(layout == 3){
										template = 'square9';
									}
									// 更新btn-group的图标样式
//						            var classname = $('#gridsMode').attr('class').split(' '),
//						                str = 'act-grids-';
//						            $(classname).each(function(idx,item){
//						                if(item.indexOf(str) > -1) {
//						                    str = item;
//						                }
//						            });
//						            classname.splice($.inArray(str,classname),1);
//						            classname.push('act-grids-' + template);
//						            $('#gridsMode').attr('class',classname.join(' ')).attr('current-template', template);
									$('[data-trigger="monitor.grids"]').removeClass('selected');
            						$('[data-template="' + template + '"]').addClass('selected');
								}
								$('.yuyanTab').css('display','block');
								$('.monitor-container').css('padding-top', '30px');
								win_status[lWndId].yuyan = true;
								ocxPanel.isYuyan = true;
								if(win_status[lWndId] &&win_status[lWndId].installWay == 4){
									ocxPanel.isYuyan = true;
									ocxPanel.yuyanStyle = 4;
								}else{
									ocxPanel.isYuyan = true;
								}
								yuyanMode = true;
								$('.monitor-toolbar .act-save').css('display','block');
								$("#btn_close_all").addClass("disabled");//置灰全部关闭的按钮
							}
						})
				}
				
				function uploadBreakdown(indexCode) {
					settingPanel.uploadBreakdown(indexCode);
				}
				
				function getVideoParam(szDetail, lWndId){
					if(selectWindowIndex != lWndId){
						return;
					}
					var xml = $($.parseXML(szDetail));
					var bright = xml.find('Brightness').text();
					var light = xml.find('Contrast').text();
					var saturation = xml.find('Saturation').text();
					var tone = xml.find('Hue').text();
					
					setVideoParam('bright',bright);
					setVideoParam('light',light);
					setVideoParam('saturation',saturation);
					setVideoParam('tone',tone);
					
					sendValue['bright']= bright;
					paramValue['bright']= bright;
					
					sendValue['light']= light;
					paramValue['light']= light;
					
					sendValue['tone']= tone;
					paramValue['tone']= tone;
					
					sendValue['saturation']= saturation;
					paramValue['saturation']= saturation;
				}
				
				function get3DZoomArea(ocx,lErrorCode, szDetail, lWndId){
					if (!win_status[lWndId] || !win_status[lWndId].cameraId) {
						return;
					}
				 	var id = win_status[lWndId].cameraId;
					if (!id) {
						return;
					}
					 $.ajax( {
						url : 'send3DZoomCmd.action',
						type : 'POST',
						data : {
							id : id,
							area : szDetail
						},
						dataType : "json",
						success : function(result) {
							settingPanel.errorPtzOpMsg(result,'3D放大');
						}
					});
				}
				
				function startFocalZoom(ocx,lErrorCode, szDetail, lWndId){
					var op = 11;
					var speed = $('#speedVolume').slider('value');
					sendPtzCmd(op, 0, speed,selectWindowIndex);
				}
				function endFocalZoom(ocx,lErrorCode, szDetail, lWndId){
					var op = 11;
					var speed = $('#speedVolume').slider('value');
					sendPtzCmd(op, 1, speed,selectWindowIndex);
				}
				function startFocalNarrow(ocx,lErrorCode, szDetail, lWndId){
					var op = 12;
					var speed = $('#speedVolume').slider('value');
					sendPtzCmd(op, 0, speed,selectWindowIndex);
				}
				function endFocalNarrow(ocx,lErrorCode, szDetail, lWndId){
					var op = 12;
					var speed = $('#speedVolume').slider('value');
					sendPtzCmd(op, 1, speed,selectWindowIndex);
				}
				function startWestNorth(ocx,lErrorCode, szDetail, lWndId) {
					var op = 25;
					var action = 0;
					var speed = $('#speedVolume').slider('value');
					sendPtzCmd(op, action, speed,lWndId);
				}
				function endWestNorth(ocx,lErrorCode, szDetail, lWndId) {
					var op = 25;
					var action = 1;
					var speed = $('#speedVolume').slider('value');
					sendPtzCmd(op, action, speed,lWndId);
				}
				function startNorth(ocx,lErrorCode, szDetail, lWndId) {
					var op = 21;
					var action = 0;
					var speed = $('#speedVolume').slider('value');
					sendPtzCmd(op, action, speed,lWndId);
				}
				function endNorth(ocx,lErrorCode, szDetail, lWndId) {
					var op = 21;
					var action = 1;
					var speed = $('#speedVolume').slider('value');
					sendPtzCmd(op, action, speed,lWndId);
				}
				function startEastNorth(ocx,lErrorCode, szDetail, lWndId) {
					var op = 26;
					var action = 0;
					var speed = $('#speedVolume').slider('value');
					sendPtzCmd(op, action, speed,lWndId);
				}
				function endEastNorth(ocx,lErrorCode, szDetail, lWndId) {
					var op = 26;
					var action = 1;
					var speed = $('#speedVolume').slider('value');
					sendPtzCmd(op, action, speed,lWndId);
				}
				function startEast(ocx,lErrorCode, szDetail, lWndId) {
					var op = 24;
					var action = 0;
					var speed = $('#speedVolume').slider('value');
					sendPtzCmd(op, action, speed,lWndId);
				}
				function endEast(ocx,lErrorCode, szDetail, lWndId) {
					var op = 24;
					var action = 1;
					var speed = $('#speedVolume').slider('value');
					sendPtzCmd(op, action, speed,lWndId);
				}
				function startEastSouth(ocx,lErrorCode, szDetail, lWndId) {
					var op = 28;
					var action = 0;
					var speed = $('#speedVolume').slider('value');
					sendPtzCmd(op, action, speed,lWndId);
				}
				function endEastSouth(ocx,lErrorCode, szDetail, lWndId) {
					var op = 28;
					var action = 1;
					var speed = $('#speedVolume').slider('value');
					sendPtzCmd(op, action, speed,lWndId);
				}
				function startSouth(ocx,lErrorCode, szDetail, lWndId) {
					var op = 22;
					var action = 0;
					var speed = $('#speedVolume').slider('value');
					sendPtzCmd(op, action, speed,lWndId);
				}
				function endSouth(ocx,lErrorCode, szDetail, lWndId) {
					var op = 22;
					var action = 1;
					var speed = $('#speedVolume').slider('value');
					sendPtzCmd(op, action, speed,lWndId);
				}
				function startWestSouth(ocx,lErrorCode, szDetail, lWndId) {
					var op = 27;
					var action = 0;
					var speed = $('#speedVolume').slider('value');
					sendPtzCmd(op, action, speed,lWndId);
				}
				function endWestSouth(ocx,lErrorCode, szDetail, lWndId) {
					var op = 27;
					var action = 1;
					var speed = $('#speedVolume').slider('value');
					sendPtzCmd(op, action, speed,lWndId);
				}
				function startWest(ocx,lErrorCode, szDetail, lWndId) {
					var op = 23;
					var action = 0;
					var speed = $('#speedVolume').slider('value');
					sendPtzCmd(op, action, speed,lWndId);
				}
				function endWest(ocx,lErrorCode, szDetail, lWndId) {
					var op = 23;
					var action = 1;
					var speed = $('#speedVolume').slider('value');
					sendPtzCmd(op, action, speed,lWndId);
				}
				
				function leftMouseDown(ocx,lErrorCode, szDetail, lWndId) {
					$("#gridsMode").parent().removeClass("open");
				}

				function leftMouseUp(ocx,lErrorCode, szDetail, lWndId) {
					lWndId = parseInt(lWndId);
					setCameraSelected(lWndId);
					if(lWndId == selectWindowIndex){
						$('#ocx_container_' + selectWindowIndex).addClass('selected');
						if (win_status[selectWindowIndex] && win_status[selectWindowIndex].cameraId) {
							$('.control-mask').hide();
						}else{
							$('.control-mask').show();
						}
						return;
					}
					clearLastWinStatus(selectWindowIndex);
					clearVideoParam(lWndId);
					selectWindowIndex = lWndId;
					$('#ocx_container_' + selectWindowIndex).addClass('selected');
					initCurrentWinStatus(selectWindowIndex);
				}
				var isSingle = false;
				function leftMouseDblClick(ocx,lErrorCode, szDetail, lWndId) {
					var curTemplateName = $('.selected[data-trigger="monitor.grids"]').attr('data-template');
					if(isSingle){
						$('#grids').monitor({// 缩小
			                templateName:curTemplateName,
                            zoomin: false,
			                index: lWndId
		            	});
						isSingle = false;
						
						for(var i = 0; i<25;i++){
						if(i == lWndId) {
							var xmlArr = [];
							xmlArr.push('<?xml version="1.0" encoding="UTF-8" ?>');
							xmlArr.push('<Event>');
							xmlArr.push('<id>2</id>');
							xmlArr.push('</Event>');
							try{
								$('#preview_' + i).hikui().NotifyBSEvent(xmlArr.join(''));
							}catch(e){
							}
							continue;
						}
						if ($('#preview_' + i).hikui()){
							$('#preview_' + i).hikui().SetDecode(1);
							var xmlArr = [];
							xmlArr.push('<?xml version="1.0" encoding="UTF-8" ?>');
							xmlArr.push('<Event>');
							xmlArr.push('<id>2</id>');
							xmlArr.push('</Event>');
							try{
								$('#preview_' + i).hikui().NotifyBSEvent(xmlArr.join(''));
							}catch(e){
							}
						}
							
						}
					}else{
						$('#grids').monitor({// 放大
                            templateName:curTemplateName,
                            zoomin: true,
			                index: lWndId
			            });
						isSingle = true;
						for(var i = 0; i<25;i++){
						if(i == lWndId) {
							var xmlArr = [];
							xmlArr.push('<?xml version="1.0" encoding="UTF-8" ?>');
							xmlArr.push('<Event>');
							xmlArr.push('<id>1</id>');
							xmlArr.push('</Event>');
							try{
								$('#preview_' + i).hikui().NotifyBSEvent(xmlArr.join(''));
							}catch(e){
							}
							continue;
						}
						if ($('#preview_' + i).hikui()){
							$('#preview_' + i).hikui().SetDecode(0);
							var xmlArr = [];
							xmlArr.push('<?xml version="1.0" encoding="UTF-8" ?>');
							xmlArr.push('<Event>');
							xmlArr.push('<id>1</id>');
							xmlArr.push('</Event>');
							try{
								$('#preview_' + i).hikui().NotifyBSEvent(xmlArr.join(''));
							}catch(e){
							}
						}
						}
					}
				}

				function rightMouseDown(ocx,lErrorCode, szDetail, lWndId) {
				}

				function rightMouseUp(ocx,lErrorCode, szDetail, lWndId) {
				}

				function rightMouseDblClick(ocx,lErrorCode, szDetail, lWndId) {
				}

				function catchPicture(ocx,lErrorCode, szDetail, lWndId) {
					var action = 1;
					var fileName = "";
					$($.parseXML(szDetail)).find('Pic').each(function(i){
						var pfc = $(this).attr("id");
						var error = $(this).attr("err");
						if (error != 0) {
							var msg = $(this).attr("des");
							$.sticky( msg, {type: "error"});
							action = 0;
						}else {
							var file = $(this).text();
							var pos = file.lastIndexOf('\\');
							var filePath = file.substring(0, pos);
							fileName = file.substring(pos + 1, file.length + 1);
							if(win_status[lWndId]){
								settingPanel.type ='monitor';
								settingPanel.picture.capture(fileName,filePath,pfc,win_status[lWndId].indexCode,lWndId);
							}
						}
					});
					if (!win_status[lWndId]||!win_status[lWndId].cameraId) {
						return;
					}
					recordLog(win_status[lWndId].cameraId,'capture,'+fileName,action);
				}
				
				function record(ocx,lErrorCode, szDetail, lWndId) {
					var action = 1;
					if (lErrorCode != 0) {
						action = 0;
						if (10003 == lErrorCode) {
							var errorMsg = "您没有该操作的权限，请联系管理员。";
							jAlert(errorMsg, "错误", 'error');
						}
						else {
							$.sticky('窗口' + lWndId + ':' + szDetail, {
								type: "error"
							});
						}
					}
					else {
						/* $($.parseXML(szDetail)).find('Path').each(function(i){ */
						var file = szDetail;
						var pos = file.lastIndexOf('\\');
						var filePath = file.substring(0, pos);
						var fileName = file.substring(pos + 1, file.length + 1);
						settingPanel.type ='monitor';
						settingPanel.video.record(fileName, filePath, win_status[lWndId].indexCode,lWndId);
					/* }); */				
					}
					$('[data-trigger="monitor.record"]').removeClass('selected').attr('original-title','紧急录像');		
					
					if (!win_status[lWndId]||!win_status[lWndId].cameraId) {
						return;
					}
					recordLog(win_status[lWndId].cameraId,'record',action);
				}

				function startPreview(ocx,lErrorCode, szDetail, lWndId) {
					if (!win_status[lWndId]) {
						return;
					}
					if(yuyanMode){
						$('.yuyanTab').css('display','block');
						$('.monitor-container').css('padding-top', '30px');
						win_status[lWndId].yuyan = true;
						ocxPanel.isYuyan = true;
						if(win_status[lWndId] &&win_status[lWndId].installWay == 4){
							ocxPanel.isYuyan = true;
							ocxPanel.yuyanStyle = 4;
						}else{
							ocxPanel.isYuyan = true;
						}
						ocxPanel.setScreenStyle();
						if(!isSingle){
							originalSize = 0;
							leftMouseDblClick(ocx, lErrorCode, szDetail, lWndId);
						}else{// 原来是小窗口，因为鱼眼预览而放大了
							isSingle = false;
							leftMouseDblClick(ocx, lErrorCode, szDetail, lWndId);
						}
						yuyanMode = true;
						addPlayingStatus(win_status[lWndId].fishCameraId);
						addPlayingStatusInFav(win_status[lWndId].fishCameraId);
						$('.monitor-toolbar .act-save').css('display','block');
						if (!win_status[lWndId]) {
							return;
						}
						recordLog(win_status[lWndId].cameraId,'start_play',1);
						return;
					}
					if (selectWindowIndex == lWndId) {
						$('.control-mask').hide();
					}
					if(win_status[lWndId].indexCode == szDetail){
						win_status[lWndId].start = 1;
						// win_status[lWndId].oldCamera = null;
						initVideoParam(lWndId);
						addPlayingStatus(win_status[lWndId].cameraId);
						addPlayingStatusInFav(win_status[lWndId].cameraId);
					
						if (!win_status[lWndId]) {
							return;
						}
						recordLog(win_status[lWndId].cameraId,'start_play',1);
					}
					ocx.isCStartPlay = true;
					startPlayIndexObj.add(lWndId);
				}

				var startPlayIndexObj = (function(){
					var i=0;
					return {
						add:function(lWndId){
							i++;
							$('#monitor-toolbar [ddtype="monitor"]').removeClass('unable');
						},
						remove:function(lWndId){
							i--;
							if(i==0){
								$('#monitor-toolbar [ddtype="monitor"]').addClass('unable');
								$('#btn_close_all').removeClass('unable');
							}
						}
					}
				}());
				
				
				function stopPreview(ocx,lErrorCode, szDetail, lWndId) {
					 if(!win_status[lWndId]){
						 return;
					 }
					 if(win_status[lWndId].yuyan){
						if(szDetail != win_status[lWndId].fishIndexCode)
							return;
						$('.yuyanTab').css('display','none');
						$('.monitor-container').css('padding-top', '0');
						win_status[lWndId].yuyan = false;
						ocxPanel.isYuyan = false;
						ocxPanel.setScreenStyle();
						// yuyanMode = false;
						$('.monitor-toolbar .act-save').css('display','none');
						if((win_status[lWndId] && win_status[lWndId].indexCode == undefined)){
							if (!isOtherWindowPlaying(lWndId, win_status[lWndId].fishCameraId)){
								clearPlayStatus(win_status[lWndId].fishCameraId);
								clearPlayStatusInFav(win_status[lWndId].fishCameraId);
							}
							win_status[lWndId].cameraId = null;
							win_status[lWndId].fishCameraId = null;
							// win_status[lWndId] == null;
							win_status[lWndId].start == null;
						}
						if(win_status[lWndId] && win_status[lWndId].indexCode != win_status[lWndId].fishIndexCode){
							if (!isOtherWindowPlaying(lWndId, win_status[lWndId].fishCameraId)){
								clearPlayStatus(win_status[lWndId].fishCameraId);
								clearPlayStatusInFav(win_status[lWndId].fishCameraId);
							}
							win_status[lWndId].fishCameraId = null;
						}
						win_status[lWndId].fishIndexCode = null;
						return;
					 }
					recordLog(win_status[lWndId].cameraId,'stop_play',1);
					// win_status[lWndId].start -1表示窗口空闲 1-表示正在播放 2-表示正在取流
					// 3-表示正在后台查询播放地址
					if (win_status[lWndId].oldCamera && win_status[lWndId].cameraId != win_status[lWndId].oldCamera &&
						win_status[lWndId].start && (win_status[lWndId].start == 2 || win_status[lWndId].start == 3)) {// 如果一个窗口被覆盖播放，且不是同一个监控点
						if (!isOtherWindowPlaying(lWndId, win_status[lWndId].oldCamera)) {
							clearPlayStatus(win_status[lWndId].oldCamera);
							clearPlayStatusInFav(win_status[lWndId].oldCamera);
							if (win_status[lWndId]) {
								if(win_status[lWndId].oldCameraNum==null)
									win_status[lWndId].oldCamera = null;
								else if(win_status[lWndId].oldCameraNum<2){
									win_status[lWndId].oldCameraNum = null;
									win_status[lWndId].oldCamera = null;
								}else{
									win_status[lWndId].oldCameraNum--;
								}
							}
						}
					} else if(win_status[lWndId].oldCamera && win_status[lWndId].cameraId == win_status[lWndId].oldCamera){// 如果一个窗口被覆盖播放，且是同一个监控点
						clearPlayStatus(win_status[lWndId].oldCamera);
						clearPlayStatusInFav(win_status[lWndId].oldCamera);
						win_status[lWndId].oldCamera = null;
						return;
					}else{
						if (win_status[lWndId].start) {
							if (!isOtherWindowPlaying(lWndId, win_status[lWndId].cameraId)) {
								clearPlayStatus(win_status[lWndId].cameraId);
								clearPlayStatusInFav(win_status[lWndId].cameraId);
							}
							win_status[lWndId] = null;
							if (lWndId == selectWindowIndex) {
								clearLastWinStatus(lWndId);
								clearVideoParam(lWndId);
							}
						}
					}
					ocx.removeIndexCodeMap(lWndId);
					ocx.isCStartPlay = false;
					startPlayIndexObj.remove(lWndId);
				}
				
				function talkHandler(ocx,lErrorCode, szDetail, lWndId){
					if(lErrorCode == -1){
						$.sticky(szDetail,{type:"error"});
						recordLog(win_status[lWndId].cameraId,'talk_fail',1);
					}
				}
				
				function isOtherWindowPlaying(lWndId,cameraId){
					for(var i = 0; i < ocxInScreen;i++){
						if(i == lWndId) continue;
						if(win_status[i] && cameraId == win_status[i].cameraId){
							return true;
						}
					}
					return false;
				}
				
				function initComlete(ocx,lErrorCode, szDetail, lWndId) {
					init_win_index = lWndId;
					ocx.SetWindowId(lWndId);
					ocx.SetEncrypt(noMeaning);
					if (win_status[lWndId]&& win_status[lWndId].playurl) {
						win_status[selectWindowIndex].start = 2;
						ocx.addIndexCodeMap(lWndId,win_status[lWndId].playurl,win_status[lWndId].indexCode);
						ocx.StartPreviewEx(win_status[lWndId].playurl);
						if(win_status[lWndId].vagIpForClient)
							ocx.SetVagServerInfo(win_status[lWndId].vagIpForClient,win_status[lWndId].vagPortForClient);
						ocx.SetRightCode(win_status[lWndId].privilegeCode);
						win_status[lWndId].playurl = null;
						win_status[lWndId].privilegeCode = null;
						
					}
					
					if (win_status[lWndId]&& win_status[lWndId].openFolder) {
						var res = ocx.OpenFolder(win_status[lWndId].openFolder);
						if(res==-1||res=='-1'){
		    				jAlert('打开目录失败','提示','attention');
						}
						win_status[lWndId].openFolder = null;
					}
					
					if (win_status[lWndId]&& win_status[lWndId].openPic) {
						var res = ocx.OpenFile(win_status[lWndId].openPic,null,win_status[lWndId].openMode);
						if(res==-1||res=='-1'){
		    				jAlert('打开文件失败','提示','attention');
						}
						win_status[lWndId].openPic = null;
					}
					ocx.lWndId = lWndId;
					ocx.get_win_status = function(){
						return win_status[this.lWndId]||{};
					}
					ocxPanel.ocx.setRecordParam(ocx);
					ocxPanel.ocx.setToolbar(ocx);
					ocxPanel.ocx.setCaptureParam(ocx);
					ocxPanel.ocx.setPerCfgInfo(ocx);
				}
				
				function recordLog(id,logInfo,action){
					$.ajax( {
						url : 'logOperate.action',
						type : 'POST',
						data : {
				 			id : id,
							logInfo:logInfo,
							action:action
						}
					});
				}
				
				var sendParamTimer;
				var sendValue = {'bright':1,'light':1,'tone':1,'saturation':1};
				var paramValue={'bright':1,'light':1,'tone':1,'saturation':1};

				function sendParamCmd(){
					var needSend = 0;
					var toSend = {'bright':-1,'light':-1,'tone':-1,'saturation':-1};
					if(sendValue['bright'] != paramValue['bright']){
						toSend['bright'] = paramValue['bright'];
						sendValue['bright'] = paramValue['bright']; 
						needSend = 1;
					}
					if(sendValue['light'] != paramValue['light']){
						toSend['light'] = paramValue['light'];
						sendValue['light'] = paramValue['light'];  
						needSend = 1;
					}
					if(sendValue['tone'] != paramValue['tone']){
						toSend['tone'] = paramValue['tone'];
						sendValue['tone'] = paramValue['tone'];  
						needSend = 1;
					}
					if(sendValue['saturation'] != paramValue['saturation']){
						toSend['saturation'] = paramValue['saturation'];
						sendValue['saturation'] = paramValue['saturation'];  
						needSend = 1;
					}
					
					if(needSend == 0){
						clearInterval(sendParamTimer);
						sendParamTimer = null;
					}else{
						sendParamCmd0(sendValue['bright'],sendValue['light'],sendValue['tone'],sendValue['saturation']);
					}
				}
				
				// 点击窗口的时候，如果有监控点正在预览，则初始化状态信息
				function initCurrentWinStatus(lWndId){
					$('#call-preset-input').val("");

					if (win_status[lWndId] && win_status[lWndId].cameraId) {
						if(win_status[lWndId].onVedioParam === 0){
							return;
						}
						$('.control-mask').hide();
						findPresetInfo(win_status[lWndId].cameraId,lWndId,win_status[lWndId].indexCode);

						if(win_status[lWndId]["lock"] == 1){
							$('.ptz-btn-operation-lock').addClass("selected");
							$('.ptz-btn-operation-lock > a').attr('original-title',"解锁");
						}
						if(win_status[lWndId]["3d"] == 1){
							$('.ptz-btn-operation-3d').addClass("selected");
							$('.ptz-btn-operation-auto').addClass("disabled");
						}else{
							if(win_status[lWndId]["29"] == 1){
								$('.ptz-btn-operation-auto').addClass("selected");
							}
						}
						if(win_status[lWndId]["light"] == 1){
							$('.ptz-btn-operation-light').addClass("selected");
						}
						if(win_status[lWndId]["brush"] == 1){
							$('.ptz-btn-operation-brush').addClass("selected");
						}
						if(win_status[lWndId].isCas == 1){
							$("#btn-open-preset-dialog").addClass("disabled");
						}else{
							$("#btn-open-preset-dialog").removeClass("disabled");
						}
						// TODO:这里需要初始化选中页面的视频参数
						if(win_status[lWndId].start == 1)
							initVideoParam(lWndId);
					}
					
				}
				
				function setCameraSelected(lWndId){
					if (win_status[lWndId] && win_status[lWndId].cameraId) {
						var treea = $("#zTreea").tree();
						if(!treea) return;
						var node = treea.getNodeById("camera-" + win_status[lWndId].cameraId);
						if(node){
							treea.selectNode(node,false);
						}
						
						var treeb = $("#zTreeb").tree();
						if(!treeb) return;
						var nodeb = treeb.getNodeById("camera-" + win_status[lWndId].cameraId);
						if(!nodeb){
							return;
						}
						treeb.selectNode(nodeb,false);
					}
				}

				function clearLastWinStatus(windex){
					// 清除之前窗口的选中状态
					$('#ocx_container_' + windex).removeClass('selected');
					
					// 清除云镜状态
					$('.ptz-btn-operation-auto').removeClass("selected");
					$('.ptz-btn-operation-lock').removeClass("selected");
					$('.ptz-btn-operation-lock > a').attr('original-title',"锁定");
					$('.ptz-btn-operation-3d').removeClass("selected");
					$('.ptz-btn-operation-light').removeClass("selected");
					$('.ptz-btn-operation-brush').removeClass("selected");
						
					
					// 清除预置点
					// clearPresetInfo();
				}
				
				function clearPtzWinStatus(windex){
					// 清除云镜状态
					$('.ptz-btn-operation-auto').removeClass("selected");
					$('.ptz-btn-operation-lock').removeClass("selected");
					$('.ptz-btn-operation-lock > a').attr('original-title',"锁定");
					$('.ptz-btn-operation-3d').removeClass("selected");
					$('.ptz-btn-operation-light').removeClass("selected");
					$('.ptz-btn-operation-brush').removeClass("selected");
					// 清除预置点
					// clearPresetInfo();
				}

				function init_win(index) {
					if ($('#preview_' + index).hikui()) {
						return;
					}
					(function() {
						hik($('#preview_' + index)).ocx_preview({
											index : index,
											msgEl : $('#grids_div'),
											codebase : codebase,
											getOcxUrl : function(){
												return "/web/softs/HIKOCX.CAB";
											},
											getCameraIdByWinId:function(lWndId){
												return win_status[lWndId]&&win_status[lWndId].cameraId;
											},
											listeners : {
												'create' : function(t) {
												},
												'MsgNotify' : function(lMsgId,lErrorCode, szDetail,lWndId) {
													try {
														messageMap[lMsgId] && messageMap[lMsgId](this,lErrorCode,szDetail,index);
													} catch (e) {
														$.sticky('操作出现异常',{type:"error"});
													}
												},
												log:function(lWndId,logInfo,action){
													recordLog(win_status[lWndId].cameraId,logInfo,action)
												},
												logByCameraId:function(cameraId,logInfo,action){
													recordLog(cameraId,logInfo,action)
												}
											}
										});
					}())
				}


				$('#btn_close_all').click(function() {
					if(yuyanMode)
						return;
					for ( var i = 0; i < ocxInScreen; i++) {
						if(win_status[i]){
							clearPtzWinStatus(i);
							clearVideoParam(i);
							clearPlayStatus(win_status[i].cameraId);
							clearPlayStatusInFav(win_status[i].cameraId);
						}
						if ($('#preview_' + i).hikui())
							$('#preview_' + i).hikui().StopPreview();
					}
					
					//$('#btn_close_all').addClass('unable');
				});

				function findNextFreeWin(start,count){
					var begin = start;
					if(start == count) begin = 0;
					for(var i=begin;i<count;i++ ){
						if(win_status[i] && win_status[i].start){
							continue;
						}else{
							return i;
						}
					}
					if(begin > 0){
						for(var i = 0; i< begin; i++){
							if(win_status[i] && win_status[i].start){
								continue;
							}else{
								return i;
							}
						}
					}
					
					return start - 1;
				}
				
				playYuyanCamera = function(cameraId,name,intelCode,intelChannelNo,lWndId,cameraIndexCode){
					var oldCamera = null;
					if(cameraId!=win_status[lWndId].oldCamera)
						win_status[lWndId].oldCameraNum=null;
					else
						oldCamera = cameraId;
					$.ajax( {
						url : 'findPlayUrl.action',
						type : 'POST',
						data : {
							indexCode:cameraIndexCode,
							id : cameraId,
							intelCode : intelCode,
							intelChannelNo : intelChannelNo
						},
						dataType : "json",
						success : function(result) {
							if (result.success && result.playInfo) {
								if(result.playInfo.playUrl == 'nopag'){
									jAlert('没有可用的设备接入网关，请联系管理员。','警告','attention');
									return;
								}
								if(!win_status[lWndId]){
									return;
								}
								yuyanMode = true;
								win_status[lWndId].playType = result.playInfo.playType;
								win_status[lWndId].substream = result.playInfo.substream;
								win_status[lWndId].installWay = result.playInfo.installWay;
								win_status[lWndId].fishIndexCode = result.playInfo.indexCode;
								win_status[lWndId].fishCameraId = cameraId;
								win_status[lWndId].roomIndexCode = result.playInfo.orgIndexCode;
								win_status[lWndId].cameraName = result.playInfo.name;
								win_status[lWndId].vagIpForClient = result.playInfo.vagIpForClient;
								win_status[lWndId].vagPortForClient = result.playInfo.vagPortForClient;
								win_status[lWndId].yuyan = true;
								if(win_status[lWndId] &&win_status[lWndId].installWay == 4){
									ocxPanel.isYuyan = true;
									ocxPanel.yuyanStyle = 4;
								}else{
									ocxPanel.isYuyan = true;
								}
								var playurl = result.playInfo.playUrl;
								var privilegeCode = result.privilegeCode;
								var ocx = $('#preview_' + lWndId).hikui();
								if(oldCamera)
									win_status[lWndId].oldCamera = oldCamera;
								if(win_status[lWndId].oldCamera == cameraId){
									if(win_status[lWndId].oldCameraNum==null)
										win_status[lWndId].oldCameraNum=1;
									else
										win_status[lWndId].oldCameraNum++;
								}
								if (ocx) {
									ocx.SetRightCode(privilegeCode);
									ocx.EnterFishEye();
									ocx.StartPreviewEx(playurl);
									if(result.playInfo.vagIpForClient)
										ocx.SetVagServerInfo(result.playInfo.vagIpForClient,result.playInfo.vagPortForClient);
									ocx.addIndexCodeMap(lWndId,win_status[lWndId].playurl,win_status[lWndId].indexCode);
									$('.yuyanTab').children()[0].innerHTML= result.playInfo.name + " 鱼眼预览";
								}
								$('.control-mask').hide();
							} else {
								$.sticky('获取播放URL失败',{type:"error"});
							}
						}
					});
				}
				
				playCamera = function (cameraId,name,intelCode,intelChannelNo,cameraIndexCode,ezvizCameraCode) {
					var playType = $.commonCookie("ocx-setting-replay-type");
					if(yuyanMode){
						var yuyanWin = 0;
						for(var i = 0; i<25;i++){
							if(win_status[i] && win_status[i].yuyan){
								yuyanWin = i;
								break;
							}
						}
						if(win_status[yuyanWin] && win_status[yuyanWin].indexCode == undefined){
							clearPlayStatus(win_status[yuyanWin].fishCameraId);
							clearPlayStatusInFav(win_status[yuyanWin].fishCameraId);
						}else if(win_status[yuyanWin] && win_status[yuyanWin].indexCode != win_status[yuyanWin].fishIndexCode){
							clearPlayStatus(win_status[yuyanWin].fishCameraId);
							clearPlayStatusInFav(win_status[yuyanWin].fishCameraId);
						}
						if(!init_flag[yuyanWin]){// 判断窗口是否初始化
							init_flag[yuyanWin] = 1
							init_win(yuyanWin);
							
						}

						clearLastWinStatus(yuyanWin);
						clearVideoParam(yuyanWin);
						initCurrentWinStatus(yuyanWin);
				
						$('#ocx_container_' + yuyanWin).removeClass('selected');
						var ocxCountNow = $('.window-bar a.selected').attr("data-quantity");
				
						var oldCamera = null;
						if(win_status[yuyanWin] && win_status[yuyanWin].cameraId){
							oldCamera = win_status[yuyanWin].cameraId;
						}
						win_status[yuyanWin] = {};
						win_status[yuyanWin].start = 3;
						if(oldCamera){
							win_status[yuyanWin].oldCamera = oldCamera;
							win_status[yuyanWin].cameraId = oldCamera;
						}else{
							win_status[yuyanWin].cameraId = cameraId;
						}
						selectWindowIndex = findNextFreeWin(yuyanWin + 1,ocxCountNow);
						$('#ocx_container_' + selectWindowIndex).addClass('selected');
						playYuyanCamera(cameraId,name,intelCode,intelChannelNo,yuyanWin,cameraIndexCode);
						return;
					}
					var lWndId = selectWindowIndex;
					init_flag[lWndId] = 1
					init_win(lWndId);
					clearLastWinStatus(lWndId);
					clearVideoParam(lWndId);
					initCurrentWinStatus(lWndId);
					
					$('#ocx_container_' + lWndId).removeClass('selected');
					var ocxCountNow = $('.window-bar a.selected').attr("data-quantity");
					lWndId = parseInt(lWndId);
					
					var oldCamera = null;
					if(win_status[lWndId] && win_status[lWndId].cameraId){
						oldCamera = win_status[lWndId].cameraId;
					}
					win_status[lWndId] = {};
					win_status[lWndId].start = 3;
					var setoldCameraNumNull = true;
					if(oldCamera){
						// alert("playCamera")
						win_status[lWndId].oldCamera = oldCamera;
						win_status[lWndId].cameraId = oldCamera;
						if(oldCamera==cameraId){
							setoldCameraNumNull = false;
						}
					}else{
						win_status[lWndId].cameraId = cameraId;
					}
					if(setoldCameraNumNull)
						win_status[lWndId].oldCameraNum=null;
					selectWindowIndex = findNextFreeWin(lWndId + 1,ocxCountNow);
					$('#ocx_container_' + selectWindowIndex).addClass('selected');
					$.ajax( {
						url : 'findPlayUrl.action',
						type : 'POST',
						data : {
							indexCode:cameraIndexCode,
							id : cameraId,
							intelCode : intelCode,
							intelChannelNo : intelChannelNo
						},
						dataType : "json",
						success : function(result) {
							if (result.success && result.playInfo) {
								if(result.playInfo.playUrl == 'nopag'){
									if(win_status[lWndId] && win_status[lWndId].oldCamera && win_status[lWndId].oldCamera != cameraId){
									}else{
										win_status[lWndId] = null;
										}
									jAlert('没有可用的设备接入网关，请联系管理员。','警告','attention');
									return;
								}
								var playurl = result.playInfo.playUrl;
								var indexCode = result.playInfo.indexCode;
								var privilegeCode = result.privilegeCode;
								if(!win_status[lWndId]){
									return;
								}
								if(playurl.indexOf("CascCode") >= 0){
									win_status[lWndId].isCas = 1;
								}
								win_status[lWndId].playType = result.playInfo.playType;
								win_status[lWndId].substream = result.playInfo.substream;
								win_status[lWndId].cameraId = cameraId;
								win_status[lWndId].indexCode = indexCode;
								win_status[lWndId].roomIndexCode = result.playInfo.orgIndexCode;
								win_status[lWndId].cameraName = result.playInfo.name;
								win_status[lWndId].vagIpForClient = result.playInfo.vagIpForClient;
								win_status[lWndId].vagPortForClient = result.playInfo.vagPortForClient;
								win_status[lWndId].installWay = result.playInfo.installWay;
								if(oldCamera)
									win_status[lWndId].oldCamera = oldCamera;
								if(win_status[lWndId].oldCamera == cameraId){
									if(win_status[lWndId].oldCameraNum==null)
										win_status[lWndId].oldCameraNum=1;
									else
										win_status[lWndId].oldCameraNum++;
								}
								if ($('#preview_' + lWndId).hikui()) {
									win_status[lWndId].start = 2;
									var ocx = $('#preview_' + lWndId).hikui();
									ocxPanel.ocx.setPerCfgInfo(ocx);
									ocx.SetRightCode(privilegeCode);
									ocx.StartPreviewEx(playurl);
									if(result.playInfo.vagIpForClient)
										ocx.SetVagServerInfo(result.playInfo.vagIpForClient,result.playInfo.vagPortForClient);
									ocx.addIndexCodeMap(lWndId,playurl,indexCode);
								} else {
									win_status[lWndId].playurl = playurl;
									win_status[lWndId].privilegeCode = privilegeCode;
								}
								
								if(selectWindowIndex != lWndId) return;
								if (win_status[selectWindowIndex] && win_status[selectWindowIndex].cameraId) {
									$('.control-mask').hide();
								}else{
									$('.control-mask').show();
								}
							} else {
								win_status[lWndId] = null;
								$.sticky('获取播放URL失败',{type:"error"});
							}
						}
					});
				}
				
				if (playId) {
						playCamera(playId,"","");
					}
				
				// 树节点加载成功后，添加已经播放的节点状态
				ztreeOnLoadSuccess = function (data){
					var treea = $("#zTreea").tree()
					if (!treea) {
						return;
					}
					for ( var i = 0; i < ocxInScreen; i++){
						if(win_status[i] && win_status[i].start){
							addPlayingStatus( win_status[i].cameraId);
							addPlayingStatusInFav(win_status[i].cameraId);
						}
					}
					setCameraSelected(selectWindowIndex);
				}
				
				function addPlayingStatus(cameraId){
					var treea = $("#zTreea").tree();
					if(!treea){
						return;
					}
					var node = treea.getNodeById("camera-" + cameraId);
					if(!node){
						return;
					}
					if(node.cls.indexOf("-playing") >= 0){
						
					}else{
						node.cls = node.cls + "-playing";
						treea.updateNode(node);
					}
				}
				
				function addPlayingStatusInFav(cameraId){
					var treeb = $("#zTreeb").tree();
					if(!treeb){
						return;
					}
					var node = treeb.getNodeById("camera-" + cameraId);
					if(!node){
						return;
					}
					if(node.cls.indexOf("-playing") >= 0){
						
					}else{
						node.cls = node.cls + "-playing";
						treeb.updateNode(node);
					}
				}

				function clearPlayStatus(cameraId){
					var treea = $("#zTreea").tree();
					var node = treea.getNodeById("camera-" + cameraId);
					if(!node){
						return;
					}
					if(node.cls.indexOf("-playing") > 0){
						node.cls = node.cls.replace("-playing","");
						treea.updateNode(node);
					}
				}
				
				function clearPlayStatusInFav(cameraId){
					var treeb = $("#zTreeb").tree();
					var node = treeb.getNodeById("camera-" + cameraId);
					if(!node){
						return;
					}
					if(node.cls.indexOf("-playing") > 0){
						node.cls = node.cls.replace("-playing","");
						treeb.updateNode(node);
					}
				}
				// =================预置点相关的操作。========================================
                $("#call-preset-input").bind('change keydown',function(){
                    $(this).attr('original-title',$(this).val());
                });
                
                 $("#call-preset-input").bind('change keyup',function(){
                	if(!isNaN($(".point-number").val()) && $(".point-number").val() < 1){
                     	$('#call-preset-input').val("1");
                     	$('#call-preset-input').blur();
                     	$("#btn-call-preset").removeClass("disabled");
                    }else if(!isNaN($(".point-number").val()) && $(".point-number").val() > 255){
                    	$('#call-preset-input').val("255");
                    	$('#call-preset-input').blur();
                    	$("#btn-call-preset").removeClass("disabled");
                    }else if(isNaN($(".point-number").val())){
						if (presetInfo[$(".point-number").val()]
							&& presetInfo[$(".point-number").val()] > 0
							&& presetInfo[$(".point-number").val()] < 256) {
							presetIndex = presetInfo[$(".point-number").val()];
							$("#btn-call-preset").removeClass("disabled");
						}else{
							$("#btn-call-preset").addClass("disabled");
						}
					}else if(!isNaN($(".point-number").val())){
						var ex = /^\d+$/;
						if (ex.test($(".point-number").val().replace(/(^\s*)|(\s*$)/g, ""))){// 表示整数
							$("#btn-call-preset").removeClass("disabled");
						}else{// 非整数
							if (presetInfo[$(".point-number").val()]
							&& presetInfo[$(".point-number").val()] > 0
							&& presetInfo[$(".point-number").val()] < 256) {
								presetIndex = presetInfo[$(".point-number").val()];
								$("#btn-call-preset").removeClass("disabled");
							}else{
								$("#btn-call-preset").addClass("disabled");
							}
						}
					}else{
						$("#btn-call-preset").addClass("disabled");
					}
                });
				
                $("#call-preset-input").bind('change',function(){
					var presetIndex = findInputPreset($(".point-number"));
					if (presetIndex == 0) {
						$('#call-preset-input').val("");
						$("#btn-call-preset").addClass("disabled");
						$("#btn-open-preset-dialog").addClass("disabled");
					}else{
						$("#btn-call-preset").removeClass("disabled");
						if(!win_status[selectWindowIndex].isCas == 1){
							$("#btn-open-preset-dialog").removeClass("disabled");
						}
					}
                });
				var presetInfo = {};
				var presetIds = {};
				$("#btn-call-preset").click(function() {
					if($(this).hasClass("disabled")){
						return;
					}
					var presetIndex = findInputPreset($(".point-number"));
					if (presetIndex == 0) {
						 $.sticky('调用的预置点不存在。',{type:"error"});
						 return;
					}
					callPreset(presetIndex);
				});
				
				function callPreset(presetIndex) {
					if (!win_status[selectWindowIndex]) {
						return;
					}
					var id = win_status[selectWindowIndex].cameraId;
					if (!id) {
						return;
					}
					$.ajax( {
						url : 'callPreset.action',
						type : 'POST',
						data : {
							id : id,
							preset : presetIndex
						},
						dataType : "json",
						success : function(result) {
							settingPanel.errorPtzOpMsg(result,'预置点');
						}
					});
				}

				function clearPresetInfo() {
					var presetContainer = $(".preset-container");
					presetContainer.html("");
				}

				function findInputPreset(presetInput){
					var presetValue = presetInput.val();
					var presetIndex = 0;
					var ex = /^\d+$/;
					if (ex.test(presetValue.replace(/(^\s*)|(\s*$)/g, ""))) {
						if(presetValue > 0 && presetValue < 256){
							if(presetValue.toString().indexOf(".") > -1){
								for(var i = 1 ; i < 256 ; i++){
									if(!presetIds[i]){
										presetIndex = i;
										break;
									}
								}
							}else
								presetIndex = Math.floor(presetValue);
							$("#call-preset-input").val(presetIndex);
						}else{
							$("#call-preset-input").val("255");
							presetIndex = 255;
						}
					}else{
						if (presetIndex == 0 && presetInfo[presetValue]
							&& presetInfo[presetValue] > 0
							&& presetInfo[presetValue] < 256) {
							presetIndex = presetInfo[presetValue];
						}else{
							for(var i = 1 ; i < 256 ; i++){
								if(!presetIds[i]){
									presetIndex = i;
									break;
								}
							}
							$("#call-preset-input").val(presetIndex);
						}
					}
					return presetIndex;
					
				}
				
				
				var presetContainer = $(".preset-container");
				var presetContainerName = $(".preset-container-name");
				function findPresetInfo(cameraId,lWndId,cameraIndexCode) {
					presetContainer.html("");
					presetContainerName.html("");
					$('#call-preset-input').val("输入编号或名称");
					$("#btn-call-preset").addClass("disabled");
					// $("#btn-open-preset-dialog").addClass("disabled");
					if(lWndId != selectWindowIndex){
						return;
					}
					$.ajax( {
						url : 'findPresetInfo.action',
						type : 'POST',
						data : {
							id : cameraId,
							indexCode : cameraIndexCode
						},
						dataType : "json",
						success : function(result) {
							if(lWndId != selectWindowIndex){
								return;
							}
							if (result.success && result.presetInfos) {
								// clearPresetInfo();
								var temp = [];
								var tempName = [];
								for ( var i = 0; i < result.presetInfos.length; i++) {
									var preset = result.presetInfos[i];
									presetInfo[preset.name] = preset.number;
									var name = preset.name.replace(/&/g,'&amp;');
									presetIds[preset.number] = name;
									temp.push(' <li data-number="'+ preset.number+ '"><a href="#">'+ preset.number + '</a></li>');
									tempName.push(' <li data-number="'+ preset.number+ '"><a href="#">'+ name + '</a></li>');
								}
								presetContainer.html(temp.join(''));
								presetContainerName.html(tempName.join(''));
							}
						}
					});

				}
				
				 /* 设置巡航路径 */
				
				$("#set-preset-input").bind('keyup',function(){
					var presetValue = $(this).val();
					if($.isNumeric(presetValue)){
						presetValue = parseInt(presetValue);
						if(presetValue < 1 ){
							$('#set-preset-input').val(1);
							$('#set-preset-name-input').val("新预置点1");
						}else if(presetValue > 255){
							$('#set-preset-input').val(255);
							$('#set-preset-name-input').val("新预置点255");
						}else{
							var nameLi = $('.preset-container li[data-number="' + presetValue + '"] a');
							if (nameLi && nameLi.length > 0) {
								$('#set-preset-name-input').val(presetIds[nameLi.html()]);
							}else{
								$('#set-preset-input').val(parseInt(presetValue));
								$('#set-preset-name-input').val("新预置点" + presetValue);
							}
						}
					}
				});
				$("#set-preset-name-input").bind('change',function(){
					this.value = $.trim(this.value);
				});
				$('#set-preset-input').change(function(){
					var presetValue = $(this).val();
					if($.isNumeric(presetValue)){
						presetValue = parseInt(presetValue);
						if(presetValue < 1 ){
							$('#set-preset-input').val(1);
							$('#set-preset-name-input').val("新预置点1");
						}else if(presetValue > 255){
							$('#set-preset-input').val(255);
							$('#set-preset-name-input').val("新预置点255");
							return;
						}
						var nameLi = $(".preset-container").find('li[data-number="' + presetValue + '"] a');
						if (nameLi && nameLi.length > 0) {
							$('#set-preset-name-input').val(presetIds[nameLi.html()]);
						}else{
							$('#set-preset-input').val(parseInt(presetValue));
							$('#set-preset-name-input').val("新预置点" + presetValue);
						}	
					}else{
						if(presetValue==null||$.trim(presetValue)==''){
							$.sticky('要设置的预置点不能为空，请重新输入。', {type : "error"});
						}else if(!presetInfo[presetValue]){
							$.sticky('要设置的预置点不存在，请重新输入。', {type : "error"});
						}else{
							$('#set-preset-name-input').val(presetValue);	
							$(this).val(presetInfo[presetValue]);
						}
					}
				});
				
	            $('[data-trigger="controler.setPoint"]').click(function () {
					if($(this).hasClass("disabled")){
						return;
					}
					if (!win_status[selectWindowIndex]) {
						return;
					}
					var id = win_status[selectWindowIndex].cameraId;
					if (!id) {
						return;
					}
					$("#set-preset-name-input").clearValidate();
					var selectPresetNo = findInputPreset($(".point-number"));
					if (selectPresetNo == 0) {
						$('#set-preset-input').val("");
						$('#set-preset-name-input').val("");
					}else{
						$('#set-preset-input').val(selectPresetNo);
						var nameLi = $('.preset-container li[data-number="' + selectPresetNo + '"] a');
						if (nameLi && nameLi.length > 0) {
							$('#set-preset-name-input').val(presetIds[nameLi.html()]);
						}else{
							$('#set-preset-name-input').val("新预置点" + selectPresetNo);
						}
					}
					
	                // Dialog of adding to favorite
	                $('#flagDialog').dialog({
	                    autoOpen: false,
	                    modal: false,
	                    width: 300,
	                    height: 350,
	                    buttons: {
	                        "ok": {
	                            text: '保存',
	                            'class': 'bPrimary',
	                            click: function () {
	                            	var presetValue = $("#set-preset-input").val();
	                            	if(presetValue==null||$.trim(presetValue)==''){
	        							$.sticky('要设置的预置点不能为空，请重新输入。', {type : "error"});
										return;
	        						}
				                	var presetIndex = findInputPreset($("#set-preset-input"));
				                	if (presetIndex == 0) {
										$.sticky('要设置的预置点不存在，请重新输入。', {type : "error"});
										return;
									}
									
									var presetName = $("#set-preset-name-input").val();
									presetName = $.trim(presetName);
									if(!presetName){
										presetName = "预置点" + presetIndex;
									}
									
									var ex = /^\d+$/;
									if (ex.test(presetName) || presetName.replace(/(^\s*)|(\s*$)/g, "") == ''){
										$.sticky('预置点名称不合法，不能全部是数字或空格，请重新输入。', {type : "error"});
										return;
									}
									
									if (!$("#set-preset-name-input").validate()) {
										return;
									}
									
									$.ajax( {
										url : 'modifyPresetInfo.action',
										type : 'POST',
										data : {
											id : id,
											presetName:presetName,
											preset:presetIndex
										},
										dataType : "json",
										success : function(result) {
											if(result && result.actionErrors && result.actionErrors.length > 0){
												$.sticky(result.actionErrors[0], {
													type: "error"
												});
												return;
											}
											
											if (result.success && result.ret == 1 ) {
												 $.sticky("设置预置点成功！",{type:"ok"});
												 $('#call-preset-input').val(presetName);
												 if (!win_status[selectWindowIndex]) {
													return;
												}
												var id_temp = win_status[selectWindowIndex].cameraId;
												if (id_temp && id_temp == id) {
													$("#btn-call-preset").removeClass("disabled");
													var presetLi = $('.preset-container li[data-number="' + presetIndex + '"] a');
													if(!presetLi ||presetLi.length < 1){
														presetName = presetName.replace(/&/g,'&amp;');
														var presetHtml = ' <li data-number="'+ presetIndex+ '"><a href="#">'+ presetName + '</a></li>';
														var presetNameHtml = ' <li data-number="'+ presetIndex+ '"><a href="#">'+ presetIndex + '</a></li>';
														$(".preset-container").append(presetNameHtml);
														$(".preset-container-name").append(presetHtml);
														presetInfo[presetName] = presetIndex;
														presetIds[presetIndex] = presetName;
													}else{
														var oldName = presetLi.html();
														presetLi = $('.preset-container-name li[data-number="' + presetIndex + '"] a');
													 	presetLi.html(presetName);
														presetInfo[oldName] = null;
														presetInfo[presetName] = presetIndex;
														presetIds[presetIndex] = presetName;
														if(oldName == $("#call-preset-input").val())
															$("#call-preset-input").val(presetName);
													}
												}
												$('#flagDialog').dialog("destroy");
											}else if(result.ret == 10005){
												$.sticky('设置失败，预置点名称重复!', {
													type: "error"
												});
											}else if(result.ret == 10002){
												$.sticky('设置失败，监控点不存在!', {
													type: "error"
												});
											}else{
												settingPanel.errorPtzOpMsg(result,'预置点');
											}
										}
									});
	                               
	                            }
	                		},
	                        "cancel": {
	                            text: '取消',
	                            click: function () {
	                			$('#flagDialog').dialog("destroy");
	                            }
	                        }
	                    }
	                });
	                $('#flagDialog').dialog('open');
	                return false;
	            });
				
				// =============================================================================

				var currentWinCount = -1;
 				$('[data-trigger="monitor.grids"]').delegate(this, 'click', function(){
					var self = $(this);
					if(self.hasClass('selected')) return;
					var count = self.attr('data-quantity');
					if(selectWindowIndex + 1 > count && (!isSingle || count != 1)){
						if (!init_flag[0]) {
							init_win(0);
							init_flag[0] = 1
						}
						leftMouseUp(null,null, null, 0);
					}
					isSingle = false;
					count = parseInt(count);
					for(var i = 0; i <= count; i++){
						if ($('#preview_' + i).hikui()) {
							$('#preview_' + i).hikui().SetDecode(1);
						}
					}
					
					for(var i = count+1; i<25;i++){
						if ($('#preview_' + i).hikui()) {
							$('#preview_' + i).hikui().SetDecode(0);
						}
					}
           		});
				
				
				$("#vedio-adaptive").click(function(){
					var self = $(this);
					var action = 0;
					if(self.hasClass("act-adaptive")){
						self.removeClass("act-adaptive")
						.attr("title","充满")
						.trigger('mouseover')
						.addClass("act-normal")
						.addClass("selected");
						action = 1;
					}else{
						self.removeClass("act-normal")
						.attr("title","自适应")
						.trigger('mouseover')
						.addClass("act-adaptive")
						.removeClass("selected");
						action = 0;
					}
					for ( var i = 0; i < ocxInScreen; i++) {
						if ($('#preview_' + i).hikui())
							$('#preview_' + i).hikui().SetAutoSize(action);
					}
				});
				
				top.$('a[data-type="folder"]').die('.folder');
				// 打开文件夹
				top.$('a[data-type="folder"]').live('click.folder', function() {
					var folder = top.$(this).attr("data-folder");
					if ($('#preview_' + init_win_index).hikui()){
						var res = $('#preview_' + init_win_index).hikui().OpenFolder(folder);
						if(res==-1||res=='-1'){
		    				jAlert('打开目录失败','提示','attention');
						}
					}else{
						if(!win_status[0]){
							win_status[0] = {};
						}
						win_status[0].openFolder = folder;
						init_win(0);
					}
				});
				
				top.$('a[data-type="pic"]').die('.pic');
				// 打开图片
				top.$('a[data-type="pic"]').live("click.pic", function() {
					var file = top.$(this).attr("data-file");
					var mode = top.$(this).attr("open-type");
					if ($('#preview_' + init_win_index).hikui()){
						var res = $('#preview_' + init_win_index).hikui().OpenFile(file,'',mode);
						if(res==-1||res=='-1'){
		    				jAlert('打开文件失败','提示','attention');
						}
					}else{
						if(!win_status[0]){
							win_status[0] = {};
						}
						win_status[0].openPic = file;
						win_status[0].openMode = mode;
						init_win(0);
					}
					
				});
				top.$('a[data-type="vedio"]').die('.vedio');
				// 打开视频
				top.$('a[data-type="vedio"]').live("click.vedio", function() {
					var file = top.$(this).attr("data-file");
					if ($('#preview_' + init_win_index).hikui()){
						var res = $('#preview_' + init_win_index).hikui().OpenFile(file,'',1);
						if(res==-1||res=='-1'){
		    				jAlert('打开文件失败','提示','attention');
						}
					}else{
						if(!win_status[0]){
							win_status[0] = {};
						}
						win_status[0].openPic = file;
						win_status[0].openMode = 1;
						init_win(0);
					}
				});
				
				top.$('a[data-type="upload"]').die('.upload');
				// 采集视频
				top.$('a[data-type="upload"]').live("click.upload", function() {
					var file = top.$(this).attr("data-file");
					var indexCode = top.$(this).attr("data-indexcode");
					var xml = (getDefaultOcx().getIndexCodeMap(indexCode));
					var DecodeTag = $($.parseXML(xml)).find('DecodeTag').text();
					settingPanel.openPoliceDialog(file, indexCode, "video",DecodeTag);
				});
				top.$('a[data-type="uploadFile"]').die('.uploadFile');
				top.$('a[data-type="uploadFile"]').live("click.uploadFile", function() {
					var self = top.$(this);
					var file = self.attr("data-file");
					var indexCode = self.attr("data-indexcode");
					var type = self.attr("tatype");
					var lWndId = self.attr("lWndId");
					self = null;
					delete self;
					settingPanel.saveUploadFile(file, indexCode, type,'0',lWndId);
				});
				top.$('a[data-type="uploadPic"]').die('.uploadPic');
				// 采集图片
				top.$('a[data-type="uploadPic"]').live("click.uploadPic", function() {
					var file = top.$(this).attr("data-file");
					var indexCode = top.$(this).attr("data-indexcode");
					var xml = (getDefaultOcx().getIndexCodeMap(indexCode));
					var DecodeTag = $($.parseXML(xml)).find('DecodeTag').text();
					settingPanel.openPoliceDialog(file, indexCode, "picture",DecodeTag);
				});

				// start--------------云镜操作-------------------------------------------------

				// 云镜相关操作
				$('.ptz-operation').mousedown(function() {
					var op = $(this).attr('data-op');
					var speed = $('#speedVolume').slider('value');
					sendPtzCmd(op, 0, speed,selectWindowIndex);
					// $('#zTreea').html(op + "-down");
					});

				$('.ptz-operation').mouseup(function() {
					var op = $(this).attr('data-op');
					var speed = $('#speedVolume').slider('value');
					sendPtzCmd(op, 1, speed,selectWindowIndex);
				});

				$('.ptz-operation').mouseout(function() {
					var op = $(this).attr('data-op');
					if (ptz_panel_status[op] != 1) {
						return;
					}
					var speed = $('#speedVolume').slider('value');
					sendPtzCmd(op, 1, speed,selectWindowIndex);
				});
				
				$('.ptz-btn-operation-3d').click(function(){
					if (!win_status[selectWindowIndex]) {
						return;
					}
					var id = win_status[selectWindowIndex].cameraId;
					if (!id) {
						return;
					}
					if(win_status[selectWindowIndex] && win_status[selectWindowIndex]['3d']) {
	                    end3DZoom(id);
	                }else {
	                	start3DZoom(id);
	                }
	                return false;
				});
				
				$('.ptz-btn-operation-light').click(function(){
					if (!win_status[selectWindowIndex]) {
						return;
					}
					var id = win_status[selectWindowIndex].cameraId;
					if (!id) {
						return;
					}
					if(win_status[selectWindowIndex] && win_status[selectWindowIndex]['light']) {
	                    setAuxOn($(this).attr('data-op'),1,id,$(this),selectWindowIndex,'light');
	                }else {
	                	setAuxOn($(this).attr('data-op'),0,id,$(this),selectWindowIndex,'light');
	                }
	                return false;
				});
				
				$('.ptz-btn-operation-brush').click(function(){
					if (!win_status[selectWindowIndex]) {
						return;
					}
					var id = win_status[selectWindowIndex].cameraId;
					if (!id) {
						return;
					}
					if(win_status[selectWindowIndex] && win_status[selectWindowIndex]['brush']) {
	                     setAuxOn($(this).attr('data-op'),1,id,$(this),selectWindowIndex,'brush')
	                }else {
	                	setAuxOn($(this).attr('data-op'),0,id,$(this),selectWindowIndex,'brush');
	                }
	                return false;
				});
				
				$('.ptz-btn-operation-sentinel').click(function(){
					// 守望位，待定。默认选择1
					callPreset(1);
				});
				
				 $('.ptz-btn-operation-lock').click(function(){
					 	if (!win_status[selectWindowIndex] || !win_status[selectWindowIndex].cameraId) {
							return;
						}
					 	var id = win_status[selectWindowIndex].cameraId;
						if (!id) {
							return;
						}
		                if(win_status[selectWindowIndex] && win_status[selectWindowIndex]['lock']) {
		                    ptzUnlock(id);
		                }else {
		                	ptzLock(id);
		                }
		                return false;
		         });

				$('.ptz-btn-operation-auto').click(function() {
					if (!win_status[selectWindowIndex]) {
						return;
					}
					var self = $(this);
					if(self.hasClass('disabled')){
						return;
					}
					var op = self.attr('data-op');
					var speed = $('#speedVolume').slider('value');

					var action = 0;
					// 发送命令成功后设置状态
					if (win_status[selectWindowIndex]
							&& win_status[selectWindowIndex][op] == 1) {
						self.removeClass("selected");
						win_status[selectWindowIndex][op] = 0;
						action = 1;
					} else {
						self.addClass("selected");
						win_status[selectWindowIndex][op] = 1;
						action = 0;
					}
					sendPtzCmd(op, action, speed,selectWindowIndex);
				});
				
				function ptzUnlock(id){
					var index = selectWindowIndex;
					$.ajax( {
						url : 'sendPtzUnLockCmd.action',
						type : 'POST',
						data : {
							id : id,
							cmd : 201
						},
						dataType : "json",
						success : function(result) {
							if (result.success && result.ret == 1) {
								$.sticky("成功解锁云镜",{type:"ok"});
		                        $('.ptz-btn-operation-lock').removeClass('selected');
								$('.ptz-btn-operation-lock > a').attr('original-title',"锁定");
		                        win_status[selectWindowIndex]['lock'] = 0;
								if(win_status[index].timer){
									clearTimeout(win_status[index].timer)
								}
								win_status[index].timer = null;
							} else if(result.ret == -1){
								$.sticky('解锁云镜失败!', {
									type: "error"
								});
							}else if(result.ret == -3){
								$.sticky('该监控点所属设备未关联设备接入网关，请联系管理员。', {
									type: "attention"
								});
							}else {
								var msg = result.msg || "";
								$.sticky('解锁云镜失败!' + msg, {
									type: "error"
								});
							}
						}
					});
				}
				
				function ptzLock(id){
					 /* 锁定云镜 */
		            $('#lockDialog').dialog({
		                autoOpen: false,
		                modal: false,
		                width: 300,
		                buttons: {
		                    "ok": {
		                        text: '锁定',
		                        'class': 'bPrimary',
		                        click: function () {
		                            // 先弹出Dialog，后提示成功、失败信息
		                            var lockTime = $('#ptz-lock-time').val();
		                            if(lockTime.indexOf('.')>-1){
		                            	$.sticky('请输入数字1-59之间的整数。', {type : "error"});
		                            	return;
		                            }
		                            if(isNaN(lockTime) || lockTime < 1 || lockTime >= 60){
		                            	$.sticky('请输入数字1-59之间的数字。', {type : "error"});
		                            	return;
		                            }
									// TODO这里需要给出一个云镜锁定操作的状态
									$('#lockDialog').dialog("destroy");
 		                            $('.ptz-btn-operation-lock').addClass('selected');
									$('.ptz-btn-operation-lock > a').attr('original-title',"解锁");
 		                            win_status[selectWindowIndex]['lock'] = 1;
									
									var index = selectWindowIndex;
		                            $.ajax( {
		        						url : 'sendPtzLockCmd.action',
		        						type : 'POST',
		        						data : {
		        							id : id,
		        							cmd : 200,
		        							lockTime : lockTime
		        						},
		        						dataType : "json",
		        						success : function(result) {
		        							if (result.success && result.ret == 1) {
		        								$.sticky("云镜锁定成功，锁定时间" + lockTime + "分钟！",{type:"ok"});
												var timer = setTimeout(function(){
													if (win_status[index] && id == win_status[index].cameraId) {
														if (index == selectWindowIndex) {
															$('.ptz-btn-operation-lock').removeClass('selected');
															$('.ptz-btn-operation-lock > a').attr('original-title',"锁定");
														}
														win_status[index]['lock'] = 0;
														win_status[index].timer = null;
													}
												},lockTime * 60 * 1000);
												win_status[index].timer = timer;
		        							} else if(result.ret == -1){
												$.sticky('锁定云镜失败!', {
													type: "error"
												});
											}else if(result.ret == -3){
												$.sticky('该监控点所属设备未关联设备接入网关，请联系管理员。', {
													type: "attention"
												});
											}else {
												var msg = result.msg || "";
												$.sticky('锁定云镜失败!' + msg, {
													type: "error"
												});
											}
											if(result.ret != 1 ){
												if (index == selectWindowIndex) {
													$('.ptz-btn-operation-lock').removeClass('selected');
													$('.ptz-btn-operation-lock > a').attr('original-title',"锁定");
												}
		     		                            win_status[index]['lock'] = 0;
											}
		        						},
										error:function(){
											if (index == selectWindowIndex) {
												$('.ptz-btn-operation-lock').removeClass('selected');
												$('.ptz-btn-operation-lock > a').attr('original-title',"锁定");
											}
	     		                            win_status[index]['lock'] = 0;
										}
		        					});
		                            
		                           
		                        }
		                    },
		                    "cancel": {
		                        text: '取消',
		                        click: function () {
		                    		$('#lockDialog').dialog("destroy");
		                        }
		                    }
		                }
		            });
		            $('#lockDialog').dialog('open');
				}
				
				function start3DZoom(cameraId){
					var ocx = $('#preview_' + selectWindowIndex).hikui();
					if (ocx) {
						ocx.Set3DZoomMode(1);
						win_status[selectWindowIndex]["3d"] = 1;
						win_status[selectWindowIndex]["29"] == 0;
						$('.ptz-btn-operation-3d').addClass("selected");
						$('.ptz-btn-operation-auto').removeClass("selected");
						$('.ptz-btn-operation-auto').addClass("disabled");
					}
				}
				
				function end3DZoom(cameraId){
					var ocx = $('#preview_' + selectWindowIndex).hikui();
					if (ocx) {
						win_status[selectWindowIndex]["3d"] = 0;
						$('.ptz-btn-operation-3d').removeClass("selected");
						$('.ptz-btn-operation-auto').removeClass("disabled");
						ocx.Set3DZoomMode(0);
					}
				}
				
				function setAuxOn(cmd,action,id,el,wid,index){
					$.ajax( {
						url : 'sendAuxCmd.action',
						type : 'POST',
						data : {
							id : id,
							cmd : cmd,
							action : action
						},
						dataType : "json",
						success : function(result) {
							if (result.success) {
								if (result.success && result.ret == 1) {
									if(action == 0){
										win_status[wid][index] = 1;
										el.addClass("selected");
									}else{
										win_status[wid][index] = 0;
										el.removeClass("selected");
									}
									
								} else{
									settingPanel.errorPtzOpMsg(result,'辅助设备');
								} 
							} else {
								settingPanel.errorPtzOpMsg(result,'辅助设备');
							}
						}
					});
				}
				function sendPtzCmd(cmd, action, ptzSpeed,wIndex) {
					if (!win_status[wIndex]) {
						return;
					}
					var id = win_status[wIndex].cameraId;
					if (!id) {
						return;
					}
					var url = 'sendPtzCmd.action';
					if(action==1){
						url = 'sendPtzCmdStop.action';
					}

					$.ajax( {
						url : url,
						type : 'POST',
						data : {
							id : id,
							cmd : cmd,
							action : action,
							speed : ptzSpeed
						},
						dataType : "json",
						success : function(result) {
							if(action == 1){
								return;
							}
							settingPanel.errorPtzOpMsg(result,'云镜');
						}
					});
				}
				function sendParamCmd0(bright,light,tone,saturation){
					if (!win_status[selectWindowIndex]) {
						return;
					}
					var id = win_status[selectWindowIndex].cameraId;
					if (!id) {
						return;
					}
					var ocx = $('#preview_' + selectWindowIndex).hikui();
					if(!ocx){
						return;
					}
					$.ajax( {
						url : 'sendParamCmd.action',
						type : 'POST',
						data : {
							id : id,
							'vedioParam.bright' : bright,
							'vedioParam.light' : light,
							'vedioParam.tone' : tone,
							'vedioParam.saturation' : saturation
						},
						dataType : "json",
						success : function(result) {
							if (result.success && result.ret == 1) {
							} else if (result.success && result.ret == 0) {
								setVideoParam('bright',6);
								setVideoParam('light',6);
								setVideoParam('saturation',6);
								setVideoParam('tone',6);
								
								sendValue['bright']= 6;
								paramValue['bright']= 6;
								
								sendValue['light']= 6;
								paramValue['light']= 6;
								
								sendValue['tone']= 6;
								paramValue['tone']= 6;
								
								sendValue['saturation']= 6;
								paramValue['saturation']= 6;

								jSticky('当前监控点无视频调节权限', {
									type : "attention"
								});
							} else {
								ocx.SetVideoParam(bright,light,saturation,tone);
							}
						},
						error : function(XMLHttpRequest, textStatus, errorThrown){
							// ocx.SetVideoParam(bright,light,saturation,tone);
						}
					});
				}
				
				function clearVideoParam(lWndId){
					$('.control-mask').show();
					if(!win_status) return;
					if (win_status[lWndId] &&  win_status[lWndId].cameraId && (lWndId + '_' + win_status[lWndId].cameraId) == lastGetparamId) {
						return;
					}
					setVideoParam('bright',0);
					setVideoParam('light',0);
					setVideoParam('saturation',0);
					setVideoParam('tone',0);
					
					sendValue['bright']= 1;
					paramValue['bright']= 1;
					
					sendValue['light']= 1;
					paramValue['light']= 1;
					
					sendValue['tone']= 1;
					paramValue['tone']= 1;
					
					sendValue['saturation']= 1;
					paramValue['saturation']= 1;
					lastGetparamId = '0_0';
				}
				
				var lastGetparamId = '0_0';
				function initVideoParam(lWndId){
					if (!win_status[lWndId]) {
						lastGetparamId = '0_0';
						return;
					}
					var id = win_status[lWndId].cameraId;
					if (!id) {
						lastGetparamId = '0_0';
						return;
					}
					if((lWndId + '_' + id) == lastGetparamId){
						return;
					}
					if(win_status[lWndId].onVedioParam === 0){
						return;
					}
					var ocx = $('#preview_' + lWndId).hikui();
					if(!ocx){
						return;
					}
					$.ajax( {
						url : 'sendGetParamCmd.action',
						type : 'POST',
						data : {
							id : id
						},
						dataType : "json",
						success : function(result) {
							if(lWndId != selectWindowIndex){
								return;
							}
							if (result.success && result.ret == 1 && result.vedioParam) {
								setVideoParam('bright',result.vedioParam.bright);
								setVideoParam('light',result.vedioParam.light);
								setVideoParam('saturation',result.vedioParam.saturation);
								setVideoParam('tone',result.vedioParam.tone);
								
								sendValue['bright']= result.vedioParam.bright;
								paramValue['bright']= result.vedioParam.bright;
								
								sendValue['light']= result.vedioParam.light;
								paramValue['light']= result.vedioParam.light;
								
								sendValue['tone']= result.vedioParam.tone;
								paramValue['tone']= result.vedioParam.tone;
								
								sendValue['saturation']= result.vedioParam.saturation;
								paramValue['saturation']= result.vedioParam.saturation;
								
								lastGetparamId = lWndId + '_' + id;
							} else {
								var detail = ocx.GetVideoParam();
								getVideoParam(detail,lWndId);
							}
						},
						error : function(XMLHttpRequest, textStatus, errorThrown){
							if(lWndId != selectWindowIndex){
								return;
							}
							var detail = ocx.GetVideoParam();
							getVideoParam(detail,lWndId);
						}
					});
				}
				
				function setVideoParam(type,value){
					$('#videoParameter div[data-param="' +type +'"]').slider({value: value});
					$('#videoParameter input[data-param="' +type +'"]').val(value);
				}

				// 设置速度
				// $('#speedVolume').slider({value: 100});

				// 视频参数调节
				$('#videoParameter input[data-trigger="slide"]').on('change',function(){
	                var value = $(this).val();
	                var type = $(this).attr("data-param");
	                $(this).parents('dl').find('dd .uRange').slider({value:value});
	                if(paramValue[type] != value){
	                	paramValue[type] = value;
	                	if(!sendParamTimer){
	                		sendParamTimer = setInterval(sendParamCmd,500); 
	                	}
	                }
	            });
				// 保存
				$('[data-trigger="monitor.save"]').click(function() {
					for ( var i = 0; i < ocxInScreen; i++) {
						if (win_status[i] && win_status[i].yuyan && $('#preview_' + i).hikui()){
							var configXml = $('#preview_' + i).hikui().GetFishEyeParam();
							$.ajax( {
								url : 'saveConfigFishXml.action',
								type : 'POST',
								data : {
		 							'indexCode' : win_status[i].fishIndexCode,
		 							'configXml' : configXml
								},
								dataType : "json",
								success : function(result) {
									if(result.msg != 'success'){
										jAlert('保存鱼眼参数失败！','警告','attention');
									}else{
										jAlert('保存鱼眼参数成功！','警告','attention');
									}
								}
							})
						}
					}
				});
				
				// 录像
				$('[data-trigger="monitor.record"]').click(function() {
					for ( var i = 0; i < ocxInScreen; i++) {
						if (!win_status[i]||!win_status[i].cameraId) continue;
						if(yuyanMode && !win_status[i].yuyan){
							continue;
						}
						var hikocx = $('#preview_' + i).hikui();
						if (hikocx && hikocx.isCStartPlay){
							hikocx.StartRecord();
						}
					}
					if(ocxInScreen > 0 && yuyanMode==true){
						$(this).addClass('selected').attr('original-title','停止录像');;
					}
				});
				// 抓图
				$('[data-trigger="monitor.capture"]').click(function() {
					var mode = $(this).attr('data-mode');
					pfc++;
					for ( var i = 0; i < ocxInScreen; i++) {
						if (!win_status[i]||!win_status[i].cameraId) continue;
						if(yuyanMode && !win_status[i].yuyan){
							continue;
						}
						var hikocx = $('#preview_' + i).hikui();
						if (hikocx && hikocx.isCStartPlay){
							hikocx.SnapShot(pfc, mode);
						}
					}
					
				});
				
				$('[data-trigger="monitor.capture.dropdown"]').click(function() {
					var mode = $(this).attr('data-mode');
					$('[data-trigger="monitor.capture"]').each(function(){
						$(this).removeClass("act-camera")
						$(this).removeClass("act-camera-multi")
						if(mode == 0){// $(this).hasClass("act-camera")
							$(this).addClass("act-camera");
							$(this).attr('data-mode',0);
							$('[data-trigger="monitor.capture.dropdown"][data-mode="0"] .ico').addClass('checked');
							$('[data-trigger="monitor.capture.dropdown"][data-mode="1"] .ico').removeClass('checked');
						}else{
							$(this).addClass("act-camera-multi");
							$(this).attr('data-mode',1);	
							$('[data-trigger="monitor.capture.dropdown"][data-mode="0"] .ico').removeClass('checked');
							$('[data-trigger="monitor.capture.dropdown"][data-mode="1"] .ico').addClass('checked');
						}
					});
					
					pfc++;
					for ( var i = 0; i < ocxInScreen; i++) {
						if (!win_status[i]||!win_status[i].cameraId) continue;
						if(yuyanMode && !win_status[i].yuyan){
							continue;
						}
						var hikocx = $('#preview_' + i).hikui();
						if (hikocx && hikocx.isCStartPlay){
							hikocx.SetSnapMultiType(mode);
						}
// $('#preview_' + i).hikui().SetSnapMultiType(mode);
					}
					
				});
				
				// end--------------云镜操作-------------------------------------------------
				
			});