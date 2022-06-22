// Variables
let budget=0
let income=0
let expense=0

// DOM Variables
const addBtn=document.getElementById('submit')
const desc=document.getElementById('description')
const posNeg=document.getElementById('posNneg')
const amount=document.getElementById('value')
const headIncome=document.getElementById('incHead')
const headExp=document.getElementById('expHead')

//Check whether Value Negative or Positive
function checkSign(x){
    if(x=='-'){
        return -1
    }
    else{
        return 1
    }
}

//Event Listener for Submit Button
addBtn.addEventListener("click",function(){
    if(checkSign(posNeg.value)>0){
        income=amount.value
    }
    else{
        expense=amount.value
    }
    budget=income-expense
    headIncome.textContent+=income
    headExp.textContent+=expense 
})