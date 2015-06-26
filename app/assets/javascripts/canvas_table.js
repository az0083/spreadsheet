(function($, _global, _d) {
  'use strict';
  var CELL_WIDTH = 100;
  var CELL_HEIGHT = 20;
  var ROW_NUM_DISPLAY_WIDTH = 40;
  var COL_NUM_DISPLAY_HEIGHT = CELL_HEIGHT;

  var CanvasTable = function(_dCanvasContainer) {
    this.canvas = null;
    this.cxt = null;
    this.rowCount = 0;
    this.colCount = 0;
    this.init(_dCanvasContainer);
  };

  CanvasTable.prototype = {
    init: function(_dCanvasContainer) {
      var _ct = this;
      _ct.canvas = _d.createElement('canvas');
      _ct.canvas.style.position = 'absolute';
      _ct.canvas.style.top = 0;
      _ct.canvas.style.left = 0;
      _ct.canvas.width = _dCanvasContainer.offsetWidth;
      _ct.canvas.height = _dCanvasContainer.offsetHeight;
      _ct.cxt = _ct.canvas.getContext('2d');
      _dCanvasContainer.appendChild(_ct.canvas);
      _ct.drawTable();
      _ct.fillRowNumDisplay();
      _ct.fillColNumDisplay();
    },

    drawTable: function() {
      var _ct = this;
      _ct.cxt.translate(0.5, 0.5); // translate coordinates for drawing 1px line
      _ct.cxt.lineWidth = 1;

      _ct.cxt.beginPath();

      // draw frame
      _ct.cxt.moveTo(0, 0);
      _ct.cxt.lineTo(_ct.canvas.width, 0);
      _ct.cxt.lineTo(_ct.canvas.width, _ct.canvas.height);
      _ct.cxt.lineTo(0, _ct.canvas.height);
      _ct.cxt.lineTo(0, 0);

      // draw horizontal line
      for (var currentY = COL_NUM_DISPLAY_HEIGHT; currentY < _ct.canvas.height; currentY += CELL_HEIGHT) {
        _ct.cxt.moveTo(0, currentY);
        _ct.cxt.lineTo(_ct.canvas.width, currentY);
        _ct.rowCount++;
      }

      // draw vertical line
      for (var currentX = ROW_NUM_DISPLAY_WIDTH; currentX < _ct.canvas.width; currentX += CELL_WIDTH) {
        _ct.cxt.moveTo(currentX, 0);
        _ct.cxt.lineTo(currentX, _ct.canvas.height);
        _ct.colCount++;
      }

      _ct.cxt.stroke();
    },

    cellX: function(_targetCol) {
      return _targetCol < 1 ? 0 : ROW_NUM_DISPLAY_WIDTH + CELL_WIDTH * (_targetCol - 1);
    },

    cellY: function(_targetRow) {
      return _targetRow < 1 ? 0 : COL_NUM_DISPLAY_HEIGHT + CELL_HEIGHT * (_targetRow - 1);
    },

    cellCenterPoint: function(_targetRow, _targetCol) {
      var _ct = this;
      return {
        x: _ct.cellX(_targetCol) + (_targetCol < 1 ? ROW_NUM_DISPLAY_WIDTH / 2 : CELL_WIDTH / 2),
        y: _ct.cellY(_targetRow) + (_targetRow < 1 ? COL_NUM_DISPLAY_HEIGHT / 2 : CELL_HEIGHT / 2)
      };
    },

    fillTextIntoCell: function(_targetRow, _targetCol, _text, _vAlign, _hAlign) {
      var _ct = this;

      var cellCenter = _ct.cellCenterPoint(_targetRow, _targetCol);
      _ct.cxt.textBaseline = _vAlign || 'middle';
      _ct.cxt.textAlign = _hAlign || 'center';
      _ct.cxt.fillText(_text, cellCenter.x, cellCenter.y);
    },

    fillRowNumDisplay: function() {
      var _ct = this;

      for (var row = 1; row <= _ct.rowCount; row++) {
        _ct.fillTextIntoCell(row, 0, row.toString());
      }
    },

    fillColNumDisplay: function() {
      var _ct = this;

      for (var col = 1; col <= _ct.colCount; col++) {
        _ct.fillTextIntoCell(0, col, _ct.colNum(col));
      }
    },

    colNum: function(_targetCol) {
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
    }
  };

  _global.CanvasTable = CanvasTable;
})(jQuery, window, document);
