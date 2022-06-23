let budgetControl=(function(){
    //Expense
    let Expense=function(id,description,value){
        this.id=id
        this.name=description
        this.value=value
        this.percentage=-1
    }
    //Calculate Percentage of Expense
    Expense.prototype.calcPercent=function(totalIncome){
        if(totalIncome>0){
            this.percentage=Math.round((this.value/totalIncome)*100)
        }
        else{
            this.percentage=-1
        }
    }
    //Return Percentage
    Expense.prototype.getPercent=function(){
        return this.percentage
    }
    //Income
    let Income= function(id,description,value){
        this.id=id
        this.name=description
        this.value=value
    }
    //Data Stored
    let data={
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1
    }
    //Calculating Total
    let calcTotal=function(type){
        let sum=0
        data.allItems[type].forEach(function(cur){
            sum+=cur.value
        })
        data.totals[type]=sum
    }
    return {
        addItem: function(type,desc,value){
            var newItem,id
            //Creating new id
            if(data.allItems[type].length>0){
                id=data.allItems[type][data.allItems[type].length - 1].id + 1   // ID= Last ID +1
            }
            else{
                id=0
            }

            //create newItem
            if(type==='exp'){
                newItem=new Expense(id,desc,value)
            }
            else if(type==='inc'){
                newItem=new Income(id,desc,value)
            }

            //push into data structure
            data.allItems[type].push(newItem)
            //return new element
            return newItem
        },

        //Delete item
        deleteItem:function(type,id){
            var ids,index
            ids=data.allItems[type].map(function(current){
                return current.id
            })
            index=ids.indexOf(id)
            if(index!=-1){
                data.allItems[type].splice(index,1)
            }
        },

        
    }
})

// DOM Variables
const addBtn=document.getElementById('submit')
const desc=document.getElementById('description')
const amount=document.getElementById('value')
const posNeg=document.getElementById('posNeg')
