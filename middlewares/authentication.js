const jwt = require("jsonwebtoken");
require("dotenv").config();

const checkForAuthenticationCookie = async (req, res, next) => {
  const token = req.headers["x-auth-token"];
  if (!token) {
    return res.status(401).json({
      errors: [
        {
          msg: "Token not found",
          success: false,
        },
      ],
    });
  }

  try {
    const user = jwt.verify(token, process.env.SECERT_JWT_TOKEN);
    req.userAuth = user;
    next();
  } catch (error) {
    return res.status(403).json({
      errors: [
        {
          msg: "Invalid token",
          success: false,
        },
      ],
    });
  }
};

module.exports = checkForAuthenticationCookie;
