import React from 'react';
import { Input,Button,Form,Typography, Space, Card, Divider} from 'antd';
import axios from 'axios';
import pic from "../BG.jpg";
import GlobalData from './globalData'

import { UserOutlined, LockOutlined } from '@ant-design/icons';
// import pic from "../images/G1.jpg";
import { Navigate } from 'react-router-dom';



const styles = {
    focus: {
      width: '20px',
      opacity: 1
    },
};

var sectionStyle = {
    width: "1536px",
    height: "745px",
  // makesure here is String确保这里是一个字符串，以下是es6写法
     backgroundImage: `url(${pic})` 
  };

class Login extends React.Component{
    formRef = React.createRef();
   
    constructor(props){
        super(props)

        
        this.state = {
            current : 'Login',
        identity : 2,
        check : -1,
        input_name:'',
        input_pwd:'',
        userid:'',
        };

        this.onLogin= this.onLogin.bind(this);

    }
    
    
    onLogin= ()=>{
        if(this.state.input_name.length==0||this.state.input_pwd.length==0) {
            alert("请输入完整信息");
            return;
        }
            
        console.log("username:" + this.state.user + " user pwd:" + this.state.pwd)
        axios({
            method: 'post',
            url: 'http://127.0.0.1:5000/login',
            data: {
                "user_name":this.state.input_name,
                "user_pwd":this.state.input_pwd,

            }
            }).then(data => {
                console.log(data);
                if(data.data.code == 1)
                {
                    alert("登录成功")
                    this.setState({check : 1})
                    GlobalData.userid=data.data.userid;
                    GlobalData.username=data.data.username;
                    console.log(this.state)
                }
                if(data.data.code == 0)
                {
                    alert(data.data.error)
                    this.setState({check : 0})
                }
            }).catch(function (error) {
            console.log(error);
            });
    }
    ChangeStatus(item){
        this.setState({
            current:'Register'
        },()=>{console.log(this.state.current)})
    }
    render(){
        if(this.state.check == 1)
        {
            return(
                <Navigate to="/label"/>
            )      
        }
        else if(this.state.current == 'Register')
        {
            return (
            <Navigate to="/register"/>
            )
        }
        else if(this.state.current === 'Login')
        {
            return (
                <Form name="basic"
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    style={sectionStyle}> 
                    <div style={{height : 200}}></div>
                    <div style={{display : "flex", flexDirection : "row", justifyContent : "center"}}>
                    <Card style={{width : 500, backgroundColor : '#FCFBF7', border :1}}>
                        <h1 style={{display : "flex", flexDirection : "row", justifyContent : "center", fontWeight : 'bolder'}} >Login</h1>
                        <Divider></Divider>
                        <Form.Item label="输入昵称" name="username" 
                             style={{display : "flex", flexDirection : "row", justifyContent : "center"}}
                                rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                }, 
                                ]}>
                                    <Input  prefix={<UserOutlined />}
                                    placeholder="Enter your name" 
                                    onChange={(item) => this.setState({input_name:item.target.value},()=>{console.log(this.state.pwd)})}
                                    
                                    />
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
                                    ]}
                                >
                                <Input.Password prefix={<LockOutlined />} 
                                    placeholder="Please enter your password" 
                                    onChange={(item) => this.setState({input_pwd:item.target.value},()=>{console.log(this.state.pwd)})}
                                />
                        </Form.Item>
                        <br/>
                        <Form.Item>
                            <Space size='small' style={{display : "flex", flexDirection : "row", justifyContent :"center"}}>
                                <Button type="primary" onClick={(item)=>this.onLogin(item)} >登录</Button>
                                <Button type="default" onClick={(item)=>this.ChangeStatus(item)}>注册</Button>
                                <Button htmlType="button" onClick={(item)=>{console.log(this.state)}}>
                        print
                    </Button>

                            </Space>
                        </Form.Item> 
                    </Card>  
                    </div>       
                </Form>
            )
        }
        
    }
}


export default Login;
