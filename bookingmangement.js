const trips = [
  { date: "11/07/2023 05:00PM", pickup: "Ikeja", destination: "Ikoyi", duration: "45 Mins", amount: "₦950.00", status: "Failed" },
  { date: "11/07/2023 05:00PM", pickup: "Ikeja", destination: "Ikoyi", duration: "45 Mins", amount: "₦950.00", status: "Failed" },
  { date: "11/07/2023 05:00PM", pickup: "Ikeja", destination: "Ikoyi", duration: "45 Mins", amount: "₦950.00", status: "Failed" },
  { date: "11/07/2023 05:00PM", pickup: "Ikeja", destination: "Ikoyi", duration: "45 Mins", amount: "₦950.00", status: "Failed" },
  { date: "11/07/2023 05:00PM", pickup: "Ikeja", destination: "Ikoyi", duration: "45 Mins", amount: "₦950.00", status: "Failed" },
  { date: "11/07/2023 05:00PM", pickup: "Ikeja", destination: "Ikoyi", duration: "45 Mins", amount: "₦950.00", status: "Pending" }
];

function renderTable(rows = 10) {
  const tbody = document.getElementById("trip-table-body");
  tbody.innerHTML = "";
  trips.slice(0, rows).forEach(trip => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${trip.date}</td>
      <td>${trip.pickup}</td>
      <td>${trip.destination}</td>
      <td>${trip.duration}</td>
      <td>${trip.amount}</td>
      <td class="${trip.status === 'Failed' ? 'status-failed' : 'status-pending'}">${trip.status}</td>
    `;
    tbody.appendChild(tr);
  });
}

function updateRows() {
  const rows = parseInt(document.getElementById("rows").value);
  renderTable(rows);
}

window.onload = () => renderTable();