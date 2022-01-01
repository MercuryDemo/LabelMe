import React, { useState } from 'react';
import { Card,Avatar,Button } from 'antd';
import { Image } from 'antd';
import { Row, Col } from 'antd';
import axios from 'axios';
import GlobalData from './globalData';
import 'antd/dist/antd.css';
import {
  FrownOutlined,
  SmileOutlined,
  SyncOutlined,
  Loading3QuartersOutlined,
  IdcardOutlined,
  CloseOutlined,
  CheckOutlined,


} from '@ant-design/icons';

const { Meta } = Card;


const stateicons={
  0:<div>未认领 <FrownOutlined /></div>,
  1:<div>标记中 <SyncOutlined /></div>,
  
  2:<div>未审核 <Loading3QuartersOutlined /></div>,
  3:<div>审核中 <IdcardOutlined /></div>,
  4:<div>已结束 <CheckOutlined /></div>,
  5:<div>不通过 <CloseOutlined /></div>,
}





class TaskMarket extends React.Component {
  constructor(props){
    super(props);
    this.state={
      items:[],
      chosenimg:[],
    }
    this.willlabel = this.willlabel.bind(this);
    this.willreview = this.willreview.bind(this);
  }
  willlabel(t){
    console.log("i will label it");
    console.log(t)
    // console.log(e.target.id);
    axios({
      method: 'post',
      url: 'http://127.0.0.1:5000/claim',
      headers: {
        'Content-Type': 'multipart/form-data',
        'user_id':GlobalData.userid,
      },
      data: {
          "task_id":t,
          "type":"label",
      }
      }).then((data =>{
              console.log(data);
              if(data.data.code == "1")
              {
                  alert(data.data.msg);
                  this.onReset();
              }
              else 
              {
                  alert(data.data.error);
                  return ;
              }
      }
          )).catch(function (error) {
      console.log(error);
      });
  }
  willreview(t){
    console.log("i will review it");
    // console.log(e);
    console.log(t);
    axios({
      method: 'post',
      url: 'http://127.0.0.1:5000/claim',
      headers: {
        'Content-Type': 'multipart/form-data',
        'user_id':GlobalData.userid,
      },
      data: {
          "task_id":t,
          "type":"review",
      }
      }).then((data =>{
              console.log(data);
              if(data.data.code == "1")
              {
                  alert(data.data.msg);
                  this.onReset();
              }
              else 
              {
                  alert(data.data.error);
                  return ;
              }
      }
          )).catch(function (error) {
      console.log(error);
      });
    
  }
  componentDidMount = () => {
    // console.log("before:");
    // console.log(items);
    var items=[];
    // console.log("after:");
    // console.log(items);
    axios({
      url:'http://127.0.0.1:5000/alltask',
      data:{
          "user_id":''
      },
      method:'POST'
      }).then(
          res => {

            for (let i = 0; i < res.data.taskList.length; i++) {   
              
              items.push(
                <Col span={6}>  
                    <Card  
                      title={"No."+i+" "+res.data.taskList[i].name}
                        cover={
                        <img
                        // width={200}
                         height={200}
                            alt="example"
                            src={"upload/img/"+res.data.taskList[i].coverimgurl}
                        />
                        }
                    >
                        <Meta
                        description={'描述: '+res.data.taskList[i].info}
                        />
                        
                        {stateicons[res.data.taskList[i].state]}
                        <Button disabled={res.data.taskList[i].state!=0} type="primary" onClick={()=>this.willlabel(res.data.taskList[i].id)}>
                          标记
                        </Button>
                        &nbsp;
                        <Button disabled={res.data.taskList[i].state!=2 }type="primary" onClick={()=>this.willreview(res.data.taskList[i].id)}>
                          审核
                        </Button>
                    </Card>
                </Col>
                );
          }
          // console.log("afterpush:");
          // console.log(items)
            // console.log(res.data.enterprise_info)
            // this.setState({en_list:res.data.enterprise_info})
            // this.setState({mat_list:res.data.data})
          this.setState({items:items});
          }
          
      ).catch(
          err => console.error(err)
    )
  
  }
  
  render(){
    return (
      <> 
        <Row justify="cneter" gutter={[8, 16]}>
            {this.state.items}
        </Row>   
      </>
    )  
  }
  
};


export default TaskMarket;