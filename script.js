document.getElementById('calculateButton').addEventListener('click', () => {
  // Retrieve input values
  const T = parseFloat(document.getElementById('T').value);
  const NA = parseFloat(document.getElementById('NA').value);
  const NB = parseFloat(document.getElementById('NB').value);
  const NHCl = parseFloat(document.getElementById('NHCl').value);
  const VA = parseFloat(document.getElementById('VA').value);
  const VB = parseFloat(document.getElementById('VB').value);
  const VHCl = parseFloat(document.getElementById('VHCl').value);
  const VRMix = parseFloat(document.getElementById('VRMix').value);
  const VNaOH = document.getElementById('VNaOH').value.split(',').map(Number);
  const timePoints = document.getElementById('timePoints').value.split(',').map(Number);

  // Perform calculations
  const C_A = VNaOH.map(v => NHCl * (VHCl - v) / VRMix);
  const rA = C_A.map((c, i) => -((i > 0) ? (C_A[i] - C_A[i - 1]) / (timePoints[i] - timePoints[i - 1]) : 0));
  const lnCA = C_A.map(c => Math.log(c));
  const lnRA = rA.map(r => (r < 0 ? Math.log(-r) : NaN));

  // Update table
  const tableBody = document.querySelector('#resultsTable tbody');
  tableBody.innerHTML = ''; // Clear previous results
  timePoints.forEach((time, i) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${time}</td>
      <td>${C_A[i].toFixed(4)}</td>
      <td>${rA[i].toFixed(4)}</td>
      <td>${lnCA[i].toFixed(4)}</td>
      <td>${isNaN(lnRA[i]) ? '-' : lnRA[i].toFixed(4)}</td>
    `;
    tableBody.appendChild(row);
  });

  // Generate plots
  const ctx1 = document.getElementById('plot1').getContext('2d');
  new Chart(ctx1, {
    type: 'line',
    data: {
      labels: timePoints,
      datasets: [
        {
          label: 'C_A vs Time',
          data: C_A,
          borderColor: 'blue',
          fill: false,
        }
      ]
    },
    options: { responsive: true }
  });

  const ctx2 = document.getElementById('plot2').getContext('2d');
  new Chart(ctx2, {
    type: 'line',
    data: {
      labels: timePoints.slice(1), // Exclude the first point for rA
      datasets: [
        {
          label: '-rA vs Time',
          data: rA.slice(1),
          borderColor: 'red',
          fill: false,
        }
      ]
    },
    options: { responsive: true }
  });
});
