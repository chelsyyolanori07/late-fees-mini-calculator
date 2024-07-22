let studentData = [];

const calculateFee = () => {
  const studentName = document.getElementById('studentName').value;
  const hoursLate = parseFloat(document.getElementById('hoursLate').value) || 0;
  const minutesLate = parseFloat(document.getElementById('minutesLate').value) || 0;

  if (!studentName) {
    alert("Please don't forget to enter your student name :)");
    return;
  }

  if ((!hoursLate && !minutesLate) || (hoursLate < 0 || minutesLate < 0) || (isNaN(hoursLate) && isNaN(minutesLate))) {
    alert("Please enter a valid number of hours and/or minutes :)");
    return;
  }

  const hoursLateFloat = parseFloat(hoursLate) || 0;
  const minutesLateFloat = parseFloat(minutesLate) || 0;

  const totalLateMinutes = (hoursLate * 60) + minutesLate;
  const feePerMinute = 10000 / 60;
  const totalFee = Math.round(totalLateMinutes * feePerMinute);
  const formattedTotalFee = new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(totalFee);

  studentData.push({ studentName, hoursLate: hoursLateFloat, minutesLate: minutesLateFloat, totalFee: formattedTotalFee });

  updateTable();
  saveData();

  document.getElementById('resultTable').classList.remove('hidden');
};

const updateTable = () => {
  const tableBody = document.getElementById('resultTable').getElementsByTagName('tbody')[0];
  tableBody.innerHTML = '';

  studentData.forEach(data => {
    const row = tableBody.insertRow();
    row.insertCell(0).innerText = data.studentName;
    row.insertCell(1).innerText = data.hoursLate;
    row.insertCell(2).innerText = data.minutesLate;
    row.insertCell(3).innerText = data.totalFee;
  });
};

const downloadData = () => {
  const ws = XLSX.utils.json_to_sheet(studentData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Late Fees");

  XLSX.writeFile(wb, "LateFees.xlsx");
};

const clearData = () => {
  studentData = [];
  document.getElementById('studentName').value = '';
  document.getElementById('hoursLate').value = '';
  document.getElementById('minutesLate').value = '';
  updateTable();
  localStorage.removeItem('studentData');
  document.getElementById('resultTable').classList.add('hidden');
};

const loadData = () => {
  const storedData = localStorage.getItem('studentData');
  if (storedData) {
    studentData = JSON.parse(storedData);
    updateTable();
    document.getElementById('resultTable').classList.remove('hidden');
  }
}

const saveData = () => {
  localStorage.setItem('studentData', JSON.stringify(studentData));
}

document.addEventListener('DOMContentLoaded', loadData);


