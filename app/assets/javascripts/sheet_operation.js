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

    selectRow: function(_rowNum) {
      var cellX = this.canvasTable.cellX(1);
      var cellY = this.canvasTable.cellY(_rowNum);
      // TODO: set current cell and selected row num here
      this.dSelected.style.left = cellX + 'px';
      this.dSelected.style.top = cellY + 'px';
      this.dSelected.style.width = this.canvasTable.canvas.width - cellX + 'px';
      this.dSelected.style.height = CanvasTable.CELL_HEIGHT + 'px';
      this.dSelected.style.display = 'block';
    },

    selectCol: function(_colNum) {
      var cellX = this.canvasTable.cellX(_colNum);
      var cellY = this.canvasTable.cellY(1);
      // TODO: set current cell and selected col num here
      this.dSelected.style.left = cellX + 'px';
      this.dSelected.style.top = cellY + 'px';
      this.dSelected.style.width = CanvasTable.CELL_WIDTH + 'px';
      this.dSelected.style.height = this.canvasTable.canvas.height - cellY + 'px';
      this.dSelected.style.display = 'block';
    },

    cellClicked: function(_cellNum) {
      var cellX = this.canvasTable.cellX(_cellNum.col);
      var cellY = this.canvasTable.cellY(_cellNum.row);
      // TODO: set current cell
      this.dSelected.style.left = cellX + 'px';
      this.dSelected.style.top = cellY + 'px';
      this.dSelected.style.width = CanvasTable.CELL_WIDTH + 'px';
      this.dSelected.style.height = CanvasTable.CELL_HEIGHT + 'px';
      this.dSelected.style.display = 'block';
    },

    selectAllCells: function() {
      // TODO: set current cell here
      this.dSelected.style.left = CanvasTable.ROW_NUM_DISPLAY_WIDTH + 'px';
      this.dSelected.style.top = CanvasTable.COL_NUM_DISPLAY_HEIGHT + 'px';
      this.dSelected.style.width = this.canvasTable.canvas.width - CanvasTable.ROW_NUM_DISPLAY_WIDTH + 'px';
      this.dSelected.style.height = this.canvasTable.canvas.height - CanvasTable.COL_NUM_DISPLAY_HEIGHT + 'px';
      this.dSelected.style.display = 'block';
    },

  };

  _global.SheetOperation = SheetOperation;
})(jQuery, window, CanvasTable);
