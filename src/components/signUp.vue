<template>
  <div class="signupWrap">
    <form>
      <!-- 회원가입 폼 -->
      <div v-if="!result">
        <div class="titleWrap">
          <h2>회원가입</h2>
        </div>
        <div class="inputWrap">
          <p>이름</p>
          <el-input
            placeholder="아이디를입력해주세요."
            v-model="name"
            clearable
          >
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
        <div class="inputWrap">
          <p>첨부 파일</p>
          <el-upload
            action="#"
            :on-change="uploadFile"
            class="upload-demo"
            name="attachment"
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
      file: null,
      result: false,
    }
  },
  methods: {
    signUp() {
      this.$store.dispatch('common/getLoading', true)
      const formData = new FormData()
      // body에 넣을 formData 설정
      if (this.file) {
        formData.append('attachment', this.file.raw, this.file.name)
      }
      formData.append('name', this.name)
      formData.append('email', this.email)
      formData.append('password', this.password)
      // signUp({
      //   name: this.name,
      //   email: this.email,
      //   password: this.password,
      // })
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
  },
}
</script>
