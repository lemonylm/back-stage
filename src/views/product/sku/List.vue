<template>
  <div>
    <el-card>
      <el-table
        border
        empty-text="暂无数据"
        :data="skuList"
        :stripe="true"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column type="index" align="center" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="skuDesc" label="描述" width="width">
        </el-table-column>
        <el-table-column label="默认图片" width="150">
          <template slot-scope="{ row, $index }">
            <img :src="row.skuDefaultImg" style="width: 80px; height: 60px" />
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="重量(KG)" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格(元)" width="80">
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="{ row, $index }">
            <HintButton
              v-if="row.isSale === 0"
              type="info"
              title="上架"
              size="mini"
              icon="el-icon-top"
              @click="onSale(row.id)"
            ></HintButton>
            <HintButton
              v-else
              type="success"
              title="下架"
              size="mini"
              icon="el-icon-bottom"
              @click="soldOut(row.id)"
            ></HintButton>
            <HintButton
              title="修改"
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="toUpdateSku(row.id)"
            />

            <HintButton
              title="查看详情"
              type="info"
              size="mini"
              icon="el-icon-info"
              @click="showSkuInfo(row.id)"
            />

            <el-popconfirm
              :title="`确定删除 ${row.skuName} 吗`"
              @onConfirm="deleteSku(row.id)"
            >
              <hint-button
                style="margin-left: 10px"
                slot="reference"
                type="danger"
                size="mini"
                icon="el-icon-delete"
                title="删除"
              ></hint-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align: center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[5, 10, 15]"
        :page-size="limit"
        layout=" prev, pager, next, jumper ,->, sizes,total"
        :total="total"
      >
      </el-pagination>
      <el-drawer :visible.sync="isShowSkuInfo" class="sku-drawer" size="50%">
        <el-row>
          <el-col :span="5">名称</el-col>
          <el-col :span="16">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">描述</el-col>
          <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
        </el-row>

        <el-row>
          <el-col :span="5">价格</el-col>
          <el-col :span="16">{{ skuInfo.price }} 元</el-col>
        </el-row>

        <el-row>
          <el-col :span="5">平台属性</el-col>
          <el-col :span="18">
            <el-tag
              type="success"
              style="margin-right: 5px"
              v-for="value in skuInfo.skuAttrValueList"
              :key="value.id"
              >{{ value.attrId + "-" + value.valueId }}</el-tag
            >
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5">商品图片</el-col>
          <el-col :span="16">
            <el-carousel height="400px" class="sku-carousel" trigger="hover">
              <el-carousel-item
                v-for="item in skuInfo.skuImageList"
                :key="item.id"
              >
                <img :src="item.imgUrl" />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </el-drawer>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      skuList: [],
      loading: false,
      page: 1,
      limit: 10,
      total: 0,
      skuInfo: {},
      isShowSkuInfo: false,
    };
  },
  methods: {
    // 获取skuList列表
    async getSkuList() {
      this.loading = true;
      const res = await this.$API.sku.getList(this.page, this.limit);
      if (res.code === 20000 || res.code === 200) {
        this.skuList = res.data.records;
        this.total = res.data.total;
        this.loading = false;
      }
    },
    // 更改每页显示数量
    handleSizeChange(size) {
      this.limit = size;
      this.getSkuList();
    },
    // 更改当前页
    handleCurrentChange(page) {
      this.page = page;
      this.getSkuList();
    },
    // 上架商品
    async onSale(id) {
      const res = await this.$API.sku.onSale(id);
      if (res.code === 20000 || res.code === 200) {
        this.$message.success("上架成功");
        this.getSkuList();
      }
    },
    // 下架商品
    async soldOut(id) {
      const res = await this.$API.sku.cancelSale(id);
      if (res.code === 20000 || res.code === 200) {
        this.$message.success("下架成功");
        this.getSkuList();
      }
    },
    // 修改sku
    toUpdateSku(id) {
      this.$message.info("正在开发中");
    },
    // 查看sku信息
    async showSkuInfo(id) {
      this.isShowSkuInfo = true;
      const res = await this.$API.sku.get(id);
      if (res.code === 20000 || res.code === 200) {
        this.skuInfo = res.data;
      } else {
        this.$message.error("获取失败");
      }
    },
    // 删除sku
    async deleteSku(id) {
      const res = await this.$API.sku.remove(skuId);
      if (res.code === 20000 || res.code === 200) {
        this.$message.success("删除SKU成功");
        this.getSkuList();
      } else {
        this.$message.error("删除SKU失败");
      }
    },
  },

  mounted() {
    this.getSkuList();
  },
};
</script>

<style scoped lang="scss">
.sku-drawer {
  .el-row {
    height: 40px;
    .el-col {
      line-height: 40px;
      &.el-col-5 {
        font-size: 18px;
        font-weight: bold;
        text-align: right;
        margin-right: 20px;
      }
    }
  }
  .sku-carousel {
    width: 400px;
    border: 1px solid #ccc;
    img {
      width: 400px;
      height: 400px;
    }
  }
  ::v-deep .el-carousel__indicator {
    button {
      display: inline-block;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: hotpink;
    }
    &.is-active {
      button {
        background-color: purple;
      }
    }
  }
}
</style>
