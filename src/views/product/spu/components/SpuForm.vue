<template>
  <div>
    <el-form :model="spuForm" label-width="100px">
      <el-form-item label="SPU名称">
        <el-input
          placeholder="请输入SPU名称"
          v-model="spuForm.spuName"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
          <el-option
            :label="trademark.tmName"
            :value="trademark.id"
            v-for="trademark in trademarkList"
            :key="trademark.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="SPU描述"
          v-model="spuForm.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="formatImgList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          v-model="attrIdName"
          :placeholder="
            attrFilter.length
              ? `还有${attrFilter.length}项`
              : '已添加所有属性！'
          "
        >
          <el-option
            v-for="val in attrFilter"
            :key="val.id"
            :label="val.name"
            :value="`${val.id}:${val.name}`"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addSaleAttr"
          :disabled="!attrIdName"
          >添加销售属性</el-button
        >
      </el-form-item>
      <el-table border :data="spuForm.spuSaleAttrList" style="width: 100%">
        <el-table-column type="index" align="center" label="序号" width="80">
        </el-table-column>
        <el-table-column label="属性名" width="150" prop="saleAttrName">
        </el-table-column>
        <el-table-column label="属性值列表" width="width">
          <template slot-scope="{ row, $index }">
            <el-tag
              :key="tag.id"
              v-for="(tag, index) in row.spuSaleAttrValueList"
              closable
              :disable-transitions="false"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
            >
              {{ tag.saleAttrValueName }}
            </el-tag>
            <el-input
              v-focus
              class="input-new-tag"
              v-if="row.inputVisible"
              v-model="row.saleAttrValueName"
              size="small"
              @keyup.enter.native="handleInputConfirm(row)"
              @blur="handleInputConfirm(row)"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput(row)"
              >+ New Tag</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="{ row, $index }">
            <el-popconfirm
              :title="`确定删除${row.saleAttrName}吗？`"
              @onConfirm="spuForm.spuSaleAttrList.splice($index, 1)"
            >
              <HintButton
                slot="reference"
                title="删除"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                >删除</HintButton
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  props: ["c3Id"],
  data() {
    return {
      attrIdName: "",
      dialogImageUrl: "",
      dialogVisible: false,

      spuForm: {
        spuName: "",
        category3Id: 0,
        description: "",
        tmId: "",
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   isChecked: "string",
          //   saleAttrName: "string",
          //   saleAttrValueName: "string",
          //   spuId: 0,
          // },
          //   ],
          // },
        ],
      },
      trademarkList: [],
      baseSaleAttrList: [],
      spuImageList: [],
    };
  },
  methods: {
    // 初始化添加spu列表请求
    async getInitSpuFormData() {
      // 获取所有商品select列表trademark

      const trademarkList = await this.$API.trademark.getList();
      //  获取4个销售属性列表
      if (trademarkList.code === 200 || trademarkList.code === 20000) {
        this.trademarkList = trademarkList.data;
      }
      const SaleAttrList = await this.$API.spu.getSaleAttrList();
      if (SaleAttrList.code === 200 || SaleAttrList.code === 20000) {
        this.baseSaleAttrList = SaleAttrList.data;
      }
    },
    // 修改spu列表
    async getUpdateSpuFormData(row) {
      this.getInitSpuFormData();
      const spuInfo = await this.$API.spu.get(row.id);
      if (spuInfo.code === 200 || spuInfo.code === 20000) {
        this.spuForm = spuInfo.data;
      }
      const SpuImageList = await this.$API.sku.getSpuImageList(row.id);
      if (SpuImageList.code === 200 || SpuImageList.code === 20000) {
        this.spuImageList = JSON.parse(JSON.stringify(SpuImageList.data));
        // this.spuImageList = SpuImageList.data;
        this.spuForm.spuImageList = SpuImageList.data;
      }
    },
    // 处理照片墙删除
    handleRemove(file, fileList) {
      this.spuForm.spuImageList = this.spuForm.spuImageList.filter(
        (item) => item.imgName !== file.name
      );
    },
    // 处理照片墙预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 处理照片上传成功的回调
    handleSuccess(res, file, fileList) {
      this.spuForm.spuImageList.push({
        imgName: file.name,
        imgUrl: res.data,
      });
    },
    // 添加saleAttr
    addSaleAttr() {
      let [baseSaleAttrId, saleAttrName] = this.attrIdName.split(":");
      this.spuForm.spuSaleAttrList.push({
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      });
      this.attrIdName = "";
    },
    // 重置数据
    resetForm() {
      // this.spuForm = {
      //   spuName: "",
      //   category3Id: 0,
      //   description: "",
      //   tmId: "",
      //   spuImageList: [],
      //   spuSaleAttrList: [],
      // };
      // this.spuImageList = [];
      // this.trademarkList = [];
      // this.saleAttrList = [];
      Object.assign(this._data, this.$options.data());
    },
    // 取消清空form
    handleCancel() {
      this.resetForm();
      this.$emit("backToList");
      this.$emit("update:visible", false);
    },
    // 显示input
    showInput(row) {
      this.$set(row, "inputVisible", true);
      this.$set(row, "saleAttrValueName", "");
    },
    // 失去input焦点
    handleInputConfirm(row) {
      row.saleAttrValueName = row.saleAttrValueName.trim();
      if (!row.saleAttrValueName) {
        row.saleAttrValueName = "";
        row.inputVisible = false;
        return;
      }
      let isRepeat = row.spuSaleAttrValueList.some(
        (item) => item.saleAttrValueName === row.saleAttrValueName
      );
      if (isRepeat) {
        this.$message.warning("属性值不能重复！");
        row.saleAttrValueName = "";
        row.inputVisible = false;
        return;
      }
      row.spuSaleAttrValueList.push({
        saleAttrValueName: row.saleAttrValueName,
        baseSaleAttrId: row.baseSaleAttrId,
      });
      row.saleAttrValueName = "";
      row.inputVisible = false;
    },
    // 保存并提交spu
    async handleSave() {
      try {
        this.spuForm.category3Id = this.c3Id;
        this.spuForm.spuSaleAttrList.forEach((item) => {
          delete item.saleAttrValueName;
          delete item.inputVisible;
        });
        const res = await this.$API.spu.addUpdate(this.spuForm);
        if (res.code === 20000 || res.code === 200) {
          this.$message.success("提交成功");
          this.resetForm();
          this.spuForm.id
            ? this.$emit("backToList")
            : this.$emit("backToList", 1);
          this.$emit("update:visible", false);
        } else {
          this.$message.error("提交失败");
        }
      } catch (error) {
        this.$message.error("提交失败" + error.message);
      }
    },
  },
  computed: {
    // 格式化imglist 以便展示
    formatImgList: {
      get() {
        return (this.spuImageList || []).map((item) => {
          return {
            name: item.imgName,
            url: item.imgUrl,
          };
        });
      },
    },

    //筛选 可用属性
    attrFilter() {
      return this.baseSaleAttrList.filter((item) =>
        this.spuForm.spuSaleAttrList.every(
          (item1) => item1.saleAttrName !== item.name
        )
      );
    },
  },
  // 自动聚焦
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
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
