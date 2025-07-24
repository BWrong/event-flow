import type { IFormulaFunctionListItem } from '../types';

const mathList: IFormulaFunctionListItem[] = [
  {
    name: 'ABS',
    code: 'ABS()',
    desc: '<i>ABS</i>函数可以获取一个数的绝对值<br/>用法：<i>ABS</i>(数字)<br/> 示例：<i>ABS</i>(-8)可以返回8，也就是-8的绝对值',
  },
  {
    name: 'AVERAGE',
    code: 'AVERAGE()',
    desc: '<i>AVERAGE</i>函数可以获取一组数值的算术平均值<br/>用法：<i>AVERAGE</i>(数字1,数字2,...)<br/> 示例：<i>AVERAGE</i>(<strong>语文成绩</strong>,<strong>数学成绩</strong>, <strong>英语成绩</strong>)返回三门课程的平均分',
  },
  // {
  //   name: 'CEILING',
  //   code: 'CEILING()',
  //   desc: '<i>CEILING</i>函数可以将数字增大到最接近原值的指定因数的倍数<br/>用法：<i>CEILING</i>(数字,因数)<br/>示例：<i>CEILING</i>(7,6)返回12，因为12比7大的同时，也是6的倍数中最接近7的数字',
  // },
  // {
  //   name: 'FLOOR',
  //   code: 'FLOOR()',
  //   desc: '<i>FLOOR</i>函数可将数字减小到最接近原值的指定因数的倍数<br/>用法：<i>FLOOR</i>(数字,因数)<br/>示例：<i>FLOOR</i>(7,6)返回6，因为6比7小的同时，也是6的倍数中最接近7的数字',
  // },
  {
    name: 'INT',
    code: 'INT()',
    desc: '<i>INT</i>函数可以获取一个数的整数部分<br/>用法：<i>INT</i>(数字)<br/>示例：<i>INT</i>(3.1415)返回3，也就是3.1415的整数部分',
  },
  {
    name: 'LOG',
    code: 'LOG()',
    desc: '<i>LOG</i>函数可以根据指定底数返回数字的对数<br/>用法：<i>LOG</i>(底数,数字)<br/>示例：<i>LOG</i>(10,100)返回2，也就是以10为底数100的对数',
  },
  {
    name: 'MOD',
    code: 'MOD()',
    desc: '<i>MOD</i>函数可以获取两数相除的余数<br/>用法：<i>MOD</i>(被除数,除数)<br/>示例：<i>MOD</i>(4,3)返回1，也就是4/3的余数',
  },
  {
    name: 'MAX',
    code: 'MAX()',
    desc: '<i>MAX</i>函数可以获取一组数值的最大值<br/>用法：<i>MAX</i>(数字1,数字2,...)<br/>示例：<i>MAX</i>(<strong>语文成绩</strong>,<strong>数学成绩</strong>,<strong>英语成绩</strong>)返回三门课程中的最高分',
  },
  {
    name: 'MIN',
    code: 'MIN()',
    desc: '<i>MIN</i>函数可以获取一组数值的最小值<br/>用法：<i>MIN</i>(数字1,数字2,...)<br/>示例：<i>MIN</i>(<strong>语文成绩</strong>,<strong>数学成绩</strong>,<strong>英语成绩</strong>)返回三门课程中的最低分',
  },
  {
    name: 'SUM',
    code: 'SUM()',
    desc: '<i>SUM</i>函数可以获取一组数值的总和<br/>用法：<i>SUM</i>(数字1,数字2,...)<br/>示例：<i>SUM</i>(<strong>语文成绩</strong>,<strong>数学成绩</strong>,<strong>英语成绩</strong>)返回三门课程的总分',
  },
  {
    name: 'POWER',
    code: 'POWER()',
    desc: '<i>POWER</i>函数可以获取数字乘幂的结果<br/>用法：<i>POWER</i>(数字,指数)<br/>示例：<i>POWER</i>(3，2)返回9，也就是3的2次方',
  },
  {
    name: 'PRODUCT',
    code: 'PRODUCT()',
    desc: '<i>PRODUCT</i>函数可以获取一组数值的乘积<br/>用法：<i>PRODUCT</i>(数字1,数字2,...)<br/>示例：<i>PRODUCT</i>(<strong>单价</strong>, <strong>数量</strong>)获取总价，也就是单价和数量的乘积',
  },
  {
    name: 'RAND',
    code: 'RAND()',
    desc: '<i>RAND</i>函数可返回大于等于0且小于1的均匀分布随机实数<br/>用法：<i>RAND</i>()<br/>示例：<i>RAND</i>()返回0.424656',
  },
  {
    name: 'ROUND',
    code: 'ROUND()',
    desc: '<i>ROUND</i>函数可以将数字四舍五入到指定的位数<br/>用法：<i>ROUND</i>(数字,数字位数)<br/>示例：<i>ROUND</i>(3.1485,2)返回3.15',
  },
  {
    name: 'SQRT',
    code: 'SQRT()',
    desc: '<i>SQRT</i>函数可以获取一个数字的正平方根<br/>用法：<i>SQRT</i>(数字1)<br/>示例：<i>SQRT</i>(9)返回3，也就是9的正平方根',
  },
];
const mathListDefault: IFormulaFunctionListItem[] = [
  {
    name: 'COUNT',
    code: 'COUNT()',
    desc: '<i>COUNT</i>函数可以获取参数的数量<br/>用法：<i>COUNT</i>(值,值,...)<br/> 示例：<i>COUNT</i>(小明,小王,小张,小李)返回4，也就是人员的数量',
  },
  {
    name: 'CEILING',
    code: 'CEILING()',
    desc: '<i>CEILING</i>函数可以将数字增大到最接近原值的指定因数的倍数<br/>用法：<i>CEILING</i>(数字,因数)<br/> 示例：<i>CEILING</i>(7,6)返回12，因为12比7大的同时，也是6的倍数中最接近7的数字',
  },
  {
    name: 'FIXED',
    code: 'FIXED()',
    desc: '<i>FIXED</i>函数可将数字舍入到指定的小数位数并输出为文本<br/>用法：<i>FIXED</i>(数字,小数位数)<br/> 示例：<i>FIXED</i>(3.1415,2)返回"3.14"',
  },
  {
    name: 'SUMPRODUCT',
    code: 'SUMPRODUCT()',
    desc: '<i>SUMPRODUCT</i>将数组间对应的元素相乘，并返回乘积之和，适用于加权求和。<br/>用法：<i>SUMPRODUCT</i>(数组,数组...)<br/> 示例：<i>SUMPRODUCT</i>([1,2,3],[0.1,0.2,0.3])返回1.4，也就是 1×0.1 + 2×0.2 + 3×0.3的值。',
  },
];
const mathListFactory: IFormulaFunctionListItem[] = [
  {
    name: 'COUNT',
    code: 'COUNT()',
    desc: '<i>COUNT</i>函数是一个聚合函数，返回指定匹配条件的行数<br/>用法：<i>COUNT</i>(字段)<br/> 示例：<i>COUNT</i>(_id)返回匹配条件下的行数',
  },
];
const textList: IFormulaFunctionListItem[] = [
  {
    name: 'CONCAT',
    code: 'CONCAT()',
    desc: '<i>CONCAT</i>函数可以将多个文本合并成一个文本<br/>用法：<i>CONCAT</i>(文本1,文本2,...)<br/> 示例：<i>CONCAT</i>("三年二班","周杰伦")会返回"三年二班周杰伦"',
  },
  {
    name: 'CHAR_LENGTH',
    code: 'CHAR_LENGTH()',
    desc: '<i>CHAR_LENGTH</i>函数可以获取文本中的字符个数<br/>用法：<i>CHAR_LENGTH</i>(文本)<br/> 示例：<i>CHAR_LENGTH</i>("朝辞白帝彩云间")返回7，因为这句诗中有7个字符',
  },
  {
    name: 'LOWER',
    code: 'LOWER()',
    desc: '<i>LOWER</i>函数可以将一个文本中的所有大写字母转换为小写字母<br/>用法：<i>LOWER</i>(文本)<br/> 示例：<i>LOWER</i>("JAYZ")返回"jayz"',
  },
  {
    name: 'UPPER',
    code: 'UPPER()',
    desc: '<i>UPPER</i>函数可以将一个文本中的所有小写字母转换为大写字母<br/>用法：<i>UPPER</i>(文本)<br/> 示例：<i>UPPER</i>("jayz")返回"JAYZ"',
  },
  {
    name: 'LEFT',
    code: 'LEFT()',
    desc: '<i>LEFT</i>函数可以从一个文本的第一个字符开始返回指定个数的字符<br/>用法：<i>LEFT</i>(文本,文本长度)<br/> 示例：<i>LEFT</i>("三年二班周杰伦",2)返回"三年"，也就是"三年二班周杰伦"的从左往右的前2个字符',
  },
  {
    name: 'RIGHT',
    code: 'RIGHT()',
    desc: '<i>RIGHT</i>函数可以获取由给定文本右端指定数量的字符构成的文本值<br/>用法：<i>RIGHT</i>(文本,文本长度)<br/> 示例：<i>RIGHT</i>("三年二班周杰伦",3)返回"周杰伦"，也就是"三年二班周杰伦"从右往左的前3个字符',
  },
  {
    name: 'TRIM',
    code: 'TRIM()',
    desc: '<i>TRIM</i>函数可以删除文本首尾的空格<br/>用法：<i>TRIM</i>(文本)<br/> 示例：<i>TRIM</i>(" EasyCube ")返回"EasyCube"',
  },
  {
    name: 'TEXT',
    code: 'TEXT()',
    desc: `<i>TEXT</i>函数将数字转为中文大写<br/>用法：<i>TEXT</i>(数字,text_format)<br/>
    text_format 的含义如下：<br/><span style="font-weight:bold">＃：数字占位符。例：在文本框中输入：TEXT(数字, '###.##')，23.1 显示为 23.1，23.1578 显示为 23.16。<br/>
0：数字占位补位符。例：在文本框中输入：TEXT(数字, '000.00')，23.1 显示为 023.10，23.1578 显示为 023.16。<br/>
[Num0]: 显示原始数据。例：TEXT(数字, '[Num0]')<br/>
[Num1]: 将数字转为中文小写。123 显示为一百二十三。<br/>
[Num2]: 将数字转为中文大写。123 显示为壹佰贰拾叁。</span>`,
  },
  {
    name: 'REPLACE',
    code: 'REPLACE()',
    desc: '<i>REPLACE</i>(s，s1，s2) 使用字符串 s2 替换字符串 s 中所有的字符串 s1<br/>用法：<i>REPLACE</i>(s，s1，s2)<br/> 示例：<i>REPLACE</i>("aaa.EasyCube.com","a","w")返回"www.EasyCube.com"',
  },
];
const textListDefault: IFormulaFunctionListItem[] = [
  {
    name: 'ISEMPTY',
    code: 'ISEMPTY()',
    desc: '<i>ISEMPTY</i>函数可以用来判断值是否为空文本、空对象或者空数组<br/>用法：<i>ISEMPTY</i>(文本)<br/> 示例：略',
  },
  {
    name: 'MID',
    code: 'MID()',
    desc: '<i>MID</i>返回文本中从指定位置开始的指定数目的字符。<br/>用法：<i>MID</i>(文本,开始位置_数字,指定数目)<br/> 示例：<i>MID</i>("应用定制工具",3,2)返回"定制"。',
  },
  {
    name: 'SEARCH',
    code: 'SEARCH()',
    desc: '<i>SEARCH</i>获取文本1在文本2中的开始位置。<br/>用法：<i>SEARCH</i>(文本1,文本2)<br/> 示例：<i>SEARCH</i>("2016","定制2016")返回3。',
  },
  {
    name: 'SPLIT',
    code: 'SPLIT()',
    desc: '<i>SPLIT</i>将文本按指定分割符分割成数组。<br/>用法：<i>SPLIT</i>(文本,分隔符_文本)。<br/> 示例：<i>SPLIT</i>("应用定制-工具","-")返回"应用定制","工具"。',
  },
  {
    name: 'UNION',
    code: 'UNION()',
    desc: '<i>UNION</i>合并多个文本数组，重复文本只显示一次。<br/>用法：<i>UNION</i>(文本1，文本2，文本3，文本4)或UNION([数组])。<br/> 示例：<i>UNION</i>("张三","李四","王五","张三","李四")返回值为["张三","李四","王五"]。',
  },
  {
    name: 'VALUE',
    code: 'VALUE()',
    desc: '<i>VALUE</i>将文本转化为数字。<br/>用法：<i>VALUE</i>(文本)<br/> 示例：<i>VALUE</i>("3.1415")返回3.1415。',
  },
];
const dateList: IFormulaFunctionListItem[] = [
  // {
  //   name: 'CURDATE',
  //   code: 'CURDATE()',
  //   desc: '<i>CURDATE</i>返回当前的日期 YYYY-MM-DD<br/>用法：<i>CURDATE</i>()<br/>示例：略',
  // },
  // {
  //   name: 'CURTIME',
  //   code: 'CURTIME()',
  //   desc: '<i>CURTIME</i>返回当前的时间 HH：MM：SS<br/>用法：<i>CURTIME</i>()<br/>示例：略',
  // },

  {
    name: 'DATEDIFF',
    code: 'DATEDIFF()',
    desc: '<i>DATEDIFF</i>(date1，date2) 返回起始时间 date1 和结束时间 date2 之间的天数<br/>用法：<i>DATEDIFF</i>(date1，date2)<br/>示例：<i>DATEDIF</i>("2017-11-30","2017-11-29")返回1',
  },
  // {
  //   name: 'DATE_FORMAT',
  //   code: 'DATE_FORMAT()',
  //   desc: '<i>DATE_FORMAT</i>格式化指定的日期，根据参数返回指定格式的值<br/>用法：<i>DATE_FORMAT</i>(date，format)<br/>示例：<i>DATE_FORMAT</i>("2019-12-25 22:47:37","%Y-%m-%d %H:%i:%S")返回2019-12-25 22:47:37',
  // },
  // {
  //   name: 'DATE_ADD',
  //   code: 'DATE_ADD()',
  //   desc: '<i>DATE_ADD</i>向日期添加指定的时间间隔，向后偏移时间<br/>用法：<i>DATE_ADD</i>(date,interval num unit)；date表示当前的日期；interval是一个固定的参数；num为数字；unit表示你要加的单位 year | month | day<br/>示例：<i>DATE_ADD</i>("2019-01-01",interval 7 year)返回2026-01-01',
  // },
  // {
  //   name: 'DATE_SUB',
  //   code: 'DATE_SUB()',
  //   desc: '<i>DATE_SUB</i>向日期添加指定的时间间隔，向前偏移时间<br/>用法：<i>DATE_SUB</i>(date,interval num unit)；date表示当前的日期；interval是一个固定的参数；num为数字；unit表示你要减的单位 year | month | day<br/>示例：<i>DATE_SUB</i>("2019-01-01",interval 7 year)返回2012-01-01',
  // },
  {
    name: 'DAYOFWEEK',
    code: 'DAYOFWEEK()',
    desc: '<i>DAYOFWEEK</i>返回date所代表的一星期中的第几天(1~7)<br/>用法：<i>DAYOFWEEK</i>(时间戳)<br/>示例：略',
  },
  {
    name: 'DAYOFMONTH',
    code: 'DAYOFMONTH()',
    desc: '<i>DAYOFMONTH</i>返回date是一个月的第几天(1~31)<br/>用法：<i>DAYOFMONTH</i>(时间戳)<br/>示例：略',
  },
  {
    name: 'DAYOFYEAR',
    code: 'DAYOFYEAR()',
    desc: '<i>DAYOFYEAR</i>返回date是一年的第几天(1~366)<br/>用法：<i>DAYOFYEAR</i>(时间戳)<br/>示例：略',
  },
  {
    name: 'HOUR',
    code: 'HOUR()',
    desc: '<i>HOUR</i>返回time的小时值(0~23)<br/>用法：<i>HOUR</i>(时间戳)<br/>示例：略',
  },
  {
    name: 'MONTH',
    code: 'MONTH()',
    desc: '<i>MONTH</i>返回date的月份值(1~12)<br/>用法：<i>MONTH</i>(时间戳)<br/>示例：略',
  },
  {
    name: 'MINUTE',
    code: 'MINUTE()',
    desc: '<i>MINUTE</i>返回time的分钟值(0~59)<br/>用法：<i>MINUTE</i>(时间戳)<br/>示例：略',
  },
  // {
  //   name: 'NOW',
  //   code: 'NOW()',
  //   desc: '<i>NOW</i>返回当前的日期和时间<br/>用法：<i>NOW</i>()<br/>示例：略',
  // },
  {
    name: 'QUARTER',
    code: 'QUARTER()',
    desc: '<i>QUARTER</i>返回date在一年中的季度(1~4)<br/>用法：<i>QUARTER</i>(时间戳)<br/>示例：略',
  },
  {
    name: 'WEEK',
    code: 'WEEK()',
    desc: '<i>WEEK</i>返回日期date为一年中第几周(0~53)<br/>用法：<i>WEEK</i>(时间戳)<br/>示例：略',
  },
  // {
  //   name: 'WEEKDAY',
  //   code: 'WEEKDAY()',
  //   desc: '<i>WEEKDAY</i>获取指定日期在一周内的对应的工作日索引。0 表示周一，1 表示周二，……，6 表示周日<br/>用法：<i>WEEKDAY</i>(时间戳)<br/>示例：<i>WEEKDAY</i>("2017-12-15")返回4',
  // },
  {
    name: 'YEAR',
    code: 'YEAR()',
    desc: '<i>YEAR</i>返回日期date的年份(1000~9999)<br/>用法：<i>YEAR</i>(时间戳)<br/>示例：略',
  },
];
// 表单专用
const dateListDefault: IFormulaFunctionListItem[] = [
  {
    name: 'TODAY',
    code: 'TODAY()',
    desc: '<i>TODAY</i>函数可以返回今天<br/>用法：<i>TODAY</i>()<br/> 示例：略',
  },
  {
    name: 'DATE',
    code: 'DATE()',
    desc: '<i>DATE</i>函数可以将时间戳转换为日期对象<br/>用法：<i>DATE</i>(时间戳)<br/> 示例：略',
  },
  {
    name: 'DATEDELTA',
    code: 'DATEDELTA()',
    desc: '<i>DATEDELTA</i>函数可以将指定日期加/减指定天数<br/>用法：<i>DATEDELTA</i>(指定日期,需要加减的天数)<br/> 示例：略',
  },
];
// 数据工厂专用
const dateListFactory: IFormulaFunctionListItem[] = [
  {
    name: 'NOW',
    code: 'NOW()',
    desc: '<i>NOW</i>函数可以返回今天<br/>用法：<i>NOW</i>()<br/> 示例：略',
  },
];
const logicList: IFormulaFunctionListItem[] = [
  {
    name: 'IF',
    code: 'IF()',
    desc: '<i>IF</i>函数判断一个条件能否满足；如果满足返回一个值，如果不满足则返回另外一个值<br/>用法：<i>IF</i>(逻辑表达式,为true时返回的值,为false时返回的值)<br/>示例：<i>IF</i>(<strong>语文成绩</strong> > 60,"及格","不及格")，当语文成绩>60时返回及格，否则返回不及格。',
  },
  {
    name: 'IFS',
    code: 'IFS()',
    desc: '<i>IFS</i>函数检查是否满足一个或多个条件，且返回符合第一个TRUE条件的值，<i>IFS</i>可以取代多个嵌套IF语句。<br/>用法：<i>IFS</i>(逻辑表达式1,逻辑表达式1为true返回该值,逻辑表达式2,逻辑表达式2为true返回该值,...)<br/>示例：<i>IFS</i>(<strong>语文成绩</strong> > 90,"优秀",<strong>语文成绩</strong> > 80,"良好", <strong>语文成绩</strong> >= 60,"及格",<strong>语文成绩</strong> < 60,"不及格")，根据成绩返回对应的评价。',
  },
  {
    name: 'AND',
    code: 'AND()',
    desc: '如果所有参数都为真，<i>AND</i>函数返回布尔值true，否则返回布尔值 false<br/>用法：<i>AND</i>(逻辑表达式1,逻辑表达式2,...)<br/>示例：<i>AND</i>(<strong>语文成绩</strong>> 90,<strong>数学成绩</strong>> 90,<strong>英语成绩</strong>> 90)，如果三门课成绩都 > 90，返回true，否则返回false',
  },
  {
    name: 'OR',
    code: 'OR()',
    desc: '如果任意参数为真，<i>OR</i>函数返回布尔值true；如果所有参数为假，返回布尔值false。<br/>用法：<i>OR</i>(逻辑表达式1,逻辑表达式2,...)<br/>示例：<i>OR</i>(<strong>语文成绩</strong>> 90,<strong>数学成绩</strong>> 90,<strong>英语成绩</strong>> 90)，任何一门课成绩 > 90，返回true，否则返回false',
  },
];
const advancedList: IFormulaFunctionListItem[] = [
  {
    name: 'INDEX',
    code: 'INDEX()',
    desc: '<i>INDEX</i>返回数组中指定位置的值，位置用整数表示。<br/>用法：<i>INDEX</i>(数组,位置)<br/>示例：<i>INDEX</i>(<strong>复选框组</strong>,1)，则返回复选框组中正数第1个值，<i>INDEX</i>(<strong>复选框组</strong>,-1)，则返回复选框组中倒数第1个值。',
  }
];


export const funcList = [
  {
    name: '数学函数',
    code: 'MATH',
    children: mathList,
  },
  {
    name: '文本函数',
    code: 'TEXT',
    children: textList,
  },
  {
    name: '日期函数',
    code: 'DATE',
    children: dateList,
  },
  {
    name: '逻辑函数',
    code: 'LOGIC',
    children: logicList,
  },
  {
    name: '高级函数',
    code: 'ADVANCED',
    children: advancedList,
  },
];

