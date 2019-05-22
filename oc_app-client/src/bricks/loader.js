//@viewOn:imports
import React from "react";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
//@viewOff:imports

export const Loader = createReactClass({

  mixins: [UU5.Common.BaseMixin],

  //@@viewOn:propTypes
  propTypes: {
    data: PropTypes.object,
    onLoad: PropTypes.func,
    loading: PropTypes.node,
    error: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    reloadInterval: PropTypes.number
  },
  //@@viewOn:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      data: undefined,
      onLoad: undefined,
      loading: <UU5.Bricks.Loading />,
      error: dtoOut => (
        <UU5.Common.Error
          errorData={dtoOut}
          content={dtoOut.data && dtoOut.data.error ? dtoOut.data.error : dtoOut.error}
        />
      ),
      reloadInterval: undefined
    }
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  getInitialState() {
    return this._shouldLoad() ? { loaderState: "loading" } : { loaderState: "ready", data: this.props.data };
  },

  componentDidMount() {
    this._initLoading();
  },

  componentWillReceiveProps(nextProps) {
    this.setState({ loaderState: "loading" }, () => this._initLoading(nextProps));
  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _shouldLoad(props = this.props) {
    return !(!props.onLoad && !props.uri && props.data);
  },

  _done(data) {
    this.setAsyncState({ loaderState: "ready", data });
  },

  _fail(data) {
    this.showError("loaderError", null, { context: { data } });
    this.setAsyncState({ loaderState: "error", data });
  },

  _load(props = this.props) {
    if (typeof props.onLoad === "function") {
      props.onLoad({
        data: props.data,
        done: this._done,
        fail: this._fail
      })
    }
  },

  _initLoading(props = this.props) {
    if (this._shouldLoad(props)) {
      this._load(props);

      if (this._interval) {
        clearInterval(this._interval);
      }

      if (props.reloadInterval) {
        this._interval = setInterval(
          () => this._load(props),
          Math.max(props.reloadInterval, this.getDefault("reloadInterval"))
        );
      }
    }
  },

  _getChildren(children) {
    let result;
    if (typeof children === "function") {
      result = children({ data: this.state.data });
    } else {
      result = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { data: this.state.data });
        } else {
          return child;
        }
      })
    }
    return result;
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    let result;
    let isLoading = this.state.loaderState === "loading";
    let isError = this.state.loaderState === "error";

    if (typeof this.props.children === "function") {
      result = this.props.children({ isLoading, isError, data: this.state.data });
    } else {
      if (isLoading) {
        result = this.props.loading;
      } else if (isError) {
        result = this._getChildren(this.props.error);
      } else {
        result = this._getChildren(this.props.children);
      }
    }

    return result;
  }
  //@@viewOff:render
});

export default Loader;
