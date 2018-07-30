const requireUser = (req, res, next) => {
    if (req.session.currentUser) {
        next();
    } else {
        res.redirect('auth/login');
    }
};

const requireAnom = (req, res, next) => {
    if (!req.session.currentUser) {
        next();
    } else {
        res.redirect('auth/login');
    }
};

module.exports = {
    requireUser,
    requireAnom
};
