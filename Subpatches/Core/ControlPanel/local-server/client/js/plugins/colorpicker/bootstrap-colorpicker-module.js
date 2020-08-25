'use strict';

angular.module('colorpicker.module', [])
    .factory('Helper', function () {
      return {
        closestSlider: function (elem) {
          var matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;
          if (matchesSelector.bind(elem)('I')) {
            return elem.parentNode;
          }
          return elem;
        },
        getOffset: function (elem, fixedPosition) {
          var
              x = 0,
              y = 0,
              scrollX = 0,
              scrollY = 0;
          while (elem && !isNaN(elem.offsetLeft) && !isNaN(elem.offsetTop)) {
            x += elem.offsetLeft;
            y += elem.offsetTop;
            if (!fixedPosition && elem.tagName === 'BODY') {
              scrollX += document.documentElement.scrollLeft || elem.scrollLeft;
              scrollY += document.documentElement.scrollTop || elem.scrollTop;
            } else {
              scrollX += elem.scrollLeft;
              scrollY += elem.scrollTop;
            }
            elem = elem.offsetParent;
          }
          return {
            top: y,
            left: x,
            scrollX: scrollX,
            scrollY: scrollY
          };
        },
        // a set of RE's that can match strings and generate color tuples. https://github.com/jquery/jquery-color/
        stringParsers: [
          {
            re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
            parse: function (execResult) {
              return [
                execResult[1],
                execResult[2],
                execResult[3],
                execResult[4]
              ];
            }
          },
          {
            re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
            parse: function (execResult) {
              return [
                2.55 * execResult[1],
                2.55 * execResult[2],
                2.55 * execResult[3],
                execResult[4]
              ];
            }
          },
          {
            re: /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
            parse: function (execResult) {
              return [
                parseInt(execResult[1], 16),
                parseInt(execResult[2], 16),
                parseInt(execResult[3], 16)
              ];
            }
          },

          {
            re: /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/,
            parse: function (execResult) {
              return [
                parseInt(execResult[1] + execResult[1], 16),
                parseInt(execResult[2] + execResult[2], 16),
                parseInt(execResult[3] + execResult[3], 16)
              ];
            }
          },



          // {
          //   re: /\w*/,
          //   parse: function (execResult){
          //     var carray = {
          //       "aqua": "#00ffff",
          //       "aliceblue": "#f0f8ff",
          //       "antiquewhite": "#faebd7",
          //       "black": "#000000",
          //       "blue": "#0000ff",
          //       "cyan": "#00ffff",
          //       "darkblue": "#00008b",
          //       "darkcyan": "#008b8b",
          //       "darkgreen": "#006400",
          //       "darkturquoise": "#00ced1",
          //       "deepskyblue": "#00bfff",
          //       "green": "#008000",
          //       "lime": "#00ff00",
          //       "mediumblue": "#0000cd",
          //       "mediumspringgreen": "#00fa9a",
          //       "navy": "#000080",
          //       "springgreen": "#00ff7f",
          //       "teal": "#008080",
          //       "midnightblue": "#191970",
          //       "dodgerblue": "#1e90ff",
          //       "lightseagreen": "#20b2aa",
          //       "forestgreen": "#228b22",
          //       "seagreen": "#2e8b57",
          //       "darkslategray": "#2f4f4f",
          //       "darkslategrey": "#2f4f4f",
          //       "limegreen": "#32cd32",
          //       "mediumseagreen": "#3cb371",
          //       "turquoise": "#40e0d0",
          //       "royalblue": "#4169e1",
          //       "steelblue": "#4682b4",
          //       "darkslateblue": "#483d8b",
          //       "mediumturquoise": "#48d1cc",
          //       "indigo": "#4b0082",
          //       "darkolivegreen": "#556b2f",
          //       "cadetblue": "#5f9ea0",
          //       "cornflowerblue": "#6495ed",
          //       "mediumaquamarine": "#66cdaa",
          //       "dimgray": "#696969",
          //       "dimgrey": "#696969",
          //       "slateblue": "#6a5acd",
          //       "olivedrab": "#6b8e23",
          //       "slategray": "#708090",
          //       "slategrey": "#708090",
          //       "lightslategray": "#778899",
          //       "lightslategrey": "#778899",
          //       "mediumslateblue": "#7b68ee",
          //       "lawngreen": "#7cfc00",
          //       "aquamarine": "#7fffd4",
          //       "chartreuse": "#7fff00",
          //       "gray": "#808080",
          //       "grey": "#808080",
          //       "maroon": "#800000",
          //       "olive": "#808000",
          //       "purple": "#800080",
          //       "lightskyblue": "#87cefa",
          //       "skyblue": "#87ceeb",
          //       "blueviolet": "#8a2be2",
          //       "darkmagenta": "#8b008b",
          //       "darkred": "#8b0000",
          //       "saddlebrown": "#8b4513",
          //       "darkseagreen": "#8fbc8f",
          //       "lightgreen": "#90ee90",
          //       "mediumpurple": "#9370db",
          //       "darkviolet": "#9400d3",
          //       "palegreen": "#98fb98",
          //       "darkorchid": "#9932cc",
          //       "yellowgreen": "#9acd32",
          //       "sienna": "#a0522d",
          //       "brown": "#a52a2a",
          //       "darkgray": "#a9a9a9",
          //       "darkgrey": "#a9a9a9",
          //       "greenyellow": "#adff2f",
          //       "lightblue": "#add8e6",
          //       "paleturquoise": "#afeeee",
          //       "lightsteelblue": "#b0c4de",
          //       "powderblue": "#b0e0e6",
          //       "firebrick": "#b22222",
          //       "darkgoldenrod": "#b8860b",
          //       "mediumorchid": "#ba55d3",
          //       "rosybrown": "#bc8f8f",
          //       "darkkhaki": "#bdb76b",
          //       "silver": "#c0c0c0",
          //       "mediumvioletred": "#c71585",
          //       "indianred": "#cd5c5c",
          //       "peru": "#cd853f",
          //       "chocolate": "#d2691e",
          //       "tan": "#d2b48c",
          //       "lightgray": "#d3d3d3",
          //       "lightgrey": "#d3d3d3",
          //       "thistle": "#d8bfd8",
          //       "goldenrod": "#daa520",
          //       "orchid": "#da70d6",
          //       "palevioletred": "#db7093",
          //       "crimson": "#dc143c",
          //       "gainsboro": "#dcdcdc",
          //       "plum": "#dda0dd",
          //       "burlywood": "#deb887",
          //       "lightcyan": "#e0ffff",
          //       "lavender": "#e6e6fa",
          //       "darksalmon": "#e9967a",
          //       "palegoldenrod": "#eee8aa",
          //       "violet": "#ee82ee",
          //       "azure": "#f0ffff",
          //       "honeydew": "#f0fff0",
          //       "khaki": "#f0e68c",
          //       "lightcoral": "#f08080",
          //       "sandybrown": "#f4a460",
          //       "beige": "#f5f5dc",
          //       "mintcream": "#f5fffa",
          //       "wheat": "#f5deb3",
          //       "whitesmoke": "#f5f5f5",
          //       "ghostwhite": "#f8f8ff",
          //       "lightgoldenrodyellow": "#fafad2",
          //       "linen": "#faf0e6",
          //       "salmon": "#fa8072",
          //       "oldlace": "#fdf5e6",
          //       "bisque": "#ffe4c4",
          //       "blanchedalmond": "#ffebcd",
          //       "coral": "#ff7f50",
          //       "cornsilk": "#fff8dc",
          //       "darkorange": "#ff8c00",
          //       "deeppink": "#ff1493",
          //       "floralwhite": "#fffaf0",
          //       "fuchsia": "#ff00ff",
          //       "gold": "#ffd700",
          //       "hotpink": "#ff69b4",
          //       "ivory": "#fffff0",
          //       "lavenderblush": "#fff0f5",
          //       "lemonchiffon": "#fffacd",
          //       "lightpink": "#ffb6c1",
          //       "lightsalmon": "#ffa07a",
          //       "lightyellow": "#ffffe0",
          //       "magenta": "#ff00ff",
          //       "mistyrose": "#ffe4e1",
          //       "moccasin": "#ffe4b5",
          //       "navajowhite": "#ffdead",
          //       "orange": "#ffa500",
          //       "orangered": "#ff4500",
          //       "papayawhip": "#ffefd5",
          //       "peachpuff": "#ffdab9",
          //       "pink": "#ffc0cb",
          //       "red": "#ff0000",
          //       "seashell": "#fff5ee",
          //       "snow": "#fffafa",
          //       "tomato": "#ff6347",
          //       "white": "#ffffff",
          //       "yellow": "#ffff00",
          //       "rebeccapurple": "#663399"
          //     }

          //     console.log("name: " + execResult);
          //     console.log("color: " + carray[execResult]);
          //     var sstr = carray[execResult];
          //     console.log("color: " + sstr.substring(1,3) + " - " + sstr.substring(3,5) + " - " + sstr.substring(5,7));
          //     return [
          //       parseInt(sstr.substring(1,3), 16),
          //       parseInt(sstr.substring(3,5), 16),
          //       parseInt(sstr.substring(6,8), 16),
          //     ];

          //   }
          // }
        ]
      };
    })
    .factory('Color', ['Helper', function (Helper) {
      return {
        value: {
          h: 1,
          s: 1,
          b: 1,
          a: 1
        },
        // translate a format from Color object to a string
        'rgb': function () {
          var rgb = this.toRGB();
          return 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
        },
        'rgba': function () {
          var rgb = this.toRGB();
          return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';
        },
        'hex': function () {
          return  this.toHex();
        },

        // HSBtoRGB from RaphaelJS
        RGBtoHSB: function (r, g, b, a) {
          r /= 255;
          g /= 255;
          b /= 255;

          var H, S, V, C;
          V = Math.max(r, g, b);
          C = V - Math.min(r, g, b);
          H = (C === 0 ? null :
              V === r ? (g - b) / C :
                  V === g ? (b - r) / C + 2 :
                      (r - g) / C + 4
              );
          H = ((H + 360) % 6) * 60 / 360;
          S = C === 0 ? 0 : C / V;
          return {h: H || 1, s: S, b: V, a: a || 1};
        },

        //parse a string to HSB
        setColor: function (val) {
          val = val.toLowerCase();
          for (var key in Helper.stringParsers) {
            if (Helper.stringParsers.hasOwnProperty(key)) {
              var parser = Helper.stringParsers[key];
              var match = parser.re.exec(val),
                  values = match && parser.parse(match);
              if (values) {
                this.value = this.RGBtoHSB.apply(null, values);
                return false;
              }
            }
          }
        },

        setHue: function (h) {
          this.value.h = 1 - h;
        },

        setSaturation: function (s) {
          this.value.s = s;
        },

        setLightness: function (b) {
          this.value.b = 1 - b;
        },

        setAlpha: function (a) {
          this.value.a = parseInt((1 - a) * 100, 10) / 100;
        },

        // HSBtoRGB from RaphaelJS
        // https://github.com/DmitryBaranovskiy/raphael/
        toRGB: function (h, s, b, a) {
          if (!h) {
            h = this.value.h;
            s = this.value.s;
            b = this.value.b;
          }
          h *= 360;
          var R, G, B, X, C;
          h = (h % 360) / 60;
          C = b * s;
          X = C * (1 - Math.abs(h % 2 - 1));
          R = G = B = b - C;

          h = ~~h;
          R += [C, X, 0, 0, X, C][h];
          G += [X, C, C, X, 0, 0][h];
          B += [0, 0, X, C, C, X][h];
          return {
            r: Math.round(R * 255),
            g: Math.round(G * 255),
            b: Math.round(B * 255),
            a: a || this.value.a
          };
        },

        toHex: function (h, s, b, a) {
          var rgb = this.toRGB(h, s, b, a);
          return '#' + ((1 << 24) | (parseInt(rgb.r, 10) << 16) | (parseInt(rgb.g, 10) << 8) | parseInt(rgb.b, 10)).toString(16).substr(1);
        }
      };
    }])
    .factory('Slider', ['Helper', function (Helper) {
      var
          slider = {
            maxLeft: 0,
            maxTop: 0,
            callLeft: null,
            callTop: null,
            knob: {
              top: 0,
              left: 0
            }
          },
          pointer = {};

      return {
        getSlider: function() {
          return slider;
        },
        getLeftPosition: function(event) {
          return Math.max(0, Math.min(slider.maxLeft, slider.left + ((event.pageX || pointer.left) - pointer.left)));
        },
        getTopPosition: function(event) {
          return Math.max(0, Math.min(slider.maxTop, slider.top + ((event.pageY || pointer.top) - pointer.top)));
        },
        setSlider: function (event, fixedPosition) {
          var
            target = Helper.closestSlider(event.target),
            targetOffset = Helper.getOffset(target, fixedPosition);
          slider.knob = target.children[0].style;
          slider.left = event.pageX - targetOffset.left - window.pageXOffset + targetOffset.scrollX;
          slider.top = event.pageY - targetOffset.top - window.pageYOffset + targetOffset.scrollY;

          pointer = {
            left: event.pageX,
            top: event.pageY
          };
        },
        setSaturation: function(event, fixedPosition) {
          slider = {
            maxLeft: 100,
            maxTop: 100,
            callLeft: 'setSaturation',
            callTop: 'setLightness'
          };
          this.setSlider(event, fixedPosition);
        },
        setHue: function(event, fixedPosition) {
          slider = {
            maxLeft: 0,
            maxTop: 100,
            callLeft: false,
            callTop: 'setHue'
          };
          this.setSlider(event, fixedPosition);
        },
        setAlpha: function(event, fixedPosition) {
          slider = {
            maxLeft: 0,
            maxTop: 100,
            callLeft: false,
            callTop: 'setAlpha'
          };
          this.setSlider(event, fixedPosition);
        },
        setKnob: function(top, left) {
          slider.knob.top = top + 'px';
          slider.knob.left = left + 'px';
        }
      };
    }])
    .directive('colorpicker', ['$document', '$compile', 'Color', 'Slider', 'Helper', function ($document, $compile, Color, Slider, Helper) {
      return {
        require: '?ngModel',
        restrict: 'A',
        link: function ($scope, elem, attrs, ngModel) {
          var
              thisFormat = attrs.colorpicker ? attrs.colorpicker : 'hex',
              position = angular.isDefined(attrs.colorpickerPosition) ? attrs.colorpickerPosition : 'bottom',
              inline = angular.isDefined(attrs.colorpickerInline) ? attrs.colorpickerInline : false,
              fixedPosition = angular.isDefined(attrs.colorpickerFixedPosition) ? attrs.colorpickerFixedPosition : false,
              target = angular.isDefined(attrs.colorpickerParent) ? elem.parent() : angular.element(document.body),
              withInput = angular.isDefined(attrs.colorpickerWithInput) ? attrs.colorpickerWithInput : false,
              inputTemplate = withInput ? '<input type="text" name="colorpicker-input">' : '',
              closeButton = !inline ? '<button type="button" class="close close-colorpicker">&times;</button>' : '',
              template =
                  '<div class="colorpicker dropdown">' +
                      '<div class="dropdown-menu">' +
                      '<colorpicker-saturation><i></i></colorpicker-saturation>' +
                      '<colorpicker-hue><i></i></colorpicker-hue>' +
                      '<colorpicker-alpha><i></i></colorpicker-alpha>' +
                      '<colorpicker-preview></colorpicker-preview>' +
                      inputTemplate +
                      closeButton +
                      '</div>' +
                      '</div>',
              colorpickerTemplate = angular.element(template),
              pickerColor = Color,
              sliderAlpha,
              sliderHue = colorpickerTemplate.find('colorpicker-hue'),
              sliderSaturation = colorpickerTemplate.find('colorpicker-saturation'),
              colorpickerPreview = colorpickerTemplate.find('colorpicker-preview'),
              pickerColorPointers = colorpickerTemplate.find('i');

          $compile(colorpickerTemplate)($scope);

          if (withInput) {
            var pickerColorInput = colorpickerTemplate.find('input');
            pickerColorInput
                .on('mousedown', function(event) {
                  event.stopPropagation();
                })
                .on('keyup', function(event) {
                  var newColor = this.value;
                  elem.val(newColor);
                  if(ngModel) {
                    $scope.$apply(ngModel.$setViewValue(newColor));
                  }
                  event.stopPropagation();
                  event.preventDefault();
                });
            elem.on('keyup', function() {
              pickerColorInput.val(elem.val());
            });
          }

          var bindMouseEvents = function() {
            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
          };

          if (thisFormat === 'rgba') {
            colorpickerTemplate.addClass('alpha');
            sliderAlpha = colorpickerTemplate.find('colorpicker-alpha');
            sliderAlpha
                .on('click', function(event) {
                  Slider.setAlpha(event, fixedPosition);
                  mousemove(event);
                })
                .on('mousedown', function(event) {
                  Slider.setAlpha(event, fixedPosition);
                  bindMouseEvents();
                });
          }

          sliderHue
              .on('click', function(event) {
                Slider.setHue(event, fixedPosition);
                mousemove(event);
              })
              .on('mousedown', function(event) {
                Slider.setHue(event, fixedPosition);
                bindMouseEvents();
              });

          sliderSaturation
              .on('click', function(event) {
                Slider.setSaturation(event, fixedPosition);
                mousemove(event);
              })
              .on('mousedown', function(event) {
                Slider.setSaturation(event, fixedPosition);
                bindMouseEvents();
              });

          if (fixedPosition) {
            colorpickerTemplate.addClass('colorpicker-fixed-position');
          }

          colorpickerTemplate.addClass('colorpicker-position-' + position);
		      if (inline === 'true') {
			      colorpickerTemplate.addClass('colorpicker-inline');
		      }

          target.append(colorpickerTemplate);

          if(ngModel) {
            ngModel.$render = function () {
              elem.val(ngModel.$viewValue);
            };
            $scope.$watch(attrs.ngModel, function(newVal) {
              update();

              if (withInput) {
                pickerColorInput.val(newVal);
              }
            });
          }

          elem.on('$destroy', function() {
            colorpickerTemplate.remove();
          });

          var previewColor = function () {
            try {
              colorpickerPreview.css('backgroundColor', pickerColor[thisFormat]());
            } catch (e) {
              colorpickerPreview.css('backgroundColor', pickerColor.toHex());
            }
            sliderSaturation.css('backgroundColor', pickerColor.toHex(pickerColor.value.h, 1, 1, 1));
            if (thisFormat === 'rgba') {
              sliderAlpha.css.backgroundColor = pickerColor.toHex();
            }
          };

          var mousemove = function (event) {
            var
                left = Slider.getLeftPosition(event),
                top = Slider.getTopPosition(event),
                slider = Slider.getSlider();

            Slider.setKnob(top, left);

            if (slider.callLeft) {
              pickerColor[slider.callLeft].call(pickerColor, left / 100);
            }
            if (slider.callTop) {
              pickerColor[slider.callTop].call(pickerColor, top / 100);
            }
            previewColor();
            var newColor = pickerColor[thisFormat]();
            elem.val(newColor);
            if(ngModel) {
              $scope.$apply(ngModel.$setViewValue(newColor));
            }
            if (withInput) {
              pickerColorInput.val(newColor);
            }
            return false;
          };

          var mouseup = function () {
            $document.off('mousemove', mousemove);
            $document.off('mouseup', mouseup);
          };

          var update = function () {
            pickerColor.setColor(elem.val());
            pickerColorPointers.eq(0).css({
              left: pickerColor.value.s * 100 + 'px',
              top: 100 - pickerColor.value.b * 100 + 'px'
            });
            pickerColorPointers.eq(1).css('top', 100 * (1 - pickerColor.value.h) + 'px');
            pickerColorPointers.eq(2).css('top', 100 * (1 - pickerColor.value.a) + 'px');
            previewColor();
          };

          var getColorpickerTemplatePosition = function() {
            var
                positionValue,
                positionOffset = Helper.getOffset(elem[0]);

            if(angular.isDefined(attrs.colorpickerParent)) {
              positionOffset.left = 0;
              positionOffset.top = 0;
            }

            if (position === 'top') {
              positionValue =  {
                'top': positionOffset.top - 147,
                'left': positionOffset.left
              };
            } else if (position === 'right') {
              positionValue = {
                'top': positionOffset.top,
                'left': positionOffset.left + 126
              };
            } else if (position === 'bottom') {
              positionValue = {
                'top': positionOffset.top + elem[0].offsetHeight + 2,
                'left': positionOffset.left
              };
            } else if (position === 'left') {
              positionValue = {
                'top': positionOffset.top,
                'left': positionOffset.left - 150
              };
            }
            return {
              'top': positionValue.top + 'px',
              'left': positionValue.left + 'px'
            };
          };

          var documentMousedownHandler = function() {
            hideColorpickerTemplate();
          };

          if(inline === false) {
            elem.on('click', function () {
              update();
              colorpickerTemplate
                .addClass('colorpicker-visible')
                .css(getColorpickerTemplatePosition());

              // register global mousedown event to hide the colorpicker
              $document.on('mousedown', documentMousedownHandler);
            });
          } else {
            update();
            colorpickerTemplate
              .addClass('colorpicker-visible')
              .css(getColorpickerTemplatePosition());
          }

          colorpickerTemplate.on('mousedown', function (event) {
            event.stopPropagation();
            event.preventDefault();
          });

          var emitEvent = function(name) {
            if(ngModel) {
              $scope.$emit(name, {
                name: attrs.ngModel,
                value: ngModel.$modelValue
              });
            }
          };

          var hideColorpickerTemplate = function() {
            if (colorpickerTemplate.hasClass('colorpicker-visible')) {
              colorpickerTemplate.removeClass('colorpicker-visible');
              emitEvent('colorpicker-closed');
              // unregister the global mousedown event
              $document.off('mousedown', documentMousedownHandler);
            }
          };

          colorpickerTemplate.find('button').on('click', function () {
            hideColorpickerTemplate();
          });
        }
      };
    }]);
