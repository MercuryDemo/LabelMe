
import React, { Component } from 'react';


import GlobalData from './globalData';

class Test extends Component {
  constructor(props){
    super(props);
    this.state={

    }
 
  }
  
  render() {
    
    return (
      // 123
      <div>
          {GlobalData.username}, Welcome to LabelMe!
          <br/>
        Here, you can upload pictures and videos, create tasks, label images, and export data sets.
        <br/>
        Start your LABEL journey now!
      </div>
    )
  }
}
 
export default Test;