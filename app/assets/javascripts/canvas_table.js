(function($, _global, _d) {
  'use strict';

  var CanvasTable = function(_dCanvasContainer) {
    this.canvas = null;
    this.cxt = null;
    this.rowCount = 0;
    this.colCount = 0;
    this.init(_dCanvasContainer);
  };

  CanvasTable.CELL_WIDTH = 100;
  CanvasTable.CELL_HEIGHT = 20;
  CanvasTable.ROW_NUM_DISPLAY_WIDTH = 40;
  CanvasTable.COL_NUM_DISPLAY_HEIGHT = CanvasTable.CELL_HEIGHT;

  CanvasTable.prototype = {
    init: function(_dCanvasContainer) {
      var ct = this;
      ct.canvas = _d.createElement('canvas');
      ct.canvas.style.position = 'absolute';
      ct.canvas.style.top = 0;
      ct.canvas.style.left = 0;
      ct.canvas.width = _dCanvasContainer.offsetWidth;
      ct.canvas.height = _dCanvasContainer.offsetHeight;
      ct.cxt = ct.canvas.getContext('2d');
      _dCanvasContainer.appendChild(ct.canvas);
      ct.drawTable();
    },

    drawTable: function() {
      var ct = this;
      ct.cxt.translate(0.5, 0.5); // translate coordinates for drawing 1px line
      ct.cxt.lineWidth = 1;

      ct.cxt.beginPath();

      // draw frame
      ct.cxt.moveTo(0, 0);
      ct.cxt.lineTo(ct.canvas.width, 0);
      ct.cxt.lineTo(ct.canvas.width, ct.canvas.height);
      ct.cxt.lineTo(0, ct.canvas.height);
      ct.cxt.lineTo(0, 0);

      // draw horizontal line
      for (var currentY = CanvasTable.COL_NUM_DISPLAY_HEIGHT; currentY < ct.canvas.height; currentY += CanvasTable.CELL_HEIGHT) {
        ct.cxt.moveTo(0, currentY);
        ct.cxt.lineTo(ct.canvas.width, currentY);
        ct.rowCount++;
      }

      // draw vertical line
      for (var currentX = CanvasTable.ROW_NUM_DISPLAY_WIDTH; currentX < ct.canvas.width; currentX += CanvasTable.CELL_WIDTH) {
        ct.cxt.moveTo(currentX, 0);
        ct.cxt.lineTo(currentX, ct.canvas.height);
        ct.colCount++;
      }

      ct.cxt.stroke();
      ct.fillRowNumDisplay();
      ct.fillColNumDisplay();
      ct.cxt.closePath();
    },

    cellX: function(_targetCol) {
      return _targetCol < 1 ? 0 : CanvasTable.ROW_NUM_DISPLAY_WIDTH + CanvasTable.CELL_WIDTH * (_targetCol - 1);
    },

    cellY: function(_targetRow) {
      return _targetRow < 1 ? 0 : CanvasTable.COL_NUM_DISPLAY_HEIGHT + CanvasTable.CELL_HEIGHT * (_targetRow - 1);
    },

    cellCenterPoint: function(_targetRow, _targetCol) {
      var ct = this;
      return {
        x: ct.cellX(_targetCol) + (_targetCol < 1 ? CanvasTable.ROW_NUM_DISPLAY_WIDTH / 2 : CanvasTable.CELL_WIDTH / 2),
        y: ct.cellY(_targetRow) + (_targetRow < 1 ? CanvasTable.COL_NUM_DISPLAY_HEIGHT / 2 : CanvasTable.CELL_HEIGHT / 2)
      };
    },

    fillTextIntoCell: function(_targetRow, _targetCol, _text, _vAlign, _hAlign) {
      var ct = this;

      var cellCenter = ct.cellCenterPoint(_targetRow, _targetCol);
      ct.cxt.textBaseline = _vAlign || 'middle';
      ct.cxt.textAlign = _hAlign || 'center';
      ct.cxt.fillText(_text, cellCenter.x, cellCenter.y);
    },

    fillRowNumDisplay: function() {
      var ct = this;

      for (var row = 1; row <= ct.rowCount; row++) {
        ct.fillTextIntoCell(row, 0, row.toString());
      }
    },

    fillColNumDisplay: function() {
      var ct = this;

      for (var col = 1; col <= ct.colCount; col++) {
        ct.fillTextIntoCell(0, col, ct.aToZColNum(col));
      }
    },

    aToZColNum: function(_targetCol) {
      if (_targetCol < 1) {
        return '';
      }

      var letterACharCode = 'A'.charCodeAt(0);
      var aToZArr = [];
      var num = _targetCol;
      do {
        num--;
        aToZArr.unshift(String.fromCharCode(letterACharCode + (num % 26)));
        num = Math.floor(num / 26);
      } while(num > 0);

      return aToZArr.join('');
    },

    cellNumWithCoordinate: function(_coor) {
      var ct = this;
      var _coorInCanvas = {
        x: _coor.x - ct.canvas.getBoundingClientRect().left,
        y: _coor.y - ct.canvas.getBoundingClientRect().top
      };

      return {
        row: ct.cellYWithCoorY(_coorInCanvas.y),
        col: ct.cellXWithCoorX(_coorInCanvas.x)
      };
    },

    cellXWithCoorX: function(_coorX) {
      return Math.floor((_coorX - CanvasTable.ROW_NUM_DISPLAY_WIDTH) / CanvasTable.CELL_WIDTH) + 1;
    },

    cellYWithCoorY: function(_coorY) {
      return Math.floor((_coorY - CanvasTable.COL_NUM_DISPLAY_HEIGHT) / CanvasTable.CELL_HEIGHT) + 1;
    }
  };

  _global.CanvasTable = CanvasTable;
})(jQuery, window, document);
