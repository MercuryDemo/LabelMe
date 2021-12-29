import React, { Component} from 'react'
import { Layout, Menu, Breadcrumb } from 'antd';
import { Navigate } from 'react-router-dom';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';


import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import Register from './register';
import Login from './login';
import Create from './create';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;


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

  componentDidMount(){
    // console.log("innavi contract"+this.props.contract);
  }
  

  render() {
    
    const { collapsed } = this.state;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
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
              我的任务
            </Menu.Item>
            <Menu.Item key="2" icon={<FileOutlined />}>
              创建任务
            </Menu.Item>
            <Menu.Item key="3" icon={<DesktopOutlined />}>
              任务市场
            </Menu.Item>

            
          </Menu>
        </Sider>
        <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0,color: "white"}} >
             LABEL ME
            </Header>
          
          <Content style={{ margin: '0 16px' }}>
            {/* <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb> */}
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              {/* <Chooseone keys={this.state} /> */}
              {(this.state.selected=='1')&& <Register/>}
              {(this.state.selected=='2') && <Create/>}
              
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default Navi;