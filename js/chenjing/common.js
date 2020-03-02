/*!
 * common v20200215
 * js基础对象扩展脚本
 * Author: WinSonZhao
 */
Array.prototype.unique =
  Array.prototype.unique ||
  function() {
    /*数组去重的方法*/
    var temp = {} /*新建一个空对象，给数组中没出现过的数添加一个属性*/,
      arr = []; /*去重后的数组*/
    for (var i = 0, len = this.length; i < len; i++) {
      if (!temp[this[i]]) {
        /* 判断数组中的数作为属性名在temp里有没有属性值*/
        temp[this[i]] =
          "WinSonZhao"; /*如果没有属性值，则说明没出现过给他一个属性值*/
        arr.push(this[i]); /*同时把这个数添加到去重后的数组里*/
      }
    }
    return arr; /*最后返回这个数组，这是hash算法*/
  };
Array.prototype.in_array =
  Array.prototype.in_array ||
  function(e) {
    /*判断某个值是否在数组中*/
    for (i = 0; i < this.length; i++) {
      if (this[i] === e) return true;
    }
    return false;
  };
Array.prototype.indexOf =
  Array.prototype.indexOf ||
  function(e) {
    /*判断某个值在数组中的位置*/
    for (i = 0; i < this.length; i++) {
      if (this[i] === e) return i;
    }
    return -1;
  };
Array.prototype.fill =
  Array.prototype.fill ||
  function(value, start, end) {
    /*使用 value 值来填充 array，从start位置开始, 到end位置结束（但不包含end位置），返回原数组*/
    let ctx = this;
    let length = ctx.length;
    start = parseInt(start);
    if (isNaN(start)) {
      start = 0;
    } else if (start < 0) {
      start = -start > length ? 0 : length + start;
    }
    end = parseInt(end);
    if (isNaN(end) || end > length) {
      end = length;
    } else if (end < 0) {
      end += length;
    }
    while (start < end) {
      ctx[start++] = value;
    }
    return ctx;
  };
Array.prototype.includes = Array.prototype.includes || function (value, start){
    /**用来判断一个数组是否包含一个指定的值，如果是返回 true，否则false，可指定开始查询的位置 */
    let ctx = this
    let length = ctx.length;
    start = parseInt(start)
    if(isNaN(start)){
      start = 0
    }else if (start < 0) {
      start = -start > length ? 0 : (length + start);
    }
    let index = ctx.indexOf(value)
    return index >= start;
  }
Object.inherit =
  Object.inherit ||
  function(Target, Origin) {
    /*目标元素和初始元素*/
    /*圣杯模式=继承(继承自他，更改自己又不会影响到他)*/
    function F() {} /*创建一个中间函数*/
    F.prototype = Origin.prototype; /*中间函数的原型继承自原始函数*/
    Target.prototype = new F(); /*构造函数F 目标函数继承自此*/
    Target.prototype.constructor = Target; /*使目标函数的构造器指向他自己*/
    Target.prototype.uber =
      Origin.prototype; /*在uber里存储目标函数真正继承自哪里*/
  };
Object.values =
  Object.values ||
  function(object) {
    /*返回一个给定对象自身的所有可枚举属性值的数组*/
    if (object === null || object === undefined) {
      throw new TypeError("Cannot convert undefined or null to object");
    }
    let result = [];
    if (isArrayLike(object) || isPlainObject(object)) {
      for (let key in object) {
        object.hasOwnProperty(key) && result.push(object[key]);
      }
    }
    return result;
  };
Object.keys =
  Object.keys ||
  function(object) {
    /*返回一个由一个给定对象的自身可枚举属性组成的数组*/
    if (object === null || object === undefined) {
      throw new TypeError("Cannot convert undefined or null to object");
    }
    let result = [];
    if (isArrayLike(object) || isPlainObject(object)) {
      for (let key in object) {
        object.hasOwnProperty(key) && result.push(key);
      }
    }
    return result;
  };
Date.prototype.formatDate =
  Date.prototype.formatDate ||
  function(formats) {
    /*时间戳转为格式化时间*/
    /*
	1. Y-M-D
	2. Y-M-D h:m:s
	3. Y年M月D日
	4. Y年M月D日 h时m分
	5. Y年M月D日 h时m分s秒
	示例：console.log(formatDate(1500305226034, 'Y年M月D日 h:m:s')) ==> 2017年07月17日 23:27:06
　　*/
    formats = formats || "Y-M-D";
    var myDate = this;
    var year = myDate.getFullYear();
    var month = formatDigit(myDate.getMonth() + 1);
    var day = formatDigit(myDate.getDate());
    var hour = formatDigit(myDate.getHours());
    var minute = formatDigit(myDate.getMinutes());
    var second = formatDigit(myDate.getSeconds());
    return formats.replace(/Y|M|D|h|m|s/g, function(matches) {
      return {
        Y: year,
        M: month,
        D: day,
        h: hour,
        m: minute,
        s: second
      }[matches];
    });
    /*小于10补0*/
    function formatDigit(n) {
      return n.toString().replace(/^(\d)$/, "0$1");
    }
  };
