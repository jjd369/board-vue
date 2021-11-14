<template>
  <div>
    <el-card
      ><template v-if="!board_modify">
        <div class="btnWrap">
          <el-button @click="$router.push({ name: 'boardList' })">
            목록
          </el-button>
        </div>
        <div class="titleWrap"
          ><h2>{{ board.title }}</h2></div
        >
        <div class="contentWrap"
          ><p>{{ board.content }}</p></div
        >
        <div class="btnWrap">
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
        <div class="btnWrap">
          <el-button @click="updateBoard()">저장</el-button>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script>
import { getBoard, deleteBoard, updateBoard } from '@/apis/board'
import {
  commentToComment,
  commentToBoard,
  updateComment,
  deleteComment,
} from '@/apis/comment'
import { mapState } from 'vuex'
import map from 'lodash/map'
import Comment from '@/components/comment'
export default {
  components: { Comment },
  data() {
    return {
      board: {},
      comments: [],
      board_modify: false,
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
            message: '글이 삭제되었습니다.',
            tpye: 'success',
          })
          this.$router.push({ name: 'boardList' })
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.errors.message,
            tpye: 'error',
          })
        })
    },
    async updateBoard() {
      await updateBoard(this.board)
      this.board_modify = false
    },
    async writeCommentToBoard() {
      await commentToBoard({
        content: this.comment_to_board_string,
        board: this.$route.params.id,
      })
      this.comment_to_board_string = ''
      this.fecthBoard()
    },
    async writeCommentToComment(_id) {
      console.log(_id)

      await commentToComment({
        content: this.comment_to_comment_string,
        comments: _id,
      })
      this.comment_to_comment_string = ''
      this.fecthBoard()
    },
    async deleteComment(_id) {
      this.visible = false
      await deleteComment({ _id })
      this.fecthBoard()
    },
    async updateComment(_id) {
      await updateComment({ _id, content: this.comment_modify_string })
      this.fecthBoard()
    },
    handleUpdateComment(index, bool, content) {
      if (content) {
        this.comment_modify_string = content
      } else {
        this.comment_modify_string = ''
      }
      const findComment = this.comments[index]
      findComment.modify = bool
      this.comments.splice(index, 1, findComment)
    },
    handleReply(index, bool) {
      const findComment = this.comments[index]
      findComment.reply = bool
      this.comments.splice(index, 1, findComment)
    },
    diffTime(date) {
      const now = new Date().getTime()
      const time = new Date(date).getTime()

      const diff = now - time

      var msec = diff
      var hh = Math.floor(msec / 1000 / 60 / 60)
      msec -= hh * 1000 * 60 * 60
      var mm = Math.floor(msec / 1000 / 60)
      msec -= mm * 1000 * 60
      var ss = Math.floor(msec / 1000)
      msec -= ss * 1000
      if (hh) {
        return `${hh}시간 전`
      }
      if (mm) {
        return `${mm}분 전`
      }
      if (ss) {
        return `${ss}초 전`
      }
      return `0초 전`
    },
  },
  mounted() {
    this.fecthBoard()
  },
}
</script>

<style lang="scss">
.commentList {
  margin-top: 15px;
  .row {
    margin-bottom: 10px;
    display: flex;
    .col {
      &:nth-child(1) {
        align-items: flex-start;
      }
      &:nth-child(2) {
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
      }
      display: flex;
      align-items: center;
      .box {
        display: flex;
        align-items: center;
        width: 100%;
        line-height: 30px;
      }
    }
    .author {
      min-width: 80px;
    }
    .content {
      min-width: 150px;
      text-align: left;
      width: 79%;
    }
    .time {
      min-width: 50px;
      font-size: 13px;
    }
    .more {
      min-width: 50px;
    }
    .like,
    .unLike,
    .reply {
      min-width: 70px;
      font-size: 13px;
      cursor: pointer;
    }
  }
}
</style>
