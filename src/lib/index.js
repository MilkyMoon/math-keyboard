import 'mathquill/build/mathquill.css'
import MathKeyboard from './keyboard.vue' // 导入组件
import MathRender from './render.vue'
const mathkeyboard = {
    install (Vue, options) {
        Vue.component(MathKeyboard.name, MathKeyboard)  // vuePayKeyboard.name 组件的name属性
        Vue.component(MathRender.name, MathRender) 
       // 类似通过 this.$xxx 方式调用插件的 其实只是挂载到原型上而已
       // Vue.prototype.$xxx  // 最终可以在任何地方通过 this.$xxx 调用
       // 虽然没有明确规定用$开头  但是大家都默认遵守这个规定
    }
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(mathkeyboard);
}

export default mathkeyboard // 导出..