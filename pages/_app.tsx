import "../styles/globals.css";
import App from "next/app";
import { Provider } from "react-redux";
import { createWrapper } from "next-redux-wrapper";
import { initStore } from "../redux/store";

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    return {
      pageProps: Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {},
    };
  }

  render() {
    const { Component, pageProps, store } = this.props;
    return (
      // <Provider store={store}>
      <Component {...pageProps} />
      // </Provider>
    );
  }
}

const wrapper = createWrapper(initStore);

export default wrapper.withRedux(MyApp);

// function MyApp({ Component, pageProps }: AppProps) {
//   return <Component {...pageProps} />;
// }
// export default MyApp;
