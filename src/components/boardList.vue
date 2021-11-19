<template>
  <div>
    <h1>게시물물</h1>
    <div class="listWrap">
      <el-table
        ref="multipleTable"
        :data="lists"
        style="width: 100%"
        height="250"
        @current-change="handleSelectionChange"
        @select="hadelSelectionCheck"
      >
        <el-table-column prop="uploadedBy.name" label="name"></el-table-column>
        <el-table-column prop="title" label="title"> </el-table-column>
        <el-table-column label="file">
          <template slot-scope="scope">
            <div v-if="!!scope.row.attachment">
              <i class="el-icon-folder"></i>
              <span style="margin-left: 10px">{{
                scope.row.attachment.originalFileName
              }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="btnWrap">
      <el-button @click="$router.push({ name: 'write' })"> 글쓰기 </el-button>
    </div>
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
      multipleSelection: [],
    }
  },
  computed: {
    ...mapState('auth', ['current_user']),
  },
  methods: {
    async fetchAllBoard() {
      this.$store.dispatch('common/getLoading', true)

      const { data } = await getAllBoard()
      this.lists = data
      this.$store.dispatch('common/getLoading', false)
    },
    async writeBoard() {
      await insertBoard({
        title: this.title,
        content: this.content,
        user: this.current_user,
      })
    },
    handleSelectionChange(val) {
      this.$router.push({ name: 'board', params: { id: val._id } })
    },
    hadelSelectionCheck(val) {
      console.log(val)
      this.multipleSelection = val
    },
  },
  mounted() {
    this.fetchAllBoard()
  },
}
</script>

<style></style>
