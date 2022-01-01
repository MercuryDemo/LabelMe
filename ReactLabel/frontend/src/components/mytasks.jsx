import React from 'react';
import {  Card,Modal, Row, Col,Button } from 'antd';
import axios from 'axios';
import GlobalData from './globalData';
import 'antd/dist/antd.css';
import LabelImg from './labelimg';
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

const stateicons={
  0:<div>未认领 <FrownOutlined /></div>,
  1:<div>标记中 <SyncOutlined /></div>,
  
  2:<div>未审核 <Loading3QuartersOutlined /></div>,
  3:<div>审核中 <IdcardOutlined /></div>,
  4:<div>已结束 <CheckOutlined /></div>,
  5:<div>不通过 <CloseOutlined /></div>,
};







class MyTasks extends React.Component {
  constructor(props){
    super(props);
    this.state={
      activeTabKey:'tab1',
      items1:[],
      items2:[],
      items3:[],
      items4:[],
      visible: false,
      confirmLoading: false,
      chosenimgid:'',
      chosentaskid:-1,
      chosentaskstate:-1,
    
    }
    this.taskdetail= this.taskdetail.bind(this);
    this.handleOk= this.handleOk.bind(this);
    this.handleCancel= this.handleCancel.bind(this);
  }
  handleOk (type) {
    console.log("handleOk")
    axios({
      method: 'post',
      url: 'http://127.0.0.1:5000/finishtask',
      data: {
          "task_id":this.state.chosentaskid,
          "type":type,
      }
      }).then(data => {
          console.log(data);
          if(data.data.code == 1){
              alert(data.data.msg)
          }
          else{
              alert(data.data.error)
          }
          
      }).catch(function (error) {
        console.log(error);
      });
      
      this.setState({
        visible:false,
      });
    


    
  }
  
  handleCancel ()  {//点击取消按钮触发的事件
    this.setState({
      visible: false,
    });
  }
  taskdetail(taskid,taskstate){
    var items4=[]
    this.setState({
      chosentaskid: taskid,
      chosentaskstate: taskstate,
    });
    axios({
      url:'http://127.0.0.1:5000/taskhasimg',
      data:{
          "task_id":taskid,
      },
      method:'POST'
      }).then(
        
          res => {
            this.setState({chosenimgid:res.data.imgList[0].id})
            for (let i = 0; i < res.data.imgList.length; i++) {      
              items4.push(
                
                  <Button type="link" onClick={(item) => this.setState({chosenimgid:res.data.imgList[i].id})}>
                    {res.data.imgList[i].name}
                  </Button>
              );    
            }
            this.setState({items4:items4});
           
            this.setState({visible:true});
          }
          
      ).catch(
          err => console.error(err)
    )
  }
  
  componentDidMount = () => {
    console.log("Didmount")
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
           
            for (let i = 0; i < res.data.CreateTask.length; i++) {       
                items1.push(
                <Col span={6}>
                    <Card
                        title={"No."+i+" "+res.data.CreateTask[i].name}
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
                        description={'任务描述: '+res.data.CreateTask[i].info}
                        />
                        
                        <div>
                        {stateicons[res.data.CreateTask[i].state]}
                        <Button type="dashed" style={{float:"right"}} onClick={()=>this.taskdetail(res.data.CreateTask[i].id,res.data.CreateTask[i].state)}>
                            查看详情
                        </Button>
                        
                        </div>
                        
                    </Card>
                </Col>
                );
            }
            for (let i = 0; i < res.data.LabelTask.length; i++) {       
                items2.push(
                <Col span={6}>
                    <Card
                    title={"No."+i+" "+res.data.LabelTask[i].name}
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
                        
                        description={'描述: '+res.data.LabelTask[i].info}
                        />
                        {stateicons[res.data.LabelTask[i].state]}
                        <Button type="dashed" style={{float:"right"}} onClick={()=>this.taskdetail(res.data.LabelTask[i].id,res.data.LabelTask[i].state)}>
                            查看详情
                        </Button>
                    </Card>
                </Col>
                );
            }
            for (let i = 0; i < res.data.ReviewTask.length; i++) {       
                items3.push(
                <Col span={6}>
                    <Card
                    title={"No."+i+" "+res.data.ReviewTask[i].name}
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
                        
                        description={'描述: '+res.data.ReviewTask[i].info}
                        />
                        {stateicons[res.data.ReviewTask[i].state]}
                        <Button type="dashed" style={{float:"right"}} onClick={()=>this.taskdetail(res.data.ReviewTask[i].id,res.data.ReviewTask[i].state)}>
                            查看详情
                        </Button>
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
    const { visible, confirmLoading, ModalText } = this.state;
    console.log("this.chosentaskstate")
    console.log(this.state.chosentaskstate)
    console.log(this.state.chosentaskstate!=1)
    var ModalButton={
      tab1:<Button onClick={this.handleCancel}>返回</Button>,
     
      tab2:<Button disabled={this.state.chosentaskstate!=1} onClick={()=>this.handleOk("success")}>提交</Button>,
      tab3:<div><Button disabled={this.state.chosentaskstate!=3} onClick={()=>this.handleOk("fail")}>不通过</Button> 
                <Button disabled={this.state.chosentaskstate!=3} onClick={()=>this.handleOk("success")}>通过</Button>
          </div>,
    }
    return (
      <>
      
      <Modal title="任务详情"
       
      bodyStyle={{width:1000,height:600}}
          visible={visible}
          //  onOk={this.handleOk} 
          onCancel={this.handleCancel}
          confirmLoading={confirmLoading}
          
          
            footer={ModalButton[this.state.activeTabKey]}
        >
          {console.log(ModalButton[this.state.activeTabKey])}
         
          {this.state.items4}
       
         <LabelImg key={this.state.chosenimgid} canlabel={this.state.activeTabKey=="tab2"} taskid={this.state.chosentaskid} imgid={this.state.chosenimgid}/> 
        </Modal>
       <Card
          style={{ width: '100%' }}
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
        </Card> 
        
        
      </>
    )  
  }
  
};


export default MyTasks;