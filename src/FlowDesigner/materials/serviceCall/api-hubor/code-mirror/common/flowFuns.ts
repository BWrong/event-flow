/*
 * @Author: ykx
 * @Date: 2023-06-22 10:15:45
 * @LastEditTime: 2023-07-13 11:39:50
 * @LastEditors: your name
 * @Description: 函数显示(流程公式使用)
 * @FilePath: \easycube-apps\packages\zeroCodeEditor\src\dicts\func.ts
 */
import { type FlowFormulaFunctionListItem } from '../types';
const mathList: FlowFormulaFunctionListItem[] = [
  {
    name: 'ABS',
    value: 'ABS()',
    valueType: 'number',
    desc: '<i>ABS</i>函数可以获取一个数的绝对值<br/>用法：<i>ABS</i>(数字)<br/> 示例：<i>ABS</i>(-8)可以返回8，也就是-8的绝对值',
  },
  {
    name: 'ADD',
    value: 'ADD()',
    valueType: 'number',
    desc: '<i>ADD</i>函数用于返回组件值相加总和。<br/>用法：<i>ADD</i>(数字1,数字2,...)<br/> 示例：<i>AVERAGE</i>(<strong>语文成绩</strong>,<strong>数学成绩</strong>, <strong>英语成绩</strong>)返回三门课程的总分数',
  },
  // 还未配置子表单字段
  // {
  //   name: 'ARRAYGET',
  //   value: 'ARRAYGET()',
  //   valueType: 'genericity',
  //   desc: '<i>ARRAYGET</i>函数用于获取数据集中第k个值。<br/>用法：<i>ARRAYGET</i>(array, k)<br/> 示例：<i>AVERAGE</i>(<strong>语文成绩</strong>,<strong>数学成绩</strong>, <strong>英语成绩</strong>)返回三门课程的总分数',
  // },
  {
    name: 'AVERAGE',
    value: 'AVERAGE()',
    valueType: 'number',
    desc: '<i>AVERAGE</i>函数可以获取一组数值的算术平均值<br/>用法：<i>AVERAGE</i>(数字1,数字2,...)<br/> 示例：<i>AVERAGE</i>(<strong>语文成绩</strong>,<strong>数学成绩</strong>, <strong>英语成绩</strong>)返回三门课程的平均分',
  },
  {
    name: 'CEILING',
    value: 'CEILING()',
    valueType: 'number',
    desc: '<i>CEILING</i>函数可以将数字增大到最接近原值的指定因数的倍数<br/>用法：<i>CEILING</i>(数字,因数)<br/>示例：<i>CEILING</i>(7,6)返回12，因为12比7大的同时，也是6的倍数中最接近7的数字',
  },
  {
    name: 'FLOOR',
    value: 'FLOOR()',
    valueType: 'number',
    desc: '<i>FLOOR</i>函数可将数字减小到最接近原值的指定因数的倍数<br/>用法：<i>FLOOR</i>(数字,因数)<br/>示例：<i>FLOOR</i>(7,6)返回6，因为6比7小的同时，也是6的倍数中最接近7的数字',
  },
  {
    name: 'FIXED',
    value: 'FIXED()',
    valueType: 'number',
    desc: '<i>FIXED</i>函数可将数字舍入到指定的小数位数并输出为文本<br/>用法：<i>FIXED</i>(数字,位数)<br/>示例：<i>FIXED</i>(3.1415926,2)返回3.14',
  },
  {
    name: 'INT',
    value: 'INT()',
    valueType: 'number',
    desc: '<i>INT</i>函数可以获取一个数的整数部分<br/>用法：<i>INT</i>(数字)<br/>示例：<i>INT</i>(3.1415)返回3，也就是3.1415的整数部分',
  },
  {
    name: 'LARGE',
    value: 'LARGE()',
    valueType: 'number',
    desc: '<i>LARGE</i>函数可以获取数据集中按最大值排序第k个<br/>用法：<i>LARGE</i>(array, k)<br/>示例：<i>LARGE</i>([11,22,33], 3)返回11，最大值的第3个',
  },
  {
    name: 'SMALL',
    value: 'SMALL()',
    valueType: 'number',
    desc: '<i>SMALL</i>函数可以获取数据集中按最小值排序第k个<br/>用法：<i>SMALL</i>(array, k)<br/>示例：<i>SMALL</i>([11,22,33], 3)返回33，最小值的第3个',
  },
  {
    name: 'LOG',
    value: 'LOG()',
    valueType: 'number',
    desc: '<i>LOG</i>函数可以根据指定底数返回数字的对数<br/>用法：<i>LOG</i>(底数,数字)<br/>示例：<i>LOG</i>(10,100)返回2，也就是以10为底数100的对数',
  },
  {
    name: 'MOD',
    value: 'MOD()',
    valueType: 'number',
    desc: '<i>MOD</i>函数可以获取两数相除的余数<br/>用法：<i>MOD</i>(被除数,除数)<br/>示例：<i>MOD</i>(4,3)返回1，也就是4/3的余数',
  },
  {
    name: 'MAX',
    value: 'MAX()',
    valueType: 'number',
    desc: '<i>MAX</i>函数可以获取一组数值的最大值<br/>用法：<i>MAX</i>(数字1,数字2,...)<br/>示例：<i>MAX</i>(<strong>语文成绩</strong>,<strong>数学成绩</strong>,<strong>英语成绩</strong>)返回三门课程中的最高分',
  },
  {
    name: 'MIN',
    value: 'MIN()',
    valueType: 'number',
    desc: '<i>MIN</i>函数可以获取一组数值的最小值<br/>用法：<i>MIN</i>(数字1,数字2,...)<br/>示例：<i>MIN</i>(<strong>语文成绩</strong>,<strong>数学成绩</strong>,<strong>英语成绩</strong>)返回三门课程中的最低分',
  },
  {
    name: 'SUM',
    value: 'SUM()',
    valueType: 'number',
    desc: '<i>SUM</i>函数可以获取一组数值的总和<br/>用法：<i>SUM</i>(数字1,数字2,...)<br/>示例：<i>SUM</i>(<strong>语文成绩</strong>,<strong>数学成绩</strong>,<strong>英语成绩</strong>)返回三门课程的总分',
  },
  {
    name: 'SUMPRODUCT',
    value: 'SUMPRODUCT()',
    valueType: 'number',
    desc: '<i>SUMPRODUCT</i>函数可以将数组间对应的元素相乘，并返回乘积之和，适用于加权求和<br/>用法：<i>SUMPRODUCT</i>(数组1,数组2,...)<br/>示例：<i>SUMPRODUCT</i>([1,2,3],[0.1,0.2,0.3])返回1.4，也就是 1×0.1 + 2×0.2 + 3×0.3的值',
  },
  {
    name: 'POWER',
    value: 'POWER()',
    valueType: 'number',
    desc: '<i>POWER</i>函数可以获取数字乘幂的结果<br/>用法：<i>POWER</i>(数字,指数)<br/>示例：<i>POWER</i>(3，2)返回9，也就是3的2次方',
  },
  {
    name: 'PRODUCT',
    value: 'PRODUCT()',
    valueType: 'number',
    desc: '<i>PRODUCT</i>函数可以获取一组数值的乘积<br/>用法：<i>PRODUCT</i>(数字1,数字2,...)<br/>示例：<i>PRODUCT</i>(<strong>单价</strong>, <strong>数量</strong>)获取总价，也就是单价和数量的乘积',
  },
  {
    name: 'RAND',
    value: 'RAND()',
    valueType: 'number',
    desc: '<i>RAND</i>函数可返回大于等于0且小于1的均匀分布随机实数<br/>用法：<i>RAND</i>()<br/>示例：<i>RAND</i>()返回0.424656',
  },
  {
    name: 'ROUND',
    value: 'ROUND()',
    valueType: 'number',
    desc: '<i>ROUND</i>函数可以将数字四舍五入到指定的位数<br/>用法：<i>ROUND</i>(数字,数字位数)<br/>示例：<i>ROUND</i>(3.1485,2)返回3.15',
  },

  {
    name: 'SQRT',
    value: 'SQRT()',
    valueType: 'number',
    desc: '<i>SQRT</i>函数可以获取一个数字的正平方根<br/>用法：<i>SQRT</i>(数字1)<br/>示例：<i>SQRT</i>(9)返回3，也就是9的正平方根',
  },
];
const textList: FlowFormulaFunctionListItem[] = [
  {
    name: 'CONCAT',
    value: 'CONCAT()',
    valueType: 'text',
    desc: '<i>CONCAT</i>函数可以将多个文本合并成一个文本<br/>用法：<i>CONCAT</i>(文本1,文本2,...)<br/> 示例：<i>CONCAT</i>("三年二班","周杰伦")会返回"三年二班周杰伦"',
  },
  {
    name: 'EXACT',
    value: 'EXACT()',
    valueType: 'boolean',
    desc: '<i>EXACT</i>函数可以比较两个文本是否完全相同，完全相同则返回true，否则返回false<br/>用法：<i>EXACT</i>(文本1,文本2)<br/> 示例：<i>EXACT</i>(<strong>手机号</strong>,<strong>手机中奖号</strong>)，如果两者相同，返回true，如果不相同，返回false"',
  },
  {
    name: 'ARRAYGET',
    value: 'ARRAYGET()',
    valueType: 'genericity',
    desc: '<i>ARRAYGET</i>函数用于获取数据集中第k个值。<br/>用法：<i>ARRAYGET</i>(array, k)<br/> 示例：<i>AVERAGE</i>(SPLIT("EASYCUBE-流程表单","-"),1) 返回EASYCUBE',
  },
  {
    name: 'CHAR_LENGTH',
    value: 'CHAR_LENGTH()',
    valueType: 'number',
    desc: '<i>CHAR_LENGTH</i>函数可以获取文本中的字符个数<br/>用法：<i>CHAR_LENGTH</i>(文本)<br/> 示例：<i>CHAR_LENGTH</i>("朝辞白帝彩云间")返回7，因为这句诗中有7个字符',
  },
  {
    name: 'TOARRAY',
    value: 'TOARRAY()',
    valueType: 'array',
    desc: '<i>TOARRAY</i>函数可以将多参数转化为数组<br/>用法：<i>TOARRAY</i>(参数1,参数2,...)<br/>示例：<i>TOARRAY</i>(123,"测试参数1")返回[123,"测试参数1"]',
  },
  {
    name: 'LOWER',
    value: 'LOWER()',
    valueType: 'text',
    desc: '<i>LOWER</i>函数可以将一个文本中的所有大写字母转换为小写字母<br/>用法：<i>LOWER</i>(文本)<br/> 示例：<i>LOWER</i>("JAYZ")返回"jayz"',
  },
  {
    name: 'UPPER',
    value: 'UPPER()',
    valueType: 'text',
    desc: '<i>UPPER</i>函数可以将一个文本中的所有小写字母转换为大写字母<br/>用法：<i>UPPER</i>(文本)<br/> 示例：<i>UPPER</i>("jayz")返回"JAYZ"',
  },
  {
    name: 'LEFT',
    value: 'LEFT()',
    valueType: 'text',
    desc: '<i>LEFT</i>函数可以从一个文本的第一个字符开始返回指定个数的字符<br/>用法：<i>LEFT</i>(文本,文本长度)<br/> 示例：<i>LEFT</i>("三年二班周杰伦",2)返回"三年"，也就是"三年二班周杰伦"的从左往右的前2个字符',
  },
  {
    name: 'RIGHT',
    value: 'RIGHT()',
    valueType: 'text',
    desc: '<i>RIGHT</i>函数可以获取由给定文本右端指定数量的字符构成的文本值<br/>用法：<i>RIGHT</i>(文本,文本长度)<br/> 示例：<i>RIGHT</i>("三年二班周杰伦",3)返回"周杰伦"，也就是"三年二班周杰伦"从右往左的前3个字符',
  },
  {
    name: 'TRIM',
    value: 'TRIM()',
    valueType: 'text',
    desc: '<i>TRIM</i>函数可以删除文本首尾的空格<br/>用法：<i>TRIM</i>(文本)<br/> 示例：<i>TRIM</i>(" EasyCube ")返回"EasyCube"',
  },
  {
    name: 'REPLACE',
    value: 'REPLACE()',
    valueType: 'text',
    desc: '<i>REPLACE</i>(s，s1，s2) 使用字符串 s2 替换字符串 s 中所有的字符串 s1<br/>用法：<i>REPLACE</i>(s，s1，s2)<br/> 示例：<i>REPLACE</i>("aaa.EasyCube.com","a","w")返回"www.EasyCube.com"',
  },
  {
    name: 'SPLIT',
    value: 'SPLIT()',
    valueType: 'array',
    desc: '<i>SPLIT</i>函数可以将文本按指定分割符分割成数组(<br/>用法：<i>SPLIT</i>(文本,文本分隔符号)<br/> 示例：<i>SPLIT</i>("aaa.EasyCube.com",".")返回["aaa","EasyCube","com"]',
  },
  {
    name: 'UUID',
    value: 'UUID()',
    valueType: 'text',
    desc: '<i>UUID</i>函数用于随机码生成。可适用于随机流水号的使用场景等<br/>用法：<i>UUID</i>()<br/> 示例：<i>UUID</i>()返回5FYJQO3VCOAO3KCE20YW45E7OIMC39OUJU2MK0',
  },
];
const dateList: FlowFormulaFunctionListItem[] = [
  {
    name: 'DATE',
    value: 'DATE()',
    valueType: 'date',
    desc: '<i>DATE</i>函数可以将时间戳转换为日期对象<br/>用法：<i>DATE</i>(时间戳)<br/>示例：DATE_FORMAT(<i>DATE</i>(<strong>报名时间</strong>), "yyyy-MM-dd HH:mm:ss")返回2022-10-01 12:00:00',
  },
  {
    name: 'TIMESTAMP',
    value: 'TIMESTAMP()',
    valueType: 'timeStamp',
    desc: '<i>TIMESTAMP</i>函数可以将日期对象转换为时间戳<br/>用法：<i>TIMESTAMP</i>(日期)<br/>示例：DATE_FORMAT(NOW())返回当前时间的时间戳',
  },
  {
    name: 'NOW',
    value: 'NOW()',
    valueType: 'date',
    desc: '<i>NOW</i>返回当前时间的日期对象<br/>用法：<i>NOW</i>()<br/>示例：略',
  },
  {
    name: 'DATE_FORMAT',
    value: 'DATE_FORMAT()',
    valueType: 'date',
    desc: '<i>DATE_FORMAT</i>格式化指定的日期，根据参数返回指定格式的值<br/>用法：<i>DATE_FORMAT</i>(日期字段 | 字符串, 转换格式)<br/>示例：DATE_FORMAT(<i>DATE</i>(<strong>报名时间</strong>) 或者 "2022-10-01 12:00:00", "yyyy-MM-dd HH:mm:ss")返回2022-10-01 12:00:00',
  },
  // {
  //   name: 'CURDATE',
  //   value: 'CURDATE()',
  //   desc: '<i>CURDATE</i>返回当前的日期 YYYY-MM-DD<br/>用法：<i>CURDATE</i>()<br/>示例：略',
  // },
  // {
  //   name: 'CURTIME',
  //   value: 'CURTIME()',
  //   desc: '<i>CURTIME</i>返回当前的时间 HH：MM：SS<br/>用法：<i>CURTIME</i>()<br/>示例：略',
  // },
  {
    name: 'DAYBEGIN',
    value: 'DAYBEGIN()',
    valueType: 'date',
    desc: '<i>DAYBEGIN</i>获取当日开始时间字符串<br/>用法：<i>DAYBEGIN</i>()<br/>示例：<i>DAYBEGIN</i>()，返回2022-10-01 12:00:00',
  },
  {
    name: 'DAYEND',
    value: 'DAYEND()',
    valueType: 'date',
    desc: '<i>DAYEND</i>获取当日结束时间字符串<br/>用法：<i>DAYEND</i>()<br/>示例：<i>DAYEND</i>()，返回2022-10-01 12:00:00',
  },
  {
    name: 'DATEDIFF',
    value: 'DATEDIFF()',
    valueType: 'number',
    desc: '<i>DATEDIFF</i>(date1，date2) 返回起始时间 date1 和结束时间 date2 之间的天数<br/>用法：<i>DATEDIFF</i>(date1，date2)<br/>示例：<i>DATEDIF</i>("2017-11-30","2017-11-29")返回1',
  },
  {
    name: 'DATE_ADD',
    value: 'DATE_ADD()',
    valueType: 'date',
    desc: '<i>DATE_ADD</i>向日期添加指定的时间间隔，向后偏移时间<br/>用法：<i>DATE_ADD</i>(date,num)；date表示当前的日期；num为数字<br/>示例：<i>DATE_ADD</i>("2019-01-01",1)返回2019-01-02',
  },
  // {
  //   name: 'DATE_SUB',
  //   value: 'DATE_SUB()',
  //   desc: '<i>DATE_SUB</i>向日期添加指定的时间间隔，向前偏移时间<br/>用法：<i>DATE_SUB</i>(date,interval num unit)；date表示当前的日期；interval是一个固定的参数；num为数字；unit表示你要减的单位 year | month | day<br/>示例：<i>DATE_SUB</i>("2019-01-01",interval 7 year)返回2012-01-01',
  // },
  {
    name: 'DAYOFWEEK',
    value: 'DAYOFWEEK()',
    valueType: 'number',
    desc: '<i>DAYOFWEEK</i>返回date所代表的一星期中的第几天(1~7)<br/>用法：<i>DAYOFWEEK</i>(日期对象 | 字符串)<br/>示例：略',
  },
  {
    name: 'DAYOFMONTH',
    value: 'DAYOFMONTH()',
    valueType: 'number',
    desc: '<i>DAYOFMONTH</i>返回date是一个月的第几天(1~31)<br/>用法：<i>DAYOFMONTH</i>(日期对象 | 字符串)<br/>示例：略',
  },
  {
    name: 'DAYOFYEAR',
    value: 'DAYOFYEAR()',
    valueType: 'number',
    desc: '<i>DAYOFYEAR</i>返回date是一年的第几天(1~366)<br/>用法：<i>DAYOFYEAR</i>(日期对象 | 字符串)<br/>示例：略',
  },
  {
    name: 'HOUR',
    value: 'HOUR()',
    valueType: 'number',
    desc: '<i>HOUR</i>返回time的小时值(0~23)<br/>用法：<i>HOUR</i>(日期对象 | 字符串)<br/>示例：略',
  },
  {
    name: 'MONTH',
    value: 'MONTH()',
    valueType: 'number',
    desc: '<i>MONTH</i>返回date的月份值(1~12)<br/>用法：<i>MONTH</i>(日期对象 | 字符串)<br/>示例：略',
  },
  {
    name: 'MINUTE',
    value: 'MINUTE()',
    valueType: 'number',
    desc: '<i>MINUTE</i>返回time的分钟值(0~59)<br/>用法：<i>MINUTE</i>(日期对象 | 字符串)<br/>示例：略',
  },
  // {
  //   name: 'NOW',
  //   value: 'NOW()',
  //   desc: '<i>NOW</i>返回当前的日期和时间<br/>用法：<i>NOW</i>()<br/>示例：略',
  // },
  {
    name: 'QUARTER',
    value: 'QUARTER()',
    valueType: 'number',
    desc: '<i>QUARTER</i>返回date在一年中的季度(1~4)<br/>用法：<i>QUARTER</i>(日期对象 | 字符串)<br/>示例：略',
  },
  {
    name: 'WEEK',
    value: 'WEEK()',
    valueType: 'number',
    desc: '<i>WEEK</i>返回日期date为一年中第几周(0~53)<br/>用法：<i>WEEK</i>(日期对象 | 字符串)<br/>示例：略',
  },
  {
    name: 'WEEKDAY',
    value: 'WEEKDAY()',
    valueType: 'number',
    desc: '<i>WEEKDAY</i>获取指定日期在一周内的对应的工作日索引。0 表示周一，1 表示周二，……，6 表示周日<br/>用法：<i>WEEKDAY</i>(日期对象 | 字符串)<br/>示例：<i>WEEKDAY</i>("2017-12-15")返回4',
  },
  {
    name: 'WORKDAY',
    value: 'WORKDAY()',
    valueType: 'date',
    desc: '<i>WORKDAY</i>函数可以获取指定日期之前(负数)或者之后(正数)指定工作日数的日期，工作日不包括周末和节假日。<br/>用法：<i>WORKDAY</i>(日期对象 | 字符串, number)<br/>示例：略',
  },
  {
    name: 'NETWORKDAYS',
    value: 'NETWORKDAYS()',
    valueType: 'number',
    desc: '<i>NETWORKDAYS</i>函数可以获取两个日期之间的工作日数，工作日不包括周末和节假日。<br/>用法：<i>NETWORKDAYS</i>(日期对象 | 字符串, 日期对象 | 字符串)<br/>示例：略',
  },
  {
    name: 'YEAR',
    value: 'YEAR()',
    valueType: 'number',
    desc: '<i>YEAR</i>返回日期date的年份(1000~9999)<br/>用法：<i>YEAR</i>(日期对象 | 字符串)<br/>示例：略',
  },
  {
    name: 'YEARBEGIN',
    value: 'YEARBEGIN()',
    valueType: 'date',
    desc: '<i>YEARBEGIN</i>获取日期所在年份的首个日期<br/>用法：<i>YEARBEGIN</i>(日期对象 | 字符串)<br/>示例：略',
  },
  {
    name: 'YEAREND',
    value: 'YEAREND()',
    valueType: 'date',
    desc: '<i>YEAREND</i>获取日期所在年份的最后一个日期<br/>用法：<i>YEAREND</i>(日期对象 | 字符串)<br/>示例：略',
  },
];
const logicList: FlowFormulaFunctionListItem[] = [
  {
    name: 'IF',
    value: 'IF()',
    valueType: 'genericity',
    desc: '<i>IF</i>函数判断一个条件能否满足；如果满足返回一个值，如果不满足则返回另外一个值<br/>用法：<i>IF</i>(逻辑表达式,为true时返回的值,为false时返回的值)<br/>示例：<i>IF</i>(<strong>语文成绩</strong> > 60,"及格","不及格")，当语文成绩>60时返回及格，否则返回不及格。',
  },
  {
    name: 'AND',
    value: 'AND()',
    valueType: 'boolean',
    desc: '如果所有参数都为真，<i>AND</i>函数返回布尔值true，否则返回布尔值 false<br/>用法：<i>AND</i>(逻辑表达式1,逻辑表达式2,...)<br/>示例：<i>AND</i>(<strong>语文成绩</strong>> 90,<strong>数学成绩</strong>> 90,<strong>英语成绩</strong>> 90)，如果三门课成绩都 > 90，返回true，否则返回false',
  },
  {
    name: 'OR',
    value: 'OR()',
    valueType: 'boolean',
    desc: '如果任意参数为真，<i>OR</i>函数返回布尔值true；如果所有参数为假，返回布尔值false。<br/>用法：<i>OR</i>(逻辑表达式1,逻辑表达式2,...)<br/>示例：<i>OR</i>(<strong>语文成绩</strong>> 90,<strong>数学成绩</strong>> 90,<strong>英语成绩</strong>> 90)，任何一门课成绩 > 90，返回true，否则返回false',
  },
  {
    name: 'EQ',
    value: 'EQ()',
    valueType: 'boolean',
    desc: '<i>EQ</i>比较两个值是否相等，相等返回true，否则返回false<br/>用法：<i>EQ</i>(value1,value2)<br/>示例：<i>EQ</i>(<strong>报名时间</strong>, TODAY())，选择的报名时间是否是今天，是则返回true',
  },
  {
    name: 'FALSE',
    value: 'FALSE()',
    valueType: 'boolean',
    desc: '<i>FALSE</i>函数返回布尔值false<br/>用法：<i>FALSE</i>()<br/>示例：<i>FALSE</i>()，返回逻辑值false',
  },
  {
    name: 'GE',
    value: 'GE()',
    valueType: 'boolean',
    desc: '<i>GE</i>函数用于比较两个数的大小，value1大于等于value2返回true<br/>用法：<i>GE</i>(value1,value2)<br/>示例：<i>GE</i>(<strong>年龄</strong>, 30)，年龄大于等于30的返回true',
  },
  {
    name: 'GT',
    value: 'GT()',
    valueType: 'boolean',
    desc: '<i>GT</i>函数用于比较两个数的大小，value1大于value2返回true<br/>用法：<i>GT</i>(value1,value2)<br/>示例：<i>GT</i>(<strong>年龄</strong>, 30)，年龄大于30的返回true',
  },
  {
    name: 'ISEMPTY',
    value: 'ISEMPTY()',
    valueType: 'boolean',
    desc: '<i>ISEMPTY</i>函数可以用来判断值是否为空文本、空对象或者空数组<br/>用法：<i>ISEMPTY</i>(文本)<br/>示例：<i>ISEMPTY</i>(<strong>姓名</strong>)，输入的姓名不能为空',
  },
  {
    name: 'LE',
    value: 'LE()',
    valueType: 'boolean',
    desc: '<i>LE</i>函数用于比较两个数的大小，value1小于等于value2返回true<br/>用法：<i>LE</i>(value1,value2)<br/>示例：<i>LE</i>(<strong>年龄</strong>, 30)，年龄小于等于30的返回true',
  },
  {
    name: 'LT',
    value: 'LT()',
    valueType: 'boolean',
    desc: '<i>LT</i>函数用于比较两个数的大小，value1小于value2返回true<br/>用法：<i>LT</i>(value1,value2)<br/>示例：<i>LT</i>(<strong>年龄</strong>, 30)，年龄小于30的返回true',
  },
];
const arrayList: FlowFormulaFunctionListItem[] = [
  {
    name: 'ISEMPTY',
    value: 'ISEMPTY()',
    valueType: 'boolean',
    desc: '<i>ISEMPTY</i>函数可以用来判断数组是否为空<br/>用法：<i>ISEMPTY</i>(数组)<br/>示例：<i>ISEMPTY</i>([])，数组不能为空',
  },
  {
    name: 'DIFFERENCESET',
    value: 'DIFFERENCESET()',
    valueType: 'array',
    desc: '<i>DIFFERENCESET</i>函数用于集合1中剔除集合2所剩下的元素<br/>用法：<i>DIFFERENCESET</i>(array1,array2)<br/>示例：<i>DIFFERENCESET</i>([1,2,3],[4,3,1])返回[2]',
  },
  {
    name: 'INTERSECTIONSET',
    value: 'INTERSECTIONSET()',
    valueType: 'array',
    desc: '<i>INTERSECTIONSET</i>函数用于计算两个集合的交集<br/>用法：<i>INTERSECTIONSET</i>(array1,array2)<br/>示例：<i>INTERSECTIONSET</i>([1,2,3],[4,3,1])返回[1,3]',
  },
  {
    name: 'SUBSET',
    value: 'SUBSET()',
    valueType: 'boolean',
    desc: '<i>SUBSET</i>函数用于判断第二个集合是否是第一个集合的子集<br/>用法：<i>SUBSET</i>(array1,array2)<br/>示例：略',
  },
  {
    name: 'UNIONSET',
    value: 'UNIONSET()',
    valueType: 'array',
    desc: '<i>UNIONSET</i>函数用于计算两个集合的并集<br/>用法：<i>UNIONSET</i>(array1,array2)<br/>示例：<i>UNIONSET</i>([1,2,3],[4,3,1])返回[1,2,3,4]',
  },
  {
    name: 'STRJOIN',
    value: 'STRJOIN()',
    valueType: 'text',
    desc: '<i>STRJOIN</i>将数组按照分隔符进行分割。<br/>用法：<i>STRJOIN</i>(array1,string)<br/>示例：<i>STRJOIN</i>([1,2],",")返回1,2',
  },
];
export const funcList = [
  {
    name: '数学函数',
    value: 'MATH',
    children: mathList,
  },
  {
    name: '文本函数',
    value: 'TEXT',
    children: textList,
  },
  {
    name: '日期函数',
    value: 'DATE',
    children: dateList,
  },
  {
    name: '逻辑函数',
    value: 'LOGIC',
    children: logicList,
  },
  {
    name: '集合函数',
    value: 'ARRAY',
    children: arrayList,
  },
];
