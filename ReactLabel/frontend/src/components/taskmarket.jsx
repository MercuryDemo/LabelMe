import React, { useState } from 'react';
import { Card,Avatar } from 'antd';
import { Image } from 'antd';
import { Row, Col } from 'antd';
import axios from 'axios';
import GlobalData from './globalData';
import 'antd/dist/antd.css';

const { Meta } = Card;


// var items=[]




class TaskMarket extends React.Component {
  constructor(props){
    super(props);
    this.state={
      items:[],
      chosenimg:[],
    }
    
  }
  componentDidMount = () => {
    console.log("before:");
    console.log(items);
    var items=[];
    console.log("after:");
    console.log(items);
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

                        
                        cover={
                        <img
                        // width={200}
                         height={200}
                            alt="example"
                            src={"upload/img/"+res.data.taskList[i].coverimgurl}
                        />
                        }
                        // actions={[
                        // <SettingOutlined key="setting" />,
                        // <EditOutlined key="edit" />,
                        // <EllipsisOutlined key="ellipsis" />,
                        // ]}
                    >
                        {/* <Avatar shape="square" size={} src={"upload/img/"+res.data.taskList[i].coverimgurl} /> */}
                        <Meta
                        
                        title={"任务名: "+res.data.taskList[i].name}
                        description={'描述: '+res.data.taskList[i].info}
                        />
                    </Card>
                </Col>
                );
          }
          console.log("afterpush:");
          console.log(items)
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