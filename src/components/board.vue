<template>
  <div class="boradWrap">
    <template v-if="!board_modify">
      <div class="listWrap">
        <el-button
          @click="$router.push({ name: 'boardList' })"
          icon="el-icon-s-fold"
          size="mini"
        >
          목록
        </el-button>
      </div>
      <div class="titleWrap"
        ><h2>{{ board.title }}</h2></div
      >
      <div class="contentWrap"
        ><p>{{ board.content }}</p></div
      >
      <div v-if="!!board.attachment" class="attachmentWrap"
        ><el-button
          type="text"
          size="mini"
          icon="el-icon-folder"
          @click="fileDownload()"
          >{{ board.attachment.originalFileName }}</el-button
        ></div
      >
      <div v-if="current_user.email === board.uploadedBy.email" class="btnWrap">
        <el-button @click="board_modify = true"> 수정 </el-button>
        <el-button @click="deleteBoard()"> 삭제 </el-button>
      </div>
      <div class="line"></div>
      <Comment :comments="comments" @callFecthBoard="fecthBoard"></Comment>
    </template>
    <!-- 보드 수정 -->
    <template v-else>
      <div class="inputWrap">
        <p>제목</p>
        <el-input placeholder="title" v-model="board.title" clearable>
        </el-input>
      </div>
      <div class="inputWrap">
        <p>내용</p>
        <el-input placeholder="content" v-model="board.content" clearable>
        </el-input>
      </div>
      <div class="inputWrap">
        <p>첨부 파일</p>
        <el-upload
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
      <div class="btnWrap">
        <el-button @click="updateBoard()">저장</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import { getBoard, deleteBoard, updateBoard } from '@/apis/board'
// import { downloadFile } from '@/apis/file'
import { mapState } from 'vuex'
import map from 'lodash/map'
import Comment from '@/components/comment'
export default {
  components: { Comment },
  data() {
    return {
      board: {
        attachment: {},
      },
      comments: [],
      board_modify: false,
      visible: false,
      replay_visible: false,
      file: null,
    }
  },
  computed: {
    ...mapState('auth', ['current_user']),
  },
  methods: {
    async fecthBoard() {
      this.$store.dispatch('common/getLoading', true)
      const { data } = await getBoard(this.$route.params.id)
      this.board = data

      // 객체에 modify, reply 값 추가
      this.comments = map(this.board.comments, (el) => {
        return {
          ...el,
          modify: false,
          reply: false,
          visible: false,
          comments: map(el.comments, (reply) => {
            return { ...reply, modify: false }
          }),
        }
      })

      this.$store.dispatch('common/getLoading', false)
    },
    async deleteBoard() {
      await deleteBoard({ id: this.$route.params.id })
        .then(() => {
          this.$message({
            showClose: true,
            message: '글이 삭제되었습니다.',
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
    },
    async updateBoard() {
      const formData = new FormData()
      formData.append('_id', this.board._id)
      formData.append('title', this.board.title)
      formData.append('content', this.board.content)
      formData.append('email', this.board.uploadedBy.email)
      if (this.file) {
        formData.append('attachment', this.file.raw, this.file.name)
      }
      if (this.board.attachment) {
        formData.append('attachment_id', this.board.attachment._id)
      }
      await updateBoard(formData)

      this.board_modify = false
      this.fecthBoard()
    },
    async fileDownload() {
      window.open(
        `http://localhost:3000/api/file/${this.board.attachment.serverFileName}/${this.board.attachment.originalFileName}`
      )
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
  mounted() {
    this.fecthBoard()
  },
}
</script>
<style lang="scss">
.listWrap {
  display: flex;
}
.attachmentWrap {
  margin-bottom: 10px;
}
</style>
