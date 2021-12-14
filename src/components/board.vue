<template>
  <div class="boradWrap">
    <template v-if="!board_modify.handle">
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
          v-for="file in board.attachment"
          :key="file._id"
          type="text"
          size="mini"
          icon="el-icon-folder"
          @click="fileDownload(file.serverFileName)"
          >{{ file.originalFileName }}</el-button
        ></div
      >
      <div v-if="current_user.email === board.uploadedBy.email" class="btnWrap">
        <el-button size="mini" @click="board_modify.handle = true">
          수정
        </el-button>
        <el-button size="mini" @click="deleteBoard()"> 삭제 </el-button>
      </div>
      <div class="line"></div>
      <Comment :comments="comments" @callFecthBoard="fecthBoard"></Comment>
    </template>
    <!-- 보드 수정 -->
    <template v-else>
      <h1>수정하기</h1>
      <div class="inputWrap">
        <p>제목</p>
        <el-input placeholder="title" v-model="board_modify.title" clearable>
        </el-input>
      </div>
      <div class="inputWrap">
        <p>내용</p>
        <el-input
          placeholder="content"
          v-model="board_modify.content"
          clearable
        >
        </el-input>
      </div>
      <div class="inputWrap">
        <p>기존 첨부파일 수정</p>
        <ul class="fileListWrap">
          <li
            class="fileList"
            v-for="(file, i) in this.board_modify.exist_attachment"
            :key="i"
            ><span @click="deleteExistFileList(i)"
              ><i class="el-icon-circle-close"></i></span
            >{{ file.originalFileName }}</li
          >
        </ul>
      </div>
      <div class="inputWrap">
        <p>첨부 파일 추가</p>
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
          <ul v-if="board_modify.new_attachment.length" class="fileListWrap">
            <li
              class="fileList"
              v-for="(file, index) in this.board_modify.new_attachment"
              :key="index"
            >
              <span @click="deleteFileList(index)"
                ><i class="el-icon-circle-close"></i></span
              >{{ file.name }}
            </li>
          </ul>
        </transition>
      </div>
      <div class="btnWrap">
        <el-button size="mini" @click="cancelModify()">취소</el-button>
        <el-button size="mini" @click="updateBoard()">저장</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import { getBoard, deleteBoard, updateBoard } from '@/apis/board'
import { mapState } from 'vuex'
import map from 'lodash/map'
import Comment from '@/components/comment'
export default {
  components: { Comment },
  data() {
    return {
      board: {
        attachment: [],
        uploadedBy: {
          email: '',
        },
      },
      comments: [],
      board_modify: {
        handle: false,
        title: '',
        content: '',
        new_attachment: [],
        exist_attachment: [],
      },
      remove_attachment_list: [],
      visible: false,
      replay_visible: false,
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
      this.board_modify = {
        title: data.title,
        content: data.content,
        handle: false,
        new_attachment: [],
        exist_attachment: data.attachment,
      }
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
      await deleteBoard({
        id: this.$route.params.id,
        email: this.board.uploadedBy.email,
      })
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
      const totalAttachmentCount =
        this.board_modify.new_attachment.length +
        this.board_modify.exist_attachment.length
      console.log(totalAttachmentCount)
      if (totalAttachmentCount > 3) {
        return this.$message({
          type: 'info',
          message: '첨부 파일은 최대 3개 까지만 가능합니다.',
        })
      }
      this.$store.dispatch('common/getLoading', true)

      const formData = new FormData()
      formData.append('_id', this.board._id)
      formData.append('email', this.board.uploadedBy.email)
      formData.append('title', this.board_modify.title)
      formData.append('content', this.board_modify.content)
      // 첨부파일 추가할 때
      if (this.board_modify.new_attachment.length) {
        this.board_modify.new_attachment.forEach((file) => {
          formData.append('attachment', file)
        })
      }
      // 기존 첨부파일 제거 할 때
      if (this.remove_attachment_list.length) {
        this.remove_attachment_list.forEach((file) =>
          formData.append('removeFileIds', file._id)
        )
      }
      try {
        await updateBoard(formData)
        this.board_modify.handle = false
        await this.fecthBoard()
      } catch (err) {
        this.$message({
          type: 'error',
          message: '실패했습니다.',
        })
      } finally {
        this.$store.dispatch('common/getLoading', false)
      }
    },
    async fileDownload(key) {
      window.open(`http://localhost:3000/api/file/${key}`)
    },
    uploadFile(file) {
      this.file = file
    },
    cancelModify() {
      this.board_modify = {
        title: this.board.title,
        content: this.board.content,
        handle: false,
        new_attachment: [],
        exist_attachment: this.board.attachment,
      }
      this.remove_attachment_list = []
    },
    handleFileUpload() {
      this.$refs.file.click()
    },
    previewImage(e) {
      const filesMaxCount = 3
      const filesCount =
        e.target.files.length + this.board_modify.new_attachment.length
      if (filesMaxCount < filesCount) {
        return this.$message({
          type: 'info',
          message: '첨부 파일 최대 개수는 3개 입니다.',
          showClose: true,
        })
      }

      this.board_modify.new_attachment = [
        ...this.board_modify.new_attachment,
        ...e.target.files,
      ]
    },
    deleteFileList(index) {
      this.board_modify.new_attachment.splice(index, 1)
    },
    deleteExistFileList(index) {
      this.board_modify.exist_attachment.splice(index, 1)
      this.remove_attachment_list.push(this.board_modify.exist_attachment[0])
    },
  },
  mounted() {
    this.fecthBoard()
  },
}
</script>
<style lang="scss" scoped>
.listWrap {
  display: flex;
}
.attachmentWrap {
  margin-bottom: 10px;
}
</style>