if (!Function.prototype.heredoc) {
  Function.prototype.heredoc = function(fn) {
    /*多行字符串 ，读取函数内容含注释，返回字符串*/
    return (
      fn
        .toString()
        .split("\n")
        .slice(1, -1)
        .join("\n") + "\n"
    );
  };
}
if (!String.prototype.toThousands) {
  String.prototype.toThousands = function() {
    /*千分位显示，常用于价格显示*/
    return parseFloat(this)
      .toFixed(2)
      .replace(/(\d{1,3})(?=(\d{3})+(?:\.))/g, "$1,");
  };
}
String.prototype.cutstr =
  String.prototype.cutstr ||
  function(len) {
    /*字符串超出省略*/
    var restr = this;
    var wlength = this.replace(/[^\x00-\xff]/g, "**").length;
    if (wlength > len) {
      for (var k = len / 2; k < this.length; k++) {
        if (this.substr(0, k).replace(/[^\x00-\xff]/g, "**").length >= len) {
          return (restr = this.substr(0, k) + "...");
        }
      }
    }
    return restr;
  };
String.prototype.repeat =
  String.prototype.repeat ||
  function(str, n) {
    /*生成一个重复的字符串，有n个str组成，可修改为填充为数组等*/
    let res = "";
    while (n) {
      if (n % 2 === 1) {
        res += this;
      }
      if (n > 1) {
        this += this;
      }
      n >>= 1;
    }
    return res;
  };
