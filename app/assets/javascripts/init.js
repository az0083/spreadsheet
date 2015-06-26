/* globals CanvasTable */
(function($, _global, _d) {
  'use strict';
  $(_global).load(function() {
    new CanvasTable(_d.getElementById('sheetContainer'));
  });
})(jQuery, window, document);
