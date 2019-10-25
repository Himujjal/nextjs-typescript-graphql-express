import express from 'express';
import next from 'next';
import {
  ApolloServer,
  AuthenticationError,
  ApolloServerExpressConfig,
} from 'apollo-server-express';

import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

import { dev, port, SECRET_KEY } from './config';

import { resolvers } from './resolvers';
import { typeDefs } from './schemas';

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp
  .prepare()
  .then(() => {
    // express app configurations
    const expressApp = express();
    expressApp.use(cors());
    expressApp.use(cookieParser(SECRET_KEY));

    const context: ApolloServerExpressConfig['context'] = ({ req }) => {
      const token = req.headers.authorization || '';

      try {
        const data = jwt.verify(token.split(' ')[1], SECRET_KEY);
        return data;
      } catch (error) {
        throw new AuthenticationError('Authentication token is invalid, please log in');
      }
    };
    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      context,
      playground: dev,
    });

    apolloServer.applyMiddleware({ app: expressApp, path: '/graphql' });

    expressApp.get('*', (req, res) => {
      if (req.url !== '/graphql') {
        handle(req, res);
      }
    });

    expressApp.listen(port, () => console.log('Server listening on port http://localhost:3000'));
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
