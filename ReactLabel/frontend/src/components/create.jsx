import React, { Component } from 'react';
import { Modal } from 'antd';

import { Input,Radio,Button,Affix,Form,} from 'antd';
import axios from 'axios';
import GlobalData from './globalData'



class Create extends Component {
  formRef = React.createRef();
  constructor(props){
    super(props)
    this.state = { 
        task_type:'',
        
        task_name:'',
        task_intro:'',
        visible: false,
        confirmLoading: false,
        
    };
  }
  
  handleOk = (e) => {//点击对话框OK按钮触发的事件
    
    if(this.state.task_name.length==0|this.state.task_intro.length==0){
       alert("请输入完整数据");
            return ;
    }
    console.log("hahhha"+GlobalData.userid);
    console.log(this.state);
    console.log(this.props);
    axios({
        method: 'post',
        url: 'http://127.0.0.1:5000/create',
        headers: {
          'Content-Type': 'multipart/form-data',
          'user_id':GlobalData.userid,
        },
        data: {
            "user_id":GlobalData.userid,
            "task_name":this.state.task_name,
            "taks_intro":this.state.task_intro,
            "imglist":this.props.chosenimg,
        }
        }).then((data =>{
                console.log(data);
                if(data.data.code == "1")
                {
                    alert(data.data.msg);
                }
                else 
                {
                    alert(data.data.error);
                    return ;
                }
        }
            )).catch(function (error) {
              alert(error);
        });
    
    this.formRef.current.resetFields();
    

    this.setState({
      visible:false,
      taks_intro : '',
      task_name : ''
    });
    
  }
  handleCancel = () => {//点击取消按钮触发的事件
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  }
  render() {
    const { visible, confirmLoading, ModalText } = this.state;
    return (
      <div>
        <Modal title="创建任务"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <Form
              name="basic"
              labelCol={{
                  span: 4,
              }}
              wrapperCol={{
                  span: 15,
              }}
              
              ref={this.formRef}
              initialValues={{datatype: 1}}
              requiredMark={this.state.requiredMark}
          >             
            <Form.Item
                label="任务名称"
                name="task_name"
                rules={[
                {  
                    required: true,
                    message: 'Please input!',
                },
                ]}
            >
                <Input placeholder="input task name" onChange={(item) => this.setState({task_name:item.target.value},()=>{console.log(this.state.task_name)})}/>
            </Form.Item>

            <Form.Item
                label="任务描述"
                name="task_intro"
                rules={[
                {  
                    required: true,
                    message: 'Please input!',
                },
                ]}
            >
                <Input placeholder="input task introduction" onChange={(item) => this.setState({task_intro:item.target.value},()=>{console.log(this.state.task_intro)})}/>
            </Form.Item>
            </Form>

        </Modal>


        <Affix offsetBottom={5}>
        <Button type="primary" onClick={(item) => this.setState({visible:true})}>
          创建任务
        </Button>
        </Affix>
      </div>
    );
  }
}
 
export default Create;