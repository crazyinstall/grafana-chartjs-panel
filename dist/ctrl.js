"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartJsPanelCtrl = void 0;

var _sdk = require("app/plugins/sdk");

var _lodash = _interopRequireDefault(require("lodash"));

var _YourJS = _interopRequireDefault(require("./external/YourJS.min"));

var Chart = _interopRequireWildcard(require("./external/Chart.bundle.min"));

var ChartDataLabels = _interopRequireWildcard(require("./external/Chart.datalabels.plugin"));

var _config = _interopRequireDefault(require("app/core/config"));

var _CWestColor = require("./external/CWest-Color.min");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var panelDefaults = {
  categoryColumnName: null,
  seriesColumnName: null,
  stackColumnName: null,
  measureColumnName: null,
  chartType: 'bar',
  drilldownLinks: [],
  seriesColors: [],
  isStacked: false,
  dataBgColorAlpha: 0.75,
  dataBorderColorAlpha: 1,
  legend: {
    isShowing: true,
    position: 'top',
    isFullWidth: false,
    isReverse: false
  },
  scales: {
    xAxes: {
      ticks: {
        autoSkip: true,
        minRotation: 0,
        maxRotation: 90
      },
      gridLineOpacity: 0.15
    },
    yAxes: {
      ticks: {
        autoSkip: true,
        minRotation: 0,
        maxRotation: 90
      },
      gridLineOpacity: 0.15
    }
  }
};

function renderChart(_ref) {
  var canvas = _ref.canvas,
      _ref$data = _ref.data,
      dataType = _ref$data.type,
      columns = _ref$data.columns,
      rows = _ref$data.rows,
      columnTexts = _ref$data.columnTexts,
      panel = _ref.panel,
      variables = _ref.variables;

  if (!columnTexts) {
    throw new Error('No source data has been specified.');
  }

  if (dataType !== 'table') {
    throw new Error('Data type must be "table".');
  }

  var colIndexesByText = columnTexts.reduceRight(function (indexes, colText, index) {
    return Object.assign(indexes, _defineProperty({}, colText, index));
  }, {});

  if (!_lodash.default.has(colIndexesByText, panel.categoryColumnName)) {
    throw new Error('Invalid category column.');
  }

  var categoryIndex = colIndexesByText[panel.categoryColumnName];

  if (panel.seriesColumnName != undefined && !_lodash.default.has(colIndexesByText, panel.seriesColumnName)) {
    throw new Error('Invalid series column.');
  }

  var seriesIndex = panel.seriesColumnName != undefined ? colIndexesByText[panel.seriesColumnName] : -1;

  if (panel.stackColumnName != undefined && !_lodash.default.has(colIndexesByText, panel.stackColumnName)) {
    throw new Error('Invalid stack column.');
  }

  var stackIndex = panel.stackColumnName != undefined ? colIndexesByText[panel.stackColumnName] : -1;

  if (!_lodash.default.has(colIndexesByText, panel.measureColumnName)) {
    throw new Error('Invalid measure column.');
  }

  var measureIndex = colIndexesByText[panel.measureColumnName];
  var colRows = rows.map(function (row) {
    return row.reduceRight(function (colRow, value, index) {
      return Object.assign(colRow, _defineProperty({}, columnTexts[index], value));
    }, {});
  });

  var categories = _toConsumableArray(new Set(rows.map(function (row) {
    return row[categoryIndex];
  })));

  var _rows$reduce = rows.reduce(function (carry, row) {
    var seriesName = row[seriesIndex];

    if (!carry.series.includes(seriesName)) {
      carry.series.push(seriesName);
      carry.seriesStacks.push(row[stackIndex]);
    }

    return carry;
  }, {
    series: [],
    seriesStacks: []
  }),
      series = _rows$reduce.series,
      seriesStacks = _rows$reduce.seriesStacks;

  var oldColors = panel.seriesColors.slice();
  var newColors = series.map(function (seriesName, index, series) {
    var oldIndex = oldColors.findIndex(function (c) {
      return c.text === seriesName;
    });
    return {
      text: seriesName,
      color: oldIndex < 0 ? _CWestColor.Color.hsl(~~(360 * index / series.length), 1, 0.5) + '' : oldColors[oldIndex].color
    };
  });
  panel.seriesColors = newColors; // Defined with barChartData.data is defined...

  var measures = {};
  var barChartData = {
    labels: categories,
    datasets: series.map(function (seriesName, seriesNameIndex) {
      return {
        label: seriesName == undefined ? 'Series ' + (seriesNameIndex + 1) : seriesName,
        backgroundColor: (0, _CWestColor.Color)(newColors[seriesNameIndex].color).a(panel.dataBgColorAlpha).rgba(),
        borderColor: (0, _CWestColor.Color)(newColors[seriesNameIndex].color).a(panel.dataBorderColorAlpha).rgba(),
        borderWidth: 1,
        stack: panel.isStacked ? seriesStacks[seriesNameIndex] : seriesNameIndex,
        data: categories.map(function (category) {
          var sum = rows.reduce(function (sum, row) {
            var isMatch = row[categoryIndex] === category && (seriesIndex < 0 || row[seriesIndex] === seriesName);
            return sum + (isMatch ? +row[measureIndex] || 0 : 0);
          }, 0);
          return (measures[category] = measures[category] || {})[seriesName] = sum;
        })
      };
    })
  };
  var isLightTheme = _config.default.theme.type === 'light';
  var myChart = new Chart(canvas, {
    type: panel.chartType,
    data: barChartData,
    //plugins: [ChartDataLabels],
    options: {
      responsive: true,
      legend: {
        display: panel.legend.isShowing,
        position: panel.legend.position,
        fullWidth: panel.legend.isFullWidth,
        reverse: panel.legend.isReverse,
        labels: {
          fontColor: isLightTheme ? '#333' : '#CCC'
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            autoSkip: panel.scales.xAxes.ticks.autoSkip,
            minRotation: panel.scales.xAxes.ticks.minRotation,
            maxRotation: panel.scales.xAxes.ticks.maxRotation,
            fontColor: isLightTheme ? '#333' : '#CCC'
          },
          stacked: true,
          gridLines: {
            display: !!panel.scales.xAxes.gridLineOpacity,
            color: isLightTheme ? "rgba(0,0,0,".concat(+panel.scales.xAxes.gridLineOpacity, ")") : "rgba(255,255,255,".concat(+panel.scales.xAxes.gridLineOpacity, ")")
          }
        }],
        yAxes: [{
          ticks: {
            autoSkip: panel.scales.yAxes.ticks.autoSkip,
            minRotation: panel.scales.yAxes.ticks.minRotation,
            maxRotation: panel.scales.yAxes.ticks.maxRotation,
            fontColor: isLightTheme ? '#333' : '#CCC'
          },
          stacked: true,
          gridLines: {
            display: !!panel.scales.yAxes.gridLineOpacity,
            color: isLightTheme ? "rgba(0,0,0,".concat(+panel.scales.yAxes.gridLineOpacity, ")") : "rgba(255,255,255,".concat(+panel.scales.yAxes.gridLineOpacity, ")")
          }
        }]
      },
      onClick: function onClick(e) {
        var target = myChart.getElementAtEvent(e)[0],
            model = target && target._model;

        if (model) {
          var category = model.label;
          var _series = model.datasetLabel;
          panel.drilldownLinks.reduce(function (isDone, drilldownLink) {
            // If a link has already been opened dont check the other links.
            if (isDone) {
              return isDone;
            } // Check this link to see if it matches...


            var url = drilldownLink.url;

            if (url) {
              var rgxCategory = parseRegExp(drilldownLink.category);
              var rgxSeries = parseRegExp(drilldownLink.series);

              if (rgxCategory.test(category) && (_series == undefined || rgxSeries.test(_series))) {
                url = url.replace(/\${(col|var):((?:[^\}:\\]*|\\.)+)(?::(?:(raw)|(param)(?::((?:[^\}:\\]*|\\.)+))?))?}/g, function (match, type, name, isRaw, isParam, paramName) {
                  var result = _toConsumableArray(new Set(type == 'col' ? getColValuesFor(colIndexesByText[name], category, _series, categoryIndex, seriesIndex, rows) : getVarValuesFor(name, variables)));

                  return result.length < 1 ? match : isRaw ? result.join(',') : isParam ? result.map(function (v) {
                    return encodeURIComponent(paramName == undefined ? name : paramName) + '=' + encodeURIComponent(v);
                  }).join('&') : encodeURIComponent(result.join(','));
                });
                window.open(url, drilldownLink.openInBlank ? '_blank' : '_self');
                return true;
              }
            }
          }, false);
        }
      }
    }
  });
}

