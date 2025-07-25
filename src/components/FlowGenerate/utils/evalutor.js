const dayjs = require('dayjs');
const dayOfYear = require('dayjs/plugin/dayOfYear');
const quarterOfYear = require('dayjs/plugin/quarterOfYear');
const weekYear = require('dayjs/plugin/weekYear');
const weekOfYear = require('dayjs/plugin/weekOfYear');


dayjs.extend(dayOfYear);
dayjs.extend(quarterOfYear);
dayjs.extend(weekYear);
dayjs.extend(weekOfYear);


const normalizeText = (raw) => {
  if (raw instanceof Date) {
    return dayjs(raw).format();
  }
  return `${raw}`;
};
const formatNumber = (value, int = false) => {
  const typeName = typeof value;
  if (typeName === 'string') {
    return (int ? parseInt(value, 10) : parseFloat(value)) || 0;
  } else if (typeName === 'number' && int) {
    return Math.round(value);
  }

  return value ?? 0;
};
// 如果只有一个成员，同时第一个成员为 args
// 则把它展开，当成是多个参数，毕竟公式里面还不支持 ...args 语法，
function normalizeArgs(args) {
  if (args.length === 1 && Array.isArray(args[0])) {
    args = args[0];
  }
  return args;
}

function normalizeDate(raw) {
  if (typeof raw === 'string' || typeof raw === 'number') {
    let formats = ['', 'YYYY-MM-DD HH:mm:ss', 'X'];

    if (/^\d{10}((\.\d+)*)$/.test(raw.toString())) {
      formats = ['X', 'x', 'YYYY-MM-DD HH:mm:ss', ''];
    } else if (/^\d{13}((\.\d+)*)$/.test(raw.toString())) {
      formats = ['x', 'X', 'YYYY-MM-DD HH:mm:ss', ''];
    }
    while (formats.length) {
      const format = formats.shift();
      const date = dayjs(raw, format);

      if (date.isValid()) {
        return date.toDate();
      }
    }
  }

  return raw;
}

/**
 * ---------------------------------- 数字函数 ----------------------------------
 */
/**
 * 返回传入数字的绝对值
 *
 * @example ABS(num)
 * @param {number} num - 数值
 * @namespace 数学函数
 *
 * @returns {number} 传入数值的绝对值
 */
const ABS = (a) => {
  a = formatNumber(a);
  return Math.abs(a);
};

/**
 * 求和，如果只有一个参数且是数组，则计算这个数组内的值
 *
 * @example SUM(num1, num2, ...numN)
 * @param {...number} num - 数值
 * @namespace 数学函数
 *
 * @returns {number} 所有传入数值的总和
 */
const SUM = (...args) => {
  const arr = normalizeArgs(args);
  return arr.reduce((sum, a) => {
    if (Array.isArray(a)) {
      // 可以支持多层
      a = SUM(a);
    }
    return sum + formatNumber(a) || 0;
  }, 0);
};
/**
 * 返回所有参数的平均值，如果只有一个参数且是数组，则计算这个数组内的值,
 *
 * @example AVERAGE(num1, num2, ...numN)
 * @param {...number} num - 要处理的数字
 * @namespace 数学函数
 *
 * @returns {number} 所有数值的平均值
 */
const AVERAGE = (...args) => {
  const arr = normalizeArgs(args);
  return (
    SUM.apply(
      this,
      arr.map((item) => {
        if (Array.isArray(item)) {
          return SUM(item); // 数组则获取全部的和
        }
        return formatNumber(item);
      })
    ) / arr.length
  );
};
/**
 * 将数值向下取整为最接近的整数
 *
 * @example INT(num)
 * @param {number} num - 数值
 * @namespace 数学函数
 *
 * @returns {number} 数值对应的整形
 */
const INT = (n) => {
  return Math.floor(formatNumber(n));
};
/**
 * LOG函数可以根据指定底数返回数字的对数
    用法：LOG(底数,数字)
 * @param x 底数
 * @param y 数字
 * @returns 
 */
const LOG = (x, y) => {
  return (Math.log(y) / Math.log(x)).toFixed(2);
};
/**
 * 返回两数相除的余数，参数 number 是被除数，divisor 是除数
 *
 * @example MOD(num, divisor)
 * @param {number} num - 被除数
 * @param {number} divisor - 除数
 * @namespace 数学函数
 *
 * @returns {number} 两数相除的余数
 */
