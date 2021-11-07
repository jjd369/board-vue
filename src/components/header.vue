<template>
  <div>
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="6"
        ><div class="logoBox"><span>jjd</span></div></el-col
      >
      <el-col :span="18"
        ><div class="navBox">
          <span>
            <router-link :to="{ name: 'write' }">글쓰기</router-link></span
          >
          <span>
            <router-link :to="{ name: 'boardList' }">게시판</router-link></span
          >
          <span v-if="!logged_in"
            ><router-link :to="{ name: 'login' }">로그인</router-link></span
          >
          <span v-if="!logged_in"
            ><router-link :to="{ name: 'signUp' }">회원가입</router-link></span
          >
          <span v-else><a href="#" @click="logout()">로그아웃</a></span>
          <span v-if="current_user">{{ current_user }}</span>
        </div></el-col
      >
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
// import { hasToken } from '@/utils/token'
export default {
  computed: {
    ...mapState('auth', ['current_user']),
    ...mapGetters('auth', ['logged_in']),
  },
  watch: {},
  methods: {
    async logout() {
      this.$store.dispatch('auth/logout')
      this.$message({
        type: 'info',
        message: '로그아웃 되었습니다.',
      })
      this.$router.push({ name: 'login' })
    },
  },
}
</script>

<style lang="scss">
.logoBox {
  display: flex;
  justify-content: flex-start;
  span {
    padding-left: 10px;
  }
}
.navBox {
  display: flex;
  justify-content: flex-end;
  span {
    padding-right: 10px;
  }
}
</style>
