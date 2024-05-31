console.log('Starting adminLogin.js');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

console.log('Before requiring AdminSchema');
const AdminSchema = require("../Model/AdminSchema");
console.log('AdminSchema required successfully');

//admin login
const getAdmin = async (req, res) => {
  console.log('getAdmin called');
  const { email, password } = req.body;
  const admin = await AdminSchema.findOne({ email: email });
  console.log('Admin found:', admin);

  if (!admin) {
    return res.status(404).send("Admin not found");
  }
                                                                 
  const passwordMatch = await bcrypt.compare(password, admin.password);
  console.log('Password match:', passwordMatch);

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
  console.log('generateToken called');
  const tokens = req.cookies.refreshToken;
  if (!tokens) {
    res.status(401).send("login your accound");
  }
  const decoded = jwt.verify(tokens, process.env.REFRESH_TOKEN_SECRET);
  console.log('Decoded:', decoded);

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
