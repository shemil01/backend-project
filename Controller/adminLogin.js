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
console.log(bcrypt.hashSync("12345",10));
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).send("Incorrect password");
    }

    console.log(process.env.ACCESS_TOKEN_SECRET);
    // const token = jwt.sign(
    //   { email: admin.email },
    //   process.env.ACCESS_TOKEN_SECRET
    // );
    res.json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(400).send(error, "Internal Server Error");
  }
};
 //admin logout
 

module.exports = { getAdmin };
