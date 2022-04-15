import react, {Component} from 'react'
import '../App.css';
import {Link, Route,BrowserRouter} from 'react-router-dom'
import firebase from './Fire'
import CustomerAccess from './CustomerAccess'
import App from '../App'



//This Component is made to show the all App you made
class Login extends Component{
    constructor(){
        super();
        this.state ={
                user:null
        }

    }


    componentDidMount(){
        this.authListener();
        
        }
        
        authListener = ()=>{
        firebase.auth().onAuthStateChanged( (user)=>{
            if(user){
                this.setState({user})
                // console.log(user.email)
        
        
            } else {
                this.setState({user:null})
            }
        })
        }

    render(){
        return(
        <div>

{this.state.user ? (<App/>) : <LoginForm/>}

        </div>
        )
    }
}

export default Login;









//THis Component is made to login by the user (it is login form)
class LoginForm extends Component{
   
    constructor(){
        super();
        this.state ={
                forgetStatus:false,
                forgetEmial:'',
                login:false,
                // box1:false
                
                // customerPortal:false


                
        }

    }



    



    signin = ()=>{
        this.setState({login:true})


     const email = document.querySelector('#email').value;
     const password = document.querySelector('#password').value;
 
 
 
     firebase.auth().signInWithEmailAndPassword(email, password)
     .then( (u)=>{
 
         // console.log(u.user.uid)
         // console.log(u)
         
     } )
     .catch( (err)=>{
         alert('Your Password is incorrect or you are not registered.')
         console.log('error')
     } )
 


    // setTimeout(()=>{

     
    //  setInterval(()=>{
    //      this.setState({box1:!this.state.box1})
    //  },200)

    // },10)



    } 
 
 



    showForgetField = ()=>{
        this.setState({forgetStatus:true})
    }


    changeHandler = (e)=>{
        this.setState({forgetEmial: e.target.value})

        console.log(this.state.forgetEmial)
    }


    ressetPassword = ()=>{

        firebase.auth().sendPasswordResetEmail(this.state.forgetEmial)
        .then(()=>{
            alert('Please check email and reset your password')
        }).catch((error)=>{
            alert(error)
        })

    }





    // customer=()=>{
    //     this.setState({customerPortal:true})
    // }
    



     render(){
         return (
             <div>
 

{/* <div className={this.state.customerPortal === false ? '' : 'display'}> */}




 <div id='div1'> 
      Easy Accounts
      </div>
      <span style={{fontSize:'12px'}}>{navigator.onLine===true ? <span style={{color:'green'}}>You are online</span> : <span style={{color:'red'}}>You are OffLine</span>}</span>
<br/><br/>


            
             <div className="row container">
             <div className="col s12">

<h2 className='headings' style={{fontSize:'25px'}}>User Login</h2>

             
              
              
              
               <div className="input-field">
              <input placeholder="Email" id="email" type="text" className="validate" />
              {/* <label forhtml="first_name">First Name</label> */}
               </div>
 
               <div className="input-field">
              <input placeholder="Password" id="password" type="password" className="validate" />
              {/* <label forhtml="first_name">First Name</label> */}
               </div>
 
               <button style={{padding:'10px',fontSize:'18px',borderRadius:'7px', color:'blue', backgroundColor:this.state.login===false?'lightgreen' : 'lightyellow' }} onClick={this.signin}> {this.state.login===false? 'Login' : 'Signing In...'} </button>
               {/* <button className="waves-effect btn-large" onClick={this.signin}>Login</button> */}

                <a href='#' onClick={this.showForgetField}>Forget Password ?</a>
{/* <br/><br/>
<div style={{textAlign:'left'}}><span style={{display:'inline-block', border:'1px solid gray',width:'25px',backgroundColor:this.state.box1===true?'yellow':'white'}}>.</span><span style={{display:'inline-block',border:'1px solid gray',width:'25px',backgroundColor:this.state.box1===true?'white':'yellow'}}>.</span> </div> */}


<br/><br/><br/><br/>



                
                <div className={this.state.forgetStatus === false ? 'display' : ''}>
                <p><b style={{color:'green'}}>Pleae enter your email address in below field on which you want to reset your Password</b></p>
                <input type='text' value={this.state.forgetEmial} name='forgetEmail' onChange={this.changeHandler} placeholder='Write Email here' />
                <button onClick={this.ressetPassword} className="waves-effect btn-large">Resset</button>
                
                </div>
              </div>
              </div>
              





<hr style={{height:'2px', backgroundColor:'red'}}/>

<br/><br/>


<div className='container'>
<BrowserRouter>
<Link to='/CustomerAccess' className='headings' style={{fontSize:'17px', backgroundColor:'lightgray', padding:'10px'}} > <b>Customer Login</b> </Link>
<Route path='/CustomerAccess' component={CustomerAccess}/> 
 </BrowserRouter>
</div>






<br/><br/>
<a href='https://my-docs-67943.web.app/' target='_blank' style={{fontSize:'9px', marginLeft:'10px'}}>My Documents</a>      <a href='https://textrecordbook.web.app/' target='_blank' style={{fontSize:'9px', marginLeft:'20px'}}>Text Record</a>
<div className='bottomLine'> 
{/* Prepared By: Waqas Saleem <br/>
Easy Accounts Management System<br/> */}
Developed By: Waqas Saleem Contact: +923467605798 Email: waqas.mba86@gmail.com
</div>

{/* </div> */}




             </div>
         )
     }
 }



























