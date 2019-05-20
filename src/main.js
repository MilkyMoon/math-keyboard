import Vue from 'vue'
import App from './App.vue'
import MathKeyboard from './lib/index.js'
Vue.use(MathKeyboard)

new Vue({
  el: '#app',
  render: h => h(App)
})
