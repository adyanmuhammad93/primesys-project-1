import jwt from "jsonwebtoken";

export default function (...allowedRoles) {
  return function (req, res, next) {
    const token = req.header("auth-token");
    if (!token) return res.status(401).send("Access Denied");

    try {
      const verified = jwt.verify(
        token,
        "this-is-secret-key-and-it-should-be-at-least-32-characters"
      );
      req.user = verified;

      // Check if the user's role is authorized
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).send("Forbidden");
      }

      next();
    } catch (err) {
      res.status(400).send("Invalid Token");
    }
  };
}
