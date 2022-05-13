import react, {Component} from 'react'
import '../App.css';
import firebase from './Fire'
import {Link, Route, BrowserRouter} from 'react-router-dom'




  class AccountsRecord extends Component{
    constructor(){
      super();
      this.state ={
              user:null,
              userEmail:null,
      }

  }


 async componentDidMount(){
    var userId = firebase.auth().currentUser.uid;
    var userEmail = firebase.auth().currentUser.email
    
    this.setState({user:userId,userEmail:userEmail})
  }



  

    render(){
        return(
          <div>
        <span style={{fontSize:'12px'}}><b style={{color:'green',marginLeft:'30px'}}>{this.state.userEmail}</b> / {navigator.onLine===true ? <span style={{color:'green'}}>You are online</span> : <span style={{color:'red'}}>You are OffLine</span>}</span>
<br/> <br/>
          <div>
           <MainBar />
          <Route exact path='/AccountsRecord' component={DataEntry} />
          <Route path='/AccountsRecord/Content' component={Content}/>
          <Route path='/AccountsRecord/Ledger' component={Ledger}/>
          <Route path='/AccountsRecord/Trial' component={Trial}/>
          <Route path='/AccountsRecord/DailySales' component={DailySales}/>
          </div>

          </div>
        )
    }


  }

export default AccountsRecord;



//Links Component
class MainBar extends Component{
    constructor(){
      super();
      this.state = {
       
      }
    }
  
  
  
  
      render(){
        return(
          <div className='container' style={{border:'1px solid lemonchiffon', textAlign:'center', backgroundColor:'lemonchiffon'}}>
    
          <Link to='/AccountsRecord/Content' style={{textDecoration:'none', marginRight:'8px', color:'red', fontSize:'12px'}}>Add New </Link>
          <Link to='/AccountsRecord' style={{textDecoration:'none', marginRight:'8px', color:'green', fontSize:'12px'}}> Data Entry </Link>
          <Link to='/AccountsRecord/Ledger' style={{textDecoration:'none', marginRight:'8px', color:'red', fontSize:'12px'}} > Statement </Link>
          <Link to='/AccountsRecord/Trial' style={{textDecoration:'none', marginRight:'8px', color:'green', fontSize:'12px'}} > Summary </Link>
          <Link to='/AccountsRecord/DailySales' style={{textDecoration:'none', marginRight:'8px', color:'red', fontSize:'12px'}} > Daily-Sale </Link>
          </div>
  
        );
      }
    
  }





  //Content Component - to create new account
  class Content extends Component{
    constructor(){
        super();
        this.state = {
          address:'',
          partyName:'',
          chartOfAccount:'',
          partyObjects:[],
          chartOfAccountObject:[],
          getListStatus:false,
          changeInState:false,
          // togleList:false,
          user:null,
          userEmail:null
        }
        
    }


    async componentDidMount(){
      var dataPushPromise = new Promise( (res,rej)=>{
      var userId = firebase.auth().currentUser.uid;
      var userEmail = firebase.auth().currentUser.email

      this.setState({user:userId,userEmail:userEmail})
      
      res()
      rej('Operation Failed: Data From Firebase does not push in the state successfully')
    } )
    dataPushPromise.then(()=>{

      var pushPromise = new Promise((res,rej)=>{

        firebase.database().ref('chartOfAccount').on('child_added' , (data)=> { 
          this.state.chartOfAccountObject.push(data.val())
        }  )


        var obj = [];
        firebase.database().ref('partyList').on('child_added' , (data)=> { 
          obj.push(data.val())
        }  )
        res(obj);
        rej('Operation Failed');
      })
      pushPromise.then((ob)=>{
        this.setState({partyObjects:ob})





      },(er)=>{
        alert(er)
      })



    },(err)=>{
      alert(err)
    })

  }







changeHandler = (e) => {
this.setState({ 
[e.target.name]: e.target.value
})

}



saveParty = ()=> {
  var alreadyAccountExist = this.state.partyObjects.find(  (obj)=>{return obj.partyName === this.state.partyName}  )
if(alreadyAccountExist){
alert('This Account is Already opened')
}else{




if(this.state.partyName === '' || this.state.address === ''){alert('you must fill all the fields')}else{


if(document.getElementById('accountCategory').value === ''){alert('You Must Select the Account Category')}else{

let partyObj = {};
partyObj.partyName = this.state.partyName.replace(/  +/g, ' ').trim();    // replace() method is used to remove more than onve space in string & trim() method is used to remove space between first and last.
partyObj.address = this.state.address;
var accountCategory = document.getElementById('accountCategory').value;
partyObj.accountCategory = accountCategory
partyObj.sum = [0]


var key = firebase.database().ref('partyList').push().key
partyObj.key = key
firebase.database().ref('partyList').child(key).set(partyObj)
alert('Account Opened successfully')
this.setState({partyName:'', address:''}) 


}
}
}



}



getList = () =>{
this.setState({getListStatus:true})
}



editAccount =(i)=>{
var reqObj = this.state.partyObjects[i]
var key = this.state.partyObjects[i].key

var editAccount = prompt('Please edit Account Title',reqObj.partyName)
if(editAccount === null){
  editAccount = reqObj.partyName
}

var editAddress = prompt('Please edit Address/Contact..etc',reqObj.address)
if(editAddress === null){
  editAddress = reqObj.address
}


var editCategory = prompt('Please edit Category of Account',reqObj.accountCategory)
if(editCategory === null){
  editCategory = reqObj.accountCategory
}


reqObj.partyName = editAccount.replace(/  +/g, ' ').trim();
reqObj.address = editAddress.replace(/  +/g, ' ').trim()
reqObj.accountCategory = editCategory.replace(/  +/g, ' ').trim()


firebase.database().ref('partyList').child(reqObj.key).set(reqObj)


this.state.partyObjects.splice(i,1,reqObj)


}



saveChartOfAccount = () =>{
  var nameChartOfAccount = this.state.chartOfAccount;

  var key = firebase.database().ref('chartOfAccount').push().key

firebase.database().ref('chartOfAccount').child(key).set({nameChart: nameChartOfAccount, key: key})


// this.state.chartOfAccountObject.push({key:'', nameChart:nameChartOfAccount})

alert('Added Successfully')

this.setState({chartOfAccount:''})
}



changeInState = ()=>{
  this.setState({changeInState: ! this.state.changeInState})
}


render(){

  return (
  <div>
  
  <div className='container'>
  
    <br/>
 
  <br/><br/><br/>
 
{/* Create Account */}
  <h2 className='headings'>Create Account</h2>
  <input type='text'  value={this.state.partyName} name='partyName' onChange={this.changeHandler} placeholder='Account Title' />  <br/>
  <input type='text' value={this.state.address} name='address' onChange={this.changeHandler} placeholder='Address, Contact, ..etc' /> <br/>
  <span style={{color:'red', fontSize:'10px'}} onClick={this.changeInState}>Select Account Category</span>
  <div style={{width:'100%', margin:'auto'}}> <select className='browser-default' id='accountCategory'>  {this.state.chartOfAccountObject.sort((a, b) => (a.nameChart > b.nameChart) ? 1 : -1).map(  (item,i)=>{ return <option key={i} className='browser-default'>{item.nameChart}</option>}  )       }   </select> </div> <br/>
  {/* <select className='browser-default' id='accountCategory'><option>Select Account Category</option><option>A. Debtors</option> <option>B. Creditors</option> <option>C. Staff</option>  <option>D. Taxation</option> <option>E. Expenses</option> <option>F. Revenues</option><option>G. Liabilities</option><option>H. Assets</option><option>I. Capital</option><option>J. Personal</option><option>K. Others</option></select> */}
  <button className="waves-effect waves-dark btn" onClick={this.saveParty}>Save</button>
  <br/><br/><br/><br/>



  <h2 className='headings'>Create Charte of Accounts</h2>
  <input type='text'  value={this.state.chartOfAccount} name='chartOfAccount' onChange={this.changeHandler} placeholder='Levels of Account' />  <br/>
  <button className="waves-effect waves-dark btn" onClick={this.saveChartOfAccount}>Save</button>



  <br/><br/><br/><br/>
  <h2 className='headings'>List of Accounts Opened</h2>
  <button className="waves-effect waves-dark btn" onClick={this.getList}>Get List</button>

<div className={this.state.getListStatus === false ? 'display' : ''}>
  <table><thead><tr><th>Account Title</th><th>Address/Contact..etc</th><th>Category</th></tr></thead><tbody>{this.state.partyObjects.map(  (item,index)=>{return <tr key={index}><td>{(index+1) + '- ' + item.partyName}</td><td>{item.address}</td><td>{item.accountCategory}</td><td><a href='#' className="material-icons" style={{color:'green',fontSize:'15px'}} onClick={()=> this.editAccount(index)}>edit</a></td></tr>})    }</tbody></table> 
{/* </div> */}
</div>


  </div>
  </div>
);
}
}




