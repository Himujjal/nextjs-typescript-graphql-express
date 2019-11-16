import React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { startClock, addCount, serverRenderClock } from '../lib/store';

import App from '../components/basic/App';
import Header from '../components/basic/Header';
import Page from '../components/basic/Page';
import withApollo from '../lib/withApollo';

class ReduxC extends React.Component<any> {
	timer: any;
	static getInitialProps({ store, isServer }: any) {
		store.dispatch(serverRenderClock(isServer));
		store.dispatch(addCount());

		return { isServer };
	}

	componentDidMount() {
		this.timer = this.props.startClock();
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	render() {
		return (
			<App>
				<Header />
				<Page title="Redux" />
			</App>
		);
	}
}

const mapDispatchToProps = (dispatch: Dispatch) => {
	return {
		addCount: bindActionCreators(addCount, dispatch),
		startClock: bindActionCreators(startClock, dispatch),
	};
};

export default withApollo(
	connect(
		null,
		mapDispatchToProps,
	)(ReduxC),
);
