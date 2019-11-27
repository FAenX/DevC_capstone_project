import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


/**
 * Hash Password Method
 * @param {string} password
 * @returns {string} returns hashed password
 */
exports.hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
/**
 * comparePassword
 * @param {string} hashPassword
 * @param {string} password
 * @returns {Boolean} return True or False
 */
exports.comparePassword = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);
/**
 * isValidEmail helper method
 * @param {string} email
 * @returns {Boolean} True or False
 */
exports.isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
/**
 * Gnerate Token
 * @param {string} id
 * @returns {string} token
 */
exports.JWTToken = (user) => {
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });
  return token;
};
