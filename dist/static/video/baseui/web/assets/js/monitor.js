$(document).ready(function(){
    $('.breadLine').resize(function(){
        var h = 31 + $(this).height();
        if($(this).css('display') == 'none') h = 30;
        $(this).next().css('paddingTop',h);
    });
    $('.breadLine').trigger('resize');
    $('.toggle-more').click(function(){
        $(this).parent().toggleClass('collapse');
        $(this).parent().hasClass('collapse') ? $(this).attr('title','展开') : $(this).attr('title','收缩');
        return false;
    });
    $('.toggle-switch').click(function(){
        $(this).parents('.col-sub').toggleClass('hasPanel');
        return false;
    });
    //*******************以下为控制面板部分*******************
    controlPanel.init();
    ocxPanel.init();

});

// controlPanel 控制面板
var controlPanel;
(function($){
    controlPanel = {
        init: function() {
            $('#controlContent').tabs()
				.find('.tabs li a')
				.click(function(){
					var $colsub = $('#controlContent').parents('.col-sub');
					if(!$colsub.hasClass('hasPanel'))
						$colsub.addClass('hasPanel');
			});
            var value = parseInt( $('#speedVolume').text(), 10 );
/*            $('#speedVolume').empty().slider({
                value: value,
                range: "min",
                orientation: "vertical"
            }).find('.ui-slider-handle').attr('title','云镜步长').tipsy({gravity : 's'});*/
            $('#rocker .c').click(function(){
                $('#rocker').toggleClass('diagonalOn',function(){
                    $('#rocker .diagonal').toggle('fade');
                });
                return false;
            });
            $('#controller .act-lockptz a').click(function(){
                if($(this).parent().hasClass('selected')) {
                    controlPanel.unlock();
                }else {
                    controlPanel.lock();
                }
                return false;
            });
            /* 设置巡航路径 */
            $('[data-trigger="controler.setPoint"]').click(function () {
                // Dialog of adding to favorite
                $('#flagDialog').dialog({
                    autoOpen: false,
                    modal: true,
                    width: 300,
                    height: 350,
                    buttons: {
                        "ok": {
                            text: '保存',
                            'class': 'bPrimary',
                            click: function () {
                                //先弹出Dialog，后提示成功、失败信息
                            	//TODO:这里要将数据保存到后台
                                $.sticky("设置预置点设置成功！",{type:"st-success"});
                                $(this).dialog("destroy");
                            }
                        },
                        "cancel": {
                            text: '取消',
                            click: function () {
                                $(this).dialog("destroy");
                            }
                        }
                    }
                });
                $('#flagDialog').dialog('open');
                return false;
            });var count = 0;
            /* 视频参数 */
            $('#videoParameter .uRange').slider({
                range: "min",
                min: 0,
                max: 100,
                value: 50,
                slide: function( event, ui ) {
                    $(this).parents('dl').find('dt input').val(ui.value).trigger('change');
                }
            });
            $('#videoParameter input[data-trigger="slide"]').spinner({min: 0,max: 100}).on('change',function(){
                var value = $(this).val();
                $(this).parents('dl').find('dd .uRange').slider({value:value});
            });
  			$('#videoParameter a[data-trigger="reset"]').click(function(){
                var input = $('#videoParameter .controls input');
                $(input).each(function(idx,item){
                    $(this).val($(this).attr('data-default')).trigger('change');
                });
                return false;
            });
        },
        disable: function() {
            // 这里的方法需要仔细斟酌
            $('#ptzController a').bind('click',function(e){e.preventDefault();return false;});
        },
        enable: function() {
            // 这里的方法需要仔细斟酌
            //$('#ptzController a').unbind('click');
        },
        hold: function() {
                jAlert('被高级用户xxxxx锁定/抢占！');
        },
        lock: function() {
            /* 锁定云台 */
            $('#lockDialog').dialog({
                autoOpen: false,
                modal: true,
                width: 300,
                buttons: {
                    "ok": {
                        text: '锁定',
                        'class': 'bPrimary',
                        click: function () {
                            //先弹出Dialog，后提示成功、失败信息
                            $.sticky("成功锁定云台，锁定时间30分钟！",{type:"st-success"});
                            $(this).dialog("destroy");
                            $('#controller .act-lockptz').addClass('selected');
                        }
                    },
                    "cancel": {
                        text: '取消',
                        click: function () {
                            $(this).dialog("destroy");
                        }
                    }
                }
            });
            $('#lockDialog').dialog('open');
        },
        unlock: function() {
            jAlert('解锁');
            controlPanel.enable();
            $('#controller .act-lockptz').removeClass('selected');
        }
    }
})(jQuery);


