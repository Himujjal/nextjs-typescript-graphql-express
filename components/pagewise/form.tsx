import React, { useState } from 'react';
import Router from 'next/router';

const url = 'http://localhost:4000/api/login';

const Form = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();

    const options = {
      method: 'post',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: `email=${email}&password=${password}`,
    };

    const res = await fetch(url, options);
    if (!res.ok) {
      if (res.status === 404) {
        alert('Email not found, please retry');
      }
      if (res.status === 401) {
        alert('Email and password do not match, please retry');
      }
    }
    const jsonRes = await res.json();
    if (jsonRes.success) {
      document.cookie = `token=` + jsonRes.token;
      Router.push('/private-area');
    }
  };

  return (
    <div>
      <form onSubmit={submitForm}>
        <p>
          Email:{' '}
          <input type="text" onChange={event => setEmail(event.target.value)} />
        </p>
        <p>
          Password:{' '}
          <input
            type="password"
            onChange={event => setPassword(event.target.value)}
          />
        </p>
        <p>
          <button type="submit">Login</button>
        </p>
      </form>
    </div>
  );
};

export default Form;
