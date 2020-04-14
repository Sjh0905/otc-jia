const func = {}

func.testFunc = function () {
  console.warn('test!')
}

// 判断是否全是数字
func.testNumber = function (number) {
  return /^[0-9]*$/.test(number)
}

// 判断非法字符
func.testIllegalCharacter = function (string) {
  return /[@#\$%\^&\*_]+/g.test(string)
}

import Big from 'big.js'

// copy
func.COPY = function (copid) {
  let selection = window.getSelection();
  let range = document.createRange();
  range.selectNodeContents(copid);
  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand("copy");
}

// 添加class
func.ADD_CLASS = function (obj, cls) {
  let obj_class = obj.className;
  let blank = (obj_class != '') ? ' ' : '';
  let added = obj_class + blank + cls;
  obj.className = added;
}

// 删除class
func.REMOVE_CLASS = function (obj, cls) {
  var obj_class = ' ' + obj.className + ' ';
  obj_class = obj_class.replace(/(\s+)/gi, ' ');
  let removed = obj_class.replace(' ' + cls + ' ', ' ');
  removed = removed.replace(/(^\s+)|(\s+$)/g, '');
  obj.className = removed;
}

// 判断是否含有class
func.HAS_CLASS = function (obj, cls) {
  let obj_class = obj.className;
  let obj_class_lst = obj_class.split(/\s+/);
  let x = 0;
  for (x in obj_class_lst) {
    if (obj_class_lst[x] == cls) {
      return true;
    }
  }
  return false;
}

func.arrayHaveItem = function (arr, item) {
  if (!arr || !item) return false
  let have = false
  arr.forEach(v => {
    if (have) return
    if (v === item) {
      have = true
    }
  })
  return have
}

func.asleep = function (time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time)
  })
}

// 精度处理不保留四舍五入，只舍弃，不进位
func.accFixed = function (num, acc) {
  // console.warn('isNaN(num)',isNaN(num))
  if (isNaN(num)) return (0).toFixed(acc)
  let number = Number(func.accDiv(Math.floor(func.accMul(num, Math.pow(10, acc))), Math.pow(10, acc)))
  return number.toFixed(acc)
}

// 精度处理保留进位，只要大于0就进位
func.accFixedCny = function (num, acc) {
  // console.warn('isNaN(num)',isNaN(num))
  if (isNaN(num)) return (0).toFixed(acc)
  let number = Number(func.accDiv(Math.ceil(func.accMul(num, Math.pow(10, acc))), Math.pow(10, acc)))
  return number.toFixed(acc)
}

/**
 * 精度加法运算
 * 使用big.js
 */
func.accAdd = function (arg1, arg2) {
  let num1 = new Big(arg1)
  let num2 = new Big(arg2)
  return num1.plus(num2).toString()
}

/**
 * 精度减法运算
 * 使用big.js
 */
func.accMinus = function (arg1, arg2) {
  let num1 = new Big(arg1)
  let num2 = new Big(arg2)
  return num1.minus(num2).toString()
}

/**
 * 精度除法运算
 * 使用big.js
 */
func.accDiv = function (arg1, arg2) {
  let num1 = new Big(arg1)
  let num2 = new Big(arg2)
  return num1.div(num2).toString()
}

/**
 * 精度乘法运算
 * 使用big.js
 */
func.accMul = function (arg1, arg2) {
  let num1 = new Big(arg1)
  let num2 = new Big(arg2)
  return num1.mul(num2).toString()
}

//格式化时间年-月-日  时：分：秒
func.formatDateUitl = function (time, formatString, offset = 8) {

  var pad0 = function (num, n) {
    var len = num.toString().length;
    while (len < n) {
      num = "0" + num;
      len++;
    }
    return num;
  }


  // time += (3600000 * offset)


  var myDate = new Date(time);

  formatString = formatString.replace('yy', myDate.getYear())
  // console.log()
  formatString = formatString.replace('YYYY', myDate.getFullYear())
  formatString = formatString.replace('MM', pad0(myDate.getMonth() + 1, 2))
  formatString = formatString.replace('DD', pad0(myDate.getDate(), 2))
  formatString = formatString.replace('hh', pad0(myDate.getHours(), 2))
  formatString = formatString.replace('mm', pad0(myDate.getMinutes(), 2))
  formatString = formatString.replace('ss', pad0(myDate.getSeconds(), 2))

  return formatString;
}


export default func
