const jwt = require("jsonwebtoken");

module.exports = function verifyToken(req, res, next) {
  const { token, refreshToken } = req.cookies;

  if (!token) {
    if (!refreshToken) {
      res.status(401).send("Login your account");
    }
    return res.redirect("/api/admin/refresh-token");
  }
  jwt.verify(token, process.env.ACCES_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      res.status(401).json({
        success: false,
        message: "Un authourized",
      });
    }
    req.email = decoded.email;
    next();
  });
};
