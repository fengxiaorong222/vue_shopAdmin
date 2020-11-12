<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格区域 -->
    <el-card>
      <el-table border :data="tableData" stripe style="width: 100%">
        <el-table-column label="#" type="index" width="50"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0" size="medium">一级权限</el-tag>
            <el-tag v-else-if="scope.row.level == 1" type="success"
              >二级权限</el-tag
            >
            <el-tag v-else-if="scope.row.level == 2" type="warning"
              >三级权限</el-tag
            >
            <el-tag v-else type="danger">未定义的权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: {},
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      const { data: res } = await this.$http.request({
        url: "/rights/list",
        method: "get",
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
      });
      if (res.meta.status == 200) {
        this.tableData = res.data;
        this.$message.success(res.meta.msg);
      } else {
        this.$message.error("获取权限列表失败");
      }
    //   console.log(res.data);
    },
  },
};
</script>

<style lang="less" scoped>
/* 面包屑导航 */
.el-breadcrumb {
  font-size: 14px;
}
</style>