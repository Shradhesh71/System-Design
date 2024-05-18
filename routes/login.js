const User = require("../models/user");
const { Router } = require("express");
const bodyParser = require("body-parser");
const bcryptjs = require("bcryptjs");
const createTokenForUser = require("../controllers/tokenCreate");

const router = Router();
router.use(bodyParser.json());

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ error: "User does not exist", success: false });
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ error: "Invalid password", success: false });
    }

    const token = createTokenForUser(user);

    return res.json({
      token: token,
      messsage: "Login Successful",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json("/", {
      error: "Incorrect Email or Password",
      success: false,
    });
  }
});

module.exports = router;
