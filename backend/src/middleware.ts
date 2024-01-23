import jwt from "jsonwebtoken";

interface jwtPayload {
  userId: string;
}

const authMiddleware = (req: any, res: any, next: any) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET Not found");
  }
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({});
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecret) as jwtPayload;

    req.userId = decoded.userId;

    next();
  } catch (err) {
    return res.status(403).json({});
  }
};
export default authMiddleware;
