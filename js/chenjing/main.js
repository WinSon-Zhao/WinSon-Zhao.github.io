!function(d){
	var g_ = d.yun = {};
	g_.type = Object.prototype.toString ;
	g_.isNull = function(o){ return null === o;}
	g_.isUndefined = function(o){ return 'undefined' === typeof o;}
	g_.isNumber = function(o){ return 'number' === typeof o;}
	g_.isBoolean = function(o){ return 'boolean' === typeof o;}
	g_.isString = function(o){ return 'string' === typeof o;}
	g_.isObject = function(o){ return g_.type.call(o) === '[object Object]';}
	g_.isArray = function(o){ return g_.type.call(o) === '[object Array]';}
	g_.isMath = function(o){ return g_.type.call(o) === '[object Math]';}
	g_.isFunction = function(o){ return 'function' === typeof o;}
	g_.isDate = function(o){ return g_.type.call(o) === '[object Date]';}
	//ES6 引入了一种新的原始数据类型Symbol，表示独一无二的值
	g_.isSymbol = function(o){ return g_.type.call(o) === '[object Symbol]';}
	//正则表达式,它是对字符串执行模式匹配的强大工具
	g_.isRegExp = function(o){ return g_.type.call(o) === '[object RegExp]';}
	g_.isWindow = function(o){ return g_.type.call(o) === '[object Window]';}
	//提供了一组静态方法用来对 SharedArrayBuffer 对象进行原子操作
	g_.isAtomics = function(o){ return g_.type.call(o) === '[object Atomics]';}
	g_.isBigInt = function(o){ return g_.type.call(o) === '[object BigInt]';}
	g_.isHTML = function(o){ return g_.type.call(o).indexOf('object HTML') > 0;}

	g_.getEl = function (query){//获取元素
		return d.querySelector(query);
	}
	g_.getEls = function (query){//获取元素
		return d.querySelectorAll(query);
	}
	g_.elHtml = function (val,query){//元素内写内容
		getEl(selector).innerHTML = val;
	}
	//多行字符串 ，读取函数内容含注释，返回字符串
	g_.heredoc = function (fn) {
		return fn.toString().split('\n').slice(1,-1).join('\n') + '\n';
	}
	g_.createEl = function(tag){//创建元素
		return d.createElement(tag);
	}
	g_.insertEl = function(node,el,query){//指定容器中的指定节点前插入
		var q = node.querySelector(query);
		node.insertBefore(el,q);
	}
	g_.appendEl = function(node,el){
		node.append(el);
	}
	g_.forIn = function(t,o={}){
		for(var k in o){
			t[k] = o[k];
		}
	}
	g_.attr = function(node,o){
		if(g_.isString(o))return node.getAttribute(o);
		for(var k in o){
			node.setAttribute(k,o[k]);
		}
	}
	g_.css = function(node,o={}){
		if(g_.isString(o))return node.style[o];
		g_.forIn(node.style,o);
	}
	g_.cls = function(el,cname){
		var cls = el.classList;
		if(g_.isString(cname)){
			cls.add(cname);
		}else if(g_.isArray(cname)){
			for (var i = 0; i < cname.length; i++) {
				var c = cname[i];
				if(!cls.contains(c)) cls.add(c);
			}
		}
	}
	g_.showDIV = function(query){
		g_.getEl(query).style.display = 'block';
	}
	g_.hideDIV = function(query){
		g_.getEl(query).style.display = 'none';
	}
	g_.hide = function(el,offset){
		var opacity = el.style.opacity || 1;
		setTimeout(function(){
			opacity = parseFloat(opacity)-offset;
			opacity = opacity <0 ? 0:opacity;
			el.style.opacity = String(opacity);
			opacity > 0 && g_.hide(el,offset);
		}, 100);
	}
	g_.show = function(el,offset){
		var opacity = el.style.opacity || 0;
		setTimeout(function(){
			opacity = parseFloat(opacity)+offset;
			opacity = opacity >1 ? 1:opacity;
			el.style.opacity = String(opacity);
			opacity < 1 && g_.show(el,offset);
		}, 100);
	}
	g_.sliceLen = function(str,len){
		return str.length > len ? (str.slice(0,len)+'...') : str ;
	}
	g_.ajaxTXT = function(url='',success=function(){},fail=function(){}){
        //使用Ajax的get方式获取服务器中txt文件内的文字内容
        var xhr = new XMLHttpRequest();
        xhr.open('get',url,true);
        xhr.onreadystatechange = function(){
            //0初始化；1请求开始；2发送完成；3开始读取响应；4读取响应结束
            if(xhr.readyState != 4)return;
            if(xhr.status >= 200 && xhr.status < 300){//成功
                success(xhr.status,xhr.responseText);
            }else{
                fail(xhr.status,xhr.responseText);
            }
        }
        xhr.send();
    }
	g_.tree = function(query,arr){
		var e = d.querySelector(query),ul = d.createElement('ul'),li = d.createElement('li');
		li.style.listStyle = 'none';
		//ul.style.paddingInlineStart = '1em';
		ul.style.marginLeft = '1em';
		ul.style.textAlign = 'left';
		var text = ['<span title="','','">',' ','<a href="#','top','" style="text-decoration: none;">','标题','</a></span>'];
		var tree = function(el,data){
			data.forEach(function(d,i,o){
				var l_ = li.cloneNode();
				text[1] = d['name']; text[5] = d['id']; text[7] = g_.sliceLen(d['name'],10);
				if(d['child']){
					text[3] = '<span  class="icon_">▼</span>';
					var u_ = ul.cloneNode();
					l_.innerHTML = text.join('');
					l_.appendChild(u_);
					tree(u_,d['child']);
				}else{
					text[3] = ' ';
					l_.innerHTML = text.join('');
				}
				el.appendChild(l_);
			})
		}
		e.innerHTML = ''; e.appendChild(ul);
		tree(ul,arr);
		e.querySelectorAll('.icon_').forEach(function(el,i,list){
			el.onclick = function(){
				var p = el.parentNode.nextElementSibling;
				var f = (p.style.display == 'none');//展开、折叠
				p.style.display = f ? 'block':'none';
				el.innerHTML = f ? '▼':'▶';
			}
		});
	}
g_.init_top = function(){
	var to_top = g_.createEl('div');//头部锚点
	g_.attr(to_top,{'id':'to_top'});
	g_.css(to_top,{'height':'0px','width':'0px'});
	g_.insertEl(d.body,to_top,'article');
}
g_.init_header = function(){
	var header = g_.createEl('header');//头部
	header.innerHTML = g_.heredoc(function(){/*!
	<div><img style="background-color: #9e9e9e;width: 80px;border-radius: 15px;" src="/img/favicon.png"></div>
	<div><a class="a_none" href="/">WinSonZhao ©博客(BLOG)</a></div>
	<hr>
	<div>
		<ul class="a_none ul_display">
			<li title="首页(Home)"><a href="/">Home</a></li>
			<li title="关于(About)"><a href="/_about">About</a></li>
			<li title="国外(GitHub)"><a href="https://winson-zhao.github.io/">GitHub</a></li>
			<li title="国内(Gitee)"><a href="https://winsonzhao.gitee.io/">Gitee</a></li>
		</ul>
	</div>
	*/});
	g_.insertEl(d.body,header,'article');
}
g_.init_left = function(){
	var left = g_.createEl('div');
	g_.attr(left,{'id':'article_left'});
	g_.cls(left,'back_small_label');
	left.innerHTML = g_.heredoc(function(){/*!
	<div id="left_list" class="common_back">
		<ul class="a_none">
			<li>左侧列表</li>
		</ul>
	</div>
	*/});
	g_.insertEl(g_.getEl('article'),left,'#article_main');
}
g_.add_left = function(arr){
	var ul = g_.getEl('#article_left ul');
	ul.innerHTML = '';
	for(var i = 0,l = arr.length ; i < l ; i++ ){
		var li = d.createElement('li'),a = d.createElement('a');
		g_.attr( a , { 'title' : arr[i]['name'],'href' : arr[i]['url'] } );
		a.innerHTML = g_.sliceLen( arr[i]['name'] , 10 );
		li.append(a);
		ul.append(li);
	}
	/*var left_ul = g_.getEl('#article_left ul');
	var li = ['<li title="','1','"><a href="','3','">','5','</a></li>'];
	var html = left_ul.innerHTML;
	for(var i = 0,l = arr.length ; i < l ; i++ ){
		li[1] = arr[i]['name'];
		li[3] = arr[i]['url'];
		li[5] = g_.sliceLen(arr[i]['name'],10);
		html += li.join('');
	}
	left_ul.innerHTML = html;*/
}
g_.init_footer = function(){
	var footer = g_.createEl('footer');//底部
	g_.cls(footer,'common_back');
	footer.innerHTML =  g_.heredoc(function(){/*!
		<div>© 2016-2020 欢迎光临。保留所有权利。</div>
		<div>(Welcome to visit. All rights reserved.)</div>
	*/});
	d.body.appendChild(footer);
}
g_.init_floating = function(){
	var floating = g_.createEl('div');//浮动内容
	var floatingHtml =g_.heredoc(function(){/*!
    <div id="common_small_toLeft" class="common_small_label back_small_label">
		<span title="博客列表(Blog list)" style="margin: 0 auto">
			<a href="javascript:;">L</a>
		</span>
    </div>
    <div id="common_small_toHome" class="common_small_label back_small_label">
		<span title="首页(Home)" style="margin: 0 auto">
			<a href="/">H</a>
		</span>
    </div>
    <div id="common_small_toTop"  class="common_small_label back_small_label">
		<span title="顶部(Top)" style="margin: 0 auto">
			<a href="#to_top">T</a>
		</span>
	</div>
	*/});
	floating.innerHTML = floatingHtml;
	g_.attr(floating,{'id':'floating'});
	d.body.appendChild(floating);
}
g_.init_right = function(){
	var toRight = g_.createEl('div');
	g_.attr(toRight,{'id':'common_small_toRight'});
	g_.cls(toRight,['common_small_label','back_small_label']);
	toRight.innerHTML = g_.heredoc(function(){/*!
	<span title="文章标题(Article title)" style="margin: 0 auto">
		<a href="javascript:;">R</a>
	</span>
	*/});
	g_.getEl('#floating').appendChild(toRight);

	var article_right = g_.createEl('div');
	g_.attr(article_right,{'id':'article_right'});
	g_.cls(article_right,'common_back');
	article_right.innerHTML = '页面无标题列表(Page untitled list)';
	g_.getEl('article').appendChild(article_right);

	g_.getEl('#common_small_toRight').onclick = function(e){
		var a = this.querySelector('a'),v = a.innerHTML;
		a.innerHTML = ( v === 'R' ? 'X':'R' );
		v === 'R' ? g_.showDIV('#article_right') : g_.hideDIV('#article_right');
	}

}
g_.init_blog = function(){
	g_.init_top();
	g_.init_header();
	g_.init_footer();
	g_.init_floating();
	g_.init_left();
	g_.add_left([
		{'name':'欢迎页(Index)','url':'/'},
		{'name':'首页(Home)','url':'/blog.html'},
		{'name':'博客(Blog)','url':'/_blog/'},
		{'name':'参考代码(Html)','url':'/_html/'},
		{'name':'页面示例(Html Demo)','url':'/_htmlDemo/'},
		{'name':'前端工具(js Tools)','url':'/_tools/'},
		{'name':'编程相关(Program Related)','url':'/_program/'},
		{'name':'脚本相关(JavaScript)','url':'/js/'},
		{'name':'关于(About)','url':'/_about/'}
	]);
}
g_.init_click = function(){
	g_.getEl('#common_small_toLeft').onclick = function(e){
		g_.showDIV('#article_left');
	}
	g_.getEl('#article_left').onclick = function(e){
		g_.getEl('#common_small_toLeft').offsetWidth && g_.hideDIV('#article_left');
	}
	g_.getEl('#left_list').onclick = function(e){
		e.stopPropagation();//阻止事件传递
	}
}
}(document);