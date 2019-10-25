import { NextPageContext } from 'next';
import Layout from '../components/pagewise/Layout';
import List from '../components/pagewise/list-class/List';
import { IDataObject } from '../components/pagewise/types';

interface IProps {
  items: IDataObject[];
}

interface StatelessPage<P = {}> extends React.SFC<P> {
  getInitialProps?: (ctx: NextPageContext) => Promise<P>;
}

const ListFunction: StatelessPage<IProps> = ({ items }) => (
  <Layout title="List Example (with Function Components) | Next.js + TypeScript Example">
    <List items={items} />
  </Layout>
);

ListFunction.getInitialProps = async ({ pathname }) => {
  // Example for including initial props in a Next.js function compnent page.
  // Don't forget to include the respective types for any props passed into
  // the component.
  const dataArray: IDataObject[] = [
    { id: 101, name: 'larry' },
    { id: 102, name: 'sam' },
    { id: 103, name: 'jill' },
    { id: 104, name: pathname },
  ];

  return { items: dataArray };
};

export default ListFunction;
