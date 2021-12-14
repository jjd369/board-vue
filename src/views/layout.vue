<template>
  <el-container v-loading="loading">
    <el-header><Header></Header></el-header>
    <el-main>
      <el-row type="flex" justify="center">
        <el-col :sm="18" :md="15" :lg="12" :xl="12">
          <el-card>
            <home v-if="$route.fullPath === '/'"></home>
            <router-view></router-view>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
    <el-footer>footer</el-footer>
  </el-container>
</template>

<script>
import Header from '@/components/header'
import home from '@/components/home'
import { mapState } from 'vuex'
export default {
  name: 'layout',
  components: { Header, home },
  computed: {
    ...mapState('common', ['loading']),
  },
}
</script>
