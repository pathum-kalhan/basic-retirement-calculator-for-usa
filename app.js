function processData(params) {
    const name = document.getElementById('name').value;
    console.log('name',name)
    // Find a <table> element with id="myTable":

    
    
    
    // var heading = document.createElement("h1");   // Create a <button> element
    // heading.innerHTML = "Table";                   // Insert text
    // document.body.appendChild(heading); 
    var table = document.getElementById("myTable");


    // var x = document.createElement("TH");
    // x.innerHTML = 'jjj'
    // row.appendChild(headerCell);
    

for (let index = 0; index < 10; index++) {
    var row = table.insertRow(1);

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    
    cell1.innerHTML = "NEW CELL1";
    cell2.innerHTML = "NEW CELL2";
    cell3.innerHTML = "NEW CELL1";
    cell4.innerHTML = "NEW CELL2";

    
}
    
}

function validateInput(params) {
    const age = document.getElementById('age').value;
    
}