/*  Default Settings  */
var templates = {
    normal: {
        square1: {title: "1×1", rows:1, cols:1, units:[{x: 0, y: 0, w: 1,h: 1}]},
        square4: {title: "2×2", rows:2, cols:2, units:[{x: 0, y: 0, w: 1,h: 1},{x: 1, y: 0, w: 1,h: 1},{x: 0, y: 1, w: 1,h: 1},{x: 1, y: 1, w: 1,h: 1}]},
        square9: {title: "3×3", rows:3, cols:3, units:[{x: 0, y: 0, w : 1,h: 1},{x:1, y: 0, w : 1,h: 1},{x: 2, y: 0, w : 1,h: 1},{x: 0, y: 1, w : 1,h: 1},{x: 1, y: 1, w : 1,h: 1},{x: 2, y: 1, w : 1,h: 1},{x: 0, y: 2, w : 1,h: 1},{x: 1, y: 2, w : 1,h: 1},{x: 2, y: 2, w : 1,h: 1}]},
        square16: {title: "4×4", rows:4, cols:4, units:[{x: 0, y: 0, w : 1,h: 1},{x: 1, y: 0, w : 1,h: 1},{x: 2, y: 0, w : 1,h: 1},{x: 3, y: 0, w : 1,h: 1},{x: 0, y: 1, w : 1,h: 1},{x: 1, y: 1, w : 1,h: 1},{x: 2, y: 1, w : 1,h: 1},{x: 3, y: 1, w : 1,h: 1},{x: 0, y: 2, w : 1,h: 1},{x: 1, y: 2, w : 1,h: 1},{x: 2, y: 2, w : 1,h: 1},{x: 3, y: 2, w : 1,h: 1},{x: 0, y: 3, w : 1,h: 1},{x: 1, y: 3, w : 1,h: 1},{x: 2, y: 3, w : 1,h: 1},{x: 3, y: 3, w : 1,h: 1}]},
        square25: {title: "5×5", rows:5, cols:5, units:[{x: 0, y: 0, w : 1,h: 1},{x: 1, y: 0, w : 1,h: 1},{x: 2, y: 0, w : 1,h: 1},{x: 3, y: 0, w : 1,h: 1},{x: 4, y: 0, w : 1,h: 1},{x: 0, y: 1, w : 1,h: 1},{x: 1, y: 1, w : 1,h: 1},{x: 2, y: 1, w : 1,h: 1},{x: 3, y: 1, w : 1,h: 1},{x: 4, y: 1, w : 1,h: 1},{x: 0, y: 2, w : 1,h: 1},{x: 1, y: 2, w : 1,h: 1},{x: 2, y: 2, w : 1,h: 1},{x: 3, y: 2, w : 1,h: 1},{x: 4, y: 2, w : 1,h: 1},{x: 0, y: 3, w : 1,h: 1},{x: 1, y: 3, w : 1,h: 1},{x: 2, y: 3, w : 1,h: 1},{x: 3, y: 3, w : 1,h: 1},{x: 4, y: 3, w : 1,h: 1},{x: 0, y: 4, w : 1,h: 1},{x: 1, y: 4, w : 1,h: 1},{x: 2, y: 4, w : 1,h: 1},{x: 3, y: 4, w : 1,h: 1},{x: 4, y: 4, w : 1,h: 1}]},
        prominent6: {title: "1＋5", rows:3, cols:3, units:[{x: 0, y: 0, w : 2,h: 2},{x: 2, y: 0, w : 1,h: 1},{x: 2, y: 1, w : 1,h: 1},{x: 0, y: 2, w : 1,h: 1},{x: 1, y: 2, w : 1,h: 1},{x: 2, y: 2, w : 1,h: 1}]},
        mix7: {title: "3＋4", rows:4, cols:4, units:[{x: 0, y: 0, w : 2,h: 2},{x: 2, y: 0, w : 2,h: 2},{x: 0, y: 2, w : 2,h: 2},{x: 2, y: 2, w : 1,h: 1},{x: 3, y: 2, w : 1,h: 1},{x: 2, y: 3, w : 1,h: 1},{x: 3, y: 3, w : 1,h: 1}]},
        prominent8: {title: "1＋7", rows:4, cols:4, units:[{x: 0, y: 0, w : 3,h: 3},{x: 3, y: 0, w : 1,h: 1},{x: 3, y: 1, w : 1,h: 1},{x: 3, y: 2, w : 1,h: 1},{x: 0, y: 3, w : 1,h: 1},{x: 1, y: 3, w : 1,h: 1},{x: 2, y: 3, w : 1,h: 1},{x: 3, y: 3, w : 1,h: 1}]},
        prominent10: {title: "1＋9", rows:5, cols:5, units:[{x: 0, y: 0, w : 4,h: 4},{x: 4, y: 0, w : 1,h: 1},{x: 4, y: 1, w : 1,h: 1},{x: 4, y: 2, w : 1,h: 1},{x: 4, y: 3, w : 1,h: 1},{x: 0, y: 4, w : 1,h: 1},{x: 1, y: 4, w : 1,h: 1},{x: 2, y: 4, w : 1,h: 1},{x: 3, y: 4, w : 1,h: 1},{x: 4, y: 4, w : 1,h: 1}]},
        mix10: {title: "2＋8", rows:4, cols:4, units:[{x: 0, y: 0, w : 2,h: 2},{x: 2, y: 0, w : 2,h: 2},{x: 0, y: 2, w : 1,h: 1},{x: 1, y: 2, w : 1,h: 1},{x: 2, y: 2, w : 1,h: 1},{x: 3, y: 2, w : 1,h: 1},{x: 0, y: 3, w : 1,h: 1},{x: 1, y: 3, w : 1,h: 1},{x: 2, y: 3, w : 1,h: 1},{x: 3, y: 3, w : 1,h: 1}]},
        prominent13: {title: "1＋12", rows:4, cols:4, units:[{x: 0, y: 0, w : 2,h: 2},{x: 2, y: 0, w : 1,h: 1},{x: 3, y: 0, w : 1,h: 1},{x: 2, y: 1, w : 1,h: 1},{x: 3, y: 1, w : 1,h: 1},{x: 0, y: 2, w : 1,h: 1},{x: 1, y: 2, w : 1,h: 1},{x: 2, y: 2, w : 1,h: 1},{x: 3, y: 2, w : 1,h: 1},{x: 0, y: 3, w : 1,h: 1},{x: 1, y: 3, w : 1,h: 1},{x: 2, y: 3, w : 1,h: 1},{x: 3, y: 3, w : 1,h: 1}]},
        mix13: {title: "4＋9", rows:5, cols:5, units:[{x: 0, y: 0, w : 2,h: 2},{x: 2, y: 0, w : 2,h: 2},{x: 4, y: 0, w : 1,h: 1},{x: 4, y: 1, w : 1,h: 1},{x: 0, y: 2, w : 2,h: 2},{x: 2, y: 2, w : 2,h: 2},{x: 4, y: 2, w : 1,h: 1},{x: 4, y: 3, w : 1,h: 1},{x: 0, y: 4, w : 1,h: 1},{x: 1, y: 4, w : 1,h: 1},{x: 2, y: 4, w : 1,h: 1},{x: 3, y: 4, w : 1,h: 1},{x: 4, y: 4, w : 1,h: 1}]},
        mix14: {title: "1+1+12", rows:5, cols:5, units:[{x: 0, y: 0, w : 3,h: 3},{x: 3, y: 0, w : 1,h: 1},{x: 4, y: 0, w : 1,h: 1},{x: 3, y: 1, w : 1,h: 1},{x: 4, y: 1, w : 1,h: 1},{x: 3, y: 2, w : 1,h: 1},{x: 4, y: 2, w : 1,h: 1},{x: 0, y: 3, w : 2,h: 2},{x: 2, y: 3, w : 1,h: 1},{x: 3, y: 3, w : 1,h: 1},{x: 4, y: 3, w : 1,h: 1},{x: 2, y: 4, w : 1,h: 1},{x: 3, y: 4, w : 1,h: 1},{x: 4, y: 4, w : 1,h: 1}]},
        prominent17: {title: "1＋16", rows:5, cols:5, units:[{x: 0, y: 0, w : 3,h: 3},{x: 3, y: 0, w : 1,h: 1},{x: 4, y: 0, w : 1,h: 1},{x: 3, y: 1, w : 1,h: 1},{x: 4, y: 1, w : 1,h: 1},{x: 3, y: 2, w : 1,h: 1},{x: 4, y: 2, w : 1,h: 1},{x: 0, y: 3, w : 1,h: 1},{x: 1, y: 3, w : 1,h: 1},{x: 2, y: 3, w : 1,h: 1},{x: 3, y: 3, w : 1,h: 1},{x: 4, y: 3, w : 1,h: 1},{x: 0, y: 4, w : 1,h: 1},{x: 1, y: 4, w : 1,h: 1},{x: 2, y: 4, w : 1,h: 1},{x: 3, y: 4, w : 1,h: 1},{x: 4, y: 4, w : 1,h: 1}]}
    },
    wide: {
        square1: {title: "1×1", rows:1, cols:1, units:[{x: 0, y: 0, w: 1,h: 1}]},
        square6: {title: "2×3", rows:2, cols:3, units:[{x: 0, y: 0, w : 1,h: 1},{x: 1, y: 0, w : 1,h: 1},{x: 2, y: 0, w : 1,h: 1},{x: 0, y: 1, w : 1,h: 1},{x: 1, y: 1, w : 1,h: 1},{x: 2, y: 1, w : 1,h: 1}]},
        square12: {title: "3×4", rows:3, cols:4, units:[{x: 0, y: 0, w : 1,h: 1},{x: 1, y: 0, w : 1,h: 1},{x: 2, y: 0, w : 1,h: 1},{x: 3, y: 0, w : 1,h: 1},{x: 0, y: 1, w : 1,h: 1},{x: 1, y: 1, w : 1,h: 1},{x: 2, y: 1, w : 1,h: 1},{x: 3, y: 1, w : 1,h: 1},{x: 0, y: 2, w : 1,h: 1},{x: 1, y: 2, w : 1,h: 1},{x: 2, y: 2, w : 1,h: 1},{x: 3, y: 2, w : 1,h: 1}]},
        square15: {title: "3×5", rows:3, cols:5, units:[{x: 0, y: 0, w : 1,h: 1},{x: 1, y: 0, w : 1,h: 1},{x: 2, y: 0, w : 1,h: 1},{x: 3, y: 0, w : 1,h: 1},{x: 4, y: 0, w : 1,h: 1},{x: 0, y: 1, w : 1,h: 1},{x: 1, y: 1, w : 1,h: 1},{x: 2, y: 1, w : 1,h: 1},{x: 3, y: 1, w : 1,h: 1},{x: 4, y: 1, w : 1,h: 1},{x: 0, y: 2, w : 1,h: 1},{x: 1, y: 2, w : 1,h: 1},{x: 2, y: 2, w : 1,h: 1},{x: 3, y: 2, w : 1,h: 1},{x: 4, y: 2, w : 1,h: 1}]},
        square24: {title: "4×6", rows:4, cols:6, units:[{x: 0, y: 0, w : 1,h: 1},{x: 1, y: 0, w : 1,h: 1},{x: 2, y: 0, w : 1,h: 1},{x: 3, y: 0, w : 1,h: 1},{x: 4, y: 0, w : 1,h: 1},{x: 5, y: 0, w : 1,h: 1},{x: 0, y: 1, w : 1,h: 1},{x: 1, y: 1, w : 1,h: 1},{x: 2, y: 1, w : 1,h: 1},{x: 3, y: 1, w : 1,h: 1},{x: 4, y: 1, w : 1,h: 1},{x: 5, y: 1, w : 1,h: 1},{x: 0, y: 2, w : 1,h: 1},{x: 1, y: 2, w : 1,h: 1},{x: 2, y: 2, w : 1,h: 1},{x: 3, y: 2, w : 1,h: 1},{x: 4, y: 2, w : 1,h: 1},{x: 5, y: 2, w : 1,h: 1},{x: 0, y: 3, w : 1,h: 1},{x: 1, y: 3, w : 1,h: 1},{x: 2, y: 3, w : 1,h: 1},{x: 3, y: 3, w : 1,h: 1},{x: 4, y: 3, w : 1,h: 1},{x: 5, y: 3, w : 1,h: 1}]},
        prominent3: {title: "1＋2", rows:2, cols:3, units:[{x: 0, y: 0, w : 2,h: 2},{x: 2, y: 0, w : 1,h: 1},{x: 2, y: 1, w : 1,h: 1}]},
        prominent4: {title: "1＋3", rows:3, cols:4, units:[{x: 0, y: 0, w : 3,h: 3},{x: 3, y: 0, w : 1,h: 1},{x: 3, y: 1, w : 1,h: 1},{x: 3, y: 2, w : 1,h: 1}]},
        mix6: {title: "2＋4", rows:3, cols:4, units:[{x: 0, y: 0, w : 2,h: 2},{x: 2, y: 0, w : 2,h: 2},{x: 0, y: 2, w : 1,h: 1},{x: 1, y: 2, w : 1,h: 1},{x: 2, y: 2, w : 1,h: 1},{x: 3, y: 2, w : 1,h: 1}]},
        prominent7: {title: "1＋6", rows:3, cols:5, units:[{x: 0, y: 0, w : 3,h: 3},{x: 3, y: 0, w : 1,h: 1},{x: 4, y: 0, w : 1,h: 1},{x: 3, y: 1, w : 1,h: 1},{x: 4, y: 1, w : 1,h: 1},{x: 3, y: 2, w : 1,h: 1},{x: 4, y: 2, w : 1,h: 1}]},
        prominent9: {title: "1＋8", rows:3, cols:4, units:[{x: 0, y: 0, w : 2,h: 2},{x: 2, y: 0, w : 1,h: 1},{x: 3, y: 0, w : 1,h: 1},{x: 2, y: 1, w : 1,h: 1},{x: 3, y: 1, w : 1,h: 1},{x: 0, y: 2, w : 1,h: 1},{x: 1, y: 2, w : 1,h: 1},{x: 2, y: 2, w : 1,h: 1},{x: 3, y: 2, w : 1,h: 1}]},
        mix12: {title: "4＋8", rows:4, cols:6, units:[{x: 0, y: 0, w : 2,h: 2},{x: 2, y: 0, w : 2,h: 2},{x: 4, y: 0, w : 1,h: 1},{x: 5, y: 0, w : 1,h: 1},{x: 4, y: 1, w : 1,h: 1},{x: 5, y: 1, w : 1,h: 1},{x: 0, y: 2, w : 2,h: 2},{x: 2, y: 2, w : 2,h: 2},{x: 4, y: 2, w : 1,h: 1},{x: 5, y: 2, w : 1,h: 1},{x: 4, y: 3, w : 1,h: 1},{x: 5, y: 3, w : 1,h: 1}]},
        mix15: {title: "3＋12", rows:4, cols:6, units:[{x: 0, y: 0, w : 2,h: 2},{x: 2, y: 0, w : 2,h: 2},{x: 4, y: 0, w : 2,h: 2},{x: 0, y: 2, w : 1,h: 1},{x: 1, y: 2, w : 1,h: 1},{x: 2, y: 2, w : 1,h: 1},{x: 3, y: 2, w : 1,h: 1},{x: 4, y: 2, w : 1,h: 1},{x: 5, y: 2, w : 1,h: 1},{x: 0, y: 3, w : 1,h: 1},{x: 1, y: 3, w : 1,h: 1},{x: 2, y: 3, w : 1,h: 1},{x: 3, y: 3, w : 1,h: 1},{x: 4, y: 3, w : 1,h: 1},{x: 5, y: 3, w : 1,h: 1}]}
    }
};


