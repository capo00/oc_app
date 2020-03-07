import React from "react";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import { createComponent, useState } from "uu5g04-hooks";

import { Css } from "../config/config";
import Config from "./config/config.js";
import MonthSummary from "./month-summary";
import YearSummary from "./year-summary";

const Summary = createComponent({

  //@@viewOn:statics
  displayName: Config.TAG + "Summary",
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:render
  render({ accounts, monthly, data, date }) {
    //@@viewOn:hooks
    const [account, setAccount] = useState(null);
    //@@viewOff:hooks

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:private
    const displayedData = account ? data.filter(acc => acc.code === account) : data;
    //@@viewOff:private

    //@@viewOn:render
    return (
      <div className={Css.css`margin-top: 16px;`}>
        {!!accounts.length && (
          <div className={Css.css`text-align: center;`}>
            <UU5.Bricks.ButtonGroup>
              {accounts.map(acc => (
                <UU5.Bricks.Button
                  key={acc}
                  onClick={() => setAccount(account === acc ? null : acc)}
                  content={acc}
                  bgStyle="transparent"
                  colorSchema="primary"
                  pressed={account === acc}
                />
              ))}
            </UU5.Bricks.ButtonGroup>
          </div>
        )}
        {monthly
          ? <MonthSummary data={displayedData} month={UU5.Common.Tools.formatDate(date, "Y/mm")} />
          : <YearSummary data={displayedData} year={date.getFullYear()} />}
      </div>
    );
    //@@viewOff:render
  }
  //@@viewOff:render
});

export default Summary;
