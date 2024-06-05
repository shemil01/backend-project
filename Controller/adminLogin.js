const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const adminModel = require("../Model/admin")


const AdminRegister = async (req, res) => {
  const { email, username, password } = req.body;

  if (!(username && email && password)) {
    return res.status(400).send("Fill all fields");
  }

  // Check if user already exists
  const adminExist = await adminModel.findOne({ email });
  if (adminExist) {
    return res.status(401).json({ message: "User already exists" });
  }

  // Password encryption
  const hashPassword = await bcrypt.hash(String(password), 10);

  // Save user
  const adminDt = await adminModel.create({
    username,
    email,
    password: hashPassword,
  });

  // Generate token
  const token = jwt.sign({ id: adminDt._id }, process.env.jwt_secret, {
    expiresIn: "2h",
  });
  res.cookie("token", token);

  adminDt.password = undefined;  // Corrected this line
  return res.status(200).json({
    success: true,
    message: "Account created successfully",
  });
};

// admin login
const getAdmin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await adminModel.findOne({ email });

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
      expiresIn: "1h",
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
    expires: new Date(Date.now() + 60 * 60 * 1000),  // Adjusted expiration time
  });
  res.cookie("refreshToken", refreshToken);
  return res.status(200).json({
    success: true,
    admin:admin,
    message: "Login successfully completed",
  });
};

// refresh token
const generateToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).send("Login your account");
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send("Invalid refresh token");
    }

    const token = jwt.sign(
      { email: decoded.email },
      process.env.ACCES_TOKEN_SECRET,
      {
        expiresIn: "1h",  // Adjusted expiration time
      }
    );
    return res
      .cookie("token", token, {
        expires: new Date(Date.now() + 60 * 60 * 1000),  // Adjusted expiration time
      })
      .send("Refresh token generated");
  });
};

module.exports = { getAdmin, generateToken, AdminRegister };