function getColValuesFor(colIndex, category, series, catColIndex, seriesColIndex, rows) {
  if (colIndex >= 0) {
    return rows.reduce(function (values, row) {
      if (category === row[catColIndex] && (seriesColIndex < 0 || row[seriesColIndex] === series)) {
        values.push(row[colIndex]);
      }

      return values;
    }, []);
  }

  return [];
}

function getVarValuesFor(varName, variables) {
  return variables.reduce(function (values, variable) {
    // At times current.value is a string and at times it is an array.
    var varValues = _YourJS.default.toArray(variable.current.value);

    var isAll = variable.includeAll && varValues.length === 1 && varValues[0] === '$__all';
    return variable.name === varName ? values.concat(isAll ? [variable.current.text] : varValues) : values;
  }, []);
}

function parseRegExp(strPattern) {
  var parts = /^\/(.+)\/(\w*)$/.exec(strPattern);
  return parts ? new RegExp(parts[1], parts[2]) : new RegExp('^' + _lodash.default.escapeRegExp(strPattern) + '$', 'i');
}

function renderNow(e, jElem) {
  var error,
      isValid = false,
      ctrl = this,
      data = ctrl.data,
      jContent = jElem.find('.panel-content').css('position', 'relative').html(''),
      elemContent = jContent[0],
      jCanvas = jQuery('<canvas>').appendTo(jContent);

  if (data && data.rows && data.rows.length) {
    if (data.type === 'table') {
      jCanvas.prop({
        width: jContent.width(),
        height: jContent.height()
      });

      try {
        renderChart({
          canvas: jCanvas[0],
          data: data,
          panel: ctrl.panel,
          variables: ctrl.templateSrv.variables
        });
        isValid = true;
      } catch (e) {
        console.error('renderChart:', error = e);
      }
    }
  }

  if (!isValid) {
    var msg = 'No data' + (error ? ':  \r\n' + error.message : '.');

    var elemMsg = _YourJS.default.dom({
      _: 'div',
      style: {
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        height: '100%'
      },
      $: [{
        _: 'div',
        cls: 'alert alert-error',
        style: {
          margin: '0px auto'
        },
        text: msg
      }]
    });

    jContent.html('').append(elemMsg);
  }
}

