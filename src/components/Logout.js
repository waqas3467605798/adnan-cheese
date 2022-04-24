import react, {Component} from 'react'
import '../App.css';
import firebase from './Fire'
// import {Link} from 'react-router-dom'


  class Logout extends Component{
    constructor(){
      super();
      this.state ={
        user:null,
        userEmail:null,
        partyObjects:[],
        status:false,
        keyWords:'',
        customerAccessList:[],
        listStatus:false,
        showAccessDiv:false
      }

  }



  async componentDidMount(){
    var dataPushPromise = new Promise( (res,rej)=>{
    var userId = firebase.auth().currentUser.uid;
    var userEmail = firebase.auth().currentUser.email
    this.setState({user:userId,userEmail:userEmail})
    res()
    rej('Operation Failed: Data From Firebase does not push in state successfully')
  } )
  dataPushPromise.then(()=>{

    var pushPromise = new Promise((resolve,reject)=>{
      var obj = [];
      firebase.database().ref('partyList').on('child_added' , (data)=> { 
        obj.push(data.val())
      }  )
      resolve(obj)
      reject('Operation failed')
    })
    pushPromise.then((ob)=>{
      this.setState({partyObjects:ob})
    },(er)=>{
      alert(er)
    })


  },(err)=>{
    alert(err)
  })


  firebase.database().ref('customerAccess').on('child_added' , (data)=> { 
    this.state.customerAccessList.push(data.val())
  }  )



}


  // componentDidMount(){
  //   var userId = firebase.auth().currentUser.uid;
  //   var userEmail = firebase.auth().currentUser.email
    
  //   this.setState({user:userId,userEmail:userEmail})
  // }

    Logout= ()=>{
        firebase.auth().signOut();
    }





    getData =()=>{
      this.setState({status: ! this.state.status})
    }
    
    
    
    changeHandler=(e)=>{
    this.setState({[e.target.name]: e.target.value  })
    
    
    }
      
    
    allowAccess = ()=>{
    
    
     var alreadyPartyExist = this.state.customerAccessList.find(  (o)=>{return o.partyName === document.getElementById('selected_save2').value}  )
     var alreadyKeyExist = this.state.customerAccessList.find(  (o)=>{return o.keyWords === this.state.keyWords}  )
     
     
    if(alreadyPartyExist){
      alert('Alread Access alowed to the selected Account')
    }else{
    
     
      if(alreadyKeyExist){
        alert('Password already exist, Plz change your Password')
      }else{
    
    
    var obj = []
    obj.keyWords = this.state.keyWords
    obj.partyName = document.getElementById('selected_save2').value
    obj.uid = this.state.user
    
    var accountTitle = document.getElementById('selected_save2').value
    var reqObj = this.state.partyObjects.find(  (ob)=>{return ob.partyName === accountTitle}  )
    reqObj.keyWords = this.state.keyWords
    // if('ledger' in reqObj){
    // obj.ledger = reqObj.ledger
    // obj.sum = reqObj.sum
    // }else{
    //   obj.sum = reqObj.sum
    // }
    var key = firebase.database().ref('customerAccess').push().key
    obj.key = key
    obj.realObjectKey = reqObj.key
    firebase.database().ref('customerAccess').child(key).set(obj)
    firebase.database().ref('partyList').child(reqObj.key).set(reqObj)
    // this.state.customerAccessList.push(obj)
    alert('Customer Access successfully Granted')
    // this.setState({keyWords:''}) 
    
    
      }
    
    }
    }
    
    
    
    
    
    getList=()=>{
    this.setState({listStatus:true})
    }
    
    
     editAccess=(i)=>{
    
    var editPromise = new Promise((res,rej)=>{
    
      var reqObj = this.state.customerAccessList[i]
      var key = this.state.customerAccessList[i].key
      
      var editPassword = prompt('Please edit Passwordetc',reqObj.keyWords)
      if(editPassword === null){
        editPassword = reqObj.keyWords
      }
      
      reqObj.keyWords = editPassword.replace(/  +/g, ' ').trim()
      
      firebase.database().ref('customerAccess').child(reqObj.key).set(reqObj)
      
      this.state.customerAccessList.splice(i,1,reqObj)
    
      res('edited successfully')
    
    })
    
    editPromise.then((msg)=>{
    
      var reqObj = this.state.customerAccessList[i]
      // var key = this.state.customerAccessList[i].key
      // var editPassword = prompt('Please Re-enter Passwordetc',reqObj.keyWords)
      // if(editPassword === null){
      //   editPassword = reqObj.keyWords
      // }
      // reqObj.keyWords = editPassword.replace(/  +/g, ' ').trim()
    
      var ourObject = this.state.partyObjects.find((obj)=>{return obj.partyName === reqObj.partyName})
      ourObject.keyWords= reqObj.keyWords
      
      firebase.database().ref('partyList').child(ourObject.key).set(ourObject)
    alert(msg)
    
    })
    
    
    }
    
    
    
    deleteCustomerAccess=()=>{
      var accountDelet = prompt("write password for which you want to delete the access")
      
      var reqCustomerToBeDel = this.state.customerAccessList.find(  (o)=>{return o.keyWords === accountDelet}  )
    
      if(reqCustomerToBeDel){
      var key = reqCustomerToBeDel.key
      firebase.database().ref('customerAccess').child(key).remove()
    
    
      var DelFromArray = this.state.customerAccessList.filter(  (oo)=>{return oo.key !== reqCustomerToBeDel.key}  )
    
        this.setState({customerAccessList:DelFromArray})
    
    
        alert('Deleted Successfully')
      }else{
        alert('Your Entered password is incorrect')
      }
    
    
    }
    



    access=()=>{
      this.setState({showAccessDiv:true})
    }







    render(){
        return(
          <div>
         <br/>
         <div className='container' style={{textAlign:'right'}}> <button className="waves-effect waves-dark btn red" onClick={this.Logout}>Logout</button> </div> 
         
         
            <div className="center">
              <br/>


              <div className='container'>
 


                
               <span style={{color:'blue', fontSize:'20px'}}><b>Welcome... </b> <span><b style={{color:'blue',marginLeft:'30px'}}>{this.state.userEmail}</b></span></span>
              </div>






  {/* card code from materialize css */}
  
   {/* <div className="row container" style={{margin:'auto'}}>
    
      <div className="card pink lighten-4">
        <div className="card-content">
          <span className="card-title"> <b>Introduction</b></span>
          <p style={{textAlign:'left', color:'blue'}}>This online web based saftware is Prepared for small businesses. This mini software is best to maintain Account Statements/Ledgers of your customers. You can recored your business transactions relating to vendors and sellers and can get their account statements at any time, any where in all over the world.
             <br/>
             You will also get a one page summary having closing balances of you vendors/sellers and all the accounts you have. 
             </p>
        </div>
      </div>
    
  </div> */}
  </div>

<br/>


{/* <div className='container center'>
<button onClick={this.access} style={{padding:'10px', borderRadius:'8px'}}> Allow Access to customer </button>
</div> */}
<div className={this.state.showAccessDiv===false ? 'display' : 'container'}>
  <br/><br/><br/>
  <span style={{fontSize:'16px', color:'blue'}}> Please Select the Account and create password to allow access </span>
  <div  style={{textAlign:'center', marginBottom:'0px'}}><button className="waves-effect waves-dark btn" onClick={this.getData} style={{width:'80%'}}>Select Account</button> <br/>
  <div style={{width:'80%', margin:'auto'}}> <select className='browser-default' id='selected_save2'>  {this.state.partyObjects.map(  (item,i)=>{ return <option key={i} className='browser-default'>{item.partyName}</option>}  )       }   </select> </div> <br/></div>
  
  <br/>
  <div>
  <span style={{fontSize:'17px', color:'blue'}}> Create Password to allow access to the selected Account </span>
  <input type='text' onChange={this.changeHandler} name='keyWords' value={this.state.keyWords} placeholder='Create Password' />   
  <button className="waves-effect waves-dark btn" onClick={this.allowAccess} >Allow Access</button>
  
<br/><br/><br/><br/><br/>
<span style={{fontSize:'17px', color:'blue'}}> Get List of all customers to whome you have Granted Access </span> <br/>
  <button className="waves-effect waves-dark btn" onClick={this.getList} >Get List</button>
  
  

  <div className={this.state.listStatus === false ? 'display' : ''}>
  <table><thead><tr><th>Account Title</th><th>Password</th><th>Edit</th></tr></thead><tbody>{this.state.customerAccessList.map(  (item,index)=>{return <tr key={index}><td>{(index+1) + '- ' + item.partyName}</td><td>{item.keyWords}</td><td><a href='#' className="material-icons" style={{color:'green',fontSize:'15px'}} onClick={()=> this.editAccess(index)}>edit</a></td></tr>})    }</tbody></table> 
  <br/>
  <button className="waves-effect waves-dark btn" onClick={this.deleteCustomerAccess} >Delete Customer Access</button>

</div>
  </div>   
</div>















{/* <div className='container'>
  <h2 style={{textAlign:'left'}} className='headings'>Guidance to Run this Application</h2>
  <h2 style={{textAlign:'left'}} className='headings'>Accounts-Record</h2>
  <p style={{textAlign:'justify'}}>Go to the top of the screen and click on <b>Accounts-Record</b> you will see further menue of five features of accounts;
  <br/> 1-Create Account
  <br/> 2-Data entry
  <br/> 3-Vouchers
  <br/> 4-Account statement
  <br/> 5-Summary
  <br/> Let discuss and understand all of above features one by one.
  <br/> <b>1-Create Account</b>
  <br/> In this section, you will create/open the account of the person to whom you want to record your business transaction. There will be three input fields, on first field you will write the name of the person/Account title, on second field you will pass any remarks relating to your account, and in third input field you will select the category of the account (e.g either it is relating to debtors/creditors or expense or assets etc.). On last, Press the button <b>Save</b> Now your account has been opened successfully. You can get the List of all opened Accounts by pressing the button of <b>Get List</b>
  <br/><b>2-Data Entry</b>
  <br/>Go to the section of Data Entry. you will have a list of all opened Accounts. First of all select the account to whom you want to record the transaction. There are three input fields, First is for date. Type here date in you own formate. Secord input field is for Remarks/Narration relating to the nature of entry. Third input field is for amount of the transaction.
  <br/><b style={{color:'red'}}>Guidance about 'Amount' input field</b>
  <br/><span style={{color:'red'}}>If you are given any thing (either it is cash or material) to your client/debtor/creditor, you have to write the amount in positive.</span>
  <br/><span style={{color:'red'}}> But If you are receiving any thing (either it is cash or material) from your client/debtor/creditor, you have to write the amount in negative.</span>
  <br/><b>3-Vouchers</b>
  <br/> Each and every entry will generate the voucher, go to the voucher section, you will see the generated voucher, get print out, sign it for record purpose. 
  <br/><b>4-Account Statement</b>
  <br/> Go to the section of <b>Account Statement</b>, Select the Account and get the Ledger/Statement having all history of transactions.
  <br/> <b>5-Summary</b>
  <br/> It is the one page summary of All opened Accounts (if they have balances). You can get Quick last 50-Transaction detail by clicking on the relevant account. 
  </p> */}



  {/* <h2 style={{textAlign:'left'}} className='headings'>My Documents</h2>
  <p style={{textAlign:'justify'}}> The next feature of this software is <b>My documents</b>.Go to the top of the screen and click on <b>My Documents</b> you will see further menue of two features;
  <br/> 1-Up-Load Document
  <br/> 2-Get Document
  <br/><b>1-Up-Load Document</b>
  <br/>Here you can up load document. First of all select the image/file from your device and write the description of the document in input field here.
<br/><b>2-Get Document</b>
<br/> Go to get Document, select your description and click on <b>Get File </b> button. you will get URL of the image/file and view of the file. 
  </p> */}


{/* </div> */}


            
            </div>
        )
    }


  }

