<template>
  <div>
    <h1 class="cardTitle">글쓰기</h1>
    <form>
      <div class="inputWrap">
        <p>제목</p>
        <el-input size="small" placeholder="title" v-model="title" clearable>
        </el-input>
      </div>
      <div class="inputWrap">
        <p>내용</p>
        <el-input
          size="small"
          placeholder="content"
          v-model="content"
          clearable
        >
        </el-input>
      </div>
      <div class="inputWrap">
        <p>첨부 파일</p>
        <el-button
          native-type="button"
          round
          icon="el-icon-document-add"
          size="mini"
          @click="handleFileUpload"
        ></el-button>
        <input
          type="file"
          id="userImage"
          ref="file"
          @change="previewImage"
          multiple
        />
        <transition name="slide-fade">
          <ul v-if="files.length" class="fileListWrap">
            <li
              class="fileList"
              v-for="(file, index) in this.files"
              :key="index"
            >
              <span @click="deleteFileList(index)"
                ><i class="el-icon-circle-close"></i></span
              >{{ file.name }}
            </li>
          </ul>
        </transition>
      </div>
      <div>
        <el-button size="mini" @click="$router.push({ name: 'boardList' })"
          >목록</el-button
        >
        <el-button size="mini" @click="writeBoard()">글쓰기</el-button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { insertBoard } from '@/apis/board'
// import axios from 'axios'
export default {
  data() {
    return {
      title: '',
      content: '',
      files: [],
    }
  },
  computed: {
    ...mapState('auth', ['current_user']),
  },
  methods: {
    async writeBoard() {
      this.$store.dispatch('common/getLoading', true)
      const formData = new FormData()
      // body에 넣을 formData 설정
      this.files.forEach((file) => {
        formData.append('attachment', file)
      })

      formData.append('title', this.title)
      formData.append('content', this.content)

      insertBoard(formData)
        .then(() => {
          this.$message({
            showClose: true,
            message: '글 작성 완료.',
            tpye: 'success',
          })
          this.$router.push({ name: 'boardList' })
        })
        .catch((err) => {
          this.$message({
            showClose: true,
            message: err.response.data.errors.message,
            tpye: 'error',
          })
        })
        .finally(() => {
          this.$store.dispatch('common/getLoading', false)
        })
    },
    handleFileUpload() {
      this.$refs.file.click()
    },
    previewImage(e) {
      const filesMaxCount = 3
      const filesCount = e.target.files.length + this.files.length
      if (filesMaxCount < filesCount) {
        return this.$message({
          type: 'info',
          message: '첨부 파일 최대 개수는 3개 입니다.',
          showClose: true,
        })
      }
      this.files = [...this.files, ...e.target.files]
      console.log(this.files[0].File)
    },
    deleteFileList(index) {
      this.files.splice(index, 1)
    },
  },
}
</script>
