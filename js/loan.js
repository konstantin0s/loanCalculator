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

//Save the user-s input as properties of the localStorage object
function save(amount, apr, years, zipcode) {
  if (window.localStorage) { //Do this only if the browser supports it.
    localStorage.loan_amount = amount;
    localStorage.loan_apr = apr;
    localStorage.loan_years = years;
    localStorage.loan_zipcode = zipcode;

  }
}

//Automatically attempt to restore input fields when the document first loads.
window.onload = function() {
  //If the browser supports localStorage and we have some stored Data
  if (window.localStorage && localStorage.loan_amount) {
    document.getElementById("amount").value = localStorage.loan_amount;
    document.getElementById("apr").value = localStorage.loan_apr;
    document.getElementById("years").value = localStorage.loan_years;
    document.getElementById("zipcode").value = localStorage.loan_zipcode;
  }
};

//Pass the user's input to a server-side script which can (in theory) return a list of links to local lenders interested in making loans.

if(!window.XMLHttpRequest) return;

//Find the element to display the list of lenders in
var ad = document.getElementById("lenders");
if (!ad) return; // quit if no spot for output

//Encode the user's input as query parameters in a URL
var url = "getLenders.php" +
"?amt=" + encodeURIComponent(amount) +
"&apr=" + encodeURIComponent(apr) +
"&yrs=" + encodeURIComponent(years) +
"&zip=" + encodeURIComponent(zipcode);


//Fetch the content of that url using XMLHttpRequest
var req = new XMLHttpRequest();
req.open("GET", url);
req.send(null);

//Before returning, register an event handle function that will be called at some time later in the HTTP server's response arrives.
req.onreadystatechange = function() {
  //IF we get herem we got a complete valid HTTP response
  var response = req.responseText;
  var lenders = JSON.parse(response);

  //Convert the array of lender object to a string of html
  var list = "";
  for(var i = 0; i < lenders.length; i++) {
    list += "<li><a href='" + lenders[i].url +"'>" +
         lenders[i].name + "</a>";
  }
  //Display the HTML in the element from above.
  ad.innerHTML = "<ul>" + list + "</ul>";
}
}
}
