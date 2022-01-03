
import Login from "./components/login";
import Register from "./components/register";
import React from 'react'

import {HashRouter as Router,Route,Routes} from 'react-router-dom'
import Navi from "./components/navi";
import Test from "./components/test";

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
                <Route path='/test' element={<Test/>}/>
                
            </Routes>
            
            
        </Router>
            
        </h1>
    </div>
);
}

export default App;
