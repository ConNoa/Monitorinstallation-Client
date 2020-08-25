'use strict';

angular.module('configApp').factory('vvvv', function($http, stringDecoder, colorDecoder){
        return {
            crerateGroup: function(data, func){
                var scope = this;
                $http({
                    method: 'POST',
                    url: '/api/config/group',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function(obj) {
                        var str = [];
                        for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: data
                }).success(function(){
                    scope.getconfig(func);
                });
                return true;
            },
            deleteGroup: function(data, func){
                var scope = this;
                $http({
                    method: 'POST',
                    url: '/api/config/group/delete',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function(obj) {
                        var str = [];
                        for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: data
                }).success(function(){
                    scope.getconfig(func);
                });
                return true;
            },
            setvalue: function(data, func) {
                var scope = this;
                $http({
                    method: 'POST',
                    url: '/api/config/set',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function(obj) {
                        var str = [];
                        for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: data
                }).success(function(){
                    scope.getconfig(func);
                });
                return true;
            },
            getconfig: function(suc){
                $http.get('/api/config').success(function(indata){
                        angular.forEach(indata.Data, function(data, name){
                            angular.forEach(data.Strings, function(stringobj, stringobjname){
                                angular.forEach(stringobj, function(string, stringname){
                                    data.Strings[stringobjname][stringname] = stringDecoder.decode(string, 'cp1251');
                                })
                            })
                        });

                        angular.forEach(indata.Data, function(data, name){
                            angular.forEach(data.Colors, function(colorobj, colorobjname){
                                angular.forEach(colorobj, function(color, colorname){
                                    data.Colors[colorobjname][colorname] = colorDecoder.decode(color);
                                })
                            })
                        });

                        suc(indata);
                    }).error(function(e){
                    console.log(e);
                });
            },

            deletevalue: function(data, func){
                var scope = this;
                $http({
                    method: 'POST',
                    url: '/api/config/delete',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function(obj) {
                        var str = [];
                        for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: data
                }).success(function(){
                    scope.getconfig(func);
                });
                return true;
            },

             execCommand: function(data) {
                $http({
                    method: 'POST',
                    url: '/api/managment',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function(obj) {
                        var str = [];
                        for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: data
                }).success(function(){});
                return true;
            },
        }
    });

angular.module('configApp').factory('pollingService', ['$http', function($http){
        var defaultPollingTime = 1000;
        var polls = {};
        var pdata = {};
        return {
            startPolling: function(name, url, pollingTime, callback) {
                // Check to make sure poller doesn't already exist
                if (!polls[name]) {
                    var poller = function() {
                        $http.get(url).then(function(data){
                            pdata[name] = data.data
                            });

                    }
                    poller();
                    polls[name] = setInterval(poller, pollingTime || defaultPollingTime);
                }
            },

            stopPolling: function(name) {
                clearInterval(polls[name]);
                delete polls[name];
                delete pdata[name];
            },

            pdata: pdata
        }
    }]);

angular.module('configApp').factory('stringDecoder', [function(){
    var encodings= {
    // Windows code page 1252 Western European
    //
        cp1252: '\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\x0c\r\x0e\x0f\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1a\x1b\x1c\x1d\x1e\x1f !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7f\u20ac\ufffd\u201a\u0192\u201e\u2026\u2020\u2021\u02c6\u2030\u0160\u2039\u0152\ufffd\u017d\ufffd\ufffd\u2018\u2019\u201c\u201d\u2022\u2013\u2014\u02dc\u2122\u0161\u203a\u0153\ufffd\u017e\u0178\xa0\xa1\xa2\xa3\xa4\xa5\xa6\xa7\xa8\xa9\xaa\xab\xac\xad\xae\xaf\xb0\xb1\xb2\xb3\xb4\xb5\xb6\xb7\xb8\xb9\xba\xbb\xbc\xbd\xbe\xbf\xc0\xc1\xc2\xc3\xc4\xc5\xc6\xc7\xc8\xc9\xca\xcb\xcc\xcd\xce\xcf\xd0\xd1\xd2\xd3\xd4\xd5\xd6\xd7\xd8\xd9\xda\xdb\xdc\xdd\xde\xdf\xe0\xe1\xe2\xe3\xe4\xe5\xe6\xe7\xe8\xe9\xea\xeb\xec\xed\xee\xef\xf0\xf1\xf2\xf3\xf4\xf5\xf6\xf7\xf8\xf9\xfa\xfb\xfc\xfd\xfe\xff',

    // Windows code page 1251 Cyrillic
    //
        cp1251: '\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\x0c\r\x0e\x0f\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1a\x1b\x1c\x1d\x1e\x1f !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7f\u0402\u0403\u201a\u0453\u201e\u2026\u2020\u2021\u20ac\u2030\u0409\u2039\u040a\u040c\u040b\u040f\u0452\u2018\u2019\u201c\u201d\u2022\u2013\u2014\ufffd\u2122\u0459\u203a\u045a\u045c\u045b\u045f\xa0\u040e\u045e\u0408\xa4\u0490\xa6\xa7\u0401\xa9\u0404\xab\xac\xad\xae\u0407\xb0\xb1\u0406\u0456\u0491\xb5\xb6\xb7\u0451\u2116\u0454\xbb\u0458\u0405\u0455\u0457\u0410\u0411\u0412\u0413\u0414\u0415\u0416\u0417\u0418\u0419\u041a\u041b\u041c\u041d\u041e\u041f\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042a\u042b\u042c\u042d\u042e\u042f\u0430\u0431\u0432\u0433\u0434\u0435\u0436\u0437\u0438\u0439\u043a\u043b\u043c\u043d\u043e\u043f\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044a\u044b\u044c\u044d\u044e\u044f'
    };

    return {
        decode: function (bytes, encoding) {
            //return 'hello';
            var enc= encodings[encoding];
            var n= bytes.length;
            var chars= new Array(n);
            for (var i= 0; i<n; i++){
                chars[i]= enc.charAt(bytes.charCodeAt(i));
                
            }
            return chars.join('');
        }
    }
    }]);

angular.module('configApp').factory('colorDecoder', [function(){
    return {
        decode: function (color) {
            
            var re = /(\d*),\s(\d*),\s(\d*),\s(\d*)/;

            if (re.test(color)){
                var arr = re.exec(color);
                var str = 'rgba(' + arr[2] + ', ' + arr[3] + ', ' + arr[4] + ', ' + (arr[1]/255).toFixed(2) + ')';
                return str;
            }

            var re = /(\d*),\s(\d*),\s(\d*)/;

            if (re.test(color)){
                var arr = re.exec(color);
                var str = 'rgba(' + arr[1] + ', ' + arr[2] + ', ' + arr[3] + ', ' + 1 + ')';
                return str;
            }

            var re = /(\w*)/;

            if (re.test(color)){

                var arr = re.exec(color);
                var carray = {
                    "aqua": "#00ffff",
                    "aliceblue": "#f0f8ff",
                    "antiquewhite": "#faebd7",
                    "black": "#000000",
                    "blue": "#0000ff",
                    "cyan": "#00ffff",
                    "darkblue": "#00008b",
                    "darkcyan": "#008b8b",
                    "darkgreen": "#006400",
                    "darkturquoise": "#00ced1",
                    "deepskyblue": "#00bfff",
                    "green": "#008000",
                    "lime": "#00ff00",
                    "mediumblue": "#0000cd",
                    "mediumspringgreen": "#00fa9a",
                    "navy": "#000080",
                    "springgreen": "#00ff7f",
                    "teal": "#008080",
                    "midnightblue": "#191970",
                    "dodgerblue": "#1e90ff",
                    "lightseagreen": "#20b2aa",
                    "forestgreen": "#228b22",
                    "seagreen": "#2e8b57",
                    "darkslategray": "#2f4f4f",
                    "darkslategrey": "#2f4f4f",
                    "limegreen": "#32cd32",
                    "mediumseagreen": "#3cb371",
                    "turquoise": "#40e0d0",
                    "royalblue": "#4169e1",
                    "steelblue": "#4682b4",
                    "darkslateblue": "#483d8b",
                    "mediumturquoise": "#48d1cc",
                    "indigo": "#4b0082",
                    "darkolivegreen": "#556b2f",
                    "cadetblue": "#5f9ea0",
                    "cornflowerblue": "#6495ed",
                    "mediumaquamarine": "#66cdaa",
                    "dimgray": "#696969",
                    "dimgrey": "#696969",
                    "slateblue": "#6a5acd",
                    "olivedrab": "#6b8e23",
                    "slategray": "#708090",
                    "slategrey": "#708090",
                    "lightslategray": "#778899",
                    "lightslategrey": "#778899",
                    "mediumslateblue": "#7b68ee",
                    "lawngreen": "#7cfc00",
                    "aquamarine": "#7fffd4",
                    "chartreuse": "#7fff00",
                    "gray": "#808080",
                    "grey": "#808080",
                    "maroon": "#800000",
                    "olive": "#808000",
                    "purple": "#800080",
                    "lightskyblue": "#87cefa",
                    "skyblue": "#87ceeb",
                    "blueviolet": "#8a2be2",
                    "darkmagenta": "#8b008b",
                    "darkred": "#8b0000",
                    "saddlebrown": "#8b4513",
                    "darkseagreen": "#8fbc8f",
                    "lightgreen": "#90ee90",
                    "mediumpurple": "#9370db",
                    "darkviolet": "#9400d3",
                    "palegreen": "#98fb98",
                    "darkorchid": "#9932cc",
                    "yellowgreen": "#9acd32",
                    "sienna": "#a0522d",
                    "brown": "#a52a2a",
                    "darkgray": "#a9a9a9",
                    "darkgrey": "#a9a9a9",
                    "greenyellow": "#adff2f",
                    "lightblue": "#add8e6",
                    "paleturquoise": "#afeeee",
                    "lightsteelblue": "#b0c4de",
                    "powderblue": "#b0e0e6",
                    "firebrick": "#b22222",
                    "darkgoldenrod": "#b8860b",
                    "mediumorchid": "#ba55d3",
                    "rosybrown": "#bc8f8f",
                    "darkkhaki": "#bdb76b",
                    "silver": "#c0c0c0",
                    "mediumvioletred": "#c71585",
                    "indianred": "#cd5c5c",
                    "peru": "#cd853f",
                    "chocolate": "#d2691e",
                    "tan": "#d2b48c",
                    "lightgray": "#d3d3d3",
                    "lightgrey": "#d3d3d3",
                    "thistle": "#d8bfd8",
                    "goldenrod": "#daa520",
                    "orchid": "#da70d6",
                    "palevioletred": "#db7093",
                    "crimson": "#dc143c",
                    "gainsboro": "#dcdcdc",
                    "plum": "#dda0dd",
                    "burlywood": "#deb887",
                    "lightcyan": "#e0ffff",
                    "lavender": "#e6e6fa",
                    "darksalmon": "#e9967a",
                    "palegoldenrod": "#eee8aa",
                    "violet": "#ee82ee",
                    "azure": "#f0ffff",
                    "honeydew": "#f0fff0",
                    "khaki": "#f0e68c",
                    "lightcoral": "#f08080",
                    "sandybrown": "#f4a460",
                    "beige": "#f5f5dc",
                    "mintcream": "#f5fffa",
                    "wheat": "#f5deb3",
                    "whitesmoke": "#f5f5f5",
                    "ghostwhite": "#f8f8ff",
                    "lightgoldenrodyellow": "#fafad2",
                    "linen": "#faf0e6",
                    "salmon": "#fa8072",
                    "oldlace": "#fdf5e6",
                    "bisque": "#ffe4c4",
                    "blanchedalmond": "#ffebcd",
                    "coral": "#ff7f50",
                    "cornsilk": "#fff8dc",
                    "darkorange": "#ff8c00",
                    "deeppink": "#ff1493",
                    "floralwhite": "#fffaf0",
                    "fuchsia": "#ff00ff",
                    "gold": "#ffd700",
                    "hotpink": "#ff69b4",
                    "ivory": "#fffff0",
                    "lavenderblush": "#fff0f5",
                    "lemonchiffon": "#fffacd",
                    "lightpink": "#ffb6c1",
                    "lightsalmon": "#ffa07a",
                    "lightyellow": "#ffffe0",
                    "magenta": "#ff00ff",
                    "mistyrose": "#ffe4e1",
                    "moccasin": "#ffe4b5",
                    "navajowhite": "#ffdead",
                    "orange": "#ffa500",
                    "orangered": "#ff4500",
                    "papayawhip": "#ffefd5",
                    "peachpuff": "#ffdab9",
                    "pink": "#ffc0cb",
                    "red": "#ff0000",
                    "seashell": "#fff5ee",
                    "snow": "#fffafa",
                    "tomato": "#ff6347",
                    "white": "#ffffff",
                    "yellow": "#ffff00",
                    "rebeccapurple": "#663399"
                }

                var sstr = carray[arr[1].toLowerCase()];
                var str = 'rgba(' + parseInt(sstr.substring(1,3), 16) + ', ' + parseInt(sstr.substring(3,5), 16) + ', ' + parseInt(sstr.substring(5,7), 16) + ', ' + 1 + ')';
                return str;
                
            }
        }
    }
    }]);

