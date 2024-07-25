let studentData = [];
let undoStack = [];
let redoStack = [];

const calculateFee = () => {
  const studentName = document.getElementById('studentName').value;
  const hoursLate = parseFloat(document.getElementById('hoursLate').value) || 0;
  const minutesLate = parseFloat(document.getElementById('minutesLate').value) || 0;

  if (!studentName) {
    alert("Please don't forget to input the student's name. Thank you :)");
    return;
  }

  if ((!hoursLate && !minutesLate) || (hoursLate < 0 || minutesLate < 0) || (isNaN(hoursLate) && isNaN(minutesLate))) {
    alert("Please input a valid total time. Thank you :)");
    return;
  }

  const totalLateMinutes = (hoursLate * 60) + minutesLate;
  const feePerMinute = 10000 / 60;
  const totalFee = Math.round(totalLateMinutes * feePerMinute);
  const formattedTotalFee = new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(totalFee);

  undoStack.push([...studentData]);
  saveStacks();
  redoStack = [];

  studentData.push({ studentName, hoursLate, minutesLate, totalFee: formattedTotalFee });

  updateTable();
  saveData();
  
  document.getElementById('resultTable').classList.remove('hidden');
};

const updateTable = () => {
  const tableBody = document.getElementById('resultTable').getElementsByTagName('tbody')[0];
  tableBody.innerHTML = '';

  studentData.forEach((data, index) => {
    const row = tableBody.insertRow();
    row.insertCell(0).innerText = index + 1;
    row.insertCell(1).innerText = data.studentName;
    row.insertCell(2).innerText = data.hoursLate;
    row.insertCell(3).innerText = data.minutesLate;
    row.insertCell(4).innerText = data.totalFee;
  });
};

const downloadData = () => {
  const ws = XLSX.utils.json_to_sheet(studentData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Uang Denda Telat");

  XLSX.writeFile(wb, "UangDendaTelat.xlsx");
};

const clearData = () => {
  undoStack.push([...studentData]);
  saveStacks();
  redoStack = [];

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

  const storedUndoStack = localStorage.getItem('undoStack');
  if (storedUndoStack) {
    undoStack = JSON.parse(storedUndoStack);
  }

  const storedRedoStack = localStorage.getItem('redoStack');
  if (storedRedoStack) {
    redoStack = JSON.parse(storedRedoStack);
  }
}

const saveData = () => {
  localStorage.setItem('studentData', JSON.stringify(studentData));
}

const saveStacks = () => {
  localStorage.setItem('undoStack', JSON.stringify(undoStack));
  localStorage.setItem('redoStack', JSON.stringify(redoStack));
}

const undo = () => {
  if (undoStack.length > 0) {
    redoStack.push([...studentData]);
    studentData = undoStack.pop();
    updateTable();
    saveData();
    saveStacks();
  } else {
    alert("Sorry, there are no more actions to undo");
  }
}

const redo = () => {
  if (redoStack.length > 0) {
    undoStack.push([...studentData]);
    studentData = redoStack.pop();
    updateTable();
    saveData();
    saveStacks();
  } else {
    alert("Sorry, there are no more actions to redo");
  }
}

document.addEventListener('DOMContentLoaded', loadData);
