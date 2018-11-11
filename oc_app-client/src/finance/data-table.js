import React from "react";
import createReactClass from "create-react-class";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";

import "./data-table.less";

export const DataTable = createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "DataTable",
    classNames: {
      main: Config.CSS + "datatable"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMeUU5.Bricks.Table.Thods
  //@@viewOff:overridingMeUU5.Bricks.Table.Thods

  //@@viewOn:componentSpecificHelpers
  _getHeader() {
    let result;

    if (Array.isArray(this.props.header)) {
      result = (
        <UU5.Bricks.Table.THead>
          <UU5.Bricks.Table.Tr>
            {this.props.header.map((value, i) => {
              return <UU5.Bricks.Table.Th key={i} content={value} />;
            })}
          </UU5.Bricks.Table.Tr>
        </UU5.Bricks.Table.THead>
      )
    }

    return result;
  },

  _getBody() {
    let result;

    if (Array.isArray(this.props.rows)) {
      result = (
        <UU5.Bricks.Table.TBody>
          {this.props.rows.map((row, i) => (
            <UU5.Bricks.Table.Tr key={i}>
              {row.map((value, j) => (
                <UU5.Bricks.Table.Td key={j} content={value} />
              ))}
            </UU5.Bricks.Table.Tr>
          ))}
        </UU5.Bricks.Table.TBody>
      )
    }

    return result;
  },

  _getFooter() {
    let result;

    if (Array.isArray(this.props.footer)) {
      result = (
        <UU5.Bricks.Table.TFoot>
          <UU5.Bricks.Table.Tr>
            {this.props.footer.map((value, i) => {
              return <UU5.Bricks.Table.Th key={i} content={value} />;
            })}
          </UU5.Bricks.Table.Tr>
        </UU5.Bricks.Table.TFoot>
      )
    }

    return result;
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Table {...this.getMainPropsToPass()} responsive>
        {this._getHeader()}
        {this._getBody()}
        {this._getFooter()}
      </UU5.Bricks.Table>
    );
  }
  //@@viewOff:render
});

export default DataTable;
