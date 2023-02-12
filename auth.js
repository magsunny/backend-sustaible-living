const jwt = require('jsonwebtoken');

// async func for authentification token

module.exports = async (req, res, next) => { // middleware?!
    try { 
        const token = await req.headers.authorization.split(' ')[1]; // gets auth token from auth header
        const decodedToken = await jwt.verify( // checks if generated token matches token string ('random token')
            token,
            'RANDOM-TOKEN'
        );
        const user = await decodedToken; // get user details of logged in user
        req.user = user; // passes the const user to the endpoint
        next() // must be called cause middleware, passes functionality
    } catch (error) {
        res.status(401).json({
            error: new Error('Ungülige Anfrage'),
        });
    }
}