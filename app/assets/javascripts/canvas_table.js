(function(_global, _d) {
  'use strict';
  var CanvasTable = function() {
    this.canvas = null;
    this.cxt = null;
    this.rowCount = 0;
    this.colCount = 0;
    this.dSelected = null;
    this.dCurrent = null;
    this.dNumberSelected = null;
    this.dInputContainer = null;
    this.dInputElem = null;
    this.init();
    return this;
  };

  CanvasTable.BORDER_WIDTH = 1;
  CanvasTable.CELL_WIDTH = 100;
  CanvasTable.CELL_HEIGHT = 20;
  CanvasTable.ROW_NUM_DISPLAY_WIDTH = 40;
  CanvasTable.COL_NUM_DISPLAY_HEIGHT = CanvasTable.CELL_HEIGHT;

  CanvasTable.prototype = {
    init: function() {
      var ct = this;
      ct.dSelected = _d.getElementById('selected');
      ct.dCurrent = _d.getElementById('current');
      ct.dNumberSelected = _d.getElementById('numberSelected');
      ct.dInputContainer = _d.getElementById('inputContainer');
      ct.dInputElem = _d.createElement('div');
      ct.dInputElem.contentEditable = true;
      ct.dInputElem.tabIndex = 0;
      ct.dInputContainer.appendChild(ct.dInputElem);

      // init canvas and draw table in canvas
      var dCanvasContainer = _d.getElementById('sheetContainer');
      ct.canvas = _d.createElement('canvas');
      ct.canvas.style.position = 'absolute';
      ct.canvas.style.top = 0;
      ct.canvas.style.left = 0;
      ct.canvas.width = dCanvasContainer.offsetWidth;
      ct.canvas.height = dCanvasContainer.offsetHeight;
      ct.cxt = ct.canvas.getContext('2d');
      dCanvasContainer.appendChild(ct.canvas);
      ct.drawTable();
    },

    drawTable: function() {
      var ct = this;
      ct.cxt.translate(0.5, 0.5); // translate coordinates for drawing 1px line
      ct.cxt.lineWidth = CanvasTable.BORDER_WIDTH;
      ct.cxt.font = '14px arial, sans-serif';

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

      ct.clearTextInCell(_targetRow, _targetCol);
      var cellCenter = ct.cellCenterPoint(_targetRow, _targetCol);
      ct.cxt.textBaseline = _vAlign || 'middle';
      ct.cxt.textAlign = _hAlign || 'center';
      ct.cxt.fillText(_text, cellCenter.x, cellCenter.y);
    },

    clearTextInCell: function(_targetRow, _targetCol) {
      var ct = this;
      var cellX = ct.cellX(_targetCol) + CanvasTable.BORDER_WIDTH;
      var cellY = ct.cellY(_targetRow) + CanvasTable.BORDER_WIDTH;
      var cellWidth = (_targetCol < 1 ? CanvasTable.ROW_NUM_DISPLAY_WIDTH : CanvasTable.CELL_WIDTH) - CanvasTable.BORDER_WIDTH * 2;
      var cellHeight = (_targetRow < 1 ? CanvasTable.COL_NUM_DISPLAY_HEIGHT : CanvasTable.CELL_HEIGHT) - CanvasTable.BORDER_WIDTH * 2;
      ct.cxt.clearRect(cellX, cellY, cellWidth, cellHeight);
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
      var cellX = ct.cellX(_cellNum.col < 1 ? 1 : _cellNum.col);
      var cellY = ct.cellY(_cellNum.row < 1 ? 1 : _cellNum.row);
      ct.dCurrent.style.left = cellX - CanvasTable.BORDER_WIDTH + 'px';
      ct.dCurrent.style.top = cellY - CanvasTable.BORDER_WIDTH + 'px';
      ct.dCurrent.style.width = CanvasTable.CELL_WIDTH - CanvasTable.BORDER_WIDTH + 'px';
      ct.dCurrent.style.height = CanvasTable.CELL_HEIGHT - CanvasTable.BORDER_WIDTH + 'px';
      ct.dCurrent.style.display = 'block';
      ct.dCurrent.dataset.row = _cellNum.row;
      ct.dCurrent.dataset.col = _cellNum.col;
    },

    setSelectedCells: function(_startCellNum, _endCellNum) {
      var ct = this;

      if (_startCellNum.row === _endCellNum.row && _startCellNum.col === _endCellNum.col) {
        ct.clearAllDisplayElems();
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

      leftTopCellNum.row = leftTopCellNum.row < 1 ? 1 : leftTopCellNum.row;
      leftTopCellNum.col = leftTopCellNum.col < 1 ? 1 : leftTopCellNum.col;
      rightBottomCellNum.row = rightBottomCellNum.row < 1 ? 1 : rightBottomCellNum.row;
      rightBottomCellNum.col = rightBottomCellNum.col < 1 ? 1 : rightBottomCellNum.col;

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

    setSelectedNumbers: function(_numberType, _start, _end) {
      var ct = this;

      switch(_numberType) {
        case 'row':
          ct.dNumberSelected.style.left = '0px';
          ct.dNumberSelected.style.top = ct.cellY(Math.min(_start, _end)) + 'px';
          ct.dNumberSelected.style.width = CanvasTable.ROW_NUM_DISPLAY_WIDTH + 'px';
          ct.dNumberSelected.style.height = (Math.abs(_end - _start) + 1) * CanvasTable.CELL_HEIGHT + 'px';
          ct.dNumberSelected.style.display = 'block';
          break;
        case 'col':
          ct.dNumberSelected.style.left = ct.cellX(Math.min(_start, _end)) + 'px';
          ct.dNumberSelected.style.top = '0px';
          ct.dNumberSelected.style.width = (Math.abs(_end - _start) + 1) * CanvasTable.CELL_WIDTH + 'px';
          ct.dNumberSelected.style.height = CanvasTable.COL_NUM_DISPLAY_HEIGHT + 'px';
          ct.dNumberSelected.style.display = 'block';
          break;
        default:
          ct.hideNumberSelected();
          break;
      }
    },

    clearAllDisplayElems: function() {
      var ct = this;
      ct.hideSelected();
      ct.hideNumberSelected();
      ct.hideInputContainer();
    },

    hideSelected: function() {
      var ct = this;
      ct.dSelected.style.display = 'none';
    },

    hideNumberSelected: function() {
      var ct = this;
      ct.dNumberSelected.style.display = 'none';
    },

    selectRows: function(_startRowNum, _endRowNum) {
      var ct = this;
      ct.clearAllDisplayElems();
      ct.setSelectedNumbers('row', _startRowNum, _endRowNum);
      ct.setCurrentCell({
        row: _startRowNum,
        col: 1
      });
      ct.setSelectedCells({
        row: _startRowNum,
        col: 1
      }, {
        row: _endRowNum,
        col: ct.colCount
      });
    },

    selectCols: function(_startColNum, _endColNum) {
      var ct = this;
      ct.clearAllDisplayElems();
      ct.setSelectedNumbers('col', _startColNum, _endColNum);
      ct.setCurrentCell({
        row: 1,
        col: _startColNum
      });
      ct.setSelectedCells({
        row: 1,
        col: _startColNum
      }, {
        row: ct.rowCount,
        col: _endColNum
      });
    },

    cellClicked: function(_cellNum) {
      var ct = this;
      ct.clearAllDisplayElems();
      ct.setCurrentCell(_cellNum);
    },

    selectAllCells: function() {
      var ct = this;
      ct.clearAllDisplayElems();
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

      ct.clearAllDisplayElems();

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

      ct.clearAllDisplayElems();

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
    },

    showInputContainer: function() {
      var ct = this;
      ct.dInputContainer.style.cssText = ct.dCurrent.style.cssText;
      ct.dInputElem.focus();
    },

    hideInputContainer: function() {
      var ct = this;
      ct.dInputContainer.style.display = 'none';
      ct.fillTextIntoCell(ct.dCurrent.dataset.row, ct.dCurrent.dataset.col, ct.dInputElem.innerHTML);
      ct.clearInputElem();
    },

    clearInputElem: function() {
      var ct = this;
      ct.dInputElem.innerHTML = '';
    }
  };

  _global.CanvasTable = CanvasTable;
})(window, document);
