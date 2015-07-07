(function(_global) {
  'use strict';
  var SheetOperation = function(_canvasTable) {
    this.canvasTable = _canvasTable;
    this.init();
    return this;
  };

  SheetOperation.prototype = {
    init: function() {
      var so = this;
      so.canvasTable.canvas.addEventListener('mousedown', so.mousedownHandler.bind(so), false);
      _global.addEventListener('keydown', so.keydownHandler.bind(so), false);
    },

    mousedownHandler: function(e) {
      var so = this;
      var cellNum = so.canvasTable.cellNumWithCoordinate({
        x: e.pageX,
        y: e.pageY
      });

      if (cellNum.row === 0) {
        if (cellNum.col === 0) { // select all
          so.canvasTable.selectAllCells();
        } else { // select col
          so.setMouseDownAndUpEventWithDownCellNum(cellNum);
          so.canvasTable.selectCols(cellNum.col, cellNum.col);
        }
      } else if (cellNum.col === 0) { // select row
        so.setMouseDownAndUpEventWithDownCellNum(cellNum);
        so.canvasTable.selectRows(cellNum.row, cellNum.row);
      } else { // select cell
        so.canvasTable.cellClicked(cellNum);
        // set binded handler for removing event listener
        so.setMouseDownAndUpEventWithDownCellNum(cellNum);
      }
    },

    setMouseDownAndUpEventWithDownCellNum: function(_downCellNum) {
      var so = this;
      so.bindedMousemoveHandler = so.mousemoveHandler.bind(so, _downCellNum);
      so.bindedMouseupHandler = so.mouseupHandler.bind(so, _downCellNum);
      _global.addEventListener('mouseup', so.bindedMouseupHandler, false);
      _global.addEventListener('mousemove', so.bindedMousemoveHandler, false);
    },

    mouseupHandler: function(_downCellNum, e) {
      var so = this;

      _global.removeEventListener('mousemove', so.bindedMousemoveHandler, false);
      _global.removeEventListener('mouseup', so.bindedMouseupHandler, false);
      so.bindedMousemoveHandler = null;
      so.bindedMouseupHandler = null;

      var currentCellNum = so.canvasTable.cellNumWithCoordinate({
        x: e.pageX,
        y: e.pageY
      });

      so.selectOperationWithDownAndCurrentCellNums(_downCellNum, currentCellNum);
    },

    mousemoveHandler: function(_downCellNum, e) {
      var so = this;

      var currentCellNum = so.canvasTable.cellNumWithCoordinate({
        x: e.pageX,
        y: e.pageY
      });

      so.selectOperationWithDownAndCurrentCellNums(_downCellNum, currentCellNum);
    },

    selectOperationWithDownAndCurrentCellNums: function(_downCellNum, _currentCellNum) {
      var so = this;

      if (_downCellNum.row === 0) { // mouse down at col num
        so.canvasTable.selectCols(_downCellNum.col, _currentCellNum.col);
      } else if (_downCellNum.col === 0) { // mouse down at row num
        so.canvasTable.selectRows(_downCellNum.row, _currentCellNum.row);
      } else { // mouse down at cell
        so.canvasTable.setSelectedCells(_downCellNum, _currentCellNum);
      }
    },

    keydownHandler: function(e) {
      var so = this;
      switch (e.keyCode) {
        // TODO: add model judgment
        case 38: // up
          so.canvasTable.currentVMove(-1);
          break;
        case 40: // down
          so.canvasTable.currentVMove(1);
          break;
        case 37: // left
          so.canvasTable.currentHMove(-1);
          break;
        case 39: // right
          so.canvasTable.currentHMove(1);
          break;
      }
    }
  };

  _global.SheetOperation = SheetOperation;
})(window);
