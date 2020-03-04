let chartData = [];
let isCalledBefore = false;
let chart = null;
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
        data: salaries.reverse(),
      });
    }
    if (minAge < min) {
      const agesDiff = min - minAge;
      for (let index = 1; index <= agesDiff; index += 1) {
        salaries.unshift(null);
      }
      series.push({
        name: e.planName,
        data: salaries.reverse(),
      });
    }
  });

  const options = {
    chart: {
      type: 'line',
    },
    series,
    xaxis: {
      categories,
    },
  };

  // series.reverse();
  console.log(series);

  // const options = {
  //   chart: {
  //     id: 'vuechart-example',
  //     type: 'line',
  //   },
  //   series,
  //   xaxis: {
  //     categories,
  //     title: {
  //       text: 'Age',
  //       offsetX: 0,
  //       offsetY: 0,
  //       style: {
  //         color: 'green',
  //         fontSize: '12px',
  //         fontFamily: 'Helvetica, Arial, sans-serif',
  //         cssClass: 'apexcharts-xaxis-title',
  //       },
  //     },
  //   },
  //   yaxis: {
  //     title: {
  //       text: 'Salary',
  //       offsetX: 0,
  //       offsetY: 6,
  //       style: {
  //         color: 'green',
  //         fontSize: '12px',
  //         fontFamily: 'Helvetica, Arial, sans-serif',
  //         cssClass: 'apexcharts-xaxis-title',
  //       },
  //     },
  //   },
  // };


  if (!isCalledBefore) {
    // eslint-disable-next-line no-undef
    chart = new ApexCharts(document.querySelector('#chart'), options);
    chart.render();

    isCalledBefore = true;
  } else {
    chart.updateOptions(options, true);
    chart.updateSeries(series);
  }
}
function validateInput(age,
  curSave,
  savingGrowth,
  curSalary,
  salContribution,
  salIncrease,
  yearToRetire) {
  return new Promise((resolve, reject) => {
    try {
      const errors = [];
      // AGE SHOULD BE A NUMBER BETWEEN 18 - 67;
      if (!(typeof age === 'number' && (age >= 18) && (age <= 67))) {
        errors.push('Age should be a number between 18 - 67.');
      }

      // CURRENT SAVING SHOULD BE A NUMBER
      if (!(typeof curSave === 'number' && curSave > 0)) {
        errors.push('Current savings should be a number greater than zero.');
      }

      // Average annual rate of return
      if (!(typeof savingGrowth === 'number' && (savingGrowth > 0) && (savingGrowth <= 100))) {
        errors.push('Percentage value for Average annual rate of return is invalid.');
      }

      // CURRENT SALARY SHOULD BE A NUMBER
      if (!(typeof curSalary === 'number' && curSalary > 0)) {
        errors.push('Current salary should be a number greater than zero.');
      }

      // Salary contribution should be a percentage
      if (!(typeof salContribution === 'number' && (salContribution > 0) && (salContribution <= 100))) {
        errors.push('Percentage value for salary contribution is invalid.');
      }

      // Salary contribution should be a percentage
      if (!(typeof salIncrease === 'number' && (salIncrease > 0) && (salIncrease <= 100))) {
        errors.push('Percentage value for estimated yearly salary increase is invalid.');
      }

      // Years to retire
      if (!(typeof yearToRetire === 'number' && (yearToRetire > 0) && (yearToRetire <= 44))) {
        errors.push('Number of years to retirement should be a number between 1 - 44.');
      }
      if (errors.length) {
        const para = document.createElement('p');
        const node = document.createTextNode(errors.join());
        para.appendChild(node);

        const element = document.getElementById('alert');
        element.appendChild(para);
        document.getElementById('alert').style.visibility = 'visible';
      }

      resolve(errors);
    } catch (error) {
      reject();
    }
  });
}
// eslint-disable-next-line no-unused-vars
async function processData() {
  try {
    document.getElementById('alert').style.visibility = 'hidden';
    // const retireName = String(document.getElementById('name').value);
    let age = Number(document.getElementById('age').value);
    const planName = String(document.getElementById('planName').value);
    let curSave = Number(document.getElementById('curSave').value);
    const savingGrowth = Number(document.getElementById('savingGrowth').value);
    let curSalary = Number(document.getElementById('salary').value);
    const salContribution = Number(document.getElementById('salContribution').value);
    const salIncrease = Number(document.getElementById('salIncrease').value);
    const yearToRetire = Number(document.getElementById('yearToRetire').value);

    const errors = await validateInput(age,
      curSave,
      savingGrowth,
      curSalary,
      salContribution,
      salIncrease,
      yearToRetire);
    if (errors.length) {
      return;
    }

    let year = 2020;

    const tblRows = [];
    const retirementAge = age + yearToRetire;
    let fixedRetirementSalary = 0;


    for (let index = age; index <= 100; index += 1) {
      let salaryContribution = 0;
      let salary = 0;
      // There is no salary contribution after retirement
      if (age < retirementAge) {
        salaryContribution = Number((curSalary * (salContribution / 100))).toFixed(2);
        curSave = Number(curSave) + Number(salaryContribution);
        curSave += Number(curSave) * Number(savingGrowth / 100);
        salary = curSalary;
      } else {
        // This year salary = FUND / YEARS DIFF

        curSave = Number(curSave) - Number(fixedRetirementSalary);
        salary = fixedRetirementSalary;
      }


      tblRows.push({
        year, age, salaryContribution, curSave, salary,
      });
      year += 1;
      age += 1;
      if (age < retirementAge) {
        curSalary = Number(curSalary + (curSalary * (salIncrease / 100)));
      }


      if (age === retirementAge) {
        fixedRetirementSalary = curSave / (100 - (retirementAge - 1));
      }
    }


    const table = document.getElementById('myTable');
    while (table.rows.length > 1) {
      table.deleteRow(1);
    }

    // Reverse the array
    tblRows.reverse();


    for (let index = 0; index <= tblRows.length - 1; index += 1) {
      const row = table.insertRow(1);

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


    chartData.push({ planName, tblRows });

    renderApexChart();
  // eslint-disable-next-line no-empty
  } catch (error) {

  }
}

function resetToDefaults() {
  document.getElementById('name').value = 'Tharindu';

  document.getElementById('age').value = 23;
  document.getElementById('planName').value = 'Blue Bird';
  document.getElementById('curSave').value = 50000;
  document.getElementById('savingGrowth').value = 11;
  document.getElementById('salary').value = 70000;
  document.getElementById('salContribution').value = 2;
  document.getElementById('salIncrease').value = 0.1;
  document.getElementById('yearToRetire').value = 10;
  const tb = document.getElementById('myTable');
  while (tb.rows.length > 1) {
    tb.deleteRow(1);
  }
  if (chart) {
    chart.destroy();
  }
  chartData = [];
  isCalledBefore = false;
  chart = null;
}
