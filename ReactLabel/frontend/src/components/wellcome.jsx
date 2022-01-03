
import React, { Component } from 'react';


import GlobalData from './globalData';

class Wel extends Component {
  constructor(props){
    super(props);
    this.state={

    }
  }
  
  render() {
    
    return (
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
 
export default Wel;