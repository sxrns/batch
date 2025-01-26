function calculateAndPlot() {
    // Fetching user inputs
    const T = parseFloat(document.getElementById("T").value);
    const NA = parseFloat(document.getElementById("NA").value);
    const NB = parseFloat(document.getElementById("NB").value);
    const NHCl = parseFloat(document.getElementById("NHCl").value);
    const VA = parseFloat(document.getElementById("VA").value);
    const VB = parseFloat(document.getElementById("VB").value);
    const VHCl = parseFloat(document.getElementById("VHCl").value);
    const VRMix = parseFloat(document.getElementById("VRMix").value);

    const V_NaOH_array = document.getElementById("VNaOH").value.split(',').map(Number);
    const time_points = document.getElementById("timePoints").value.split(',').map(Number);

    // Initial concentration calculations
    const C_A0 = (NA * VA) / (VA + VB);  // Initial concentration of Ethyl Acetate
    const C_B0 = (NB * VB) / (VA + VB);  // Initial concentration of NaOH

    const M = C_B0 / C_A0; // Molar ratio of reactants

    // Arrays to store the results
    let C_B_list = [];
    let C_A_list = [];
    let X_A_list = [];
    let ln_1_minus_XA = [];
    let XA_over_1_minus_XA = [];

    for (let i = 0; i < V_NaOH_array.length; i++) {
        const V_NaOH = V_NaOH_array[i];
        const moles_HCl_reacted = (VHCl * NHCl) - (V_NaOH * NB);
        const C_B = moles_HCl_reacted / (VHCl + VRMix);  // Concentration of unreacted NaOH

        const C_A = C_A0 - (C_B0 - C_B);  // Concentration of unreacted Ethyl Acetate
        const X_A = 1 - (C_A / C_A0);  // Fraction of Ethyl Acetate converted

        C_B_list.push(C_B);
        C_A_list.push(C_A);
        X_A_list.push(X_A);

        // -ln(1-X_A) and X_A/(1-X_A)
        ln_1_minus_XA.push(Math.log(1 / (1 - X_A)));
        XA_over_1_minus_XA.push(X_A / (1 - X_A));
    }

    // Plotting
    const plot1 = {
        x: time_points,
        y: ln_1_minus_XA,
        mode: 'markers',
        type: 'scatter',
        name: '-ln(1-X_A) vs. Time',
        marker: { color: 'orange' }
    };

    const plot2 = {
        x: time_points,
        y: XA_over_1_minus_XA,
        mode: 'markers',
        type: 'scatter',
        name: 'X_A/(1-X_A) vs. Time',
        marker: { color: 'skyblue' }
    };

    const layout = {
        title: 'Reaction Kinetics',
        xaxis: { title: 'Time (min)' },
        yaxis: { title: 'Value' }
    };

    Plotly.newPlot('plots', [plot1, plot2], layout);

    // Creating data table
    let table = `<tr><th>Time (min)</th><th>C_A (mol/L)</th><th>C_B (mol/L)</th><th>X_A</th><th>-ln(1-X_A)</th><th>X_A/(1-X_A)</th></tr>`;
    for (let i = 0; i < time_points.length; i++) {
        table += `<tr>
                    <td>${time_points[i]}</td>
                    <td>${C_A_list[i].toFixed(4)}</td>
                    <td>${C_B_list[i].toFixed(4)}</td>
                    <td>${X_A_list[i].toFixed(4)}</td>
                    <td>${ln_1_minus_XA[i].toFixed(4)}</td>
                    <td>${XA_over_1_minus_XA[i].toFixed(4)}</td>
                  </tr>`;
    }

    document.getElementById("resultsTable").innerHTML = table;
}
