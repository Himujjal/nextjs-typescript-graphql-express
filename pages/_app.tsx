import App from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import { initStore } from '../lib/store';
import withApollo from '../lib/withApollo';
// import { withApollo } from 'react-apollo';

class MyApp extends App {
	static async getInitialProps({ Component, router, ctx }: any) {
		let pageProps = {};

		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx);
		}

		return { pageProps };
	}

	render() {
		const { Component, pageProps, store } = this.props as any;
		return (
			<Provider store={store}>
				<Component {...pageProps} />
			</Provider>
		);
	}
}

export default withRedux(initStore)(withApollo(MyApp));
