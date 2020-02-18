(function(win,doc){
	win.heartBack = function(e){
		var t = this;
		var o = {
			selector : 'canvas',//默认
			width : 0,//宽-默认窗口
			height : 0,//高-默认窗口
			aim_selector : '',//漂浮的元素
			aim_width : 0,//元素宽
			aim_height : 0,//元素高
			aim_count : 0,//元素个数
			is_scale : false ,//是否缩放
			is_rotate : false ,//是否旋转 
			up_down : true //方向，上下
		};
		!function(e) {//提取
            if (e){
				for (var t in e){
					e.hasOwnProperty(t) && o.hasOwnProperty(t) && (o[t] = e[t]);
				}
				t.config = o;
			}
        }(e);
		let aim_s = [],canvas,ctx,width,height,centerX,centerY,aim,count,aim_w,aim_h,isStop=false;
		function init(){
			ctx = canvas.getContext('2d');
			width = canvas.width= o.width || document.body.clientWidth;//设置-宽
			height = canvas.height= o.height || document.body.clientHeight;//设置-高
			centerX = width / 2;//中心坐标-x
			centerY = height / 2;//中心坐标-y
			count = o.aim_count || 50;//个数
			o.aim_width = o.aim_width ||aim.width;//元素宽
			o.aim_height = o.aim_height ||aim.height;//元素高
			aim_w = o.aim_width && 30 ;//实际宽高
			aim_h = 30 * (o.aim_width / o.aim_height);
			aimInit();
			console.dir(aim_s)
			draw();
		}
		function aimInit(){
			for (let i = 0; i < count; i++) {//装载元素
				  let angle = 15 + Math.random() * 45;//角度计算
				  let dir = [-1,1][Math.floor(Math.random() * 2)];//旋转方向
				  aim_s.push({
					x: Math.random() * width,//随机坐标-x
					y: Math.random() * height,//随机坐标-y
					w: aim_w,//宽
					h: aim_h,//高
					v: 40 / angle,//速度
					a: angle,//角度
					d: dir,//逆时针或顺时针
					anim: true//动画
				});
			}
		}
		
		function update(dt,one,i){
			//console.log(dt,d);
			one.y = o.up_down ? (one.y - one.v) : (one.y + one.v) ;//下一帧y坐标
			if (o.up_down ? one.y <= -200 : one.y > height+200) {//如果超过高度
				one.anim = false;
				one.y = o.up_down ? (100+height) : (-120) ;//y坐标改为窗口外
				one.x = Math.random() * width;//x坐标随机另一个位置
			}else{
				one.anim = true;
				let d = o.is_scale ? (Math.abs((dt+one.a*30)%1000-500)+500)/1000 : 1; //是否缩放
				one.w = 50*d; //宽
				one.h = 50*d; //高
			}
		}
		function draw(dt) {
			if( isStop ){
				ctx.clearRect(0, 0, width, height);//清理画布
				return;
			}
			requestAnimationFrame(draw);//请求动画帧
			ctx.clearRect(0, 0, width, height);//清理画布
			for (let i = 0,len = aim_s.length; i < len; i++) {
				let one = aim_s[i];
				update(dt,one,i);//修改叶子的坐标
				ctx.save();//保存当前环境的状态
				if (one.anim) {//是动画
					ctx.translate(one.x, one.y);//重新映射画布上的 (x,y) 位置
					//旋转当前绘图
					if(o.is_rotate){
						ctx.rotate(one.d * Math.sin(dt*0.00002*i)*(one.a)*Math.PI / 180);
					}
					ctx.globalAlpha = Math.max(0, one.y * 0.1);//设置或返回绘图的当前 alpha 或透明值
					ctx.drawImage(aim, 10, 10, one.w, one.h);//向画布上绘制图像、画布或视频
				}
				ctx.restore();//返回之前保存过的路径状态和属性
			}
		}
		t.start = function(){//开始绘制
			if("string" === typeof o.selector && o.selector && "string" === typeof o.aim_selector && o.aim_selector){
				canvas = doc.querySelector(o.selector);
				aim = doc.querySelector(o.aim_selector);
				isStop = false;
				canvas && aim && init();
			}
		}
		t.stop = function(){
			isStop = true;
		}
	}
}(window,document));