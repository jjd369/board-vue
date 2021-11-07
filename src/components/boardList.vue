<template>
  <div>
    <el-card>
      <h1>게시물물</h1>
      <div class="listWrap">
        <el-table
          :data="lists"
          style="width: 100%"
          height="250"
          @current-change="handleSelectionChange"
        >
          <el-table-column prop="user" label="user"> </el-table-column>
          <el-table-column prop="title" label="title"> </el-table-column>
          <el-table-column prop="file" label="file"> </el-table-column>
        </el-table>
        <!-- <div>
            <span>작성자</span>
            <span>제목</span>
            <span>첨부파일</span>
            <span><input type="file" name="sampleFile" /></span>
          </div>
          <div v-for="(list, index) in lists" :key="index">
            <span>{{ list.user }}</span>
            <span>{{ list.title }}</span>
            <span>{{ list.file }}</span>
          </div> -->
      </div>
      <div class="btnWrap">
        <el-button @click="$router.push({ name: 'write' })"> 글쓰기 </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getAllBoard, insertBoard } from '@/apis/board'

export default {
  data() {
    return {
      content: '',
      title: '',
      lists: [],
    }
  },
  computed: {
    ...mapState('auth', ['current_user']),
  },
  methods: {
    async fetchAllBoard() {
      const { data } = await getAllBoard()
      this.lists = data
    },
    async writeBoard() {
      await insertBoard({
        title: this.title,
        content: this.content,
        user: this.current_user,
      })
    },
    handleSelectionChange(val) {
      this.$router.push({ name: 'board', query: { id: val._id } })
    },
  },
  mounted() {
    this.fetchAllBoard()
  },
}
</script>

<style></style>
