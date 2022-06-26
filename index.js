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
            let newItem,id
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
            let ids,index
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
})()

// UI Controler
//displays UI and manage DOM manipulation
let UIControler=(function(){
    let DOMstrings={
        inputType:'.posNeg',
        inputDescription:'.description',
        inputValue:'.value',
        inputBtn:'.add_btn',
        incomeContainer:'.income',
        expensesContainer:'.loss',
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
    let nodelist=function(list,callback){
        for(let i=0;i<list.length;i++){
            callback(list[i],i);
        }
    }

    return{
        getInput:function(){
            return{
                type:document.querySelector(DOMstrings.inputType).value,    // either inc or exp
                description:document.querySelector(DOMstrings.inputDescription).value,
                value:parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },
        addListItem:function(obj,type){
            let html,newHtml
            //create HTML string with placeholder text
            if(type==='inc')
            {
                element=DOMstrings.incomeContainer
                html=`<div class="item-clearfix" id="inc-${id}">
                        <div class="item_description">
                            ${description}
                        </div>
                        <div class="right clearfix">
                            <div class="item_value">${value}</div>
                        </div>
                    </div>`
            }
            else if(type==='exp')
            {
                element=DOMstrings.expensesContainer
                html=`<div class="item-clearfix" id="exp-${id}">
                <div class="item_description">
                    ${description}
                </div>
                <div class="right clearfix">
                    <div class="item_value">${value}</div>
                </div>
            </div>`
            }
            newHtml=html.replace(`${id}`,obj.id)
            newHtml=html.replace(`${description}`,obj.description)
            newHtml=html.replace(`${value}`,formatNumber(obj.value,type))

            // Insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml)
        },

        //delete List Item
        // selectorID = itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        //income-0
        deleteListItem:function(selectorID){
            let el=document.getElementById(selectorID)
            el.parentNode.removeChild(el);
        },

        clearField: function() {
            let fields, fieldsArr
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue)
            // querySelectorAll give us list, which we want change to array
            fieldsArr = Array.prototype.slice.call(fields)

            // loop over array to clear fields. Callback function is applied to each of the elements in the array
            fieldsArr.forEach(function(current, index, array) {
                current.value = ""
            })
            fieldsArr[0].focus()
        },

        displayBudget: function(obj) {
            let type
            obj.budget > 0 ? type = 'inc' : type = 'exp'
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type)
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc')
            document.querySelector(DOMstrings.expencesLabel).textContent = formatNumber(obj.totalExp, 'exp')

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%'
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '--'
            }
        },

        displayPercentages: function(percentages) {
            let fields = document.querySelectorAll(DOMstrings.expencesPercLabel)

            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%'
                    console.log(percentages)
                } else {
                    current.textContent = '---'
                }
            })

        },
        displayMonth: function() {
            let n, year, month
            let n = new Date()
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            month = n.getMonth()
            year = n.getFullYear()
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year
        },

        changeType: function() {
            let fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue)

            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus')
            })
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red')
        },

        getDOMstrings: function() {
            return DOMstrings
        }
    }
})()

// Global app controler
// MVC - Controller (controller) provide event handlers and updates view and model.
let controler = (function(budgetCtrl, UICtrl) {

    let setupEventListeners = function() {
        let DOM = UICtrl.getDOMstrings()

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) { // which for older browser
                ctrlAddItem()
            }
        })

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType)
    }

    let updateBudget = function() {
        // 1. calculate budget
        budgetCtrl.calculateBudget()
        // 2. return budget
        let budget = budgetCtrl.getBudget()
        // 3. displaythe budget on the UI   
        UICtrl.displayBudget(budget)
    }

    let updatePercentages = function() {
        // calculate percentages
        budgetCtrl.calculatePercentages()
        // read from  budget controller
        let percentages = budgetCtrl.getPercantages()
        // update UI
        UICtrl.displayPercentages(percentages)
        console.log(percentages)
    }

    let ctrlAddItem = function() {
        let input, newItem
        // 1. get the field input data
        input = UIControler.getInput()

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {

            // 2. add item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value)

            // 3. add the item to UI
            UIControler.addListItem(newItem, input.type)

            // 4. clear fields
            UICtrl.clearField()

            //5. calculate and update budget
            updateBudget()

            //6. calculate and updater percentages
            updatePercentages()
        }
    }

    let ctrlDeleteItem = function(event) {
        let itemID, splitID, type, ID
        // DOM treversing
        // event.target - i.ion-ios-close-outline
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id
        if (itemID) {
            // inc-1
            splitID = itemID.split('-')
            type = splitID[0]
            ID = parseInt(splitID[1])

            // delate item from data structure
            budgetCtrl.deleteItem(type, ID)
            // delete item from UI
            UICtrl.deleteListItem(itemID)
            // update and show new budget
            updateBudget()

            // calculate and updater percentages
            updatePercentages()
        }
        console.log(event)
    }

    return {
        init: function() {
            console.log('aplikacja wystartowala')
            UICtrl.displayMonth()
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            })
            setupEventListeners()
        }
    }

})(budgetController, UIControler)

controler.init();