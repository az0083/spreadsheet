(function(_global) {
  'use strict';

  var SheetDataManager = function(_rowCount, _colCount) {
    this.rowBasedData = [];
    this.colBasedData = [];
    this.init(_rowCount, _colCount);
    return this;
  };

  SheetDataManager.prototype = {
    init: function(_rowCount, _colCount) {
      var sdm = this;
      sdm.rowBasedData = {};
      sdm.colBasedData = {};

      for (var row = 1; row <= _rowCount; row++) {
        var rowKey = 'row_' + row;
        sdm.rowBasedData[rowKey] = [];

        for (var col = 1; col <= _colCount; col++) {
          var cellData = CellData.initWithParams({
            rowNum: row,
            colNum: col,
            value: '',
            style: ''
          });

          sdm.rowBasedData[rowKey].push(cellData);
          var colKey = 'col_' + col;

          if (!sdm.colBasedData[colKey]) {
            sdm.colBasedData[colKey] = [];
          }

          sdm.colBasedData[colKey].push(sdm.rowBasedData[rowKey][col - 1]);
        }
      }
    },

    getCellValueRowBased: function(_cellNum) {
      var sdm = this;
      return sdm.rowBasedData['row_' + _cellNum.row][Number(_cellNum.col) - 1];
    },

    getCellValueColBased: function(_cellNum) {
      var sdm = this;
      return sdm.colBasedData['col_' + _cellNum.col][Number(_cellNum.row) - 1];
    },

    getCellValue: function(_cellNum) {
      var sdm = this;
      return sdm.getCellValueRowBased(_cellNum).value;
    },

    updateCellValue: function(_cellNum, _value) {
      var sdm = this;
      sdm.getCellValueRowBased(_cellNum).updateValue(_value);
    },

    updateCellStyle: function(_cellNum, _style) {
      var sdm = this;
      sdm.getCellValueRowBased(_cellNum).updateStyle(_style);
    },

    deleteCellValue: function(_cellNum) {
      var sdm = this;
      sdm.getCellValueRowBased(_cellNum).updateValue('');
    },

    deleteCellStyle: function(_cellNum) {
      var sdm = this;
      sdm.getCellValueRowBased(_cellNum).updateStyle('');
    }
  };

  var CellData = function() {
    this.rowNum = null;
    this.colNum = null;
    this.value = null;
    this.style = null;
    return this;
  };

  CellData.initWithParams = function(_params) {
    var cellData = new CellData();
    cellData.rowNum = _params.rowNum;
    cellData.colNum = _params.colNum;
    cellData.value = _params.value || '';
    cellData.style = _params.style || '';
    return cellData;
  };

  CellData.prototype = {
    updateValue: function(_val) {
      this.value = _val || '';
    },

    updateStyle: function(_style) {
      this.style = _style || '';
    }
  };

  _global.SheetDataManager = SheetDataManager;
})(window);
