import react, {Component , useRef} from 'react'
import '../App.css';
import {Link, Route,BrowserRouter} from 'react-router-dom'
import firebase from './Fire'
import logo from './logo.png'
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
            
            <div style={{margin:'auto',textAlign:'center',padding:'10px',borderRadius:'10px', fontSize:'200%',color:'blue'}}>
            <b>بسم اللہ الرحمن الرحیم </b>
            
            
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
            ledgerFor30Days:-500,
            user:null,
            showNavBar:false,
            showSummary:false,
            showStatement:false,
            urduFormate:false,
            showPartyList:false,
            enterKeyInput:true,


          // state of get list of parties
          address:'',
          partyName:'',
          chartOfAccount:'',
          // partyObjects:[],
          chartOfAccountObject:[],
          getListStatus:false,

          clicks:0,

            
            keyValue:'',
            wrongKey:'',
            pageRefresh:0,
            loadingFromFirebase:1
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
  
  
  
      



      setTimeout(()=>{
        this.setState({loadingFromFirebase:0})
      
      setTimeout(()=>{
        firebase.database().ref('loadingDefaultValue').on('child_added' , (data)=> {
          this.setState({loadingFromFirebase:data.val()})
        }  )
      },900)
      
  
      setTimeout(()=>{
        this.setState({seemsInternetIsSlow:'Seems internet speed is slow, try again later'})
      },8000)
  
  
      },200)







      firebase.database().ref('clicks').on('child_added' , (data)=> {
        this.setState({clicks:data.val()})
      }  )



    }
  
  
    
    changeHandler = (e) => {

      this.setState({ 
      [e.target.name]: e.target.value
      })
      
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
    



      // showSummary=()=>{
        
      //       this.setState({enterKeyInput:true, enterKeyInputForStatement:false, showStatement:false})
        
      // }


      showSummary=()=>{
        
            this.setState({showSummary:true, urduFormate:false, showStatement:false,showPartyList:false, enterKeyInput:false,wrongKey:'', keyValue:''})
        
      }




  


      showStatement=()=>{
        
            this.setState({showStatement:true, urduFormate:false,showSummary:false, showPartyList:false, enterKeyInput:false, wrongKey:'',keyValue:''})
        
      }



      urduFormate=()=>{
        this.setState({urduFormate:true, showStatement:false, showSummary:false, showPartyList:false, enterKeyInput:false, wrongKey:'',keyValue:''})
      }



      showPartyList=()=>{
        this.setState({showPartyList:true,urduFormate:false, showStatement:false, showSummary:false, enterKeyInput:false, wrongKey:'',keyValue:''})
      }

      showNavBar=()=>{
        var clicks = this.state.clicks+1
        firebase.database().ref('clicks').set({clicks:clicks})




        var keywords = this.state.keyValue
        if(keywords==='adn'){

        this.setState({enterKeyInput:false})
        }else{
          this.setState({enterKeyInput:true, wrongKey:'You have entered Wrong Key'})
        }
      
      


        
      
      }




      last_20_transaction=()=>{
        this.setState({ledgerFor30Days:-20})
      }



render(){
    return(
        <div>
        <div className={this.state.loadingFromFirebase===0?'display':''}>



<br/>
        <div style={{textAlign:'center'}} className={this.state.enterKeyInput===false?'container':'display'}>
        <span className='navBarHomePage' style={{cursor:'pointer', color:'gray', fontSize:'14px'}} onClick={this.showSummary}>کھاتوں کا خلاصہ</span>
        <span className='navBarHomePage' style={{cursor:'pointer', color:'gray',fontSize:'14px'}} onClick={this.showStatement}>تمام کھاتے</span>
        {/* <span className='navBarHomePage' style={{cursor:'pointer', color:'gray',fontSize:'12px'}} onClick={this.urduFormate}>Urdu-Khata</span> */}
        <span className='navBarHomePage' style={{cursor:'pointer', color:'gray',fontSize:'14px'}} onClick={this.showPartyList}>کسٹمر لسٹ</span>
        </div>


        <div style={{textAlign:'center'}} className={this.state.enterKeyInput===false?'display':'container'}>
          <input type='text' onChange={this.changeHandler} value={this.state.keyValue} name='keyValue' className='browser-default' placeholder='Enter Key'/> <button onClick={this.showNavBar}>OK</button><br/>
        <span style={{color:'red'}}><b>{this.state.wrongKey}</b></span>
        </div>        




       



    {/* {this.state.pageRefresh} */}


{/* Here from starting the div of ledgers having balances only */}
  <div className={this.state.showSummary===false?'display':'container'}>
            
    


  <div id='trialPrint' className={this.state.ledgerDisplay === false ? '' : 'display'}> 
  
  <br/>
  
  <button className="waves-effect waves-dark btn" onClick={this.getData} style={{width:'100%', fontSize:'20px'}}>کھاتوں کا خلاصہ	</button> <br/>
  
  {/* <div className={this.state.status === true ? '' : 'display'}> */}
  
  <table style={{maxWidth:'850px',margin:'auto'}}><thead><tr><th>پارٹی کا نام</th><th>واجب الوصول</th><th>واجب الادا</th><th>کھاتہ </th></tr></thead><tbody>{this.state.partyObjects.map(  (name,ind)=>{return <tr key={ind} className={name.sum.reduce( (total,num)=>{return total+num},0)===0 ? 'display' : ''}><td style={{minWidth:'150px'}}><a href='#' onClick={()=>this.displayLedger(ind)} style={{color:'blue'}}>{name.partyName}</a></td><td className={name.sum.reduce( (total,num)=>{return total+num},0) > 0 ? 'trialPositiveAmt' : 'trialNegativeAmt'}><b>{name.sum.reduce( (total,num)=>{return total+num},0) > 0 ? name.sum.reduce( (total,num)=>{return total+num},0) : '-'}</b></td><td className={name.sum.reduce( (total,num)=>{return total+num},0) > 0 ? 'trialPositiveAmt' : 'trialNegativeAmt'}><b>{name.sum.reduce( (total,num)=>{return total+num},0) < 0 ? name.sum.reduce( (total,num)=>{return total+num},0) : '-'}</b></td><td style={{fontSize:'12px'}}>{name.accountCategory}</td></tr>})}</tbody></table>
  {/* <button className="waves-effect waves-dark btn blue" onClick={()=>{this.printStm('trialPrint')}}>Print this page</button> */}
  
  {/* </div> */}
  

  </div>
  
  
  {/* the following div is in case of ledger display */}
  <div className={this.state.ledgerDisplay === true ? '' : 'display'}>
    <br/><br/>

  {/* <div style={{backgroundColor:'lightgreen', color:'green',textAlign:'center', fontSize:'22px'}}>Books of Adnan's Cheese <br/> <span style={{fontSize:'15px'}}> 0300-7241301, 0300-1117734 </span></div> */}

  <p style={{textAlign:'center'}}>
  <img src={logo} height='45' width='38%' alt='Logo Here'/>
  </p>

    <p style={{color:'green',fontSize:'14px', textAlign:'left'}}>Last 500-Transactions  <span style={{color:'red',cursor:'pointer'}} onClick={this.last_20_transaction} >o</span>  </p>
  <p style={{textAlign:'right'}}><span style={{fontSize:'18px'}}> <u>{this.state.accountTitle} </u> : کھاتہ بنام </span><br/></p>
  <table style={{maxWidth:'700px',margin:'auto', borderColor:'red'}}><thead><tr><th className='borderHead center'> بقایا <br/> روپیہ</th><th className='borderHead center'> جمع<br/> روپیہ</th><th className='borderHead center'> نام <br/> روپیہ</th><th className='borderHead' style={{textAlign:'center'}}>تفصیل</th><th className='borderHead center'>تاریخ </th></tr></thead><tbody>{this.state.ledger.map(  (item,index)=>{return <tr key={index}><td className={this.state.ledgerBalance.slice(0,index+2).reduce( (total,num)=>{return total+num},0) >= 0 ? 'ldgrPostveAmt' : 'ldgrNegtveAmt'}><b>{this.state.ledgerBalance.slice(0,index+2).reduce( (total,num)=>{return total+num},0)}</b></td><td className={item.debit >= 0 ? 'ldgrPostveAmt' : 'ldgrNegtveAmt'}>{item.debit <0 ? item.debit : ''}</td><td className={item.debit >= 0 ? 'ldgrPostveAmt' : 'ldgrNegtveAmt'}>{item.debit >=0 ? item.debit : ''}</td><td style={{minWidth:'160px', textAlign:'center'}}>{item.narration}</td><td>{item.date}</td></tr>}).slice(this.state.ledgerFor30Days)    }</tbody></table>  {/*the Slice method is applied on map array to get only last 30 transactions as on your need*/ }
  
  <br/>
  <span style={{cursor:'pointer', color:'green',border:'1px solid lightgreen', backgroundColor:'lightyellow'}} onClick={this.backToTrial}><b>واپس جائیں</b></span>
  
  </div>
<br/>
  <div className={this.state.status === true ? '' : 'display'}>
  
  </div>






          </div>









{/* Here from div of Statement */}
<div className={this.state.showStatement===false?'display':'container'}>
  




<div id='trialPrint' className={this.state.ledgerDisplay === false ? '' : 'display'}> 
  
          <br/>
          
          <button className="waves-effect waves-dark btn" onClick={this.getData} style={{width:'100%', fontSize:'20px'}}>کھاتوں کا خلاصہ	</button> <br/>
          
          {/* <div className={this.state.status === true ? '' : 'display'}> */}
          
          <table style={{maxWidth:'850px',margin:'auto'}}><thead><tr><th>پارٹی کا نام</th><th>واجب الوصول</th><th>واجب الادا</th><th>کھاتہ </th></tr></thead><tbody>{this.state.partyObjects.map(  (name,ind)=>{return <tr key={ind} ><td style={{minWidth:'150px'}}><a href='#' onClick={()=>this.displayLedger(ind)} style={{color:'blue'}}>{name.partyName}</a></td><td className={name.sum.reduce( (total,num)=>{return total+num},0) > 0 ? 'trialPositiveAmt' : 'trialNegativeAmt'}><b>{name.sum.reduce( (total,num)=>{return total+num},0) > 0 ? name.sum.reduce( (total,num)=>{return total+num},0) : '-'}</b></td><td className={name.sum.reduce( (total,num)=>{return total+num},0) > 0 ? 'trialPositiveAmt' : 'trialNegativeAmt'}><b>{name.sum.reduce( (total,num)=>{return total+num},0) < 0 ? name.sum.reduce( (total,num)=>{return total+num},0) : '-'}</b></td><td style={{fontSize:'12px'}}>{name.accountCategory}</td></tr>})}</tbody></table>
          {/* <button className="waves-effect waves-dark btn blue" onClick={()=>{this.printStm('trialPrint')}}>Print this page</button> */}
          
          {/* </div> */}
          
        
          </div>
          
          
          {/* the following div is in case of ledger display */}
          <div className={this.state.ledgerDisplay === true ? '' : 'display'}>
            <br/><br/>

          {/* <div style={{backgroundColor:'lightgreen', color:'green',textAlign:'center', fontSize:'22px'}}>Books of Adnan's Cheese <br/> <span style={{fontSize:'15px'}}> 0300-7241301, 0300-1117734 </span></div> */}

          <p style={{textAlign:'center'}}>
          <img src={logo} height='45' width='38%' alt='Logo Here'/>
          </p>

            <p style={{color:'green',fontSize:'14px', textAlign:'left'}}>Last 500-Transactions  <span style={{color:'red',cursor:'pointer'}} onClick={this.last_20_transaction} >o</span>  </p>
          <p style={{textAlign:'right'}}><span style={{fontSize:'18px'}}> <u>{this.state.accountTitle} </u> : کھاتہ بنام </span><br/></p>
          <table style={{maxWidth:'700px',margin:'auto', borderColor:'red'}}><thead><tr><th className='borderHead center'> بقایا <br/> روپیہ</th><th className='borderHead center'> جمع<br/> روپیہ</th><th className='borderHead center'> نام <br/> روپیہ</th><th className='borderHead' style={{textAlign:'center'}}>تفصیل</th><th className='borderHead center'>تاریخ </th></tr></thead><tbody>{this.state.ledger.map(  (item,index)=>{return <tr key={index}><td className={this.state.ledgerBalance.slice(0,index+2).reduce( (total,num)=>{return total+num},0) >= 0 ? 'ldgrPostveAmt' : 'ldgrNegtveAmt'}><b>{this.state.ledgerBalance.slice(0,index+2).reduce( (total,num)=>{return total+num},0)}</b></td><td className={item.debit >= 0 ? 'ldgrPostveAmt' : 'ldgrNegtveAmt'}>{item.debit <0 ? item.debit : ''}</td><td className={item.debit >= 0 ? 'ldgrPostveAmt' : 'ldgrNegtveAmt'}>{item.debit >=0 ? item.debit : ''}</td><td style={{minWidth:'160px', textAlign:'center'}}>{item.narration}</td><td>{item.date}</td></tr>}).slice(this.state.ledgerFor30Days)    }</tbody></table>  {/*the Slice method is applied on map array to get only last 30 transactions as on your need*/ }
          
          <br/>
          <span style={{cursor:'pointer', color:'green',border:'1px solid lightgreen', backgroundColor:'lightyellow'}} onClick={this.backToTrial}><b>واپس جائیں</b></span>
          
          </div>
        <br/>
          <div className={this.state.status === true ? '' : 'display'}>
          
          </div>










</div>















{/* className={this.state.getListStatus === false ? 'display' : ''} */}

{/* Here from div of Parties List */}
<div className={this.state.showPartyList===false?'display':'container'}>
  <br/>
<div>
  <table><thead><tr style={{backgroundColor:'lightgray'}}><th>Account Title</th><th>Contact..etc</th><th>Category</th></tr></thead><tbody>{this.state.partyObjects.map(  (item,index)=>{return <tr key={index}><td>{(index+1) + '- ' + item.partyName}</td><td>{item.address}</td><td>{item.accountCategory}</td></tr>})    }</tbody></table> 
{/* </div> */}
</div>


</div>

  
          
          </div>














{/* Here from div of Loading... in case of data not coming from Firebase */}
  <div className={this.state.loadingFromFirebase===0?'container':'display'}>
  <br/><br/><br/>
  {/* <span style={{color:'green',fontSize:'23px'}}>Loading.....</span><br/> */}
  
  <span style={{color:'green',fontSize:'20px'}}>Please Wait....</span><br/>

{/* below is pre-loader code */}
  <div class="preloader-wrapper active">
    <div class="spinner-layer spinner-red-only">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>
  </div>
  


  
  
  
  
  <span style={{color:'red'}}>{this.state.seemsInternetIsSlow}</span>
</div>

















          
          
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

        if(key==='adn'){
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
          <LoginCompo />
            <Heading/>
        <Trial ref={componentRef}/>
        <br/><br/><br/>
        <div className='container'>
        <a id='printButton' style={{cursor:'pointer'}} onClick={handlePrint}>Print/PDF</a>
        </div>
        <br/><br/><br/><br/>
        
    

<div className='bottomLine'> 
{/* Prepared By: Waqas Saleem <br/>
Easy Accounts Management System<br/> */}
Developed By: Waqas Saleem Contact: +923467605798 Email: waqas.mba86@gmail.com
</div>


    
        
        </div>
      )
    }
    
    
    
    export default Login;