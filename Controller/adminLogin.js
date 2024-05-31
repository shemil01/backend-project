const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require('path');
const AdminSchema = require(path.resolve(__dirname, './model/AdminSchema.js'));

console.log('AdminSchema loaded successfully');



//admin login
const getAdmin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await AdminSchema.findOne({ email: email });

  if (!admin) {
    return res.status(404).send("Admin not found");
  }
                                                                 
  const passwordMatch = await bcrypt.compare(password, admin.password);

  if (!passwordMatch) {
    return res.status(403).send("Incorrect password");
  }

  const token = jwt.sign(
    { email: admin.email },
    process.env.ACCES_TOKEN_SECRET,
    {
      expiresIn: "5m",
    } 
  );
  const refreshToken = jwt.sign(
    { email: admin.email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "12h",
    }
  );
  res.cookie("token", token, {
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.cookie("refreshToken", refreshToken);
  res.status(200).json({
    success: true,
    message: "Login succesfully compleated",
  });
};

//refresh token

const generateToken = async (req, res) => {
  const tokens = req.cookies.refreshToken;
  if (!tokens) {
    res.status(401).send("login your accound");
  }
  const decoded = jwt.verify(tokens, process.env.REFRESH_TOKEN_SECRET);

  const token = jwt.sign(
    { email: decoded.email },
    process.env.ACCES_TOKEN_SECRET,
    {
      expiresIn: "1m",
    }
  );
  res
    .cookie("token", token, {
      expires: new Date(Date.now() + 60 * 1000*5),
    })
    .send("refresh token generated");
};

module.exports = { getAdmin, generateToken };
