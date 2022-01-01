import React, { Component} from 'react'
import { Layout, Menu, Breadcrumb } from 'antd';

import ShowTasks from './showtasks';
import ShowImgs from './resource';
import TaskMarket from './taskmarket';
import MyTasks from './mytasks';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';


 import 'antd/dist/antd.css'; // or
import LabelTask from './labelimg';
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
    
    const { collapsed } = this.state;
    return (
      <Layout style={{ minHeight: '100vh' }} theme='dark'>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse} theme='dark'>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['4']} mode="inline" 
          onSelect ={(item)=>{
            this.setState({
              selected: item.key,
            })
          }}>
            <Menu.Item key="4" icon={<FileOutlined />}>
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
              {/* <Chooseone keys={this.state} /> */}
              {(this.state.selected=='1')&& <ShowImgs/>}
              {/* {(this.state.selected=='2') && <ShowTasks/>} */}
              {(this.state.selected=='2') && <MyTasks/>}
              {(this.state.selected=='3') && <TaskMarket/>}
              {/* {(this.state.selected=='4') && <LabelTask/>} */}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default Navi;