// ocxPanel.setting 配置预览工具栏
var ocxPanel;
(function($){
    ocxPanel = {
        getScreenMode: function() {
            var screenMode = "wide",
                screenW = window.screen.width,
                screenH = window.screen.height;
            if(screenW/screenH < 16/9) //大于等于16:9的比例为宽屏
                screenMode = "normal";
            return screenMode;
        },
        init: function() {
            // 栅格选择
            $('#grids li').click(function(){
                $('#grids li.selected').not(this).removeClass('selected');
                $(this).toggleClass('selected');
            });

            var dm = $('#gridsModeGroup');
            dm.parent().addClass('screen-' + ocxPanel.getScreenMode());
            //加载栅格模板列表
            $('#gridsMode').bind('click', function(){
                var screenMode = ocxPanel.getScreenMode();
                //根据模板内容，绘制栅格选项
                var tempList = [],
                    htmlStr = "";
                dm.parent().addClass('screen-' + screenMode);
                tempList.push('<dl><dd>');
                tempList.push('<ul>');
                $.each(templates[screenMode], function(key, value){
                    tempList.push('<li><a href="#" class="act-grids-',key,'" data-trigger="monitor.grids" data-template="',key,'" data-quantity="',value.units.length,'"><span class="ico"></span><i></i></a><span>',value.title,'</span></li>')
                });
                tempList.push('</ul>');
                tempList.push('</dd></dl>');
                htmlStr = tempList.join('');
                dm.html(htmlStr);
            });

            // 栅格功能 初始化
            $('#grids').monitor();
            // 栅格切换
            dm.delegate('[data-trigger="monitor.grids"]', 'click', function(){
                var template = $(this).attr('data-template');
                $('#grids').monitor({templateName:template});
            });

            // 录像
            $('[data-trigger="monitor.record"]').click(function(){
                var filename = Math.floor(9999999 * Math.random()),folder = "file:///C:/";
                ocxPanel.video.record(filename,folder);
                return false;
            });
            // 抓图
            $('[data-trigger="monitor.capture"]').click(function(){
                var filename = Math.floor(9999999 * Math.random()),folder = "file:///C:/";
                ocxPanel.picture.capture(filename,folder,1,5);
                return false;
            });
            // 全屏功能
            $('[data-trigger="monitor.fullscreen"]').click(function(){
                if($(this).hasClass('selected')){
                    $('body').removeClass('fullscreen');
                    $(this).removeClass('selected');
                    $(this).attr('title','全屏').tipsy();
                }else{
                    // Get the client screen size
                    var windowHeight = window.screen.height;
                    var windowWidth  = window.screen.width;
                    // Resize the client browser to fit in client screen
                    window.resizeTo(windowWidth, windowHeight);
                    window.moveTo(0,0);
                    $('body').addClass('fullscreen');
                    //$(selected).parents('.monitor-container').before('<div class="monitor-fullscreen-container">'+$(selected).html()+'</div>');
                    $(this).addClass('selected');
                    $(this).attr('title','取消全屏').tipsy();
                }
                $(window).trigger('resize');
            });
            $('[data-trigger="monitor.config"]').click(function () {
                ocxPanel.setting.load();
                return false;
            });
        },
        video: {
            record: function(filename,folder) {
                var result,html = [];
                html.push('<div class="block block-msg">');
                html.push('<div class="bd">');
                html.push('<h6>',filename,'.jpg</h6>');
                html.push('<p><a href="',folder,'" target="_blank"><span class="ico i-folder-open"></span><span>打开目录</span></a></p>');
                html.push('<p><a href="#"><span class="ico i-video-play"></span><span>播放录像</span></a></p>');
                html.push('</div></div>');
                result = html.join('');
                $.sticky(result,{type:"st-msg st-video",position:"bottom-right",html:true,target:'_self'});
            }
        },
        picture: {
            capture: function(filename,folder,current,total) {
                var result,html = [];
                html.push('<div class="block block-msg">');
                html.push('<div class="bd">');
                html.push('<h6>',Math.floor(9999999 * Math.random()),'.jpg</h6>');
                html.push('<p><a href="',folder,'" target="_blank"><span class="ico i-folder-open"></span><span>打开目录</span></a></p>');
                html.push('<p><a href="',folder,filename,'"><span class="ico i-pic-edit"></span><span>编辑图片</span></a></p>');
                html.push('<div class="pagination"><ul class="pages"><li class="prev"><a href="#" class="disabled"><span class="ico i-prev"></span></a></li><li>',current,'/',total,'</li><li class="next"><a href="#"><span class="ico i-next"></span></a></li></ul></div>');
                html.push('</div></div>');
                result = html.join('');
                $.sticky(result,{type:"st-msg st-picture",position:"bottom-right",id:"abc",autoclose:false,html:true,target:'_self'},function(e){});
            }
        },
        setting: {
            load: function() {
                $.ajax({
                    url: 'settings.html',
                    success: function(data){
                        $('body').append(data);
                        // 系统设置
                        $('#settingDialog').dialog({
                            autoOpen: false,
                            modal: true,
                            width: 640,
                            height: 500,
                            buttons: {
                                "restore": {
                                    text: '恢复默认',
                                    'class': 'floatL',
                                    click: function() {

                                    }
                                },
                                "ok": {
                                    text: '确认',
                                    'class': 'bPrimary',
                                    click: function () {
                                        var result = ocxPanel.setting.save();
                                        if(result) {
                                            $(this).dialog("destroy");
                                            $(this).remove();
                                        }
                                    }
                                },
                                "cancel": {
                                    text: '取消',
                                    click: function () {
                                        $(this).dialog("destroy");
                                        $(this).remove();
                                    }
                                }
                            },
                            close: function(){
                                $(this).dialog("destroy");
                                $(this).remove();
                            }
                        });
                        $('#settingDialog').dialog('open');
                    }
                });
                //TODO:Ajax加载系统配置的页面；
            },
            save: function() {
                $.sticky("保存预览工具栏配置失败！",{type:"st-error"});
                //TODO:这里设置工具栏，并保存到cookie中。
                return false;
            }
        }
    }
})(jQuery);

