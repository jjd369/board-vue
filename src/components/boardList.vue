<template>
  <div>
    <h1 class="cardTitle">게시물</h1>
    <div class="listWrap">
      <div class="listheader"
        ><span class="author">author</span>
        <span class="title">title</span>
        <span class="attachment">file</span>
        <span class="date">date</span>
        <span class="view">views</span></div
      >
      <ul class="listBody">
        <li
          class="listContent"
          v-for="(list, index) in this.lists"
          :key="index"
          @click="handleSelectionChange(list)"
        >
          <span class="author">{{ list.uploadedBy.name }}</span>
          <span class="title">{{ list.title }}</span>
          <span class="attachment"
            ><i v-if="list.attachment.length" class="el-icon-folder"></i
          ></span>
          <span class="date">{{ calculateDate(list.createdAt) }}</span>
          <span class="view">{{ list.view }}</span>
        </li>
      </ul>
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
    calculateDate(date) {
      console.log(date)
      const createDate = new Date(date)
      const year = createDate.getFullYear()
      const month = createDate.getMonth()
      const day = createDate.getDay()
      return `${year}-${month}-${day}`
    },
  },
  mounted() {
    this.fetchAllBoard()
  },
}
</script>

<style lang="scss">
.listheader,
.listContent {
  display: flex;
  border-bottom: 1px solid #eee;
  span {
    padding: 10px 0;
  }
  .author {
    min-width: 90px;
  }
  .title {
    min-width: 220px;
  }
  .attachment {
    min-width: 40px;
  }
  .date {
    min-width: 100px;
  }
  .view {
    min-width: 40px;
  }
}
.listContent {
  cursor: pointer;
}
</style>
