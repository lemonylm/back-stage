<template>
  <a href="javascript:;" :title="title">
    <el-button v-bind="$attrs" v-on="$listeners" >
      <slot></slot>
    </el-button>
  </a>
</template>

<script>
export default {
  name: "HintButton",
  props: ["title"],
};
</script>

<style scoped lang="scss">
a{
  margin-right: 5px;
}
</style>
