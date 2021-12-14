<template>
  <div class="pageWrap">
    <template v-for="pageNum in totalPage">
      <el-button size="mini" round :key="pageNum" @click="MovePage(pageNum)">{{
        pageNum
      }}</el-button>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    totalPage: {
      default: 0,
      type: Number,
    },
  },
  methods: {
    MovePage(num) {
      this.$emit('pageMove', num)
    },
  },
}
</script>

<style lang="scss">
.pageWrap {
  padding: 10px;
}
</style>
