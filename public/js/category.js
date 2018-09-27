(function($){
	//验证
	$('#btn-sub').on('click',()=>{
		var catename = $('[name = "name"]').val();
		// alert(catename);
		if(catename.trim() == ''){
			$('.err').html ('分类名称不能为空');
			return false;
		}else{
			$('.err').html('');
		}
	})
})(jQuery)