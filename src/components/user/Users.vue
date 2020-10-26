<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <el-card>
      <!-- 搜索和添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryinfo.query" clearable @clear="getUserlist">
            <el-button slot="append" icon="el-icon-search" @click="getUserlist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope>
            <!-- 修改 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
            ></el-button>
            <!-- 删除 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
            ></el-button>
            <!-- 分配角色 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //当前用户列表
      userlist: [],
      //数据总条数
      total: 0,
      //用户列表传递的参数
      queryinfo: {
        query: "",
        //当前的页数
        pagenum: 1,
        //当前每一页显示多少条
        pagesize: 5,
      },
    };
  },
  mounted() {
    this.getUserlist();
  },
  methods: {
    /* 
      获取用户列表
      */
    async getUserlist() {
      const { data: res } = await this.$http.request({
        url: "/users",
        method: "get",
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
        params: {
          ...this.queryinfo,
        },
      });
      //判断数据是否获取成功
      if (res.meta.status == 200) {
        this.total = res.data.total;
        this.userlist = res.data.users;
      } else {
        return this.$message.error(res.meta.msg);
      }
    },
    /* 
    监听pagesize改变的事件
    每一页显示多少条
    */
    async handleSizeChange(newSize) {
      this.queryinfo.pagesize = newSize;
      this.getUserlist();
    },
    /* 
    监听页码值改变事件
    页码改变时
    */
    handleCurrentChange(newPge) {
      this.queryinfo.pagenum = newPge;
      this.getUserlist();
    },
    /* 
    修改用户的状态
    开启/关闭
    */
    userStateChanged(userinfo) {
      this.$http.request({
        //  users/:uId/state/:type
        url: `users/${userinfo.id}/state/${userinfo.mg_state}`,
        method: "put",
        headers: {
          Authorization: sessionStorage.getItem("token"),
        }
      }).then(res=>{
        if(res.data.meta.status==200){
            this.$message.success("更新用户状态成功！")
        }else{
            userinfo.mg_state=!userinfo.mg_state
            this.$message.error("更新用户状态失败！")
        }
      });
    },
  },
};
</script>

<style scoped>
</style>