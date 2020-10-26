<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="header_left">
        <img src="@/assets/logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-botton" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409BFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="$route.path"
        >
          <!-- 一级菜单模板区域 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
            >
              <i class="el-icon-menu"></i>
              <span slot="title">{{ subitem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边内容 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      // 左侧菜单图标
      iconObj: {
        125: "el-icon-user-solid",
        103: "el-icon-s-tools",
        101: "el-icon-s-goods",
        102: "el-icon-s-order",
        145: "el-icon-s-marketing",
      },
      // 左侧是否折叠
      isCollapse: false,
    };
  },
  created() {

  },
  async mounted() {
    // 获取左侧菜单数据
    this.menulist = await this.getMenulist();
  },
  computed: {},

  methods: {
    /* 
      退出
    */
    loginout() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
    },

    /* 
    获取左侧菜单数据
    */
    async getMenulist() {
      const { data: res } = await this.$http.request({
        url: "/menus",
        method: "get",
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
      });
      //判断数据是否获取成功
      if (res.meta.status == 200) {
        return res.data;
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    /* 
    点击按钮切换菜单的折叠/展开
    */
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  .header_left {
    display: flex;
    align-items: center;
    img {
      width: 60px;
      height: 60px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}

.toggle-botton {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>