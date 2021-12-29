import React, { PureComponent } from "react";
import {Button} from "antd";
import axios from "axios";
const { Fragment } = React;

//能够上传视频、图片并在点击确定前预览，但只能上传1张

class Test extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      file:'',
      showImg:'none',
//       token:'jianshu',
//       name:'CoderZb',
      
// storeId:'91',
//       subsidyAmount:'82',
      imagePreviewUrl:'',
    }
  }
  render() {
    var {imagePreviewUrl,showImg} = this.state;
    var imagePreview = null;
    if (imagePreviewUrl) {
      imagePreview = (< img style={{width:'80px',height:'80px'}} src={imagePreviewUrl} />);
      showImg = 'none';
    } else {
      showImg = 'block';
    }

    return (
      <div>
          
            <input id="avatarFor" style={{display:'none'}} type="file" onChange={(e)=>this.handleImageChange(e)}/>
            {imagePreview}
            <label style={{color:"#1890FF",border:"1px dashed #1890FF",padding:'3px 10px ',display:showImg}} for="avatarFor">+点击上传图片</label>
           
            <Button
              key="submit"
              type="primary"
              onClick={this.chargeFunc}
            > 确定</Button>
      </div>
    );
  }

  
 handleImageChange(e) {
    e.preventDefault();
    
    var reader = new FileReader();
    var file = e.target.files[0];
    
    reader.onloadend = () => {
      console.log('文件名为—',file);
      console.log('文件结果为—',reader.result);
      this.setState({
      file: file,
      imagePreviewUrl: reader.result
      });
    }
    
    reader.readAsDataURL(file)
  }
  chargeFunc= (e) => { 
    console.log("file为",this.state.file);
      const formData = new FormData();
      console.log("one------");
      // formData.append('file',value);
      formData.append('pic_file', this.state.file, this.state.file.name);
      
      console.log(formData)

      
            
       axios({
            method: 'post',
            url: 'http://127.0.0.1:5000/test',
            headers: {'Content-Type': 'multipart/form-data'},
            data: formData
        })
        .then(data => {
            console.log(data);
            if(data.data.code == 1)
            {
                alert("登录成功")
                this.setState({check : 1})
            }
            if(data.data.code == 0)
            {
                alert(data.data.error)
                this.setState({check : 0})
            }
        }).catch(function (error) {
        console.log(error);
        });
  }
}

export default Test;