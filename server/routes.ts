import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { users } from './dummyData';

export const SECRET_KEY = 'secret!';

export const login = async (req, res) => {
  const { email, password } = req.body;
  const theUser = users.find(user => user.email === email);

  if (!theUser) {
    res.status(404).send({
      success: false,
      message: `Could not find account: ${email}`,
    });
    return;
  }

  const match = await bcrypt.compare(password, theUser.password);
  if (!match) {
    //return error to user to let them know the password is incorrect
    res.status(401).send({
      success: false,
      message: 'Incorrect credentials',
    });
    return;
  }

  const token = jwt.sign({ email: theUser.email, id: theUser.id }, SECRET_KEY);

  res.send({
    success: true,
    token: token,
  });
};
