<template>
  <div  class="keyboard" :class="{'keyboardup':show}" id="keyboard">
    <div class="keyboard-div" @click="keyhide()" v-show="show && bgshow"></div>
    <div class="keyboard-output">
        <span :id="mathinput" class="editor" style="background:#fff">
        </span>
        <svg viewBox="25 25 50 50" v-show="loading"><circle cx="50" cy="50" r="20" fill="none"></circle></svg>
        <a @click="keyhide()">确定</a>
    </div>
    <div class="keyboard-panel" id="keyboard" :style="{display:keyorwrite === 1 ? 'unset':'none'}">
        <div class="keyboard-panel-default" v-if="panel === 1">
        <div class="keyboard-default-symbol">
            <ul>
                <li v-for="item in keysym" @click="insertar(item.v)"
                  :key=""
                ><img :src="item.i" v-if="item.i"/>{{item.k}}</li>
            </ul>
            <div class="keyboard-default-symbol-bottom">
            <ul>
                <li @click="changepanel(3)">abc</li>
                <li @click="changepanel(2)">符</li>
            </ul>
            </div>
        </div>
        <div class="keyboard-default-num">
            <ul>
                <li v-for="item in keynum" 
                  :key=""
                  @click="insertar(item.v)"
                  @touchstart="item.t = true" 
                  @touchend="item.t = false"
                  :style="{'background-color':item.t?'#bababa':'#fff'}"
                >{{item.k}}</li>
            </ul>
        </div>
        <div class="keyboard-default-right">
            <ul>
              <li @click="insertar('Backspace')"

              ><img :src="img.back"/></li>
              <li @click="insertar('+')">+</li>
              <li @click="insertar('-')">-</li>
              <li @click="insertar('=')">=</li>
            </ul>
        </div>
        </div>

        <div class="keyboard-panel-symbol" v-if="panel === 2">
        <div class="keyboard-symbol-left">
            <ul>
            <li v-for="item in keysym" @click="insertar(item.v)"><img :src="item.i" v-if="item.i"/>{{item.k}}</li>
            </ul>
            <div class="keyboard-default-symbol-bottom">
            <ul>
                <li @click="changepanel(3)"
                  
                >abc</li>
                <li @click="changepanel(1)">123</li>
                <li @click="insertar(' ')">空格</li>
            </ul>
            </div>
        </div>
        <div class="keyboard-default-right">
            <ul>
            <li @click="insertar('Backspace')"><img :src="img.back"/></li>
            <li @click="insertar('+')">+</li>
            <li @click="insertar('-')">-</li>
            <li @click="insertar('=')">=</li>
            </ul>
        </div>
        </div>

        <div class="keyboard-panel-letter" v-if="panel === 3">
        <div class="letter-row" v-for="items in keyabc[capsletter]" :key="">
            <ul>
              <li v-for="item in items" 
                @click="item.v != 'shift' ? insertar(item.v) : caps()" 
                :key=""
                @touchstart="item.t = true" 
                @touchend="item.t = false"
                :style="item.v != 'shift' ? item.v != 'Backspace' ? {'background-color':item.t ? '#bababa' : '#fff'} : {'background-color':item.t ? '#fff' : '#adafbc'} :''"
              ><img :src="item.i" v-if="item.i"/>{{item.k}}</li>
            </ul>
        </div>
        <div class="letter-row">
            <ul>
            <li @click="changepanel(1)">123</li>
            <li @click="changepanel(2)">符</li>
            <li @click="insertar(' ')">空格</li>
            <li @click="insertar('=')">=</li>
            </ul>
        </div>
        </div>
    </div>

    <div class="keyboard-write" :style="{display:keyorwrite === 2?'unset':'none'}" id="write">
      <canvas
        id="canvas"
        :width="canvasw"
        :height="canvash"
        @touchstart="canvasDown($event)" 
        @touchmove="canvasMove($event)"
        @touchend="canvasUp($event)"
        ref="canvas"
      ></canvas>
      <div class="keyboard-write-button">
        <ul>
          <li @click="leftdraw()">上一步</li>
          <li @click="rightdraw()">下一步</li>
          <li @click="cleardraw()">清除</li>
        </ul>
      </div>
    </div>

    <div class="keyboard-func" v-show="writeShow">
        <div class="keyboard-func-icon" v-on:click="keyorwrite == 1 ? ctrl = 1 : keyorwrite = 1"><img :src="keyorwrite == 1 ? img.keyboard : img.keyboard_no"/></div>
        <div class="keyboard-func-icon" v-on:click="keyorwrite = 2"><img :src="keyorwrite == 2 ? img.write : img.write_no"/></div>
    </div>
  </div >
