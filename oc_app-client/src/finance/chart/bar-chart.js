import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5chartg01";
import colors from "./colors.js";

import "./bar-chart.less";

const BarChart = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],

  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: "UU5.Chart.BarChart",
    classNames: {
      main: "uu5-chart-bar-chart"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: PropTypes.arrayOf(PropTypes.object),
    xAxisLabels: PropTypes.arrayOf(PropTypes.string),
    labels: PropTypes.arrayOf(PropTypes.string),
    displayCartesianGrid: PropTypes.bool,
    stacked: PropTypes.bool,
    displayLegend: PropTypes.bool,
    displayTooltip: PropTypes.bool,
    isAnimationActive: PropTypes.bool,
    responsive: PropTypes.bool,
    labelUnit: PropTypes.string,
    valueUnit: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    referenceDots: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        colorSchema: PropTypes.string,
        name: PropTypes.string
      })
    ),
    referenceLines: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        colorSchema: PropTypes.string,
        name: PropTypes.string
      })
    ),
    referenceAreas: PropTypes.arrayOf(
      PropTypes.shape({
        startLabel: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        startValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        endLabel: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        endValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        colorSchema: PropTypes.string,
        name: PropTypes.string
      })
    ),
    barSize: PropTypes.number
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      data: null,
      xAxisLabels: null,
      responsive: true,
      isAnimationActive: true,
      displayLegend: true,
      displayTooltip: true,
      displayCartesianGrid: false,
      stacked: true,
      labels: null,
      barSize: 40
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _getBars(parsedData, stacked) {
    let items = parsedData.map((obj, i) => {
      let currentColorSchema =
        colors[UU5.Environment.getColorSchema(obj.colorSchema)] || colors["default"];
      return (
        <UU5.Chart.Bar
          isAnimationActive={this.props.isAnimationActive}
          key={i}
          stackId={stacked ? "a" : i}
          dataKey={obj.label}
          fill={currentColorSchema.start}
          fillOpacity="1"
          barSize={obj.barSize || this.props.barSize}
        />
      );
    });
    return React.Children.toArray(items);
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    let {
      displayCartesianGrid,
      stacked,
      data,
      xAxisLabels,
      displayLegend,
      displayTooltip,
      labels,
      labelUnit,
      valueUnit
    } = this.props;

    let parsedData = data.map(item => {
      let resultItem = { ...item };
      resultItem.label = resultItem.name || resultItem.label;
      delete resultItem.name;
      return resultItem;
    });

    let dataForRecharts = xAxisLabels.map((label, i) => {
      let newRow = { x: label };
      parsedData.forEach(object => {
        newRow[object.label] = object.values[i] || 0;

        if (typeof object.onClick === "function") {
          newRow.onClick = () => object.onClick(i);
        }
      });
      return newRow;
    });

    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Chart.BarChart
          data={dataForRecharts}
          responsive={this.props.responsive}
          width={this.props.width}
          height={this.props.height}
        >
          {displayCartesianGrid && <UU5.Chart.CartesianGrid strokeDasharray="3 3" />}
          <UU5.Chart.XAxis dataKey="x" unit={labelUnit} />
          <UU5.Chart.YAxis unit={valueUnit} />
          {displayTooltip && <UU5.Chart.Tooltip />}
          {displayLegend && <UU5.Chart.Legend />}
          {this._getBars(parsedData, stacked)}
        </UU5.Chart.BarChart>
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default BarChart;
