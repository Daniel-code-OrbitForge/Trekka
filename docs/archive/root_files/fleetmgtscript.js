// script.js
const fleetData = [
  { name: "Toyota Hiace", type: "Shuttle", capacity: 14, reg: "LND 457 YR", route: "Lagos-Ibadan", status: "Active" },
  { name: "Toyota Corolla", type: "Car", capacity: 4, reg: "KKY 384 DP", route: "Lagos-Ibadan", status: "Maintenance" },
  { name: "Toyota Corolla", type: "Car", capacity: 4, reg: "KKY 384 DP", route: "Lagos-Ibadan", status: "Maintenance" },
  { name: "Mercedes Sprinter", type: "Shuttle", capacity: 20, reg: "LND 457 YR", route: "Lagos-Abuja", status: "Active" },
  { name: "Mercedes Sprinter", type: "Shuttle", capacity: 20, reg: "LND 457 YR", route: "Abeokuta-Sango", status: "Active" },
  { name: "Mercedes Sprinter", type: "Shuttle", capacity: 20, reg: "LND 457 YR", route: "Abeokuta-Sango", status: "Active" },
  { name: "Toyota Corolla", type: "Car", capacity: 4, reg: "KKY 384 DP", route: "Abeokuta-Oshodi", status: "Maintenance" },
  { name: "Toyota Corolla", type: "Car", capacity: 4, reg: "LKY 250 FF", route: "Abeokuta-Oshodi", status: "Active" },
];

function renderFleetTable() {
  const tbody = document.getElementById("fleetTableBody");
  tbody.innerHTML = "";
  fleetData.forEach(vehicle => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${vehicle.name}</td>
      <td>${vehicle.type}</td>
      <td>${vehicle.capacity}</td>
      <td>${vehicle.reg}</td>
      <td>${vehicle.route}</td>
      <td><span class="${vehicle.status === 'Active' ? 'status-active' : 'status-maintenance'}">${vehicle.status}</span></td>
      <td><button class="edit-btn">Edit</button></td>
    `;
    tbody.appendChild(row);
  });
}

document.getElementById("vehicleForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("vehicleName").value;
  const type = document.getElementById("vehicleType").value;
  const capacity = document.getElementById("capacity").value;
  const reg = document.getElementById("regNumber").value;
  const route = document.getElementById("route").value;

  fleetData.push({ name, type, capacity, reg, route, status: "Active" });
  renderFleetTable();
  this.reset();
});

renderFleetTable();