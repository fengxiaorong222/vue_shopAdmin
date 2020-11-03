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
          <el-input
            placeholder="请输入内容"
            v-model="queryinfo.query"
            clearable
            @clear="getUserlist"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserlist"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
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
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDailog(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delDialogVisible(scope.row.id)"
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
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除用户的对话框 -->
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/;
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback();
      }
      callback(new Error("请输入合法邮箱"));
    };
    // 自定义手机号规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      // 返回一个错误提示
      callback(new Error("请输入合法的手机号码"));
    };
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
      //添加用户的显示隐藏
      addDialogVisible: false,
      //编辑用户对话框隐藏显示
      editDialogVisible: false,
      //添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //编辑用户的表单数据
      editForm: {},
      //添加用户的校验规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "用户名长度3~10个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 10, message: "密码长度6~10", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      //编辑用户的校验规则
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
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
      this.$http
        .request({
          //  users/:uId/state/:type
          url: `users/${userinfo.id}/state/${userinfo.mg_state}`,
          method: "put",
          headers: {
            Authorization: sessionStorage.getItem("token"),
          },
        })
        .then((res) => {
          if (res.data.meta.status == 200) {
            this.$message.success("更新用户状态成功！");
          } else {
            userinfo.mg_state = !userinfo.mg_state;
            this.$message.error("更新用户状态失败！");
          }
        });
    },
    /* 
   监听添加对话框的关闭事件
   关闭对话框时，清空数据
    */
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    /* 
   监听修改对话框的关闭事件
   关闭对话框时，清空数据
    */
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    /* 
    新增用户
    */
    addUser() {
      //预校验
      this.$refs.addFormRef.validate(async (callback) => {
        if (callback === true) {
          //预校验成功，发起请求添加用户
          let { data: res } = await this.$http.request({
            url: "/users",
            method: "post",
            headers: {
              Authorization: sessionStorage.getItem("token"),
            },
            data: this.addForm,
          });
          if (res.meta.status === 201) {
            this.$message.success(res.meta.msg);
            //关闭窗口
            this.addDialogVisible = false;
            //刷新用户数据
            this.getUserlist();
          } else {
            return this.$message.error(res.meta.msg);
          }
        } else {
          //预校验失败
          return this.$message.error("输入格式有误！");
        }
      });
    },
    /* 
    修改用户
    */
    editUser() {
      //预校验
      this.$refs.editFormRef.validate(async (callback) => {
        if (callback == true) {
          //预校验成功
          //发送网络请求
          let { data: res } = await this.$http.request({
            url: "/users/" + this.editForm.id,
            method: "put",
            headers: {
              Authorization: sessionStorage.getItem("token"),
            },
            data: {
              email: this.editForm.email,
              mobile: this.editForm.mobile,
            },
          });
          if (res.meta.status == 200) {
            this.editDialogVisible = false;
            this.getUserlist();
            return this.$message.success("修改用户成功");
          } else {
            this.$message.error("修改用户失败");
          }
          console.log(res);
        } else {
          return this.$message.error("输入格式有误！");
        }
      });
    },

    /* 
    修改用户对话框
    */
    async showEditDailog(id) {
      this.editDialogVisible = true;
      let { data: res } = await this.$http.request({
        url: "users/" + id,
        method: "get",
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
      });
      //查询成功
      if (res.meta.status == 200) {
        this.editForm = res.data;
      } else {
        this.$message.error("获取用户信息失败!");
        this.editDialogVisible = false;
        return;
      }
      console.log(res);
    },
    /* 
    删除用户对话框
    */
    delDialogVisible(id) {
      //询问用户是否删除
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //用户点击确定
          //发送请求删除数据
          const { data: res } = await this.$http.request({
            url: "/users/" + id,
            method: "delete",
            headers: {
              Authorization: sessionStorage.getItem("token"),
            },
          });
          if (res.meta.status == 200) {
            this.$message.success("删除用户成功!");
            this.getUserlist();
            return;
          } else {
            return this.$message.error("删除用户失败!");
          }
        })
        .catch(() => {
          //用户点击取消
          this.$message.info("已取消删除!");
        });
    },
  },
};
</script>

<style scoped>
</style>