const MOD = (a, b) => {
  return formatNumber(a) % formatNumber(b);
};
/**
 * 获取最大值，如果只有一个参数且是数组，则计算这个数组内的值
 *
 * @example MAX(num1, num2, ...numN)
 * @param {...number} num - 数值
 * @namespace 数学函数
 *
 * @returns {number} 所有传入值中最大的那个
 */
const MAX = (...args) => {
  const arr = normalizeArgs(args);
  /* eslint prefer-spread: */
  return Math.max.apply(
    Math,
    arr.map((item) => {
      if (Array.isArray(item)) {
        return MAX(item); // 再调用一遍获取
      }
      return formatNumber(item)
    })
  );
};
/**
 * 获取最小值，如果只有一个参数且是数组，则计算这个数组内的值
 *
 * @example MIN(num1, num2, ...numN)
 * @param {...number} num - 数值
 * @namespace 数学函数
 *
 * @returns {number} 所有传入值中最小的那个
 */
const MIN = (...args) => {
  const arr = normalizeArgs(args);
  return Math.min.apply(
    Math,
    arr.map((item) => {
      if (Array.isArray(item)) {
        return MIN(item); // 再调用一遍获取
      }
      return formatNumber(item)
    })
  );
};
/**
 * POWER函数可以获取数字乘幂的结果
  用法：POWER(数字,指数)
  示例：POWER(3，2)返回9，也就是3的2次方
 */
const POWER = (x, y) => {
  return Math.pow(formatNumber(x), formatNumber(y));
};
/**
 * PRODUCT函数可以获取一组数值的乘积
 * @param args
 * @returns
 */
const PRODUCT = (...args) => {
  return args.reduce((a, b) => {
    if (Array.isArray(b)) {
      b = PRODUCT(b);
    }
    return a * b;
  });
};
/**
 * 返回大于等于 0 且小于 1 的均匀分布随机实数。每一次触发计算都会变化。
 *
 * 示例：`RAND()*100`
 *
 * 返回 0-100 之间的随机数
 *
 * @example RAND()
 * @namespace 数学函数
 *
 * @returns {number} 随机数
 */
const RAND = () => {
  return Math.random();
};
/**
 * 将数字四舍五入到指定的位数，可以设置小数位。
 *
 * @example ROUND(num[, numDigits = 2])
 * @param {number} num - 要处理的数字
 * @param {number} numDigits - 小数位数
 * @namespace 数学函数
 *
 * @returns {number} 传入数值四舍五入后的结果
 */
const ROUND = (a, b = 2) => {
  a = formatNumber(a);
  b = formatNumber(b);
  const bResult = Math.round(b);

  if (bResult) {
    const c = Math.pow(10, bResult);
    return Math.round(a * c) / c;
  }

  return Math.round(a);
};
/**
 * 开平方，参数 number 为非负数
 *
 * @example SQRT(num)
 * @param {number} num - 要处理的数字
 * @namespace 数学函数
 *
 * @returns {number} 开平方的结果
 */
const SQRT = (n) => {
  return Math.sqrt(formatNumber(n));
};
/**
 * 返回参数长度
 *
 * @param {Array<any>} arr 数组
 * @namespace 数组
 * @example COUNT(arr)
 * @returns {boolean} 结果
 */
const COUNT = (...arr) => {
  let count = 0;
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      COUNT(item);
      item && count++
    }
  });
  return count;
};
/**
 * 将参数 number 向上/向下舍入为最接近的指定基数的倍数。
 * @param number 要舍入的值
 * @param significance 要舍入到的倍数
 * @returns
 */
const CEILING = (number, significance) => {
  if (number >= 0) {
    return Math.ceil(number / significance) * significance;
  } else {
    return Math.floor(number / significance) * significance;
  }
};
/**
 * 将数字舍入到指定的小数位数，以十进制数格式对该数进行格式设置，并以文本形式返回结果
 * @param num 数字
 * @param decimals 小数点后保留几位
 * @returns 截取位数后的数字
 */
const FIXED = (num, decimals = 0) => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};
/**
 * 在给定的数组中，将数组间对应的元素相乘，并返回乘积之和。
 * @param arrays 可选。多个数字数组。
 * @returns
 */
