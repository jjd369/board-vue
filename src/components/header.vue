<template>
  <div class="header">
    <el-row type="flex" class="row-bg" justify="space-around" align="middle">
      <el-col :span="6"
        ><div class="logoBox"
          ><router-link :to="{ name: 'layout' }">jjd</router-link></div
        ></el-col
      >
      <el-col :span="18"
        ><div class="navBox">
          <span>
            <router-link :to="{ name: 'write' }">글쓰기</router-link></span
          >
          <span>
            <router-link :to="{ name: 'boardList', query: { page: 1 } }"
              >게시판</router-link
            ></span
          >
          <span v-if="!logged_in"
            ><router-link :to="{ name: 'login' }">로그인</router-link></span
          >
          <span v-if="!logged_in"
            ><router-link :to="{ name: 'signUp' }">회원가입</router-link></span
          >
          <span v-if="logged_in" class="userWrap">
            <div class="imgWrap" style="cursor: pointer" @click="handleCard">
              <i v-if="!current_user.image" class="el-icon-user"></i>
              <img v-else :src="current_user.image" alt="프로필사진" />
            </div>
            <transition name="slide-fade">
              <el-card v-if="userCardHandle" class="user-card">
                <div slot="header" class="clearfix" style="display: flex">
                  <span class="imgWrap">
                    <i v-if="!current_user.image" class="el-icon-user"></i>
                    <img v-else :src="current_user.image" alt="프로필사진"
                  /></span>
                  <el-button style="float: right; padding: 3px 0" type="text"
                    >{{ current_user.email }} /
                    {{ current_user.name }}</el-button
                  >
                </div>
                <div class="text item" @click="moveMyPage">마이 페이지</div>
                <div class="text item" @click="logout()">로그아웃</div>
              </el-card>
            </transition>
          </span>
        </div></el-col
      >
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
// import { hasToken } from '@/utils/token'
export default {
  data() {
    return {
      userCardHandle: false,
    }
  },
  computed: {
    ...mapState('auth', ['current_user']),
    ...mapGetters('auth', ['logged_in']),
  },
  methods: {
    moveMyPage() {
      this.userCardHandle = false
      this.$router.push({ name: 'myPage' }).catch(() => {})
    },
    async logout() {
      this.userCardHandle = false
      this.$store.dispatch('auth/logout')
      this.$message({
        showClose: true,
        type: 'info',
        message: '로그아웃 되었습니다.',
      })
      this.$router.push({ name: 'login' })
    },
    handleCard() {
      this.userCardHandle = !this.userCardHandle
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
    cursor: pointer;
  }
}
.navBox {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  span {
    margin-right: 10px;
  }
}
.item {
  margin-bottom: 18px;
  &:last-child {
    margin-bottom: 0px;
  }
  cursor: pointer;
}
.userWrap {
  position: relative;
}
.user-card {
  position: absolute;
  top: 45px;
  right: 0px;
  z-index: 100;
  line-height: 20px;
}
</style>
