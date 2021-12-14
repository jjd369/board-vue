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
      <div class="listBody">
        <ul v-if="this.lists.length" class="listBody">
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
        <div v-else class="listBodyEmpty">
          <span v-if="search || search_author">검색 된</span>
          <span> 게시물이 없습니다.</span>
        </div>
      </div>
    </div>
    <SearchWrap @search="searchBoard"></SearchWrap>
    <PageWrap :totalPage="total_page" @pageMove="pageMove"></PageWrap>
    <div class="btnWrap">
      <el-button size="mini" @click="$router.push({ name: 'write' })">
        글쓰기
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getAllBoard } from '@/apis/board'
import PageWrap from '@/components/pageNavi'
import SearchWrap from '@/components/boardSearch'

export default {
  components: {
    PageWrap,
    SearchWrap,
  },
  data() {
    return {
      content: '',
      title: '',
      lists: [],
      total_page: 0,
      page: 1,
      search: '',
      search_author: '',
    }
  },
  computed: {
    ...mapState('auth', ['current_user']),
  },
  watch: {
    page() {
      this.fetchAllBoard()
    },
    search(newVal) {
      if (!newVal) return
      this.fetchAllBoard()
      this.search = ''
    },
    search_author(newVal) {
      if (!newVal) return
      this.fetchAllBoard()
      this.search_author = ''
    },
  },
  methods: {
    async fetchAllBoard() {
      this.$store.dispatch('common/getLoading', true)
      try {
        const { data } = await getAllBoard({
          page: this.page,
          listNum: 5,
          search: this.search,
          searchAuthor: this.search_author,
        })
        this.lists = data.lists
        this.total_page = data.totalPage
      } finally {
        this.$store.dispatch('common/getLoading', false)
      }
    },
    handleSelectionChange(val) {
      this.$router.push({ name: 'board', params: { id: val._id } })
    },
    calculateDate(time) {
      const createDate = new Date(time)
      const year = createDate.getFullYear()
      const month = (createDate.getMonth() + 1).toString().padStart(2, '0')
      const date = createDate.getDate().toString().padStart(2, '0')
      return `${year}-${month}-${date}`
    },
    pageMove(num) {
      this.page = num
    },
    searchBoard({ type, message }) {
      type === 'search_author'
        ? (this.search_author = message)
        : (this.search = message)
    },
  },
  mounted() {
    this.fetchAllBoard()
  },
}
</script>

<style lang="scss"></style>
