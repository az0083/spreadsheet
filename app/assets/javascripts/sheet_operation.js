/* globals CanvasTable: true */
(function($, _global, CanvasTable) {
  'use strict';
  var SheetOperation = function(_canvasTable, _dCurrent, _dSelected) {
    this.canvasTable = _canvasTable;
    this.dSelected = _dSelected;
    this.dCurrent = _dCurrent;
    this.init();
  };

  SheetOperation.prototype = {
    init: function() {
      this.canvasTable.canvas.addEventListener('click', this.clickHandler.bind(this), false);
    },

    clickHandler: function(e) {
      var so = this;
      var cellNum = so.canvasTable.cellNumWithCoordinate({
        x: e.pageX,// - this.canvasTable.canvas.getBoundingClientRect().left,
        y: e.pageY// - this.canvasTable.canvas.getBoundingClientRect().top
      });

      if (cellNum.row === 0) {
        if (cellNum.col === 0) {
          so.selectAllCells();
        } else {
          so.selectCol(cellNum.col);
        }
      } else if (cellNum.col === 0) {
        so.selectRow(cellNum.row);
      } else {
        so.cellClicked(cellNum);
      }
    },

    setCurrentCell: function(_cellNum) {
      var cellX = this.canvasTable.cellX(_cellNum.col);
      var cellY = this.canvasTable.cellY(_cellNum.row);
      this.dCurrent.style.left = cellX - 1 + 'px';
      this.dCurrent.style.top = cellY - 1 + 'px';
      this.dCurrent.style.width = CanvasTable.CELL_WIDTH - 1 + 'px';
      this.dCurrent.style.height = CanvasTable.CELL_HEIGHT - 1 + 'px';
      this.dCurrent.style.display = 'block';
    },

    setSelectedCells: function(_startCellNum, _endCellNum) {
      var leftTopCellNum = {
        row: (_startCellNum.row > _endCellNum.row ? _endCellNum.row : _startCellNum.row),
        col: (_startCellNum.col > _endCellNum.col ? _endCellNum.col : _startCellNum.col)
      };

      var rightBottomCellNum = {
        row: (_endCellNum.row > _startCellNum.row ? _endCellNum.row : _startCellNum.row),
        col: (_endCellNum.col > _startCellNum.col ? _endCellNum.col : _startCellNum.col)
      };

      var startPoint = {
        x: this.canvasTable.cellX(leftTopCellNum.col),
        y: this.canvasTable.cellY(leftTopCellNum.row)
      };

      var endPoint = {
        x: this.canvasTable.cellX(rightBottomCellNum.col) + CanvasTable.CELL_WIDTH,
        y: this.canvasTable.cellY(rightBottomCellNum.row) + CanvasTable.CELL_HEIGHT
      };

      this.dSelected.style.left = startPoint.x + 'px';
      this.dSelected.style.top = startPoint.y + 'px';
      this.dSelected.style.width = endPoint.x - startPoint.x + 'px';
      this.dSelected.style.height = endPoint.y - startPoint.y + 'px';
      this.dSelected.style.display = 'block';
    },

    clearSelectedCells: function() {
      this.dSelected.style.display = 'none';
    },

    selectRow: function(_rowNum) {
      // TODO: selected row num here
      this.setCurrentCell({
        row: _rowNum,
        col: 1
      });
      this.setSelectedCells({
        row: _rowNum,
        col: 1
      }, {
        row: _rowNum,
        col: this.canvasTable.colCount
      });
    },

    selectCol: function(_colNum) {
      // TODO: selected col num here
      this.setCurrentCell({
        row: 1,
        col: _colNum
      });
      this.setSelectedCells({
        row: 1,
        col: _colNum
      }, {
        row: this.canvasTable.rowCount,
        col: _colNum
      });
    },

    cellClicked: function(_cellNum) {
      this.clearSelectedCells();
      this.setCurrentCell(_cellNum);
    },

    selectAllCells: function() {
      this.setCurrentCell({
        row: 1,
        col: 1
      });
      this.setSelectedCells({
        row: 1,
        col: 1
      }, {
        row: this.canvasTable.rowCount,
        col: this.canvasTable.colCount
      });
    }
  };

  _global.SheetOperation = SheetOperation;
})(jQuery, window, CanvasTable);