</template>

<script>
import "mathquill/build/mathquill";
import img from './img.js'
import { setTimeout, clearTimeout } from 'timers';

export default {
  name: "math-keyboard",
  data() {
    return {
      img:img,
      mathField: null,
      mathview:'mathview' + parseInt(Math.random()*(999999-100000+1)+100000,10),
      mathinput:'mathinput',
      panel: this.keypanel,
      capsletter:'letter',
      keyabc:{
        'letter':[
          [
            {k:'q',v:'q',t:false},
            {k:'w',v:'w',t:false},
            {k:'e',v:'e',t:false},
            {k:'r',v:'r',t:false},
            {k:'t',v:'t',t:false},
            {k:'y',v:'y',t:false},
            {k:'u',v:'u',t:false},
            {k:'i',v:'i',t:false},
            {k:'o',v:'o',t:false},
            {k:'p',v:'p',t:false},
          ],
          [
            {k:'a',v:'a',t:false},
            {k:'s',v:'s',t:false},
            {k:'d',v:'d',t:false},
            {k:'f',v:'f',t:false},
            {k:'g',v:'g',t:false},
            {k:'h',v:'h',t:false},
            {k:'j',v:'j',t:false},
            {k:'k',v:'k',t:false},
            {k:'l',v:'l',t:false},
          ],
          [
            {k:'',v:'shift',i:img.shift},
            {k:'z',v:'z',t:false},
            {k:'x',v:'x',t:false},
            {k:'c',v:'c',t:false},
            {k:'v',v:'v',t:false},
            {k:'b',v:'b',t:false},
            {k:'n',v:'n',t:false},
            {k:'m',v:'m',t:false},
            {k:'',v:'Backspace',i:img.back,t:false},
          ]
        ],
        'caps':[
          [
            {k:'Q',v:'Q',t:false},
            {k:'W',v:'W',t:false},
            {k:'E',v:'E',t:false},
            {k:'R',v:'R',t:false},
            {k:'T',v:'T',t:false},
            {k:'Y',v:'Y',t:false},
            {k:'U',v:'U',t:false},
            {k:'I',v:'I',t:false},
            {k:'O',v:'O',t:false},
            {k:'P',v:'P',t:false},
          ],
          [
            {k:'A',v:'A',t:false},
            {k:'S',v:'S',t:false},
            {k:'D',v:'D',t:false},
            {k:'F',v:'F',t:false},
            {k:'G',v:'G',t:false},
            {k:'H',v:'H',t:false},
            {k:'J',v:'J',t:false},
            {k:'K',v:'K',t:false},
            {k:'L',v:'L',t:false},
          ],
          [
            {k:'',v:'shift',i:img.dshift},
            {k:'Z',v:'Z',t:false},
            {k:'X',v:'X',t:false},
            {k:'C',v:'C',t:false},
            {k:'V',v:'V',t:false},
            {k:'B',v:'B',t:false},
            {k:'N',v:'N',t:false},
            {k:'M',v:'M',t:false},
            {k:'',v:'Backspace',i:img.back,t:false},
          ]
        ] 
      },
      keynum:[
        {k:'1',v:'1',t:false},
        {k:'2',v:'2',t:false},
        {k:'3',v:'3',t:false},
        {k:'4',v:'4',t:false},
        {k:'5',v:'5',t:false},
        {k:'6',v:'6',t:false},
        {k:'7',v:'7',t:false},
        {k:'8',v:'8',t:false},
        {k:'9',v:'9',t:false},
        {k:'0',v:'0',t:false},
        {k:'.',v:'.',t:false},
      ],
      keysym:[
        {k:'',v:'^2',i:img.cuadrado},
        {k:'',v:'^3',i:img.tercera},
        {k:'',v:'/',i:img.fraccion},
        {k:'',v:'^',i:img.potencia},
        {k:'',v:'\\sqrt',i:img.raiz2},
        {k:'',v:'\\nthroot',i:img.raiz},
        {k:'',v:'(',i:img.zkh},
        {k:'',v:')',i:img.ykh},
        {k:'',v:'[',i:img.zfkh},
        {k:'',v:']',i:img.yfkh},
        {k:'sin',v:'\\sin',i:''},
        {k:'cos',v:'\\cos',i:''},
        {k:'tan',v:'\\tan',i:''},
        {k:'π',v:'\\pi',i:''},
        {k:'',v:'|',i:img.abs},
        {k:'≈',v:'\\approx',i:''},
        {k:'≠',v:'\\neq',i:''},
        {k:'%',v:'%',i:''},
        {k:'+',v:'+',i:''},
        {k:'-',v:'-',i:''},
        {k:'×',v:'\\times',i:''},
        {k:'÷',v:'\\div',i:''},
        {k:'±',v:'±',i:''},
        {k:'>',v:'>',i:''},
        {k:'<',v:'<',i:''},
        {k:'≥',v:'\\geq',i:''},
        {k:'≤',v:'\\leq',i:''},
        {k:',',v:',',i:''},
        {k:':',v:':',i:''},
        {k:'°',v:'\\degree',i:''},
        {k:'或',v:'或',i:''},
        {k:'且',v:'且',i:''},
        {k:'非',v:'非',i:''},
      ],
      latex:this.value,
      keyshow:this.show,
      keyorwrite:1,
      canvasMoveUse: !1,
      canvas:null,
      context:null,// 使用 wx.createContext 获取绘图上下文 context
      isButtonDown:false,//是否在绘制中
      arrx:[],//动作横坐标
      arry:[],//动作纵坐标
      arrz:[],//总做状态，标识按下到抬起的一个组合
      canvasw:0,//画布宽度
      canvash:208,//画布高度
      tmpArr: [],
      retArr: [],
      delArr: [],
      timeid:0,
      timestatus:0,
      istouch:false,
      loading:false,
      ajax:''
    };
  },
  props:{
    show: Boolean,
    value: String,
    bgshow:{
      type: Boolean,
      default: true
    },
    keypanel: {
      type: Number,
      default: 1
    },
    url:String,
    writeShow:{
      type: Boolean,
      default: true
    },
    ctrl:{
      type: Number,
      default: 0
    },
  },
  mounted() {
    var that = this
    var mathFieldSpan = document.getElementById(this.mathinput);

    var MQ = MathQuill.getInterface(2);
    var mathField = (this.mathField = MQ.MathField(mathFieldSpan, {
      spaceBehavesLikeTab: true,
      leftRightIntoCmdGoes: 'up',
      restrictMismatchedBrackets: true,
      sumStartsWithNEquals: true,
      supSubsRequireOperand: true,
      //charsThatBreakOutOfSupSub: '+-=<>',
      autoSubscriptNumerals: true,
      autoCommands: 'pi theta sqrt sum',
      autoOperatorNames: 'sin cos',

      handlers: {
        edit: function() {
          that.$emit('update:value',mathField.latex())
          that.mathField.focus();
        }
      }
    }));

    that.mathField.latex(that.value)

    this.initCanvas()
  },
  methods: {
    insertar(valor) {
      var that = this;
      if (valor.includes("^2") || valor.includes("^3")) {
        that.mathField.write(valor);
        that.mathField.keystroke("Right");
      } else if(valor == 'Backspace'){
        that.mathField.keystroke(valor);
      } else {
        that.mathField.cmd(valor);
      }
      
      that.mathField.focus(); 
    },
    changepanel(val) {
      this.panel = val;
      this.$emit('update:keypanel',val)
    },
    caps(){
      if(this.capsletter === 'letter'){
        this.capsletter = 'caps'
      } else {
        this.capsletter = 'letter'
      }
    },
    keyhide(event){
      this.$emit('update:show',false)
      this.cleardraw()
    },
    initCanvas(){
      this.canvas = this.$refs.canvas;//指定canvas
      this.canvasw = document.getElementById('keyboard').clientWidth - 60
      this.context = this.canvas.getContext("2d");//设置2D渲染区域
      this.context.lineWidth = 50;//设置线的宽度
      
    },
    canvasDown(event) {
      this.timestatus = 0
      var elem = document.getElementById('write')

      this.offsetLeft = this.pageX(elem)
      this.offsetTop = this.pageY(elem)

      this.canvasMoveUse = !0,
      this.tmpArr = []
      this.delArr = []
      this.isButtonDown = true;
      this.arrz.push(0);
      this.arrx.push(Math.floor(event.changedTouches[0].clientX - this.offsetLeft));
      this.arry.push(Math.floor(event.changedTouches[0].clientY - this.offsetTop));  
      
      if(this.canvasMoveUse){
        var e = event.target,
            r = Math.floor(event.touches[0].clientX - this.offsetLeft),
            n = Math.floor(event.touches[0].clientY - this.offsetTop);

        var arr = this.tmpArr
        arr[this.tmpArr.length] = [r, n]
        this.tmpArr = arr;
      }
    },
    canvasMove(event) {
      var _this = this
      if (_this.isButtonDown) {
          _this.arrz.push(1);
          _this.arrx.push(Math.floor(event.changedTouches[0].clientX - this.offsetLeft));
          _this.arry.push(Math.floor(event.changedTouches[0].clientY - this.offsetTop));
      };

      _this.context.beginPath()

      for (var i = 0; i < _this.arrx.length; i++) {
        if (_this.arrz[i] == 0) {
            _this.context.moveTo(_this.arrx[i], _this.arry[i])
        } else {
            _this.context.lineTo(_this.arrx[i], _this.arry[i])
        };
      };
      _this.context.clearRect(0, 0, _this.canvasw, _this.canvash);
      _this.lineset()
      _this.context.stroke();
      _this.context.closePath()

      if(_this.canvasMoveUse){
        var e = event.target,
            r = Math.floor(event.touches[0].clientX - this.offsetLeft),
            n = Math.floor(event.touches[0].clientY - this.offsetTop);

        var arr = _this.tmpArr
        arr[_this.tmpArr.length] = [r, n]
        _this.tmpArr = arr;
      }
    },
    canvasUp(e) {
      var that = this
      this.canvasMoveUse = !1
      this.isButtonDown = false;

      var arr = this.retArr
      arr[this.retArr.length] = this.tmpArr
      this.retArr = arr

      this.timestatus = 1
      clearTimeout(this.timeid)

      this.timeid = setTimeout(function(){
        console.log(that.timestatus)
        if(that.timestatus == 1){
          that.submitArr()
        }
      },1000)
    },
    //清除画布
    cleardraw: function () {
      //清除画布
      this.arrx = [];
      this.arry = [];
      this.arrz = [];

      this.canvas.height = this.canvas.height

      this.tmpArr = [];
      this.retArr = [];

      this.timestatus = 0
      clearTimeout(this.timeid)
    },
    leftdraw(){
      if(this.retArr.length == 0){
        return
      }
      this.timestatus = 0
      var that = this;
      this.delArr.push(that.retArr[that.retArr.length - 1])

      that.retArr.splice(that.retArr.length - 1,1)

      this.drawline()
    },
    rightdraw(){
      if(this.delArr.length == 0){
        return
      }
      this.timestatus = 0
      this.retArr.push(this.delArr[this.delArr.length - 1])
      this.delArr.splice(this.delArr.length - 1,1)

      this.drawline()
    },
    drawline(){
      var that = this
      that.arrx = []
      that.arry = []
      that.arrz = []

      that.retArr.forEach(function(item,index){
        that.arrz.push(0);
        item.forEach(function(items,indexs){
          if(indexs != 0){
            that.arrz.push(1);
          }
          
          that.arrx.push(items[0])
          that.arry.push(items[1])
        })
      })

      this.canvas.height = this.canvas.height

      for (var i = 0; i < that.arrx.length; i++) {
        if (that.arrz[i] == 0) {
            that.context.moveTo(that.arrx[i], that.arry[i])
        } else {
            that.context.lineTo(that.arrx[i], that.arry[i])
        };
      };
      that.lineset()
      that.context.stroke();

      this.timestatus = 1
      clearTimeout(this.timeid)

      this.timeid = setTimeout(function(){
        console.log(that.timestatus)
        if(that.timestatus == 1){
          that.submitArr()
        }
      },1000)
    },
    lineset(){
      this.context.lineWidth = 4
      this.context.strokeStyle = '#777'
      this.context.lineCap = 'round';
      this.context.lineJoin = 'round';
    },
    pageX(elem){  
      return elem.offsetParent ? elem.offsetLeft + this.pageX(elem.offsetParent) : elem.offsetLeft;
    },
    pageY(elem){  
      return elem.offsetParent ? elem.offsetTop + this.pageY(elem.offsetParent) : elem.offsetTop;
    },
    submitArr(){
      this.loading = true
      var that = this;
      var strokes = that.retArr

      var scg = 'SCG_INK\n' + strokes.length + '\n'
  
      strokes.forEach(function (stroke) {
        scg += stroke.length + '\n'
        stroke.forEach(function (p) {
            scg += p[0] + ' ' + p[1] + '\n'
        })
      })

      var blob = new Blob([scg], {
        type: "text/plain;charset=utf-8"
      });

      var params = new FormData();
      params.append('file', blob);

      //data: that.arrToStr(that.retArr)
      if(that.ajax){
        that.ajax.abort()
      }

      that.ajax = $.ajax({
        url:that.url,
        method: 'post',
        data: params,
        dataType:'json',
        cache: false,  
        processData: false,  
        contentType: false, 
        success(res){
          that.loading = false
          console.log(res)
          that.latex = res.data
          that.$emit('update:value',res.data)
          that.mathField.latex(that.latex)
        }
      });
    },
    arrToStr: function (t) {
      var e = "";
      e += "[";
      for (var r = 0, n = t.length; r < n; r++){
          if (t[r].length > 0) {
              e += "[";
              for (var i = 0, o = t[r].length; i < o; i++)
                  t[r][i].length > 0 && (e += "[" + t[r][i][0] + "," + t[r][i][1] + "]", i < o - 1 && (e += ","));
              e += "]", r < n - 1 && (e += ",")
          }
      } 
      
      return e += "]"
    }
  },
  watch:{
    value(nval,oval){
      if(!this.show){
        this.mathField.latex(this.value)
      }
    },
    ctrl(nval,oval){
      this.$emit('update:ctrl',nval)
      // this.keyhide()
      // console.log('ctrl'+nval)
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
*{
  box-sizing: content-box !important;
}
.math{
  position: absolute;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
}
.keyboard-div{
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  z-index: -1;
}
.keyboard-enter-active, .keyboard-leave-active {
  transition: all .5s;
}
.keyboard-enter, .keyboard-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateY(340px);
}
.mathview{
  border: none;
  border-bottom: 1px solid gray;
  min-width: 45px;
  min-height: 22px;
}
.keyboard {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: -340px;
  background-color: #d2d3d8;
  z-index: 16777271;
  transition: all 0.5s;
}

.keyboardup{
  bottom: 0;
  padding-bottom: 10px;
}

.keyboard-output {
  width: calc(100% - 4px);
  padding: 3px 2px;
}

.keyboard-output > span {
  display: block;
  width: calc(100% - 42px);
  height: 42px;
  border: none;
  font-size:16px;
  padding-left: 3px;
  /* float: left; */
}

.keyboard-output > svg{
  width: 24px;
  height: 42px;
  color: rgb(201, 201, 201);
  position: absolute;
  right: 48px;
  top: 3px;
}

@-webkit-keyframes van-circular {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40;
  }
  to {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120;
  }
}
@keyframes van-circular {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40;
  }
  to {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120;
  }
}