if (!URL.__proto__.getParams) {
  URL.__proto__.getParams = function() {
    /*Js获取页面地址参数*/
    var query = window.location.search; /* 获取URL地址中？后的所有字符*/
    if (!query) {
      return {};
    }
    var o = {};
    query = query.substring(1);
    var obj = function(str_, o_) {
      var a = str_.split("=");
      o_[a[0]] = a[1];
      return o_;
    };
    if (query.indexOf("&") <= -1) {
      return obj(query, o);
    }
    var arr = query.split("&");
    for (var i = 0; i < arr.length; i++) {
      obj(arr[i], o);
    }
    return o;
  };
}
if (!URL.__proto__.getParam) {
  URL.__proto__.getParam = function(param) {
    /*Js获取页面地址参数*/
    var query = window.location.search; /* 获取URL地址中？后的所有字符*/
    if (!query) {
      return "";
    }
    return URL.getParams()[param] || "";
  };
}
if (!Number.prototype.ConvertChineseMoney) {
  //*******************人民币数字转大写
  /*
《正确填写票据和结算凭证的基本规定》 
银行、单位和个人填写的各种票据和结算凭证是办理支付结算和现金收付的重要依据，直接关系到支付结算的准确、及时和安全。票据和结算凭证是银行、单位和个人凭以记载账务的会计凭证，是记载经济业务和明确经济责任的一种书面证明。因此，填写票据和结算凭证，必须做到标准化、规范化，要要素齐全、数字正确、字迹清晰、不错漏、不潦草，防止涂改。中文大写金额数字应用正楷或行书填写，如壹（壹）、贰（贰）、叁、肆（肆）、伍（伍）、陆（陆）、柒、捌、玖、拾、佰、仟、万（万）、亿、元、角、分、零、整（正）等字样。不得用一、二（两）、三、四、五、六、七、八、九、十、念、毛、另（或0）填写，不得自造简化字。如果金额数字书写中使用繁体字，如贰、陆、亿、万、圆的，也应受理。 

一、中文大写金额数字到"元"为止的，在"元"之后，应写"整"（或"正"）字，在"角"之后，可以不写"整"（或"正"）字。大写金额数字有"分"的，"分"后面不写"整"（或"正"）字。 

二、中文大写金额数字前应标明"人民币"字样，大写金额数字有"分"的，"分"后面不写"整"（或"正"）字。 

三、中文大写金额数字前应标明"人民币"字样，大写金额数字应紧接"人民币"字样填写，不得留有空白。大写金额数字前未印"人民币"字样的，应加填"人民币"三字。在票据和结算凭证大写金额栏内不得预印固定的"仟、佰、拾、万、仟、佰、拾、元、角、分"字样。 

四、阿拉伯数字小写金额数字中有"0"时，中文大写应按照汉语语言规律、金额数字构成和防止涂改的要求进行书写。举例如下： 

1·阿拉伯数字中间有"0"时，中文大写要写"零"字，如￥1409.50，应写成人民币陆壹仟肆佰零玖元伍角。 
2·阿拉伯数字中间连续有几个"0"时，中文大写金额中间可以只写一个"零"字，如￥6007.14，应写成人民币陆仟零柒元壹角肆分。 
3·阿拉伯金额数字万位和元位是"0"，或者数字中间连续有几个"0"，万位、元位也是"0"，但千位、角位不是"0"时，中文大写金额中可以只写一个零字，也可以不写"零"字。如￥1680.32，应写成人民币壹仟陆佰捌拾元零叁角贰分，或者写成人民币壹仟陆佰捌拾元叁角贰分，又如￥107000.53，应写成人民币壹拾万柒仟元零伍角叁分，或者写成人民币壹拾万零柒仟元伍角叁分。 
4·阿拉伯金额数字角位是"0"，而分位不是"0"时，中文大写金额"元"后面应写"零"字。如￥16409.02，应写成人民币壹万陆仟肆佰零玖元零贰分；又如￥325.04，应写成人民币叁佰贰拾伍元零肆分。 
五、阿拉伯小写金额数字前面，均应填写人民币符号"￥"。阿拉伯小写金额数字要认真填写，不得连写分辨不清。 
六、票据的出票日期必须使用中文大写。为防止变造票据的出票日期，在填写月、日时，月为壹、贰和壹拾的，日为壹至玖和壹拾、贰拾和叁拾的，应在其前加"零"；日为拾壹至拾玖的，应在其前加"壹"。如1月15日，应写成零壹月壹拾伍日。再如10月20日，应写成零壹拾月零贰拾日。 

七、票据出票日期使用小写填写的，银行不予受理。大写日期未按要求规范填写的，银行可予受理，但由此造成损失的，由出票人自行承担。
*/
  //数字转人民币大写
  Number.prototype.ConvertChineseMoney = function() {
    var money = this;
    var cnNums = new Array(
      "零",
      "壹",
      "贰",
      "叁",
      "肆",
      "伍",
      "陆",
      "柒",
      "捌",
      "玖"
    ); //汉字的数字
    var cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
    var cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
    var cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
    var cnInteger = "整"; //整数金额时后面跟的字符
    var cnIntLast = "元"; //整型完以后的单位
    var maxNum = 999999999999999.9999; //最大处理的数字

    var IntegerNum; //金额整数部分
    var DecimalNum; //金额小数部分
    var ChineseStr = ""; //输出的中文金额字符串
    var parts; //分离金额后用的数组，预定义

    if (money == "") {
      return "";
    }

    money = parseFloat(money);
    if (money >= maxNum) {
      $.alert("超出最大处理数字");
      return "";
    }
    if (money == 0) {
      ChineseStr = cnNums[0] + cnIntLast + cnInteger;
      return ChineseStr;
    }
    money = money.toString(); //转换为字符串
    if (money.indexOf(".") == -1) {
      IntegerNum = money;
      DecimalNum = "";
    } else {
      parts = money.split(".");
      IntegerNum = parts[0];
      DecimalNum = parts[1].substr(0, 4);
    }
    if (parseInt(IntegerNum, 10) > 0) {
      //获取整型部分转换
      zeroCount = 0;
      IntLen = IntegerNum.length;
      for (i = 0; i < IntLen; i++) {
        n = IntegerNum.substr(i, 1);
        p = IntLen - i - 1;
        q = p / 4;
        m = p % 4;
        if (n == "0") {
          zeroCount++;
        } else {
          if (zeroCount > 0) {
            ChineseStr += cnNums[0];
          }
          zeroCount = 0; //归零
          ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
        }
        if (m == 0 && zeroCount < 4) {
          ChineseStr += cnIntUnits[q];
        }
      }
      ChineseStr += cnIntLast;
      //整型部分处理完毕
    }
    if (DecimalNum != "") {
      //小数部分
      decLen = DecimalNum.length;
      for (i = 0; i < decLen; i++) {
        n = DecimalNum.substr(i, 1);
        if (n != "0") {
          ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
        }
      }
    }
    if (ChineseStr == "") {
      ChineseStr += cnNums[0] + cnIntLast + cnInteger;
    } else if (DecimalNum == "") {
      ChineseStr += cnInteger;
    }
    //如果元位刚好为零，后面需要补零
    //if (ChineseStr.indexOf('拾元') >= 0) {
    //    if (ChineseStr.indexOf('分') >= 0 || ChineseStr.indexOf('角') >= 0) { //处理只到10元，又刚好有角或分的情况
    //        ChineseStr = ChineseStr.substr(0, ChineseStr.indexOf('元') + 1) + '零' + ChineseStr.substr(ChineseStr.indexOf('元') + 1);
    //    }
    //} else
    if (ChineseStr.indexOf("分") >= 0 && ChineseStr.indexOf("角") < 0) {
      //处理没有角有分的情况
      if (ChineseStr.indexOf("元") > 0) {
        ChineseStr =
          ChineseStr.substr(0, ChineseStr.indexOf("元") + 1) +
          "零" +
          ChineseStr.substr(ChineseStr.indexOf("元") + 1);
      }
    }
    return ChineseStr;
  };
}
if (!window.Cookie) {
  window.Cookie = {};
  window.Cookie.__proto__.set = function(key, val, d) {
    var now = new Date();
    now.setDate(now.getDate() + d);
    document.cookie = key + "=" + val + ";expires=" + now;
  };
  window.Cookie.__proto__.get = function(key, def) {
    var o = document.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"));
    return null != o ? unescape(o[2]) : def;
  };
  window.Cookie.__proto__.clear = function(key, e, o) {
    this.get(key) && setCookie(name, 1, -1);
  };
}
