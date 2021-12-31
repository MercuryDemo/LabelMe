import React, { useState } from 'react';
import { Card,Checkbox } from 'antd';
import { Image } from 'antd';
import { Space, Typography, Row, Col,Divider } from 'antd';
import axios from 'axios';
import GlobalData from './globalData';
import 'antd/dist/antd.css';
import Uploads from './uploads';
import { Affix, Button } from 'antd'
import Create from './create';

const { Meta } = Card;


const tabList = [
  {
    key: 'tab1',
    tab: '我创建的',
  },
  {
    key: 'tab2',
    tab: '我标记的',
  },
  {
    key: 'tab3',
    tab: '我审核的',
  },
];






class MyTasks extends React.Component {
  constructor(props){
    super(props);
    this.state={
      activeTabKey:'tab1',
      items1:[],
      items2:[],
      items3:[],
      contentList:{
        // tab1: 
        //     <Row justify="cneter" gutter={[8, 16]}>
        //     {this.state.items1}
        //     </Row>
        //  ,
        // tab2:
        //     <Row justify="cneter" gutter={[8, 16]}>
        //     {this.state.items2}
        //     </Row>,
        // tab2:
        //     <Row justify="cneter" gutter={[8, 16]}>
        //     {this.state.items3}
        //   </Row>,
    }
    }
  }
  
  componentDidMount = () => {
    var items1=[];
    var items2=[];
    var items3=[];
    axios({
      url:'http://127.0.0.1:5000/mytask',
      data:{
          "user_id":GlobalData.userid
      },
      method:'POST'
      }).then(
          res => {
            console.log(res);
          
            for (let i = 0; i < res.data.CreateTask.length; i++) {       
                items1.push(
                <Col span={6}>
                    <Card
                        cover={
                        <img
                        // width={200}
                            height={200}
                            alt="example"
                            src={"upload/img/"+res.data.CreateTask[i].coverimgurl}
                        />
                        }
                        
                    >   
                        <Meta
                        title={"任务名: "+res.data.CreateTask[i].name}
                        description={'描述: '+res.data.CreateTask[i].info}
                        />
                    </Card>
                </Col>
                );
            }
            for (let i = 0; i < res.data.LabelTask.length; i++) {       
                items2.push(
                <Col span={6}>
                    <Card
                        cover={
                        <img
                        // width={200}
                            height={200}
                            alt="example"
                            src={"upload/img/"+res.data.LabelTask[i].coverimgurl}
                        />
                        }
                        
                    >   
                        <Meta
                        title={"任务名: "+res.data.LabelTask[i].name}
                        description={'描述: '+res.data.LabelTask[i].info}
                        />
                    </Card>
                </Col>
                );
            }
            for (let i = 0; i < res.data.ReviewTask.length; i++) {       
                items3.push(
                <Col span={6}>
                    <Card
                        cover={
                        <img
                        // width={200}
                            height={200}
                            alt="example"
                            src={"upload/img/"+res.data.ReviewTask[i].coverimgurl}
                        />
                        }
                        
                    >   
                        <Meta
                        title={"任务名: "+res.data.ReviewTask[i].name}
                        description={'描述: '+res.data.ReviewTask[i].info}
                        />
                    </Card>
                </Col>
                );
            }
          
          this.setState({items1:items1});
          this.setState({items2:items2});
          this.setState({items3:items3});
          }
          
      ).catch(
          err => console.error(err)
    )
  
  }

  onTabChange(key){
    this.setState({activeTabKey:key});
  }
  render(){
    return (
      <>
       <Card
          style={{ width: '100%' }}
          // title="我的资源"
          // extra={<a href="#">More</a>}
          tabList={tabList}
          activeTabKey={this.state.activeTabKey}
          onTabChange={key => {
            this.onTabChange(key);
          }}
        >
            {(this.state.activeTabKey=='tab1') && <Row justify="cneter" gutter={[8, 16]}>
                {this.state.items1}
            </Row>}
            {(this.state.activeTabKey=='tab2') && <Row justify="cneter" gutter={[8, 16]}>
                {this.state.items2}
            </Row>}
            {(this.state.activeTabKey=='tab3') && <Row justify="cneter" gutter={[8, 16]}>
                {this.state.items3}
            </Row>}
            
          {/* {this.state.contentList[this.state.activeTabKey]} */}
        </Card> 
        
        
      </>
    )  
  }
  
};


export default MyTasks;