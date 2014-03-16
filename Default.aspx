<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="subject_edit_spe_Default" %>

<%@ Import Namespace="System" %>
<!DOCTYPE>
<html>
<head runat="server">
    <title>简单切图网页生成页面1.2.0</title>
    <style type="text/css">
        body
        {
            font-size: 13px;
        }
        .text
        {
            width: 190px;
        }
        .number
        {
            width: 40px;
        }
        .datepicker
        {
            width: 104px;
            background: url(/static/images/sprite_global.png) no-repeat;
            background-position: 0 -421px;
        }
        .textarea
        {
            width:360px;    
        }
        input, textarea
        {
            color: #101010;
            border: 1px solid #DDD;
            border-top-color: #BBB;
            border-radius: 2px;
            vertical-align: middle;
            -webkit-transition: border linear .2s,box-shadow linear .2s;
            -moz-transition: border linear .2s,box-shadow linear .2s;
            -ms-transition: border linear .2s,box-shadow linear .2s;
            -o-transition: border linear .2s,box-shadow linear .2s;
            transition: border linear .2s,box-shadow linear .2s;
            padding: 3px;
        }
        #Button1
        {
            cursor:pointer;    
        }
        .text:hover, .number:hover, .textArea:hover
        {
            border-color: #d0d0d0;
            border-top-color: #acacac;
            -webkit-box-shadow: inset 0 1px #f5f5f5;
            -moz-box-shadow: inset 0 1px #f5f5f5;
            box-shadow: inset 0 1px #f5f5f5;
        }
        .text:focus, .number:focus, .textArea:focus
        {
            border-color: #690;
            outline: 0;
            -webkit-box-shadow: 0 0 8px rgba(102,153,0,.6);
            -moz-box-shadow: 0 0 8px rgba(102,153,0,.6);
            box-shadow: 0 0 8px rgba(102,153,0,.6);
        }
        h1
        {
            background: #0F0;
            margin: 8px 0;
        }
        p
        {
            margin: 2px auto;
        }
        i
        {
            font-size: 18px;
        }
        #loading_unit
        {
            display: none;
            border-radius: 8px;
            box-shadow: 0 0 4px rgba(0, 0, 0, .5),inset 0 0 60.5px rgba(225, 225, 225, .4);
            position: fixed;
            z-index: 9999;
            width: 310px;
            height: auto;
            left: 50%;
            top: 50%;
            margin-left: -155px;
            margin-top: -60px;
            background: white;
            text-align: center;
            font-size: 16px;
        }
        #loading_unit p
        {
            margin: 0;
        }
        #loading_unit h1
        {
            font-size: 16px;
            color: #555;
            font-weight: bold;
            padding: 0;
            margin: 16px 0 5px 0;
            letter-spacing: -.0125em;
            background: none;
        }
        #loading_unit h2
        {
            font-size: 12px;
            color: #555;
            font-weight: 400;
            padding: 0;
            letter-spacing: -.0125em;
        }
        .colorpickerCont{
            position: absolute;
            width: 36px;
            height: 36px;
            background: url(/subject/edit/spe/colorpicker/images/select2.png)
        }
        .colorpickerCont div
        {
            position: absolute;
            top: 4px;
            left: 4px;
            width: 28px;
            height: 28px;
            background: url(/subject/edit/spe/colorpicker/images/select2.png) center;
        }
        .cp1
        {
            top: 0;
            left: 85px;
        }
        .row
        {
            min-height:40px;
            }
    </style>
	<link rel="stylesheet" type="text/css" href="/subject/edit/spe/colorpicker/css/colorpicker.css" />
