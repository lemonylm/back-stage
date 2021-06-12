<template>
  <div>
    <el-card>
      <CategorySelector
        :isShowcategorySelector="!isShowSpuForm && !isShowSkuForm"
        @changeAttrList="changeSpuList"
      ></CategorySelector>
    </el-card>
    <el-card style="margin-top: 20px">
      <!-- 默认页 -->
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="AddSPU"
          :disabled="!categoryForm.category3Id"
          >添加SPU</el-button
        >
        <el-table :data="spuList" border style="width: 100%">
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <HintButton
                title="添加sku"
                type="success"
                size="mini"
                icon="el-icon-plus"
                @click="AddSku(row)"
              ></HintButton>
              <HintButton
                title="修改spu"
                type="warning"
                size="mini"
                icon="el-icon-edit"
                @click="modifySPU(row)"
              ></HintButton>
              <HintButton
                title="查看当前spu的sku列表"
                type="info"
                size="mini"
                icon="el-icon-info"
              ></HintButton>
              <el-popconfirm
                :title="`确定删除${row.spuName}吗？`"
                @onConfirm="removeSpu(row)"
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
        <el-pagination
          background
          :pager-count="7"
          style="text-align: center"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout=" prev, pager, next, jumper ,->, sizes,total"
          :total="total"
        >
        </el-pagination>
      </div>
      <!-- 添加spu页 -->
      <SpuForm
        :c3Id="categoryForm.category3Id"
        v-show="isShowSpuForm"
        ref="spuForm"
        :visible.sync="isShowSpuForm"
        @backToList="backToList"
      >
      </SpuForm>
      <!-- 添加sku页 -->
      <SkuForm ref="skuForm" v-show="isShowSkuForm" :visible.sync="isShowSkuForm"></SkuForm>
    </el-card>
  </div>
</template>

<script>
import SpuForm from "./components/SpuForm";
import SkuForm from "./components/SkuForm";

export default {
  name: "Spu",
  components: {
    SpuForm,
    SkuForm,
  },
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      isShowSpuForm: false,
      isShowSkuForm: false,
      spuList: [],
      categoryForm: {},
    };
  },
  methods: {
    // 分页器 页面每页展示数量
    handleSizeChange(size) {
      this.limit = size;
      this.getSpuList();
    },
    // 分页器 修改当前页
    handleCurrentChange(page) {
      this.page = page;
      this.getSpuList();
    },
    //更改category刷新spu列表
    changeSpuList(categoryForm) {
      if (!categoryForm.category3Id) {
        this.spuList = [];
      } else {
        this.categoryForm = categoryForm;
        this.getSpuList();
      }
    },
    // 获取spu列表
    async getSpuList() {
      const res = await this.$API.spu.getList(
        this.page,
        this.limit,
        this.categoryForm.category3Id
      );
      if (res.code === 20000 || res.code === 200) {
        this.spuList = res.data.records;
        this.total = res.data.total;
      }
    },
    // 添加SPU按钮跳转发请求
    AddSPU() {
      this.isShowSpuForm = true;
      this.$refs.spuForm.getInitSpuFormData();
    },
    // 修改SPU按钮跳转发请求
    modifySPU(row) {
      this.isShowSpuForm = true;
      this.$refs.spuForm.getUpdateSpuFormData(row);
    },
    // spu页返回list页 页面跳转
    backToList(page) {
      page && (this.page = 1);
      this.getSpuList();
    },
    // 清除一个spu
    async removeSpu(row) {
      try {
        const res = await this.$API.spu.remove(row.id);
        if (res.code === 20000 || res.code === 200) {
          this.$message.success("删除spu成功");
          this.spuList.length > 1 ? this.page : (this.page -= 1);
          this.getSpuList();
        } else {
          this.$message.warning("删除spu失败");
        }
      } catch (error) {
        this.$message.warning("删除spu失败" + error.message);
      }
    },
    // 添加sku按钮跳转发请求
    AddSku(row) {
      this.isShowSkuForm = true;
      this.$refs.skuForm.initSkuInfo(row,this.categoryForm)
    },
  },
};
</script>

<style scoped lang="scss">
</style>
