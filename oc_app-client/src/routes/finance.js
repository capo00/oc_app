import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
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
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {};
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  componentWillMount() {
    document.title = "ocApp | Finance";
  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _getFrom() {
    let date = new Date();
    date.setMonth(date.getMonth() ? date.getMonth() - 1 : 0);
    return date;
  },

  _getTo() {
    return new Date();
  },

  _submitFilter(values) {
    this._transactions.setFilter(values);
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    let from = this._getFrom();
    let to = this._getTo();

    return (
      <UU5.Bricks.Section {...this.getMainPropsToPass()} header="Transakce">
        <Filter onSubmit={this._submitFilter} from={from} to={to} />
        <Transactions ref_={tx => this._transactions = tx} from={from} to={to} />
      </UU5.Bricks.Section>
    );
  }
  //@@viewOff:render
});

export default Finance;
