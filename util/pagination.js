/*
options = {
	page: //需要显示的页码
	model: //操作的数据模型
	query: //查询条件
	projection: //投影，
	sort: //排序
	populate:[]
}
*/

let pagination = (options)=>{

	return new Promise((resolve,reject)=>{
		//需要显示的页码
		
		let page = 1;

		if(!isNaN(parseInt(options.page))){
			page = parseInt(options.page);
		}

		if(page <= 0){
			page = 1;
		}

		//每页显示条数
		let limit = 5;

		/*
		分页:
		假设: 每页显示 2 条  
		limit(2)
		skip()//跳过多少条
		第 1 页 跳过 0 条
		第 2 页 跳过 2 条
		第 3 也 跳过 4 条
		综上发现规律:
		(page - 1) * limit
		*/

		options.model.countDocuments(options.query)
		.then((count)=>{
			let pages = Math.ceil(count / limit);
			if(page > pages){
				page = pages;
			}
			if(pages == 0){
				page = 1;
			}
			let list = [];

			for(let i = 1;i<=pages;i++){
				list.push(i);
			}

			let skip = (page - 1)*limit;

			let query=options.model.find(options.query,options.projection)
			//如果传了populate，循环，把所有的populate赋给query
			if(options.populate){
				for(var i=0;i<options.populate.length;i++){
					query=query.populate(options.populate[i])
				}
			}
			query
			.sort(options.sort)
			.skip(skip)
			.limit(limit)
			.then((docs)=>{
				resolve({
					docs:docs,
					page:page*1,
					list:list,
					pages:pages
				})		
			})
		})
	});
}

module.exports = pagination;