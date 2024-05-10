const adminSchema = require("../Model/AdminSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { tryCatch } = require("../Utils/tryCatch");

//admin login
const getAdmin = tryCatch(async (req, res) => {
  const { email, password } = req.body;

  const admin = await adminSchema.findOne({ email: email });
  if (!admin) {
    return res.status(404).send("Admin not found");
  }

  const passwordMatch = await bcrypt.compare(password, admin.password);
  if (!passwordMatch) {
    return res.status(401).send("Incorrect password");
  }

  const token = jwt.sign(
    { email: admin.email },
    process.env.ACCES_TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );
  res.cookie = token
  res.status(200).json({
    success: true,
    message: "Login succesfully compleated",
  });
});
//admin logout



module.exports = { getAdmin };
