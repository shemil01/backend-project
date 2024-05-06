const adminSchema = require("../Model/AdminSchema");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await adminSchema.findOne({ email });
        if (!admin) {
            return res.status(404).send("Admin not found");
        }
        
        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            return res.status(401).send("Incorrect password");
        }
        
        const token = jwt.sign({ email: admin.email }, process.env.ACCESS_TOKEN_SECRET); 
        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(400).send(error,"Internal Server Error");
    }
};




