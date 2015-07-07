/* globals CanvasTable: true, SheetOperation: true */
(function($, _global, _d) {
  'use strict';
  $(_global).load(function() {
    var canvasTable = new CanvasTable(
        _d.getElementById('sheetContainer'),
        _d.getElementById('current'),
        _d.getElementById('selected'),
        _d.getElementById('numberSelected')
        );
    new SheetOperation(canvasTable);
  });
})(jQuery, window, document);
