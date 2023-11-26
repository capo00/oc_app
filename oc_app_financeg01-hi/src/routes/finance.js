//@@viewOn:imports
import { createVisualComponent, useState } from "uu5g05";
import { withRoute } from "uu_plus4u5g02-app";
import { dateTo } from "../core/finance/filter";

import Config from "./config/config.js";
import TransactionProvider from "../core/finance/transaction-provider";
import FinanceView from "../core/finance/finance-view";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

let Finance = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Finance",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const [date, setDate] = useState(() => {
      let date = new Date();
      date.setMonth(date.getMonth() - 1);

      if (date > dateTo) date = dateTo;

      return date;
    });

    const [monthly, setMonthly] = useState(true);
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <TransactionProvider date={date} monthly={monthly}>
        {(txDto) => (
          <FinanceView
            date={date}
            onDateChange={setDate}
            monthly={monthly}
            onMonthlyChange={setMonthly}
            txDto={txDto}
          />
        )}
      </TransactionProvider>
    );
    //@@viewOff:render
  },
});

Finance = withRoute(Finance, { authenticated: true });

//@@viewOn:exports
export { Finance };
export default Finance;
//@@viewOff:exports
