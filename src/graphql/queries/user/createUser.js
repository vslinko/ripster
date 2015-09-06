import uuid from 'node-uuid';
import bcrypt from 'bcryptjs';
import {executeQuery, cypher} from '../../db';

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
}

export default async function createUser(email, password) {
  const passwordHash = await hashPassword(password);

  const result = await executeQuery(cypher`
    CREATE (u:User {
      uuid: ${uuid.v4()},
      email: ${email},
      password: ${passwordHash},
      role: "USER"
    })
    RETURN u
  `);

  return result.map(row => row.u).shift();
}
