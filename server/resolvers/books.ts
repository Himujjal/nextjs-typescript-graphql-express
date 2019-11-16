import { books } from '../dataSources/books';

export default {
	Query: {
		books: () => books,
	},
};
