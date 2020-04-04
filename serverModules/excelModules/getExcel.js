const excel = require('exceljs');

const getExcelActionById = (id) => new Promise((resolve) => {
  console.log('Begin Excel');
  const workBook = new excel.Workbook();
  workBook.created = new Date();
  workBook.modified = new Date();
  const workSheet = workBook.addWorksheet('Sheet 1');
  workSheet.addRow([3, 'test', new Date()]);
  workBook.xlsx.writeFile('./test.xlsx').then(() => {
    console.log('EXEL writed');
    resolve('EXEL writed');
  });
});

module.exports = { getExcelActionById };
