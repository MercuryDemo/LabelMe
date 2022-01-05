import React, { Component} from 'react'
import { Layout, Menu, Button,Avatar } from 'antd';

import { Navigate } from 'react-router-dom';
import ShowImgs from './resource';
import TaskMarket from './taskmarket';
import MyTasks from './mytasks';
import Wel from './wellcome';

import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  HomeOutlined,
  UserOutlined 
} from '@ant-design/icons';

import GlobalData from './globalData';
import 'antd/dist/antd.css'; // or
import Login from './login';

// import  'antd/dist/antd.less'



const { Header, Content, Footer, Sider } = Layout;




class Navi extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      collapsed: false,
      selected: "4",


    };
    
  }
  

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

 
  

  render() {
    // if(GlobalData.userid==-1){
    //   return(
    //     <Navigate to="/label"/> ) 
    // }
    // else
    {
      const { collapsed } = this.state;
      return (
        <Layout style={{ minHeight: '100vh' }} theme='dark'>
          <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse} theme='dark'>
          <Avatar size="large" icon={<UserOutlined />} />
          <Button type="text" style={{color: "white"}}>{GlobalData.username}</Button>
          <Button type="link" style={{float:"right"}} onClick={(item)=>{
                console.log("hahha");
                GlobalData.userid=-1;
                alert("您已退出登录！")
                }}>Logout</Button>
         
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['4']} mode="inline" 
            onSelect ={(item)=>{
              this.setState({
                selected: item.key,
              })
            }}>
              <Menu.Item key="4" icon={<HomeOutlined />}>
                首页
              </Menu.Item>
              <Menu.Item key="1" icon={<PieChartOutlined />}>
                我的资源
              </Menu.Item>
              <Menu.Item key="2" icon={<FileOutlined />}>
                我的任务
              </Menu.Item>
              <Menu.Item key="3" icon={<DesktopOutlined />}>
                任务市场
              </Menu.Item>

              
            </Menu>
          </Sider>
          <Layout className="site-layout" theme='dark'>
          <Header className="site-layout-background" style={{ padding: 0,color: "white"}} theme='dark'  >
              ----LABEL ME-----
              
              
          </Header>
            
            <Content style={{ margin: '0 16px' }}>
              {/* <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>User</Breadcrumb.Item>
                <Breadcrumb.Item>Bill</Breadcrumb.Item>
              </Breadcrumb> */}
              <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                {(GlobalData.userid==-1)&& <Login/>}
                {(this.state.selected=='1')&&(GlobalData.userid!=-1)&& <ShowImgs/>}
                {(this.state.selected=='2')&&(GlobalData.userid!=-1) && <MyTasks/>}
                {(this.state.selected=='3')&&(GlobalData.userid!=-1) && <TaskMarket/>}
                {(this.state.selected=='4')&&(GlobalData.userid!=-1)  && <Wel/>}
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
          </Layout>
        </Layout>
      );
    }

    }
    
}

export default Navi;