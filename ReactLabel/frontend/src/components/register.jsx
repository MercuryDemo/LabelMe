
import React from 'react'
import { UserOutlined, LockOutlined, GlobalOutlined} from '@ant-design/icons';
import { Input,Radio,Button,Layout,Form, Card, Space,Divider} from 'antd';
import axios from 'axios';
import 'antd/dist/antd.min.css';
 import pic from "../BG.jpg";

import { Navigate } from 'react-router-dom';

const { TextArea } = Input;
const submitHandler = item => {
  console.log(item);
};
var sectionStyle = {
    width: "1536px",
    height: "745px",
  // makesure here is String确保这里是一个字符串，以下是es6写法
     backgroundImage: `url(${pic})` 
};

class Register extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            user:'',
            pwd:'',
            repeatpwd:'',
            email : '',
            repassword:'',
            current : 'Register',
            check : -1
        };
    }
    
    nameChange(item){
        this.setState({
            user:item.target.value,
        },()=>{console.log(this.state.user)})
    }
    
    pwChange(item){
        this.setState({
            pwd:'',
        },()=>{console.log(this.state.pwd)})
    }

    checkLogin(item){
        if(this.state.user.length==0|this.state.pwd.length==0|this.state.repassword.length==0|this.state.email.length==0){
            alert("请输入完整信息")
            return ;
        }
        // let tmp;
        // tmp = this.state.repassword
        // console.log("asdad" + tmp)
        // let value = this.state.email;
        // console.log("email:" + value)
        if(this.state.user.length<6){
            alert("用户名长度过短")
            return;
        }
        if(this.state.pwd.length<6){
            alert("密码长度过短")
            return;
        }
        else if(this.state.repassword!== this.state.pwd)
        {
            alert("两次输入密码不一致")
            return ;
        }
        else if(!(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.state.email))) {
            alert('请输入正确的Email');
            return ;
        }
        else
        {
            console.log("username:" + this.state.user + " userpwd:" + this.state.pwd + " email:" + this.state.email)
            // this.setState({repassword:item.target.value},()=>{})
            // this.setState({email:item.target.value},()=>{})
            axios({
                method: 'post',
                url: 'http://127.0.0.1:5000/register',
                data: {
                    "user_name":this.state.user,
                    "user_pwd":this.state.pwd,
                    "user_mail":this.state.email
                }
                }).then(data => {
                    console.log(data);
                    if(data.data.code == 1)
                    {
                        alert("注册成功")
                        this.setState({check : 1,})
                    }
                    if(data.data.code == 0)
                    {
                        alert(data.data.error)
                        this.setState({check : 0,})
                    }
                }).catch(function (error) {
                console.log(error);
                });
        }
    }

    ChangeStatus(item){
        this.setState({
            current:'Login'
        },()=>{console.log(this.state.current)})
    }

    render(){
        const item = Radio.RadioItem
        if(this.state.check === 1)
        {
            return(    
                <Navigate to="/login"/>
            )     
        }
        else 
        if(this.state.current === 'Login')
        {
            return (
            <Navigate to="/login"/>
            )
        }
        else 
        if(this.state.current === 'Register')
        {
            return (
                <Form 
                    name="basic"
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    style={sectionStyle}
                    action="/receive" method="post" onSubmit={submitHandler}>
                    <div style={{height : 200}}></div>
                    <div style={{display : "flex", flexDirection : "row", justifyContent : "center"}}>
                    <Card style={{width : 500, backgroundColor : '#FCFBF7', border :1}}>
                        <h1 style={{display : "flex", flexDirection : "row", justifyContent : "center", fontWeight : 'bold'}} >Register</h1>
                        <Divider plain></Divider>
                        <Form.Item
                            label="输入昵称" name="username" 
                            style={{display : "flex", flexDirection : "row", justifyContent : "center"}}
                            rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            }, 
                        ]}>
                            
                            <Input maxLength={20} prefix={<UserOutlined />} placeholder="Enter your name"  allowClear onChange={(item)=>{this.setState({user : item.target.value},()=>{console.log(this.state.user)})}} />
                        
                        </Form.Item>
                        <Form.Item 
                            style={{display : "flex", flexDirection : "row", justifyContent : "center"}}
                            label="输入密码"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                        ]}>
                            <Input.Password maxLength={20} prefix={<LockOutlined />} placeholder="Enter your password" onChange={(item) => this.setState({pwd:item.target.value},()=>{console.log(this.state.pwd)})}/>
                        </Form.Item>
                        <Form.Item 
                            style={{display : "flex", flexDirection : "row", justifyContent : "center"}}
                            label="确认密码"
                            name="repassword"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                        ]}>
                            <Input.Password maxLength={20} prefix={<LockOutlined />} placeholder="Check your password" onChange={(item)=>this.setState({repassword:item.target.value},()=>{console.log(this.state.pwd)})}/>
                        </Form.Item>
                        <Form.Item
                            style={{display : "flex", flexDirection : "row", justifyContent : "center"}}
                            label="输入邮箱"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                        ]}>
                            <Input prefix={<GlobalOutlined />}placeholder="Enter your email" allowClear onChange={(item)=>{this.setState({email : item.target.value},()=>{console.log(this.state.pwd)})}} />
                        </Form.Item>
                        <Form.Item >
                            <Space size='small' style={{display : "flex", flexDirection : "row", justifyContent : "center"}}>
                                <Button type = "primary" onClick={(item)=>this.checkLogin(item)}>注册</Button>
                                <Button type="default" onClick={(item)=>this.ChangeStatus(item)}>返回</Button>
                            </Space>
                        </Form.Item>  
                        </Card>  
                    </div>
                </Form>
            )  
        }
    }
}

export default Register
