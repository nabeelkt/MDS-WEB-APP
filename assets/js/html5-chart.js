/// <reference path="jquery-1.7.2.js" />
/// <reference path="paper.js" />
(function($) {

    var html5Chart = {};

    var path;
    var selectedBar;
    var bars = [];

    var generateGuid = function() {
        var S4 = function() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    var easingOut = function(t, b, c, d) {
        var ts = (t /= d) * t;
        var tc = ts * t;
        return b + c * (tc * ts + -5 * ts * ts + 10 * tc + -10 * ts + 5 * t);
    }

    function addCommas(nStr) {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }

    var hitOptions = {
        type: html5Chart.Bar,
        segments: true,
        stroke: true,
        fill: true,
        tolerance: 1
    };

    $.fn.barChart = function(options) {

        var self = this;
        this.empty();

        // Create some defaults, extending them with any options that were provided
        var settings = $.extend({
            'id': generateGuid(),
            'discreteValueField': 'value',
            'categoryField': 'name',
            'colorField': 'color',
            'scaleText': 'values',
            'font': 'helvetica, calibri',
            'border': '1px solid #c0c0c0',
            'backgroundColor': '#FFFF',
            'title': '',
            'width': null,
            'height': null,
            'marginTop': 60,
            'marginLeft': 15,
            'marginRight': 5,
            'marginBottom': 15,
            'axisWidth': 50,
            'xLabelsHeight': 80,
            'barColor': '#ff0000',
            'depth3D': 0,
            'angle': 0,
            'onDataItemClick': null
        }, options);

        settings.fontSize = 10;

        //A canvas element is appended to the target div, so that the bar chart can be rendered
        var newCanvas =
            $('<canvas>').attr({
                id: settings.id,
                width: settings.width,
                height: settings.height
            }).css({
                border: settings.border,
                backgroundColor: settings.backgroundColor
            });
        this.append(newCanvas);

        //Hidden span is used to preview the size of rendered text
        var newHiddenSpan =
            $('<span>').attr({
                id: 'hiddenSpan',
                fontSize: settings.fontSize
            }).css({
                display: 'none'
            });
        this.append(newHiddenSpan);

        paper = new paper.PaperScope();
        paper.setup(newCanvas.attr('id'));

        with(paper) {

            //Renders the bar chart bar as a group of Paper JS items
            html5Chart.Bar = Group.extend({
                initialize: function(config, items) {
                    console.log(config.originalValue);
                    this.categoryName = config.categoryName;
                    this.value = config.value;
                    this.originalValue = config.originalValue;
                    this.zeroPoint = config.zeroPoint;
                    this.middleX = config.middleX;
                    this.dataItemBarAreaWidth = config.dataItemBarAreaWidth;
                    this.barHeightRatio = config.barHeightRatio;
                    this.depth3DPoint = config.depth3DPoint;

                    //The cardinal points in the point codes indicate the position of the points regarding to the bar.
                    var pNW = {
                        x: this.middleX - (this.dataItemBarAreaWidth * .75) / 2,
                        y: this.zeroPoint.y - this.barHeightRatio * this.value
                    };
                    var pNE = {
                        x: this.middleX + (this.dataItemBarAreaWidth * .75) / 2,
                        y: this.zeroPoint.y - this.barHeightRatio * this.value
                    };
                    var pSW = {
                        x: this.middleX - (this.dataItemBarAreaWidth * .75) / 2,
                        y: this.zeroPoint.y
                    };
                    var pSE = {
                        x: this.middleX + (this.dataItemBarAreaWidth * .75) / 2,
                        y: this.zeroPoint.y
                    };
                    var pNW2 = {
                        x: pNW.x - this.depth3DPoint.x,
                        y: pNW.y - this.depth3DPoint.y
                    };
                    var pNE2 = {
                        x: pNE.x - this.depth3DPoint.x,
                        y: pNW.y - this.depth3DPoint.y
                    };
                    var pSW2 = {
                        x: pSW.x - this.depth3DPoint.x,
                        y: pSW.y - this.depth3DPoint.y
                    };
                    var pSE2 = {
                        x: pSE.x - this.depth3DPoint.x,
                        y: pSW.y - this.depth3DPoint.y
                    };

                    this.bottomValue = pSE.y;
                    this.topValue = pNE.y;
                    this.currentValue = pSE.y;

                    var color = config.color;
                    var color2 = config.color2;
                    var color3 = config.color3;

                    var hexColor = this.colourNameToHex(color);
                    if (!hexColor)
                        hexColor = color;

                    if (hexColor) {
                        var r = hexColor.substring(1, 3);
                        var g = hexColor.substring(3, 5);
                        var b = hexColor.substring(5, 7);
                        var decR = parseInt(r, 16);
                        var decG = parseInt(g, 16);
                        var decB = parseInt(b, 16);
                        var darkFactor1 = .8;
                        var darkFactor2 = .5;
                        color2 = 'rgb(' + Math.round(decR * darkFactor1) + ',' + Math.round(decG * darkFactor1) + ',' + Math.round(decB * darkFactor1) + ')';
                        color3 = 'rgb(' + Math.round(decR * darkFactor2) + ',' + Math.round(decG * darkFactor2) + ',' + Math.round(decB * darkFactor2) + ')';
                    }

                    var dataItem3DPath = this.createBarSidePath(color2, pSW, pSE, pSE, pSW);
                    var dataItem3DTopPath = this.createBarSidePath(color, pSW, pSE, pSE2, pSW2);
                    var dataItem3DSidePath = this.createBarSidePath(color3, pSE, pSE2, pSE2, pSE);

                    items = [];
                    items.push(dataItem3DPath);
                    items.push(dataItem3DTopPath);
                    items.push(dataItem3DSidePath);

                    this.base();
                    this._children = [];
                    this._namedChildren = {};
                    this.addChildren(!items || !Array.isArray(items) ||
                        typeof items[0] !== 'object' ? arguments : items);
                    this.value = this.children[0].segments[2].point.y - this.children[0].segments[1].point.y;
                },
                createBarSidePath: function(color, p1, p2, p3, p4) {
                    var path = new Path();
                    path.fillColor = color;
                    path.strokeWidth = 0;
                    path.add(p1.x, p1.y);
                    path.add(p2.x, p2.y);
                    path.add(p3.x, p3.y);
                    path.add(p4.x, p4.y);
                    path.closed = true;

                    return path;
                },
                getFrontPolygonPath: function() {
                    return this.children[0];
                },
                getTopPolygonPath: function() {
                    return this.children[1];
                },
                getSidePolygonPath: function() {
                    return this.children[2];
                },
                setBarTopY: function(y) {
                    this.currentValue = y;
                    var frontPolygonPath = this.getFrontPolygonPath();
                    frontPolygonPath.segments[0].point.y = y;
                    frontPolygonPath.segments[1].point.y = y;

                    var topPolygonPath = this.getTopPolygonPath();
                    topPolygonPath.segments[0].point.y = y;
                    topPolygonPath.segments[1].point.y = y;
                    topPolygonPath.segments[2].point.y = y - this.depth3DPoint.y;
                    topPolygonPath.segments[3].point.y = y - this.depth3DPoint.y;

                    var sidePolygonPath = this.getSidePolygonPath();
                    sidePolygonPath.segments[0].point.y = y;
                    sidePolygonPath.segments[1].point.y = y - this.depth3DPoint.y;
                },
                animate: function(animationPercPerFrame) {
                    var step = 0;
                    var animated = false;
                    if (this.currentValue < this.topValue) {
                        this.currentValue == this.topValue;
                    } else {
                        step = (this.bottomValue - this.topValue) * (animationPercPerFrame / 100);

                        var y = this.zeroPoint.y - (animationPercPerFrame / 100) * (this.bottomValue - this.topValue);

                        this.setBarTopY(y);
                        animated = true;
                    }
                    return {
                        step: step,
                        animated: animated
                    };
                },
                colourNameToHex: function(colour) {
                    var colours = {
                        "aliceblue": "#f0f8ff",
                        "antiquewhite": "#faebd7",
                        "aqua": "#00ffff",
                        "aquamarine": "#7fffd4",
                        "azure": "#f0ffff",
                        "beige": "#f5f5dc",
                        "bisque": "#ffe4c4",
                        "black": "#000000",
                        "blanchedalmond": "#ffebcd",
                        "blue": "#0000ff",
                        "blueviolet": "#8a2be2",
                        "brown": "#a52a2a",
                        "burlywood": "#deb887",
                        "cadetblue": "#5f9ea0",
                        "chartreuse": "#7fff00",
                        "chocolate": "#d2691e",
                        "coral": "#ff7f50",
                        "cornflowerblue": "#6495ed",
                        "cornsilk": "#fff8dc",
                        "crimson": "#dc143c",
                        "cyan": "#00ffff",
                        "darkblue": "#00008b",
                        "darkcyan": "#008b8b",
                        "darkgoldenrod": "#b8860b",
                        "darkgray": "#a9a9a9",
                        "darkgreen": "#006400",
                        "darkkhaki": "#bdb76b",
                        "darkmagenta": "#8b008b",
                        "darkolivegreen": "#556b2f",
                        "darkorange": "#ff8c00",
                        "darkorchid": "#9932cc",
                        "darkred": "#8b0000",
                        "darksalmon": "#e9967a",
                        "darkseagreen": "#8fbc8f",
                        "darkslateblue": "#483d8b",
                        "darkslategray": "#2f4f4f",
                        "darkturquoise": "#00ced1",
                        "darkviolet": "#9400d3",
                        "deeppink": "#ff1493",
                        "deepskyblue": "#00bfff",
                        "dimgray": "#696969",
                        "dodgerblue": "#1e90ff",
                        "firebrick": "#b22222",
                        "floralwhite": "#fffaf0",
                        "forestgreen": "#228b22",
                        "fuchsia": "#ff00ff",
                        "gainsboro": "#dcdcdc",
                        "ghostwhite": "#f8f8ff",
                        "gold": "#ffd700",
                        "goldenrod": "#daa520",
                        "gray": "#808080",
                        "green": "#008000",
                        "greenyellow": "#adff2f",
                        "honeydew": "#f0fff0",
                        "hotpink": "#ff69b4",
                        "indianred ": "#cd5c5c",
                        "indigo ": "#4b0082",
                        "ivory": "#fffff0",
                        "khaki": "#f0e68c",
                        "lavender": "#e6e6fa",
                        "lavenderblush": "#fff0f5",
                        "lawngreen": "#7cfc00",
                        "lemonchiffon": "#fffacd",
                        "lightblue": "#add8e6",
                        "lightcoral": "#f08080",
                        "lightcyan": "#e0ffff",
                        "lightgoldenrodyellow": "#fafad2",
                        "lightgrey": "#d3d3d3",
                        "lightgreen": "#90ee90",
                        "lightpink": "#ffb6c1",
                        "lightsalmon": "#ffa07a",
                        "lightseagreen": "#20b2aa",
                        "lightskyblue": "#87cefa",
                        "lightslategray": "#778899",
                        "lightsteelblue": "#b0c4de",
                        "lightyellow": "#ffffe0",
                        "lime": "#00ff00",
                        "limegreen": "#32cd32",
                        "linen": "#faf0e6",
                        "magenta": "#ff00ff",
                        "maroon": "#800000",
                        "mediumaquamarine": "#66cdaa",
                        "mediumblue": "#0000cd",
                        "mediumorchid": "#ba55d3",
                        "mediumpurple": "#9370d8",
                        "mediumseagreen": "#3cb371",
                        "mediumslateblue": "#7b68ee",
                        "mediumspringgreen": "#00fa9a",
                        "mediumturquoise": "#48d1cc",
                        "mediumvioletred": "#c71585",
                        "midnightblue": "#191970",
                        "mintcream": "#f5fffa",
                        "mistyrose": "#ffe4e1",
                        "moccasin": "#ffe4b5",
                        "navajowhite": "#ffdead",
                        "navy": "#000080",
                        "oldlace": "#fdf5e6",
                        "olive": "#808000",
                        "olivedrab": "#6b8e23",
                        "orange": "#ffa500",
                        "orangered": "#ff4500",
                        "orchid": "#da70d6",
                        "palegoldenrod": "#eee8aa",
                        "palegreen": "#98fb98",
                        "paleturquoise": "#afeeee",
                        "palevioletred": "#d87093",
                        "papayawhip": "#ffefd5",
                        "peachpuff": "#ffdab9",
                        "peru": "#cd853f",
                        "pink": "#ffc0cb",
                        "plum": "#dda0dd",
                        "powderblue": "#b0e0e6",
                        "purple": "#800080",
                        "red": "#ff0000",
                        "rosybrown": "#bc8f8f",
                        "royalblue": "#4169e1",
                        "saddlebrown": "#8b4513",
                        "salmon": "#fa8072",
                        "sandybrown": "#f4a460",
                        "seagreen": "#2e8b57",
                        "seashell": "#fff5ee",
                        "sienna": "#a0522d",
                        "silver": "#c0c0c0",
                        "skyblue": "#87ceeb",
                        "slateblue": "#6a5acd",
                        "slategray": "#708090",
                        "snow": "#fffafa",
                        "springgreen": "#00ff7f",
                        "steelblue": "#4682b4",
                        "tan": "#d2b48c",
                        "teal": "#008080",
                        "thistle": "#d8bfd8",
                        "tomato": "#ff6347",
                        "turquoise": "#40e0d0",
                        "violet": "#ee82ee",
                        "wheat": "#f5deb3",
                        "white": "#ffffff",
                        "whitesmoke": "#f5f5f5",
                        "yellow": "#ffff00",
                        "yellowgreen": "#9acd32"
                    };

                    if (typeof colours[colour.toLowerCase()] != 'undefined')
                        return colours[colour.toLowerCase()];

                    return false;
                }
            });

            //Creates a group of Paper JS items that represent the pop up caption
            //that displays the current category name and corresponding discrete value
            //when the user moves the mouse over it
            html5Chart.Popup = Group.extend({
                initialize: function(options) {
                    var settings = this.settings = $.extend({
                        'fontSize': '20',
                        'font': 'helvetica, calibri',
                        'color': 'color',
                        'fillColor': 'orange',
                        'strokeColor': 'black',
                        'strokeWidth': '1'
                    }, options);

                    this.popupCenter = {
                        x: paper.view.viewSize.width / 2,
                        y: paper.view.viewSize.height / 2,
                    };
                    var text = '';

                    $(newHiddenSpan).css('font-family', settings.font);
                    $(newHiddenSpan).css('font-size', settings.fontSize * 1.6);
                    $(newHiddenSpan).html(text);
                    self.append(newHiddenSpan);
                    var textSize = {
                        width: 200,
                        height: 20
                    };

                    var popupText = new paper.PointText(textSize.width / 2, textSize.height * .75);
                    popupText.paragraphStyle.justification = 'center';
                    popupText.characterStyle.fontSize = settings.fontSize;
                    popupText.characterStyle.font = settings.font;
                    popupText.content = text;

                    var rectangle = new Rectangle(new Point(0, 0), textSize);
                    var cornerSize = new Size(5, 5);
                    var popupBorder = new Path.RoundRectangle(rectangle, cornerSize);
                    popupBorder.strokeColor = settings.strokeColor;
                    popupBorder.strokeWidth = settings.strokeWidth;
                    popupBorder.fillColor = settings.fillColor;
                    this.base();
                    this._children = [];
                    this._namedChildren = {};
                    this.addChildren([popupBorder, popupText]);
                    this.visible = false;
                    return this;
                },
                resetPopup: function(text) {
                    if (this.text != text) {
                        this.text = text;
                        var settings = this.settings;
                        $(newHiddenSpan).css('font-family', settings.font);
                        $(newHiddenSpan).css('font-size', settings.fontSize * 1.6);
                        $(newHiddenSpan).html(text);
                        var textSize = {
                            width: $(newHiddenSpan).width(),
                            height: $(newHiddenSpan).height()
                        };
                        var rectangle = new Rectangle(new Point(this.position.x - textSize.width / 2, this.position.y - textSize.height / 2), textSize);
                        var cornerSize = new Size(5, 5);
                        var popupBorder = new Path.RoundRectangle(rectangle, cornerSize);
                        popupBorder.strokeColor = settings.strokeColor;
                        popupBorder.strokeWidth = settings.strokeWidth;
                        popupBorder.fillColor = settings.fillColor;
                        var border = this.getBorder();
                        var popupText = this.getLabel();
                        popupText.paragraphStyle.justification = 'center';
                        popupText.characterStyle.fontSize = settings.fontSize;
                        popupText.characterStyle.font = settings.font;
                        popupText.content = text;
                        this.removeChildren();
                        this.addChildren([popupBorder, popupText]);
                    }
                },
                getBorder: function() {
                    return this.children[0];
                },
                getLabel: function() {
                    return this.children[1];
                }
            });

            // Create a simple drawing tool:
            var tool = new Tool();

            tool.onMouseMove = function(event) {
                var hitResult = paper.project.hitTest(event.point, hitOptions);
                self.selectedItemPopup.visible = false;
                self.css('cursor', '');
                if (hitResult && hitResult.item) {
                    if (hitResult.item.parent) {
                        self.selectedItemPopup.position = new Point(event.point.x, event.point.y - 40);
                        if (hitResult.item.parent.categoryName) {
                            if (selectedBar) {
                                if (selectedBar != hitResult.item.parent) {
                                    selectedBar.opacity = 1;
                                    selectedBar.strokeWidth = 0;
                                    selectedBar.strokeColor = undefined;
                                    self.selectedItemPopup.visible = false;
                                    self.css('cursor', '');
                                }
                            }
                            selectedBar = hitResult.item.parent;
                            selectedBar.opacity = .5;
                            selectedBar.strokeWidth = 1;
                            selectedBar.strokeColor = 'black';
                            self.selectedItemPopup.visible = true;
                            self.css('cursor', 'pointer');
                            if (self.selectedItemPopup.resetPopup) {
                                var value = selectedBar.originalValue;
                                value = parseInt(value * 100) / 100;
                                self.selectedItemPopup.resetPopup(selectedBar.categoryName + ': ' + addCommas(value));
                            }

                            if (settings.onDataItemMouseMove) {
                                settings.onDataItemMouseMove({
                                    categoryName: selectedBar.categoryName,
                                    value: selectedBar.originalValue
                                });
                            }
                        }
                    }
                } else {
                    if (selectedBar) {
                        selectedBar.opacity = 1;
                        selectedBar.strokeWidth = 0;
                        selectedBar.strokeColor = undefined;
                        selectedBar = null;
                        self.css('cursor', '');
                    }
                }
            }

            tool.onMouseUp = function() {
                if (selectedBar) {
                    if (settings.onDataItemClick) {
                        settings.onDataItemClick({
                            categoryName: selectedBar.categoryName,
                            value: selectedBar.originalValue
                        });
                    }
                }
            }

            //Rendering the bar chart title
            var text = new PointText(paper.view.viewSize.width / 2, 15);
            text.paragraphStyle.justification = 'center';
            text.characterStyle.fontSize = settings.fontSize;
            text.characterStyle.font = settings.font;
            text.content = settings.title;

            var maxCategoryNameWidth = 0;
            $(settings.data).each(function(index, item) {
                var categoryName = item[settings.categoryNameField];
                $(newHiddenSpan).html(categoryName);
                maxCategoryNameWidth = Math.max(maxCategoryNameWidth, $(newHiddenSpan).width());
            });
            if (!settings.marginBottom)
                settings.marginBottom = settings.height / 8;

            //The Zero Point defines where the two axis cross each other
            var zeroPoint = {
                x: settings.marginLeft + settings.axisWidth,
                y: paper.view.viewSize.height - settings.marginBottom - settings.xLabelsHeight
            }

            //Rendering the left (scale) line
            var leftPath = new Path();
            leftPath.strokeColor = 'black';
            leftPath.add(zeroPoint.x, settings.marginTop);
            leftPath.add(zeroPoint.x, zeroPoint.y);

            var maxDiscreteValue = 0;
            var minDiscreteValue = 0;

            //Discovering the maximum and minimum discrete values
            var xOffset = 0;
            var dataItemBarAreaWidth = (paper.view.viewSize.width - settings.marginLeft - settings.marginRight - settings.depth3D - settings.axisWidth) / settings.data.length;
            $(settings.data).each(function(index, item) {
                var value = item[settings.discreteValueField];
                maxDiscreteValue = Math.max(maxDiscreteValue, value);
                minDiscreteValue = Math.min(minDiscreteValue, value);
                item.value = value;
                item.originalValue = value;
            });

            //Discovering the magnitude value based on the maximum discrete value
            var magnitude = 1;
            var magnitudeLabel = '';
            if (maxDiscreteValue > 1000000000) {
                magnitude = 1000000000;
                magnitudeLabel = '(in billions)'
            } else if (maxDiscreteValue > 1000000) {
                magnitude = 1000000;
                magnitudeLabel = '(in millions)'
            } else if (maxDiscreteValue > 1000) {
                magnitude = 1000;
                magnitudeLabel = ''
            }

            //Each value must be re-scaled based on the magnitude
            $(settings.data).each(function(index, item) {
                item.value = item.value / magnitude;
            });

            maxDiscreteValue = maxDiscreteValue / magnitude;
            minDiscreteValue = minDiscreteValue / magnitude;

            //Rounding the numbers to the same number of digits
            var maxDiscreteValueLength = (parseInt(maxDiscreteValue + '').toString()).length - 2;
            var roundLimit = Math.pow(10, maxDiscreteValueLength);
            var maxScaleValue = Math.ceil(maxDiscreteValue / roundLimit) * roundLimit;

            //Rendering the scale values
            var scaleCount = 5;
            var lastScaleValue = 0;
            for (var scale = 0; scale <= scaleCount; scale++) {
                var y = zeroPoint.y - scale * (zeroPoint.y - settings.marginTop) / scaleCount;

                var scaleText = new PointText(zeroPoint.x - 10, y + 5);
                scaleText.paragraphStyle.justification = 'right';
                scaleText.characterStyle.fontSize = settings.fontSize * .8;
                scaleText.characterStyle.font = settings.font;
                var value = ((maxScaleValue - 0) / scaleCount) * scale;

                if (value.toString().length - lastScaleValue.toString().length > 2) {
                    var lastDigitsCount = (lastScaleValue.toString().length - parseInt(lastScaleValue).toString().length) - 1;
                    var pow = Math.pow(10, lastDigitsCount);
                    value = parseInt(pow * value) / pow;
                }
                scaleText.content = addCommas(value);

                lastScaleValue = value;
                var scalePath = new Path();
                scalePath.strokeColor = 'black';
                scalePath.add(zeroPoint.x - 5, y);
                scalePath.add(zeroPoint.x, y);
            }

            //Rendering the horizontal (bottom) line
            var bottomPath = new Path();
            bottomPath.strokeColor = 'black';
            bottomPath.add(zeroPoint.x, zeroPoint.y + 1);
            bottomPath.add(paper.view.viewSize.width - settings.marginRight, zeroPoint.y + 1);

            //The pixel/value ratio used to draw the bar chart bars
            var barHeightRatio = (zeroPoint.y - settings.marginTop) / (maxScaleValue - minDiscreteValue);
            $(newHiddenSpan).html('A');
            var categoryNameMargin = $(newHiddenSpan).width();
            var depth3DPoint;
            if (maxDiscreteValue > minDiscreteValue) {
                //The rotated caption for the discrete values
                var discreteValuesCaption = new PointText(settings.marginLeft * .5, paper.view.viewSize.height / 2);
                discreteValuesCaption.paragraphStyle.justification = 'center';
                discreteValuesCaption.characterStyle.fontSize = settings.fontSize * 1.1;
                discreteValuesCaption.characterStyle.font = settings.font;
                discreteValuesCaption.content = settings.discreteValuesCaption;
                discreteValuesCaption.rotate(270);

                maxDiscreteValueLength = (parseInt(maxDiscreteValue + '').toString()).length - 2;
                roundLimit = Math.pow(10, maxDiscreteValueLength);
                maxScaleValue = Math.ceil(maxDiscreteValue / roundLimit) * roundLimit;

                //The rotated caption for the magnitude
                var discreteValuesCaption2 = new PointText(settings.marginLeft, paper.view.viewSize.height / 2);
                discreteValuesCaption2.paragraphStyle.justification = 'center';
                discreteValuesCaption2.characterStyle.fontSize = settings.fontSize * 1.2;
                discreteValuesCaption2.characterStyle.font = settings.font;
                discreteValuesCaption2.content = magnitudeLabel;
                discreteValuesCaption2.rotate(270);

                //The {x,y} offset point, used to define the deep corner of the bar
                depth3DPoint = {
                    x: -settings.depth3D * Math.cos(settings.angle * (Math.PI / 180)),
                    y: settings.depth3D * Math.sin(settings.angle * (Math.PI / 180)),
                };

                //Creates one bar for each category
                $(settings.data).each(function(index, item) {
                    var value = item.value;
                    var originalValue = item.originalValue;
                    var categoryName = item[settings.categoryNameField];
                    var color = item[settings.colorField];

                    var middleX = zeroPoint.x + dataItemBarAreaWidth * index + dataItemBarAreaWidth / 2;

                    //Generates and renders the category bar
                    var g = new html5Chart.Bar({
                        categoryName: categoryName,
                        value: value,
                        originalValue: originalValue,

                        middleX: middleX,
                        dataItemBarAreaWidth: dataItemBarAreaWidth,
                        barHeightRatio: barHeightRatio,

                        depth3DPoint: depth3DPoint,
                        zeroPoint: zeroPoint,
                        color: color
                    });
                    bars.push(g);

                    //We set the hidden span's html value so that jQuery width() and height() functions can calculate the
                    //dimensions of the rendered, then we used them to position the text.
                    $(newHiddenSpan).html(categoryName);

                    var barLabelLineX = zeroPoint.x + dataItemBarAreaWidth * index + dataItemBarAreaWidth / 2;

                    var barLabelLine = new Path();
                    barLabelLine.strokeColor = 'black';
                    barLabelLine.add(barLabelLineX, zeroPoint.y);
                    barLabelLine.add(barLabelLineX, zeroPoint.y + 5);

                    //Renders the category names below the bars
                    var bottomPadding = settings.height - zeroPoint.y;
                    var barLabel = new PointText(barLabelLineX + 5, (zeroPoint.y + $(newHiddenSpan).width() / 4) + bottomPadding / 4);
                    barLabel.paragraphStyle.justification = 'center';
                    barLabel.characterStyle.fontSize = settings.fontSize;
                    barLabel.characterStyle.font = settings.font;
                    barLabel.content = categoryName;
                    barLabel.rotate(270);
                });

                this.selectedItemPopup = new html5Chart.Popup({
                    fontSize: settings.fontSize
                });
            }

            //when everything is rendered, we call draw() function to generate the frame.
            paper.view.draw();

            //Generates the initial animation
            var animationPercPerFrame = 5;
            var ellapsedTime = 0;
            var accumulatedBarHeight = 0;
            paper.view.onFrame = function(event) {
                ellapsedTime += event.time;

                var animationCount = 0;
                animationPercPerFrame = easingOut(ellapsedTime, 0, 100, 40);
                $(bars).each(function(index, bar) {
                    var animationResult = bar.animate(animationPercPerFrame);

                    if (animationResult.animated > 0) {
                        animationCount++;
                    }
                    accumulatedBarHeight += animationResult.step;
                });
                if (animationCount == 0) {
                    paper.view.onFrame = null;
                }
            }
        }

        return this;
    }
}(jQuery));