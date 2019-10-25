import React from 'react';
import Router from 'next/router';
import Cookies from 'js-cookie';

const PrivateArea = () => {
  if (!Cookies.get('token')) {
    Router.push('/');
  }

  return <div>Private area!</div>;
};

export default PrivateArea;