const SUMPRODUCT = (...arrays) => {
  let result = 0;
  // 1、参数都要是数组，直接相乘
  if (!Array.isArray(arrays[0])) {
    result = arrays.reduce((a, b) => a * b);
  } else {
    // 2、数组内都要是数字，不是的默认设为0
    const maxLength = Math.max(
      ...arrays.map((arr) => (Array.isArray(arr) ? arr.length : 0))
    );
    for (let i = 0; i < maxLength; i++) {
      let product = 1;

      for (const arr of arrays) {
        if (Array.isArray(arr)) {
          const temp = typeof (arr[i] - 0) == 'number' ? arr[i] || 0 : 0;
          product = parseFloat((product * temp).toFixed(1));
          // console.log('=', arr, arr[i], temp, product, i)
        }
      }

      result += product;
    }
  }
  return result;
};

/*
  ---------------------------------- 字符串函数 ----------------------------------
*/
const CONCAT = (...arr) => {
  // const empty = arr.filter((item: any) => !item)
  // if (empty.length) {
  //   return ''
  // }
  const temp = arr
    .filter((item) => item)
    .reduce((a, b) => a.concat(b), '');
  return temp;
};

// 文本组合
const CONCAT_TEXT = (...arr) => {
  const empty = arr.filter((item) => !item);
  if (empty.length == arr.length) {
    return '';
  }
  // const temp = arr.filter((item: any) => item).reduce((a, b) => a.concat(b), '');
  const temp = arr.join('').replaceAll('!lineFeed&', '\n');
  return temp;
};

const CHAR_LENGTH = (...arr) => {
  const f = arr[0];
  if (f.length) {
    return f.length;
  }
  throw Error('not string');
};

const LOWER = (text) => {
  text = normalizeText(text);
  return text.toLowerCase();
};

/**
 * 返回文本字符串中从指定位置开始的特定数目的字符。
 *
 * @example MID(text, from, len)
 * @param {string} text - 要处理的文本
 * @param {number} from - 起始位置
 * @param {number} len - 处理长度
 * @namespace 文本函数
 *
 * @returns {number} 命中的位置
 */
const MID = (text, from, len) => {
  text = normalizeText(text);
  return text.substring(from, from + len);
};
const UPPER = (text) => {
  text = normalizeText(text);
  return text.toUpperCase();
};
/**
 * 返回传入文本左侧的指定长度字符串。
 *
 * @example LEFT(text, len)
 * @param {string} text - 要处理的文本
 * @param {number} len - 要处理的长度
 * @namespace 文本函数
 *
 * @returns {string} 对应字符串
 */
const LEFT = (text, len) => {
  text = normalizeText(text);
  return text.substring(0, len);
};
/**
 * 返回传入文本右侧的指定长度字符串。
 *
 * @example RIGHT(text, len)
 * @param {string} text - 要处理的文本
 * @param {number} len - 要处理的长度
 * @namespace 文本函数
 *
 * @returns {string} 对应字符串
 */
const RIGHT = (text, len) => {
  text = normalizeText(text);
  return text.substring(text.length - len, text.length);
};
/**
 * 对文本进行搜索，返回命中的位置。
 *
 * @example SEARCH(text, search, 0)
 * @param {string} text - 要处理的文本
 * @param {string} search - 用来搜索的文本
 * @param {number} start - 起始位置
 * @namespace 文本函数
 *
 * @returns {number} 命中的位置
 */
const SEARCH = (search, text, start = 0) => {
  text = normalizeText(text);
  start = formatNumber(start);

  const idx = text.indexOf(search, start);
  if (~idx) {
    return idx;
  }

  return -1;
};

/**
 * 将文本去除前后空格
 *
 * @example TRIM(text)
 * @param {string} text - 文本
 * @namespace 文本函数
 *
 * @returns {string} 处理后的文本
 */
const TRIM = (text) => {
  text = normalizeText(text);
  return text.trim();
};
/**
 * 对文本进行全量替换。
 *
 * @example REPLACE(text, search, replace)
 * @param {string} text - 要处理的文本
 * @param {string} search - 要被替换的文本
 * @param {string} replace - 要替换的文本
 * @namespace 文本函数
 *
 * @returns {string} 处理结果
 */
const REPLACE = (text, search, replace) => {
  text = normalizeText(text);
  let result = text;
  /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
  while (true) {
    const idx = result.indexOf(search);

    if (!~idx) {
      break;
    }

    result =
      result.substring(0, idx) +
      replace +
      result.substring(idx + search.length);
  }

  return result;
};

/**
 * 数字转中文（大小写）
 * @param n 数字｜字符串数字
 * @param isUpper 是否大写
 * @returns
 */
