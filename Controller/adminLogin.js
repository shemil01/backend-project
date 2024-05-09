const adminSchema = require("../Model/AdminSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


//admin login
const getAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await adminSchema.findOne({ email:email });
    if (!admin) {
      return res.status(404).send("Admin not found");
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).send("Incorrect password");
    }

    const token = jwt.sign(
      { email: admin.email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn:"1m"
      }
    );
    const refreshToken = jwt.sign({email:admin.email},
      process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:"7d"
      }
    )
    res.cookie("token", accessToken, {
      expires: new Date(Date.now() + 60 * 1000)
  });
  res.cookie("refreshToken", refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000 });
  return res.status(200).json({ status: "success", message: "Logged in" });


  
    res.json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(400).send(error, "Internal Server Error");
  }
};
 //admin logout
 

module.exports = { getAdmin };
