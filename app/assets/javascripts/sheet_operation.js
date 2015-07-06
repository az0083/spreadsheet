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
          // TODO: set multiple cols select event here
          so.canvasTable.selectCol(cellNum.col);
        }
      } else if (cellNum.col === 0) { // select row
        // TODO: set multiple rows select event here
        so.canvasTable.selectRow(cellNum.row);
      } else { // select cell
        so.canvasTable.cellClicked(cellNum);
        // set binded handler for removing event listener
        so.bindedMousemoveHandler = so.mousemoveHandler.bind(so, cellNum);
        so.bindedMouseupHandler = so.mouseupHandler.bind(so, cellNum);
        _global.addEventListener('mouseup', so.bindedMouseupHandler, false);
        _global.addEventListener('mousemove', so.bindedMousemoveHandler, false);
      }
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

      so.canvasTable.setSelectedCells(_downCellNum, currentCellNum);
    },

    mousemoveHandler: function(_downCellNum, e) {
      var so = this;

      var currentCellNum = so.canvasTable.cellNumWithCoordinate({
        x: e.pageX,
        y: e.pageY
      });

      so.canvasTable.setSelectedCells(_downCellNum, currentCellNum);
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
