<template>
  <div class="book">
    <img :src="book.image" alt="" referrerpolicy ="never">
    <div class="meta">
      <h6 class="title">{{book.title}}</h6>
      <a href="javascript:;" class="delete-btn" @click="handleDelete(book)">Delete</a>
      <a :href="book.url" target="_blank">Douban Link</a>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      book: {
        type: Object,
        required: true
      }
    },
    name: 'book',
    methods: {
      handleDelete(book) {
        this.$emit('delete', book)
      }
    }
  }

</script>

<style scoped>
  .book {
    position: relative;
  }

  .book:hover .meta {
    display: block;
  }

  .meta {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding-top: 80px;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .6);
  }

  .meta .title {
    color:#fff;
    font-size: 1.2rem;
  }

  .meta .delete-btn {
    display: block;
  }
</style>