//Data Entry Component start
class DataEntry extends Component{
    constructor(){
        super();
        this.state = {
          debit:'',
          date:'',
          narration:'',
          cgs:'',
          date_dailyProfit:'',
          salesPrice:'',
          // objects:[],
          partyObjects:[],
          status:false,         //this only for some changes in state, so that render function can run again
          renderMstStatus:false,
          noData:null,
          user:null,
          voucherNumber:null,
          entrySaved:'',
          color:'',
          entrySaved_dailySales:'',
          color_dailySales:'',
          pageRefresh:0
          // viewVoucher:{voucherNumber:0, partyName:null, narration:null,debit:null,date:null}
          
        }
    }




    componentDidMount(){
      var dataPushPromise = new Promise( (res,rej)=>{
      var userId = firebase.auth().currentUser.uid;
      var userEmail = firebase.auth().currentUser.email

      this.setState({user:userId,userEmail:userEmail})
      
      res()
      rej('Operation Failed: Data From Firebase does not push in state successfully')
    } )
    dataPushPromise.then(()=>{
      var pushPromise = new Promise((res,rej)=>{
        var obj = [];
        firebase.database().ref('partyList').on('child_added' , (data)=> { 
          obj.push(data.val())
        }  )
  
        firebase.database().ref('VoucherNumber').on('child_added' , (data)=> {
          this.setState({voucherNumber:data.val()})
        }  )
        res(obj);
        rej('Operation Failed');
      })
      pushPromise.then((ob)=>{
        this.setState({partyObjects:ob})
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






changeHandler = (e) => {

this.setState({ 
[e.target.name]: e.target.value
})

}



getData = ()=>{
this.setState({status:true})        //As status true, the render function will run again
}



saveValue = ()=>{
  
  
//  if(navigator.onLine){    //it is only to check either your connected to the internet or not 

if(this.state.date === '' || this.state.narration === '' || this.state.debit === ''){alert('you must fill all the fields')}else{

if(document.getElementById('selected_save2').value){


  var accountTitle = document.getElementById('selected_save2').value
  var reqPartyObj = this.state.partyObjects.find(  (obj)=>{return obj.partyName === accountTitle}  )

  // the below two lines code was used before above two lines
// var partyObjIndex = document.getElementById('selected_save2').selectedIndex
// var reqPartyObj = this.state.partyObjects[partyObjIndex]


var partyLedgerObj = {}
partyLedgerObj.debit = Number(this.state.debit);
partyLedgerObj.date = this.state.date;
// partyLedgerObj.voucherNum = vouchNum;  //for voucher Test

var nrr = this.state.narration
partyLedgerObj.narration = nrr
var vouNum = this.state.voucherNumber+1;
partyLedgerObj.voucherNumber = vouNum;
partyLedgerObj.partyName = document.getElementById('selected_save2').value

//This code is for creation of Party Ledger in partyList
if('ledger' in reqPartyObj){
reqPartyObj.ledger.push(partyLedgerObj)
firebase.database().ref('partyList').child(reqPartyObj.key).set(reqPartyObj)

}else{
reqPartyObj.ledger = []
reqPartyObj.ledger.push(partyLedgerObj)
firebase.database().ref('partyList').child(reqPartyObj.key).set(reqPartyObj)
}


// For searching of array of sum in party object
if('sum' in reqPartyObj){
reqPartyObj.sum.push(Number(this.state.debit))

firebase.database().ref('partyList').child(reqPartyObj.key).set(reqPartyObj)

}else{
reqPartyObj.sum = []
reqPartyObj.sum.push(Number(this.state.debit))
firebase.database().ref('partyList').child(reqPartyObj.key).set(reqPartyObj)
}



// alert('Entry successfully saved..!')
this.setState({debit:'',date:'',narration:'',voucherNumber:vouNum})
firebase.database().ref('VoucherNumber').child('VoucherNumber').set(vouNum)
}else{alert('Please select the Account First')}

}

//  }else{this.setState({netDisconnect:false})}
this.setState({viewVoucher:partyLedgerObj})



this.setState({entrySaved: 'Entry Saved'})

setTimeout(() => {
  this.setState({color:'gray'})



setTimeout(()=>{
  this.setState({color:'lightgray'})

setTimeout(()=>{
  this.setState({entrySaved:'',color:''})
},1000)

},1000)


}, 1000);






}




save_dailyProfit=()=>{

var month = document.getElementById('month_select').value
var year = document.getElementById('year_select').value
var month_and_year = month+'-'+year

var dailyProfitObject = {};
dailyProfitObject.date = this.state.date_dailyProfit;
dailyProfitObject.costOfGoods = this.state.cgs;
dailyProfitObject.salesPrice = this.state.salesPrice;
dailyProfitObject.month = month;
dailyProfitObject.year = year;
dailyProfitObject.month_and_year = month_and_year;

var key = firebase.database().ref('dailySales').push().key
dailyProfitObject.key = key
firebase.database().ref('dailySales').child(key).set(dailyProfitObject)








this.setState({date_dailyProfit:'',cgs:'',salesPrice:''})




this.setState({entrySaved_dailySales: 'Entry Saved'})

setTimeout(() => {
  this.setState({color_dailySales:'gray'})



setTimeout(()=>{
  this.setState({color_dailySales:'lightgray'})

setTimeout(()=>{
  this.setState({entrySaved_dailySales:'',color_dailySales:''})
},1000)

},1000)


}, 1000);

// console.log(dailyProfitObject)
}







render(){

  return (
    <div>

    {/* {this.state.pageRefresh}  */}
  




  {/* Below div is for Data Entry of Accounts Record */}
  <div className='container'>
  <br/>

  <h2 style={{textAlign:'center'}} className='headings'>Data Entry</h2>
  <div  style={{textAlign:'center', marginBottom:'0px'}}><button className="waves-effect waves-dark btn" onClick={this.getData} style={{width:'80%'}}>Select Account</button> <br/>
  <div style={{width:'80%', margin:'auto'}}> <select className='browser-default' id='selected_save2'>  {this.state.partyObjects.map(  (item,i)=>{ return <option key={i} className='browser-default'>{item.partyName}</option>}  )       }   </select> </div> <br/>
  </div>
  <input type='text' value={this.state.date} onChange={this.changeHandler} name='date'  maxLength='8' placeholder='Date Formate (dd.mm.yy)' /> <br/>
  <input type='text' value={this.state.narration} name='narration' onChange={this.changeHandler} placeholder='Remarks/Narration' /> <br/>
  <input type='number' value={this.state.debit} name='debit' onChange={this.changeHandler} placeholder='Amount +Debit / -Credit' /> <br/>
  <button className="waves-effect waves-dark btn" onClick={this.saveValue}>Save</button><br/>
  <span style={{fontSize:'20px', color:this.state.color}}><b>{this.state.entrySaved}</b></span>
</div>




<br/><br/><br/>



{/* Below div is for Data Entry of Daily Profit Calculation */}
<div className='container'>
<h2 style={{textAlign:'center', color:'red'}} className='headings'><b>Daily Profit</b></h2>
<input type='text' value={this.state.date_dailyProfit} onChange={this.changeHandler} name='date_dailyProfit'  maxLength='8' placeholder='Date Formate (dd.mm.yy)' /> <br/>
<input type='number' value={this.state.cgs} name='cgs' onChange={this.changeHandler} placeholder='Cost of Goods Sold' /> <br/>
<input type='number' value={this.state.salesPrice} name='salesPrice' onChange={this.changeHandler} placeholder='Sales Price of the Goods Sold' /> <br/>
<div style={{width:'35%'}}> <select className='browser-default' id='month_select'><option>Jan</option><option>Feb</option><option>Mar</option><option>Apr</option><option>May</option><option>June</option><option>July</option><option>Aug</option><option>Sep</option><option>Oct</option><option>Nov</option><option>Dec</option></select><select className='browser-default' id='year_select'><option>2022</option><option>2023</option><option>2024</option><option>2025</option><option>2026</option><option>2027</option><option>2028</option></select></div>
<button className="waves-effect waves-dark btn" onClick={this.save_dailyProfit}>Save</button><br/>
<span style={{fontSize:'20px', color:this.state.color_dailySales}}><b>{this.state.entrySaved_dailySales}</b></span>
</div>







</div>
);
}
}




//start of Ledger Component
class Ledger extends Component{
    constructor(){
        super();
        this.state = {
          
          partyObjects:[],
          sum:[],
          ledger:[],
          renderLedgerData:false,
          status:false,
          ledgerDeleteUpdate:false,
          deleteRefresh: false,
          editRefresh:false,
          noData:null,
          accountDeleteRefresh:false,
          cancelDelete:false,
          ledgerFor30Days:0,
          ledgerBalance:[],
          debitTotal:0,
          creditTotal:0,
          user:null,
          test:[],
          accountTitle:'',
          pageRefresh:0
          
          
        }
    }
  

      componentDidMount(){
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
  
      

    setTimeout(() => {

      const inteId =setInterval(()=>{
        this.setState({pageRefresh: this.state.pageRefresh+1})
      },1000)

      setTimeout(() => {
        clearInterval(inteId);
      }, 30000);
    
    
    
    }, 1000);




  }



    
  
  
  getData = ()=>{
      this.setState({status:true})        //As status true, the render function will run again - because of change in state
      this.setState({sum:[]})  //As the render method will run again, so the array of sum and sumQty in state should be zero
    }
  
  

  // This function will run to get all transactions in the ledger
      partyLedger = ()=> {
        this.setState({ledgerFor30Days:0}) // because we want to see all transaction in the ledger
  
  if(document.getElementById('selected_save4').value){
  
  this.setState({accountTitle:document.getElementById('selected_save4').value})
  
  
  
  var accountTitle = document.getElementById('selected_save4').value
  var reqObj = this.state.partyObjects.find(  (obj)=>{return obj.partyName === accountTitle}  )




  // var objIndex = document.getElementById('selected_save4').selectedIndex
  // var reqObj = this.state.partyObjects[objIndex]
  


  
  //to get total sum of debit side and credit side
  this.setState({debitTotal:reqObj.sum.filter((nm,indx)=>{return nm>0}).reduce( (total,num)=>{return total+num},0)}) // for test base only
  this.setState({creditTotal:reqObj.sum.filter((nm,indx)=>{return nm<0}).reduce( (total,num)=>{return total+num},0)}) // for test base only
  //sum of debit and credit side is ended
  
  
  
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
      
  }else{alert('Please select the Account First')}
  
  }
  
  
  
  // This function will run to get last 30 transactions only
  partyLedgerTwo = ()=> {
  
  this.setState({ledgerFor30Days:-30})  // because we want to see only last 30-transaction in the ledger
    if(document.getElementById('selected_save4').value){
    

      this.setState({accountTitle:document.getElementById('selected_save4').value})


      var accountTitle = document.getElementById('selected_save4').value
      var reqObj = this.state.partyObjects.find(  (obj)=>{return obj.partyName === accountTitle}  )




    // var objIndex = document.getElementById('selected_save4').selectedIndex
    // var reqObj = this.state.partyObjects[objIndex]
    
  
    //to get total sum of debit side and credit side
    this.setState({debitTotal:reqObj.sum.filter((nm,indx)=>{return nm>0}).reduce( (total,num)=>{return total+num},0)})   //for test base only
    this.setState({creditTotal:reqObj.sum.filter((nm,indx)=>{return nm<0}).reduce( (total,num)=>{return total+num},0)}) // for test base only
  //sum of debit and credit side is ended
  
    if('ledger' in reqObj){
      var ledgerData = reqObj.ledger;
      var ledgerBalance = reqObj.sum 
      this.setState({ledger: ledgerData, renderLedgerData:true, noData:null, ledgerBalance:ledgerBalance})
     
     }
     else{
       
       var noDataFound = 'No data found'
       this.setState({noData: noDataFound, renderLedgerData:false})
      //  console.log(noDataFound)
       
     }
    
    this.setState({sum:[]}) //As the render method will run again, so the array of sum in state should be zero
        
    }else{alert('Please select the Account First')}
    
    }
  
  



    partyLedgerThree = ()=> {
  
      this.setState({ledgerFor30Days:-100})  // because we want to see only last 30-transaction in the ledger
        if(document.getElementById('selected_save4').value){
        
    
          this.setState({accountTitle:document.getElementById('selected_save4').value})
    
    
          var accountTitle = document.getElementById('selected_save4').value
          var reqObj = this.state.partyObjects.find(  (obj)=>{return obj.partyName === accountTitle}  )
    
    
    
    
        // var objIndex = document.getElementById('selected_save4').selectedIndex
        // var reqObj = this.state.partyObjects[objIndex]
        
      
        //to get total sum of debit side and credit side
        this.setState({debitTotal:reqObj.sum.filter((nm,indx)=>{return nm>0}).reduce( (total,num)=>{return total+num},0)})   //for test base only
        this.setState({creditTotal:reqObj.sum.filter((nm,indx)=>{return nm<0}).reduce( (total,num)=>{return total+num},0)}) // for test base only
      //sum of debit and credit side is ended
      
        if('ledger' in reqObj){
          var ledgerData = reqObj.ledger;
          var ledgerBalance = reqObj.sum 
          this.setState({ledger: ledgerData, renderLedgerData:true, noData:null, ledgerBalance:ledgerBalance})
         
         }
         else{
           
           var noDataFound = 'No data found'
           this.setState({noData: noDataFound, renderLedgerData:false})
          //  console.log(noDataFound)
           
         }
        
        this.setState({sum:[]}) //As the render method will run again, so the array of sum in state should be zero
            
        }else{alert('Please select the Account First')}
        
        }  









  //The Process of Delete functionality is starting from here...
  deleteLedgerEntry = (i)=>{
  
    var delKey = prompt("write 'Y' and Press OK")
  
    if(delKey === 'Y'){
    var reqObjIndex = document.getElementById('selected_save4').selectedIndex // for test delete
    var accountTitleName = document.getElementById('selected_save4').value
    var reqObj = this.state.partyObjects.find(  (obj)=>{return obj.partyName === accountTitleName}  )
    reqObj.ledger.splice(i,1)
    reqObj.sum.splice(i+1,1)
  
  



    //for delete in firebase
    firebase.database().ref('partyList').child(reqObj.key).set(reqObj)
    //code ended
  
  
    //for delete updation in state
    this.state.partyObjects.splice(reqObjIndex,1,reqObj) //for test delete
    //Code ended
  
  
    // this.setState({ledgerDeleteUpdate:true, sum:[], deleteRefresh:true})
      alert('Entry Deleted successfully')
    }else{this.setState({cancelDelete:true})
        alert('You have entered Wrong key') 
      }
  
  
  }
  
  

  
  editEntry = (i)=>{
    var accountTitle = document.getElementById('selected_save4').value
    var reqObj = this.state.partyObjects.find(  (obj)=>{return obj.partyName === accountTitle}  )
    var objIndx = document.getElementById('selected_save4').selectedIndex
    var key = this.state.partyObjects[objIndx].key
    var ledger = this.state.partyObjects[objIndx].ledger

    var editDate = prompt('Please edit Entry Date',ledger[i].date)
    if(editDate===null){
      editDate = ledger[i].date
    }

    var editNarration = prompt('Please edit Narration',ledger[i].narration)
    if(editNarration===null){
      editNarration = ledger[i].narration
    }

    var editAmount = prompt('Please edit Amount',ledger[i].debit)
    if(editAmount===null){
      editAmount = ledger[i].debit
    }

    var editedObj = {date:editDate,narration:editNarration,debit:Number(editAmount),voucherNumber:ledger[i].voucherNumber,partyName:ledger[i].partyName} 
    reqObj.ledger.splice(i,1,editedObj)
    reqObj.sum.splice(i+1,1,Number(editAmount))
  
  
  //For edited in firebase database
    firebase.database().ref('partyList').child(reqObj.key).set(reqObj)
  //code ended
  
  
  //for edit updation in state
  this.state.partyObjects.splice(objIndx,1,reqObj) //for test delete
  //Code ended
  
  alert('Entry Edited Successfully')
    // this.setState({editRefresh:true,sum:[]})
  }
  
  
  

  accountDelete = ()=>{
    var delKey = prompt("write 'Y' and Press OK")
    if(delKey === 'Y'){
  
  
    var reqObjIndex = document.getElementById('selected_save4').selectedIndex
    var accountTitle = document.getElementById('selected_save4').value
    var reqObj = this.state.partyObjects.find(  (obj)=>{return obj.partyName === accountTitle}  )
    var key = reqObj.key
  
    //for delete in Firebase database
    firebase.database().ref('partyList').child(key).remove()
    //code ended
  
  //for delete updation in state
  this.state.partyObjects.splice(reqObjIndex,1) //for test delete
  //Code ended
    this.setState({accountDeleteRefresh:true, partyObjects:[]})
  alert('Account deleted successfully, now plz refresh the page')
  
  }else{alert('you have entered wrong key')}
  
  }
  
  
  
  
  accountDelRfrsh = ()=>{
  this.setState({accountDeleteRefresh:false, sum:[]})
  }
  
  
  cancelDelRfrsh = ()=>{
    this.setState({cancelDelete:false, sum:[]})
  }
  
  
  

  // printStm = (stmDiv)=>{
  //   // //Method-1 to print the specific Div
  //   // var wholeBody = document.body.innerHTML;
  //   // var printContent = document.getElementById(stmDiv).innerHTML;
  //   // document.body.innerHTML = printContent;
  //   // window.print()
  //   // document.body.innerHTML = wholeBody
  
  
  //   // Method-2 to print the specific Div
  //   var content = document.getElementById(stmDiv);
  //   var pri = document.getElementById("ifmcontentstoprint").contentWindow;
  //   pri.document.open();
  //   pri.document.write(content.innerHTML);
  //   pri.document.close();
  //   pri.focus();
  //   pri.print();
  
  
  // }
  
  
  
  render(){
  
  return (
  
  
  <div id='up'>
  {/* {this.state.pageRefresh} */}
  <br/>
   
  <div className={this.state.accountDeleteRefresh === false ? '' : 'display'}>
  <div className={this.state.cancelDelete === false ? '' : 'display'}>
  
  <div style={{textAlign:'center'}} className='container'>
  <br/>
  <h5>Account Statement</h5>
  <button className="waves-effect waves-dark btn" onClick={this.getData} style={{width:'80%'}}>Select Account</button> <br/>
  <div style={{width:'80%',margin:'auto'}}> <select className='browser-default' id='selected_save4'>  {this.state.partyObjects.map(  (item,i)=>{ return <option key={i} className='browser-default'>{item.partyName}</option>}  )}   </select> </div> <br/>
  
  
  
  {/* this below button is for to get all transactions in the ledger */}
  <button className="browser-default btnControl" onClick={this.partyLedger} style={{width:'30%'}}>All</button> 
  {/* this below button is for to get last 30-transactions */}
  <button className="browser-default btnControl" onClick={this.partyLedgerTwo} style={{width:'30%'}}>Last-30</button>
  <button className="browser-default btnControl" onClick={this.partyLedgerThree} style={{width:'30%'}}>Last-100</button>
  
  {/* className="waves-effect waves-dark btn" */}
  </div>
  
  
  {/* in case of data found */}
  <div className={this.state.renderLedgerData === true ? '' : 'display'}>
    
    <div id='printldgr'>
  <div className='container'>Account Title: <b>{this.state.accountTitle} </b></div>
  <table style={{maxWidth:'950px',margin:'auto'}}><thead><tr><th style={{textAlign:'center'}}>V#</th><th>Date</th><th>Remarks</th><th>Debit</th><th>Credit</th><th>Balance</th><td><a href='#down' style={{color:'blue'}} className="tiny material-icons">arrow_downward</a></td></tr></thead><tbody>{this.state.ledger.map(  (item,index)=>{return <tr key={index}><td style={{color:'blue', textAlign:'center'}}>{item.voucherNumber}</td><td>{item.date}</td><td style={{minWidth:'150px',color:'blue'}}>{item.narration}</td><td>{item.debit >=0 ? item.debit : ''}</td><td style={{color:'blue'}}>{item.debit <0 ? item.debit : ''}</td><td className={this.state.ledgerBalance.slice(0,index+2).reduce( (total,num)=>{return total+num},0) >= 0 ? 'ldgrPostveAmt' : 'ldgrNegtveAmt'}><b>{this.state.ledgerBalance.slice(0,index+2).reduce( (total,num)=>{return total+num},0)}</b></td><td><a href='#' style={{fontSize:'16px', color:'red'}} className="material-icons" onClick={()=>this.deleteLedgerEntry(index)}>delete</a><a href='#' style={{fontSize:'16px', color:'green'}} className="small material-icons" onClick={()=> this.editEntry(index)}>edit</a></td></tr>}).slice(this.state.ledgerFor30Days)  }<tr><td></td><td></td><td><b>TOTAL</b></td><td><b>{this.state.debitTotal}</b></td><td><b>{this.state.creditTotal}</b></td><td style={{fontSize:'12px',color:'blue'}}><b>CL. BAL <i className="tiny material-icons">arrow_upward</i></b></td><td><a href='#up' style={{color:'blue'}} className="tiny material-icons">arrow_upward</a></td></tr></tbody></table>  {/*the Slice method is applied on map array to get only last 30 or 100 transactions as on your need*/ }
    </div>
  {/* <button className="waves-effect waves-dark btn blue" onClick={()=>{this.printStm('printldgr')}}>Print Statement</button> */}
  
  <br/><hr/><br/><br/><button className="waves-effect waves-dark btn red" onClick={this.accountDelete}>Delete Account Ledger</button>
    <p className="red-text">It will delete the whole Ledger as well as all its stored Entries</p>
  
  
  </div>
  
  {/* in case of no data found */}
  <div className={this.state.noData === null ? 'display' : ''}>
       <h4>
          {this.state.noData}
       </h4>
       
  <br/><hr/><br/><br/><button className="waves-effect waves-dark btn red" onClick={this.accountDelete}>Delete Account Ledger</button>
    <p className="red-text">It will delete the whole Ledger as well as all its stored Entries</p>
  
  </div>
  </div>
  </div>
  {/* </div> */}
   {/* </div> */}
  

  <div className={this.state.accountDeleteRefresh === false ? 'display' : ''} style={{textAlign:'center'}}>
    <br/><br/><br/><br/>
    <h4 style={{color:'red'}}>Account Ledger Deleted successfully</h4>
    <Link to='/AccountsRecord/Trial' onClick={this.accountDelRfrsh}> <button className="waves-effect waves-dark btn"> OK </button></Link>
  </div>
  

  
  <div className={this.state.cancelDelete === false ? 'display' : ''} style={{textAlign:'center'}}>
    <br/><br/><br/><br/>
    <h4 style={{color:'green'}}>Not Deleted</h4>
    <Link to='/AccountsRecord/Ledger' onClick={this.cancelDelRfrsh}> <button className="waves-effect waves-dark btn"> OK </button></Link>
  </div>
  
  
  <span id='down'></span>
  
  

  {/* <iframe id="ifmcontentstoprint" style={{height:'0px', width: '0px', position: 'absolute'}}></iframe> */}
  



  </div>
  );
  }
  }



  //Trial Component start
  class Trial extends Component{
    constructor(){
      super();
      this.state = {
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
        pageRefresh:0
      }
    }
  
  


    async componentDidMount(){
      //first promise function starting
      var dataPushPromise = new Promise( (res,rej)=>{
      var userId = firebase.auth().currentUser.uid;
      var userEmail = firebase.auth().currentUser.email
  
      this.setState({user:userId,userEmail:userEmail})
      
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
  

    
  

      render(){
        return(
          <div>
    {/* {this.state.pageRefresh}         */}
          <div className='container'>
            <br/>
    {/* <div style={{color:'green'}}><b> {this.state.userEmail}</b></div> */}
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
  
        );
      }
    
  }
  








  
  class DailySales extends Component{
    constructor(){
      super();
      this.state ={
              user:null,
              userEmail:null,
              dailySalesObjects:[],
              arrayOfSalesPrice:[],
              arrayOfCostPrice:[],
              arrayOfMonthlySales:[],
              arrayOfMonthlyCostPrice:[],
              arrayOfMonthlySalesPrice:[],
              pageRefresh:0,
              
      }

  }


  async componentDidMount(){
    
    var userId = firebase.auth().currentUser.uid;
    var userEmail = firebase.auth().currentUser.email
    this.setState({user:userId,userEmail:userEmail})

    





    var dataPushPromis = new Promise( (res,rej)=>{
      var array = [];
      var arrayOfSalesPrice = [];
      var arrayOfCostPrice = [];

      firebase.database().ref('dailySales').on('child_added' , (data)=> { 
        array.push(data.val())
      }  )



      firebase.database().ref('dailySales').on('child_added' , (data)=> { 
        arrayOfSalesPrice.push(   Number(data.val().salesPrice)   ) 
      }  )


      firebase.database().ref('dailySales').on('child_added' , (data)=> { 
        arrayOfCostPrice.push(  Number(data.val().costOfGoods)  )
      }  )
      

      var obj = {};
          obj.objectsArray = array
          obj.arrayOfSalesPrice = arrayOfSalesPrice
          obj.arrayOfCostPrice = arrayOfCostPrice

      res(obj)
      rej('Operation Failed: Data From Firebase does not push in the state successfully')
    } )
    dataPushPromis.then( (ob)=>{
      this.setState({dailySalesObjects:ob.objectsArray, arrayOfSalesPrice:ob.arrayOfSalesPrice, arrayOfCostPrice:ob.arrayOfCostPrice})
    } )









    setTimeout(() => {
  
      const inteId =setInterval(()=>{
        this.setState({pageRefresh: this.state.pageRefresh+1})
      },1000)

      setTimeout(() => {
        clearInterval(inteId);
      }, 30000);
    
    
    
    }, 1000);








    
}



editDailyProfit=(i)=>{
  var reqObj = this.state.dailySalesObjects[i]
  var key = this.state.dailySalesObjects[i].key
  
  var editMonth_year = prompt('Please edit Month & Year',reqObj.month_and_year)
  if(editMonth_year === null){
    editMonth_year = reqObj.month_and_year
  }
  
  var editDate = prompt('Please edit Date',reqObj.date)
  if(editDate === null){
    editDate = reqObj.date
  }
  
  
  var editCostOfGoods = prompt('Please edit Cost Value',reqObj.costOfGoods)
  if(editCostOfGoods === null){
    editCostOfGoods = reqObj.costOfGoods
  }
  

  var editSalesPrice = prompt('Please edit Sales Value',reqObj.salesPrice)
  if(editSalesPrice === null){
    editSalesPrice = reqObj.salesPrice
  }


  var editMonth = prompt('Please edit Month',reqObj.month)
  if(editMonth === null){
    editMonth = reqObj.month
  }


  var editYear = prompt('Please edit Month',reqObj.year)
  if(editYear === null){
    editYear = reqObj.year
  }

  
  reqObj.month_and_year = editMonth_year.replace(/  +/g, ' ').trim();
  reqObj.date = editDate.replace(/  +/g, ' ').trim()
  reqObj.costOfGoods = editCostOfGoods.replace(/  +/g, ' ').trim()
  reqObj.salesPrice = editSalesPrice.replace(/  +/g, ' ').trim()
  reqObj.month = editMonth.replace(/  +/g, ' ').trim()
  reqObj.year = editYear.replace(/  +/g, ' ').trim()
  
  
  firebase.database().ref('dailySales').child(reqObj.key).set(reqObj)
  
  
  this.state.dailySalesObjects.splice(i,1,reqObj)
}





deleteDailyProfit=(i)=>{
  var delKey = prompt("write 'Y' and Press OK")

  if(delKey==='Y'){
  var key = this.state.dailySalesObjects[i].key
  firebase.database().ref('dailySales').child(key).remove()
  this.state.dailySalesObjects.splice(i,1)
  }else{
    alert('You have entered wrong key')
  }
}

  

monthlyProfit=()=>{
this.setState({arrayOfMonthlyCostPrice:[],arrayOfMonthlySalesPrice:[]})

  var month = document.getElementById('month_select_report').value
  var year = document.getElementById('year_select_report').value
  var req_month = month+'-'+year

  var req_objects = this.state.dailySalesObjects.filter(  (obj)=>{return obj.month_and_year === req_month}  )



  setTimeout(() => {

  req_objects.map((itm,ind)=>{return this.state.arrayOfMonthlyCostPrice.push( Number(itm.costOfGoods) )})
  req_objects.map((itm,ind)=>{return this.state.arrayOfMonthlySalesPrice.push(  Number(itm.salesPrice)  )})
  
  
  }, 300);




  this.setState({arrayOfMonthlySales:req_objects})
  console.log(this.state.arrayOfMonthlyCostPrice)

}


    render(){
        return(
          <div className='container'>
            

       


        <table><thead><tr><th>Month</th><th>Date</th><th>Cost of Goods</th><th>Sales Amount</th><th>Profit</th><th>Ratio</th><th>E/D</th></tr></thead><tbody>{this.state.dailySalesObjects.map(  (item,index)=>{return <tr key={index}><td>{item.month_and_year}</td><td>{item.date}</td><td>{item.costOfGoods}</td><td>{item.salesPrice}</td><td>{item.salesPrice-item.costOfGoods}</td><td>{((item.salesPrice-item.costOfGoods)/item.costOfGoods*100).toFixed(2)}%</td><td><a href='#' className="material-icons" style={{color:'green',fontSize:'15px'}} onClick={()=> this.editDailyProfit(index)}>edit</a><a href='#' className="material-icons" style={{color:'red',fontSize:'15px'}} onClick={()=> this.deleteDailyProfit(index)}>delete</a></td></tr>})    }</tbody></table> 
        <div>
          Total Cost {this.state.arrayOfCostPrice.reduce( (total,num)=>{return total+num},0)}  <br/>
          Total Sales {this.state.arrayOfSalesPrice.reduce( (total,num)=>{return total+num},0)}  <br/>
          Total Profit {this.state.arrayOfSalesPrice.reduce( (total,num)=>{return total+num},0)  -  this.state.arrayOfCostPrice.reduce( (total,num)=>{return total+num},0) }   <br/>
          Ratio {  ((this.state.arrayOfSalesPrice.reduce( (total,num)=>{return total+num},0)  -  this.state.arrayOfCostPrice.reduce( (total,num)=>{return total+num},0)  )/this.state.arrayOfCostPrice.reduce( (total,num)=>{return total+num},0)*100).toFixed(2) } %  <br/>
        </div>



<br/><br/><br/>

<div style={{width:'35%'}}> <select className='browser-default' id='month_select_report'><option>Jan</option><option>Feb</option><option>Mar</option><option>Apr</option><option>May</option><option>June</option><option>July</option><option>Aug</option><option>Sep</option><option>Oct</option><option>Nov</option><option>Dec</option></select><select className='browser-default' id='year_select_report'><option>2022</option><option>2023</option><option>2024</option><option>2025</option><option>2026</option><option>2027</option><option>2028</option></select></div>
<button className="waves-effect waves-dark btn" onClick={this.monthlyProfit}>Run Report</button>

<table><thead><tr><th>Month</th><th>Date</th><th>Cost of Goods</th><th>Sales Amount</th><th>Profit</th><th>Ratio</th></tr></thead><tbody>{this.state.arrayOfMonthlySales.map(  (item,index)=>{return <tr key={index}><td>{item.month_and_year}</td><td>{item.date}</td><td>{item.costOfGoods}</td><td>{item.salesPrice}</td><td>{item.salesPrice-item.costOfGoods}</td><td>{((item.salesPrice-item.costOfGoods)/item.costOfGoods*100).toFixed(2)}%</td></tr>})    }</tbody></table> 
        <div>
          Total Cost {this.state.arrayOfMonthlyCostPrice.reduce( (total,num)=>{return total+num},0)}  <br/>
          Total Sales {this.state.arrayOfMonthlySalesPrice.reduce( (total,num)=>{return total+num},0)}  <br/>
          Total Profit {this.state.arrayOfMonthlySalesPrice.reduce( (total,num)=>{return total+num},0)  -  this.state.arrayOfMonthlyCostPrice.reduce( (total,num)=>{return total+num},0) }   <br/>
          Ratio {  ((this.state.arrayOfMonthlySalesPrice.reduce( (total,num)=>{return total+num},0)  -  this.state.arrayOfMonthlyCostPrice.reduce( (total,num)=>{return total+num},0)  )/this.state.arrayOfMonthlyCostPrice.reduce( (total,num)=>{return total+num},0)*100).toFixed(2) } %  <br/>
        </div>

          </div>
        )
    }


  }






  