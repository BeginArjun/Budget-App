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
        //Calculate Budget
        calcBudget:function(){
            calcTotal('exp')
            calcTotal('inc')

            //calculate budget= income -expense
            data.budget=data.totals.inc-data.totals.exp

            // calculate the percetange
            if(data.totals.inc>0){
                data.percentage=Math.round((data.totals.exp/data.totals.inc)*100)
            }
            else{
                data.percentage=-1
            }
            console.log(data.allItems)
        },
        // Calculate Percentages
        calculatePercetages:function(){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercent(data.totals.inc)
            })
        },
        getPercentages:function(){
            let allPerc=data.allItems.exp.map(function(cur){
                return cur.getPercent()
            })
        },
        getBudget:function(){
            return{
                budget:data.budget,
                totalInc:data.totals.inc,
                totalExp:data.totals.exp,
                percentage:data.percentage
            }
        },
        // testing [delete later]
        testing:function(){
            console.log(data)
        }
    }
})

// UI Controler
//displays UI and manage DOM manipulation
let UIControler=(function(){
    let DOMstrings={
        inputType:'posNeg',
        inputDescription:'description',
        inputValue:'value',
        inputBtn:'add_btn',
        incomeContainer:'income',
        expensesContainer:'loss',
        budgetLabel:'.budget_value',
        incomeLabel:'.budget_income--value',
        expensesLabel:'.budget_expenses--value',
        percentageLabel:'.budget_expenses--percentage',
        container:'.container',
        expensesPercLabel:'.item_percentage',
        dateLabel:'.budget_title--month'
    }
    let formatNumber= function(num,type){
        let numSplit,int,dec 

        // Accurate to 2 decimal
        num=Math.abs(num)
        num=num.toFixed(2)

        //comma-separeted thousands
        numSplit=num.split('.')
        int=numSplit[0]
        if(int.length>3){
            int=int.substr(0,int.length-3)+','+int.substr(int.length-3,3)   // 1000 --> 1,000
        }
        dec=numSplit[1]
        // + or -
        return (type==='exp'?'-':'+')+ ' '+ int +'.'+dec
    }
    // nodeListforEach
    
})