# math-keyboard

> 基于vue项目的移动端数学公式键盘，支持手写

### Demo地址

[演示地址](http://www.codwiki.cn/laboratory/keyboard)

### 更新日志

1. 增加输入框触摸移动光标

### 插件的安装

#### NPM

```
npm i math-keyboard
```

#### 插件依赖

```html
由于本插件公式渲染使用了mathquill.js,该插件依赖于JQuery，所以需要正确应用JQuery

<script src="https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
```

#### 引入插件

```
import Vue from 'vue';
import MathKeyboard from 'math-keyboard';

Vue.use(MathKeyboard);
```

#### 基本用法

```vue
<!-- 公式渲染 -->
<math-render :value.sync="value" :imgshow='!show'></math-render>

<!-- 键盘 -->
<math-keyboard 
    :show.sync="show"
    v-bind:keypanel='1'
    :value.sync="value"
    :output.sync="output"
    url='http://localhost:8080/formula'
    v-bind:writeShow='true'
></math-keyboard>
```

### API

| 参数             | 说明                                          | 类型    | 默认值 |
| ---------------- | --------------------------------------------- | ------- | ------ |
| :show.sync       | 键盘的显示与隐藏                              | Boolean | false  |
| v-bind:keypanel  | 默认键盘的面板（1.数字2.符号3.字母）          | Number  | 1      |
| :value.sync      | 当前键盘LaTeX值，会实时更新，可当做默认值传递 | String  |        |
| :output.sync     | 输出LaTeX值                                   | String  |        |
| url              | 手写识别接口地址                              | String  |        |
| v-bind:writeShow | 是否使用手写                                  | Boolean | true   |

#### 手写识别

本插件手写识别使用的是 [seshat](https://github.com/falvaro/seshat)，感兴趣的可以自行搭建，默认接口使用的是官方示例接口

请求示例：

```javascript
$.ajax({
  url:"http://cat.prhlt.upv.es/mer/eq.php",
  method: 'post',
  data: {
    strokes:params
  },
  dataType:'json',
  success(res){
    console.log(res.data)
	}
})
```



## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

### 