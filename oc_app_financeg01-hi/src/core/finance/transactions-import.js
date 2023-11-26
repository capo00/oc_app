//@@viewOn:imports
import { createVisualComponent, useState, Utils } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Uu5Forms from "uu5g05-forms";
import Uu5CodeKit from "uu5codekitg01";
import Config from "../config/config.js";
import CSV from "./model/csv";
import Balance from "./model/balance";
//@@viewOff:imports

const TransactionsImport = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "TransactionsImport",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    const { onImport } = props;

    function handleChange(e) {
      if (e.data.value) {
        let reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (event) => {
          let rows = CSV.convert(event.target.result);
          let txs = Balance.getTransactions(rows);
          e.data.form.setItemValue("transactions", txs);
        };

        // Read text
        reader.readAsText(e.data.value);
      } else {
        e.data.form.setItemValue("transactions", null);
      }
    }

    function handleSubmit(e) {
      onImport({
        data:
          typeof e.data.value.transactions === "string"
            ? JSON.parse(e.data.value.transactions)
            : e.data.value.transactions,
      });
    }

    //@@viewOn:render
    return (
      <Uu5Forms.Form onSubmit={handleSubmit}>
        <Uu5Forms.FormFile name="file" label="Export z banky" onChange={handleChange} required />

        <Uu5Forms.SubmitButton />

        <Uu5Elements.Panel header="Data">
          <Uu5CodeKit.FormJson name="transactions" format="pretty" maxRows={1000} displayGutter={false} />
        </Uu5Elements.Panel>
      </Uu5Forms.Form>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { TransactionsImport };
export default TransactionsImport;
//@@viewOff:exports
