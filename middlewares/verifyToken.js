const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const Authorization = req.header("Authorization");

  if (!Authorization) {
    //error Unauthorized
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    return next(err);
  }

  //Get token
  const token = Authorization.replace("Bearer ", "");

  //verify
  const { userId } = jwt.verify(token, process.env.APP_SECRET);

  //Assign req
  req.user = { userId };
  next();
};
