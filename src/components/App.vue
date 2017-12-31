<template>
  <div id="app">
    <hexo></hexo>
    <div class="container">
      <div class="field has-addons has-addons-centered">
        <div class="control">
          <input class="input" type="text" placeholder="请输入豆瓣图书地址" v-model="bookUrl"/>
        </div>
        <div class="control">
          <a class="button is-primary" @click="search">Search</a>
        </div>
      </div>
    </div>
    <div class="container">
      <div ref="container">
        <div class="columns is-gapless">
          <div class="column is-2" v-for="book in books" :key="book.id">
            <book :book="book" @delete="handleDelete"></book>
          </div>
        </div>
      </div>
    </div>
    <a class="button is-primary create-btn"
      @click="create"
      v-if="books.length"
      ref="create"
      :href="imageUrl"
      download="doubanBook">{{btnText}}</a>
  </div>
</template>

<script>
  import Hexo from './Hexo.vue'
  import Book from './Book.vue'
  import domtoimage from 'dom-to-image'

  export default {
    name: 'app',
    data() {
      return {
        bookUrl: null,
        imageUrl: null,
        btnText: '生成图片',
        books: []
      }
    },
    methods: {
      search() {
        if (!this.bookUrl || this.bookUrl.indexOf('https://book.douban.com/subject') === -1) {
          alert('请输入豆瓣图书地址')
          return
        }

        const bookId = this.getBookId(this.bookUrl)

        this.$jsonp(`https://api.douban.com/v2/book/${bookId}`)
          .then(res => {
            this.books.push({
              title: res.title,
              image: res.images.large,
              id: res.id
            })
            this.clear()
            this.bookUrl = ''
          }).catch(() => {
            alert('获取图书信息失败，请检查图书地址是否准确')
          })
      },
      getBookId(url) {
        return /^https:\/\/book\.douban\.com\/subject\/(\d+)/.exec(url)[1]
      },
      handleDelete(book) {
        this.clear()
        this.books.splice(this.books.indexOf(book), 1)
      },
      clear() {
        this.imageUrl = null
        this.btnText = '生成图片'
      },
      create() {
        domtoimage.toPng(this.$refs.container)
          .then(dataUrl => {
            this.imageUrl = dataUrl
            this.btnText = '下载'
          }).catch(() => {
            alert('生成图片失败')
          })
      }
    },
    components: {
      Hexo,
      Book
    }
  }
</script>

<style>
  img {
    vertical-align: middle;
  }

  #app {
    text-align: center;
  }

  .columns {
    flex-wrap: wrap;
  }

  .container {
    margin-top: 20px;
  }

  .create-btn {
    margin: 20px auto;
  }
</style>

