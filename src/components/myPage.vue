<template>
  <div class="myPageWrap">
    <h1 class="cardTitle">마이 페이지</h1>
    <template>
      <div slot="header" class="header">
        <!-- 프로필 수정 안 할 때 -->
        <div v-if="!modify" class="imgWrap">
          <!-- 기존 프로필 없을 때 -->
          <i v-if="!current_user.image" class="el-icon-user"></i>
          <!-- 기존 프로필 있을 때 -->
          <img v-else :src="current_user.image" alt="프로필사진" />
        </div>
        <!-- 프로필 수정 할 때 -->
        <div v-else class="imgWrap">
          <!-- 프로필 사진 업로드 안 할 때 -->
          <template v-if="!c_user_image_url">
            <i v-if="!current_user.image" class="el-icon-user"></i>
            <img v-else :src="current_user.image" alt="프로필사진" />
          </template>
          <!-- 프로필 사진 업로드 할 때 -->
          <template v-else>
            <img :src="c_user_image_url" alt="프로필사진" />
          </template>
        </div>
        <div v-if="modify" class="btnWrap">
          <el-button
            native-type="button"
            round
            icon="el-icon-edit"
            size="mini"
            @click="handleFileUpload"
          ></el-button>
          <input type="file" id="userImage" ref="file" @change="previewImage" />
        </div>
        <div>
          <div v-if="!modify">{{ current_user.name }}</div>
          <div v-else
            ><el-input
              type="text"
              v-model="current_user.name"
              size="small"
            ></el-input
          ></div>
        </div>
      </div>
      <div class="list"> 이메일 : {{ current_user.email }} </div>
      <div class="list">
        가입일 : {{ createAtTime(current_user.createdAt) }}
      </div>
      <div v-if="!modify" class="btnWrap">
        <el-button @click="modify = true"> 수정</el-button>
      </div>
      <div v-else class="btnWarp">
        <el-button @click="modify = false">취소</el-button>
        <el-button @click="callUpdateUser()">저장</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import { updateUser } from '@/apis/users'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      modify: false,
      name: '',
      email: '',
      userImageUrl: '',
    }
  },
  computed: {
    ...mapState('auth', ['current_user']),
    c_user_image_url() {
      return this.userImageUrl
    },
  },
  methods: {
    createAtTime(date) {
      const createDate = new Date(date)
      const year = createDate.getFullYear()
      const month = createDate.getMonth()
      const day = createDate.getDay()
      return `${year}년 ${month}월 ${day}일`
    },
    handleExceed() {
      this.$message.warning({
        type: 'warning',
        message: '첨부파일은 1개만 가능합니다.',
        showClose: 'true',
      })
    },
    handleFileUpload() {
      this.$refs.file.click()
    },
    previewImage() {
      this.userImageUrl = URL.createObjectURL(this.$refs.file.files[0])
    },
    async callUpdateUser() {
      this.$store.dispatch('common/getLoading', true)

      const formData = new FormData()
      // body에 넣을 formData 설정
      if (this.userImageUrl) {
        formData.append('attachment', this.$refs.file.files[0])
      }
      formData.append('name', this.current_user.name)

      await updateUser(formData)
      this.$store.dispatch('auth/init')
      this.modify = false
      this.$store.dispatch('common/getLoading', false)
    },
  },
}
</script>

<style lang="scss">
.myPageWrap {
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 25px;
    .imgWrap {
      width: 100px;
      height: 100px;
      font-size: 100px;
      margin-bottom: 10px;
    }
    .editBtn {
      width: 15px;
      height: 15px;
      font-size: 15px;
    }
  }
  .list {
    margin-bottom: 15px;
  }
}
</style>
