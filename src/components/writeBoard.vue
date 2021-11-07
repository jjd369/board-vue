<template>
  <div>
    <el-card>
      <form>
        <div class="inputWrap">
          <p>제목</p>
          <el-input placeholder="title" v-model="title" clearable> </el-input>
        </div>
        <div class="inputWrap">
          <p>내용</p>
          <el-input placeholder="content" v-model="content" clearable>
          </el-input>
        </div>
        <div class="inputWrap">
          <p>첨부 파일</p>
          <el-upload
            class="upload-demo"
            ref="upload"
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
          <el-button @click="$router.push({ name: 'board' })">목록</el-button>
          <el-button @click="writeBoard()">삽입</el-button>
        </div>
      </form>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { insertBoard } from '@/apis/board'
export default {
  data() {
    return {
      title: '',
      content: '',
      fileList: [],
    }
  },
  computed: {
    ...mapState('auth', ['current_user']),
  },
  methods: {
    async writeBoard() {
      await insertBoard({
        name: this.current_user,
        title: this.title,
        content: this.content,
      })
      this.$router.push({ name: 'boardList' })
    },

    submitUpload() {
      this.$refs.upload.submit()
    },
  },
}
</script>

<style></style>
