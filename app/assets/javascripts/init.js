/* globals CanvasTable: true, SheetOperation: true */
(function($, _global, _d) {
  'use strict';
  $(_global).load(function() {
    var canvasTable = new CanvasTable(_d.getElementById('sheetContainer'));
    new SheetOperation(canvasTable, _d.getElementById('current'), _d.getElementById('selected'));
  });
})(jQuery, window, document);
