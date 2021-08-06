import React from "react";
import { Provider } from "react-redux";
//import { createStore, applyMiddleware } from "redux";
//import thunk from "redux-thunk";
import ReactDOM from "react-dom";
import App from "./App";
import store from "./utils/Rootstore/store";
import "./mainPolygon.css";

//const middlewares = [thunk];

//const store = createStore(() => [], {}, applyMiddleware(...middlewares));

ReactDOM.render(
  //const store = useContext(ReactReduxContext)
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
