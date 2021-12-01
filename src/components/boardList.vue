<template>
  <div>
    <h1 class="cardTitle">게시물</h1>
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
        <el-table-column prop="title" label="title"></el-table-column>
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
    <PageWrap :totalPage="totalPage"></PageWrap>
    <div class="btnWrap">
      <el-button @click="$router.push({ name: 'write' })"> 글쓰기 </el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getAllBoard, insertBoard } from '@/apis/board'
import PageWrap from '@/components/pageNavi'
export default {
  components: {
    PageWrap,
  },
  data() {
    return {
      content: '',
      title: '',
      lists: [],
      totalPage: 0,
      multipleSelection: [],
    }
  },
  computed: {
    ...mapState('auth', ['current_user']),
    c_page() {
      return this.$route.query.page
    },
  },
  watch: {
    c_page() {
      this.fetchAllBoard()
    },
  },
  methods: {
    async fetchAllBoard() {
      this.$store.dispatch('common/getLoading', true)

      const { data } = await getAllBoard({
        page: this.c_page,
        listNum: 4,
      })
      this.lists = data.lists
      this.totalPage = data.totalPage
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
