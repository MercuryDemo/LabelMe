import React  from "react";
import axios from "axios";
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import GlobalData from "./globalData";
// 能一次手动上传好多个，但是没有缩略图
class Uploads extends React.Component {
  state = {
    fileList: [],
    uploading: false,
  };

  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('files[]', file);
    });
    this.setState({
      uploading: true,
    });
    // You can use any AJAX library you like
      axios({
          method: 'post',
          url: 'http://127.0.0.1:5000/upload',
          headers: {
            'Content-Type': 'multipart/form-data',
            'user_id':GlobalData.userid,
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
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    return (
      <>
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
        <Button
          type="primary"
          onClick={this.handleUpload}
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

export default Uploads