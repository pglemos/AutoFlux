const xlsx = require('xlsx');
const workbook = xlsx.readFile('/Users/pedroguilherme/AutoGestao/Sistema de Gestão de Alta Performance.xlsx');

console.log("Sheet names:");
console.log(workbook.SheetNames);

const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(firstSheet, { header: 1 });
console.log("First sheet preview (first 10 rows):");
console.log(data.slice(0, 10));