export default Logout;






























// import react, {Component} from 'react'
// import '../App.css';
// import firebase from './Fire'
// // import {Link} from 'react-router-dom'


//   class Logout extends Component{
//     constructor(){
//       super();
//       this.state ={
//               user:null,
//               userEmail:null
//       }

//   }



//   componentDidMount(){
//     var userId = firebase.auth().currentUser.uid;
//     var userEmail = firebase.auth().currentUser.email
    
//     this.setState({user:userId,userEmail:userEmail})
//   }




//     Logout= ()=>{
//         firebase.auth().signOut();
//     }

//     render(){
//         return(
//           <div>
//          <br/>
//          <div className='container' style={{textAlign:'right'}}> <button className="waves-effect waves-dark btn red" onClick={this.Logout}>Logout</button> </div> 
         
         
//             <div className="center">
//               <br/>


//               <div className='container'>
 


                
//                <span style={{color:'blue', fontSize:'20px'}}><b>Welcome... </b> <span><b style={{color:'blue',marginLeft:'30px'}}>{this.state.userEmail}</b></span></span>
//               </div>






//   {/* card code from materialize css */}
  
//    <div className="row container" style={{margin:'auto'}}>
//     {/* <div className="col s12 m6"> */}
//       <div className="card pink lighten-4">
//         <div className="card-content">
//           <span className="card-title"> <b>Introduction</b></span>
//           <p style={{textAlign:'left', color:'blue'}}>This online web based saftware is Prepared for small businesses. This mini software is best to maintain Account Statements/Ledgers of your customers. You can recored your business transactions relating to vendors and sellers and can get their account statements at any time, any where in all over the world.
//              <br/>
//              You will also get a one page summary having closing balances of you vendors/sellers and all the accounts you have. 
//              </p>
//         </div>
//       </div>
//     {/* </div> */}
//   </div>
  


