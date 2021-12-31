
import Login from "./components/login";
import Register from "./components/register";
import React from 'react'
import Test from "./components/test";
import Uploads from "./components/uploads";
import ShowTasks from "./components/showtasks";

import {HashRouter as Router,Route,Routes} from 'react-router-dom'
import Navi from "./components/navi";
import WorkstationConfig from "./components/canvas";
import ShowImgs from "./components/resource";

function App() {
  return (
    <div className="container">
        <h1 className="center-align">
        <Router>
     
            <Routes>
                
                <Route path='/'  element = {<Login/>}/>
                <Route path='/login'  element = {<Login/>}/>
                <Route path='/register'  element = {<Register/>}/>
                <Route path='/label'  element = {<Navi/>}/>
                <Route path='/canvas'  element = {<WorkstationConfig/>}/>
                <Route path='/test'  element = {<Test/>}/>
                <Route path='/resources'  element = {<ShowImgs/>}/>
                <Route path='/tasklist'  element = {<ShowTasks/>}/>
            </Routes>
            
            
        </Router>
            
        </h1>
    </div>
);
}

export default App;
