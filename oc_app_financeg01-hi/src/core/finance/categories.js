//@@viewOn:imports
import { createVisualComponent, useDataObject, useState, Utils } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Config from "../config/config.js";
import Calls from "calls";
import DataTable from "./data-table";
import Category from "./model/category";

//@@viewOff:imports

function CategoryList({ category, dateFrom, dateTo, account }) {
  const { state, data } = useDataObject({
    handlerMap: {
      load: () => Calls.loadTransactions({ category, account, dateFrom, dateTo }),
    },
  });

  let result;

  switch (state) {
    case "pendingNoData":
      result = <Uu5Elements.Pending size="xl" />;
      break;
    case "ready":
      const sortedList = data.itemList.toSorted((itemA, itemB) => (itemA.date > itemB.date ? -1 : 1));
      result = <DataTable data={sortedList} />;
      break;
    default:
      console.error("Unknown state, data", state, data);
      result = <div>Unknown state {state}</div>;
  }

  return result;
}

const Categories = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Categories",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    const { txList, dateFrom, dateTo, account, ...restProps } = props;
    const [category, setCategory] = useState();

    const groups = {};
    const groupOther = new Set();
    txList.forEach((tx) => {
      if (tx.category) {
        const group = Category.findGroup(tx.category);
        if (group) {
          groups[group.name] ||= new Set();
          groups[group.name].add(tx.category);
        } else {
          groupOther.add(tx.category);
        }
      }
    });

    if (groupOther.size > 0) groups["Ostatní"] = groupOther;

    //@@viewOn:render
    return (
      <>
        <Uu5Elements.Block
          header="Kategorie"
          headerType="heading"
          {...restProps}
          className={Utils.Css.joinClassName(restProps.className, Config.Css.css({ marginTop: 40 }))}
        >
          <Uu5Elements.Grid templateColumns="repeat(auto-fill, minmax(320px, 1fr))">
            {Object.keys(groups).map((groupName) => (
              <fieldset
                key={groupName}
                className={Config.Css.css({
                  padding: 8,
                  borderRadius: Uu5Elements.UuGds.RadiusPalette.getValue(["box", "moderate"]),
                })}
              >
                <legend className={Config.Css.css({ paddingInline: 8 })}>{groupName}</legend>
                <Uu5Elements.MenuList
                  itemList={[...groups[groupName]].map((cat) => ({
                    children: Category.CONFIG[cat].name,
                    onClick: () => setCategory(cat),
                    tooltip: cat,
                  }))}
                />
              </fieldset>
            ))}
          </Uu5Elements.Grid>
        </Uu5Elements.Block>
        <Uu5Elements.Modal open={!!category} onClose={() => setCategory(null)} header={category} width="full">
          {category && <CategoryList category={category} dateFrom={dateFrom} dateTo={dateTo} account={account} />}
        </Uu5Elements.Modal>
      </>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { Categories };
export default Categories;
//@@viewOff:exports
