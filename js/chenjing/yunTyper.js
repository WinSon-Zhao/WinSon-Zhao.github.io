/*!
* yunTyper v20200215
* 打字机
* Author: WinSonZhao
*/
$.fn.yunTyper = function(o={}){/*扩展jQuery，打字机*/
    var t= $(this),/*当前元素*/
        lineSign = true,/*光标元素是否隐藏*/
        wordIndex = 0,/*第几条*/
        fn = t.yunFn = {},/*可以使用的函数*/
        end = 0,/*当前字符串结尾位置*/
        word,line,/*元素*/
        timer_l ,timer_c,/*定时器*/
        barter,/*写-删 转换*/
        words = [];/*span的集合*/

    var option = t.yunOption = {
        text: ["Hello World!"],/*内容*/
        color: "#000",/*颜色*/
        speed: 100,/*打字速度*/
        sleep: 2000,/*结束，多久转换*/
        sign: true,/*是否打印*/
        auto: true,/*是否自动切换*/
        autoFn: function(){},/*回调函数，loop =true 时，写或删切换时执行*/
        endFn: function(){},/*回调函数，loop =false时，结束执行*/
        loop: true /*是否循环，循环一个span,不循环多个span*/
    };
    if('string' === typeof o.text){
        o.text = [o.text];
    }
    var init = function(){/*初始化*/
        lineSign = true;/*光标元素是否隐藏*/
        wordIndex = 0;/*第几条*/
        barter = true;/*默认 写*/
        end = 0;/*当前字符串结尾位置*/
        words = [];/*span的集合*/
        word = $('<span>').addClass('yun_typer_word');
        line = $('<span>').addClass( 'yun_typer_line').css({ 'border':'1px solid '+option.color });
        t.css({"word-wrap":"break-word"});
        $.extend(option,o);

        if(option.loop){/*定时器-循环*/
            t.append(word).append(line);
            words.push(word);/*装载span*/
            timer_l = setInterval(function(){ loopTyper(); },option.speed);
        }else{/*定时器-不循环*/
            for (let i = 0 , len = option.text.length ; i < len ; i++) {
                var wr = word.clone();/*克隆*/
                t.append(wr);/*页面添加*/
                words.push(wr);/*装载span*/
            }
            t.append(line);
            timer_l = setInterval(function(){ appendTyper(); },option.speed);
        }
        timer_c = setInterval(cursor,1000);/*光标闪烁*/
    }

    var appendTyper = function(){/*多个span，不循环打印*/
        if(!option.sign) return;/*判断是否为打印状态*/
        if(wordIndex >= option.text.length){/*写完了，结束*/
            end_();option.endFn()&&option.endFn(t); return;/*写完了*/
        }
        var text = option.text[wordIndex];/*获取文本*/
        html_(wordIndex,text,end);
        /*写*/
        if( end >= text.length){/*写结束*/
            end = 0;
            wordIndex ++;
            sleep_();
        }else{
            end++;
        }
    }
    var loopTyper = function(){/*在一个span,循环打印*/
        /*判断是否为打印状态*/
        if(!option.sign) return;
        /*自动初始化到第一个*/
        if(wordIndex >= option.text.length){ wordIndex = 0; }

        var text = option.text[wordIndex];/*获取文本*/
        html_(0,text,end);
        if(barter){/*写*/
            if( end >= text.length){/*写结束*/
                barter = false;/*转-删*/
                sleep_();
                option.autoFn(t,true,wordIndex);
            }
            end ++;
        }else{/*删*/
            if( end <=0){/*删结束*/
                barter = true;/*转-写*/
                wordIndex++;/*写下一个文本*/
                option.autoFn(t,false,wordIndex);
            }
            end --;
        }
    }
    var html_ = function(index,t,e){
        var txt = (index?'<br>':'')+t.substr( 0 , e );/*截取文本*/
        words[index].html(txt);/*写内容*/
    }
    function sleep_(){
        option.sign = false;/*不是打印状态*/
        setTimeout(function(){option.sign=true;},option.sleep);/*定时器一次*/
        /*setTimeout(()=>{option.sign=true;},option.sleep);*/
    }
    function cursor(){/*光标-当前状态*/
        lineSign = !lineSign ;/*显示  隐藏*/
        lineSign ? (line.hide()) : (line.show());
    }
    function clearTimer(){/*清理定时器*/
        window.clearInterval(timer_l);
        window.clearInterval(timer_c);
        timer_l = timer_c = undefined;
    }
    function end_(){/*清理定时器,光标取消闪烁*/
        clearTimer();
        lineSign = false;
        cursor();
    }

    /*启动*/
    fn.start = function(){
        timer_l ? (option.sign = true) : (t.children().remove(), init());
    }
    /*暂停*/
    fn.suspend = function(){ option.sign = false; }
    /*停止*/
    fn.stop = function(){//timer_l
        end_();
        word = line = undefined;
    }
    /*写*/
    fn.write = function(){ barter = true; }
    /*删除*/
    fn.del = function(){ barter = false; }
    /*设置颜色*/
    fn.setColor = function(color){
        t.css('color',color);
        line.css('border',"1px solid "+color+"");
    }
    /*背景*/
    fn.setBg = function(color){ t.css('background',color); }
    fn.setSpeed = function(speed){ option.speed = speed; }
    fn.setWord = function(word){
        option.text = [word];
        end = 0;
        option.sign = true;
        barter = true;
    }
    init();/*初始化*/
    return t;
}
//自动打字机，简版
function Typewriter(o,charSpeed,delay,fn){
    var keys = [],k_index = 0,k_len = 0,k_timer = delay||2100 ,k_,k_o;
    var word = '',w_index = 0,w_len = 0,w_timer = charSpeed||100;
    for(var key in o){
        keys.push(key);
    }
    k_len = keys.length;
    var timer = setInterval(function(){
        if(w_index <=0){
            k_ = keys[k_index];
            word = o[k_];
            w_len = word.length;
            k_o = $('#'+k_);
            //k_o.addClass('typerTarget');
        }
        if(w_index < w_len){
            k_o.html(word.slice(0,w_index+1))
            //console.log(k_,k_index,k_len,w_index,w_len,word.slice(0,w_index+1),)
            w_index ++;
        }else if(k_index < k_len-1){
            //k_o.removeClass('typerTarget');
            w_index = 0;
            k_index ++;
        }else{
            //k_o.removeClass('typerTarget');
            console.log('end');
            if(timer){window.clearTimeout(timer)}
            fn();
        }
    },w_timer);
}