import ThemeProvider from '@material-ui/styles/ThemeProvider';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';
import App from './App';
import { rootReducer } from './redux/reducers/index';
import theme from './theme';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['socket'],
};

// const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(rootReducer, composeEnhancers());
const persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    {/* <PersistGate loading={null} persistor={persistor}> */}
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
    {/* </PersistGate> */}
  </Provider>,
  document.getElementById('root'),
);
