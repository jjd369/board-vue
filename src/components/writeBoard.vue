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
        <!-- <el-upload
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
        </el-upload> -->
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
        <el-button
          @click="$router.push({ name: 'boardList', query: { page: 1 } })"
          >목록</el-button
        >
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
      files: [],
    }
  },
  computed: {
    ...mapState('auth', ['current_user']),
    // c_file_name() {
    //   if (!this.file) return ''
    //   return this.fil
    // },
  },
  methods: {
    async writeBoard() {
      this.$store.dispatch('common/getLoading', true)
      const formData = new FormData()
      // body에 넣을 formData 설정
      this.files.forEach((file) => {
        formData.append('attachment', file)
        console.log(file)
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
    handleFileUpload() {
      this.$refs.file.click()
    },
    previewImage(e) {
      if (e.target.files.length > 3) {
        return this.$message({
          type: 'info',
          message: '첨부 파일 최대 개수는 3개 입니다.',
          showClose: true,
        })
      }
      this.files = [...e.target.files]
    },
    deleteFileList(index) {
      this.files.splice(index, 1)
    },
  },
}
</script>

<style lang="scss">
.fileListWrap {
  margin-top: 10px;
  .fileList {
    i {
      margin-right: 5px;
      cursor: pointer;
    }
    padding: 5px;
  }
}
</style>
