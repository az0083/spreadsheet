/* globals CanvasTable: true, SheetOperation: true */
(function($, _global) {
  'use strict';
  $(_global).load(function() {
    var canvasTable = new CanvasTable();
    new SheetOperation(canvasTable);
  });
})(jQuery, window);
