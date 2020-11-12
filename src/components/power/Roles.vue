<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色 -->

      <el-button type="primary" @click="showAddUserDialog">添加角色</el-button>
      <!-- 列表 -->
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- <el-form label-position="left" inline> -->

            <el-row
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', index1 == 0 ? 'bdtop' : '', 'v-center']"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  size="medium"
                  closable
                  @close="removeRightsById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限和三级权限 -->
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="[index2 != 0 ? 'bdtop' : '', 'v-center']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightsById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightsById(scope.row, item3.id)"
                      >{{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <el-table-column label="#" type="index" width="50"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
            @click="showEditUserDialog(scope.row)"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
             @click="delUser(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="SetRightdialogVisible"
      width="50%"
      @close="closeSetRightDialog"
    >
      <el-tree
        :data="treeData"
        :props="treeDefaultProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defTree"
        ref="treeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSetRightDialog">取 消</el-button>
        <el-button type="primary" @click="RoleAuthorized">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addUserDialog"
      width="50%"
      @close="closeAddUserDialog"
    >
      <el-form label-width="80px" :model="addUserInfo" ref="addUserRef">
        <el-form-item
          required
          hide-required-asterisk
          :rules="[{ required: true, message: '角色名称不能为空' }]"
          label="角色名称"
          prop="roleName"
        >
          <el-input v-model="addUserInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addUserInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddUserDialog">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
        <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editUserDialog"
      width="50%"
      @close="closeEditUserDialog"
    >
      <el-form label-width="80px" :model="editUserInfo" ref="editUserRef">
        <el-form-item
          required
          hide-required-asterisk
          :rules="[{ required: true, message: '角色名称不能为空' }]"
          label="角色名称"
          prop="roleName"
        >
          <el-input v-model="editUserInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editUserInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditUserDialog">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      /* 分配权限对话框 */
      SetRightdialogVisible: false,
      //树形数据
      treeData: [],
      //树形组件控件
      treeDefaultProps: {
        children: "children",
        label: "authName",
      },
      //默认勾选节点id数组
      defTree: [],
      //当前角色id
      roleID: "",
      //添加角色
      addUserDialog: false,
      addUserInfo: {
        //角色名称和角色描述
        roleName: "",
        roleDesc: "",
      },
      //编辑角色 
      editUserDialog:false,
      editUserInfo:{
          id:'',
          roleName:'',
          roleDesc:''
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      const { data: res } = await this.$http.request({
        url: "/roles",
        method: "get",
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
      });
      if (res.meta.status == 200) {
        this.tableData = res.data;
        this.$message.success(res.meta.msg);
      } else {
        this.$message.error("获取角色列表失败");
      }
      // console.log(res);
    },
    /* 根据id删除权限 */
    removeRightsById(role, rightIdss) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.request({
            url: `/roles/${role.id}/rights/${rightIdss}`,
            method: "delete",
            headers: {
              Authorization: sessionStorage.getItem("token"),
            },
          });
          if (res.meta.status == 200) {
            this.$message({
              type: "success",
              message: "删除权限成功!",
            });
            /* 
          删除成功后,重新调用权限列表会刷新页面，用户体验不好。
          调用删除接口返回的数据是最新的权限，
          最新的权限赋值给权限列表,因为引用类型指向同一内存空间
          所以赋值给role.children会更新数据 */
            role.children = res.data;
          } else {
            this.$message({
              type: "error",
              message: "删除权限失败",
            });
          }

          // console.log(role, rightIdss);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /* 显示分配权限的对话框 */
    async showSetRightDialog(row) {
      //获取所有三级权限id保存到defTree
      this.getNodeKey(row, this.defTree);
      //当前角色id
      this.roleID = row.id;
      this.SetRightdialogVisible = true;
      const { data: res } = await this.$http.request({
        url: "/rights/tree",
        method: "get",
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
      });
      if (res.meta.status == 200) {
        this.$message.success(res.meta.msg);
        // 获取数据成功
        this.treeData = res.data;
      } else {
        this.$message.error(res.meta.msg);
      }
    },

    /* 通过递归的形式，保存当前角色下所有三级权限的id
    并保存到defTree中 */
    getNodeKey(node, arr) {
      // 如果这个数组中不包含children属性，则不是三级节点
      // 包含children属性，是三级节点
      if (!node.children) {
        //是三级节点
        return arr.push(node.id);
      }

      //不是三级节点，递归调用
      node.children.forEach((item) => {
        this.getNodeKey(item, arr);
      });
    },
    /* 关闭分配权限的对话框清空默认勾选节点id数组
     defTree */
    closeSetRightDialog() {
      this.SetRightdialogVisible = false;
      this.defTree = [];
    },
    /* 分配权限对话框点击确定授权 */
    async RoleAuthorized() {
      //getCheckedKeys返回目前被选中的节点的 key 所组成的数组
      //getHalfCheckedKeys则返回目前半选中的节点的 key 所组成的数组
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const ids = keys.join(",");
      const { data: res } = await this.$http.request({
        url: `roles/${this.roleID}/rights`,
        method: "post",
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
        data: {
          rids: ids,
        },
      });
      if (res.meta.status == 200) {
        this.SetRightdialogVisible = false;
        //更新成功
        this.$message.success(res.meta.msg);

        this.getList();
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    /* 添加角色对话框 */
    showAddUserDialog() {
      this.addUserDialog = true;
    },
    /* 添加角色 */
    addUser() {
      //预校验
      this.$refs.addUserRef.validate(async (vaild) => {
        if (!vaild) {
          this.$message.error("角色名称不能为空");
        }
      const {data:res} =await this.$http.request({
          url: "roles",
          method: "post",
          headers: {
            Authorization: sessionStorage.getItem("token"),
          },
          data: {
            roleName: this.addUserInfo.roleName,
            roleDesc: this.addUserInfo.roleDesc,
          },
        });
        if(res.meta.status==201){
          this.getList()
          this.$message.success("角色创建成功!")
          this.addUserDialog = false;
        }else{
          this.$message.error(res.meta.msg)
        }
      });
    },
    /* 关闭添加角色对话框清空数据 */
    closeAddUserDialog() {
      this.addUserDialog = false;
     this.$refs.addUserRef.resetFields();
    },
    /* 编辑角色对话框 */
    showEditUserDialog(row){
  
      this.editUserInfo.id=row.id
      this.editUserInfo.roleName=row.roleName
      this.editUserInfo.roleDesc=row.roleDesc
      this.editUserDialog=true
    },
    /* 编辑角色 */
    editUser(){
      //预校验
      this.$refs.editUserRef.validate(async(vaild)=>{
        if(!vaild){
        this.$message.error("角色名称不能为空");
        }
        const {data:res} =await this.$http.request({
          url: `roles/${this.editUserInfo.id}`,
          method: "put",
          headers: {
            Authorization: sessionStorage.getItem("token"),
          },
          data: {
            roleName: this.editUserInfo.roleName,
            roleDesc: this.editUserInfo.roleDesc
          }
        });
        if(res.meta.status==200){
          this.$message.success('编辑角色成功!');
          this.getList()
          this.editUserDialog=false;
        }else{
          this.$message.error(res.meta.msg);
        }
        
      })
    },
    /* 关闭编辑角色对话框清空数据 */
    closeEditUserDialog(){
        this.editUserDialog=false
        this.$refs.editUserRef.resetFields()
    },
    /* 删除角色 */
    delUser(id){
          this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const {data:res} =await this.$http.request({
          url: `roles/${id}`,
          method: "delete",
          headers: {
            Authorization: sessionStorage.getItem("token"),
          }
        });
        if(res.meta.status==200){
               this.$message({
            type: 'success',
            message: '删除角色成功!'
          });
          this.getList()
        }else{
                   this.$message({
            type: 'error',
            message: res.meta.msg
          });
        }


        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.v-center {
  display: flex;
  align-items: center;
}
</style>