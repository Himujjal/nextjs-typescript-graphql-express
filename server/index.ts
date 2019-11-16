import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';

import { bookTypeDefs } from './typeDefs';
import { bookResolver } from './resolvers';

import next from 'next';
import config from '../config';

const nextApp = next({ dev: config.dev });
const nextHandle = nextApp.getRequestHandler();

nextApp
	.prepare()
	.then(() => {
		const server = new ApolloServer({
			typeDefs: [bookTypeDefs],
			resolvers: [bookResolver],
			introspection: true,
			playground: config.dev,
		});

		const app = express();
		app.use(cors());

		server.applyMiddleware({ app, path: '/api' });

		app.get('*', (req, res) => nextHandle(req, res));

		const port = process.env.PORT || 3100;

		app.listen(port, () => console.log(`🚀 Server ready at ${server.graphqlPath}`));
	})
	.catch(ex => {
		console.error(ex.stack);
		process.exit(1);
	});
