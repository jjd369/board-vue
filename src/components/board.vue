<template>
  <div>
    <el-card
      ><div v-if="!board_modify">
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
          <el-button @click="modify = true"> 수정 </el-button>
          <el-button @click="deleteBoard()"> 삭제 </el-button>
        </div>
        <div class="line"></div>
        <div class="commentsWrap">
          <!-- 댓글 입력 박스 -->
          <div class="commentWrite">
            <el-input
              maxlength="55"
              placeholder="댓글을 입력해주세요."
              v-model="comment_to_board_string"
            >
              <template slot="prepend">{{ current_user }}</template>
              <el-button
                slot="append"
                icon="el-icon-chat-line-round"
                @click="writeCommentToBoard"
              ></el-button>
            </el-input>
          </div>
          <!-- 댓글 리스트 -->
          <div class="commentList">
            <div class="row" v-for="(comment, index) in comments" :key="index">
              <!-- 댓글 작성자 아이디 -->
              <div class="col">
                <span class="author">{{ comment.name }}</span>
              </div>
              <!-- 댓글 내용 -->
              <div class="col">
                <div class="box">
                  <!-- 댓글 -->
                  <template v-if="!comment.modify">
                    <span class="content">{{ comment.content }}</span>
                    <span class="time">{{ diffTime(comment.createdAt) }}</span>
                    <span class="more">
                      <el-popover
                        placement="bottom"
                        :width="comment.name === current_user ? 150 : 70"
                        trigger="click"
                        visible-arrow="true"
                      >
                        <div
                          v-if="comment.name === current_user"
                          style="text-align: right; margin: 0"
                        >
                          <el-button
                            @click="
                              handleUpdateComment(index, true, comment.content)
                            "
                            >수정</el-button
                          >
                          <el-button @click="deleteComment(comment._id)"
                            >삭제</el-button
                          >
                        </div>
                        <div v-else style="text-align: right; margin: 0">
                          <el-button>신고</el-button>
                        </div>
                        <el-button
                          slot="reference"
                          type="text"
                          icon="el-icon-more"
                        ></el-button>
                      </el-popover>
                    </span>
                  </template>
                  <!-- 댓글 수정  -->
                  <template v-else>
                    <span class="content"
                      ><el-input
                        maxlength="55"
                        v-model="comment_modify_string"
                      ></el-input
                    ></span>
                    <span>
                      <el-button
                        :disabled="!comment.content.length ? true : false"
                        @click="updateComment(comment._id)"
                        >수정</el-button
                      ></span
                    >
                    <span>
                      <el-button @click="handleUpdateComment(index, false)"
                        >취소</el-button
                      ></span
                    >
                  </template>
                </div>
                <!-- 좋아요 및 대댓글  -->
                <div class="box">
                  <el-button size="mini" type="text" class="like"
                    >좋아요</el-button
                  >
                  <el-button size="mini" type="text" class="unLike"
                    >싫어요</el-button
                  >
                  <el-button
                    size="mini"
                    class="reply"
                    type="text"
                    @click="handleReply(index, true)"
                    >답글</el-button
                  >
                </div>
                <!-- 대댓글 입력 창 -->
                <div class="box" v-if="comment.reply">
                  <el-input
                    maxlength="55"
                    placeholder="댓글을 입력해주세요."
                    v-model="comment_to_comment_string"
                  >
                    <template slot="prepend">{{ current_user }}</template>
                    <el-button
                      slot="append"
                      icon="el-icon-chat-line-round"
                      @click="writeCommentToComment(comment._id)"
                    ></el-button>
                  </el-input>
                  <el-button @click="handleReply(index, false)">
                    취소
                  </el-button>
                </div>
                <div class="box" v-if="comment.comments.length">
                  <el-button
                    size="mini"
                    type="text"
                    class="moreReply"
                    icon="el-icon-caret-bottom"
                    @click="replay_visible = !replay_visible"
                    >댓글 보기</el-button
                  >
                </div>
                <div class="box">
                  <template v-if="replay_visible">
                    <div class="commentList">
                      <div
                        class="row"
                        v-for="(reply, index) in comment.comments"
                        :key="index"
                      >
                        <!-- 댓글 작성자 아이디 -->
                        <div class="col">
                          <span class="author">{{ reply.name }}</span>
                        </div>
                        <!-- 댓글 내용 -->
                        <div class="col">
                          <div class="box">
                            <!-- 댓글 -->
                            <template v-if="!reply.modify">
                              <span class="content">{{ reply.content }}</span>
                              <span class="time">{{
                                diffTime(reply.createdAt)
                              }}</span>
                              <span class="more">
                                <el-popover
                                  placement="bottom"
                                  :width="
                                    reply.name === current_user ? 150 : 70
                                  "
                                  trigger="click"
                                  visible-arrow="true"
                                >
                                  <div
                                    v-if="reply.name === current_user"
                                    style="text-align: right; margin: 0"
                                  >
                                    <el-button
                                      @click="
                                        handleUpdateComment(
                                          index,
                                          true,
                                          reply.content
                                        )
                                      "
                                      >수정</el-button
                                    >
                                    <el-button @click="deleteComment(reply._id)"
                                      >삭제</el-button
                                    >
                                  </div>
                                  <div
                                    v-else
                                    style="text-align: right; margin: 0"
                                  >
                                    <el-button>신고</el-button>
                                  </div>
                                  <el-button
                                    slot="reference"
                                    type="text"
                                    icon="el-icon-more"
                                  ></el-button>
                                </el-popover>
                              </span>
                            </template>
                            <!-- 댓글 수정  -->
                            <template v-else>
                              <span class="content"
                                ><el-input
                                  maxlength="55"
                                  v-model="comment_modify_string"
                                ></el-input
                              ></span>
                              <span>
                                <el-button
                                  :disabled="
                                    !reply.content.length ? true : false
                                  "
                                  @click="updateComment(reply._id)"
                                  >수정</el-button
                                ></span
                              >
                              <span>
                                <el-button
                                  @click="handleUpdateComment(index, false)"
                                  >취소</el-button
                                ></span
                              >
                            </template>
                          </div>
                          <!-- 좋아요 및 대댓글  -->
                          <div class="box">
                            <el-button size="mini" type="text" class="like"
                              >좋아요</el-button
                            >
                            <el-button size="mini" type="text" class="unLike"
                              >싫어요</el-button
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
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
      </div>
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

export default {
  data() {
    return {
      board: {},
      comments: [],
      comment_to_board_string: '',
      comment_to_comment_string: '',
      comment_modify_string: '',
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
        return { ...el, modify: false, reply: false }
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
