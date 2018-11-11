import React from "react";
import createReactClass from "create-react-class";
import UU5 from "uu5g04";
import "uu5g04-bricks";

import Config from "./config/config.js";
import TransactionsImport from "../finance/transactions-import.js";

import "./finance-import.less";

const FinanceImport = createReactClass({
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.RouteMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "FinanceImport",
    classNames: {
      main: Config.CSS + "financeimport"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  componentWillMount() {
    document.title = "ocApp | Finance | Import";
  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Section {...this.getMainPropsToPass()} header="Import transakcí">
        <TransactionsImport />
      </UU5.Bricks.Section>
    );
  }
  //@@viewOff:render
});

export default FinanceImport;