// {/* <div className='container'>
//   <h2 style={{textAlign:'left'}} className='headings'>Guidance to Run this Application</h2>
//   <h2 style={{textAlign:'left'}} className='headings'>Accounts-Record</h2>
//   <p style={{textAlign:'justify'}}>Go to the top of the screen and click on <b>Accounts-Record</b> you will see further menue of five features of accounts;
//   <br/> 1-Create Account
//   <br/> 2-Data entry
//   <br/> 3-Vouchers
//   <br/> 4-Account statement
//   <br/> 5-Summary
//   <br/> Let discuss and understand all of above features one by one.
//   <br/> <b>1-Create Account</b>
//   <br/> In this section, you will create/open the account of the person to whom you want to record your business transaction. There will be three input fields, on first field you will write the name of the person/Account title, on second field you will pass any remarks relating to your account, and in third input field you will select the category of the account (e.g either it is relating to debtors/creditors or expense or assets etc.). On last, Press the button <b>Save</b> Now your account has been opened successfully. You can get the List of all opened Accounts by pressing the button of <b>Get List</b>
//   <br/><b>2-Data Entry</b>
//   <br/>Go to the section of Data Entry. you will have a list of all opened Accounts. First of all select the account to whom you want to record the transaction. There are three input fields, First is for date. Type here date in you own formate. Secord input field is for Remarks/Narration relating to the nature of entry. Third input field is for amount of the transaction.
//   <br/><b style={{color:'red'}}>Guidance about 'Amount' input field</b>
//   <br/><span style={{color:'red'}}>If you are given any thing (either it is cash or material) to your client/debtor/creditor, you have to write the amount in positive.</span>
//   <br/><span style={{color:'red'}}> But If you are receiving any thing (either it is cash or material) from your client/debtor/creditor, you have to write the amount in negative.</span>
//   <br/><b>3-Vouchers</b>
//   <br/> Each and every entry will generate the voucher, go to the voucher section, you will see the generated voucher, get print out, sign it for record purpose. 
//   <br/><b>4-Account Statement</b>
//   <br/> Go to the section of <b>Account Statement</b>, Select the Account and get the Ledger/Statement having all history of transactions.
//   <br/> <b>5-Summary</b>
//   <br/> It is the one page summary of All opened Accounts (if they have balances). You can get Quick last 50-Transaction detail by clicking on the relevant account. 
//   </p>

// </div> */}


//             </div>
//             </div>
//         )
//     }


//   }

// export default Logout;
