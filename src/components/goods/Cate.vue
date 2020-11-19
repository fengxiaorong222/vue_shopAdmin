<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddgoodsDialog">添加商品</el-button>
        </el-col>
      </el-row>
      <el-col>
        <!-- 表格 -->
        <el-table
          :data="cateList"
          style="width: 100%; margin-bottom: 20px"
          row-key="cat_id"
          border
        >
          <el-table-column type="index" width="50" label="#"> </el-table-column>
          <el-table-column prop="cat_name" label="分类名称" width="180">
          </el-table-column>
          <el-table-column prop="cat_deleted" label="是否有效">
            <template slot-scope="scope">
              <i
                style="color: lightgreen"
                v-if="scope.row.cat_deleted == false"
                class="el-icon-success"
              ></i>
              <i v-else style="color: red" class="el-icon-error"></i>
            </template>
          </el-table-column>
          <el-table-column prop="cat_level" label="排序" sortable>
            <template slot-scope="scope">
              <el-tag v-if="scope.row.cat_level == 0" size="mini">一级</el-tag>
              <el-tag
                v-else-if="scope.row.cat_level == 1"
                size="mini"
                type="success"
                >二级</el-tag
              >
              <el-tag v-else size="mini" type="warning">三级</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template>
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="showEditCateDialog()"
                >编辑</el-button
              >
              <el-button type="danger" size="mini" icon="el-icon-delete"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

      </el-col>
      <el-col>
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryinfo.pagenum"
          :page-sizes="[5, 10, 30, 50]"
          :page-size="queryinfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-col>
    </el-card>
    <!-- 添加商品对话框-->
    <el-dialog
  title="添加商品"
  :visible.sync="AddgoodsDialogVisible"
  width="50%"
  >
<div class="block">
  <span class="demonstration">分类</span>
  <el-cascader
    v-model="cascader_model"
    :options="Addgoodsmenu"
    :props="{label:'cat_name',value:'cat_id',children:'children'}"
    @change="handleChange"></el-cascader>
</div>

    <el-button @click="AddgoodsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="AddgoodsDialogVisible = false">确 定</el-button>

</el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //商品分类数据
      cateList: [],
      queryinfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //总数据
      total:null,
      //添加商品对话框
      AddgoodsDialogVisible:false,
      Addgoodsmenu:[],
      Addgoods:{},
      cascader_model:[]
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      const { data: res } = await this.$http.request({
        url: "/categories",
        method: "get",
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
        params: { ...this.queryinfo },
      });
      if (res.meta.status == 200) {
        this.$message.success("获取商品分类成功!");
        this.cateList = res.data.result;
        this.total = res.data.total;
        // console.log(res.data.total)
        console.log(this.cateList);
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    /* 分页 */
    //每条页数改变触发
    handleSizeChange(pagesize) {
      this.queryinfo.pagesize = pagesize;
    },
    //当前页改变触发
    handleCurrentChange(pagenum) {
      this.queryinfo.pagenum = pagenum;
    },
    /* 添加商品对话框 */
   async showAddgoodsDialog(){
      //获得商品分类数据
    const {data:res} =await this.$http.request({
        url: "/categories",
        method: "get",
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
        params: { type:2 }
      })
      // console.log(res)
      if(res.meta.status==200){
        this.Addgoodsmenu=res.data
        console.log(this.Addgoodsmenu)
         this.AddgoodsDialogVisible=true
        this.$message.success(res.meta.msg)
      }else{
        this.$message.error(res.meta.msg)
      }
    },
    handleChange(){}
  },
};
</script>
<style lang="less" scoped>
</style>