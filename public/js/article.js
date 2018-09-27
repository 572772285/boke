
(function($){
	ClassicEditor
        .create( document.querySelector( '#editor' ),{
        	language:'zh-cn',
        	ckfinder:{
        		uploadUrl:'/article/uploadImages'
        	}
        })
        .then((editor)=>{
            //把editor绑定到window对象上，下面用到
            window.editor=editor
        })
        .catch( error => {
            console.error( error );
        } );


        //验证标题，内容图片
        $('#btn-sub').on('click',()=>{
        var title = $('[name = "title"]').val();
        var intro = $('[name = "intro"]').val();
        var content=editor.getData();
        if(title.trim() == ''){
            $('.err').eq(0).html ('题目不能为空！');
            return false;
        }else{
            $('.err').html('');
        }
        if(intro.trim() == ''){
            $('.err').eq(1).html ('简介不能为空！');
            return false;
        }else{
            $('.err').html('');
        }
        if(content.trim() == '<p>&nbsp;</p>'){
            $('.err').eq(2).html ('内容不能为空');
            return false;
        }else{
            $('.err').html('');
        }
        })
})(jQuery);