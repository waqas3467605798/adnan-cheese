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