.keyboard-output > svg circle{
    stroke: currentColor;
    stroke-width: 3;
    stroke-linecap: round;
    -webkit-animation: van-circular 1.5s ease-in-out infinite;
    animation: van-circular 1.5s ease-in-out infinite;
}

.keyboard-output > a{
  display: block;
  text-decoration: none;
  line-height: 42px;
  width: 42px;
  text-align: center;
  background-color: #fff;
  color: #2e7bfd;
  font-size: 15px;
  position: absolute;
  right: 2px;
  top: 3px;
}

.keyboard-panel-letter {
  width: calc(100% - 4px);
  padding: 2px;
}

.keyboard-panel .letter-row {
  margin-top: 10px;
  height: 42px;
  width: 100%;
}

.keyboard-panel-letter .letter-row:nth-child(3) li:first-child {
  width: calc(3 * (100vw - 49px) / 20);
  background-color: #adafbc;
}

.keyboard-panel-letter .letter-row:nth-child(3) li:last-child {
  width: calc(3 * (100vw - 49px) / 20);
  background-color: #adafbc;
}

.keyboard-panel-letter .letter-row:nth-child(4) li:first-child {
  width: calc((100vw - 29px) / 4);
  font-size: 15px;
  background-color: #adafbc;
}

.keyboard-panel-letter .letter-row:nth-child(4) li:last-child {
  width: calc((100vw - 29px) / 4);
  font-size: 15px;
  background-color: #adafbc;
}

