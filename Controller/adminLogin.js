const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const admins = require("../Model/AdminSchema");



//admin register
const AdminRegister = async (req, res) => {
  const { email, username, password } = req.body;
  // const data = JSON.parse(req.body.data)

  if (!(username && email && password )) {
    res.status(400).send("Fill all fields");
  }
  //check user is exist or not
  const admiExist = await admins.findOne({ email });
  if (admiExist) {
    res.status(401).json({ message: "User already exist" });
  }

  //password bcrypt

  const hashPassword = await bcrypt.hash(String(password), 10);
  //save user
  const adminDt = await admins.create({
    username,
    email,
    password: hashPassword,
  });

  //generate token

  const token = jwt.sign({ id: adminDt._id }, process.env.jwt_secret, {
    expiresIn: "2h",
  });
  // user.token = token;
  res.cookie("token", token);

  user.password = undefined;
  res.status(200).json({
    success: true,
    message: "Account created successfully",
  });
};

//admin login
const getAdmin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await admins.findOne({email:email});
  console.log("admin",admin)         

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
      expires: new Date(Date.now() + 60 * 1000 * 5),
    })
    .send("refresh token generated");
};

module.exports = { getAdmin, generateToken,AdminRegister };
