"use strict";

function calculate() {
  //Look up the input and outout elements in the document
  var amount = document.getElementById("amount");
  var apr = document.getElementById("apr");
  var years = document.getElementById("years");
  var zipcode = document.getElementById("zipcode");
  var payment = document.getElementById("payment");
  var total = document.getElementById("total");
  var totalinterest = document.getElementById("totalinterest");

  //Get the user input from the input elements.Assume it is all valid.
  //Convert interest from a percentage to a decimal, and convert from an annual rate
  //to a monthly rate.Conver payment period in years to the number of monthly payments.
  var principal = parseFloat(amount.value);
  var interest = parseFloat(apr.value) / 100 / 12;
  var payments = parseFloat(years.value) * 12;

  //Now compute the monthly payment figure.
  var x = Math.pow(1 + interest, payments);
  var monthly = (principal*x*interest)/(x-1);

  //If the result is a finite number, the users input was good and we have meaningful results to display
  if (isFinite(monthly)) {
    //Fill in the output fields, rounding to 2 decimal places
    payment.innerHTML = monthly.toFixed(2);
    total.innerHTML - (monthly * payments).toFixed(2);
    totalinterest.innerHTML = ((monthly*payments)-principal).toFixed(2);]

    //Save the users input so we can restore it the next time they visit
    save(amount.value, apr.value, years.value, zipcode.value);

    //Advertise: find and display local lenders, but ignore network errors
    try {
      getLenders(amount.value, apr.value, years.value, zipcode.value);
    }
    catch(e) { /* and ignore those erros*/ }

    //Finally, chart loan balance, and interest and equity Payments
    chart(principal, interest, monthly, payments);
  } else {
    //Result was not a number or infinite, which means the input was incomplete or invalid.Clear any previously displayed output.
    payment.innerHTML = "";
    total.innerHTML = "";
    totalinterest.innerHTML = "";
    chart(); //clear the chart
  }

}
