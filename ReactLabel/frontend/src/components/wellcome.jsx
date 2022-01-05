

import React, { Component } from 'react';


import GlobalData from './globalData';

import { Carousel,Image } from 'antd';
import Text from 'antd/lib/typography/Text';
const contentStyle = {
  // height: '160px',
  color: '#fff',
  // lineHeight: '160px',
  textAlign: 'center',
  // background: '#364d79',
};


class Wel extends Component {
  constructor(props){
    super(props);
    this.state={

    }
  }
  
  render() {
    
    return (
      <>
      <p font-size={"10px"} >
          {GlobalData.username}, Welcome to LabelMe!
          {/* <br/>
        Here, you can upload pictures and videos, create tasks, label images, and export data sets.
        <br/>
        Start your LABEL journey now! */}
      </p>
      <Carousel autoplay>
      <div>
      <Image src="static/1.jpg" />
 
      </div>
      <div>
      <Image src="static/2.jpg"/>
      </div>
      <div>
      <Image  src="static/3.jpg" />
      </div>
      <div>
      <Image src="static/4.jpg" />
      </div>
    </Carousel>
    </>
    )
  }
}
 
export default Wel;


