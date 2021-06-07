<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="showAddDialog"
      >添加</el-button
    >
    <!-- 商品列表 -->
    <el-table :data="trademarkList" style="width: 100%; margin: 20px 0" border>
      <el-table-column
        prop="date"
        label="序号"
        type="index"
        width="80"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="{ row, $index }">
          <img
            :src="row.logoUrl"
            style="width: 80px; height: 80px"
            alt="logo"
          />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template>
          <el-button type="warning" icon="el-icon-edit" size="mini"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="text-align: center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="3"
      layout="  prev, pager, next, jumper,->,sizes,total"
      :total="total"
    >
    </el-pagination>
    <!-- dialog -->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <el-form :model="tmForm" style="width: 80%">
        <el-form-item label="品牌名称" :label-width="formLabelWidth">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    return {
      trademarkList: [],
      page: 1,
      limit: 3,
      total: 0,
      dialogFormVisible: false,
      tmForm: {
        logoUrl: "",
        tmName: "",
      },
      formLabelWidth: "100px",
    };
  },
  methods: {
    // 请求商品列表
    async getTrademarkList() {
      try {
        const res = await this.$API.trademark.getTrademarkList(
          this.page,
          this.limit
        );
        if (res.code === 20000 || res.code === 200) {
          this.trademarkList = res.data.records;
          this.total = res.data.total;
        } else {
          alert("请求参数错误" + res.message);
        }
      } catch (error) {
        alert("请求失败" + error.message);
      }
    },
    // 切换当前页
    handleCurrentChange(page) {
      this.page = page;
      this.getTrademarkList();
    },
    // 切换每页显示数量
    handleSizeChange(size) {
      this.limit = size;
      this.getTrademarkList();
    },
    // 显示添加界面
    showAddDialog() {
      this.dialogFormVisible = true;
    },
    // 上传图片之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 上传成功
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data;
    },
  },
  mounted() {
    this.getTrademarkList();
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