<script type="text/javascript" src="/Static/scripts/jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="/Static/scripts/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="/subject/edit/spe/colorpicker/js/colorpicker.js"></script>
</head>
<body>
    <h1>
        简单切图网页生成页面<i>(请使用最新版Chrome浏览器)</i>v1.2.0 更新日期20140310</h1>
    <form id="form1" runat="server" onsubmit="return save(this)">
    <div class="row">
        <label>
            文件夹名：<%= dayName+"_" %></label>
        <input type="text" id="FileName" runat="server" class="text" placeholder="例如：Travel"/>
    </div>
    <div class="row">
        Title：<input type="text" types="title" id="Title" runat="server" class="text pageData" placeholder="例如：惠游天下，国内游冰点价"/>&nbsp; - 广州广之旅官方网站</div>
    <div class="row">
        Keyword：<input type="text" types="keywords" id="Keyword" runat="server" class="text pageData" placeholder="例如：旅游优惠,出境游"/>&nbsp;,广之旅</div>
    <div class="row">
        Description：<textarea id="Description" types="description" rows="5" cols="20" runat="server" class="textArea pageData" placeholder="例如：十一黄金周，明明白白消费，快快乐乐出游，发现中国最美丽的角落~！"></textarea>&nbsp;
        -广之旅</div>
    <div class="row" style="position:relative">
        背景颜色：<div id="colorSelector" class="colorpickerCont cp1"><div></div></div></div>
    <input id="bgColor" types="bgColor" class="pageData" runat="server" type="hidden" value="333333"/>
    <div class="row">
        背景图片高度：<input type="text" types="bgHeight" id="bgHeight" runat="server" class="number pageData" value="1024"/>&nbsp;px</div>
    <div class="row">
        背景图片文件名：<input type="text" types="bgURL" id="bgURL" runat="server" class="text pageData" value="bg"/><asp:DropDownList
            ID="drop1" runat="server">
            <asp:ListItem>.jpg</asp:ListItem>
            <asp:ListItem>.png</asp:ListItem>
            <asp:ListItem>.gif</asp:ListItem>
        </asp:DropDownList>
    </div>
   <%-- <div>
        切片数量：<input type="text" id="TextBox4" runat="server" class="number" value="13"/>&nbsp;张</div>--%>
    <%--<div>
        切片高度：<input type="text" id="TextBox5" runat="server" class="number" value="300"/>&nbsp;px</div>--%>
    <%--<div>
        最后一张切片高度：<input type="text" id="TextBox6" runat="server" class="number" />&nbsp;px</div>--%>
    <div class="row">
        售罄按钮y：-&nbsp;<input type="text" types="soldOutY" id="soldOutY" runat="server" class="number pageData" value="60"/>&nbsp;px</div>
   <%-- <div>
        页面宽度：<input type="text" id="TextBox10" runat="server" class="number" value="980"/>&nbsp;px</div>--%>
    <div class="row">
        页脚信息(上线日期)：<input type="text" types="starTime" id="Time1" runat="server" class="datepicker text pageData" onFocus="var Time1=$dp.$('Time1');WdatePicker({onpicked:function(){Time2.focus();},maxDate:'#F{$dp.$D(\'Time2\')}',dateFmt:'yyMMdd'})"/>-
        <input type="text" types="endTime" id="Time2" runat="server" class="datepicker text pageData" onFocus="WdatePicker({minDate:'#F{$dp.$D(\'Time1\')}',doubleCalendar:true,dateFmt:'yyMMdd'})"/></div>
    <div class="row">
        页脚信息（作者）：<input type="text" types="author" id="Author" runat="server" class="text pageData" placeholder="例如：jamie"/></div>
    <div class="row">
        <asp:Button ID="Button1" runat="server" Text="生成预览" OnClick="Button1_Click" /></div>
    <div id="result" runat="server">
    </div>
    </form>
<script type="text/javascript">
    var initial = "#" + $('#bgColor').val();
    $('#colorSelector').ColorPicker({
        color: initial,
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
            $('#bgColor').val(hex);
        }
    }).bind('keyup', function () {
        $(this).ColorPickerSetColor(this.value);
    });
    $('#colorSelector div').css({ 'background-color': initial });
    WdatePicker();
    function getURL() {
        var p = window.location.search.toString();
        return p.match(/(\d+_\S+)/i)[1];
    }
    var address = getURL();
    if (address) {
        $.ajax({
            type: "GET",
            data: null,
            url: '/subject/' + address + '/datas/page.config.xml?t=' + Math.random(),
            dataType: 'xml',
            success: function (data) {
                var root = $(data).children('root');
                $(".pageData").each(function (i, e) {
                    var $e = $(e);
                    var type = $e.attr('types');
                    $e.val(root.children(type).text());
                    if(type=="bgColor")
                        $('#colorSelector div').css({ 'background-color': root.children(type).text() });
                });
                $('#ajaxDataXMLInfo').text(root.find('line').length);
            },
            error: function (a, b, c) {
                alert("找不到页面设置XML文件");
            }
        });
    }
</script>
</body>
</html>
