"use strict";
const crypto = require('crypto');

(function () {
/*
 * Return a salted and hashed password entry from a
 * clear text password.
 * @param {string} clearTextPassword
 * @return {object} passwordEntry
 * where passwordEntry is an object with two string
 * properties:
 * salt - The salt used for the password.
 * hash - The sha1 hash of the password and salt
 */
function makePasswordEntry(clearTextPassword) {
  let salt, hash;

  //use an 8 byte salt
  salt = crypto.randomBytes(8).toString();

  //create hash function
  const hashFunction = crypto.createHash('sha256');

  //hash password and salt
  hashFunction.update(clearTextPassword + salt);
  hash = hashFunction.digest('utf8');

  return {
    salt: salt,
    hash: hash,
  };
}
/*
 * Return true if the specified clear text password
 * and salt generates the specified hash.
 * @param {string} hash
 * @param {string} salt
 * @param {string} clearTextPassword
 * @return {boolean}
 */
function doesPasswordMatch(hash, salt, clearTextPassword) {

  //create hash function
  const hashFunction = crypto.createHash('sha256');

  //compute expected hash
  hashFunction.update(clearTextPassword + salt);
  let expected = hashFunction.digest('utf8');

  return (hash === expected);
}

var cs142password = {
	makePasswordEntry: makePasswordEntry,
	doesPasswordMatch: doesPasswordMatch,
}

if( typeof exports !== 'undefined' ) {
      // We're being loaded by the Node.js module loader ('require') so we use its
      // conventions of returning the object in exports.
      exports.cs142password = cs142password;
   } else {
      // We're not in the Note.js module loader so we assume we're being loaded
      // by the browser into the DOM.
      window.cs142password = cs142password;
   }

}

)();