const numToChinese = (n, isUpper) => {
  if (n === 0) return '零元整';
  if (!n) return '';
  n = formatNumber(n);
  const maxLen = 14;
  if (n.toString().split('.')[0]?.length > maxLen) {
    return `最大数额只支持到兆(既小数点前${maxLen}位)`;
  }

  const fraction = ['角', '分'];
  const digit = isUpper
    ? ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
    : ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const unit = isUpper
    ? [
        ['元', '万', '亿', '兆'],
        ['', '拾', '佰', '仟'],
      ]
    : [
        ['元', '万', '亿', '兆'],
        ['', '十', '百', '千'],
      ];
  const head = n < 0 ? '欠' : '';
  n = Math.abs(n);
  let s = '';
  for (let i = 0; i < fraction.length; i++) {
    s += (
      digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
    ).replace(/零./, '');
  }
  s = s || '整';
  n = Math.floor(n);
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = '';
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(n / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  return (
    head +
    s
      .replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整')
  );
};
/**
 * 数字转字符串，格式化； 时间格式化（参考jdy公式）
 * @param num
 * @param format
 * @returns
 */
const TEXT = (num, format) => {
  let result = '';
  const isTime =
    Object.prototype.toString.call(num) == '[object Date]' ? true : false;

  if (isTime) {
    result = dayjs(num).format(format);
  }
  // 是数字
  else if (parseFloat(num) == 0 || parseFloat(num)) {
    if (!format) {
      result = num.toString();
    }
    // 显示原始数据
    else if (format == '[Num0]') {
      result = num;
    }
    // 将数字转为中文小写
    else if (format == '[Num1]') {
      result = numToChinese(num, false);
    }
    // 将数字转为中文大写
    else if (format == '[Num2]') {
      result = numToChinese(num, true);
    }
    // 格式化数字
    else if (format.includes('#') || format.includes('0')) {
      const number = numeral(num);
      result = number.format(format);
    } else {
      result = format;
    }
  }
  // 不是数字，时间
  else {
    result = '';
  }
  return result;
};
/**
 * 将内容为数字的文本转化为数字格式。
 * @param text 文本
 * @returns 数字
 */
const VALUE = (text) => {
  text = parseFloat(text);

  return !text ? 0 : text;
};
/**
 * 判断文本是否为空。
 *
 * @example ISEMPTY(text)
 * @param {any} text - 要处理的文本
 * @namespace 文本函数
 *
 * @returns {boolean} 判断结果
 */
const ISEMPTY = (text) => {
  return !text || !String(text).trim();
};

const flatten = (arr) => {
  return arr.flat(Infinity);
};
/**
 * 数组去重
 * 示例：
 * UNIQ(['a'，'id', 'id')
 * @param {Array<any>} arr 数组
 * @returns {Array<any>} 结果
 */
const UNION = (...arr) => {
  const temp = flatten(arr);
  return Array.from(new Set(temp));
};
/**
 * 将文本根据指定片段分割成数组。
 *
 * 示例：`SPLIT("a,b,c", ",")`，
 *
 * 返回 `["a", "b", "c"]`。
 *
 * @example SPLIT(text, ',')
 * @param {string} text - 文本
 * @param {string} delimiter - 文本片段
 * @namespace 文本函数
 *
 * @returns {Array<string>} 文本集
 */
const SPLIT = (text, sep = ',') => {
  text = normalizeText(text);
  return text.split(sep);
};

/*
  ---------------------------------- 时间函数 ----------------------------------
*/
/**
 * DATEDIFF(date1，date2) 返回起始时间 date1 和结束时间 date2 之间的天数
  用法：DATEDIFF(date1，date2)
  示例：DATEDIF("2017-11-30","2017-11-29")返回1
 * @param endDate 
 * @param startDate 
 * @returns 
 */
const DATEDIFF = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return '';
  }
  endDate = normalizeDate(endDate);
  startDate = normalizeDate(startDate);
  return dayjs(endDate).diff(startDate, 'day');
};
/**
 * DAYOFWEEK返回date所代表的一星期中的第几天(1~7)
 */
const DAYOFWEEK = (date) => {
  date = normalizeDate(date);
  const week = dayjs(date).day();
  return week == 0 ? 7 : week;
};
/**
 * DAYOFMONTH返回date是一个月的第几天(1~31)
  用法：DAYOFMONTH(时间戳)
 */
