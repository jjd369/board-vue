<template>
  <div class="commentsWrap">
    <!-- 댓글 입력 박스 -->
    <div class="commentWrite">
      <el-input
        size="mini"
        maxlength="55"
        placeholder="댓글을 입력해주세요."
        v-model="comment_to_board_string"
      >
        <el-button
          size="mini"
          slot="append"
          icon="el-icon-chat-line-round"
          @click="writeCommentToBoard"
        ></el-button>
      </el-input>
    </div>
    <!-- 댓글 리스트 -->
    <div class="commentList">
      <div
        class="row"
        v-for="(comment, comment_index) in comments"
        :key="comment_index"
      >
        <!-- 댓글 작성자 아이디 -->
        <div class="col">
          <div class="imgWrap">
            <i v-if="!comment.uploadedBy.image" class="el-icon-user"></i>
            <img v-else :src="comment.uploadedBy.image" alt="프로필사진" />
          </div>
        </div>
        <!-- 댓글 내용 -->
        <div class="col">
          <div class="box">
            <span class="author">{{ comment.uploadedBy.name }}</span>
          </div>
          <div class="box">
            <!-- 댓글 -->
            <template v-if="!comment.modify">
              <span class="content">{{ comment.content }}</span>
              <span class="time">{{ diffTime(comment.createdAt) }}</span>
              <span class="more">
                <el-popover
                  placement="bottom"
                  trigger="click"
                  visible-arrow="true"
                >
                  <div
                    v-if="comment.uploadedBy.email === current_user.email"
                    style="text-align: right; margin: 0"
                  >
                    <el-button
                      size="mini"
                      @click="
                        handleUpdateComment(comment_index, comment.content)
                      "
                      >수정</el-button
                    >
                    <el-button @click="deleteComment(comment._id)" size="mini"
                      >삭제</el-button
                    >
                  </div>
                  <div v-else style="text-align: right; margin: 0">
                    <el-button size="mini">신고</el-button>
                  </div>
                  <el-button
                    size="mini"
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
                  size="mini"
                  maxlength="55"
                  v-model="comment_modify_string"
                ></el-input
              ></span>
              <span>
                <el-button
                  size="mini"
                  :disabled="!comment_modify_string.length ? true : false"
                  @click="updateComment(comment._id)"
                  >수정</el-button
                ></span
              >
              <span>
                <el-button
                  size="mini"
                  @click="handleUpdateComment(comment_index)"
                  >취소</el-button
                ></span
              >
            </template>
          </div>
          <!-- 좋아요 및 대댓글  -->
          <div class="box">
            <el-button size="mini" type="text" class="like">좋아요</el-button>
            <el-button size="mini" type="text" class="unLike">싫어요</el-button>
            <el-button
              size="mini"
              class="reply"
              type="text"
              @click="handleReply(comment_index)"
              >답글</el-button
            >
          </div>
          <!-- 대댓글 입력 창 -->
          <div class="box" v-if="comment.reply">
            <el-input
              size="mini"
              maxlength="55"
              placeholder="댓글을 입력해주세요."
              v-model="comment_to_comment_string"
            >
              <el-button
                size="mini"
                slot="append"
                icon="el-icon-chat-line-round"
                @click="writeCommentToComment(comment._id)"
              ></el-button>
            </el-input>
            <!-- <el-button @click="handleReply(comment_index)"> 취소 </el-button> -->
          </div>
          <div class="box" v-if="comment.comments.length">
            <el-button
              size="mini"
              type="text"
              class="moreReply"
              :icon="
                !comment.visible ? `el-icon-caret-bottom` : 'el-icon-caret-top'
              "
              @click="handleNestedCommentVisible(comment_index)"
              >댓글 보기</el-button
            >
          </div>
          <div class="box">
            <transition name="slide-fade">
              <template v-if="comment.visible">
                <div class="commentList">
                  <div
                    class="row"
                    v-for="(
                      nested_comment, nested_comment_index
                    ) in comment.comments"
                    :key="nested_comment_index"
                  >
                    <!-- 대댓글 작성자 아이디 -->
                    <div class="col">
                      <div class="imgWrap">
                        <i
                          v-if="!nested_comment.uploadedBy.image"
                          class="el-icon-user"
                        ></i>
                        <img
                          v-else
                          :src="nested_comment.uploadedBy.image"
                          alt="프로필사진"
                        />
                      </div>
                    </div>
                    <!-- 대댓글 내용 -->
                    <div class="col">
                      <div class="box">
                        <span class="author">{{
                          nested_comment.uploadedBy.name
                        }}</span>
                      </div>
                      <div class="box">
                        <!-- 대댓글 -->
                        <template v-if="!nested_comment.modify">
                          <span class="content">{{
                            nested_comment.content
                          }}</span>
                          <span class="time">{{
                            diffTime(nested_comment.createdAt)
                          }}</span>
                          <span class="more">
                            <el-popover
                              placement="bottom"
                              trigger="click"
                              visible-arrow="true"
                            >
                              <div
                                v-if="
                                  nested_comment.uploadedBy.email ===
                                  current_user.email
                                "
                                style="text-align: right; margin: 0"
                              >
                                <el-button
                                  size="mini"
                                  @click="
                                    handleUpdateNestedComment(
                                      comment_index,
                                      nested_comment_index,
                                      nested_comment.content
                                    )
                                  "
                                  >수정</el-button
                                >
                                <el-button
                                  size="mini"
                                  @click="deleteComment(nested_comment._id)"
                                  >삭제</el-button
                                >
                              </div>
                              <div v-else style="text-align: right; margin: 0">
                                <el-button size="mini">신고</el-button>
                              </div>
                              <el-button
                                size="mini"
                                slot="reference"
                                type="text"
                                icon="el-icon-more"
                              ></el-button>
                            </el-popover>
                          </span>
                        </template>
                        <!-- 대댓글 수정  -->
                        <template v-else>
                          <span class="content"
                            ><el-input
                              size="mini"
                              maxlength="55"
                              v-model="nested_comment_modify_string"
                            ></el-input
                          ></span>
                          <span>
                            <el-button
                              size="mini"
                              :disabled="
                                !nested_comment_modify_string.length
                                  ? true
                                  : false
                              "
                              @click="updateNestedComment(nested_comment._id)"
                              >수정</el-button
                            ></span
                          >
                          <span>
                            <el-button
                              size="mini"
                              @click="
                                handleUpdateNestedComment(
                                  comment_index,
                                  nested_comment_index
                                )
                              "
                              >취소</el-button
                            ></span
                          >
                        </template>
                      </div>
                      <!-- 대댓글 좋아요  -->
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
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  commentToComment,
  commentToBoard,
  updateComment,
  deleteComment,
} from '@/apis/comment'
import { mapState } from 'vuex'
export default {
  props: {
    comments: Array,
  },
  data() {
    return {
      comment_to_board_string: '',
      comment_to_comment_string: '',
      comment_modify_string: '',
      nested_comment_modify_string: '',
      nested_comment_visible: false,
    }
  },
  computed: {
    ...mapState('auth', ['current_user']),
  },
  methods: {
    async writeCommentToBoard() {
      await commentToBoard({
        content: this.comment_to_board_string,
        board: this.$route.params.id,
      })
      this.comment_to_board_string = ''
      this.$emit('callFecthBoard')
    },
    async writeCommentToComment(_id) {
      await commentToComment({
        content: this.comment_to_comment_string,
        comments: _id,
      })
      this.comment_to_comment_string = ''
      this.$emit('callFecthBoard')
    },
    async deleteComment(_id) {
      this.visible = false
      await deleteComment({ _id })
      this.$emit('callFecthBoard')
    },
    async updateComment(_id) {
      await updateComment({ _id, content: this.comment_modify_string })
      this.$emit('callFecthBoard')
    },
    async updateNestedComment(_id) {
      await updateComment({ _id, content: this.nested_comment_modify_string })
      this.$emit('callFecthBoard')
    },
    handleUpdateComment(index, content) {
      !content
        ? (this.comment_modify_string = '')
        : (this.comment_modify_string = content)

      const findComment = this.comments[index]
      findComment.modify = !findComment.modify
      this.comments.splice(index, 1, findComment)
    },
    handleUpdateNestedComment(index, nested_index, content) {
      !content
        ? (this.nested_comment_modify_string = '')
        : (this.nested_comment_modify_string = content)

      const findComment = this.comments[index]
      findComment.comments[nested_index].modify =
        !findComment.comments[nested_index].modify
      this.comments[index].comments.splice(
        nested_index,
        1,
        findComment.comments[nested_index]
      )
    },
    handleReply(index) {
      const findComment = this.comments[index]
      findComment.reply = !findComment.reply
      this.comments.splice(index, 1, findComment)
    },
    diffTime(date) {
      const now = new Date().getTime()
      const time = new Date(date).getTime()

      const diff = now - time

      let msec = diff
      let dd = Math.floor(msec / 1000 / 24 / 60 / 60)
      msec -= dd * 1000 * 24 * 60 * 60
      let hh = Math.floor(msec / 1000 / 60 / 60)
      msec -= hh * 1000 * 60 * 60
      let mm = Math.floor(msec / 1000 / 60)
      msec -= mm * 1000 * 60
      let ss = Math.floor(msec / 1000)
      msec -= ss * 1000
      if (dd) {
        return `${dd}일 전`
      }
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
    handleNestedCommentVisible(index) {
      const findComment = this.comments[index]
      findComment.visible = !findComment.visible
      this.comments.splice(index, 1, findComment)
    },
  },
}
</script>

<style lang="scss">
.commentList {
  margin-top: 15px;
  .commentList {
    width: 90%;
  }
  .row {
    margin-bottom: 30px;
    display: flex;
    flex-wrap: wrap;
    .col {
      &:nth-child(1) {
        align-items: flex-start;
        margin-right: 10px;
      }
      &:nth-child(2) {
        flex-direction: column;
        align-items: flex-start;
        flex: 1;
      }
      display: flex;
      align-items: center;
      .box {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        width: 100%;
        line-height: 30px;
        font-size: 12px;
      }
    }
    .author {
      min-width: 80px;
      text-align: left;
    }
    .content {
      min-width: 150px;
      text-align: left;
      flex: 1;
      word-break: keep-all;
      word-wrap: break-word;
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
