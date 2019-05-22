import React from "react";
import createReactClass from "create-react-class";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import Calls from "../calls.js";
import Loader from "../bricks/loader.js";
import MonthSummary from "./month-summary.js";
import YearSummary from "./year-summary.js";

export const Transactions = createReactClass({

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _getData() {
    let dateFrom;
    let dateTo;

    if (this.props.monthly) {
      dateFrom = new Date(this.props.date.getFullYear(), this.props.date.getMonth(), 1);
      dateTo = new Date(this.props.date.getFullYear(), this.props.date.getMonth() + 1, 0);
    } else {
      dateFrom = new Date(this.props.date.getFullYear(), 0, 1);
      dateTo = new Date(this.props.date.getFullYear(), 12, 0);
    }

    return {
      dateFrom: UU5.Common.Tools.formatDate(dateFrom, "Y-mm-dd"),
      dateTo: UU5.Common.Tools.formatDate(dateTo, "Y-mm-dd")
    };
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    return (
      <Loader onLoad={Calls.loadTransactions} data={this._getData()}>
        {({ data, isLoading, isError }) => {
          let result;

          if (isLoading) {
            result = <UU5.Bricks.Loading />;
          } else if (isError) {
            result = <UU5.Common.Error content="Data ze serveru nelze načíst" errorData={data} />;
          } else {
            result = this.props.monthly
              ? <MonthSummary data={data.itemList} month={UU5.Common.Tools.formatDate(this.props.date, "Y/mm")} />
              : <YearSummary data={data.itemList} year={this.props.date.getFullYear()} />;
          }

          return result;
        }}
      </Loader>
    )
  }
  //@@viewOff:render
});

export default Transactions;
