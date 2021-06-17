<template>
  <div>
    <el-button type="primary" v-permission="'btn.Test111.add'">添加</el-button>
    <el-button type="danger" v-permission="'btn.Test111.remove'"
      >删除</el-button
    >
    <el-button type="warning" v-permission="'btn.Test111.update'"
      >修改</el-button
    >
  </div>
</template>

<script>
export default {
  name: "Test1",
};
</script>

<style  lang='scss' scoped>
.permission-disabled {
  position: relative;
  cursor: not-allowed !important;
  pointer-events: none;
  border: none;
  background-image: none;
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0px;
    right: 0px;
    height: 100%;
    z-index: 9;
    background: rgba(255, 255, 255, 0.5);
  }
}
</style>