const DAYOFMONTH = (date) => {
  date = normalizeDate(date);
  return dayjs(date).date();
};
/**
  DAYOFYEAR返回date是一年的第几天(1~366)
  用法：DAYOFYEAR(时间戳)
 */
const DAYOFYEAR = (date) => {
  date = normalizeDate(date);
  return dayjs(date).dayOfYear();
};
/**
  HOUR返回time的小时值(0~23)
  用法：HOUR(时间戳)
 */
const HOUR = (date) => {
  date = normalizeDate(date);
  return dayjs(date).hour();
};
/**
  MONTH返回date的月份值(1~12)
  用法：MONTH(时间戳)
 */
const MONTH = (date) => {
  date = normalizeDate(date);
  return dayjs(date).month() + 1;
};
/**
  MINUTE返回time的分钟值(0~59)
  用法：MINUTE(时间戳)
 */
const MINUTE = (date) => {
  date = normalizeDate(date);
  return dayjs(date).minute();
};
/**
  QUARTER返回date在一年中的季度(1~4)
  用法：QUARTER(时间戳)
 */
const QUARTER = (date) => {
  date = normalizeDate(date);
  return dayjs(date).quarter();
};
/**
  WEEK返回日期date为一年中第几周(0~53)
  用法：WEEK(时间戳)
 */
const WEEK = (date) => {
  date = normalizeDate(date);
  return dayjs(date).week();
};
/**
  YEAR返回日期date的年份(1000~9999)
  用法：YEAR(时间戳)
 */
const YEAR = (date) => {
  date = normalizeDate(date);
  return dayjs(date).year();
};
/**
 * 返回今天的日期。
 *
 * @example TODAY()
 * @namespace 日期函数
 *
 * @returns {number} 日期
 */
const TODAY = () => {
  return new Date();
};
/**
 * 创建日期对象，可以通过特定格式的字符串，或者数值。
 *
 * 需要注意的是，其中月份的数值是从0开始的，
 * 即如果是12月份，你应该传入数值11。
 *
 * @example DATE(2021, 11, 6, 8, 20, 0)
 * @example DATE('2021-12-06 08:20:00')
 * @namespace 日期函数
 *
 * @returns {Date} 日期对象
 */
const DATE = (
  year,
  month = 1,
  day = 1,
  hour = 0,
  minute = 0,
  second = 0
) => {
  if (month === undefined) {
    return new Date(year);
  }

  return new Date(year, month - 1, day, hour, minute, second);
};
/**
 * 修改日期，对日期进行加减天。
 *
 * 示例：
 *
 * DATEMODIFY(A, -2, 'month')，
 *
 * 对日期 A 进行往前减2月的操作。
 *
 * @param {date} date 日期对象
 * @param {number} num 数值天
 * @namespace 日期函数
 * @example DATEMODIFY(date, 2, 'days')
 * @returns {date} 日期对象
 */
const DATEDELTA = (date, num = 0) => {
  if (!date) return '';
  date = date == 'today' ? dayjs() : normalizeDate(date);
  return dayjs(date).add(num, 'day').format();
};

/*
  ---------------------------------- 逻辑函数 ----------------------------------
*/
/**
 * 示例：IF(A, B, C)
 *
 * 如果满足条件A，则返回B，否则返回C，支持多层嵌套IF函数。
 *
 * 也可以用表达式如：A ? B : C
 *
 * @example IF(condition, consequent, alternate)
 * @param {any} condition - 条件表达式.
 * @param {any} consequent 条件判断通过的返回结果
 * @param {any} alternate 条件判断不通过的返回结果
 * @namespace 逻辑函数
 *
 * @returns {any} 根据条件返回不同的结果
 */
const fnIF = (condition, trueValue, falseValue) => {
  return condition ? trueValue : falseValue;
};
/**
 * 判断函数集合，相当于多个 else if 合并成一个。
 *
 * 示例：IFS(语文成绩 > 80, "优秀", 语文成绩 > 60, "良", "继续努力")，
 *
 * 如果语文成绩大于 80，则返回优秀，否则判断大于 60 分，则返回良，否则返回继续努力。
 *
 * @example IFS(condition1, result1, condition2, result2,...conditionN, resultN)
 * @param {...expression} condition 条件表达式
 * @param {...any} result 返回值
 * @namespace 逻辑函数
 * @returns {any} 第一个满足条件的结果，没有命中的返回 false。
 */
