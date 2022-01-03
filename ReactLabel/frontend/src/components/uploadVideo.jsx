import React  from "react";
import axios from "axios";
import { Upload, Button, message,Modal,Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import GlobalData from "./globalData";

// 能一次手动上传好多个，但是没有缩略图
class UploadVideo extends React.Component {
  state = {
    fileList: [],
    uploading: false,
    interval:10,
    visible:false,
  };
  showModal=()=>{
    this.setState({visible:true})
  }
  handleCancel = () => {//点击取消按钮触发的事件
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  }
  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('files[]', file);
    });
    this.setState({
      uploading: true,
      visible:false,
    });
    console.log(formData)
    // You can use any AJAX library you like
      axios({
          method: 'post',
          url: 'http://127.0.0.1:5000/upload',
          headers: {
            'Content-Type': 'multipart/form-data',
            'user_id':GlobalData.userid,
            'type':0,
            'interval':this.state.interval,
          },
          data: formData
      })
      .then(data => {
          if(data.data == 1)
          {
            this.setState({fileList: [],});
            alert("upload successfully.");
            // message.success('upload successfully.');
          }
          if(data.data == 0)
          {
            message.error('upload failed.');
          }
      })
      .catch(function (error) {
        message.error('upload failed.');
        console.log(error);
      })
      .finally(() => {
        this.setState({uploading: false,});
      })
      ;
  };

  render() {
    const { uploading, fileList } = this.state;
    const props = {
      multiple: true,
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        console.log(file)
        if (file.type !== 'video/mp4') {
          message.error(`${file.name} is not a mp4 file`);
          return  Upload.LIST_IGNORE;
        }
        
        
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    return (
      <>
      <Modal 
        title="请输入间隔帧数"
          visible={this.state.visible}
          onOk={this.handleUpload}
          onCancel={this.handleCancel}
        >
          
          <Input placeholder="10" onChange={(item) => this.setState({interval:item.target.value},()=>{console.log(this.state.interval)})}/>

        </Modal>
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Select Video</Button>
        </Upload>
        <Button
          type="primary"
          onClick={this.showModal}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? 'Uploading' : 'Start Upload'}
        </Button>
      </>
    );
  }
}

export default UploadVideo