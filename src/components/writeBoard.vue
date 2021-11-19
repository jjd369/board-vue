<template>
  <div>
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
          :on-change="uploadFile"
          class="upload-demo"
          name="attachment"
          action="#"
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
      fileList: [],
      file: null,
    }
  },
  computed: {
    ...mapState('auth', ['current_user']),
  },
  methods: {
    async writeBoard() {
      const formData = new FormData()
      // body에 넣을 formData 설정
      if (this.file) {
        formData.append('attachment', this.file.raw, this.file.name)
      }
      formData.append('name', this.current_user.name)
      formData.append('email', this.current_user.email)
      formData.append('title', this.title)
      formData.append('content', this.content)

      await insertBoard(formData)

      this.$router.push({ name: 'boardList' })
    },
    uploadFile(file) {
      this.file = file
    },
  },
}
</script>

<style></style>
