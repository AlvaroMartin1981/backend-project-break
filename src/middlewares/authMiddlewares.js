const app = require('../config/firebase');
const { getAuth, onAuthStateChanged } = require('firebase/auth');
const auth = getAuth(app)

function checkSession(req,res,next) {
    if (!res.headersSent) {
        if (req.path !== '/logout') {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    next();
                } else {
                    res.redirect('/login');
                }
            });
        } else {
            // Si la solicitud es para logout, continúa sin realizar ninguna redirección
            next();
        }
    } else {
        // Si las cabeceras ya han sido enviadas (indicando que ya se ha redirigido), pasa al siguiente middleware
        next();
    }
}

module.exports = checkSession;