.keyboard-panel-letter .letter-row:nth-child(4) li:nth-child(2) {
  width: calc((100vw - 49px) / 10);
  font-size: 15px;
  background-color: #adafbc;
}

.keyboard-panel-letter .letter-row:nth-child(4) li:nth-child(3) {
  width: calc(2 * (100vw - 49px) / 5 + 15px);
  font-size: 15px;
  /* background-color: #adafbc */
}

.keyboard-panel-letter ul {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}

.keyboard-panel-default {
  padding: 2px;
  float: left;
}

.keyboard-panel ul {
  margin: 0;
  padding: 0;
  float: left;
}

.keyboard-panel ul li {
  list-style: none;
  height: 42px;
  line-height: 42px;
  text-align: center;
  float: left;
  border-radius: 5px;
  -moz-user-select: none;
  -webkit-user-select: none;
  font-size: 18px;
  color: #0d0d0d;
}

.keyboard-panel-letter ul li {
  width: calc((100vw - 49px) / 10);
  margin-right: 5px;
  background-color: #fff;
  box-shadow: 0px 1px 3px #85898d;
}

.keyboard-panel-letter ul li:last-child {
  margin-right: 0;
}

.keyboard-panel-default ul li {
  width: calc((100vw - 29px) / 6);
  margin-top: 10px;
  margin-right: 5px;
}

