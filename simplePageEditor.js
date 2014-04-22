/*
 * 简单切图网页生成系统javascript主程序 v1.0.3
 * 请在jQuery环境下执行
 *
 * Copyright GZL International Travel Sevice Ltd.
 *
 * Date: Sat Oct 5 2013
 * Writen by jamieTsang 331252914@qq.com 
 */
$(function () {
    //声明
    var _body = $('body');
    var _static = $('#static');
    var $childClick = $('.childClick', '#pannel');
    var $addClick = $('.addClick', '#pannel');
    var $editCount = $('#editCount', '#pannel');
    var $createLink = $('#createLink');
    //var $dataCont=$('#dataCont');
    //工具函数
    //获取文件夹名
    var address = Page.getDocumentName();
    //数组转json
    function join(arr) {
        if (arr) {
            var str = "{";
            for (name in arr) {
                str += name + ':\'' + arr[name] + '\',';
            }
            return str = str.substr(0, str.length - 1) + '}';
        } else {
            return null;
        }
    }
    //链接字符串
    function addNodeString(str1, str2) {
        var arr = str1.split(",");
        arr.push(str2);
        return arr.join(",");
    }
    //产生随机数
    function randomNum(n) {
        return Math.floor(Math.random() * Math.pow(10, n)).toString();
    }
    //宽高顶左设置
    function whtlValue(t) {
        var width = t.find('width').text();
        var height = t.find('height').text();
        var top = t.find('top').text();
        var left = t.find('left').text();
        return 'width:' + width + 'px;height:' + height + 'px;top:' + top + 'px;left:' + left + 'px;';
    };
    //字体css设置
    function fontStyle(t) {
        var fs = {}
        fs.ff = t.find('font-family').text();
        fs.fz = t.find('font-size').text();
        fs.fw = t.find('font-weight').text();
        fs.cl = t.find('color').text().replace("#", "");
        return 'font-family:"' + fs.ff + '";font-size:' + fs.fz + 'px;font-weight:' + fs.fw + ';color:#' + fs.cl;
    };
    //字体值返回
    function fontStyleValue(t) {
        var fsv = {}
        fsv.ff = t.find('font-family').text();
        fsv.fz = t.find('font-size').text();
        fsv.fw = t.find('font-weight').text();
        fsv.cl = t.find('color').text().toUpperCase().replace("#", "");
        return fsv;
    };
    //建立线路对象
    function childString(i) {
        var c = new Array();
        c['title'] = '<h2 class="title inner posa draggableChild" childNode="' + i + '" objectType="title" className="title"><div class="static"><span class="tagTips posa">标题{$title}</span><a id="closeChild" class="close posa db">x</a><div id="content">读取线路信息失败</div></div></h2>';
        c['price'] = '<div class="price inner posa draggableChild" childNode="' + i + '" objectType="price" className="price"><div class="static"><span class="tagTips posa">价格{$price}</span><a id="closeChild" class="close posa db">x</a><div id="content">NaN</div></div></div>';
        c['link'] = '<a href="javascript:void(0);" class="link db inner posa draggableChild" childNode="' + i + '" objectType="link" className="link"><div class="static"><span class="tagTips posa">按钮{$link}</span><div id="closeChild" class="close posa db">x</div></div></a>';
        return c;
    }
    //建立备注 para1:起点 para2:次数
    function childRemarkString(k, s, i) {
        var c = "";
        for (j = 0; j < i; j++) {
            c += '<div class="remark remark' + (j + s) + ' inner posa draggableChild" objectType="remark" childNode="' + (k + j) + '" objectNum="' + (j + s) + '" className="remark' + (j + s) + '"><div class="static"><span class="tagTips posa">备注{$remark#' + (j + s) + '}</span><a id="closeChild" class="close posa db">x</a><div id="content">读取线路信息失败</div></div></div>';
        }
        return c;
    }
    //更新修改数字
    function editCount() {
        var objLength = 0;
        for (var i in obj) {
            objLength++;
        }
        $editCount.text(objLength);
        //console.log(obj);
        return objLength;
    }
    /*RGB颜色转换为16进制*/
    String.prototype.colorHex = function () {
        var that = this;
        if (/^(rgb|RGB)/.test(that)) {
            var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
            var strHex = "#";
            for (var i = 0; i < aColor.length; i++) {
                var hex = Number(aColor[i]).toString(16);
                if (hex === "0") {
                    hex += hex;
                }
                if (hex.length < 2) {
                    hex = "0" + hex;
                }
                strHex += hex;
            }
            if (strHex.length !== 7) {
                strHex = that;
            }
            return strHex;
        } else if (reg.test(that)) {
            var aNum = that.replace(/#/, "").split("");
            if (aNum.length === 6) {
                return that;
            } else if (aNum.length === 3) {
                var numHex = "#";
                for (var i = 0; i < aNum.length; i += 1) {
                    numHex += (aNum[i] + aNum[i]);
                }
                return numHex;
            }
        } else {
            return that;
        }
    };
    //声明信息
    var nowDate = new Date();
    var ampm = nowDate.getHours();
    var min = nowDate.getMinutes();
    var update = "本页面产品信息仅供参考，由于报名位置实时变动，最终价格及可报位置数量以支付时为准。此页面中产品信息最后更新时间：" + nowDate.getFullYear() + "年" + (nowDate.getMonth() + 1) + "月" + (nowDate.getDay() + 1) + "日 " + (ampm < 12 ? "上午" : "下午") + " " + (ampm < 10 ? "0" + ampm : (ampm > 12 ? ampm - 12 : ampm)) + ":" + (min < 10 ? "0" + min : min);

    //编辑面板
    var pannel = '<div id="loading_unit"><h1>正在保存...</h1><p></p><h2>如长时间无响应，请刷新页面重新保存</h2></div>';
    _body.append(pannel);

    //字体
    var fonts = [{ key: '微软雅黑', val: 'Microsoft YaHei' }, { key: '宋体', val: 'SimSun' }, { key: 'Impact', val: 'Impact' }, { key: 'Arial', val: 'Arial' }, { key: 'Verdana', val: 'Verdana' }, { key: 'Georgia', val: 'Georgia'}]

    //初始化
    var obj = [];
    var coypboard = null;
    var remarkCount = 0;
    var lineClass = [];
    //判断用户
    Page.checkAccout(creatXHR);
    //初始化，ajax读取数据
    function creatXHR() {
        if (address == "" || address == null) {
            alert("参数无效");
        } else {
            $.ajax({
                type: "GET",
                url: '/subject/' + address + '/datas/page.config.xml?t=' + Math.random(),
                dataType: 'xml',
                //async: "Ture",
                timeout: 20000,
                error: function (XMLHttpRequest, strError, strObject) {
                    alert("亲,加载xml失败,请检查路径是否正确！");
                },
                success: function (xml) {
                    var css = '';
                    $(xml).find('class').children().each(function (i, e) {
                        var t = $(e);
                        var type = e.nodeName;
                        switch (type) {
                            case "title":
                                var lh = t.find('line-height').text();
                                css += '.title{line-height:' + lh + 'px;' + whtlValue(t) + fontStyle(t) + '}';
                                lineClass["title"] = { "lh": lh, "ff": fontStyleValue(t).ff, "fz": fontStyleValue(t).fz, "fw": fontStyleValue(t).fw, "cl": fontStyleValue(t).cl, "emfz": null };
                                break;
                            case "price":
                                var emfz = t.find('yen-size').text();
                                css += '.price{' + whtlValue(t) + fontStyle(t) + '}.price em{font-size:' + emfz + 'px}';
                                lineClass["price"] = { "lh": lh, "ff": fontStyleValue(t).ff, "fz": fontStyleValue(t).fz, "fw": fontStyleValue(t).fw, "cl": fontStyleValue(t).cl, "emfz": emfz };
                                break;
                            case "link":
                                css += '.link{' + whtlValue(t) + '}';
                                lineClass["link"] = { "lh": null, "ff": null, "fz": null, "fw": null, "cl": null, "emfz": null };
                                break;
                            case "remark":
                                t.children().each(function (n, f) {
                                    var f = $(f);
                                    css += '.remark' + n + '{' + whtlValue(f) + fontStyle(f) + ';line-height:' + f.find('line-height').text() + 'px}';
                                    lineClass["remark" + n] = { "lh": f.find('line-height').text(), "ff": fontStyleValue(f).ff, "fz": fontStyleValue(f).fz, "fw": fontStyleValue(f).fw, "cl": fontStyleValue(f).cl, "emfz": null };
                                });
                                remarkCount = t.children().length;
                                break;
                            default:
                                css += '.' + type + '{' + whtlValue(t) + '}';
                                break;
                        }
                    });
                    $('#mainStyle').html(css);
                    objLength = $(xml).find('object[id]').each(function (i, e) {
                        var t = $(e);
                        var type = t.find('type').text();
                        var id = t.attr('id');
                        switch (type) {
                            case "lineContent":
                                var content = "";
                                var c = t.find('childNode');
                                var cs = c.children().length;
                                if (c.text()) {
                                    if (c.find('title').length)
                                        content += childString(0)['title'];
                                    if (c.find('price').length)
                                        content += childString(1)['price'];
                                    if (c.find('link').length)
                                        content += childString(2)['link'];
                                    if (c.find('remark').length) {
                                        var r = c.find('remark').length;
                                        content += childRemarkString(cs - r, 0, r);
                                    }
                                }
                                _static.append('<div id="resizeDiv' + id + '" class="line posa draggableObject" tabIndex="'+id+'" objectNum="' + id + '" objectType="' + type + '"><div class="static"><span class="tagTips posa">线路容器#' + i + '</span><a id="close" class="close posa db">x</a><div id="content">' + content + '</div></div></div>');
                                _body.append('<style id="' + id + 'Css" type="text/css">#resizeDiv' + id + '{' + whtlValue(t) + '}</style>');
                                break;
                            case "posaLink":
                                var content = t.find('content').text();
                                var href = t.find('href').text().toLowerCase();
                                var target = t.find('target').text();
                                var title = t.find('title').text();
                                var lh = t.find('line-height').text();
                                _static.append('<a id="resizeDiv' + id + '" class="posa draggableObject posaLink" tabIndex="' + id + '" objectNum="' + id + '" objectType="' + type + '" href="javascript:void(0);" target="' + target + '" title="' + title + '" objectContent="' + content + '" objectHref="' + href + '"><div class="static"><span class="tagTips posa">超链接#' + i + '</span><div id="close" class="close posa db">x</div><div id="content">' + content + '</div></div></a>');
                                _body.append('<style id="' + id + 'Css" type="text/css">#resizeDiv' + id + '{' + whtlValue(t) + fontStyle(t) + ';line-height:' + lh + 'px}</style>');
                                break;
                            case "posaTextArea":
                                var contentAttr = t.find('content').text().replace(/"/g, "&quot;").replace(/\n/g, "[br]");
                                var content = t.find('content').text().replace(/"/g, "&quot;").replace(/\n/g, "<br/>");
                                var lh = t.find('line-height').text();
                                _static.append('<div id="resizeDiv' + id + '" class="posaTextArea posa draggableObject" tabIndex="' + id + '" objectNum="' + id + '" objectType="' + type + '"  objectContent="' + contentAttr + '" fontStyle="{ffms,18,#333}"><div class="static"><span class="tagTips posa">文本框#' + i + '</span><a id="close" class="close posa db">x</a><div id="content">' + content + '</div></div></div>');
                                _body.append('<style id="' + id + 'Css" type="text/css">#resizeDiv' + id + '{' + whtlValue(t) + fontStyle(t) + ';line-height:' + lh + 'px}</style>');
                                break;
                            case "posaUpdate":
                                var content = t.find('content').text();
                                var lh = t.find('line-height').text();
                                _static.append('<div id="resizeDiv' + id + '" class="posaUpdate posa draggableObject" tabIndex="' + id + '" objectNum="' + id + '" objectType="' + type + '" ><div class="static"><span class="tagTips posa">网页声明</span><a id="close" class="close posa db">x</a><div id="content">' + update + '</div></div></div>');
                                _body.append('<style id="' + id + 'Css" type="text/css">#resizeDiv' + id + '{' + whtlValue(t) + fontStyle(t) + ';line-height:' + lh + 'px}</style>');
                                break;
                            case "cssLink":
                                var href = t.find('href').text().match(/\/css\/(\S+)\.css/)[1];
                                var lh = t.find('line-height').text();
                                _static.append('<div id="resizeDiv' + id + '" class="cssLink posa draggableObject" tabIndex="' + id + '" objectNum="' + id + '" objectType="' + type + '" objectHref="' + href + '"><div class="static"><span class="tagTips posa">css链接#' + i + '</span><a id="close" class="close posa db">x</a><div id="content">&lt;link type="text/css" href="/subject/' + address + '/css/' + href + '.css" /&gt;</div></div></div>');
                                _body.append('<style id="' + id + 'Css" type="text/css">#resizeDiv' + id + '{' + whtlValue(t) + fontStyle(t) + ';line-height:' + lh + 'px}</style>');
                                //_body.append('<link id="'+id+'Link" rel="stylesheet"  type="text/css" href="/subject/'+address+'/css/'+href+'.css"/>');
                                break;
                            case "jsLink":
                                var href = t.find('href').text().match(/\/scripts\/(\S+)\.js/)[1];
                                var lh = t.find('line-height').text();
                                _static.append('<div id="resizeDiv' + id + '" class="jsLink posa draggableObject" tabIndex="' + id + '" objectNum="' + id + '" objectType="' + type + '" objectHref="' + href + '"><div class="static"><span class="tagTips posa">js链接#' + i + '</span><a id="close" class="close posa db">x</a><div id="content">&lt;script type="text/javascript" src="/subject/' + address + '/scripts/' + href + '.js"&gt;&lt;script/&gt;</div></div></div>');
                                _body.append('<style id="' + id + 'Script" type="text/css">#resizeDiv' + id + '{' + whtlValue(t) + fontStyle(t) + ';line-height:' + lh + 'px}</style>');
                                _body.append('<script id="' + id + 'Script" type="text/javascript" src="/subject/' + address + '/scripts/' + href + '.js"></script>');
                                break;
                            case "posaDiv":
                                var code = t.find('code').text().replace(/\[lt\]/g, '<').replace(/\[gt\]/g, '>');
                                var codeRaw = code.replace(/\[quot\]/g, '"').replace(/href="\S+"/g, 'href="javascript:void(0);"').replace(/\[minus\]/g, '-');
                                _static.append('<div id="resizeDiv' + id + '" class="posaDiv posa draggableObject" tabIndex="' + id + '" objectNum="' + id + '" objectType="' + type + '" objectCode="' + code + '"><div class="static"><span class="tagTips posa">Div#' + i + '</span><a id="close" class="close posa db">x</a><div id="content">' + codeRaw + '</div></div></div>');
                                _body.append('<style id="' + id + 'Css" type="text/css">#resizeDiv' + id + '{' + whtlValue(t) + '}</style>');
                                break;
                            default:
                                break;
                        }

                    }).length;
                    edit();
                    childEdit();
                    $.xmlDataLoader(); //读取data.xml信息
                    checkLineContent();
                }
            })
        }
    }

    //编辑
    function edit() {
        $('.draggableObject', '#static').draggable({
            grid: [1, 1],
            containment: 'parent',
            start: function (e, ui) {
                var _this = $(ui.helper.context);
                _this.addClass('Select').siblings().removeClass('Select');
            },
            drag: function (e, ui) {
            },
            stop: function (e, ui) {
                var _this = $(ui.helper.context);
                var num = _this.attr('objectNum');
                var paras = [];
                paras["top"] = ui.position.top;
                paras["left"] = ui.position.left;
                try {
                    obj["obj_" + num].paras["top"] = paras["top"];
                    obj["obj_" + num].paras["left"] = paras["left"];
                } catch (err) {
                    obj["obj_" + num] = {
                        id: num,
                        paras: paras,
                        type: _this.attr('objectType'),
                        cmd: 'editObject',
                        file: address
                    };
                    editCount()
                }
            }
        }).resizable({
            containment: 'parent',
            start: function (e, ui) {
                var _this = $(ui.helper.context);
                _this.addClass('Select').siblings().removeClass('Select');
            },
            resize: function (e, ui) {
            },
            stop: function (e, ui) {
                var _this = $(ui.helper.context);
                var num = _this.attr('objectNum');
                var paras = [];
                paras["width"] = ui.size.width;
                paras["height"] = ui.size.height;
                try {
                    obj["obj_" + num].paras["width"] = paras["width"];
                    obj["obj_" + num].paras["height"] = paras["height"];
                } catch (err) {
                    obj["obj_" + num] = {
                        id: num,
                        paras: paras,
                        type: _this.attr('objectType'),
                        cmd: 'editObject',
                        file: address
                    };
                    editCount()
                }
            }
        }).live('click', function () {
            var _this = $(this);
            _static.find('.Select').removeClass('Select');
            $(this).addClass('Select');
            var content = _this.attr('objectContent');
            var _Object = {
                id: _this.attr('objectNum'),
                content: (content || "").replace(/\[br\]/g, "\n"),
                type: _this.attr('objectType'),
                href: _this.attr('objectHref'),
                code: _this.attr('objectCode'),
                ff: _this.css('font-family').replace(/'/g, ""),
                fz: parseInt(_this.css('font-size')),
                fw: _this.css('font-weight'),
                lh: parseInt(_this.css('line-height')),
                cl: _this.css('color').colorHex().replace("#", "").toUpperCase(),
                w: _this.css('width'),
                h: _this.css('height'),
                t: _this.css('top'),
                l: _this.css('left')
            };
            var attrHTML = '<li>ID : #' + _Object.id + '</li>';
            attrHTML += '<li>对象类型 : ' + _Object.type + '</li>';
            attrHTML += '<li>类名 : ' + _Object.className + '</li>';
            var isLine = _Object.type != "lineContent";
            var isDiv = _Object.type != "posaDiv";
            if (_Object.content || _Object.type == "posaLink") {
                attrHTML += '<li>内容 : <textarea id="pannelContent" class="classValues" name="textarea" rows="5">' + _Object.content + '</textarea></li>';
            }
            if (_Object.type == "posaLink") {
                attrHTML += '<li>链接地址 : <textarea id="pannelHref" class="classValues" name="textarea" rows="3">' + _Object.href + '</textarea></li>';
            }
            if (_Object.type == "cssLink") {
                attrHTML += '<li>链接地址 : /subject/' + address + '/css/<input type="text" id="pannelHref" class="classValues" name="text" value="' + _Object.href + '"/></li>.css';
            }
            if (_Object.type == "jsLink") {
                attrHTML += '<li>链接地址 : /subject/' + address + '/scripts/<input type="text" id="pannelHref" class="classValues" name="text" value="' + _Object.href + '"/></li>.js';
            }
            if (!isDiv) {
                attrHTML += '<li>HTML代码 : <textarea id="pannelCode" class="classValues" name="textarea" rows="5">' + _Object.code.replace(/\[quot\]/g, '"').replace(/\[minus\]/g, '-') + '</textarea></li>';
            }
            if (_Object.ff && isLine && isDiv) {
                attrHTML += '<li>字体 : <select id="fontSelect" class="classValues" types="ff">';
                for (i = 0; i < fonts.length; i++) {
                    if (_Object.ff == "'" + fonts[i].val + "'") {
                        attrHTML += '<option value="' + fonts[i].val + '" selected="selected">' + fonts[i].key + '</option>';
                    } else {
                        attrHTML += '<option value="' + fonts[i].val + '">' + fonts[i].key + '</option>';
                    }
                };
                attrHTML += '</select>';
            }
            if (_Object.fz && isLine && isDiv) {
                attrHTML += '<li>字号 : <input class="num classValues" type="number" value="' + _Object.fz + '" types="fz"/>&nbsp;px</li>';
            }
            if (_Object.lh && isLine && isDiv) {
                attrHTML += '<li>行距 : <input class="num classValues" type="number" value="' + _Object.lh + '" types="lh"/>&nbsp;px</li>';
            }
            if (_Object.fw && isLine && isDiv) {
                attrHTML += '<li>字体粗细 : <select id="fontWeight" class="classValues" types="fw">';
                if (_Object.fw == "normal") {
                    attrHTML += '<option value="normal" selected="selected">正常</option><option value="bold">粗体</option></select></li>';
                } else {
                    attrHTML += '<option value="bold" selected="selected">粗体</option><option value="normal">正常</option></select></li>';
                }
                attrHTML += '</select></li>'
            }
            if (_Object.cl && isLine && isDiv) {
                attrHTML += '<li class="colorRow">字体颜色 : <div id="colorSelector" class="colorpickerCont cp1"><div style="background-color:#' + _Object.cl + '"></div></div><input id="fontColor" types="cl" class="classValues" type="hidden" value="' + _Object.cl + '"/></li>';
            }
            attrHTML += '<li><button id="objectCopyStyle">复制样式</button>';
            if (coypboard)
                attrHTML += '<button id="objectPasteStyle">粘贴样式</button>'
            attrHTML += '</li>'
            $('#attr').html('').append(attrHTML);
            jqueryColorPicker(_Object, _this, true);
            $('.classValues', "#pannel").change(function () {
                changeContent(_Object, _this);
            });
            $('#objectCopyStyle').click(function () {
                coypboard = _Object;
                coypBoardFun();
            });
            $childClick.live("click", function () {
                var __this = $(this);
                var addType = __this.attr('addType');
                var paras = [];
                paras["addChildNode"] = addType;
                if (__this.attr('id') == "addRemark" || _this.find('[objectType=\'' + addType + '\']').length == 0) {
                    try {
                        var str = obj["obj_" + _Object.id].paras["addChildNode"];
                        obj["obj_" + _Object.id].paras["addChildNode"] = addNodeString(str, paras["addChildNode"].toString());
                    } catch (err) {
                        obj["obj_" + _Object.id] = {
                            id: _Object.id,
                            paras: paras,
                            cmd: 'editObject',
                            file: address
                        }
                        editCount();
                    }
                    var childNodeNum = _this.find('.inner').length;
                    if (__this.attr('id') == "addRemark") {
                        var remarkNum = _this.find('[objectType=\'remark\']').length;
                        _this.find('#content:eq(0)').append(childRemarkString(childNodeNum, remarkNum, 1));
                        if (!(remarkNum < remarkCount)) {
                            paras["num"] = remarkNum;
                            obj["obj_" + _Object.id + "_" + addType + remarkNum] = {
                                id: _Object.id,
                                paras: paras,
                                type: addType,
                                cmd: 'addChildClass',
                                file: address
                            };
                            editCount();
                        }
                    } else {
                        _this.find('#content:eq(0)').append(childString(childNodeNum)[addType]);
                    }
                    excuteSave();
                } else {
                    alert('该对象已存在！');
                }
            });
            return false;
        }).live("blur", function () {
            $(".colorpicker:gt(1)").remove();
        }).find('#close:eq(0)').click(function () {
            var q = confirm("你确定要删除此对象？");
            if (q) {
                var _object = $(this).parent().parent();
                var num = _object.remove().attr('objectNum');
                if (function () { try { return obj["obj_" + num].cmd == "addLineContent" ? 1 : 0 } catch (err) { return 0 } } ()) {
                    delete obj["obj_" + num];
                    editCount()
                } else {
                    delete obj["obj_" + num];
                    obj["obj_" + num] = {
                        id: num,
                        paras: null,
                        type: null,
                        cmd: 'deleteObject',
                        file: address
                    }
                    editCount()
                }
            }
        });
    }
    function childEdit() {
        $('.draggableChild', '#static').draggable({
            grid: [1, 1],
            snap: '.inner',
            snapTolerance: 5,
            snapMode: 'outer',
            containment: 'parent',
            start: function (e, ui) {
                var _this = $(ui.helper.context);
                _this.addClass('Select').siblings().removeClass('Select');
            },
            drag: function (e, ui) {
            },
            stop: function (e, ui) {
                var _this = $(ui.helper.context);
                var num = _this.parent().parent().parent().attr('objectNum');
                var type = _this.attr('objectType');
                var paras = [];
                paras["top"] = ui.position.top;
                paras["left"] = ui.position.left;
                paras["num"] = _this.attr('objectNum');
                if (type == "remark") {
                    try {
                        obj["obj_" + num + "_" + type + paras["num"]].paras["top"] = paras["top"];
                        obj["obj_" + num + "_" + type + paras["num"]].paras["left"] = paras["left"];
                    } catch (err) {
                        obj["obj_" + num + "_" + type + paras["num"]] = {
                            id: num,
                            paras: paras,
                            type: type,
                            cmd: 'editChild',
                            file: address
                        };
                        editCount()
                    }
                } else {
                    try {
                        obj["obj_" + num + "_" + type].paras["top"] = paras["top"];
                        obj["obj_" + num + "_" + type].paras["left"] = paras["left"];
                    } catch (err) {
                        obj["obj_" + num + "_" + type] = {
                            id: num,
                            paras: paras,
                            type: type,
                            cmd: 'editChild',
                            file: address
                        };
                        editCount()
                    }
                }
            }
        }).resizable({
            containment: 'parent',
            start: function (e, ui) {
                var _this = $(ui.helper.context);
                _this.addClass('Select').siblings().removeClass('Select');
            },
            resize: function (e, ui) {
            },
            stop: function (e, ui) {
                var _this = $(ui.helper.context);
                var num = _this.parent().parent().parent().attr('objectNum');
                var type = _this.attr('objectType');
                var paras = [];
                var _num = _this.attr('objectNum');
                paras["width"] = ui.size.width;
                paras["height"] = ui.size.height;
                paras["num"] = (_num == null) ? '' : _num;
                try {
                    obj["obj_" + num + "_" + type + paras["num"]].paras["width"] = paras["width"];
                    obj["obj_" + num + "_" + type + paras["num"]].paras["height"] = paras["height"];
                } catch (err) {
                    obj["obj_" + num + "_" + type + paras["num"]] = {
                        id: num,
                        paras: paras,
                        type: type,
                        cmd: 'editChild',
                        file: address
                    };
                    editCount()
                }
            }
        }).live('click', function () {
            var _this = $(this);
            _static.find('.Select').removeClass('Select');
            _this.addClass('Select');
            var _objnum = _this.attr('objectnum')
            var _thisType = _this.attr('objectType') + ((_objnum == null) ? '' : _objnum);
            var _Object = {
                id: _this.parents('.line').attr('objectNum'),
                _id: _this.attr('objectNum'),
                content: _this.attr('objectContent'),
                type: _this.attr('objectType'),
                className: _this.attr('classname'),
                ff: lineClass[_thisType].ff,
                fz: lineClass[_thisType].fz,
                fw: lineClass[_thisType].fw,
                lh: lineClass[_thisType].lh,
                cl: lineClass[_thisType].cl,
                emfz: lineClass[_thisType].emfz
            };
            var attrHTML = '<li>宿主ID : #<span id="szId">' + _Object.id + '</span></li>';
            attrHTML += '<li>ID : #' + _Object._id + '</li>';
            attrHTML += '<li>对象类型 : <span id="thisTy">' + _Object.type + '</span></li>';
            attrHTML += '<li>类名 : <span id="thisClassName">' + _Object.className + '</span></li>';
            if (_Object.ff) {
                attrHTML += '<li>字体 : <select id="fontSelect" class="classValues" types="ff">';
                for (i = 0; i < fonts.length; i++) {
                    if (_Object.ff == fonts[i].val) {
                        attrHTML += '<option value="' + fonts[i].val + '" selected="selected">' + fonts[i].key + '</option>';
                    } else {
                        attrHTML += '<option value="' + fonts[i].val + '">' + fonts[i].key + '</option>';
                    }
                };
                attrHTML += '</select></li>';
            }
            if (_Object.fz) {
                attrHTML += '<li>字号 : <input class="num classValues" type="number" value="' + _Object.fz + '" types="fz"/>&nbsp;px</li>';
            }
            if (_Object.emfz) {
                attrHTML += '<li>￥字号 : <input class="num classValues" type="number" value="' + _Object.emfz + '" types="emfz"/>&nbsp;px</li>';
            }
            if (_Object.lh) {
                attrHTML += '<li>行距 : <input class="num classValues" type="number" value="' + _Object.lh + '" types="lh"/>&nbsp;px</li>';
            }
            if (_Object.fw) {
                attrHTML += '<li>字体粗细 : <select id="fontWeight" class="classValues" types="fw">';
                if (_Object.fw == "normal") {
                    attrHTML += '<option value="normal" selected="selected">正常</option><option value="bold">粗体</option></select></li>';
                } else {
                    attrHTML += '<option value="bold" selected="selected">粗体</option><option value="normal">正常</option></select></li>';
                }
                attrHTML += '</select></li>'
            }
            if (_Object.cl) {
                attrHTML += '<li class="colorRow">字体颜色 : <div id="colorSelector" class="colorpickerCont cp1"><div style="background-color:#' + _Object.cl + '"></div></div><input id="fontColor" types="cl" class="classValues" type="hidden" value="' + _Object.cl + '"/></li>';
            }
            if (_Object.content) {
                attrHTML += '<li>内容 : <textarea id="pannelContent" name="textarea" rows="5">' + _Object.content + '</textarea></li>';
            }
            attrHTML += '<li><button id="childCopyStyle">复制样式</button>';
            if (coypboard)
                attrHTML += '<button id="pasteStyle">粘贴样式</button>'
            attrHTML += '</li>'
            $('#attr').html('').append(attrHTML);
            if (_Object.cl) {
                jqueryColorPicker(_Object, _this, false)
            }
            $('.classValues', "#pannel").change(function () {
                changeChildClass(_Object.type, _Object.id, _this);
            });
            $('#childCopyStyle').click(function () {
                coypboard = _Object;
                coypBoardFun();
            });
            return false;
        }).live("blur", function () {
            $(".colorpicker:gt(1)").remove();
        }).find('#closeChild:eq(0)').click(function () {
            var _this = $(this).parents('.draggableChild');
            var q = confirm("你确定要删除此对象？");
            if (q) {
                var _object = $(this).parents('.line');
                var num = _object.attr('objectNum');
                var _num = _this.attr('objectNum');
                _this.remove();
                var type = _this.attr('objectType');
                var paras = [];
                paras["deleteChildNum"] = _this.attr('childnode');
                obj["obj_" + num + "_" + type + (_num == null ? '' : _num)] = {
                    id: num,
                    paras: paras,
                    type: type,
                    cmd: 'deleteChild',
                    file: address
                };
                editCount()
            }
        });
    }
    //修改object
    function changeContent(_Object, _this) {
        var content = $('#pannelContent', '#pannel')
        var href = $('#pannelHref', '#pannel');
        var code = $('#pannelCode', '#pannel');
        var classValues = $('.classValues', '#pannel');
        var paras = [];
        if (content.length) {
            paras["content"] = content.val();
            _this.find('#content').html(paras["content"].replace(/\n/g, "<br/>"));
        }
        if (classValues.length) {
            classValues.each(function (n, e) {
                var _t = {};
                _t.e = $(e);
                _t.a = _t.e.attr('types');
                _t.v = _t.e.val();
                switch (_t.a) {
                    case 'ff':
                        paras["font-family"] = _t.v;
                        _Object.ff = _t.v;
                        break;
                    case 'fw':
                        paras["font-weight"] = _t.v;
                        _Object.fw = _t.v;
                        break;
                    case 'lh':
                        paras["line-height"] = _t.v;
                        _Object.lh = _t.v;
                        break;
                    case 'fz':
                        paras["font-size"] = _t.v;
                        _Object.fz = _t.v;
                        break;
                    case 'cl':
                        $('#colorDiv').css('background-color', "#" + _t.v);
                        paras["color"] = _t.v; //.toUpperCase();
                        _Object.cl = _t.v;
                        break;
                }
            });
        }
        if (href.length) {
            var hrefCont = $('#pannelHref', '#pannel').val();
            if (!/^https*:\/\//.test(hrefCont) && _Object.type == "posaLink") {
                hrefCont = "http://" + hrefCont;
            }
            if (_Object.type == "cssLink") {
                hrefCont = '/subject/' + address + '/css/' + hrefCont + ".css";
                _this.find('#content').html('&lt;link type="text/css" href="' + hrefCont + '" /&gt;');
                $('#' + _Object.id + 'Link').attr('href', hrefCont);
            }
            if (_Object.type == "jsLink") {
                hrefCont = '/subject/' + address + '/scripts/' + hrefCont + ".js";
                _this.find('#content').html('&lt;script type="text/javascript" src="' + hrefCont + '"&gt;&lt;script/&gt;');
            }
            paras["href"] = hrefCont;
        }
        if (code.length) {
            var codeVal = $('#pannelCode', '#pannel').val().replace(/\n/g, "").replace(/\s*</g, "[lt]").replace(/>/g, "[gt]").replace(/src="images/g, 'src="/subject/' + address + '/images').replace(/"/g, "[quot]").replace(/-/g, "[minus]");
            paras["code"] = codeVal;
        }
        var css = '#resizeDiv' + _Object.id + '{width:' + _Object.w + ';height:' + _Object.h + ';top:' + _Object.t + ';left:' + _Object.l + ';font-family:' + _Object.ff + ';font-size:' + _Object.fz + 'px;font-weight:' + _Object.fw + ';color:#' + _Object.cl + ';line-height:' + _Object.lh + 'px}';
        $('#' + _Object.id + 'Css').html(css);
        try {
            obj["obj_" + _Object.id].paras["content"] = paras["content"];
            obj["obj_" + _Object.id].paras["href"] = paras["href"];
            obj["obj_" + _Object.id].paras["code"] = paras["code"];
            obj["obj_" + _Object.id].paras["yen-size"] = paras["yen-size"];
            obj["obj_" + _Object.id].paras["font-family"] = paras["font-family"];
            obj["obj_" + _Object.id].paras["font-weight"] = paras["font-weight"];
            obj["obj_" + _Object.id].paras["font-size"] = paras["font-size"];
            obj["obj_" + _Object.id].paras["color"] = paras["color"];
            obj["obj_" + _Object.id].paras["line-height"] = paras["line-height"];
        } catch (err) {
            obj["obj_" + _Object.id] = {
                id: _Object.id,
                paras: paras,
                type: _this.attr('objectType'),
                cmd: 'editObject',
                file: address
            };
        } finally {
            editCount();
        }
    }

    //修改objectChild
    function changeChildClass(type, num, _this) {
        var classValues = $('.classValues', '#pannel');
        var paras = [];
        var _num = _this.attr('objectNum');
        var types = type + (_num == null ? '' : _num);
        var childrenId = "obj_" + num + "_" + types;
        if (classValues.length) {
            classValues.each(function (n, e) {
                var _t = {};
                _t.e = $(e);
                _t.a = _t.e.attr('types');
                _t.v = _t.e.val();
                //console.log(lineClass[types], _this);
                switch (_t.a) {
                    case 'ff':
                        paras["font-family"] = _t.v;
                        lineClass[types].ff = _t.v;
                        break;
                    case 'fw':
                        paras["font-weight"] = _t.v;
                        lineClass[types].fw = _t.v;
                        break;
                    case 'lh':
                        paras["line-height"] = _t.v;
                        lineClass[types].lh = _t.v;
                        break;
                    case 'fz':
                        paras["font-size"] = _t.v;
                        lineClass[types].fz = _t.v;
                        break;
                    case 'fs':
                        paras["yen-size"] = _t.v;
                        lineClass[types].fs = _t.v;
                        break;
                    case 'cl':
                        $('#colorDiv').css('background-color', "#" + _t.v);
                        paras["color"] = _t.v;
                        lineClass[types].cl = _t.v;
                        break;
                    case 'emfz':
                        paras["yen-size"] = _t.v;
                        lineClass[types].emfz = _t.v;
                        break;
                }
            });
            //console.log(lineClass[types].ff, paras, types, type);
        }
        if (type == "remark")
            paras["num"] = _num;
        if ($('#' + types + 'Css').length) {
            $('#' + types + 'Css').html(renderCss(type, _num, types));
        } else {
            _body.append('<style id="' + types + 'Css" type="text/css">' + renderCss(type, _num, types) + '</style>');
        }
        try {
            obj[childrenId].paras["font-family"] = paras["font-family"];
            obj[childrenId].paras["font-weight"] = paras["font-weight"];
            obj[childrenId].paras["line-height"] = paras["line-height"];
            obj[childrenId].paras["font-size"] = paras["font-size"];
            obj[childrenId].paras["yen-size"] = paras["yen-size"];
            obj[childrenId].paras["color"] = paras["color"];
            if (type == "remark")
                obj[childrenId].paras["num"] = paras["num"];
        } catch (err) {
            obj["obj_" + num + "_" + type + (_num == null ? '' : _num)] = {
                id: num,
                paras: paras,
                type: _this.attr('objectType'),
                cmd: 'editChild',
                file: address
            };
        } finally {
            editCount();
        }
    }

    //输出CSS
    function renderCss(type, _num, types) {
        var lh = lineClass[types].lh;
        var ff = lineClass[types].ff;
        var fz = lineClass[types].fz;
        var fw = lineClass[types].fw;
        var cl = lineClass[types].cl;
        var emfz = lineClass[types].emfz;
        var css = '';
        switch (type) {
            case "title":
                css = '.title{line-height:' + lh + 'px;font-family:"' + ff + '";font-size:' + fz + 'px;font-weight:' + fw + ';color:#' + cl + '}';
                break;
            case "price":
                css = '.price{line-height:' + lh + 'px;font-family:"' + ff + '";font-size:' + fz + 'px;font-weight:' + fw + ';color:#' + cl + '}.price em{font-size:' + emfz + 'px}';
                break;
            case "remark":
                css = '.remark' + _num + '{line-height:' + lh + 'px;font-family:"' + ff + '";font-size:' + fz + 'px;font-weight:' + fw + ';color:#' + cl + '}';
                break;
            default:
                break;
        }
        return css;
    }

    //添加object初始样式
    function addObjectStyle(id, ff, fz, fw, lh, cl) {
        _body.append('<style id="' + id + 'Css" type="text/css">#resizeDiv' + id + '{font-family:\'' + ff + '\';font-size:' + fz + 'px;font-weight:' + fw + ';line-height:' + lh + 'px;color:' + cl + ';}</style>');
    }

    var execFun = function () { return false };
    $addClick.live("click", function () {
        $addClick.removeClass('btnClicked');
        $(this).addClass('btnClicked');
    });
    $('#addLineContent', '#pannel').live("click", function () {
        execFun = function (e) {
            var id = randomNum(5);
            var top = e.pageY - _static.offset().top;
            var left = e.pageX - _static.offset().left;
            _static.find('Select').removeClass('Select');
            _static.append('<div id="resizeDiv' + id + '" class="line posa draggableObject Select" style="height:100px;width:400px;top:' + top + 'px;left:' + left + 'px" objectNum="' + id + '" objectType="lineContent"><div class="static"><span class="tagTips posa">线路容器#' + objLength + '</span><a id="close" class="close posa db">x</a><div id="content">' + childString(0)['title'] + childString(1)['price'] + childString(2)['link'] + childRemarkString(3, 0, 1) + '</div></div></div>');
            var paras = [];
            paras["width"] = 400, paras["height"] = 100, paras["top"] = top, paras["left"] = left, paras["childNode"] = true;
            obj["obj_" + id] = {
                id: id,
                paras: paras,
                type: 'lineContent',
                cmd: 'addLineContent',
                file: address
            };
            edit();
            editCount();
            excuteSave();
            checkLineContent();
        };
    });
    $('#addPosaDiv', '#pannel').live("click", function () {
        execFun = function (e) {
            var id = randomNum(5);
            var top = window.event.y - _static.offset().top + _body.scrollTop();
            var left = window.event.x - _static.offset().left;
            _static.find('Select').removeClass('Select');
            _static.append('<div id="resizeDiv' + id + '" class="addPosaDiv posa draggableObject Select" style="height:100px;width:400px;top:' + top + 'px;left:' + left + 'px" objectNum="' + id + '" objectType="posaDiv" objectCode="点击编辑该对象属性"><div class="static"><span class="tagTips posa">Div#' + objLength + '</span><a id="close" class="close posa db">x</a>点击编辑该对象属性</div></div>');
            var paras = [];
            paras["width"] = 400, paras["height"] = 100, paras["top"] = top, paras["left"] = left;
            obj.push({
                id: id,
                paras: paras,
                type: 'posaDiv',
                cmd: 'addPosaDiv',
                file: address
            });
            edit();
            editCount();
        };
    });
    $('#addPosaLink', '#pannel').live("click", function () {
        execFun = function (e) {
            var id = randomNum(5);
            var top = window.event.y - _static.offset().top + _body.scrollTop();
            var left = window.event.x - _static.offset().left;
            _static.find('Select').removeClass('Select');
            _static.append('<a id="resizeDiv' + id + '" class="posaLink posa draggableObject Select" style="height:100px;width:400px;top:' + top + 'px;left:' + left + 'px" objectNum="' + id + '" objectType="posaLink" href="javascript:void(0)" target="_blank" title="点击编辑该对象属性" objectContent="点击编辑该对象属性" objectHref="javascript:void(0);"><div class="static"><span class="tagTips posa">超链接#' + objLength + '</span><div id="close" class="close posa db">x</div>点击编辑该对象属性</div></a>');
            var paras = [];
            paras["width"] = 400, paras["height"] = 100, paras["top"] = top, paras["left"] = left, paras["font-family"] = 'Microsoft YaHei', paras["font-size"] = 12, paras["font-weight"] = 'normal', paras["line-height"] = 16, paras["color"] = '#333';
            addObjectStyle(id, paras["font-family"], paras["font-size"], paras["font-weight"], paras["line-height"], paras["color"]);
            obj.push({
                id: id,
                paras: paras,
                type: 'posaLink',
                cmd: 'addPosaLink',
                file: address
            });
            edit();
            editCount();
        };
    });
    $('#addPosaTextArea', '#pannel').live("click", function () {
        execFun = function (e) {
            var id = randomNum(5);
            var top = window.event.y - _static.offset().top + _body.scrollTop();
            var left = window.event.x - _static.offset().left;
            _static.find('Select').removeClass('Select');
            _static.append('<div id="resizeDiv' + id + '" class="posaTextArea posa draggableObject Select" style="height:100px;width:400px;top:' + top + 'px;left:' + left + 'px" objectNum="' + id + '" objectType="posaTextArea" objectContent="点击编辑该对象属性"><div class="static"><span class="tagTips posa">文本框#' + objLength + '</span><a id="close" class="close posa db">x</a>点击编辑该对象属性</div></div>');
            var paras = [];
            paras["width"] = 400, paras["height"] = 100, paras["top"] = top, paras["left"] = left, paras["font-family"] = 'Microsoft YaHei', paras["font-size"] = 12, paras["font-weight"] = 'normal', paras["line-height"] = 16, paras["color"] = '#333';
            addObjectStyle(id, paras["font-family"], paras["font-size"], paras["font-weight"], paras["line-height"], paras["color"]);
            obj.push({
                id: id,
                paras: paras,
                type: 'posaTextArea',
                cmd: 'addPosaTextArea',
                file: address
            });
            edit();
            editCount();
        };
    });
    $('#addUpdate', '#pannel').live("click", function () {
        execFun = function (e) {
            if (!_static.find('.posaUpdate').length) {
                var id = randomNum(5);
                var top = window.event.y - _static.offset().top + _body.scrollTop();
                var left = window.event.x - _static.offset().left;
                _static.find('Select').removeClass('Select');
                _static.append('<div id="resizeDiv' + id + '" class="posaUpdate posa draggableObject Select" style="height:40px;width:840px;top:' + top + 'px;left:' + left + 'px" objectNum="' + id + '" objectType="posaUpdate" objectContent="' + update + '"><div class="static"><span class="tagTips posa">网页声明</span><a id="close" class="close posa db">x</a>' + update + '</div></div>');
                var paras = [];
                paras["width"] = 840, paras["height"] = 40, paras["top"] = top, paras["left"] = left, paras["font-family"] = 'SimSun', paras["font-size"] = 12, paras["font-weight"] = 'normal', paras["line-height"] = 16, paras["color"] = '#333';
                addObjectStyle(id, paras["font-family"], paras["font-size"], paras["font-weight"], paras["line-height"], paras["color"]);
                obj.push({
                    id: id,
                    paras: paras,
                    type: 'posaUpdate',
                    cmd: 'addPosaUpdate',
                    file: address
                });
                edit();
                editCount();
            } else {
                alert('该对象已存在！');
            }
        };
    });
    $('#addCssLink', '#pannel').live("click", function () {
        execFun = function (e) {
            var id = randomNum(5);
            var top = window.event.y - _static.offset().top + _body.scrollTop();
            var left = window.event.x - _static.offset().left;
            _static.find('Select').removeClass('Select');
            _static.append('<div id="resizeDiv' + id + '" class="cssLink posa draggableObject Select" style="height:30px;width:450px;top:' + top + 'px;left:' + left + 'px" objectNum="' + id + '" objectType="cssLink" objectHref="about:blank"><div class="static"><span class="tagTips posa">css链接#' + objLength + '</span><a id="close" class="close posa db">x</a>点击编辑该对象属性</div></div>');
            var paras = [];
            paras["width"] = 450, paras["height"] = 30, paras["top"] = top, paras["left"] = left, paras["font-family"] = 'SimSun', paras["font-size"] = 12, paras["font-weight"] = 'normal', paras["line-height"] = 16, paras["color"] = '#333';
            addObjectStyle(id, paras["font-family"], paras["font-size"], paras["font-weight"], paras["line-height"], paras["color"]);
            obj.push({
                id: id,
                paras: paras,
                type: 'cssLink',
                cmd: 'addCssLink',
                file: address
            });
            edit();
            editCount();
        }
    });
    $('#addJsLink', '#pannel').live("click", function () {
        execFun = function (e) {
            var id = randomNum(5);
            var top = window.event.y - _static.offset().top + _body.scrollTop();
            var left = window.event.x - _static.offset().left;
            _static.find('Select').removeClass('Select');
            _static.append('<div id="resizeDiv' + id + '" class="jsLink posa draggableObject Select" style="height:30px;width:600px;top:' + top + 'px;left:' + left + 'px" objectNum="' + id + '" objectType="jsLink" objectHref="about:blank"><div class="static"><span class="tagTips posa">js链接#' + objLength + '</span><a id="close" class="close posa db">x</a>点击编辑该对象属性</div></div>');
            var paras = [];
            paras["width"] = 600, paras["height"] = 30, paras["top"] = top, paras["left"] = left, paras["font-family"] = 'SimSun', paras["font-size"] = 12, paras["font-weight"] = 'normal', paras["line-height"] = 16, paras["color"] = '#333';
            addObjectStyle(id, paras["font-family"], paras["font-size"], paras["font-weight"], paras["line-height"], paras["color"]);
            obj.push({
                id: id,
                paras: paras,
                type: 'addLink',
                cmd: 'addJsLink',
                file: address
            });
            edit();
            editCount();
        }
    });
    _static.live("click", function (e) {
        execFun(e);
        execFun = function () { return false };
    });
    //保存
    $('#save', '#pannel').live("click", excuteSave);
    function excuteSave() {
        $('#loading_unit p').html("<img src='/subject/edit/images/loading_bar.gif' />");
        $('#loading_unit').fadeIn('100');
        if (function () { for (var n in obj) { return true } } ()) {
            var result = [0, 0]; //成败结果
            var index = 0;
            for (_Object in obj) {
                obj[_Object].paras = encodeURI(join(obj[_Object].paras)); //组合数组
                $.ajax({
                    data: obj[_Object],
                    type: "POST",
                    url: '/subject/edit/spe/edit.ashx',
                    timeout: 20000,
                    async: false, //设置为同步，必须等待服务器返回结果后才继续执行,这个很重要
                    beforeSend: function () {
                        Response.uiController.showLoadingBar();
                    },
                    error: function (XMLHttpRequest, strError, strObject) {
                        Response.resultFalure++;
                    },
                    success: function (strValue) {
                        Response.uiController.hideLoadingBar();
                        if (strValue == "True") {
                            Response.resultSuccess++;
                        } else {
                            Response.resultFalure++;
                        }
                    },
                    complete: function () {
                          index++;
                          Response.uiController.showComputedResult(index);
//                        if (index == editCount()) {
//                            $('#loading_unit h1').text("保存结果");
//                            if (!result[1]) {
//                                $('#loading_unit p').html("<img src='/subject/edit/images/onebit_34.png' />");
//                            } else {
//                                $('#loading_unit p').html("<img src='/subject/edit/images/onebit_33.png' />");
//                            }
//                            $('#loading_unit h2').html("修改项目：" + (result[0] + result[1]) + "项；成功：" + result[0] + "项；失败：" + result[1] + "项！");
//                            obj = [];
//                            setTimeout("$('#loading_unit').fadeOut(500)", 3000);
//                        }
//                        setTimeout("window.location.reload()", 3500); /*重载*/
                    }
                });
            };
        } else {
            $('#loading_unit h1').text("保存结果");
            $('#loading_unit p').html("<img src='/subject/edit/images/onebit_33.png' />");
            $('#loading_unit h2').html("没有任何改动！");
            setTimeout("$('#loading_unit').fadeOut(500)", 3000);
        }
    }
    //生成静态页面
    $('#createPage', '#pannel').live("click", excuteCreat);
    function excuteCreat() {
        var lineCount = parseInt($('#ajaxDataXMLInfo').text());
        var dataBoardCount = parseInt(_static.find('.line').length);
        if (lineCount < dataBoardCount || lineCount === dataBoardCount) {
            excuteToCreate();
        } else {
            var q = confirm("本页面线路数量少于data.xml的数量,可能会导致某些线路不显示,你确定要生成静态页？");
            if (q) {
                excuteToCreate();
            }
        }
    }
    function checkLineContent() {
        var lineCount = parseInt($('#ajaxDataXMLInfo').val());
        var nowLineCount = _static.find('.line').length;
        $("#dif").text(lineCount);
    }
    function excuteToCreate() {
        $('#loading_unit p').html("<img src='/subject/edit/images/loading_bar.gif' />");
        $('#loading_unit').fadeIn('100');
        var timeStar = (new Date()).getTime();
        $.ajax({
            data: { path: address },
            type: "POST",
            url: '/subject/edit/spe/create.ashx',
            timeout: 20000,
            async: false, //设置为同步，必须等待服务器返回结果后才继续执行,这个很重要
            beforeSend: function () {
                Response.uiController.beforeSend();
            },
            error: function (XMLHttpRequest, strError, strObject) {
                Response.uiController.showFailure(strValue);
            },
            success: function (strValue) {
                Response.uiController.showSuccess();
                if (strValue == "True") {
                    createStaticFiles(timeStar);
                } else {
                    Response.uiController.showFailure(strValue);
                }
            },
            complete: function () {
                Response.uiController.showResult();
            }
        });
    };
    //绑定事件
    $('.posa', '#static').live('mouseover', function (e) {
        e.stopPropagation();
        var _this = $(this);
        _this.addClass('hover');
        _this.find('.tagTips:eq(0)').stop(false, true).fadeIn(300);
    });
    $('.posa', '#static').live('mouseout', function () {
        var _this = $(this);
        _this.removeClass('hover');
        _this.find('.tagTips:eq(0)').stop(false, true).fadeOut(300);
    });
    //生成静态htm文件
    function createStaticFiles(timeStar) {
        $('#loading_unit p').html("<img src='/subject/edit/images/loading_bar.gif' />");
        var filename = address;
        $.ajax({
            data: { path: filename },
            type: "POST",
            url: '/subject/edit/priceEidtor4.0/create.ashx',
            timeout: 50000,
            async: false,
            error: function (XMLHttpRequest, strError, strObject) {
                Response.uiController.showFailure();
            },
            beforeSend: function () {
                Response.uiController.beforeSend();
            },
            success: function (strValue) {
                if (strValue == "True") {
                    var timeEnd = (new Date()).getTime();
                    Response.uiController.showSuccess();
                    $createLink.attr("href", '/subject/' + filename + '/index.htm').html('网页已经生成(用时' + timeRecoder(timeStar, timeEnd) + '秒)<br/>请点击这里查看');
                } else {
                    Response.uiController.showFailure(strValue);
                }
            },
            complete: function () {
                Response.uiController.showResult();
            }
        });
        setTimeout("$('#loading_unit').fadeOut(500)", 3800);
    };
    function timeRecoder(t1, t2) {
        var time = (t2 - t1) / 1000;
        //console.log(t2, t1);
        return time;
    }
    //修复鼠标拖移图标bug
    this.addEventListener('selectstart', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }, true);
    //更改粘贴板
    function coypBoardFun() {
        var boardHTML = "<br>字体样式：" + coypboard.ff;
        boardHTML += "<br>字号：" + coypboard.fz + "px<br>";
        if (coypboard.lh)
            boardHTML += "行距：" + coypboard.lh + "px<br>";
        boardHTML += "字体粗细：" + coypboard.fw + "<br>";
        boardHTML += "字体颜色：#" + coypboard.cl + "<br>";
        $("#copyBoard").html(boardHTML);
    }
    $('#pasteStyle').live("click", function () {
        $('#fontSelect', '#pannel').find("option[value='" + coypboard.ff + "']").attr("selected", true);
        $('#pannel').find("input[types='fz']").val(coypboard.fz);
        $('#pannel').find("input[types='lh']").val(coypboard.lh);
        $('#fontWeight', '#pannel').find("option[value='" + coypboard.fw + "']").attr("selected", true);
        $('#pannel').find("input[types='cl']").val(coypboard.cl);
        $('#colorSelector').ColorPickerSetColor("#" + coypboard.cl).children('div').css('background-color', "#" + coypboard.cl);
        var szId = $('#szId', "#pannel").text();
        changeChildClass($('#thisTy', '#pannel').text(), szId, $('#resizeDiv' + szId + ' .' + $('#thisClassName', '#pannel').text(), '#static'));
        //console.log($('#thisTy', '#pannel').text(), szId, $('#resizeDiv' + szId + ' .' + $('#thisClassName', '#pannel').text(), '#static'));
    });
    $('#objectPasteStyle').live("click", function () {
        $('#fontSelect', '#pannel').find("option[value='" + coypboard.ff + "']").attr("selected", true);
        $('#pannel').find("input[types='fz']").val(coypboard.fz);
        if (coypboard.lh)
        $('#pannel').find("input[types='lh']").val(coypboard.lh);
        $('#fontWeight', '#pannel').find("option[value='" + coypboard.fw + "']").attr("selected", true);
        $('#pannel').find("input[types='cl']").val(coypboard.cl);
        $('#colorSelector').ColorPickerSetColor("#" + coypboard.cl).children('div').css('background-color', "#" + coypboard.cl);
        var szId = $('#szId', "#pannel").text();
        //changeContent(, $('#resizeDiv' + szId , '#static'));
        //console.log($('#thisTy', '#pannel').text(), szId, $('#resizeDiv' + szId + ' .' + $('#thisClassName', '#pannel').text(), '#static'));        
    });
    function jqueryColorPicker(_Object, _this, isObject) {
        $('#colorSelector').ColorPicker({
            color: "#" + _Object.cl,
            onShow: function (colpkr) {
                $(colpkr).fadeIn(500);
                return false;
            },
            onHide: function (colpkr) {
                $(colpkr).fadeOut(500);
                return false;
            },
            onChange: function (hsb, hex, rgb) {
                $('#colorSelector div').css('backgroundColor', '#' + hex);
                $('#fontColor').val(hex);
                if (isObject) {
                    changeContent(_Object, _this);
                } else {
                    changeChildClass(_Object.type, _Object.id, _this);
                }
            }
        }).bind('keyup', function () {
            $(this).ColorPickerSetColor(this.value);
        });
    }
});