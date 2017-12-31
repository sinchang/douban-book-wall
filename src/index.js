import Vue from 'vue'
import App from './components/App.vue'
import VueJsonp from 'vue-jsonp'
import '../node_modules/bulma/css/bulma.css'

Vue.use(VueJsonp, 5000)

new Vue({
  el: '#app',
  render: h => h(App)
})
