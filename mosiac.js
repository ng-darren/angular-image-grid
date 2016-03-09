/* angular-mosiac.js / v0.0.1 / (c) 2016Darren Ng / MIT Licence */

(function() {
  'use strict';

  angular.module('angular-mosaic', []);

  angular.module('angular-mosaic')
    .directive('photoSet', function ($window) {
    	function link (scope, element, attrs) {
        angular.element($window).bind('resize', function(){
          scope.rows = 0;
          scope.$digest();
          scope.rows = 1;
          scope.$digest();
        });

        scope.$watch('images', function(p) {
          if(p) {
            scope.rows = p.length / scope.perRow;
          } else {
            scope.rows = 0;
          }
        });

        scope.getRows = function(num) {
          if(num) {
            return new Array(num);
          }
        };
    	};

      return {
    		templateUrl: 'mosaic.html',
    		restrict: 'EA',
    		scope: {
    			images: '=',
          perRow: '='
    		},
    		link: link
      };
    });

  angular.module('angular-mosaic')
    .directive('imageonload', function () {
    	var photoSetInfo = [], ratios = [], sumRatioOffset = 0;

      var setupGallery = function (scope, element, attrs) {
        scope.photoSetInfo = [];

        element.bind('load', function() {
          var ratio = element[0].naturalWidth / element[0].naturalHeight;
          ratios.push(ratio);

          photoSetInfo.push({
            src: element[0].src,
            ratio: ratio,
            naturalHeight: element[0].naturalHeight,
            naturalWidth: element[0].naturalWidth,
            newHeight: 0,
            newWidth: 0
          });

          if(photoSetInfo.length % scope.perRow === 0) {
            var sumRatios = 0,
      				minRatio = Math.min.apply(Math, ratios);

            for (var i=sumRatioOffset; i<photoSetInfo.length; i++){
      				sumRatios += photoSetInfo[i].ratio;
            }

            var cWidth = angular.element(document.getElementsByClassName('photoset'))[0].clientWidth;
            var minWidth = cWidth / sumRatios;

            angular.forEach(photoSetInfo, function(p) {
              p.newHeight = minWidth-4;
      				p.newWidth = Math.floor(minWidth * p.ratio)-4;
            });

            sumRatioOffset = photoSetInfo.length;
            ratios = [];

            if(cWidth !== angular.element(document.getElementsByClassName('photoset'))[0].clientWidth && photoSetInfo.length === scope.images.length) {
              photoSetInfo = [];
            }
          }

          scope.$apply(function() {
            scope.photoSetInfo = photoSetInfo;
          });
        });

        element.bind('error', function(){
          console.log('image could not be loaded');
          photoSetInfo.push({});
        });
      };

      var getWidth = function(src) {
        var index = _.findIndex(photoSetInfo, function(p) { return p.src == src; });
        return photoSetInfo[index].newWidth;
      };

      return {
        template: '<div></div>',
        restrict: 'AE',
        link: setupGallery
      };
    });
  });
