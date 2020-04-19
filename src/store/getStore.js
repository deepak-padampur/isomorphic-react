import { createStore, applyMiddleWare, combineReducers } from 'redux'
import { identity } from 'lodash';

export default (defaultState = { test: "Test Value" }) => {
  //define a new store
  const store = createStore(identity, defaultState);
  return store;
}