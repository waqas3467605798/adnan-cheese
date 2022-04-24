import react, {Component , useRef} from 'react'
import '../App.css';
import {Link, Route,BrowserRouter} from 'react-router-dom'
import firebase from './Fire'
import CustomerAccess from './CustomerAccess'
import App from '../App'
import {useReactToPrint} from 'react-to-print'


class Heading extends Component{
    constructor(){
        super();
        this.state={

        }
    }
render(){
    return(
        <div>
            <br/>
            <div style={{border:'3px solid blue', width:'45%',margin:'auto',textAlign:'center',padding:'10px',borderRadius:'10px', fontSize:'150%',color:'blue'}}>
            <b>Adnan's Cheese</b>
            </div>
        </div>
    )
}
    
}









class Trial extends Component{
    constructor(){
        super();
        this.state={
            partyObjects:[],
            arrayForSum:[],
            status:false,
            ledgerDisplay:false,
            ledger:[],
            ledgerBalance:[],
            sum:[],
            accountTitle:'',
            ledgerFor30Days:-50,
            user:null,
            showSummary:false,
            pageRefresh:0
        }
    }



    async componentDidMount(){
        //first promise function starting
        var dataPushPromise = new Promise( (res,rej)=>{
        // var userId = firebase.auth().currentUser.uid;
        // var userEmail = firebase.auth().currentUser.email
    
        // this.setState({user:userId,userEmail:userEmail})
        
        res()
        rej('Operation Failed: Data From Firebase does not push in state successfully')
      } )
      dataPushPromise.then(()=>{
        //second promise function is starting
        var pushPromise = new Promise((res,rej)=>{
          var obj = [];
          firebase.database().ref('partyList').on('child_added' , (data)=> { 
            obj.push(data.val())
          }  )
          res(obj);
          rej('Operation Failed');
        })
        pushPromise.then((ob)=>{
          this.setState({partyObjects:ob.sort((a, b) => (a.accountCategory > b.accountCategory) ? 1 : -1)      })
        },(er)=>{
          alert(er)
        })
  
  
      },(err)=>{
        alert(err)
      })
    
  
  
      setTimeout(() => {
  
        const inteId =setInterval(()=>{
          this.setState({pageRefresh: this.state.pageRefresh+1})
        },1000)
  
        setTimeout(() => {
          clearInterval(inteId);
        }, 30000);
      
      
      
      }, 1000);
  
  
  
      
    }
  
  
    
    
    
      displayLedger = (i)=> {
    
    this.setState({ledgerDisplay:true})
    var reqObj = this.state.partyObjects[i]
    this.setState({accountTitle:reqObj.partyName})
    if('ledger' in reqObj){
    var ledgerData = reqObj.ledger;
    var ledgerBalance = reqObj.sum
    this.setState({ledger: ledgerData, renderLedgerData:true, noData:null, ledgerBalance:ledgerBalance})
    
    }
    else{
     
     var noDataFound = 'No data found'
     this.setState({noData: noDataFound, renderLedgerData:false})
     console.log(noDataFound)
     
    }
    
    this.setState({sum:[]}) //As the render method will run again, so the array of sum and sumQty in state should be zero
      
    
    
    }
    
    
    backToTrial = ()=>{
      this.setState({ledgerDisplay:false})
    }
    
    
  
    
      getData = ()=>{
        this.setState({status:!this.state.status})        //As status true, the render function will run again - because of change in state
        console.log(this.state.status)
      }
    



