const JWT = require("jsonwebtoken");

const secret = process.env.SECERT_JWT_TOKEN;

function createTokenForUser(user) {
  console.log(user);
  const payload = {
    id: user._id,
    email: user.email,
    isVoted: user.isVoted,
    createdAt: user.createdAt,
  };
  const token = JWT.sign(payload, secret, {
    expiresIn: "6h",
  });
  return token;
}

module.exports = createTokenForUser;
