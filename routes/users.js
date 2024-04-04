var express = require('express');
var router = express.Router();

var { registerUser, loginUser } = require('../controllers/authController') ;
var { getAllUsers, getOneUser, updateUser, deleteUser, deleteAll } = require('../controllers/userController.js');


var rbac = require('../middlewares/rbac') ;
var passportConfig = require('../config/passport');

var passport = require('passport')
var LocalStrategy = require('passport-local');

const { initAdminAccount } = require('../config/init');

// Auth func Passport Local (user + pass) - TO-CHECK
passport.use(new LocalStrategy (
  async function(username, password, done) { 
    try{ 
      const user = await User.findOne({ username: username })
      if(!user) { return done(null, false); };
      // if (!user.verifyPassword(password)) { return done(null, false); };
      console.log(user);
      passport.serializeUser((user, done) => {
        done(null, user.id);
    });
      return done(null, user);
    }catch(err) { 
      console.log(err);
    }
  }
))

/* Add user . */
router.post('/', registerUser);

/* Login user */ 
router.post('/login', loginUser);

/* GET users listing. */
router.get('/', getAllUsers)

/* GET one user. */
router.get('/:id', getOneUser)

/* Update user */ 
router.patch('/:id', updateUser);

/* Delete user*/
router.delete('/:id', deleteUser );

router.delete('/', deleteAll);

// router.get('/admin', rbac.checkRole(ROLE.ADMIN))
router.get('/dashboard/admin', async(req, res) => { 
  await initAdminAccount(req, res); 
}) //  /users/admin => user.role === admin / crud user.role === recruteur 

router.get('/recruiter', function(req, res, next) {
  res.send('Recruiter dashboard');
});

router.get('/candidate', function(req, res, next) {
  res.send('Candidate dashboard');
});

module.exports = router;
