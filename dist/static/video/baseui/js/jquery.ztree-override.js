/**
 * @fileOverview zTree组件重写
 * @author yangyu
 * @description ztree {@link http://www.ztree.me/v3/main.php#_zTreeInfo}
 */
(function($) {
    if(!$.fn.zTree)
        return;
    var zSetting = {
        view : {
            showIcon : true
        },
        data : {
            simpleData : {
                enable : true,
                pIdKey : 'parentId'
            },
            key : {
                name : "label"
            }
        },
        initBigData: false
    };
    var data = $.fn.zTree._z.data, consts = $.fn.zTree.consts;
    var view = $.fn.zTree._z.view;
    var tools = $.fn.zTree._z.tools,handler = $.fn.zTree._z.handler;
    var _initData = function (setting, level, nodes, parentNode,isFirstNode, isLastNode,openFlag ) {
        data.initNode(setting, level, nodes, parentNode, isFirstNode, isLastNode, openFlag);
        data.addNodeCache(setting, nodes);
        setting.initBigData &&(nodes._initNodeAttr = true);
        },
        _beforeExpand = function (setting, parentNode) {
        if (!parentNode || parentNode._initNode) {
            return;
        }
        parentNode._initNode = true
        var childKey = setting.data.key.children,
            children = parentNode[childKey]  || [],
            i=0,level=parentNode.level,
            child, len;
        for (len=children.length; i < len; i++) {
            child = children[i]
            if (!child._initNodeAttr) {

                var tmpPNode = (parentNode) ? parentNode : data.getRoot(setting), tmpPChild = tmpPNode[childKey], isFirstNode = ((tmpPChild.length == parentNode.length) && (i == 0)), isLastNode = (i == (parentNode.length - 1));
                _initData(setting, level, child, parentNode, isFirstNode, isLastNode, true)

            }

            if (child[childKey]&&child[childKey].length > 0) {
                _beforeExpand(setting, child);
            }
        }
    }
    data.exSetting(zSetting);

    data.getTreeCheckedNodes = function(setting, nodes, checked, results) {
        if (!nodes)
            return [];
        var childKey = setting.data.key.children, checkedKey = setting.data.key.checked, onlyOne = (checked && setting.check.chkStyle == consts.radio.STYLE && setting.check.radioType == consts.radio.TYPE_ALL);
        results = !results ? [] : results;
        for ( var i = 0, l = nodes.length; i < l; i++) {
            if (nodes[i].nocheck !== true && (setting.check.getCheckedNodesIgnore === true || nodes[i].chkDisabled !== true) && nodes[i][checkedKey] == checked) {
                results.push(nodes[i]);
                if (onlyOne) {
                    break;
                }
            }
            data.getTreeCheckedNodes(setting, nodes[i][childKey], checked, results);
            if (onlyOne && results.length > 0) {
                break;
            }
        }
        return results;
    };
    data.getNodeCacheId = function(tId) {
        return tId;// .substring(tId.lastIndexOf("_")+1);
    };
    data.addInitNode(function(setting, level, n, parentNode, isFirstNode, isLastNode, openFlag) {
        if (n.id) {
            n.tId = setting.treeId + "_id_" + (n.id);
        }
        if (n.extra && n.extra.disablecls && setting.check && setting.check.enable && setting.check.autoDisabledCheck) {
            n.chkDisabled = true;
        }
    });

    data.addZTreeTools(function(setting, zTreeTools) {
        zTreeTools.getNodeById = function(id) {
            return this.getNodeByTId(this.setting.treeId + "_id_" + id)
        };
        zTreeTools.setSonNodeCheckBox = function(node, value, srcNode, fIndex) {
            return view.setSonNodeCheckBox(this.setting, node, value, srcNode, fIndex);
        };
        zTreeTools.setNodeDisabled = function(id, disable) {
            if (disable) {
                $('#' + this.setting.treeId + "_id_" + id + " a").addClass('disabledNode');
            } else {
                $('#' + this.setting.treeId + "_id_" + id + " a").removeClass('disabledNode');
            }
        }
    });

    view.makeNodeIcoClass = function(setting, node) {
        var icoCss = [ "ico" ];
        if (!node.isAjaxing) {
            icoCss[0] = (node.cls ? node.cls + "_" : "") + icoCss[0];
            if (node.isParent) {
                icoCss.push(node.open ? consts.folder.OPEN : consts.folder.CLOSE);
            } else {
                icoCss.push(consts.folder.DOCU);
            }
        }
        return "button " + icoCss.join('_');
    };
    view.makeDOMNodeNameBefore = function(html, setting, node) {
        var title = data.getNodeTitle(setting, node), url = view.makeNodeUrl(setting, node), fontcss = view.makeNodeFontCss(setting, node), fontStyle = [];
        for ( var f in fontcss) {
            if(fontcss.hasOwnProperty(f))
                fontStyle.push(f, ":", fontcss[f], ";");
        }

        var disableCls = "";
        var selectedCls = "";
        if (node.extra) {
            if (node.extra.disablecls) {
                disableCls = node.extra.disablecls;
            }
            if (node.extra.selectedcls) {
                selectedCls = node.extra.selectedcls;
                data.addSelectedNode(setting, node);
            }
        }
        if (node.chkDisabled) {
            disableCls = node.chkDisabled ? 'disabledNode' : '';
        }
        html.push("<a id='", node.tId, consts.id.A, "' " + (disableCls == 'disabledNode' ? "disabled='disabled'" : "") + " class='level", node.level, ' ', disableCls, ' ', selectedCls, "' treeNode",
            consts.id.A, " onclick=\"", (node.click || ''), "\" ", ((url != null && url.length > 0) ? "href='" + url + "'" : ""), " target='", view.makeNodeTarget(node), "' style='", fontStyle
                .join(''), "'");
        if (tools.apply(setting.view.showTitle, [ setting.treeId, node ], setting.view.showTitle) && title) {
            html.push("title='", title.replace(/'/g, "&#39;").replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/,'&amp;'), "'");
        }
        html.push(">");
    };

    view.appendNodes = function(setting, level, nodes, parentNode, initFlag, openFlag){
        if (!nodes) return [];
        var html = [],
            childKey = setting.data.key.children;
        for (var i = 0, l = nodes.length; i < l; i++) {
            var node = nodes[i];
            if (initFlag || (setting.initBigData &&!node._initNodeAttr)) {
                var tmpPNode = (parentNode) ? parentNode: data.getRoot(setting),
                    tmpPChild = tmpPNode[childKey],
                    isFirstNode = ((tmpPChild.length == nodes.length) && (i == 0)),
                    isLastNode = (i == (nodes.length - 1));
                data.initNode(setting, level, node, parentNode, isFirstNode, isLastNode, openFlag);
                data.addNodeCache(setting, node);
                setting.initBigData &&(node._initNodeAttr = true);
            }

            var childHtml = [];
            if (node[childKey] && node[childKey].length > 0 && (!setting.initBigData || node.open)) {
                //make child html first, because checkType
                childHtml = view.appendNodes(setting, level + 1, node[childKey], node, initFlag, openFlag && node.open);
            }
            if (openFlag) {

                view.makeDOMNodeMainBefore(html, setting, node);
                view.makeDOMNodeLine(html, setting, node);
                data.getBeforeA(setting, node, html);
                view.makeDOMNodeNameBefore(html, setting, node);
                data.getInnerBeforeA(setting, node, html);
                view.makeDOMNodeIcon(html, setting, node);
                data.getInnerAfterA(setting, node, html);
                view.makeDOMNodeNameAfter(html, setting, node);
                /* added by Nick liufc */
                view.makeDOMNodeGrid(html, setting, node);
                data.getAfterA(setting, node, html);
                if (node.isParent && node.open) {
                    view.makeUlHtml(setting, node, html, childHtml.join(''));
                }
                view.makeDOMNodeMainAfter(html, setting, node);
                data.addCreatedNode(setting, node);
            }
        }
        return html;
    }

    view.makeDOMNodeGrid = function(html, setting, node) {

        if (setting.view.gridtree) {
            html.push('<div class="extra-row">');
            if (node.extra.opdata && node.extra.opdata.length > 0) {
                for ( var i = 0; i < node.extra.opdata.length; i++) {
                    var opitem = node.extra.opdata[i];
                    html.push('<span class="col"><span class="check"><label><input id="', opitem.opCode, node.id, opitem.opId, '" name="', opitem.opCode, node.id, '" opCode="', opitem.opCode,
                        '"', '" type="', opitem.type, '" group-id="', node.id, '" init-check="', opitem.checked, '"', (opitem.checked == true ? " checked" : ""),
                        (opitem.disable == true ? " disabled" : ""), '>', opitem.opName, '</label></span></span>');
                }
            }
            html.push('</div>');
        }
    }

    view.asyncNode = function(setting, node, isSilent, callback) {
        var i, l;
        if (node && !node.isParent) {
            tools.apply(callback);
            return false;
        } else if (node && node.isAjaxing) {
            return false;
        } else if (tools.apply(setting.callback.beforeAsync, [setting.treeId, node], true) == false) {
            tools.apply(callback);
            return false;
        }
        if (node) {
            node.isAjaxing = true;
            var icoObj = $(node, consts.id.ICON, setting);
            icoObj.attr({"style":"", "class":consts.className.BUTTON + " " + consts.className.ICO_LOADING});
        }

        var tmpParam = {};
        for (i = 0, l = setting.async.autoParam.length; node && i < l; i++) {
            var pKey = setting.async.autoParam[i].split("="), spKey = pKey;
            if (pKey.length>1) {
                spKey = pKey[1];
                pKey = pKey[0];
            }
            tmpParam[spKey] = node[pKey];
        }

        var _otherParam = setting.async.otherParam;//by nihaifeng start
        if($.isFunction(_otherParam)){
            _otherParam = _otherParam();
        }else{
            _otherParam = setting.async.otherParam;
        }

        if (tools.isArray(_otherParam)) {
            for (i = 0, l = _otherParam.length; i < l; i += 2) {
                tmpParam[_otherParam[i]] = _otherParam[i + 1];
            }
        } else {
            for (var p in _otherParam) {
                tmpParam[p] = _otherParam[p];
            }
        }

        var _tmpV = data.getRoot(setting)._ver;
        $.ajax({
            contentType: setting.async.contentType,
            cache: false,
            type: setting.async.type,
            url: tools.apply(setting.async.url, [setting.treeId, node], setting.async.url),
            data: tmpParam,
            dataType: setting.async.dataType,
            success: function(msg) {
                if (_tmpV != data.getRoot(setting)._ver) {
                    return;
                }
                var newNodes = [];
                try {
                    if (!msg || msg.length == 0) {
                        newNodes = [];
                    } else if (typeof msg == "string") {
                        newNodes = eval("(" + msg + ")");
                    } else {
                        newNodes = msg;
                    }
                } catch(err) {
                    newNodes = msg;
                }

                if (node) {
                    node.isAjaxing = null;
                    node.zAsync = true;
                }
                view.setNodeLineIcos(setting, node);
                if (newNodes && newNodes !== "") {
                    newNodes = tools.apply(setting.async.dataFilter, [setting.treeId, node, newNodes], newNodes);
                    view.addNodes(setting, node, !!newNodes ? tools.clone(newNodes) : [], !!isSilent);
                } else {
                    view.addNodes(setting, node, [], !!isSilent);
                }
                setting.treeObj.trigger(consts.event.ASYNC_SUCCESS, [setting.treeId, node, msg]);
                tools.apply(callback);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                if (_tmpV != data.getRoot(setting)._ver) {
                    return;
                }
                if (node) node.isAjaxing = null;
                view.setNodeLineIcos(setting, node);
                setting.treeObj.trigger(consts.event.ASYNC_ERROR, [setting.treeId, node, XMLHttpRequest, textStatus, errorThrown]);
            }
        });
        return true;
    }

    handler.onSwitchNode = function(event, node) {

        var setting = data.getSetting(event.data.treeId);
        if (node.open) {
            if (tools.apply(setting.callback.beforeCollapse, [ setting.treeId, node ], true) == false)
                return true;
            data.getRoot(setting).expandTriggerFlag = true;
            view.switchNode(setting, node);
        } else {

            _beforeExpand(setting, node)

            if (tools.apply(setting.callback.beforeExpand, [ setting.treeId, node ], true) == false)
                return true;
            data.getRoot(setting).expandTriggerFlag = true;
            view.switchNode(setting, node);
        }
        return true;
    }

    handler.onZTreeMousedown = function(event, node) {

        var setting = data.getSetting(event.data.treeId);
        var t = $(event.target).closest('li').attr('id');
        _beforeExpand(setting, data.getNodeCache(setting, t))
        if (setting && node && (setting.relationDisabledEvent !== false) && node.chkDisabled)//by nihf
            return true;
        if (tools.apply(setting.callback.beforeMouseDown, [ setting.treeId, node ], true)) {
            tools.apply(setting.callback.onMouseDown, [ event, setting.treeId, node ]);
        }
        return true;
    }

    var setSonNodeCheckBox = function(setting, node, value, srcNode, fIndex) {
        if (!node){
            return;
        }
        if (fIndex == null) {
            fIndex = -1;
        }
        var childKey = setting.data.key.children, checkedKey = setting.data.key.checked, checkObj = $("#" + node.tId + consts.id.CHECK);
        if (!srcNode)
            srcNode = node;

        var hasDisable = false;
        if (node[childKey] && (fIndex != 0)) {
            var chkDisabledCheckedInherit = setting.check.chkDisabledCheckedInherit || node.chkDisabled !== true;
            for ( var i = 0, l = node[childKey].length; i < l && chkDisabledCheckedInherit; i++) {
                var sNode = node[childKey][i];
                setSonNodeCheckBox(setting, sNode, value, srcNode, fIndex - 1);
                if (sNode.chkDisabled === true)
                    hasDisable = true;
            }
        }
        if (node != data.getRoot(setting) && node.chkDisabled !== true) {
            if (hasDisable && node.nocheck !== true) {
                data.makeChkFlag(setting, node);
            }
            if (node.nocheck !== true && node.chkDisabled !== true) {
                node[checkedKey] = value;
                if (!hasDisable)
                    node.check_Child_State = (node[childKey] && node[childKey].length > 0) ? (value ? 2 : 0) : -1;
            } else {
                node.check_Child_State = -1;
            }
            view.setChkClass(setting, checkObj, node);
            if (setting.check.autoCheckTrigger && node != srcNode && node.nocheck !== true && node.chkDisabled !== true) {
                setting.treeObj.trigger(consts.event.CHECK, [ null, setting.treeId, node ]);
            }
        }
    };
    view.setSonNodeCheckBox = function(setting, node, value, srcNode, fIndex) {
        setSonNodeCheckBox(setting, node, value, srcNode, fIndex);
        view.repairParentChkClassWithSelf(setting, node);
    };


    var seq = 1;
    /**
     * @class
     * @desc
     * <a href="http://www.ztree.me/v3/api.php" target="_blank">api详见http://www.ztree.me/v3/api.php  </a>
     * @param {object} setting -同ztree的配置
     * @param {array} zNodes -可选的，用户可以配置ajax来取得数据。其中两个属性与zTree官网稍有不一致，name（封装前）---label（封装后）,pId（封装前）---parantId（封装后）
     * @example
     * 1.setting含ajax，初始数据由ajax来取得
     * ajax发送回来，共有如下几个回调
     * var settings = {
     *      ajax : {
     *          url : 'getTree.json'
     *      },
     *      callback : {
     *          beforeTreeLoad : function(){},
     *          dataEmpty : function(){},
     *          beforeInitNode : function(){},
     *         initNode : function(){}
     *      }
     * }
     * 2.setting不含ajax，默认走zTree的逻辑
     *  $("#zTreea").tree(settings);
     */
    $.fn.tree = function(setting, zNodes) {
        if (setting == null) {
            var treeId = this.attr('id');
            return $.fn.zTree.getZTreeObj(treeId);
        }
        if (setting.ajax) {
            var result, childKey;
            if (!(setting.async && setting.async.enable)) {
                result = $.fn.zTree.init(this, setting, zNodes);
                childKey = result.setting.data.key.children;
            }

            var self = this;
            var success = setting.ajax.success;
            var error = setting.ajax.error;
            var _setting, _root, _tools, _data, _view;

            /** @ignore*/
            function handleSetting() {
                _setting = result.setting;
                _root = _setting.treeObj.zTree._z.data.getRoot(result.setting);
                _tools = _setting.treeObj.zTree._z.tools;
                _data = _setting.treeObj.zTree._z.data;
                _view = _setting.treeObj.zTree._z.view;
            }
            /** @ignore*/
            function errorHandle(errorMsg) {
                self.hide();
                self.parent().find('.msg-tips.nodata').remove();
                self.parent().append('<DIV class="msg-weak msg-tips nodata"><I></I><DIV class=msg-cnt><SPAN>' + language.text('tree.noData')+ '</SPAN> </DIV></DIV>');
            }
            var cseq = seq++;
            $.extend(setting.ajax, {
                dataType : 'json',
                success : function(zNodes) {
                    var nseq = self.data('treeSeq');
                    if (nseq != null) {
                        if (nseq > cseq) {
                            return;
                        }
                    }
                    self.data('treeSeq', cseq);
                    if (setting.callback && setting.callback.beforeTreeLoad) {
                        if (setting.callback.beforeTreeLoad.call(zNodes) === false) {
                            return;
                        }
                    }
                    zNodes = this.handleData ? this.handleData(zNodes) : zNodes;
                    if (zNodes == null || $.isEmptyObject(zNodes) || ($.isArray(zNodes) && zNodes.length === 0)) {
                        errorHandle();
                        if (setting.callback && setting.callback.dataEmpty)
                            setting.callback.dataEmpty.call();
                        return;
                    }
                    self.show();
                    if (setting.async && setting.async.enable) {
                        if (setting.callback && setting.callback.beforeInitNode) {
                            if (setting.callback.beforeInitNode.call(result, _root[childKey]) === false) {
                                return;
                            }
                        }
                        result = $.fn.zTree.init(self, setting, zNodes);
                        handleSetting();
                        if (success) {
                            success.apply(this, arguments);
                        }
                        if (_setting.callback && _setting.callback.initNode) {
                            _setting.callback.initNode.call(result, _root[childKey]);
                        }
                    } else {
                        handleSetting();
                        zNodes = zNodes ? _tools.clone(_tools.isArray(zNodes) ? zNodes : [ zNodes ]) : [];
                        if (_setting.data.simpleData.enable) {
                            _root[childKey] = _data.transformTozTreeFormat(_setting, zNodes);
                        } else {
                            _root[childKey] = zNodes;
                        }
                        // _root[childKey][0] && (_root[childKey][0].open =
                        // true);qwer

                        if (_setting.callback.beforeInitNode && _setting.callback.beforeInitNode.call(result, _root[childKey]) === false) {
                            return;
                        }
                        _view.createNodes(_setting, 0, _root[childKey]);
                        if (success) {
                            success.apply(this, arguments);
                        }
                        if (_setting.callback.initNode) {
                            _setting.callback.initNode.call(result, _root[childKey]);
                        }
                    }
                },
                error : function() {
                    errorHandle("错误");
                    if (error) {
                        error.apply(this, arguments);
                    }
                }
            });

            $.ajax(setting.ajax);


            return result;
        } else {
            return $.fn.zTree.init(this, setting, zNodes);
        }
    }


    /**
     * @class
     * @desc
     * 封装的搜索树
     * @property {string} zTreeId -对应搜索树的id
     * @property {string} key -从ztree的哪个属性去搜索
     * @property {string} searchBtn -点击设置的按钮，最好能保证其唯一性
     * @property {boolean} sync -true:表示从本地搜索;false:
     * @property {string} searchUrl -搜索请求的url
     * @example
     * $('#search').searchZtree({
     *    zTreeId: '#zTreea',
     *    key: 'label',
     *    searchBtn: '#searchB',
     *    sync: false,// 同步true， 异步false
     *    searchUrl: '../docs/assets/js/tree3.json'
     * })
     */
    $.fn.searchZtree = function (options) {
        var options = options || {},
            elem = this,
            sync = options.sync != null ? options.sync : true,
            ztreeId = options.zTreeId.replace(/^#/, ''),
            cls = options.cls || 'highlight',
            id = '#' + ztreeId,
            data = {
                init: false
            };
        function handleSync(key, value) {
            var tree = $(id),
                treeObj = $.fn.zTree.getZTreeObj(ztreeId),
                nodeList;
            tree.find('.' + cls).removeClass(cls);

            if (value == '') {
                return;
            }
            nodeList = treeObj.getNodesByParamFuzzy(key, value);
            if (nodeList && nodeList.length > 0) {
                updateNodes(treeObj, nodeList);
            } else {}
        }

        function updateNodes(treeObj, nodeList) {
            var pnode, node;
            for( var i=0; i<nodeList.length;  i++) {

                node = nodeList[i]
                while ((pnode=treeObj.getNodesByParam('id', node.parentId)) && pnode[0]) {
                    treeObj.expandNode(pnode[0], true, false, false)
                    node=pnode[0]
                }
                $('#' + nodeList[i].tId + '_a').addClass(cls)
            }
        }

        function initData(treeObj) {
            var elem = $(id), reg;
            data.init = true;
            data.setting = treeObj.setting;
            data.data =  $.fn.zTree._z.tools.clone(treeObj.getNodes());
        }

        function recoveryTree() {
            data.init = false;
            $.fn.zTree.init($(id), data.setting, data.data);
        }


        function handleAync (key, value) {
            var treeObj = $.fn.zTree.getZTreeObj(ztreeId),
                sets = treeObj.setting,
                ajaxUrl = sets.async.url,
                oparam = sets.async.otherParam,
                callback = sets.callback = sets.callback || {},
                suc = callback.onAsyncSuccess;

            callback.onAsyncSuccess = function () {
                $.isFunction(suc) && suc.apply(this, arguments);
                sets.async.url = ajaxUrl;
                sets.async.otherParam = oparam;
                callback.onAsyncSuccess = suc;
                handleSync(key, value);
            };

            if (value == '') {
                if (data.init) {
                    return recoveryTree()
                }
                return;
            }

            if (!data.init) {
                initData(treeObj)
            }

            sets.async.url = options.searchUrl || sets.ajax.url;
            sets.async.enable = true;
            sets.async.type = "post";
            sets.async.otherParam = $.extend(true, ($.isArray(oparam) ? ['searchVal', value, 'searchKey', key]: {
                'searchVal': value,
                'searchKey': key
            }), oparam );
            treeObj.reAsyncChildNodes(null, "refresh");
        }

        elem.bind('searchZtree', function (event) {
            var val = $.trim(elem.val());

            if (val != data.val) {
                data.val = val;
            } else {
                return;
            }

            if (sync) {
                handleSync(options.key, val);
            } else {
                handleAync(options.key, val);
            }
        });

        elem.bind('keyup', function (event) {
            if (event.keyCode == 13) {
                $(this).trigger('searchZtree')
            }
        });

        if (options.searchBtn) {
            $(options.searchBtn).bind('click', function () {
                elem.trigger('searchZtree');
            });
        }
    }

})(jQuery);
