
// ocxPanel.setting 配置预览工具栏
var settingPanel;
(function($){
    settingPanel = {
        video: {
            record: function(filename,folder,indexCode) {
				folder = folder.replace(/&/g,'&amp;');
                var result,html = [];
                html.push('<div class="block block-msg">');
                html.push('<div class="bd">');
                html.push('<h6><a data-type="vedio" href="#" data-file="', folder, '\\', filename, '">',filename, '</a></h6>');
                html.push('<p><a data-type="folder" href="#" data-folder="',folder,'"><span class="ico i-folder-open"></span><span>打开目录</span></a></p>');
                html.push('<p><a data-type="vedio"  href="#" data-file="',folder,'\\',filename,'"><span class="ico i-video-play"></span><span>播放录像</span></a></p>');
               	html.push('<p><a data-type="upload"  data-indexcode = ' + indexCode +' href="#" data-file="',folder,'\\',filename,'"><span class="ico i-video-play"></span><span>警情剪辑</span></a></p>')
                html.push('</div></div>');
                result = html.join('');
                jSticky({
                	message :result,
                	type:"st-msg st-video",
                	options : {
						html: true,
                		position:"bottom-right",
                		autoclose:5000
                		}
                });
            }
        },
        picture: {
			windowstatus:{
				status:[],
				data:[]
			},
            capture: function(filename, folder, pfc, indexCode){
				if (!filename || !folder) {
					return;
				}
				folder = folder.replace(/&/g,'&amp;');
				var id = 'capture-info-' + pfc;
					console.info('st'+id)
				var obj = settingPanel.picture.windowstatus.data[id];
				console.info(obj)
				if (!obj) {
					settingPanel.picture.windowstatus.data[id] = {
						filenames: [],
						filefolders: [],
						total: 0,
						current: 1
					};
					console.info('create')
					settingPanel.picture.windowstatus.data[id].filenames.push(filename);
					settingPanel.picture.windowstatus.data[id].filefolders.push(folder);
					settingPanel.picture.windowstatus.data[id].total = settingPanel.picture.windowstatus.data[id].total + 1;
				}else{
					obj.filenames.push(filename);
					obj.filefolders.push(folder);
					obj.total = obj.total + 1;
					console.info(id+'-'+1 + "/" + obj.total)
					//top.$('#' + id + ' .bd .page-index').html(1 + "/" + obj.total);
					
					var c = settingPanel.picture.windowstatus.data[id].current;
						var t = settingPanel.picture.windowstatus.data[id].total;
						console.info(c +"afteropen" + t)
						top.$('#' + id + ' .bd .page-index').html(
								c + "/" + (parseInt(t)));
						if (parseInt(t) != c) {
							top.$('#' + id + ' .next a').removeClass('disabled');
						}
						var captureDiv = top.$('#' + id);
						var filenames = settingPanel.picture.windowstatus.data[id].filenames;
						var filefolders = settingPanel.picture.windowstatus.data[id].filefolders;
						captureDiv.attr('data-total', parseInt(t));
						captureDiv.attr('data-filename', filenames.join(','));
						captureDiv.attr('data-folder', filefolders.join(','));
					return;
				}
				console.info('ot'+id)
				var captureDiv = $('#' + id);
				if (captureDiv && captureDiv.length > 0) {
					var c = captureDiv.attr('data-current');
					var t = captureDiv.attr('data-total');
					var filenames = captureDiv.attr('data-filename').split(',');
					var filefolders = captureDiv.attr('data-folder').split(',');
					filenames.push(filename);
					filefolders.push(folder);
					captureDiv.attr('data-total', parseInt(t) + 1);
					captureDiv.attr('data-filename', filenames.join(','));
					captureDiv.attr('data-folder', filefolders.join(','));
					$('#' + id + ' .bd .page-index').html(c + "/" + (parseInt(t) + 1));
					$('#' + id + ' .next a').removeClass('disabled');
					return;
				}
				
				var nextClass = " disabled";
				var preClass = " disabled";
				var result, html = [];
				html.push('<div id="', id, '" data-current="1" data-total="1" data-filename="', filename, '" data-folder="', folder, '" class="block block-msg">');
				html.push('<div class="bd">');
				html.push('<h6><a open-type="0"  data-type="pic" href="#" data-file="', folder, '\\', filename, '">', filename, '</a></h6>');
				html.push('<p><a data-type="folder"  href="#" data-folder="', folder, '"><span class="ico i-folder-open"></span><span>打开目录</span></a></p>');
				html.push('<p><a open-type="1"  data-type="pic" href="#" data-file="', folder, '\\', filename, '"><span class="ico i-video-play"></span><span>编辑图片</span></a></p>');
				html.push('<p><a open-type="2"  data-type="uploadPic" data-indexcode = ' + indexCode +' href="#" data-file="', folder, '\\', filename, '"><span class="ico i-video-play"></span><span>警情采集</span></a></p>');
				html.push('<div class="pagination"><ul class="pages"><li class="prev"><a data- href="#" class="',preClass,'"><span class="ico i-prev"></span></a></li><li class="page-index">', 1, '/', 1, '</li><li class="next"><a class="', nextClass, '" href="#"><span class="ico i-next"></span></a></li></ul></div>');
				html.push('</div></div>');
				result = html.join('');
				jSticky({
					message : result,
					type: "st-msg st-picture",
					options : {
						id:"sticky_" + id,
						position: "bottom-right",
						html : true,
						autoclose: 5000
					}, 
					afterclose:function(){
						settingPanel.picture.windowstatus.data[id]=null;
					},
					afteropen : function(options) {
						console.info("afteropen")
						var c = settingPanel.picture.windowstatus.data[id].current;
						var t = settingPanel.picture.windowstatus.data[id].total;
						console.info(c +"afteropen" + t)
						top.$('#' + id + ' .bd .page-index').html(
								c + "/" + (parseInt(t)));
						if (parseInt(t) != c) {
							top.$('#' + id + ' .next a').removeClass('disabled');
						}
						var captureDiv = top.$('#' + id);
						var filenames = settingPanel.picture.windowstatus.data[id].filenames;
						var filefolders = settingPanel.picture.windowstatus.data[id].filefolders;
						captureDiv.attr('data-total', parseInt(t));
						captureDiv.attr('data-filename', filenames.join(','));
						captureDiv.attr('data-folder', filefolders.join(','));
						top.$('#' + id + ' .prev a').click(function(){
							if (top.$(this).hasClass("disabled")) {
								return;
							}
							var c = top.$('#' + id).attr('data-current');
							var t = top.$('#' + id).attr('data-total');
							var filenames = top.$('#' + id).attr('data-filename').split(',');
							var filefolders = top.$('#' + id).attr('data-folder').split(',');
							var current = parseInt(c) - 1;
							top.$('#' + id).attr('data-current', current);
							if (current == 1) {
								top.$(this).addClass("disabled")
							}
							if (current != parseInt(t)) {
								top.$('#' + id + ' .next a').removeClass("disabled");
							}
							top.$('#' + id + ' .bd h6 a').html(filenames[current - 1]);
							top.$('#' + id + ' .bd .page-index').html(current + "/" + t);
							top.$('#' + id + ' .bd a[data-type="folder"]').attr("data-folder", filefolders[current - 1]);
							top.$('#' + id + ' .bd a[data-type="pic"]').attr("data-file", filefolders[current - 1] + '\\' + filenames[current - 1]);
						});
						top.$('#' + id + ' .next a').click(function(){
							if (top.$(this).hasClass("disabled")) {
								return;
							}
							var c = top.$('#' + id).attr('data-current');
							var t = top.$('#' + id).attr('data-total');
							var filenames = top.$('#' + id).attr('data-filename').split(',');
							var filefolders = top.$('#' + id).attr('data-folder').split(',');
							var current = parseInt(c) + 1;
							top.$('#' + id).attr('data-current', current);
							if (current == parseInt(t)) {
								top.$(this).addClass("disabled")
							}
							if (current > 1) {
								top.$('#' + id + ' .prev a').removeClass("disabled");
							}
							top.$('#' + id + ' .bd h6 a').html(filenames[current - 1]);
							top.$('#' + id + ' .bd .page-index').html(current + "/" + t);
							top.$('#' + id + ' .bd a[data-type="folder"]').attr("data-folder", filefolders[current - 1]);
							top.$('#' + id + ' .bd a[data-type="pic"]').attr("data-file", filefolders[current - 1] + '\\' + filenames[current - 1]);
						});
					}
				});
			}
        },
        setting: {
            loaded: false,
			load: function(callback) {
                if(!settingPanel.setting.loaded) {
                    $.ajax({
                        url: pt.ctx + '/web/module/setting/settings.html',
                        success: function(data){
                            $('body').append(data);
                            // 系统设置
                            $('#settingDialog').dialog({
                                autoOpen: false,
                                modal: false,
                                width: 640,
                                height: 500,
                                buttons: {
                                    "restore": {
                                        text: '恢复默认',
                                        'class': 'floatL',
                                        click: function() {
                                            var self = this;
                                            function aaa(){
                                                var result = settingPanel.setting.reset();
                                                if (result) {
                                                    callback();
                                                    //$(self).dialog("destroy");
                                                    self.close();
                                                    $(self).remove();
                                                    settingPanel.setting.loaded = false;
                                                    if ($('[data-trigger="monitor.config"]').length)
                                                        $('[data-trigger="monitor.config"]').trigger("click");
                                                    if ($('#playback_ocx').hikui())
                                                        $('#playback_ocx').hikui().trigger("MsgNotify", 0x0200000D, null, null, null);
                                                }
                                            }
                                            function restoreClip(){
                                            	
                                            }
                                            jConfirm('是否将系统配置恢复默认值？','恢复默认',function(r){
                                                 if(r){
                                                    aaa();
                                                 }
                                            });
                                        }
                                    },
                                    "ok": {
                                        text: '确定',
                                        'class': 'bPrimary',
                                        click: function () {
                                            var result = settingPanel.setting.save();
                                            if(result) {
                                                callback();
                                                this.close();
                                                $(this).remove();
                                                settingPanel.setting.loaded = false;
                                            }
                                        }
                                    },
                                    "cancel": {
                                        text: '取消',
                                        click: function () {
                                           	this.close();
                                            $(this).remove();
                                            settingPanel.setting.loaded = false;
                                        }
                                    }
                                },
                                close: function(){
                                    $(this).dialog("destroy");
                                    $(this).remove();
                                    settingPanel.setting.loaded = false;
                                }
                            });
                            $('#settingDialog').dialog('open');
                            settingPanel.setting.loaded = true;
                        }
                    });
                }
            },
			setLocalConfig2Ocx:function(){
				//TODO:设置到已经初始化的ocx中
			},
			save:function(){
				settingPanel.setting.savePreviewSetting();
				settingPanel.setting.savePreviewSnapParam();
				settingPanel.setting.savePlaybackSetting();
				settingPanel.setting.savePlaybackDownload();
				settingPanel.setting.savePlaybackVideoclibs();
				settingPanel.setting.savePerformancePlan();
				return true;
			},
			reset:function(){
				var path = "C:";
				try {
					var fso = new ActiveXObject("WScript.shell"); 
					var pn=fso.Environment("PROCESS");
					path = pn("WINDIR").toString().substring(0,2);
				}catch(e){
					jAlert("注意:由于安全方面的问题，你还需要如下设置才能正确运行，否者则没有权限。</br>1、设置当前访问站点为可信任站点"+"</br>---注意必须去掉对该区域中的所有站点要求服务器验证(https)的勾选。</br> 2、可信任站点安全级别自定义设置中：设置下面的选项  对没有标记为安全的ActiveX控件进行初始化和脚本运行----启用 ",'警告','alarm');
				}
				$.commonCookie("ocx-setting-preview-init","");
				$.commonCookie("ocx-setting-playback-init","");
				$.commonCookie("ocx-setting-download-path","");
				$.commonCookie("ocx-setting-down-save-count",10);
				$.commonCookie("ocx-setting-down-single-speed",128);
				$.commonCookie("ocx-setting-down-run-count",5);
				
				$.commonCookie("ocx-setting-playback-btn",'');
				$.commonCookie("ocx-setting-playback-bar-isshow",2);
				$.commonCookie("ocx-setting-replay-decoding",9);
				
                $.commonCookie("ocx-setting-btn", '');
                $.commonCookie("ocx-setting-bar-isshow", 0);
                $.commonCookie("ocx-setting-preview-video-path", path+"\\Program Data\\record\\");
                $.commonCookie("ocx-setting-limit-time", 0);
                $.commonCookie("ocx-setting-video-file", "");
				$.commonCookie("ocx-setting-replay-time",30);
				$.commonCookie("ocx-setting-replay-type",0);
                
                
                $.commonCookie("ocx-setting-capture-time", "captureframe");
                $.commonCookie("ocx-setting-capture-count", 3);
                $.commonCookie("ocx-setting-capture-file", "");
                $.commonCookie("ocx-setting-capture-format", "JPG");
           
                $.commonCookie("ocx-setting-capture-path", path+"\\Program Data\\capture\\");
				$.commonCookie("ocx-setting-split-package","packagetime,1");
				
				$.commonCookie("ocx-setting-videoclibs-time","videoclibsframe");
				$.commonCookie("ocx-setting-videoclibs-size",256);
				$.commonCookie("ocx-setting-videoclibs-filename","");
				$.commonCookie("ocx-setting-videoclibs-path",path+"\\Program Data\\clip\\");
				
				$.commonCookie("ocx-setting-videoclibs-time","performanceplanframe");
				$.commonCookie("ocx-setting-performanceplan-type",1);
				$.commonCookie("ocx-setting-performanceplan-defstream",0);
				$.commonCookie("ocx-setting-performanceplan-autochg",1);
				$.commonCookie("ocx-setting-performanceplan-decodeper",5);
				$.commonCookie("ocx-setting-performanceplan-playPer",0);
				return true;
			},
			savePlaybackDownload:function(){
				
				//保存下载录像存放位置
				var downloadSavePathItem =  $("#downloadSavePath");
				if(downloadSavePathItem && downloadSavePathItem.length > 0){ 
					var downloadSavePath = "";
					if($("#downloadSavePath").val()){
						downloadSavePath = $("#downloadSavePath").val();
					}
					$.commonCookie("ocx-setting-download-path",downloadSavePath);
				}
				
				var spliteSize  =  $("#downLoadSplitSize");
				if (spliteSize && spliteSize.length > 0) {
					$.commonCookie("ocx-setting-down-split-size",spliteSize.val());
				}
				
				var downSaveCount  =  $("#downSaveCount");
				if (downSaveCount && downSaveCount.length > 0) {
					$.commonCookie("ocx-setting-down-save-count",downSaveCount.val());
				}
				
				var downSingleCount  =  $("#downSingleCount");
				if (downSingleCount && downSingleCount.length > 0) {
					$.commonCookie("ocx-setting-down-single-speed",downSingleCount.val());
				}
				
				var downRunCount  =  $("#downRunCount");
				if (downRunCount && downRunCount.length > 0) {
					$.commonCookie("ocx-setting-down-run-count",downRunCount.val());
				}
				
				var downFileName = $('#downFileName');
				if(downFileName && downFileName.length > 0){
					$.commonCookie("ocx-setting-down-file",downFileName.val());
				}
			},
			savePlaybackSetting:function(){
				//保存工具栏
				var bar = $("#ocxReplaySortable");
				if(bar && bar.length > 0){ 
					$.commonCookie("ocx-setting-playback-init",1); 
					var barItems = $("#ocxReplaySortable li");
					if(barItems.length > 0){
						var items = [];
						for(var i = 0; i < barItems.length; i++){
							items.push($(barItems[i]).attr("data-index"));
						}
						$.commonCookie("ocx-setting-playback-btn",items.join(','));
					}else{
						$.commonCookie("ocx-setting-playback-btn",'');
					}
				}
				
				//保存是否显示工具栏
				var isShowItem = $('#isPlaybackBarShow');
				if(isShowItem && isShowItem.length > 0){
					var isShow = 2;
					if(isShowItem.attr('checked')){
						isShow = 1;
					}
					$.commonCookie("ocx-setting-playback-bar-isshow",isShow);
				}
				
				//保存解码性能
				$('input[name="decoding.performance"]').each(function(){
					if($(this).attr('checked')){
						$.commonCookie("ocx-setting-replay-decoding",$(this).attr('data-value'));
					}
				});
			},
			savePreviewSetting:function(){
				//保存工具栏
				var bar = $("#ocxSortable");
				if(bar && bar.length > 0){
					$.commonCookie("ocx-setting-preview-init",1); 
					var barItems = $("#ocxSortable li");
					if(barItems.length > 0){
						var items = [];
						for(var i = 0; i < barItems.length; i++){
							items.push($(barItems[i]).attr("data-index"));
						}
						$.commonCookie("ocx-setting-btn",items.join(','));
					}else{
						$.commonCookie("ocx-setting-btn",'');
					}
				}
				
				
				//保存是否显示工具栏
				var isShowItem = $('#isBarShow');
				if(isShowItem && isShowItem.length > 0){
					var isShow = 0;
					if(isShowItem.attr('checked')){
						isShow = 1;
					}
					$.commonCookie("ocx-setting-bar-isshow",isShow);
				}
				//保存即时回放时间
				$('input[name="replay.time"]').each(function(){
					if($(this).attr('checked')){
						$.commonCookie("ocx-setting-replay-time",$(this).attr('data-value'));
					}
				});
				
				//保存播放模式
				$('input[name="replay.type"]').each(function(){
					if($(this).attr('checked')){
						$.commonCookie("ocx-setting-replay-type",$(this).attr('data-value'));
					}
				});
				
				//保存预览时紧急录像存放位置
				var previewVideoPathItem =  $("#previewVideoSavePath");
				if(previewVideoPathItem && previewVideoPathItem.length > 0){ 
					var previewVideoPath = "";
					if($("#previewVideoSavePath").val()){
						previewVideoPath = $("#previewVideoSavePath").val();
					}
					$.commonCookie("ocx-setting-preview-video-path",previewVideoPath);
				}
				
				$('input[name="package.type"]').each(function(){
					if($(this).attr('checked')){
						var value = $(this).attr('value');
						var subValue = $('#' + value + 'Select').val();
						$.commonCookie("ocx-setting-split-package",value + "," + subValue);
					}
				});
				var limitTimeBox =  $('input[toggle-checkbox="video.limit.time"]');
				if (limitTimeBox && limitTimeBox.length > 0) {
					if (limitTimeBox.attr('checked')) {
						var value = limitTimeBox.attr('value');
						var limitTime = $("#" + value + "Select").val();
						$.commonCookie("ocx-setting-limit-time", limitTime);
					}else {
						$.commonCookie("ocx-setting-limit-time", 0);
					}
				}
				
				var videoFileName = $('#videoFileName');
				if(videoFileName && videoFileName.length > 0){
					$.commonCookie("ocx-setting-video-file",videoFileName.attr("data-value"));
				}
			},
			savePreviewSnapParam:function(){
				$('input[name="capture.type"]').each(function(){
					if($(this).attr('checked')){
						var value = $(this).attr('value');
						var cookieValue = "";
						if ($('#' + value + 'Select').length > 0) {
							var subValue = $('#' + value + 'Select').val();
							cookieValue = value + "," + subValue;
						}else{
							cookieValue = value 
						}
						$.commonCookie("ocx-setting-capture-time",cookieValue);
					}
				});
				
				var captureCountItem =  $("#captureCount");
				if (captureCountItem && captureCountItem.length > 0) {
					$.commonCookie("ocx-setting-capture-count",captureCountItem.val());
				}
				
				var captureFileName = $('#captureFileName');
				if(captureFileName && captureFileName.length > 0){
					$.commonCookie("ocx-setting-capture-file",captureFileName.attr("data-value"));
				}
				
				$('input[name="capture.format"]').each(function(){
					if($(this).attr('checked')){
						$.commonCookie("ocx-setting-capture-format",$(this).attr('data-value'));
					}
				});
				
				//保存抓图存放位置
				var captureSavePathItem =  $("#captureSavePath");
				if(captureSavePathItem && captureSavePathItem.length > 0){ 
					var captureSavePath = "";
					if($("#captureSavePath").val()){
						captureSavePath = $("#captureSavePath").val();
					}
					$.commonCookie("ocx-setting-capture-path",captureSavePath);
				}
			},
			savePlaybackVideoclibs : function(){
				//分包大小
				var videoClibsItem =  $("#videoClibsSize");
				if (videoClibsItem && videoClibsItem.length > 0) {
					$.commonCookie("ocx-setting-videoclibs-size",videoClibsItem.val());
				}
				
				//录像剪辑名称
				var videoClibsFileName = $('#videoClibsFileName');
				if(videoClibsFileName && videoClibsFileName.length > 0){
					$.commonCookie("ocx-setting-videoclibs-filename",videoClibsFileName.attr("data-value"));
				}
				//保存剪辑录像存放位置
				var videoClibsSavePathItem =  $("#videoClibsSavePath");
				if(videoClibsSavePathItem && videoClibsSavePathItem.length > 0){ 
					var videoClibsSavePath = "";
					if($("#videoClibsSavePath").val()){
						videoClibsSavePath = $("#videoClibsSavePath").val();
					}
					$.commonCookie("ocx-setting-videoclibs-path",videoClibsSavePath);
				}
			},
			savePerformancePlan : function(){
				if($('#btn-select-plan li[value=3]').get(0)){
				var type = $('#btn-select-plan li[value=3]').get(0).className;
				if(type=="active"){
					$.commonCookie("ocx-setting-performanceplan-type",3);
				}else if($('#btn-select-plan li[value=2]').get(0).className=="active"){
					$.commonCookie("ocx-setting-performanceplan-type",2);
				}else if($('#btn-select-plan li[value=1]').get(0).className=="active"){
					$.commonCookie("ocx-setting-performanceplan-type",1);
				}else if($('#btn-select-plan li[value=0]').get(0).className=="active"){
					$.commonCookie("ocx-setting-performanceplan-type",0);
				}
				}
				//默认码流类型
				var defStream = $('#main_stream').attr('checked');
				if(defStream){
					$.commonCookie("ocx-setting-performanceplan-defstream",$('#main_stream').attr('data-value'));
				}else{
					$.commonCookie("ocx-setting-performanceplan-defstream",$('#sub_stream').attr('data-value'));
				}
				
				//单窗口切换
				var autoChg = $('#streamChange').attr('checked');
				if(autoChg){
					$.commonCookie("ocx-setting-performanceplan-autochg",1)
				}else{
					$.commonCookie("ocx-setting-performanceplan-autochg",0)
				}
				
				//解码性能
				if($('#slideValue').get(0)){
				var decodePer = $('#slideValue').get(0).innerText;//$('#slide')
				if(decodePer){
					$.commonCookie("ocx-setting-performanceplan-decodeper",decodePer)
				}else{
					$.commonCookie("ocx-setting-performanceplan-decodeper",5)
				}
				}
				
				var playPer = $('#playSelect').attr('value');
				if(playPer){
					$.commonCookie("ocx-setting-performanceplan-playPer",playPer)
				}
				
			}
        }
    }
})(jQuery);
