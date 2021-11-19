<template>
  <el-container v-loading="loading">
    <el-header><Header></Header></el-header>
    <el-main>
      <el-row type="flex" justify="center">
        <el-col :sm="18" :md="15" :lg="15" :xl="12">
          <el-card>
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
import { mapState } from 'vuex'
export default {
  name: 'layout',
  components: { Header },
  computed: {
    ...mapState('common', ['loading']),
  },
}
</script>
