<!DOCTYPE HTML>
<html lang="zh" dir="ltr">
<head>
<meta charset="gb2312" />
{$tplTitleKeyWordsDescription}
<link rel="shortcut icon" href="/Static/images/Favicon.ico" />
<script src="/Static/scripts/jquery-1.7.2.min.js"></script>
<!-- <script type="text/javascript" src="scripts/lazyload.js"></script>
<script type="text/javascript" src="scripts/default.js"></script> -->
<style type="text/css">
{$tplMainStyleCss}
</style>
<style type="text/css">
{$tplDefualtCss}{$tplChildrenStyle}{$tplLineStyle}
</style>
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
<!-- {$header} -->

<div id="bgStyle" class="bgStyle posa"></div>
<div class="bgBottomStyle posa"></div>
<!--专辑内容 Begin-->
	<div class="main_bg posr">
		{$tplMainImgRepeater}
		<div class="posr dataBoard">
		  <div id="static" class="posa dataCont">
			{$tplStaticRepeater}
		  </div>
		</div>
	</div>
<!--专辑内容 End-->
<!--页脚 开始-->
{$tplFootScript}
<!--页脚 结束--> 
<!-- Baidu Button BEGIN -->
<script type="text/javascript" id="bdshare_js" data="type=slide&img=7&pos=right" ></script>
<script type="text/javascript" id="bdshell_js"></script>
<script type="text/javascript">
		var bds_config = {"bdTop":242};
		document.getElementById("bdshell_js").src = "http://bdimg.share.baidu.com/static/js/shell_v2.js?cdnversion=" + new Date().getHours();
</script>
<!-- Baidu Button END -->
<!-- {$stats} -->
<!-- 改价4.0注释 -->
{$tplPEAScript}
<!-- 改价4.0注释 -->
</body>
</html>
