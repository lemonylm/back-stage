<template>
  <div>
    <el-form label-width="100px" :model="skuForm">
      <el-form-item label="SPU名称"> {{ spuName }} </el-form-item>
      <!-- SKU名称 -->
      <el-form-item label="SKU名称">
        <el-input
          v-model="skuForm.skuName"
          placeholder="请输入SKU名称"
        ></el-input>
      </el-form-item>
      <!-- 价格(元) -->
      <el-form-item label="价格(元)">
        <el-input
          v-model="skuForm.price"
          placeholder="价格(元)"
          type="number"
        ></el-input>
      </el-form-item>
      <!-- 重量(千克)-->
      <el-form-item label="重量(千克)">
        <el-input
          v-model="skuForm.weight"
          placeholder="重量(千克)"
          type="number"
        ></el-input>
      </el-form-item>
      <!--规格描述  -->
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          v-model="skuForm.skuDesc"
          rows="4"
          placeholder="规格描述"
        ></el-input>
      </el-form-item>
      <!-- 平台属性-->
      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="100px">
          <el-form-item
            :label="attr.attrName"
            v-for="attr in attrList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrIdValueId">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!--  销售属性-->
      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="100px">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="(saleAttr, index) in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-select
              v-model="saleAttr.saleAttrIdValueId"
              placeholder="请选择"
            >
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <!-- 图片列表 -->
      <el-form-item label="图片列表">
        <el-table
          :data="spuImageList"
          style="width: 100%"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="selection" width="55">
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row, $index }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                style="width: 100px"
                :type="row.isDefault === '0' ? 'primary' : 'success'"
                @click="handleDefaultSetting(row, spuImageList)"
                >{{ row.isDefault === "0" ? "设为默认" : `默  认` }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- 保存&操作 -->
      <el-form-item>
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      spuName: "",
      attrList: [],
      spuSaleAttrList: [],
      spuImageList: [],
      skuForm: {
        category3Id: "",
        spuId: "",
        tmId: "",

        skuName: "",
        price: "",
        weight: "",
        skuDesc: "",

        skuDefaultImg: "",
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
        skuImageList: [],
      },
    };
  },
  methods: {
    // 初始化页面发送请求获取数据
    async initSkuInfo(row, categoryForm) {
      this.spuName = row.spuName;
      this.skuForm.category3Id = categoryForm.category3Id;
      this.skuForm.spuId = row.id;
      this.skuForm.tmId = row.tmId;
      // 获取categoryForm列表
      const p1 = this.$API.attr.getAttrList(categoryForm);
      // 获取spu销售属性列表
      const p2 = this.$API.sku.getSpuSaleAttrList(row.id);
      // 获取spu的图片列表
      const p3 = this.$API.sku.getSpuImageList(row.id);

      const res = await Promise.all([p1, p2, p3]);
      this.attrList = res[0].data;
      this.spuSaleAttrList = res[1].data;
      res[2].data.forEach((item) => (item.isDefault = "0"));
      this.spuImageList = res[2].data;
    },
    // 选中表格CheckBox执行的回调
    handleSelectionChange(imgList) {
      this.skuForm.skuImageList = imgList;
      const res = this.skuForm.skuImageList.every(
        (item) => item.isDefault === "0"
      );
      if (res) {
        this.spuImageList.forEach((item) => (item.isDefault = "0"));
      }
    },
    // 设为默认按钮的回调
    handleDefaultSetting(cur, list) {
      const isInclude = this.skuForm.skuImageList.includes(cur);
      if (!isInclude) {
        this.$message.warning("请您先选择该图片");
        return;
      }
      list.forEach((item) => (item.isDefault = "0"));
      cur.isDefault = "1";
      this.skuForm.skuDefaultImg = cur.imgUrl;
    },
    // 处理提交信息
    async handleSave() {
      // 照片列表
      this.skuForm.skuImageList = this.skuForm.skuImageList.map((item) => ({
        imgName: item.imgName,
        imgUrl: item.imgUrl,
        isDefault: item.isDefault,
        spuImgId: item.id,
      }));
      // 平台属性
      this.skuForm.skuAttrValueList = this.attrList.reduce((prev, cur) => {
        if (cur.attrIdValueId) {
          let [attrId, valueId] = cur.attrIdValueId.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      // 销售属性
      this.skuForm.skuSaleAttrValueList = this.spuSaleAttrList.reduce(
        (prev, cur) => {
          if (cur.saleAttrIdValueId) {
            let [saleAttrId, saleAttrValueId] =
              cur.saleAttrIdValueId.split(":");
            prev.push({ saleAttrId, saleAttrValueId });
          }
          return prev;
        },
        []
      );
      // 发请求
      try {
        const res = await this.$API.sku.addUpdate(this.skuForm);
        if (res.code === 20000 || res.code === 200) {
          this.$message.success("保存sku成功");
          this.$emit("update:visible", false);
          Object.assign(this._data, this.$options.data());
        } else {
          this.$message.error("提交参数错误" + error.message);
        }
      } catch (error) {
        this.$message.error("保存sku失败" + error.message);
      }
    },
    // 处理取消
    handleCancel() {
      this.$emit("update:visible", false);
      Object.assign(this._data, this.$options.data());
    },
  },
};
</script>

<style scoped lang="scss">
</style>
