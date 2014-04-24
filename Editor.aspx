<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Editor.aspx.cs" Inherits="subject_edit_spe_Editor" %>
<!DOCTYPE HTML>
<html lang="zh" dir="ltr">
<head>
    <meta charset="utf-8" />
    <title><%= title %> - 广州广之旅官方网站</title>
    <meta name="keywords" content="<%= keywords %>,广之旅">
    <meta name="Description" content="<%= description %> -广之旅">
    <link rel="shortcut icon" href="/Static/images/Favicon.ico" />
    <script src="/Static/scripts/jquery-1.7.2.min.js"></script>
    <!-- <script type="text/javascript" src="scripts/lazyload.js"></script>
<script type="text/javascript" src="scripts/default.js"></script> -->
    <link rel="stylesheet" type="text/css" href="/subject/edit/spe/colorpicker/css/colorpicker.css" />  
    <link href="/subject/edit/spe/css/main_style.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="/subject/edit/spe/colorpicker/js/colorpicker.js"></script>
    <style type="text/css"><%= defaultCss %></style>
    <%=cssLinks%>
    <!--[if IE 6]>
<script>   
	function   stoperror(){   
		return   true  ;
	}   
	window.onerror=stoperror;  
</script>
<script type="text/javascript" src="/subject/js/ie6png.js"></script>
<script>
DD_belatedPNG.fix('.tips');
</script>
<![endif]-->
</head>
<body>
    <div style="width: 100%; background: url(http://www.gzl.com.cn/subject/images/head/toolbar_bg.jpg) repeat-x;">
        <div style="width: 960px; height: 40px; background: url(http://www.gzl.com.cn/subject/images/head/top.jpg);
            position: relative; margin: 0 auto">
            <a href="http://www.gzl.com.cn/" target="_blank" style="width: 103px; height: 37px;
                display: block; position: absolute; left: 7px; top: 2px;"></a><a href="http://www.gzl.com.cn/"
                    target="_blank" style="width: 80px; height: 25px; display: block; position: absolute;
                    left: 857px; top: 9px;"></a><a href="http://www.gzl.com.cn/Users/Login.html" target="_blank"
                        style="width: 80px; height: 25px; display: block; position: absolute; left: 764px;
                        top: 9px;"></a>
        </div>
    </div>
    <div style="width: 100%; background: #FFF; border-bottom: 1px solid #CCC;">
        <div style="width: 960px; height: 32px; margin-left: auto; margin-right: auto">
          <style>
                .mail td.text
                {
                    font: 12px "宋体" , "微软雅黑";
                    color: #93c803;
                }
                b.point
                {
                    color: #F66;
                    font-weight: normal;
                    font: 12px "宋体" , "微软雅黑";
                }
                noscript div
                {
                    display: inline;
                    padding: 2px 15px;
                    width: 300px;
                    font: 12px "宋体" , "微软雅黑";
                    color: #333;
                    float: left;
                    border: 1px solid #E8CAA4;
                    background: #FFF8E5;
                }
                noscript div a
                {
                    color: blue;
                    text-decoration: underline;
                }
            </style>
            <noscript>
                <div>
                    您的浏览器已禁用JavaScript脚本，<br />
                    为了拥有更好的浏览体验，请<a href="http://zhidao.baidu.com/question/331736481.html">查看这里</a>启用脚本。</div>
            </noscript>
            <form action="http://dmdelivery.gzl.com.cn/x/plugin/?pName=subscribe&amp;MIDRID=S7Y1BAAA38&amp;pLang=cn&amp;Z=-2044524939"
            method="post">
            <table class="mail" align="right">
                <tbody>
                    <tr>
                        <td align="right" nowrap="nowrap" class="text">
                            免费旅游？优惠抢位？折扣门票？订阅最新旅游优惠资讯！
                        </td>
                        <td>
                            <input id="email" style="color: #ccc;" type="text" name="email" value="请输入您的邮箱" size="30"
                                maxlength="200" onfocus="getFocus()" onblur="getBlur()"><b class="point">*</b>
                        </td>
                        <td>
                            <input type="submit" style="background: #ffc600; color: #fff; border: 1px solid #f09800;
                                font: 12px '宋体', '微软雅黑';" value="确认订阅">
                        </td>
                    </tr>
                </tbody>
            </table>
            <div style="visibility: hidden; font-size: 0">
                Please<em>don't</em> insert text in the box below!<input type="text" name="submitCheck"
                    value="" style="width: 1px; height: 1px; font-size: 0" /></div>
            <input type="hidden" name="DMDtask" value="subscribe" /></form>
        </div>
    </div>
    <script type="text/javascript">        function getFocus() { var val = document.getElementById("email"); if (val.value == "请输入您的邮箱") { val.value = ""; val.style.color = "#333"; } } function getBlur() { var val = document.getElementById("email"); if (val.value == "") { val.style.color = "#ccc"; val.value = "请输入您的邮箱"; } }</script>
    <div class="bgStyle posa">
    </div>
    <div class="bgBottomStyle posa">
    </div>
    <!--专辑内容 Begin-->
    <div class="main_bg posr">
        <%=mainImgRepeater%>
        <div class="posr dataBoard">
            <div id="static" class="posa dataCont">
            </div>
        </div>
    </div>
    <!--专辑内容 End-->
    <!--页脚 开始-->
    <%=footScript%>
    <!--页脚 结束-->
    <!-- Baidu Button BEGIN -->
    <script type="text/javascript" id="bdshare_js" data="type=slide&img=7&pos=right"></script>
    <script type="text/javascript" id="bdshell_js"></script>
    <script type="text/javascript">
        var bds_config = { "bdTop": 242 };
        document.getElementById("bdshell_js").src = "http://bdimg.share.baidu.com/static/js/shell_v2.js?cdnversion=" + new Date().getHours();
    </script>
    <!-- Baidu Button END -->
    <script type="text/javascript" src="/subject/jquery/jquery-ui.js"></script>
    <link rel="stylesheet" type="text/css" href="/subject/jquery/jquery-ui.css" />
    <link rel="stylesheet" type="text/css" href="/subject/edit/spe/simplePageEditor.css" />
    <script type="text/javascript" src="/subject/edit/js/Class.GzlGlobal.js"></script>
    <script type="text/javascript" src="/subject/edit/spe/jquery.xmlDataLoader.js"></script>
    <script src="/subject/edit/lib/Page.js"></script>
    <script src="/subject/edit/lib/Response.js"></script>
    <script type="text/javascript" src="/subject/edit/spe/simplePageEditor.js"></script>
    <div class="copyBoard">粘贴板内容:<span id="copyBoard">无</span></div>
    <div id="pannel" class="pannel">
        <h3>
            <b>专辑标题：<a href="/subject/<%=fileName%>/index.htm" target="_blank"><%=fileName%></a><br />现在是编辑状态</b><i>(请使用最新版Chrome浏览器)</i>版本v1.2.7更新日期20140425</h3>
        <ul>
            <li>
                <h4>
                    添加绝对定位对象</h4>
                <ol>
                    <li><a id="addLineContent" class="addClick" href="javascript:void(0);">线路容器</a></li>
                    <li><a id="addPosaDiv" class="addClick" href="javascript:void(0);">Div</a></li>
                    <li><a id="addPosaTextArea" class="addClick" href="javascript:void(0);">文本框</a></li>
                    <li><a id="addPosaLink" class="addClick" href="javascript:void(0);">超链接地址</a></li>
                    <li><a id="addUpdate" class="addClick" href="javascript:void(0);">网页声明</a></li>
                </ol>
            </li>
            <li>
                <h4>
                    添加线路对象</h4>
                <ol>
                    <li><a id="addTitle" class="childClick addClick" addtype="title" href="javascript:void(0);">
                        线路标题</a></li>
                    <li><a id="addPrice" class="childClick addClick" addtype="price" href="javascript:void(0);">
                        线路价格</a></li>
                    <li><a id="addBtn" class="childClick addClick" addtype="link" href="javascript:void(0);">
                        线路按钮</a></li>
                    <li><a id="addRemark" class="childClick addClick" addtype="remark" href="javascript:void(0);">
                        线路备注</a></li>
                </ol>
            </li>
            <li>
                <h4>
                    添加特殊对象</h4>
                <ol>
                    <li><a id="addCssLink" class="spcClick addClick" addtype="title" href="javascript:void(0);">
                        CSS链接</a></li>
                    <li><a id="addJsLink" class="spcClick addClick" addtype="title" href="javascript:void(0);">
                        JavaScript链接</a></li>
                </ol>
            </li>
            <li>
                <h4>
                    对象属性</h4>
                <ol id="attr" class="attr">
                </ol>
            </li>
            <li><b>修改次数：</b><span id="editCount">0</span></li>
            <li class="center">
                <button id="save">
                    保存页面</button></li>
                    <li><br /></li>
            <li><b>需要：<span id="ajaxDataXMLInfo"></span>个线路容器</b></li>
            <li><br /></li>
            <li class="center">
                <button id="createPage">
                    生成静态页面</button></li>
            <li><br /></li>
            <li><a id="createLink" href="javascript:void(0);" target="_blank"></a></li>
            <li style="padding-bottom: 10px; text-align: center"><a href="/subject/edit/spe/default.aspx?file=<%=fileName%>">返回上一页编辑</a> </li>
            <li class="center">
            <form id="form1" runat="server">
            <asp:Button ID="download" runat="server" Text="下载HTML" onclick="download_Click" /></form></li>
            
        </ul>
    </div>
    <style id="mainStyle" type="text/css"></style>
</body>
</html>
