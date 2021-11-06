<template>
  <el-container>
    <el-header><Header></Header></el-header>
    <el-main>
      <router-view></router-view>
      <Alert></Alert>
    </el-main>
    <el-footer>footer</el-footer>
  </el-container>
</template>

<script>
import Header from '@/components/header'
import Alert from '@/components/alert'
export default {
  name: 'layout',
  components: { Header, Alert },
}
</script>
