(function($){

	// 修改验证
	$('#btn-sub').on('click',function(){
		// let passwordReg = /^.{3,6}$/i;
		var password=$('#mima1').val();
		var repassword=$('#mima2').val();
		var errMsg=$('.err');
		console.log(errMsg)

		if(password==''&&repassword==''){
			errMsg.html('请输入密码')
			return false;
		}else if(password==''){
			errMsg.eq(0).html('请输入密码')
			return false;
		}else if(repassword==''){
			errMsg.eq(1).html('请输入密码')
			return false;
		}else if(password != repassword){
			errMsg.html('两次密码输入不一致')
			return false;
		}else{
			errMsg.html('')
		}
	})

})(jQuery)