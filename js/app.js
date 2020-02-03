// variables
const form = document.getElementById("request-quote");
const html = new HTMLUI();
// event listeners
eventListeners();

function eventListeners(){


    // very important piece of work
    document.addEventListener("DOMContentLoaded", function() {
        // create the <option>
    
        html.displayYears();
       
    });
    
    form.addEventListener("submit", function(e){
        e.preventDefault();
        
        // read value from form
        const make = document.getElementById("make").value;
        const year = document.getElementById("year").value;
        
        //read the radio buttons
        const level = document.querySelector("input[name='level']:checked").value;
        
        // check that all is well
        if( make === "" || year === "" || level === ""){
            //console.log(html) will print an instance of its self
            html.displayError("All Fields are Mandatory !!");
        } else {


            const removePrev = document.querySelector("#result div");

            if(removePrev != null) {
                removePrev.remove();
            }
            // 
            const insurance = new Insurance(make, year, level);
            const price = insurance.calculateQuotation(insurance); 

            html.showResults(price, insurance);
            
            
        }

    });


}


// Objects

// everything related to the quotation and calculationc in insurance
function Insurance (make, year, level){
    this.make = make;
    this.year = year;
    this.level = level;
}

// calculate the price for the current quotation

Insurance.prototype.calculateQuotation = function(insurance) {
    let price;
    const base = 2000;

    //get make value

    const make = insurance.make;
    /*
    1. American 15%
    2. Asian 5%
    3. European 35%
    */
    switch(make) {
        case "1":
            price = base * 1.15
            break;
        case "2":
            price = base * 1.05
            break;                
        case "3":
            price = base * 1.35
            break;
    }
    
    // const year 
    const year = insurance.year;
    const difference = this.getYearDifference(year); // u can use this or insurance but this is idle incase you want to inherit it

   // each year the cost of the insurance will be 3% cheaper
    price = price -((difference * 3) * price) / 100;
   
    // check level of protection
    const level = insurance.level;
    
    price = this.calculateLevel(price, level);

    return price;
    

}

// return difference between years
Insurance.prototype.getYearDifference = function(year) {
    return new Date().getFullYear() - year; 
}
// function to calculate level

Insurance.prototype.calculateLevel = function(price, level){

    if(level === "basic") {
        price = price * 1.30;
    } else if (level === "complete") {
        price = price * 1.50;
    } else {
        price = price * 2.00;
    }
    return price;
   
}


function HTMLUI(){}

// display latest 20 years

HTMLUI.prototype.displayYears = function(){
    // max and minimum years

    const max = new Date().getFullYear(),
          min = max - 20;
    //generate the list of years
    const selectYears = document.getElementById("year");

    // print the valus
    for(let i = max; i >= min; i--){
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        selectYears.appendChild(option);

     } 
    // // using foreach 
    // const arr = ["- Select -","1st Class","2nd Class","3rd Class","Pass","Emmmm Tried sha !!"];
    
    // arr.forEach(element => {
    //     const option = document.createElement("option");
    //     option.value = element;
    //     option.textContent = element;
    //     selectYears.appendChild(option);
    
    // });
}
HTMLUI.prototype.displayError = function(message){
    // create div
    const div = document.createElement("div");
    div.classList = "error"

    // insert message

    div.innerHTML = `
        <p>${message}</p>
    `;
    // inserts a div above form
    form.insertBefore(div, document.querySelector(".form-group"));
    // remove error
    setTimeout(function() {
        document.querySelector(".error").remove();
    }, 3000);
}

// print to html

HTMLUI.prototype.showResults = function(price, insurance) {
    // print the result
    const result = document.getElementById("result")

    const div = document.createElement("div");
    let make = insurance.make;

    switch(make){
        case "1":
            make = "American"
            break;
        case "2":
            make = "Asian"
            break;
        case "3":
            make = "European"
            break;
    }
  
    div.innerHTML = `
        <p class="header">Summary</p>
        <p>Make: ${make}</p>
        <p>Year: ${insurance.year}</p>
        <p>Level: ${insurance.level}</p>
        <p class= "total">Total: $ ${price}</p>
    `
    const spinner = document.querySelector("#loading img")
    spinner.style.display = "block";

    setTimeout(function(){
        spinner.style.display = "none";
        result.appendChild(div);
    }, 4000 );

    
}