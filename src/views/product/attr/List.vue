<template>
  <div>
    <el-card>
      <CategorySelector @changeAttrList="changeAttrList"></CategorySelector>
    </el-card>
    <el-card style="margin-top: 20px" v-show="!isShowAddList">
      <el-button
        :disabled="!categoryForm.category3Id"
        type="primary"
        @click="showAddList"
        >添加属性<i class="el-icon-plus el-icon--right"></i
      ></el-button>
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
              @click="modifyAttrVals(row)"
              >修改</HintButton
            >

            <el-popconfirm
              :title="`确定删除${row.attrName}吗？`"
              @onConfirm="removeAttr(row.id)"
            >
              <HintButton
                slot="reference"
                title="删除"
                type="danger"
                icon="el-icon-delete"
                size="mini"
              >删除</HintButton>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card v-show="isShowAddList" style="margin-top: 20px">
      <el-form :inline="true" :model="attrForm" @submit.native.prevent>
        <el-form-item label="属性名">
          <el-input
            v-model="attrForm.attrName"
            placeholder="请输入属性名"
            @change="findSameAttr"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="AddAttrValue"
        :disabled="!attrForm.attrName"
        >添加属性值</el-button
      >
      <el-table
        border
        :data="attrForm.attrValueList"
        style="width: 100%; margin: 20px 0"
      >
        <el-table-column label="序号" type="index" align="center" width="80">
        </el-table-column>
        <el-table-column label="属性值名称" width="width">
          <template slot-scope="{ row, $index }">
            <el-input
              size="mini"
              v-if="row.isEdit"
              v-focus
              v-model="row.valueName"
              placeholder="请输入属性值名称"
              @blur="toLook(row)"
              @keyup.native.enter="toLook(row)"
            ></el-input>
            <span
              v-else="!row.isEdit"
              @click="row.isEdit = true"
              style="display: block"
              >{{ row.valueName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="width">
          <template slot-scope="{ row, $index }">
            <el-popconfirm
              :title="`确定删除${row.valueName}吗？`"
              @onConfirm="removeSingleAttr($index)"
            >
              <HintButton
                slot="reference"
                title="删除"
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></HintButton>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        type="primary"
        @click="submitAttrVals"
        :disabled="!attrForm.attrValueList.length"
        >保存</el-button
      >
      <el-button @click="isShowAddList = false">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      attrList: [],
      categoryForm: {},
      isShowAddList: false,
      attrForm: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  methods: {
    // 获取下层属性列表
    async getAttrList() {
      const res = await this.$API.attr.getAttrList(this.categoryForm);
      if (res.code === 20000 || res.code === 200) {
        this.attrList = res.data;
      }
    },
    // 自定义事件刷新列表
    changeAttrList(categoryForm) {
      if (!categoryForm.category3Id) {
        // 列表清空
        this.attrList = [];
      } else {
        //存储id 信息
        this.categoryForm = categoryForm;
        // 发送请求 刷新列表
        this.getAttrList();
      }
      // 当变更分类时 关闭添加列表
      this.isShowAddList = false;
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
    // 添加某一属性值
    AddAttrValue() {
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id,
        valueName: "",
        isEdit: true,
      });
    },
    // 显示添加属性列表 清空输入
    showAddList() {
      this.isShowAddList = true;
      this.attrForm = {
        attrName: "",
        attrValueList: [],
        categoryId: this.categoryForm.category3Id,
        categoryLevel: 3,
      };
    },
    //  删除添加 修改属性值里面的单条属性
    removeSingleAttr(index) {
      this.attrForm.attrValueList.splice(index, 1);
    },
    // 更改属性值列表
    modifyAttrVals(row) {
      this.isShowAddList = true;
      this.attrForm = cloneDeep(row);
      this.attrForm.attrValueList.forEach((item) =>
        this.$set(item, "isEdit", false)
      );
    },
    // 保存、提交所添加的属性值
    async submitAttrVals() {
      this.attrForm.attrValueList.filter((item) => {
        console.log(1);
        if (item.valueName) {
          delete item.isEdit;
          return true;
        }
      });
      if (!this.attrForm.attrName.trim()) {
        this.$message.error("添加的属性名不能为空");
        return;
      }
      if (!this.attrForm.attrValueList.length) {
        this.$message.error("添加的属性值列表不能为空");
        return;
      }
      try {
        const res = await this.$API.attr.addOrUpdate(this.attrForm);
        if (res.code === 20000 || res.code === 200) {
          this.$message.success(
            this.attrForm.id ? "修改商品属性成功" : "添加商品属性成功"
          );
        } else {
          this.$message.error("提交参数错误");
        }
        this.isShowAddList = false;
        this.getAttrList();
      } catch (error) {
        this.$message.error("提交失败");
      }
    },
    // 添加属性值不能重复
    findSameAttr(value) {
      if (!this.attrForm.id) {
        const res = this.attrList.find((item) => item.attrName === value);
        this.attrForm.attrValueList = res ? cloneDeep(res).attrValueList : [];
      }
    },
    // 离开焦点
    toLook(row) {
      row.valueName = row.valueName.trim();
      if (row.valueName) {
        if (
          this.attrForm.attrValueList.some(
            (item) => item !== row && item.valueName === row.valueName
          )
        ) {
          this.$message.error("请勿输入重复信息");
        } else {
          row.isEdit = false;
        }
      }
    },
  },
  // 自动聚焦 v-focus
  directives: {
    focus: {
      inserted(el) {
        el.children[0].focus();
      },
    },
  },
};
</script>

<style scoped lang="scss">
.el-tag {
  margin-right: 5px;
}
</style>