var ChartJsPanelCtrl =
/*#__PURE__*/
function (_MetricsPanelCtrl) {
  _inherits(ChartJsPanelCtrl, _MetricsPanelCtrl);

  function ChartJsPanelCtrl($scope, $injector, $rootScope) {
    var _this;

    _classCallCheck(this, ChartJsPanelCtrl);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ChartJsPanelCtrl).call(this, $scope, $injector));
    _this.GRID_LINE_OPACITIES = [{
      value: false,
      text: 'None'
    }, {
      value: 0.15,
      text: 'Light'
    }, {
      value: 0.65,
      text: 'Dark'
    }];
    _this.CHART_TYPES = [{
      value: 'horizontalBar',
      text: 'Horizontal Bar'
    }, {
      value: 'bar',
      text: 'Vertical Bar'
    }];
    _this.COLOR_ALPHAS = _lodash.default.range(0, 101, 5).map(function (x) {
      return {
        value: x / 100,
        text: "".concat(x, "%") + (x ? x === 100 ? ' (Solid)' : '' : ' (Invisible)')
      };
    });
    _this.TICK_ROTATIONS = _lodash.default.range(0, 91, 5).map(function (x) {
      return {
        value: x,
        text: "".concat(x, "\xB0") + (x ? x === 90 ? ' (Vertical)' : '' : ' (Horizontal)')
      };
    });
    _this.$rootScope = $rootScope;
    _this.data = null;

    _lodash.default.defaultsDeep(_this.panel, panelDefaults);

    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_assertThisInitialized(_this)));

    _this.events.on('data-received', _this.onDataReceived.bind(_assertThisInitialized(_this)));

    _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_assertThisInitialized(_this)));

    _this.events.on('data-error', _this.onDataError.bind(_assertThisInitialized(_this)));

    return _this;
  }

  _createClass(ChartJsPanelCtrl, [{
    key: "addDrilldownLink",
    value: function addDrilldownLink() {
      this.panel.drilldownLinks.push({
        category: '/[^]*/',
        series: '/[^]*/',
        url: '',
        openInBlank: true
      });
    }
  }, {
    key: "removeDrilldownLink",
    value: function removeDrilldownLink(drilldownLink) {
      var links = this.panel.drilldownLinks;
      links.splice(links.indexOf(drilldownLink), 1);
    }
  }, {
    key: "onInitEditMode",
    value: function onInitEditMode() {
      var path = 'public/plugins/westc-chartjs-panel/partials/';
      this.addEditorTab('Options', "".concat(path, "editor.html"), 2);
      this.addEditorTab('Series Colors', "".concat(path, "series-colors.html"), 3);
      this.addEditorTab('Drill-down Links', "".concat(path, "drilldown-links.html"), 4);
    }
  }, {
    key: "onDataError",
    value: function onDataError() {
      this.renderNow();
    }
  }, {
    key: "onDataReceived",
    value: function onDataReceived(dataList) {
      if (dataList && dataList.length) {
        var data = dataList[0];
        this.data = {
          type: data.type,
          columns: data.columns,
          rows: data.rows,
          columnTexts: data.columns.map(function (col) {
            return 'string' === typeof col ? col : col.text;
          })
        };
      } else {
        this.data = {};
      }

      this.renderNow();
    }
  }, {
    key: "onChangeCallback",
    value: function onChangeCallback(obj, key) {
      var _this2 = this;

      return function (newValue) {
        obj[key] = newValue;

        _this2.renderNow();
      };
    }
  }, {
    key: "renderNow",
    value: function renderNow() {
      this.events.emit('renderNow');
    }
  }, {
    key: "link",
    value: function link(scope, elem, attrs, ctrl) {
      var _this3 = this;

      this.events.on('renderNow', function (e) {
        return renderNow.call(_this3, e, elem);
      });
      this.events.on('render', _lodash.default.debounce(function (e) {
        return renderNow.call(_this3, e, elem);
      }, 250));
    }
  }]);

  return ChartJsPanelCtrl;
}(_sdk.MetricsPanelCtrl); // Dont add ChartDataLabels unless user requests this.


exports.ChartJsPanelCtrl = ChartJsPanelCtrl;
Chart.plugins.unregister(ChartDataLabels);
ChartJsPanelCtrl.templateUrl = 'partials/module.html';
//# sourceMappingURL=ctrl.js.map
