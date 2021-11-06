<template>
  <div
    ><transition name="slide-fade">
      <div v-if="alert_on" class="alertWrap">
        <el-alert :title="alert_title" :type="alert_type" center show-icon>
        </el-alert> </div
    ></transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState('alert', ['alert_on', 'alert_type', 'alert_title']),
  },
}
</script>

<style>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
