const xlsx = require('xlsx');
const workbook = xlsx.readFile('/Users/pedroguilherme/AutoGestao/Sistema de Gestão de Alta Performance.xlsx');
const dash = workbook.Sheets['Dashboard Oficial'];
const data = xlsx.utils.sheet_to_json(dash, { header: 1 });
console.log("First 15 rows of Dashboard Oficial:");
console.log(data.slice(0, 15));
