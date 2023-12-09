//@@viewOn:imports
import { createVisualComponent, useMemo, useState } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Filter from "./filter";
import Config from "../config/config.js";
import { prepareDtoIn } from "./transaction-provider";
import TransactionsImport from "./transactions-import";
import MonthSummary from "./month-summary";
import YearSummary from "./year-summary";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const FinanceView = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "FinanceView",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { date, onDateChange, monthly, onMonthlyChange, txDto } = props;

    const [importOpen, setImportOpen] = useState(false);

    const accountList = useMemo(
      () => (txDto.data ? [...new Set(txDto.data.map(({ data }) => data.code))] : null),
      [txDto.data]
    );
    const [account, setAccount] = useState(null);

    async function handleImport(data) {
      await txDto.handlerMap.import(data);
      txDto.handlerMap.load(prepareDtoIn(date, monthly));
    }
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const Summary = monthly ? MonthSummary : YearSummary;

    const sumData = useMemo(() => {
      return txDto.data.filter(({ data }) =>
        account ? data.code === account : !accountList.find((ac) => data.account?.startsWith(ac))
      );
    }, [txDto.data, account, accountList]);

    return (
      <>
        <Uu5Elements.Block
          header="Transakce"
          headerType="heading"
          level={2}
          {...props}
          className={Config.Css.css({ padding: 32 })}
          actionList={[{ icon: "uugds-upload", onClick: () => setImportOpen(true) }]}
        >
          <Filter
            date={date}
            onDateChange={onDateChange}
            monthly={monthly}
            onMonthlyChange={onMonthlyChange}
            accountList={accountList}
            account={account}
            onAccountChange={setAccount}
            className={Config.Css.css({ marginBottom: 32 })}
          />
          {txDto.state === "pending" && txDto.pendingData.operation === "load" ? (
            <Uu5Elements.Pending size="max" />
          ) : txDto.data.length ? (
            <Summary data={sumData} date={date} />
          ) : (
            <Uu5Elements.PlaceholderBox code="items" />
          )}
        </Uu5Elements.Block>
        <Uu5Elements.Modal
          open={importOpen}
          onClose={() => setImportOpen(false)}
          header="Import transakcí"
          width="full"
        >
          <TransactionsImport onImport={handleImport} />
        </Uu5Elements.Modal>
      </>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { FinanceView };
export default FinanceView;
//@@viewOff:exports
