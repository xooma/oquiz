const userMiddleware = {

  sessionToLocals: (req, res, next) => {
    if( req.session.user ) {
      res.locals.user = req.session.user;
    } else {
      res.locals.user = false;
    }
    next();
  },

  connectedUser: (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.redirect('/login');
    }
  },

  connectedAdmin: (req, res, next) => {
    if (req.session.user.role === 'admin') {
      next();
    } else {
      res.status(401).render('401');
    }
  },
  
};
  
module.exports = userMiddleware;