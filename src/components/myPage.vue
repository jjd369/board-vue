<template>
  <div class="myPageWrap">
    <h1 class="cardTitle">마이 페이지</h1>
    <template>
      <div slot="header" class="header">
        <!-- 프로필 수정 안 할 때 -->
        <div v-if="!modify" class="imgWrap">
          <!-- 기존 프로필 없을 때 -->
          <i v-if="!current_user.image" class="el-icon-user"></i>
          <!-- 기존 프로필 있을 때 -->
          <img v-else :src="current_user.image" alt="프로필사진" />
        </div>
        <!-- 프로필 수정 할 때 -->
        <div v-else class="imgWrap">
          <!-- 프로필 사진 업로드 안 할 때 -->
          <template v-if="!c_user_image_url">
            <i v-if="!current_user.image" class="el-icon-user"></i>
            <img v-else :src="current_user.image" alt="프로필사진" />
          </template>
          <!-- 프로필 사진 업로드 할 때 -->
          <template v-else>
            <img :src="c_user_image_url" alt="프로필사진" />
          </template>
        </div>
        <div v-if="modify" class="btnWrap">
          <el-button
            native-type="button"
            round
            icon="el-icon-edit"
            size="mini"
            @click="handleFileUpload"
          ></el-button>
          <input type="file" id="userImage" ref="file" @change="previewImage" />
        </div>
        <div>
          <div v-if="!modify">{{ current_user.name }}</div>
          <div v-else
            ><el-input
              type="text"
              v-model="current_user.name"
              size="small"
            ></el-input
          ></div>
        </div>
      </div>
      <div class="list"> 이메일 : {{ current_user.email }} </div>
      <div class="list">
        가입일 : {{ createAtTime(current_user.createdAt) }}
      </div>
      <div v-if="!modify" class="btnWrap">
        <el-button size="mini" @click="modify = true"> 수정</el-button>
      </div>
      <div v-else class="btnWarp">
        <el-button size="mini" @click="cancelModfy()">취소</el-button>
        <el-button size="mini" @click="callUpdateUser()">저장</el-button>
      </div>
      <div class="myBoardWrap">
        <h1 class="cardTitle">나의 게시글</h1>
        <div class="btnWrap">
          <el-button
            size="mini"
            icon="el-icon-circle-check"
            @click="handleAllCheckBox"
            >전체선택</el-button
          >
          <el-button size="mini" icon="el-icon-delete" @click="deleteBoard">
            삭제
          </el-button>
          <el-button size="mini" @click="$router.push({ name: 'write' })">
            글쓰기
          </el-button>
        </div>
        <div class="listWrap">
          <div class="listheader"
            ><span class="select">select</span>
            <span class="title">title</span>
            <span class="attachment">file</span>
            <span class="date">date</span>
            <span class="view">views</span></div
          >
          <div class="listBody">
            <ul v-if="this.lists.length" class="listBody">
              <li
                class="listContent"
                v-for="(list, index) in lists"
                :key="index"
              >
                <span class="author"
                  ><input v-model="checked" :value="list._id" type="checkbox"
                /></span>
                <span class="title">{{ list.title }}</span>
                <span class="attachment"
                  ><i v-if="list.attachment.length" class="el-icon-folder"></i
                ></span>
                <span class="date">{{ calculateDate(list.createdAt) }}</span>
                <span class="view">{{ list.view }}</span>
              </li>
            </ul>
            <div v-else class="listBodyEmpty">
              <span v-if="search">검색 된</span>
              <span> 게시물이 없습니다.</span>
            </div>
          </div>
        </div>
        <SearchWrap @search="searchBoard"></SearchWrap>
        <PageWrap :totalPage="total_page" @pageMove="pageMove"></PageWrap>
      </div>
    </template>
  </div>
</template>

<script>
import { updateUser } from '@/apis/users'
import { mapState } from 'vuex'
import PageWrap from '@/components/pageNavi'
import SearchWrap from '@/components/boardSearch'
import { getMyBoards, deleteBoard } from '@/apis/board'
import map from 'lodash/map'

export default {
  components: {
    PageWrap,
    SearchWrap,
  },
  data() {
    return {
      modify: false,
      name: '',
      email: '',
      file: null,
      lists: [],
      total_page: 0,
      page: 1,
      search: '',
      checked: [],
    }
  },
  computed: {
    ...mapState('auth', ['current_user']),
    c_user_image_url() {
      if (!this.file) return ''
      return URL.createObjectURL(this.file)
    },
    c_lists() {
      return map(this.lists, (el) => {
        return {
          ...el,
          checked: false,
        }
      })
    },
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
  },
  methods: {
    createAtTime(date) {
      const createDate = new Date(date)
      const year = createDate.getFullYear()
      const month = createDate.getMonth()
      const day = createDate.getDay()
      return `${year}년 ${month}월 ${day}일`
    },
    handleFileUpload() {
      this.$refs.file.click()
    },
    previewImage(e) {
      this.file = e.target.files[0]
    },
    async fetchAllBoard() {
      this.$store.dispatch('common/getLoading', true)
      try {
        const { data } = await getMyBoards({
          page: this.page,
          listNum: 5,
          search: this.search,
        })
        this.lists = data.lists
        this.total_page = data.totalPage
      } finally {
        this.$store.dispatch('common/getLoading', false)
      }
    },
    async callUpdateUser() {
      this.$store.dispatch('common/getLoading', true)

      const formData = new FormData()
      // body에 넣을 formData 설정
      if (this.file) {
        formData.append('userImage', this.file)
      }
      formData.append('name', this.current_user.name)

      await updateUser(formData)
      this.$store.dispatch('auth/init')
      this.modify = false
      this.$store.dispatch('common/getLoading', false)
    },
    cancelModfy() {
      this.modify = false
      this.file = null
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
    handleAllCheckBox() {
      const total_length = this.lists.length

      if (this.checked.length === total_length) {
        return (this.checked = [])
      }

      const ids = map(this.lists, (el) => {
        return el._id
      })
      this.checked = [...ids]
    },
    async deleteBoard() {
      if (!this.lists.length) {
        return this.$message({
          type: 'info',
          message: '삭제할 게시글이 없습니다.',
        })
      }
      if (!this.checked.length) {
        return this.$message({
          type: 'info',
          message: '삭제할 게시글을 체크해주세요.',
        })
      }
      try {
        const promises = this.checked.map(async (el) => {
          await deleteBoard({ _id: el })
        })
        await Promise.all(promises)
      } catch (err) {
        console.log(err)
      } finally {
        await this.fetchAllBoard()
      }
    },
  },
  mounted() {
    this.fetchAllBoard()
  },
}
</script>

<style lang="scss">
.myBoardWrap {
  margin-top: 40px;
}
.myPageWrap {
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 25px;
    .imgWrap {
      width: 100px;
      height: 100px;
      font-size: 100px;
      margin-bottom: 10px;
    }
    .editBtn {
      width: 15px;
      height: 15px;
      font-size: 15px;
    }
  }
  .list {
    margin-bottom: 15px;
  }
}
</style>
