import React from "react";
import createReactClass from "create-react-class";
import UU5 from "uu5g04";
import "uu5g04-bricks";

import Config from "./config/config.js";
import Filter from "../finance/filter.js";
import Transactions from "../finance/transactions.js";

import "./finance.less";

const Finance = createReactClass({
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.RouteMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Finance",
    classNames: {
      main: Config.CSS + "finance"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  getInitialState() {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);

    return {
      date,
      monthly: true
    };
  },

  componentWillMount() {
    document.title = "ocApp | Finance";
  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _onChange(date, monthly) {
    this.setState({ date, monthly });
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Section {...this.getMainPropsToPass()} header="Transakce">
        <Filter onChange={this._onChange} date={this.state.date} monthly={this.state.monthly} />
        <Transactions date={this.state.date} monthly={this.state.monthly} />
      </UU5.Bricks.Section>
    );
  }
  //@@viewOff:render
});

export default Finance;
