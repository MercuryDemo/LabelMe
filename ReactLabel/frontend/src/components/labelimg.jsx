import React, { Component} from 'react';
import Annotation from 'react-image-annotation';
import { Card,Image,Carousel,Button } from 'antd';
import axios from 'axios';
class LabelImg extends Component {
  constructor(props){
    console.log("new constructor")
    // console.log(key)
    super(props);
    this.state = {
      annotations: [],
      annotation: {},
      items:[],
      imgurl:'',
      tmid:'',
    }
    this.clearanno = this.clearanno.bind(this);
    this.saveanno = this.saveanno.bind(this);
    this.addanno = this.addanno.bind(this);
  }
  componentDidMount(){
    //get 请求组件
    console.log("DisMount")
    axios({
      url:'http://127.0.0.1:5000/getannotation',
      data:{
          "task_id":this.props.taskid,
          "img_id":this.props.imgid,
      },
      method:'POST'
      }).then(
        
          res => {
            console.log("hahhah")
            console.log(res.data)
            for(let i=0;i<res.data.allanno.length;i++){
              this.setState({
                annotation: {},
                annotations: this.state.annotations.concat({
                  geometry:{
                    height:res.data.allanno[i][6],
                    type:res.data.allanno[i][7],
                    width:res.data.allanno[i][5],
                    x:res.data.allanno[i][3],
                    y:res.data.allanno[i][4]
                  },
                  data: {
                    text:res.data.allanno[i][2],
                    id: res.data.allanno[i][0],
                  }
                })
              })
            }
            this.setState({imgurl:res.data.imgurl})
            this.setState({tmid:res.data.tmid})
          }
          
      ).catch(
          err => console.error(err)
    )
  }
  
  onChange = (annotation) => {
    // console.log(annotation)
    console.log("change")
    this.setState({ annotation })
  }

  onSubmit = (annotation) => {
    console.log("submit")
    const { geometry, data } = annotation
    console.log(geometry);
    console.log(data);
    this.setState({
      annotation: {},
      annotations: this.state.annotations.concat({
        geometry,
        data: {
          ...data,
          id: Math.random(),
        }
      })
    })
    console.log(this.state)
  }
  clearanno(){
    console.log("clear")
    this.setState ({
      annotations: [],
      annotation: {},
    })
  }
  addanno(){

    console.log("add")
    var tmp=this.state.annotations.concat({
          geometry:{
            height:36.0,
            type:"RECTANGLE",
            width:14,
            x:21,
            y:5
          },
          data: {
            text:"addano",
            id: Math.random(),
          }
        });
      console.log(tmp)
    this.setState({
      annotation: {},
      annotations: this.state.annotations.concat({
        geometry:{
          height:36.0,
          type:"RECTANGLE",
          width:14,
          x:21,
          y:5
        },
        data: {
          text:"addano",
          id: Math.random(),
        }
      })
    })

    console.log(this.state)

    
    
  }
  saveanno(){
    console.log("save")
    console.log(this.state.tmid)
    console.log(this.state)
    axios({
      url:'http://127.0.0.1:5000/commitannotation',
      data:{
          "tmid":this.state.tmid,
          "annos":this.state.annotations,
      },
      method:'POST'
      }).then(
        
          res => {
            if(res.data.code==1){
              alert(res.data.msg)
            }
            else alert(res.data.error)
            
          }
          
      ).catch(
          err => console.error(err)
    )
  }
  render () {
    return (
        <div  >
              <Annotation
                 style={{height:"600px"}}
                src={"upload/img/"+this.state.imgurl}
                annotations={this.state.annotations}
                type={this.state.type}
                value={this.state.annotation}
                onChange={this.onChange}
                onSubmit={this.onSubmit}
                // width="500px"
                // height="500px"
              />
              {this.props.canlabel==1&&
                <div style={{textAlign: 'center' }}>
                  <br/>
                <Button disabled ={this.props.disabled} type="dashed" onClick={this.clearanno}>
                      清空
                </Button>
                &nbsp;
              <Button  disabled ={this.props.disabled} type="dashed" onClick={this.saveanno}>
                          保存
              </Button>
              
                </div>}
                {this.props.candownload==1&&
                <div style={{textAlign: 'center' }}>
                  <br/>
                  <a href={"upload/img/"+this.state.imgurl} download>下载图片</a>
                  &nbsp;&nbsp;&nbsp;
                  <a href={"download/"+this.state.tmid+".xml"} download>下载标记</a>
              
                </div>}

              
         </div>
      
    )
  }
}
export default LabelImg;