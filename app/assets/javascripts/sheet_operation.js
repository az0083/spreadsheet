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
      so.canvasTable.canvas.addEventListener('click', so.clickHandler.bind(so), false);
      _global.addEventListener('keydown', so.keydownHandler.bind(so), false);
    },

    clickHandler: function(e) {
      var so = this;
      var cellNum = so.canvasTable.cellNumWithCoordinate({
        x: e.pageX,
        y: e.pageY
      });

      if (cellNum.row === 0) {
        if (cellNum.col === 0) {
          so.canvasTable.selectAllCells();
        } else {
          so.canvasTable.selectCol(cellNum.col);
        }
      } else if (cellNum.col === 0) {
        so.canvasTable.selectRow(cellNum.row);
      } else {
        so.canvasTable.cellClicked(cellNum);
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
