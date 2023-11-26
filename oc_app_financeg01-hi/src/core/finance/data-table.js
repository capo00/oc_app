//@@viewOn:imports
import { createVisualComponent, Fragment, useState, Utils } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Uu5Forms from "uu5g05-forms";
import Uu5TilesElements from "uu5tilesg02-elements";
import Uu5CodeKit from "uu5codekitg01";
import Config from "../config/config.js";
//@@viewOff:imports

const DataTable = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "DataTable",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    const { data } = props;

    const [item, setItem] = useState();
    let itemData, updateItem;
    if (item) {
      const { handlerMap, ...restItem } = item;
      itemData = restItem;
      updateItem = handlerMap.update;
    }

    //@@viewOn:render
    return (
      <>
        <Uu5TilesElements.Table
          data={data}
          columnList={[
            {
              value: "date",
              header: "Datum",
              cell: ({ data }) => <Uu5Elements.DateTime value={data.date} timeFormat="none" dateFormat="short" />,
              maxWidth: "max-content",
            },
            {
              value: "value",
              header: "Částka",
              cell: ({ data }) => <Uu5Elements.Number value={data.value} currency={data.currency} />,
              cellComponent: <Uu5TilesElements.Table.Cell horizontalAlignment="right" />,
              maxWidth: "max-content",
            },
            {
              value: "account",
              header: "Účet",
              cell: ({ data }) => (
                <>
                  {data.accountName}
                  <br />
                  {data.account}
                </>
              ),
              maxWidth: "max-content",
            },
            {
              value: "details",
              header: "Detail",
              cell: ({ data }) => (
                <>
                  {data.details.split("\n").map((text, i) => (
                    <Fragment key={i}>
                      {i > 0 && <br />}
                      {text}
                    </Fragment>
                  ))}
                </>
              ),
            },
          ]}
          getActionList={({ data }) => {
            return [{ icon: "uugdsstencil-it-json", onClick: () => setItem(data) }];
          }}
        />
        {item && (
          <Uu5Forms.Form.Provider
            onSubmit={async (e) => {
              const value = e.data.value.data;
              await updateItem(typeof value === "string" ? JSON.parse(value) : value);
              setItem(null);
            }}
          >
            <Uu5Elements.Modal
              open
              onClose={() => setItem(null)}
              header="Data"
              footer={<Uu5Forms.SubmitButton>Aktualizovat</Uu5Forms.SubmitButton>}
            >
              <Uu5CodeKit.FormJson name="data" initialValue={itemData} format="pretty" maxRows={1000} />
            </Uu5Elements.Modal>
          </Uu5Forms.Form.Provider>
        )}
      </>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { DataTable };
export default DataTable;
//@@viewOff:exports
