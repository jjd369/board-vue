<template>
  <div class="signupWrap">
    <form>
      <!-- 회원가입 폼 -->
      <div v-if="!result">
        <div class="titleWrap">
          <h2>회원가입</h2>
        </div>
        <div class="profileImg">
          <div class="imgWrap">
            <i v-if="!c_user_image_url" class="el-icon-user"></i>
            <img v-else :src="c_user_image_url" alt="프로필사진" />
          </div>
          <div class="btnWrap">
            <el-button
              native-type="button"
              round
              icon="el-icon-edit"
              size="mini"
              @click="handleFileUpload"
            ></el-button>
            <input
              type="file"
              id="userImage"
              ref="file"
              @change="previewImage"
              accept=".jpg, .jpeg, .png"
            />
          </div>
        </div>
        <div class="inputWrap">
          <p>이름</p>
          <el-input placeholder="이름을 입력해주세요." v-model="name" clearable>
          </el-input>
        </div>
        <div class="inputWrap">
          <p>이메일</p>
          <el-input
            placeholder="이메일을 입력해주세요."
            v-model="email"
          ></el-input>
        </div>
        <div class="inputWrap">
          <p>비밀번호</p>
          <el-input
            placeholder="비밀번호를 입력해주세요."
            v-model="password"
            show-password
          ></el-input>
        </div>
        <div class="btnWarp">
          <el-button @click="signUp()">등록</el-button>
        </div>
      </div>
      <!-- 화원가입 완료 -->
      <div v-else>
        <el-result
          icon="success"
          title="회원가입 완료"
          :subTitle="`${name}님 회원가입을 축하드립니다.`"
        >
          <template slot="extra">
            <el-button @click="$router.push({ name: 'login' })"
              >로그인</el-button
            >
          </template>
        </el-result>
      </div>
    </form>
  </div>
</template>
<script>
import { signUp } from '@/apis/auth'

export default {
  data() {
    return {
      name: '',
      password: '',
      email: '',
      result: false,
      userImageUrl: '',
      file: null,
    }
  },
  computed: {
    c_user_image_url() {
      if (!this.file) return ''
      return URL.createObjectURL(this.file)
    },
  },
  methods: {
    signUp() {
      this.$store.dispatch('common/getLoading', true)
      const formData = new FormData()
      if (this.file) {
        formData.append('attachment', this.file)
      }
      formData.append('name', this.name)
      formData.append('email', this.email)
      formData.append('password', this.password)

      signUp(formData)
        .then(({ data }) => {
          this.$message({
            showClose: true,
            message: `${data.name}님 회원가입이 완료되었습니다.`,
            type: 'success',
          })
          this.result = true
        })
        .catch((err) => {
          this.$message({
            showClose: true,
            message: err.response.data.errors.message,
            type: 'error',
          })
        })
        .finally(() => {
          this.$store.dispatch('common/getLoading', false)
        })
    },
    uploadFile(file) {
      this.file = file
    },
    handleFileUpload() {
      this.$refs.file.click()
    },
    previewImage(e) {
      this.file = e.target.files[0]
    },
  },
}
</script>

<style lang="scss">
.profileImg {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
</style>
