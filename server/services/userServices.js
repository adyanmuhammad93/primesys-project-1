import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const signUp = async (userData) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(userData.password, salt);
  const [result] = await db.execute(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [userData.email, hashedPassword]
  );
  return result;
};

// const logIn = async (userData) => {
//   const [users] = await db.execute("SELECT * FROM users WHERE username = ?", [
//     userData.email,
//   ]);
//   const user = users[0];
//   if (user && bcrypt.compareSync(userData.password, user.password)) {
//     const token = jwt.sign(
//       { id: user.id },
//       "this-is-secret-key-and-it-should-be-at-least-32-characters"
//     );
//     return { user, token };
//   }
//   return { error: "Invalid username or password" };
// };

const logIn = async (userData) => {
  const [users] = await db.execute("SELECT * FROM users WHERE username = ?", [
    userData.email,
  ]);
  if (users.length === 0) {
    return { error: "Username does not exist" };
  }
  const user = users[0];
  if (!bcrypt.compareSync(userData.password, user.password)) {
    return { error: "Incorrect password" };
  }
  const token = jwt.sign(
    { id: user.id },
    "this-is-secret-key-and-it-should-be-at-least-32-characters"
  );
  return { user, token };
};

export { signUp, logIn };
