<template>
  <div>
    <el-card>
      <CategorySelector @changeAttrList="changeAttrList"></CategorySelector>
    </el-card>
    <el-card style="margin-top: 20px">
      <el-table :data="attrList" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column label="属性值列表" width="width">
          <template slot-scope="{ row, $index }">
            <el-tag
              type="success"
              v-for="attrValue in row.attrValueList"
              :key="attrValue.id"
              >{{ attrValue.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="170">
          <template slot-scope="{ row, $index }">
            <HintButton
              type="warning"
              title="修改"
              icon="el-icon-edit"
              size="mini"
              @click="modifyAttr(row.attrId)"
              >修改</HintButton
            >
            <HintButton
              type="danger"
              title="删除"
              icon="el-icon-delete"
              size="mini"
              @click="removeAttr(row.id)"
              >删除</HintButton
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Attr",
  data() {
    return {
      attrList: [],
      categoryForm: {},
    };
  },
  methods: {
    // 获取下层属性列表
    async getAttrList(categoryForm) {
      const res = await this.$API.attr.getAttrList(categoryForm);
      if (res.code === 20000 || res.code === 200) {
        this.attrList = res.data;
        this.categoryForm = categoryForm;
      }
    },
    // 自定义事件刷新列表
    changeAttrList(categoryForm) {
      if (!categoryForm.category3Id) {
        // 列表清空
        this.attrList = [];
      } else {
        // 发送请求 刷新列表
        this.getAttrList(categoryForm);
      }
    },
    // 删除属性
    async removeAttr(attrId) {
      try {
        const res = await this.$API.attr.removeAttr(attrId);
        if (res.code === 20000 || res.code === 200) {
          this.$message.success("删除成功");
          this.getAttrList(this.categoryForm);
        }
      } catch (error) {
        this.$message.error("删除失败");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.el-tag {
  margin-right: 10px;
}
</style>
