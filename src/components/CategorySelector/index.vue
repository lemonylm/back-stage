<template>
  <el-form :inline="true" :model="categoryForm" class="demo-form-inline">
    <el-form-item label="一级分类">
      <el-select
        v-model="categoryForm.category1Id"
        placeholder="请选择"
        @change="handleCategory1"
      >
        <el-option
          :label="c1.name"
          :value="c1.id"
          v-for="c1 in category1List"
          :key="c1.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select
        v-model="categoryForm.category2Id"
        placeholder="请选择"
        @change="handleCategory2"
      >
        <el-option
          :label="c2.name"
          :value="c2.id"
          v-for="c2 in category2List"
          :key="c2.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select
        v-model="categoryForm.category3Id"
        placeholder="请选择"
        @change="handleCategory3"
      >
        <el-option
          :label="c3.name"
          :value="c3.id"
          v-for="c3 in category3List"
          :key="c3.id"
        ></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "CategorySelector",
  data() {
    return {
      category1List: [],
      category2List: [],
      category3List: [],
      categoryForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      category3Id: "",
    };
  },
  methods: {
    async getCategory1List() {
      try {
        const res = await this.$API.category.getCategory1();
        if (res.code === 20000 || res.code === 200) {
          this.category1List = res.data;
        }
      } catch (error) {
        alert(error.message);
      }
    },

    async handleCategory1(c1Id) {
      this.categoryForm.category1Id = c1Id;
      this.category2List = [];
      this.category3List = [];
      this.categoryForm.category2Id = "";
      this.categoryForm.category3Id = "";
      this.category3Id = "";
      const res = await this.$API.category.getCategory2(c1Id);
      if (res.code === 20000 || res.code === 200) {
        this.category2List = res.data;
      }
    },
    async handleCategory2(c2Id) {
      this.categoryForm.category2Id = c2Id;
      this.category3List = [];
      this.categoryForm.category3Id = "";
      this.category3Id = "";
      const res = await this.$API.category.getCategory3(c2Id);
      if (res.code === 20000 || res.code === 200) {
        this.category3List = res.data;
      }
    },
    handleCategory3(c3Id) {
      this.categoryForm.category3Id = c3Id;
      this.category3Id = c3Id;
    },
  },
  watch: {
    category3Id() {
      this.$emit("changeAttrList", this.categoryForm);
    },
  },
  mounted() {
    this.getCategory1List();
  },
};
</script>

<style scoped lang="less">
</style>
