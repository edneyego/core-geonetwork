(function () {
  goog.provide('gn_owscontext_directive');

  var module = angular.module('gn_owscontext_directive', []);

  function readAsText(f, callback) {
    try {
      var reader = new FileReader();
      reader.readAsText(f);
      reader.onload = function(e) {
        if (e.target && e.target.result) {
          callback(e.target.result);
        } else {
          console.error("File could not be loaded");
        }
      };
      reader.onerror = function(e) {
        console.error("File could not be read");
      };
    } catch (e) {
      console.error("File could not be read");
    }
  }

  /**
   * @ngdoc directive
   * @name gn_owscontext_directive.directive:gnOwsContext
   *
   * @description
   * Panel to load or export an OWS Context
   */
  module.directive('gnOwsContext', [
    'gnViewerSettings',
    'gnOwsContextService',
    function (gnViewerSettings, gnOwsContextService) {
      return {
        restrict: 'A',
        templateUrl: '../../catalog/components/viewer/owscontext/' +
          'partials/owscontext.html',
        scope: {
          map: '='
        },
        link: function(scope, element, attrs) {
          scope.save = function($event) {
            var xml = gnOwsContextService.writeContext(scope.map);

            var str = new XMLSerializer().serializeToString(xml);
            var base64 = base64EncArr(strToUTF8Arr(str));
            $($event.target).attr('href', 'data:xml;base64,' + base64);
          };

          var fileInput = element.find('input[type="file"]')[0];
          element.find('.import').click(function() {
            fileInput.click();
          });

          scope.importOwc = function() {
            if (fileInput.files.length > 0) {
              readAsText(fileInput.files[0], function(text) {
                gnOwsContextService.loadContext(text, scope.map);
              });
            }
          };

          // load context from url
          if (gnViewerSettings.owsContext) {
            gnOwsContextService.loadContextFromUrl(gnViewerSettings.owsContext,
              scope.map);
          }
        }
      };
    }
  ]);
})();