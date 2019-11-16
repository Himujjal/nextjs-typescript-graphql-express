import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { addCount } from '../../lib/store';

class AddCount extends Component<any> {
	add = () => {
		this.props.addCount();
	};

	render() {
		const { count } = this.props;
		return (
			<div>
				<h1>
					AddCount: <span>{count}</span>
				</h1>
				<button onClick={this.add}>Add To Count</button>
				<style jsx>{`
					h1 {
						font-size: 20px;
					}
					div {
						padding: 0 0 20px 0;
					}
				`}</style>
			</div>
		);
	}
}

const mapStateToProps = ({ count }: { count: number }) => ({ count });

const mapDispatchToProps = (dispatch: Dispatch) => {
	return {
		addCount: bindActionCreators(addCount, dispatch),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(AddCount);
