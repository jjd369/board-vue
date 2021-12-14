<template>
  <div class="searchWrap">
    <el-input
      placeholder="검색 내용을 입력해주세요."
      v-model="search_input"
      class="searchInput"
      size="mini"
    >
      <el-select v-model="select_type" slot="prepend" placeholder="Select">
        <el-option
          v-if="this.$route.name !== 'myPage'"
          label="작성자"
          value="search_author"
        ></el-option>
        <el-option label="제목/내용" value="search_content"></el-option>
      </el-select>
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="callSearchBoard()"
      ></el-button>
    </el-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      select_type: '',
      search_input: '',
    }
  },
  methods: {
    callSearchBoard() {
      if (!this.select_type) {
        return this.$message({
          type: 'info',
          message: '검색 주제를 선택해주세요.',
        })
      }
      if (!this.search_input) {
        return this.$message({
          type: 'info',
          message: '검색어를 입력해주세요.',
        })
      }
      this.$emit('search', {
        type: this.select_type,
        message: this.search_input,
      })
      // this.select_type = ''
      // this.search_input = ''
    },
  },
}
</script>

<style></style>
