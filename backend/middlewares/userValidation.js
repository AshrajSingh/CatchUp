import jwt from 'jsonwebtoken'

export default function userAuthentication(req, res, next) {
    const authHeaders = req.headers["authorization"]

    const token = authHeaders && authHeaders.split(" ")[1]
    console.log("token from userAuth: ", token)

    if (!token) {
        res.status(401).json({ message: 'No token provided' })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: 'Invalid token' })
        }

        req.user = decoded

        next()
    });
}