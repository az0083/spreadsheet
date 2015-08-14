/* global KEY_MAP: false, SETTINGS: false */
(function(_global, KEY_MAP, SETTINGS) {
  'use strict';

  var MODE = {
    SELECT: 's',
    INPUT: 'i',
    EDIT: 'e'
  };

  var SheetOperation = function(_canvasTable) {
    this.canvasTable = _canvasTable;
    this.init();
    this.mode = MODE.SELECT;
    return this;
  };

  SheetOperation.prototype = {
    init: function() {
      var so = this;
      so.canvasTable.canvas.addEventListener('mousedown', so.mousedownHandler.bind(so), false);
      so.canvasTable.dCurrent.addEventListener('dblclick', so.dblclickHandler.bind(so), false);
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
          so.setEventsWithDownCellNum(cellNum);
          so.canvasTable.selectCols(cellNum.col, cellNum.col);
        }
      } else if (cellNum.col === 0) { // select row
        so.setEventsWithDownCellNum(cellNum);
        so.canvasTable.selectRows(cellNum.row, cellNum.row);
      } else { // select cell
        so.canvasTable.cellClicked(cellNum);
        // set binded handler for removing event listener
        so.setEventsWithDownCellNum(cellNum);
      }
    },

    dblclickHandler: function() {
      var so = this;
      so.changeToEditMode();
    },

    setEventsWithDownCellNum: function(_downCellNum) {
      var so = this;
      if (so.bindedDoubleClickHandler) {
        _global.removeEventListener('dblclick', so.bindedDoubleClickHandler, false);
      }
      so.bindedMousemoveHandler = so.mousemoveHandler.bind(so, _downCellNum);
      so.bindedMouseupHandler = so.mouseupHandler.bind(so, _downCellNum);
      so.bindedDoubleClickHandler = so.doubleClickHandler.bind(so);
      _global.addEventListener('mouseup', so.bindedMouseupHandler, false);
      _global.addEventListener('mousemove', so.bindedMousemoveHandler, false);
      _global.addEventListener('dblclick', so.bindedDoubleClickHandler, false);
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

    doubleClickHandler: function(e) {
      var so = this;

      var currentCellNum = so.canvasTable.cellNumWithCoordinate({
        x: e.pageX,
        y: e.pageY
      });

      if (currentCellNum.row === 0 || currentCellNum.col === 0) {
        return false;
      }

      if (currentCellNum.row === Number(so.canvasTable.dCurrent.dataset.row) &&
          currentCellNum.col === Number(so.canvasTable.dCurrent.dataset.col)) {
        so.canvasTable.showInputContainer();
      }
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

      if (so.isEditMode()) {
        so.editModeKeyHandler(e);
      } else if (so.isInputMode()) {
        so.inputModeKeyHandler(e);
      } else {
        so.selectModeKeyHandler(e);
      }
    },

    selectModeKeyHandler: function(e) {
      var so = this;
      switch (e.keyCode) {
        case KEY_MAP.ESC:
          return false;
        case KEY_MAP.UP:
          so.canvasTable.currentVMove(-1);
          break;
        case KEY_MAP.DOWN:
          so.canvasTable.currentVMove(1);
          break;
        case KEY_MAP.LEFT:
          so.canvasTable.currentHMove(-1);
          break;
        case KEY_MAP.RIGHT:
          so.canvasTable.currentHMove(1);
          break;
        default:
          // activate input elem
          so.changeToInputMode();
          break;
      }
    },

    inputModeKeyHandler: function(e) {
      var so = this;
      switch (e.keyCode) {
        case KEY_MAP.ESC:
          so.changeToSelectMode(SETTINGS.NOT_SAVE_DATA);
          break;
        case KEY_MAP.UP:
          so.changeToSelectMode(SETTINGS.SAVE_DATA);
          so.canvasTable.currentVMove(-1);
          break;
        case KEY_MAP.DOWN:
          so.changeToSelectMode(SETTINGS.SAVE_DATA);
          so.canvasTable.currentVMove(1);
          break;
        case KEY_MAP.LEFT:
          so.changeToSelectMode(SETTINGS.SAVE_DATA);
          so.canvasTable.currentHMove(-1);
          break;
        case KEY_MAP.RIGHT:
          so.changeToSelectMode(SETTINGS.SAVE_DATA);
          so.canvasTable.currentHMove(1);
          break;
        default:
          break;
      }
    },

    editModeKeyHandler: function(e) {
      var so = this;
      switch (e.keyCode) {
        case KEY_MAP.ESC:
          so.changeToSelectMode(SETTINGS.NOT_SAVE_DATA);
          break;
        default:
          break;
      }
    },

    changeToSelectMode: function(_willSaveData) {
      var so = this;
      so.canvasTable.hideInputContainer(_willSaveData);
      so.mode = MODE.SELECT;
    },

    changeToInputMode: function() {
      var so = this;
      so.canvasTable.showInputContainer();
      so.mode = MODE.INPUT;
    },

    changeToEditMode: function() {
      var so = this;
      so.canvasTable.showInputContainer();
      so.mode = MODE.EDIT;
    },

    isSelectMode: function() {
      var so = this;
      return so.mode === MODE.SELECT;
    },

    isInputMode: function() {
      var so = this;
      //return so.canvasTable.dInputContainer.style.display === 'block';
      return so.mode === MODE.INPUT;
    },

    isEditMode: function() {
      var so = this;
      return so.mode === MODE.EDIT;
    }
  };

  _global.SheetOperation = SheetOperation;
})(window, KEY_MAP, SETTINGS);
