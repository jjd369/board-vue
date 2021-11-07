<template>
  <div>
    <el-card>
      <div class="titleWrap"
        ><h2>{{ board.title }}</h2></div
      >
      <div class="contentWrap"
        ><p>{{ board.content }}</p></div
      >
    </el-card>
  </div>
</template>

<script>
import { getBoard } from '@/apis/board'
export default {
  data() {
    return {
      board: {},
    }
  },
  methods: {
    async fecthBoard() {
      const { data } = await getBoard(this.$route.params.id)
      this.board = data
    },
  },
  mounted() {
    this.fecthBoard()
  },
}
</script>

<style></style>
