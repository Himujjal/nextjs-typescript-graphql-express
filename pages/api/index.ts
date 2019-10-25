import { ApolloServer, gql } from 'apollo-server-micro';
import microCors from 'micro-cors';

import { dev } from '../../components/lib/config';

const typeDefs = gql`
	type Query {
		users: [User!]!
	}
	type User {
		name: String
	}
`;

const resolvers = {
	Query: {
		users(parent: any, args: any, context: any) {
			console.log(JSON.stringify(parent));
			console.log(JSON.stringify(args));
			console.log(JSON.stringify(context));
			return [{ name: 'Nextjs' }];
		},
	},
};

const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	context: async ({ req }, ...args: any[]) => {
		// handle authentication requests here
		console.log(`--cookies--`, req.cookies, '----');
		console.log(`--query--`, req.query, '----');
		console.log(`--body--`, req.body, '----');

		return { query: req.query, body: req.body };
	},
	playground: dev,
});

export const config = {
	api: {
		bodyParser: false,
	},
};

const cors = microCors({ allowMethods: ['GET'] });
export default cors(apolloServer.createHandler({ path: '/api' }));
