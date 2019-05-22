import React from "react";
import createReactClass from "create-react-class";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
import Config from "./config/config.js";

export const Filter = createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Filter",
    classNames: {
      main: Config.CSS + "filter center"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      date: undefined,
      monthly: true
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
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    let dateFrom = "2014-10-01";
    let today = new Date();
    let dateTo = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return (
      <UU5.Common.Div {...this.getMainPropsToPass()}>
        <div>
          <UU5.Bricks.Text
            colorSchema={this.props.monthly ? undefined : "success"}
            content="Rok"
            nestingLevel="inline"
          />
          &nbsp;
          <UU5.Bricks.Switch
            onChange={opt => this.props.onChange(this.props.date, opt.switchedOn)}
            switchedOn={this.props.monthly}
            colorSchema="primary"
            colorSchemaOff="success"
            onIcon="mdi-chevron-right"
            offIcon="mdi-chevron-left"
          />
          &nbsp;
          <UU5.Bricks.Text
            colorSchema={this.props.monthly ? "primary" : undefined}
            content="Měsíc"
            nestingLevel="inline"
          />
        </div>

        <UU5.Bricks.Calendar
          minSelection={this.props.monthly ? "months" : "years"}
          value={this.props.date}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onChange={opt => this.props.onChange(opt.value, this.props.monthly)}
        />
      </UU5.Common.Div>
    );
  }
  //@@viewOff:render
});

export default Filter;
