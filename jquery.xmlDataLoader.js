// SPE编辑页查询线路信息XMLjQuery插件 version_1.0.3 20131005
  jQuery.extend({
	xmlDataLoader:function(){
	  function main(){
		  //创建参数变量
		  var lineObject;
		  var xmlTitle;
		  var xmlPrice;
		  var xmlRemark;
		  //获取文件名
		  var fileName=window.location.search.toString().match(/(\d+_\S+)/i)[1];
		  $.ajax({
			type : "GET",
			data : null,
			url : '/subject/'+fileName+'/scripts/data.xml?t='+Math.random(),
			timeout : 20000,
			dataType : 'xml',
			error : function (XMLHttpRequest, strError, strObject) {},
			success : function (data) {
				var root=$(data);
				$('.line').each(function(i,e){
					var _this=$(this);
					_this.find('.title #content').text(root.find('line:eq('+i+')').find('title').text());
					_this.find('.price #content').html("<em>&yen;</em>"+root.find('line:eq('+i+')').find('price').text());
					var remarks=_this.find('.remark')
					if(root.find('line:eq('+i+')').find('soldout').text()=="Y"){
					_this.find('.link').addClass('soldOut')};
					
					if(remarks.length){
						remarks.each(function(j,e){
							$(this).find('#content').html(root.find('line:eq('+i+') remark r'+j).text().replace(/\[br\]/g,'<br/>').replace(/\[b\]/g,'<b>').replace(/\[\/b\]/g,'</b>'));
						});
					}
				});
				$('#ajaxDataXMLInfo').text(root.find('line').length);
			},
			error:function(a,b,c){
				$('#ajaxDataXMLInfo').text("缺少data.xml！");
			}
		  });
	  }
	  return main();
	}
});