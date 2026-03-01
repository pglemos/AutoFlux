const xlsx = require('xlsx');
const workbook = xlsx.readFile('/Users/pedroguilherme/AutoGestao/Sistema de Gestão de Alta Performance.xlsx');
const base_oficial = workbook.Sheets['BASE_OFICIAL'];
const data = xlsx.utils.sheet_to_json(base_oficial, { header: 1 });
console.log("Headers:");
console.log(data[0]);
console.log("First row of data:");
console.log(data[1]);
