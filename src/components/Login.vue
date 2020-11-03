<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        :model="loginForm"
        :rules="rules"
        label-width="0px"
        class="login_form"
        ref="loginForm"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <!--密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm('loginForm')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "用户名长度3~10个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 10, message: "密码长度6~10", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //登录
    login() {
      //用户名密码
      let logindata=this.loginForm
      //用户名密码提交前校验
      this.$refs.loginForm.validate(async(bool) => {
        // 校验失败 false
        if (!bool) {
          return;
        } else {
          //bool值为true 校验成功
        let {data:res}= await this.$http.request({
            url: "/login",
            method: "post",
           data:{
             ...logindata
           }  
          });
          if(res.meta.status==200){
            //登录成功跳转到主页
             this.$message.success({message:'登录成功',duration:1000})
             window.sessionStorage.setItem('token',res.data.token)
              this.$router.push('/home')
          }else{
            //登录失败
               this.$message.error('登录失败')
            
          }
        }
      });
    },

    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box; /* 盒子不会溢出 */
  // https://www.bilibili.com/video/BV1EE411B7SU?p=17
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>