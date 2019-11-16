import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import * as React from 'react';
import { BooksQuery } from '../__generated__/BooksQuery';
import { connect } from 'react-redux';
import withApollo from '../lib/withApollo';

const booksQuery = gql`
	query BooksQuery {
		books {
			title
			author
		}
	}
`;

class BookList extends React.Component<{}, {}> {
	render() {
		return (
			<Query<BooksQuery> query={booksQuery}>
				{({ loading, error, data }) => {
					if (error) return <div>{JSON.stringify(error)}</div>;
					if (loading) return <div>Loading</div>;
					if (!data) return <div>Loading</div>;

					return (
						<section>
							<ul>
								{data.books.map((book, index) => (
									<li key={book.title}>
										<span>{index + 1}. </span>
										<div>{book.title}</div>
										<div>{book.author}</div>
									</li>
								))}
							</ul>
						</section>
					);
				}}
			</Query>
		);
	}
}

export default BookList;
