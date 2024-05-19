const User = require("../models/user");
const { Router } = require("express");
const bodyParser = require("body-parser");
const createTokenForUser = require("../controllers/tokenCreate");

const router = Router();
router.use(bodyParser.json());

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ error: "User Already Exists", success: false });
    }
    await User.create({
      email,
      password,
    });

    user = await User.findOne({ email });
    const token = createTokenForUser(user);
    logger.info("Request come from live server /register route");
    
    return res.status(200).json({
      token: token,
      messsage: "Register Successful",
      success: true,
    });
  } catch (error) {
    logger.error(error.message);
    console.log(error);
    return res.status(404).json({
      error: "Incorrect Email or Password",
      success: false,
    });
  }
});

module.exports = router;
