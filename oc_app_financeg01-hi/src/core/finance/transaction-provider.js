//@@viewOn:imports
import { createVisualComponent, useDataList, useEffect } from "uu5g05";
import Uu5Elements, { useAlertBus } from "uu5g05-elements";
import Plus4U5Elements from "uu_plus4u5g02-elements";
import { UuDate } from "uu_i18ng01";
import Config from "../config/config.js";
import Calls from "calls";
//@@viewOff:imports

export function prepareDtoIn(date, monthly) {
  let dateFrom;
  let dateTo;

  const uuDate = new UuDate(date);

  if (monthly) {
    dateFrom = new UuDate(uuDate).startOfMonth();
    dateTo = new UuDate(uuDate).endOfMonth();
  } else {
    dateFrom = new UuDate(uuDate).startOfYear();
    dateTo = new UuDate(uuDate).endOfYear();
  }

  return {
    dateFrom: dateFrom.toIsoString(),
    dateTo: dateTo.toIsoString(),
  };
}

const TransactionProvider = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "TransactionProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    const { date, monthly, children } = props;

    const txDto = useDataList({
      skipInitialLoad: true,
      handlerMap: {
        load: Calls.loadTransactions,
        import: Calls.importTransactions,
      },
      itemHandlerMap: {
        update: Calls.updateTransaction,
      },
    });

    const { state, errorData, handlerMap } = txDto;

    const { addAlert } = useAlertBus();

    useEffect(() => {
      if (state === "error") {
        addAlert({ header: "Error", message: "Error in console" });
        console.error(errorData);
      }
    }, [state]);

    useEffect(() => {
      handlerMap.load(prepareDtoIn(date, monthly));
    }, [date, monthly]);

    let view;
    switch (state) {
      case "pendingNoData":
      case "readyNoData":
        view = <Uu5Elements.Pending size="max" />;
        break;
      case "errorNoData":
        view = <Plus4U5Elements.Error error={errorData} />;
        console.error("Loading transactions error", errorData);
        break;
      default:
        view = children(txDto);
    }

    //@@viewOn:render
    return view;
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { TransactionProvider };
export default TransactionProvider;
//@@viewOff:exports