// Monitor 栅格系统组件
(function($){
    /*  Variables  */
    $.fn.monitor = function(settings){
        var base = this,
            element = $(this),
            settings = $.extend({}, $.fn.monitor.defaults, settings);

        base.init = function(){
            $('#grids').unbind('resize').bind('resize',function(){
                _resize();
            });
            setTimeout(_resize,100);
            // need jquery.ui.swappable plugin
            if(settings.swappable){
                base.swappable();
            }
            settings.templates = templates || {};
            settings.screen = ocxPanel.getScreenMode() || "normal";
            if(settings.templateName == "") {
                switch (settings.screen) {
                    case "normal":
                        settings.templateName = "square4";
                        break;
                    case "wide":
                        settings.templateName = "square6";
                        break;
                    default:
                        settings.screen = "normal";
                        settings.templateName = "square4";
                }
            }
            // 更新样式
            $('[data-trigger="monitor.grids"]').removeClass('selected');
            $('[data-template="' + settings.templateName + '"]').addClass('selected');
            // 更新btn-group的图标样式
            var cls = $('#gridsMode').attr('class') || "";
            var classname = cls.split(' ') || [],
                str = 'act-grids-';
            $(classname).each(function(idx,item){
                if(item.indexOf(str) > -1) {
                    str = item;
                }
            });
            classname.splice($.inArray(str,classname),1);
            classname.push('act-grids-' + settings.templateName);
            $('#gridsMode').attr('class',classname.join(' '));
        };
        var _resize = function(){
            var template = [],
                children = element.children(settings.items),
                fullwidth = element.css("width","100%").width(),
                fullheight = element.css("height","100%").height();
            if(settings.templateCustom && settings.templateData.units && settings.templateData.units.length > 0){
                template = settings.templateData;
            }else if(settings.templates[settings.screen]){
                template = settings.templates[settings.screen][settings.templateName] || [];
            }
            element.children(settings.items).show();
            if(template.length > 1)
                element.children(settings.items+":gt("+(template.length-1)+")").hide();
            if(settings.zoomin || settings.templateName == 'square1') {
                var liE = $(children[settings.index]);
                if(settings.templateName == 'square1' && $(settings.items + '.selected', element).length > 0) {
                    liE = $(settings.items + '.selected', element)[0];
                }
                $(children).attr({"style":"display:none"});
                $(liE).show().css({"position":"absolute","float":"none","left":0,"top":0,"width":fullwidth,"height":fullheight});
            }else{
                $(children).each(function(i,item){
                    if(template.units && i < template.units.length){
                        var r = template.rows, c = template.cols, x = template.units[i].x, y = template.units[i].y, w = template.units[i].w, h = template.units[i].h,
                            left = (parseInt((x/c) * Math.pow(10,12))/Math.pow(10,12))*fullwidth,
                            top = (parseInt((y/r) * Math.pow(10,12))/Math.pow(10,12))*fullheight,
                            width = (parseInt((w/c) * Math.pow(10,12))/Math.pow(10,12))*fullwidth,
                            height = (parseInt((h/r) * Math.pow(10,12))/Math.pow(10,12))*fullheight;
                        $(item).show().css({"position":"absolute","float":"none","left":left,"top":top,"width":width,"height":height});
                    }else{
                        $(item).hide();
                    }
                });
            }
            $(element).css({visibility:"visible"});
        };
        base.swappable = function(){

        };
        // Entry point
        base.init();
    };
    /*  Default Settings  */
    $.fn.monitor.defaults = {
        templates:          {},
        swappable:          true,//need jquery.ui.swappable plugin
        swappableitems:     'li',//for swappable options
        items:              'li',//for grid item
        screen:             'normal',
        templateName:       '',
        zoomin:             false,
        index:              0,
        templateCustom:     false,
        templateData:      {rows:0, cols:0, units:[]}
    };
})(jQuery);
