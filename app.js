const chartData = []
let isCalledBefore = false;
let chart = null;

function processData() {
    try {
        let retireName = String(document.getElementById('name').value);
        let age = Number(document.getElementById('age').value);
        let planName = String(document.getElementById('planName').value);
        let curSave = Number(document.getElementById('curSave').value);
        let savingGrowth = Number(document.getElementById('savingGrowth').value);
        let curSalary = Number(document.getElementById('salary').value);
        let salContribution = Number(document.getElementById('salContribution').value);
        let salIncrease = Number(document.getElementById('salIncrease').value);
        let yearToRetire = Number(document.getElementById('yearToRetire').value);

        let year = 2020;

        const tblRows = [];
        const retirementAge = age + yearToRetire
        let fixedRetirementSalary = 0;
        

        for (let index = age; index <= 100; index++) {
            let salaryContribution = 0
            let salary = 0
            // There is no salary contribution after retirement
            if (age < retirementAge) {
                salaryContribution = Number((curSalary * salContribution / 100)).toFixed(2);
                curSave = Number(curSave) + Number(salaryContribution);
                salary = curSalary;
            } else {
                // This year salary = FUND / YEARS DIFF
                
                curSave = Number(curSave) - Number(fixedRetirementSalary);
                salary = fixedRetirementSalary
            }

            
            
            
           
            tblRows.push({
                year, age, salaryContribution,curSave,salary
            });
            year = year + 1;
            age = age + 1;
            if (age < retirementAge ) {
                
                curSalary = Number(curSalary + (curSalary * (salIncrease / 100)));
            }
            

            if (age === retirementAge) {
                fixedRetirementSalary = curSave / (100-(retirementAge-1))
            }
            
            
        }

       


        const table = document.getElementById("myTable");

        // Reverse the array
        tblRows.reverse();

        

        
        for (let index = 0; index <= tblRows.length -1; index++) {
            var row = table.insertRow(1);
        
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);
            const cell5 = row.insertCell(4);
                       
            cell1.innerHTML = tblRows[index].year;
            cell2.innerHTML = tblRows[index].age;
            cell3.innerHTML = tblRows[index].salaryContribution;
            cell4.innerHTML = Number(tblRows[index].curSave).toFixed(2);
            cell5.innerHTML = Number(tblRows[index].salary).toFixed(2);
            
           
        
            
        }

        chartData.push({planName,tblRows})

        renderApexChart()
    } catch (error) {
        console.log(error)
    }
    
    

    
}

function renderApexChart() {
    
    

    // Get the ages range first - PART #1
    const agesRange = [];
    chartData.forEach((e) => {
        const ages = e.tblRows.map((el) => el.age);
        const min = Math.min(...ages);
        agesRange.push(min);
    });

    const minAge = Math.min(...agesRange);
    const categories = [];
    for (let index = minAge; index <= 100; index += 1) {
        categories.push(index);
    }

    // PART #2 
    const series = [];

    chartData.forEach((e) => {
        
        const ages = e.tblRows.map((el) => el.age);
        const min = Math.min(...ages);

        // Map salaries
        const salaries = e.tblRows.map((el) => Math.trunc(el.salary));

        if (min === minAge) {
            series.push({
                name: e.planName,
                data: salaries,
            });
        }
        if (minAge < min) {
            const agesDiff = min - minAge;
            for (let index = 1; index <= agesDiff; index += 1) {
                salaries.unshift(null);
            }
            series.push({
                name: e.planName,
                data: salaries,
            });
        }
    });

    var options = {
        chart: {
            type: 'line'
        },
        series,
        xaxis: {
            categories
        }
    }

    
    
    if (!isCalledBefore) {
     
     chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();

        isCalledBefore = true;
    } else {
        chart.updateOptions(options,true)
        chart.updateSeries(series)
    }
    
}