const IFS = (...args) => {
  if (args.length % 2) {
    args.splice(args.length - 1, 0, () => true);
  }

  while (args.length) {
    const c = args.shift();
    const v = args.shift();

    if (c) {
      return v;
    }
  }
  return;
};
/**
 * 条件全部符合，返回 true，否则返回 false
 *
 * 示例：AND(语文成绩>80, 数学成绩>80)
 *
 * 语文成绩和数学成绩都大于 80，则返回 true，否则返回 false
 *
 * 也可以直接用表达式如：语文成绩>80 && 数学成绩>80
 *
 * @example AND(expression1, expression2, ...expressionN)
 * @param {...expression} conditions - 条件表达式.
 * @namespace 逻辑函数
 *
 * @returns {boolean}
 */
const AND = (...condtions) => {
  return condtions.every((c) => c);
};

/**
 * 条件任意一个满足条件，返回 true，否则返回 false
 *
 * 示例：OR(语文成绩>80, 数学成绩>80)
 *
 * 语文成绩和数学成绩任意一个大于 80，则返回 true，否则返回 false
 *
 * 也可以直接用表达式如：语文成绩>80 || 数学成绩>80
 *
 * @example OR(expression1, expression2, ...expressionN)
 * @param {...expression} conditions - 条件表达式.
 * @namespace 逻辑函数
 *
 * @returns {boolean}
 */
const fnOR = (...condtions) => {
  return condtions.some((c) => c);
};

/* 
  ---------------------------------- 高级函数 ----------------------------------
*/
/**
 * 获取用户昵称
 * @returns
 */
const GETUSERNAME = () => {
  const userInfo = JSON.parse(sessionStorage.userInfo);
  return userInfo ? userInfo.nickname : '';
};



// 记忆函数
function memoizeFunction(fn) {
  let result;
  let prePageId = '';

  return function (...args) {
    if (pId != prePageId) {
      result = fn(...args);
      prePageId = pId;
    }
    return result;
  };
}
const recnoFn = async () => {
  // console.log('pId====', pId)
  let num = 1;
  try {
    const { data } = await formulaRecno({ formId: pId });
    num = data;
  } catch (err) {
    num = '';
  }
  return num;
};
/*
  依据当前表单被新打开的次数进行不断累计，起始值为1
  页面多次调用此函数，只执行一次
*/
const RECNO = memoizeFunction(recnoFn);

// 生成唯一UUID
function getUUID(len, radix) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');
  const uuid = [];
  let i;
  radix = radix || chars.length;
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    let r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
}
const UUID = () => {
  return getUUID();
};

const INDEX = (array, index) => {
  let position = parseInt(index);
  // 如果array是字符串，把它转化为 [array]
  if (!Array.isArray(array) && array) {
    array = [array];
  }
  if (isNaN(position)) {
    return '';
  }

  // 处理负数索引，将其转换为正数索引
  if (position < 0) {
    position = array.length + (position + 1);
  }

  // 检查索引是否在有效范围内
  if (position >= 0 && position <= array.length) {
    // 返回指定位置的值
    return array[position - 1];
  } else {
    // 如果索引超出数组范围，返回错误信息或者其他适当的值
    return '';
  }
};

module.exports = {
  // 数字
  ABS,
  SUM,
  AVERAGE,
  INT,
  LOG,
  MOD,
  MAX,
  MIN,
  POWER,
  PRODUCT,
  RAND,
  ROUND,
  SQRT,
  COUNT,
  CEILING,
  FIXED,
  SUMPRODUCT,
  // 字符串
  CONCAT,
  CHAR_LENGTH,
  LOWER,
  UPPER,
  LEFT,
  RIGHT,
  TRIM,
  REPLACE,
  TEXT,
  ISEMPTY,
  SEARCH,
  MID,
  VALUE,
  UNION,
  SPLIT,
  // 时间
  DATEDIFF,
  DAYOFWEEK,
  DAYOFMONTH,
  DAYOFYEAR,
  HOUR,
  MONTH,
  MINUTE,
  QUARTER,
  WEEK,
  YEAR,
  TODAY,
  DATE,
  DATEDELTA,
  // 逻辑
  AND,
  IFS,
  fnOR,
  fnIF,
  // 高级函数
  GETUSERNAME,
  UUID,
  RECNO,
  INDEX,
  // 文本组合使用
  CONCAT_TEXT,
};


