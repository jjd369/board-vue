<template>
  <div>
    <h1 class="cardTitle">글쓰기</h1>
    <form>
      <div class="inputWrap">
        <p>제목</p>
        <el-input placeholder="title" v-model="title" clearable> </el-input>
      </div>
      <div class="inputWrap">
        <p>내용</p>
        <el-input placeholder="content" v-model="content" clearable> </el-input>
      </div>
      <div class="inputWrap">
        <p>첨부 파일</p>
        <el-upload
          :limit="1"
          :on-change="uploadFile"
          class="upload-demo"
          name="attachment"
          action="#"
          :on-exceed="handleExceed"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary"
            >select file</el-button
          >
          <div class="el-upload__tip" slot="tip"
            >jpg/png files with a size less than 500kb</div
          >
        </el-upload>
      </div>
      <div>
        <el-button @click="$router.push({ name: 'boardList' })">목록</el-button>
        <el-button @click="writeBoard()">삽입</el-button>
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
      file: null,
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
      if (this.file) {
        formData.append('attachment', this.file.raw, this.file.name)
      }
      formData.append('name', this.current_user.name)
      formData.append('email', this.current_user.email)
      formData.append('title', this.title)
      formData.append('content', this.content)

      insertBoard(formData)
        .then(() => {
          this.$message({
            showClose: true,
            message: '글 작성 완료.',
            tpye: 'success',
          })
          this.$router.push({ name: 'boardList', query: { page: 1 } })
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
    uploadFile(file) {
      this.file = file
    },
    handleExceed() {
      this.$message.warning({
        type: 'warning',
        message: '첨부파일은 1개만 가능합니다.',
        showClose: 'true',
      })
    },
  },
}
</script>

<style></style>
