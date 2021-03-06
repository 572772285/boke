const Router = require('express').Router;
const UserModel=require('../models/blog.js')
const categoryModel=require('../models/category.js')
const CommentModel=require('../models/comment.js')
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });
const fs = require('fs');
const path = require('path');
const router = Router();
const hmac=require('../util/hmac.js')

const pagination = require('../util/pagination.js')
router.use((req,res,next)=>{
	if(req.userInfo.isAdmin){
		next()
	}else{
		res.send('<h1>请用管理员账号登录</h1>');
	}
})
//显示首页
router.use((req,res,next)=>{
	if(req.userInfo.isAdmin){
		next()
	}else{
		res.render('admin/user',{
			userInfo:req.userInfo
		})
	}
})
router.get("/",(req,res)=>{
	res.render('admin/index',{
		userInfo:req.userInfo
	})
})
router.get('/users',(req,res)=>{
	//获取所有用户的信息,分配给模板
	
	//获取所有用户的信息,分配给模板

	let options = {
		page: req.query.page,//需要显示的页码
		model:UserModel, //操作的数据模型
		query:{}, //查询条件
		projection:'_id username isAdmin', //投影，
		sort:{_id:-1} //排序
	}

	pagination(options)
	.then((data)=>{
		res.render('admin/user_list',{
			userInfo:req.userInfo,
			users:data.docs,
			page:data.page,
			list:data.list,
			pages:data.pages,
			url:'/admin/users'
		});	
	})



})

router.get('/add',(req,res)=>{
	res.render('admin/category_add')
})

//显示用户列表
router.get('/users',(req,res)=>{
	//获取所有用户的信息,分配给模板
	let options = {
		page: req.query.page,//需要显示的页码
		model:UserModel, //操作的数据模型
		query:{}, //查询条件
		projection:'_id username isAdmin', //投影，
		sort:{_id:-1} //排序
	}
	pagination(options)
	.then((data)=>{
		res.render('admin/user_list',{
			userInfo:req.userInfo,
			users:data.docs,
			page:data.page,
			list:data.list,
			pages:data.pages,
			url:'/admin/users'
		});	
	})
})

//添加文章是处理图片上传
router.post('/uploadImages',upload.single('upload'),(req,res)=>{
	let path = "/uploads/"+req.file.filename;
	res.json({
		uploaded:true,
        url:path
	})
})

//显示用户评论列表
router.get('/comments',(req,res)=>{
	CommentModel.getPaginationComments(req)
	.then(data=>{
		res.render('admin/comment_list',{
			userInfo:req.userInfo,
			comments:data.docs,
			page:data.page,
			pages:data.pages,
			list:data.list
		})
	})
})

//删除评论
router.get("/comment/delete/:id",(req,res)=>{
	let id = req.params.id;
	CommentModel.remove({_id:id},(err,raw)=>{
		if(!err){
			res.render('admin/success',{
				userInfo:req.userInfo,
				message:'删除评论成功',
				url:'/admin/comments'
			})				
		}else{
	 		res.render('admin/error',{
				userInfo:req.userInfo,
				message:'删除评论失败,数据库操作失败'
			})				
		}		
	})

});


//显示站点管理页面
router.get("/site",(req,res)=>{
	let filePath = path.normalize(__dirname + '/../site-info.json');
	fs.readFile(filePath,(err,data)=>{
		if(!err){
			let site = JSON.parse(data);
			res.render('admin/site',{
					userInfo:req.userInfo,
					site:site
			});	
		}else{
			console.log(err)
		}	
	})

})

//显示站点管理页面
router.get("/site",(req,res)=>{
	let filePath = path.normalize(__dirname + '/../site-info.json');
	fs.readFile(filePath,(err,data)=>{
		if(!err){
			let site = JSON.parse(data);
			res.render('admin/site',{
					userInfo:req.userInfo,
					site:site
			});	
		}else{
			console.log(err)
		}
	})

})
//处理修改网站配置请求
router.post("/site",(req,res)=>{
	let body=req.body;
	let site = {
		name:body.name,
		author:{
			name:body.authorName,
			intro:body.authorIntro,
			image:body.authorImage,
			wechat:body.authorWechat
		},
		icp:body.icp
	}
	//给轮播结构添加一个空数组
	site.carouseles =[];
	//如果轮播图片地址是对象代表有多个轮播图片，下面开始遍历
	if(body.carouselUrl.length &&(typeof body.carouselUrl=='object')){
		for(var i=0;i<body.carouselUrl.length;i++){
			site.carouseles.push({
				url:body.carouselUrl[i],
				path:body.carouselPath[i]
			})
		}
	}else{
		site.carouseles.push({
				url:body.carouselUrl,
				path:body.carousePath
			})
	}
	//给广告结构添加一个空数组
	site.ads=[];
	if(body.adUrl.length &&(typeof body.adUrl=='object')){
		for(var i=0;i<body.adUrl.length;i++){
			site.ads.push({
				url:body.adUrl[i],
				path:body.adPath[i]
			})
		}
	}else{
		site.ads.push({
			url:body.adUrl,
			path:body.adPath
		})
	}
	//把site转化为字符串写进文件里
	let siteStr=JSON.stringify(site)
	console.log(siteStr)
	let filePath = path.normalize(__dirname + '/../site-info.json');
	fs.writeFile(filePath,siteStr,(err)=>{
		if(!err){
				res.render('admin/success',{
					userInfo:req.userInfo,
					message:'提交成功',
					url:'/admin/site'
				})				
			}else{
		 		res.render('admin/error',{
					userInfo:req.userInfo,
					message:'提交失败,数据库操作失败'
				})				
			}
	})

})

router.get('/password',(req,res)=>{
		res.render('admin/password',{
			userInfo:req.userInfo
		})
	})
router.post('/password',(req,res)=>{
	let body=req.body;
	console.log(body);
	UserModel.update({_id:req.userInfo._id},{
		password:hmac(body.password)
	})
	.then((result)=>{
		req.session.destroy();
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'成功',
			url:'/'
		})	
	})
})

module.exports = router