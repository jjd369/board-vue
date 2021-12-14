<template>
  <div>
    <form>
      <div class="titleWrap">
        <h2>로그인</h2>
      </div>
      <div class="inputWrap">
        <p>이메일</p>
        <el-input
          size="small"
          placeholder="이메일을 입력해주세요."
          v-model="email"
          clearable
        >
        </el-input>
      </div>
      <div class="inputWrap">
        <p>비밀번호</p>
        <el-input
          size="small"
          placeholder="비밀번호를 입력해주세요."
          v-model="password"
          show-password
        ></el-input>
      </div>
      <div class="btnWrap">
        <el-button size="mini" @click="login()">로그인</el-button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    async login() {
      await this.$store.dispatch('auth/login', {
        email: this.email,
        password: this.password,
      })
    },
  },
}
</script>
