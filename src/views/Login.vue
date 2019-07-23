<template>
    <div class="login">
        <!---->
        <img src="../assets/img/logo.png" alt="" style="position: absolute;top: 40px;left: 40px;">
        <!--登录页面-->
        <div class="form">
            <div class="input">
                <h1 style="text-align: left;padding-left: 80px;margin-top: 45px">欢迎登录</h1>
                <div class="user">
                    <strong>用户名</strong><input class="us" v-model="userName" type="text" placeholder="请输入用户名">
                </div>
                <div class="pass">
                    <strong>密码</strong><input class="pa" v-model="passWord" type="password" placeholder="请输入密码" @keyup.enter="login">
                </div>
                <div class="tishi">
                    用户名或密码不正确
                </div>
                <div class="butn">
                    <button @click="login">登录{{userData}}</button>
                </div>
            </div>
        </div>
        <div class="bottom_title">
            <div class="title_banquan">
                <p>版权所有：廊坊市环保局,廊坊市大气办 <span>技术支持：千人计划PM2.5特别防治小组，廊坊市智慧环境生态产业研究院</span></p>
            </div>
            <div class="img-qianren">
                <img style="width: 64px" src="../assets/img/logo_jishu.png" alt="">
            </div>
        </div>
    </div>
</template>

<script>
    import {Message} from 'element-ui';
    import api from '../api/index';
    export default {
        name: 'index',
        data() {
            return {
                userName: '',
                passWord: '',
                Role:'',
                isShow:true,
                isDuty:true
            }
        },
        mounted() {
			
            $(".us").focus(function () {
                $('.user').css('border-bottom', '1px solid #2494F2');
            });
            $(".pa").focus(function () {
                $('.pass').css('border-bottom', '1px solid #2494F2');
            });
            $(".us").blur(function () {
                $('.user').css('border-bottom', '1px solid #fff');
            });
            $(".pa").blur(function () {
                $('.pass').css('border-bottom', '1px solid #fff');
            });
        },
        computed: {
            userData() {
                this.$store.state.userData
            }
        },
        methods: {
        	 //缓存到本地
		    setlocal(name, obj) {
		        sessionStorage.setItem(name, JSON.stringify(obj))
		    },
		    //获取本地
		    getlocal(name) {
		        let data = sessionStorage.getItem(name)
		        if (data != null && data != '') {
		            try {
		                let obj = eval('(' + data + ')')
		                return obj
		            } catch (e) {
		                return ''
		            }
		        } else {
		            return ''
		        }
		    },
		    saveOperatorID() {
		    	let t = this;
				let obj = {
					'Role': t.Role,
					'isShow': t.isShow,
					'isDuty': t.isDuty
				};
				
				this.setlocal('userInfo', obj);
			},
            login() {
                const _this = this;
                sessionStorage.clear();
                let urlcon =  api.GetUserLoginRes();
                //console.log(urlcon);
                $.ajax({
                    url:urlcon ,////
                   // url: 'http://117.119.97.150:8063/api/login/UserLogin',
                    data: {
                        username: this.userName,
                        password: this.passWord
                    },
                    method: "post",
                    success: function (data) {
                        console.log(data)
                        if (data.Status > 0) {
                        	_this.Role = data.Data.Role;
                        	if(_this.Role === '普通用户'){
                                console.log('普通用户');
                        		_this.isShow = false;
                                _this.$store.state.OrdinaryUser = true;
                                _this.$store.state.Superadministrator = false;
                                _this.$store.state.responsibility = false;
                        	}else if(_this.Role === '超级管理员'){
                                console.log('超级管理员');
                        		_this.isShow = true;
                        		_this.isDuty = true;
                                _this.$store.state.OrdinaryUser = false;
                                _this.$store.state.Superadministrator = true;
                                _this.$store.state.responsibility = false;
                        	}else if(_this.Role === '责任主体'){
                        	    console.log('责任主体');
                        		_this.isShow = true;
                        		_this.isDuty = false;
                                _this.$store.state.OrdinaryUser = false;
                                _this.$store.state.Superadministrator = false;
                                _this.$store.state.responsibility = true;
                        	}
                        	_this.saveOperatorID();
                            //为简单起见，将token保存在全局变量中。
                            window.token = data.Data.Token;
                            _this.$cookies.set('auth', token, '1d', '/')
                            _this.$message({
                                message: '不忘初心，蓝天碧水！马上跳转',
                                //message: '恭喜你，登录成功马上跳转',
                                type: 'success'
                            });
                            setTimeout(function () {
                                // _this.$router.push('/')
                                _this.$router.push('/')
                            }, 2000)

                        } else {
                            //let text = data.Message;
                            //_this.$message.error(text);
                            $('.tishi').css('display', 'block');
                            $('.user').css('border-bottom', '1px solid red');
                            $('.pass').css('border-bottom', '1px solid red');
                            setTimeout(() => {
                                $('.tishi').css('display', 'none')
                                $('.user').css('border-bottom', '1px solid #fff');
                                $('.pass').css('border-bottom', '1px solid #fff');
                            }, 2000)
                        }
                    }
                });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .login {
        min-width: 1060px;
        width: 100%;
        height: 100%;
        background: url("../assets/img/bj_denglu.jpg") no-repeat center;
        background-size: cover;
        position: relative;
        .bottom_title {
            position: absolute;
            width: 100%;
            height: 50px;
            left: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.2);
            .title_banquan {
                padding-left: 18%;
                float: left;
                color: #fff;
                line-height: 50px;
                font-size: 16px;
                opacity: 0.8;
                span {
                    padding-left: 50px;
                }
            }
            .img-qianren {
                float: left;
                img {
                    margin-top: 5px;
                    padding-left: 24px;
                    width: 100px;
                }
            }
        }
        .sky {
            position: absolute;
            top: 0;
            left: 0;
        }
        .form {
            position: absolute;
            width: 497px;
            height: 410px;
            left: 60%;
            top: 17%;
            background: rgba(0, 0, 0, 0.5);
            .input {
                color: #fff;
                input {
                    width: 240px;
                    height: 28px;
                    color: #fff;
                    border: none;
                    background: rgba(0, 0, 0, 0);
                    line-height: 28px;
                    -webkit-appearance: none;
                }
                img {
                    display: block;
                    margin: 0 auto;
                    width: 400px;
                    margin-top: 42px;
                }
                .user {
                    text-align: left;
                    line-height: 60px;
                    width: 340px;
                    height: 60px;
                    margin: 20px auto;
                    border-bottom: solid 1px #fff;
                    strong {
                        display: inline-block;
                        width: 60px;
                        color: #fff;
                        font-size: 16px;
                        font-weight: bold;
                    }

                }
                .pass {
                    text-align: left;
                    line-height: 60px;
                    width: 340px;
                    height: 60px;
                    margin: 0 auto;
                    border-bottom: solid 1px #fff;
                    strong {
                        display: inline-block;
                        width: 60px;
                        color: #fff;
                        font-size: 16px;
                        font-weight: bold;
                    }
                }
                .tishi {
                    display: none;
                    position: absolute;
                    right: 76px;
                    width: 340px;
                    height: 30px;
                    margin: 0px auto;
                    line-height: 30px;
                    color: red;
                    text-align: right;
                }
                .butn {

                    width: 340px;
                    height: 48px;
                    margin: 0px auto;
                    border-radius: 3px;
                    margin-top: 54px;
                    button {
                        color: #fff;
                        width: 100%;
                        height: 100%;
                        font-size: 18px;
                        border: none;
                        background: #2494F2;
                    }
                    :hover {
                        background: #0070CE;
                    }
                    overflow: hidden;
                }
            }
        }

    }
</style>
