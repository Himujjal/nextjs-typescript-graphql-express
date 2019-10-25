import React from 'react';
import { NextPageContext } from 'next';

import Layout from '../components/pagewise/Layout';
import List from '../components/pagewise/list-class/List';
import { IDataObject } from '../components/pagewise/types';

type Props = {
  items: IDataObject[];
};

class ListClass extends React.Component<Props> {
  static async getInitialProps({ pathname }: NextPageContext) {
    // Example for including initial props in a Next.js page.
    // Don't forget to include the respective types for any
    // props passed into the component
    const dataArray: IDataObject[] = [
      { id: 101, name: 'larry' },
      { id: 102, name: 'sam' },
      { id: 103, name: 'jill' },
      { id: 104, name: pathname },
    ];

    return { items: dataArray };
  }

  render() {
    return (
      <Layout title="List Example | Next.js + TypeScript Example">
        <List items={this.props.items} />
      </Layout>
    );
  }
}

export default ListClass;