.keyboard-default-symbol {
  width: calc((100vw - 14px) / 3);
  margin-top: 10px;
  margin-right: 5px;
  float: left;
}

.keyboard-default-symbol > ul {
  height: 146px;
  overflow-y: scroll;
  background-color: #adafbc;
  border-radius: 5px;
}

.keyboard-default-symbol ul li:nth-child(2n) {
  margin-right: 0;
}

.keyboard-default-symbol > ul li:nth-child(1) {
  margin-top: 0;
}

.keyboard-default-symbol > ul li:nth-child(2) {
  margin-top: 0;
}

.keyboard-panel li img {
  margin-top: 21px;
  transform: translateY(-50%);
  max-height: 42px;
}

.keyboard-default-symbol-bottom ul li {
  background-color: #adafbc;
  font-size: 15px;
}

.keyboard-default-num {
  width: calc((100vw + 1px) / 2);
  float: left;
}

.keyboard-default-num ul li {
  background-color: #fff;
}

.keyboard-default-num ul li:nth-child(10) {
  width: calc((100vw - 14px) / 3);
}

.keyboard-default-right {
  width: calc((100vw - 29px) / 6);
  float: left;
}

.keyboard-default-right ul li {
  background-color: #adafbc;
}

.keyboard-symbol-left{
  width: calc((500vw - 25px) / 6);
      margin-top: 10px;
    margin-right: 5px;
  float: left;
}

