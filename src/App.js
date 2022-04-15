import react, {Component} from 'react'
import Header from './components/Header'
import Logout from './components/Logout'
// import DoubleEntrySys from './components/DoubleEntrySys'
import AccountsRecord from './components/AccountsRecord'
import './App.css';
import {BrowserRouter, Route} from 'react-router-dom'





  class App extends Component{

  render(){
  return (
    <BrowserRouter>
    <div>
      <Header/>
      
      <Route exact path='/' component={Logout}/>
      <Route path='/AccountsRecord' component={AccountsRecord}/>
      {/* <Route path='/DoubleEntrySys' component={DoubleEntrySys}/> */}
      

<br/><br/>
<a href='https://my-docs-67943.web.app/' target='_blank' style={{fontSize:'9px', marginLeft:'10px'}}>My Documents</a>      <a href='https://textrecordbook.web.app/' target='_blank' style={{fontSize:'9px', marginLeft:'20px'}}>Text Record</a>
<div className='bottomLine'> 
{/* Prepared By: Waqas Saleem <br/>
Easy Accounts Management System<br/> */}
Developed By: Waqas Saleem Contact: +923467605798 Email: waqas.mba86@gmail.com
</div>



    </div>
    </BrowserRouter>
  );
}
}

export default App;
