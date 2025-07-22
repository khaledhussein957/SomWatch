import jwt from "jsonwebtoken";

const protectRoute = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        // Check for existence and format of the Authorization header
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Missing or invalid Authorization header" });
        }

        const token = authHeader.split(" ")[1];

        // Check token presence and format
        if (!token || token.split(".").length !== 3) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        // Verify token
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decode.userId;

        next();

    } catch (error) {
        console.log("Error in protectRoute middleware:", error);
        res.status(401).json({ message: "Unauthorized access" });

    }
}

export default protectRoute;