.keyboard-symbol-left > ul{
    height: 146px;
    overflow-y: scroll;
    background-color: #adafbc;
    border-radius: 5px;
    background-color: #fff;
}

.keyboard-panel-symbol{
  padding: 2px;
  float: left;
}

.keyboard-panel-symbol ul li{
  width: calc((100vw - 29px) / 6);
  margin-top: 10px;
  margin-right: 5px;
}

.keyboard-symbol-left ul li:nth-child(5n){
  margin-right:0;
}

.keyboard-symbol-left .keyboard-default-symbol-bottom ul li:nth-child(3){
  width: calc((100vw - 9px) / 2);
  margin-right: 0;
  background-color: #fff;
}

.keyboard-func {
  padding: 15px 20px 0 20px;
  width: calc(100vw - 40px);
  float: left;
}

.keyboard-func-icon:first-child{
  float: left;
}

.keyboard-func-icon:last-child{
  float: right;
}

.keyboard-func img {
  height: 36px;
}

.keyboard-func-icon:last-child img{
  height: 28px;
  margin-top: 4px;
}

.keyboard-write{
  width: calc(100vw - 4px);
  float: left;
  padding: 2px;
}

.keyboard-write canvas{
  background-color: #eee;
  border-radius: 5px;
  float: left;
}

.keyboard-write-button{
  float: right;
  width: 50px;
}

.keyboard-write-button ul{
  margin: 0;
  padding: 0;
}

.keyboard-write-button ul li{
  list-style: none;
  float: left;
  width: 100%;
  height: 42px;
  text-align: center;
  line-height: 42px;
  margin-top: 5px;
  background-color: #adafbc;
  border-radius: 5px;
  font-size: 14px;
}

.keyboard-write-button ul li:nth-child(1){
  margin-top: 0;
}

.keyboard-write-button ul li:nth-child(3){
  height: 114px;
  line-height: 114px;
}
</style>

<style>
.keyboard textarea{
  display: none !important;
}
.mathview textarea{
  display: none !important;
}

.mathview .mq-cursor{
  display: none !important;
}
.keyboard-output .mq-root-block{
  margin-top: 21px;
  transform: translateY(-50%);
}

.a{
  color:#bababa
}
</style>