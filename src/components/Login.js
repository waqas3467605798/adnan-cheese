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
            rozNamcha:false,
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


            // state of daily profit
              dailySalesObjects:[],
              arrayOfSalesPrice:[],
              arrayOfCostPrice:[],
              arrayOfMonthlySales:[],
              arrayOfMonthlyCostPrice:[],
              arrayOfMonthlySalesPrice:[],
              showProfitReport:false,




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








      // Promise function of daily profit
var dataPushPromisDailyProfit = new Promise( (res,rej)=>{
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
    dataPushPromisDailyProfit.then( (ob)=>{
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
        
            this.setState({showSummary:true, rozNamcha:false, showStatement:false,showPartyList:false, enterKeyInput:false,wrongKey:'', keyValue:''})
        
      }




      showStatement=()=>{
        
            this.setState({showStatement:true, rozNamcha:false,showSummary:false, showPartyList:false, enterKeyInput:false, wrongKey:'',keyValue:''})
        
      }



      rozNamcha=()=>{
        this.setState({rozNamcha:true, showStatement:false, showSummary:false, showPartyList:false, enterKeyInput:false, wrongKey:'',keyValue:''})
      }



      showPartyList=()=>{
        this.setState({showPartyList:true,rozNamcha:false, showStatement:false, showSummary:false, enterKeyInput:false, wrongKey:'',keyValue:''})
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
      this.setState({arrayOfMonthlyCostPrice:[],arrayOfMonthlySalesPrice:[],showProfitReport:true})
      
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
        <div>
        <div className={this.state.loadingFromFirebase===0?'display':''}>



<br/>
        <div style={{textAlign:'center'}} className={this.state.enterKeyInput===false?'container':'display'}>
        <span className='navBarHomePage' style={{cursor:'pointer', color:'gray', fontSize:'14px'}} onClick={this.showSummary}>کھاتوں کا خلاصہ</span>
        <span className='navBarHomePage' style={{cursor:'pointer', color:'gray',fontSize:'14px'}} onClick={this.showStatement}>تمام کھاتے</span>
        <span className='navBarHomePage' style={{cursor:'pointer', color:'gray',fontSize:'14px'}} onClick={this.showPartyList}>کسٹمر لسٹ</span>
        <span className='navBarHomePage' style={{cursor:'pointer', color:'gray',fontSize:'12px'}} onClick={this.rozNamcha}>روزنامچہ </span>
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






{/* Here from div of Roz Namcha */}
<div className={this.state.rozNamcha===false?'display':'container'}>
 <br/><br/><br/><br/>
 <p style={{cursor:'pointer', color:'blue'}} onClick={this.monthlyProfit}>Profit Report for</p>
        <div style={{width:'90%'}}> <select className='browser-default' style={{width:'25%'}} id='month_select_report'><option>Jan</option><option>Feb</option><option>Mar</option><option>Apr</option><option>May</option><option>June</option><option>July</option><option>Aug</option><option>Sep</option><option>Oct</option><option>Nov</option><option>Dec</option></select><select className='browser-default' style={{width:'25%'}} id='year_select_report'><option>2022</option><option>2023</option><option>2024</option><option>2025</option><option>2026</option><option>2027</option><option>2028</option></select></div>
        



        <div className={this.state.showProfitReport===true?'':'display'}>
        <table><thead><tr><th style={{textAlign:'center'}}>شرع </th><th style={{textAlign:'center'}}>منافع</th><th style={{textAlign:'center'}}>مال<br/> قیمت فروخت</th><th style={{textAlign:'center'}}>مال<br/> قیمت خرید</th><th style={{textAlign:'center'}}>تاریخ</th></tr></thead><tbody>{this.state.arrayOfMonthlySales.map(  (item,index)=>{return <tr key={index}><td>{((item.salesPrice-item.costOfGoods)/item.costOfGoods*100).toFixed(2)}%</td><td>{item.salesPrice-item.costOfGoods}</td><td>{item.salesPrice}</td><td>{item.costOfGoods}</td><td>{item.date}</td></tr>})    }</tbody></table> 
        {/* <table><thead><tr><th>Month</th><th>Date</th><th>Cost of Goods</th><th>Sales Amount</th><th>Profit</th><th>Ratio</th></tr></thead><tbody>{this.state.arrayOfMonthlySales.map(  (item,index)=>{return <tr key={index}><td>{item.month_and_year}</td><td>{item.date}</td><td>{item.costOfGoods}</td><td>{item.salesPrice}</td><td>{item.salesPrice-item.costOfGoods}</td><td>{((item.salesPrice-item.costOfGoods)/item.costOfGoods*100).toFixed(2)}%</td></tr>})    }</tbody></table>  */}
        
        <br/><br/>
        <div>
          <p style={{textAlign:'center',fontSize:'20px'}}> <b>نتائج</b></p>
          <table style={{width:'60%'}}>
        <tr><td>{this.state.arrayOfMonthlyCostPrice.reduce( (total,num)=>{return total+num},0)} </td><td>  کل قیمت مال خرید  </td></tr> 
        <tr><td>{this.state.arrayOfMonthlySalesPrice.reduce( (total,num)=>{return total+num},0)} </td><td>  کل قیمت مال فروخت </td></tr>
        <tr><td>{this.state.arrayOfMonthlySalesPrice.reduce( (total,num)=>{return total+num},0)  -  this.state.arrayOfMonthlyCostPrice.reduce( (total,num)=>{return total+num},0) }   </td><td>    کل منافع </td></tr>
        <tr><td>{  ((this.state.arrayOfMonthlySalesPrice.reduce( (total,num)=>{return total+num},0)  -  this.state.arrayOfMonthlyCostPrice.reduce( (total,num)=>{return total+num},0)  )/this.state.arrayOfMonthlyCostPrice.reduce( (total,num)=>{return total+num},0)*100).toFixed(2) } % </td><td>   اوسط شرع </td></tr>
          </table>
        </div>
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