      showSummary=()=>{
        var keywords = prompt('Enter Key')
        if(keywords==='adn'){
            this.setState({showSummary:true})
        }else{
            alert('you have entered Wrong key')
            this.setState({showSummary:false})
        }
      }




render(){
    return(
        <div>
        
        <div className='container'>
        <p style={{cursor:'pointer', color:'blue'}} onClick={this.showSummary}>Show Summary</p>
        </div>

    {/* {this.state.pageRefresh}         */}
          <div className={this.state.showSummary===false?'display':'container'}>
            
    
            {/* the below div is in case of trial display */}
            <br/><br/>
            <div id='trialPrint' className={this.state.ledgerDisplay === false ? '' : 'display'}> 
  
          <br/>
          
          <button className="waves-effect waves-dark btn" onClick={this.getData} style={{width:'100%'}}>Summary</button> <br/>
          
          {/* <div className={this.state.status === true ? '' : 'display'}> */}
          
          <table style={{maxWidth:'850px',margin:'auto'}}><thead><tr><th>Account Title</th><th>Debit</th><th>Credit</th><th>Account Type</th></tr></thead><tbody>{this.state.partyObjects.map(  (name,ind)=>{return <tr key={ind} className={name.sum.reduce( (total,num)=>{return total+num},0)===0 ? 'display' : ''}><td style={{minWidth:'150px'}}><a href='#' onClick={()=>this.displayLedger(ind)} style={{color:'blue'}}>{name.partyName}</a></td><td className={name.sum.reduce( (total,num)=>{return total+num},0) > 0 ? 'trialPositiveAmt' : 'trialNegativeAmt'}><b>{name.sum.reduce( (total,num)=>{return total+num},0) > 0 ? name.sum.reduce( (total,num)=>{return total+num},0) : '-'}</b></td><td className={name.sum.reduce( (total,num)=>{return total+num},0) > 0 ? 'trialPositiveAmt' : 'trialNegativeAmt'}><b>{name.sum.reduce( (total,num)=>{return total+num},0) < 0 ? name.sum.reduce( (total,num)=>{return total+num},0) : '-'}</b></td><td style={{fontSize:'12px'}}>{name.accountCategory}</td></tr>})}</tbody></table>
          {/* <button className="waves-effect waves-dark btn blue" onClick={()=>{this.printStm('trialPrint')}}>Print this page</button> */}
          
          {/* </div> */}
          
        
          </div>
          
          
          {/* the following div is in case of ledger display */}
          <div className={this.state.ledgerDisplay === true ? '' : 'display'}>
            <br/><br/>
          <p><b>ACCOUNT TITLE:</b> <span style={{color:'green', fontSize:'18px'}}>{this.state.accountTitle} </span><br/>
          <span style={{color:'red',fontSize:'14px'}}>Last 50-Transactions</span></p>
          <table style={{maxWidth:'700px',margin:'auto'}}><thead><tr><th>V#</th><th>Date</th><th>Remarks</th><th>Debit</th><th>Credit</th><th>Balance</th></tr></thead><tbody>{this.state.ledger.map(  (item,index)=>{return <tr key={index}><td>{item.voucherNumber}</td><td>{item.date}</td><td style={{minWidth:'160px'}}>{item.narration}</td><td className={item.debit >= 0 ? 'ldgrPostveAmt' : 'ldgrNegtveAmt'}>{item.debit >=0 ? item.debit : ''}</td><td className={item.debit >= 0 ? 'ldgrPostveAmt' : 'ldgrNegtveAmt'}>{item.debit <0 ? item.debit : ''}</td><td className={this.state.ledgerBalance.slice(0,index+2).reduce( (total,num)=>{return total+num},0) >= 0 ? 'ldgrPostveAmt' : 'ldgrNegtveAmt'}><b>{this.state.ledgerBalance.slice(0,index+2).reduce( (total,num)=>{return total+num},0)}</b></td></tr>}).slice(this.state.ledgerFor30Days)    }</tbody></table>  {/*the Slice method is applied on map array to get only last 30 transactions as on your need*/ }
          <button className="waves-effect waves-dark btn" onClick={this.backToTrial}>Back to summary</button>
          
          </div>
        <br/>
          <div className={this.state.status === true ? '' : 'display'}>
          
          </div>
          
          </div>
  
          {/* <iframe id="ifmcontentstoprint" style={{height:'0px', width: '0px', position: 'absolute'}}></iframe> */}
          </div>
    )
}
    
}


//This Component is made to show the all App you made
class LoginCompo extends Component{
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











//THis Component is made to login by the user (it is login form)
class LoginForm extends Component{
   
    constructor(){
        super();
        this.state ={
                forgetStatus:false,
                forgetEmial:'',
                login:false,
                showLoginForm:false



                
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



    showLoginForm = ()=>{
        var key = prompt('Enter Key words')

        if(key==='abc'){
        this.setState({showLoginForm:true})
    }else{
        alert('You have entered wrong key')
    }
    }



     render(){
         return (
             <div>

<p onClick={this.showLoginForm} style={{cursor:'pointer', color:'blue'}}>Login</p>

             <div className={this.state.showLoginForm===false?'display': 'row container'}>
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
 
               <button style={{padding:'10px',fontSize:'18px',borderRadius:'7px',cursor:'pointer', color:'blue', backgroundColor:this.state.login===false?'lightgreen' : 'lightyellow' }} onClick={this.signin}> {this.state.login===false? 'Login' : 'Signing In...'} </button>
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
              





{/* <hr style={{height:'2px', backgroundColor:'red'}}/>

<br/><br/> */}


{/* <div className='container'>
<BrowserRouter>
<Link to='/CustomerAccess' className='headings' style={{fontSize:'17px', backgroundColor:'lightgray', padding:'10px'}} > <b>Customer Login</b> </Link>
<Route path='/CustomerAccess' component={CustomerAccess}/> 
 </BrowserRouter>
</div> */}







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















const Login = ()=>{

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: ()=>componentRef.current,
    })
    
      return(
        <div>
            <Heading/>
        <Trial ref={componentRef}/>
        <br/><br/><br/>
        <a id='printButton' style={{cursor:'pointer'}} onClick={handlePrint}>Print/PDF</a>
        <br/><br/><br/><br/>
        <LoginCompo />
    
    
        
        </div>
      )
    }
    
    
    
    export default Login;