// import react, {Component} from 'react'
// import '../App.css';
// // import {Link, Route,BrowserRouter} from 'react-router-dom'
// import firebase from './Fire'
// import App from '../App'



// //This Component is made to show the all App you made
// class Login extends Component{
//     constructor(){
//         super();
//         this.state ={
//                 user:null
//         }

//     }


//     componentDidMount(){
//         this.authListener();
        
//         }
        
//         authListener = ()=>{
//         firebase.auth().onAuthStateChanged( (user)=>{
//             if(user){
//                 this.setState({user})
//                 // console.log(user.email)
        
        
//             } else {
//                 this.setState({user:null})
//             }
//         })
//         }

//     render(){
//         return(
//         <div>

// {this.state.user ? (<App/>) : <LoginForm/>}

//         </div>
//         )
//     }
// }

// export default Login;









// //THis Component is made to login by the user (it is login form)
// class LoginForm extends Component{
   
//     constructor(){
//         super();
//         this.state ={
//                 forgetStatus:false,
//                 forgetEmial:''
//         }

//     }




//     signin = ()=>{
//      const email = document.querySelector('#email').value;
//      const password = document.querySelector('#password').value;
     
 
 
 
//      firebase.auth().signInWithEmailAndPassword(email, password)
//      .then( (u)=>{
 
//          // console.log(u.user.uid)
//          // console.log(u)
         
//      } )
//      .catch( (err)=>{
//          alert('Your Password is incorrect or you are not registered.')
//          console.log('error')
//      } )
 
//     } 
 
 



//     showForgetField = ()=>{
//         this.setState({forgetStatus:true})
//     }


//     changeHandler = (e)=>{
//         this.setState({forgetEmial: e.target.value})

//         console.log(this.state.forgetEmial)
//     }


//     ressetPassword = ()=>{

//         firebase.auth().sendPasswordResetEmail(this.state.forgetEmial)
//         .then(()=>{
//             alert('Please check email and reset your password')
//         }).catch((error)=>{
//             alert(error)
//         })

//     }





//      render(){
//          return (
//              <div>
 
//  <div id='div1'> 
//       Easy Accounts
//       </div>
//       <span style={{fontSize:'12px'}}>{navigator.onLine===true ? <span style={{color:'green'}}>You are online</span> : <span style={{color:'red'}}>You are OffLine</span>}</span>
// <br/><br/>

// <h2 className='headings' style={{textAlign:'center',fontSize:'30px'}}>Login Here</h2>

//              <div className="row container">
//              <div className="col s12">
              
              
              
//                <div className="input-field">
//               <input placeholder="Email" id="email" type="text" className="validate" />
//               {/* <label forhtml="first_name">First Name</label> */}
//                </div>
 
//                <div className="input-field">
//               <input placeholder="Password" id="password" type="password" className="validate" />
//               {/* <label forhtml="first_name">First Name</label> */}
//                </div>
 
//                <button className="waves-effect btn-large" onClick={this.signin}>Login</button>

//                 <a href='#' onClick={this.showForgetField}>Forget Password ?</a>
// <br/><br/><br/>

                
//                 <div className={this.state.forgetStatus === false ? 'display' : ''}>
//                 <p><b style={{color:'green'}}>Pleae enter your email address in below field on which you want to reset your Password</b></p>
//                 <input type='text' value={this.state.forgetEmial} name='forgetEmail' onChange={this.changeHandler} placeholder='Write Email here' />
//                 <button onClick={this.ressetPassword} className="waves-effect btn-large">Resset</button>
                
//                 </div>


//               </div>
//               </div>
 


//               <br/><br/>
// <div className='bottomLine'> 
// Prepared By: Waqas Saleem <br/>
// Easy Accounts Management System<br/>
// Contact: 0346-7605798 Email: waqas_mba86@yahoo.com
// </div>


//              </div>
//          )
//      }
//  }

