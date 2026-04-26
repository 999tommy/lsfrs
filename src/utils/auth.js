// Simple base64 "hashing" for demo purposes. Not secure for production!
export const hashPassword = (password) => {
  try {
    return btoa(password + '_lsfrs');
  } catch(e) {
    return password;
  }
};

export const verifyPassword = (password, hashedPassword) => {
  return hashPassword(password) === hashedPassword;
};
