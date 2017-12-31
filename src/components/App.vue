<template>
  <div id="app">
    <hexo></hexo>
    <github-badge slug="sinchang/douban-book-wall" />
    <div class="container">
      <div class="field has-addons has-addons-centered">
        <p class="control">
          <span class="select">
            <select v-model="type" @change="handleTypeChange">
              <option value="0">按年份</option>
              <option value="1">自行添加</option>
            </select>
          </span>
        </p>
        <div class="control">
          <input class="input" type="text" placeholder="请输入你的豆瓣 ID" v-model="userId" v-if="type == 0"/>
          <input class="input" type="text" placeholder="请输入豆瓣图书的 URL" v-model="bookUrl" v-else />
        </div>
        <div class="control">
          <a class="button is-primary" @click="search">Search</a>
        </div>
      </div>
    </div>
    <div class="container">
      <p class="control has-text-centered create-btn" v-if="years.length">
        <span class="select">
          <select v-model="year" @change="handleYearChange">
            <option :value="item" v-for="(item, index) in years" :key="index">{{item}}</option>
          </select>
        </span>
      </p>
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
  import GitHubBadge from 'vue-github-badge'
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
        books: [],
        years: [],
        allBooks: {},
        type: 0,
        year: null,
        userId: ''
      }
    },
    methods: {
      search() {
        this.allBooks = {}
        this.books = []
        if (this.type == 0) {
          if (!this.userId) {
            alert('请输入您的豆瓣 ID')
            return
          }
          this.fetchBooks(0)
            .then(async res => {
              const skip = Math.floor(res.total / 100)
              console.log(skip)
              if (skip !== 0) {
                for (let i = 1; i < skip + 1; i++) {
                  await this.fetchBooks(i * 100)
                }
              }
              this.years = Object.keys(this.allBooks)
              this.year = this.years[0]
              this.books = this.allBooks[this.year]
            })
          return
        }

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
      fetchBooks(start = 0) {
        return this.$jsonp(`https://api.douban.com/v2/book/user/${this.userId}/collections?status=read&count=100&start=${start}`)
          .then(res => {
            const collections = res.collections
            collections.forEach(collection => {
              const year = new Date(collection.updated).getFullYear()
              console.log(this.allBooks[year])
              if (this.allBooks[year] === undefined) {
                this.allBooks[year] = []
              }

              this.allBooks[year].push({
                id: collection.id,
                title: collection.book.title,
                image: collection.book.images.large
              })
            })
            return Promise.resolve(res)
          }).catch(err => {
            return Promise.reject(err)
          })
      },
      handleDelete(book) {
        this.clear()
        this.books.splice(this.books.indexOf(book), 1)
      },
      handleYearChange() {
        if (!this.year) return
        this.clear()
        this.books = this.allBooks[this.year]
      },
      handleTypeChange() {
        this.years = []
        this.year = null
        this.books = []
        this.allBooks = {}
        this.userId = ''
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
      Book,
      'github-badge': GitHubBadge
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

