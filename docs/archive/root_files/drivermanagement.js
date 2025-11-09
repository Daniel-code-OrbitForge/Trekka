const drivers = [
  { id: "TK23449001", name: "Sulaimon Abdullahi", phone: "+2349012309301", status: "Active" },
  { id: "TK23449001", name: "Sulaimon Abdullahi", phone: "+2349012309301", status: "Inactive" },
  { id: "TK23449001", name: "Sulaimon Abdullahi", phone: "+2349012309301", status: "Active" },
  { id: "TK23449001", name: "Sulaimon Abdullahi", phone: "+2349012309301", status: "Inactive" },
  { id: "TK23449001", name: "Sulaimon Abdullahi", phone: "+2349012309301", status: "Active" },
  { id: "TK23449001", name: "Sulaimon Abdullahi", phone: "+2349012309301", status: "Inactive" },
];

const tableBody = document.getElementById("driver-table");

function renderTable() {
  tableBody.innerHTML = "";
  drivers.forEach(driver => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${driver.id}</td>
      <td>${driver.name}</td>
      <td>${driver.phone}</td>
      <td>
        <span class="status-dot ${driver.status === 'Active' ? 'status-active' : 'status-inactive'}"></span>
        ${driver.status}
      </td>
    `;
    tableBody.appendChild(row);
  });
}

renderTable();