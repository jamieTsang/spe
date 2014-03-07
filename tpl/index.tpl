<!DOCTYPE HTML>
<html lang="zh" dir="ltr">
<head>
<meta charset="gb2312" />
{$tplTitleKeyWordsDescription}
<link rel="shortcut icon" href="/Static/images/Favicon.ico" />
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js"></script>
<script>!window.jQuery && document.write('<script src="/Static/Jscripts/jquery-min.js"><\/script>');</script>
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

<div class="bgStyle posa"></div>
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
<script type="text/javascript">
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-9644479-6']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
</script> 
<!-- 改价4.0注释 -->
{$tplPEAScript}
<!-- 改价4.0注释 -->
</body>
</html>
