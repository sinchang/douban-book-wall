<template>
  <div>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            豆瓣图书墙
            <span class="icon" @click="isActive = true">
              <i class="fa fa-info-circle"></i>
            </span>
          </h1>
        </div>
      </div>
    </section>
    <div :class="{ modal: true, 'is-active': isActive }">
      <div class="modal-background"></div>
      <div class="modal-content">
        <p>1、豆瓣 ID 指的是 https://www.douban.com/people/sinchangwen 中的 sinchangwen</p>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="isActive = false"></button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'hexo',
    data() {
      return {
        isActive: false
      }
    }
  }
</script>

<style scoped>
  .icon {
    font-size: 1rem;
    cursor: pointer;
  }

  .modal {
    z-index: 10000;
  }

  .modal-content {
    color: #fff;
    text-align: left;
  }
</style>

