import React, { Component} from 'react';
import Annotation from 'react-image-annotation';
import { Card,Image,Carousel,Button } from 'antd';
import axios from 'axios';
class LabelImg extends Component {
  constructor(props){
    super(props);
    this.state = {
      annotations: [],
      annotation: {},
      items:[],
    }
    this.clearanno = this.clearanno.bind(this);
    this.saveanno = this.saveanno.bind(this);
  }
  


   = () => {
    var items=[];
    axios({
      url:'http://127.0.0.1:5000/taskhasimg',
      data:{
          // "task_id":this.props.taskid
          "task_id":7,
      },
      method:'POST'
      }).then(
          res => {
            for (let i = 0; i < res.data.imgList.length; i++) {      
              items.push(
                <Card style={{ width: 500 ,height:500}}>
                  <Annotation
                    src={"upload/img/"+res.data.imgList[i].url}
                    annotations={this.state.annotations}
                    type={this.state.type}
                    value={this.state.annotation}
                    onChange={this.onChange}
                    onSubmit={this.onSubmit}
                  />
                  </Card>
              );
                
          }
          
          this.setState({items:items});
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
  saveanno(t){
    console.log("save")
    console.log(t)
    console.log(this.state)
  }
  render () {
    return (
      <div >
        <Carousel style={{ width: 500 ,height:500}}>
          
          
           {/* {this.state.items} */}
           <Card style={{ width: 1000 ,height:500}}>
                  <Annotation
                    src={"upload/img/1_bear.png"}
                    annotations={this.state.annotations}
                    type={this.state.type}
                    value={this.state.annotation}
                    onChange={this.onChange}
                    onSubmit={this.onSubmit}
                  />
                  <Button type="primary" onClick={this.clearanno}>
                          清空
                  </Button>
                  <Button  type="primary" onClick={()=>this.saveanno(7)}>
                                保存
                  </Button>
                  </Card>
                  <Card style={{ width: 500 ,height:500}}>
                  <Annotation
                    src={"upload/img/1_ping.png"}
                    annotations={this.state.annotations}
                    type={this.state.type}
                    value={this.state.annotation}
                    onChange={this.onChange}
                    onSubmit={this.onSubmit}
                  />
                  <Button type="primary" onClick={this.clearanno}>
                          清空
                  </Button>
                  <Button  type="primary" onClick={()=>this.saveanno(7)}>
                                保存
                  </Button>
                  </Card>
         </Carousel>
         <button htmlType="button" onClick={()=>{console.log(this.state)}}>
                        print
          </button>
         </div>
      
    )
  }
}
export default LabelImg;