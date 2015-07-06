(function(_global, _d) {
  'use strict';
  var CanvasTable = function(_dCanvasContainer, _dCurrent, _dSelected) {
    this.canvas = null;
    this.cxt = null;
    this.rowCount = 0;
    this.colCount = 0;
    this.dSelected = _dSelected;
    this.dCurrent = _dCurrent;
    this.init(_dCanvasContainer);
    return this;
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
    },

    setCurrentCell: function(_cellNum) {
      var ct = this;
      var cellX = ct.cellX(_cellNum.col);
      var cellY = ct.cellY(_cellNum.row);
      ct.dCurrent.style.left = cellX - 1 + 'px';
      ct.dCurrent.style.top = cellY - 1 + 'px';
      ct.dCurrent.style.width = CanvasTable.CELL_WIDTH - 1 + 'px';
      ct.dCurrent.style.height = CanvasTable.CELL_HEIGHT - 1 + 'px';
      ct.dCurrent.style.display = 'block';
      ct.dCurrent.dataset.row = _cellNum.row;
      ct.dCurrent.dataset.col = _cellNum.col;
    },

    setSelectedCells: function(_startCellNum, _endCellNum) {
      var ct = this;

      if (_startCellNum.row === _endCellNum.row && _startCellNum.col === _endCellNum.col) {
        ct.clearSelectedCells();
        return false;
      }

      var leftTopCellNum = {
        row: (_startCellNum.row > _endCellNum.row ? _endCellNum.row : _startCellNum.row),
        col: (_startCellNum.col > _endCellNum.col ? _endCellNum.col : _startCellNum.col)
      };

      var rightBottomCellNum = {
        row: (_endCellNum.row > _startCellNum.row ? _endCellNum.row : _startCellNum.row),
        col: (_endCellNum.col > _startCellNum.col ? _endCellNum.col : _startCellNum.col)
      };

      var startPoint = {
        x: ct.cellX(leftTopCellNum.col),
        y: ct.cellY(leftTopCellNum.row)
      };

      var endPoint = {
        x: ct.cellX(rightBottomCellNum.col) + CanvasTable.CELL_WIDTH,
        y: ct.cellY(rightBottomCellNum.row) + CanvasTable.CELL_HEIGHT
      };

      ct.dSelected.style.left = startPoint.x + 'px';
      ct.dSelected.style.top = startPoint.y + 'px';
      ct.dSelected.style.width = endPoint.x - startPoint.x + 'px';
      ct.dSelected.style.height = endPoint.y - startPoint.y + 'px';
      ct.dSelected.style.display = 'block';
    },

    clearSelectedCells: function() {
      var ct = this;
      ct.dSelected.style.display = 'none';
    },

    selectRow: function(_rowNum) {
      var ct = this;
      // TODO: select row num here
      ct.setCurrentCell({
        row: _rowNum,
        col: 1
      });
      ct.setSelectedCells({
        row: _rowNum,
        col: 1
      }, {
        row: _rowNum,
        col: ct.colCount
      });
    },

    selectCol: function(_colNum) {
      var ct = this;
      // TODO: select col num here
      ct.setCurrentCell({
        row: 1,
        col: _colNum
      });
      ct.setSelectedCells({
        row: 1,
        col: _colNum
      }, {
        row: ct.rowCount,
        col: _colNum
      });
    },

    cellClicked: function(_cellNum) {
      var ct = this;
      ct.clearSelectedCells();
      ct.setCurrentCell(_cellNum);
    },

    selectAllCells: function() {
      var ct = this;
      ct.setCurrentCell({
        row: 1,
        col: 1
      });
      ct.setSelectedCells({
        row: 1,
        col: 1
      }, {
        row: ct.rowCount,
        col: ct.colCount
      });
    },

    currentVMove: function(_offset) {
      var ct = this;
      if (!ct.isCurrentShown()) {
        return false;
      }

      ct.clearSelectedCells();

      if (_offset < 0 && ct.isCurrentInRow(1) || _offset > 0 && ct.isCurrentInRow(ct.rowCount) || _offset === 0) {
        return false;
      }

      ct.dCurrent.style.top = ct.dCurrent.offsetTop + CanvasTable.CELL_HEIGHT * _offset + 'px';
      ct.dCurrent.dataset.row = Number(ct.dCurrent.dataset.row) + _offset;
    },

    currentHMove: function(_offset) {
      var ct = this;
      if (!ct.isCurrentShown()) {
        return false;
      }

      ct.clearSelectedCells();

      if (_offset < 0 && ct.isCurrentInCol(1) || _offset > 0 && ct.isCurrentInCol(ct.colCount) || _offset === 0) {
        return false;
      }

      ct.dCurrent.style.left = ct.dCurrent.offsetLeft + CanvasTable.CELL_WIDTH * _offset + 'px';
      ct.dCurrent.dataset.col = Number(ct.dCurrent.dataset.col) + _offset;
    },

    isCurrentShown: function() {
      var ct = this;
      return ct.dCurrent.style.display === 'block';
    },

    isCurrentInRow: function(_rowNum) {
      var ct = this;
      return ct.dCurrent.dataset.row === _rowNum.toString();
    },

    isCurrentInCol: function(_colNum) {
      var ct = this;
      return ct.dCurrent.dataset.col === _colNum.toString();
    }
  };

  _global.CanvasTable = CanvasTable;
})(window, document);
