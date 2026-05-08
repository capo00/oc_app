//@@viewOn:imports
import { createVisualComponent, Utils } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Uu5Forms from "uu5g05-forms";
import { UuDate } from "uu_i18ng01";
import Config from "../config/config.js";
//@@viewOff:imports

const DATE_FROM = new UuDate("2014-10-01");

export const uuDateTo = new UuDate().shiftMonth(-1).endOfMonth();

const Filter = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Filter",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    const { date, monthly, onDateChange, onMonthlyChange, accountList, account, onAccountChange, ...restProps } = props;

    let value, min, max;
    if (monthly) {
      value = date.format(undefined, { format: "YYYY-MM" });
      min = DATE_FROM.format(undefined, { format: "YYYY-MM" });
      max = uuDateTo.format(undefined, { format: "YYYY-MM" });
    } else {
      value = date.getYear();
      min = DATE_FROM.getYear();
      max = uuDateTo.getYear();
    }

    const inputProps = {
      value,
      min,
      max,
      onChange: (e) => onDateChange(new UuDate(new Date(e.data.value + ""))),
    };

    const attrs = Utils.VisualComponent.getAttrs(
      restProps,
      Config.Css.css({
        display: "flex",
        alignItems: "center",
        gap: 16,
      })
    );

    //@@viewOn:render
    return (
      <div {...attrs}>
        <div className={Config.Css.css({ display: "inline-flex", alignItems: "center" })}>
          <Uu5Elements.Text colorScheme={monthly ? undefined : "positive"}>Rok</Uu5Elements.Text>
          &nbsp;
          <Uu5Elements.Toggle
            value={monthly}
            onChange={(e) => onMonthlyChange(e.data.value)}
            colorScheme={monthly ? "primary" : "positive"}
            iconOn="uugds-chevron-right"
            iconOff="uugds-chevron-left"
          />
          &nbsp;
          <Uu5Elements.Text colorScheme={monthly ? "primary" : undefined}>Měsíc</Uu5Elements.Text>
        </div>

        {monthly ? <Uu5Forms.Month.Input {...inputProps} /> : <Uu5Forms.Year.Input {...inputProps} />}

        {accountList && (
          <Uu5Elements.ButtonGroup
            itemList={accountList.map((ac) => ({
              children: ac,
              onClick: () => onAccountChange(account === ac ? null : ac),
              colorScheme: account === ac ? "primary" : undefined,
              significance: account === ac ? "highlighted" : "subdued",
            }))}
          />
        )}
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { Filter };
export default Filter;
//@@viewOff:exports
