const { User, Profile, Ship, Survey } = require('../models');
const bcrypt = require('bcryptjs')

class UserController {

    static async home(req, res) {
        try {
            return res.render('homebeforelogin')
        } catch (error) {
            return res.send(error)
        }
    }

    static async getRegisterOwner(req, res) {
        try {
            let { error } = req.query

            if(error) {
                error = error.split(",")
              } else {
                error = []
              }

            return res.render('register-owner', { error });
        } catch (error) {
            console.log(error);
            
            return res.send(error);
        }
    }

    static async postRegisterOwner(req, res) {
        try {
            const { username, email, password, role } = req.body;

            let createdUser = await User.create({ 
                username,
                email,
                password,
                role
            });
            req.session.UserId = createdUser.id;

            return res.redirect(`/profile`);
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                let errorNotif = error.errors.map(el => {
                    return el.message
                })
                return res.redirect(`/register-owner/?error=${errorNotif}`)
            } else {              
                return res.send(error)
            }
        }
    }

    static async getRegisterSurveyor(req, res) {
        try {
            let { error } = req.query

            if(error) {
                error = error.split(",")
              } else {
                error = []
              }

            return res.render('register-surveyor', { error });
        } catch (error) {
            return res.send(error);
        }
    }

    static async postRegisterSurveyor(req, res) {
        try {
            const { username, email, password, role } = req.body;

            let createdUser = await User.create({ 
                username,
                email,
                password,
                role
            });
            req.session.UserId = createdUser.id;

            return res.redirect('/profile');
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                let errorNotif = error.errors.map(el => el.message)
                return res.redirect(`/register-surveyor?error=${errorNotif}`)
            } else {
                return res.send(error)
            }
        }
    }

    static async getLogin(req, res) {
        try {
            let { error } = req.query
            return res.render('login', {error})
        } catch (error) {
            return res.send(error)
        }
    }

    static async postLogin(req, res) {
        try {
          const { username, email, password } = req.body;
      
          const selectedUser = await User.findOne({ 
            where: { 
                username, email 
            },
            include: Profile
        });
      
          if (!selectedUser) {
            const error = "Account not found";
            return res.redirect(`/login?error=${error}`);
          }
      
          const validPassword = await bcrypt.compare(password, selectedUser.password);
      
          if (!validPassword) {
            const error = "Invalid password";
            return res.redirect(`/login?error=${error}`);
          }
      
          req.session.UserId = selectedUser.id;
          req.session.role = selectedUser.role;
          console.log(req.session.role);
          
          return res.redirect(`/profile/${selectedUser.Profile.id}`);
      
        } catch (error) {
          res.send(error);
        }
      }

    static async getAddProfile(req, res) {
        try {
            let { error } = req.query

            if(error) {
                error = error.split(",")
            } else {
                error = []
              }

            return res.render('addProfile', {error})
        } catch (error) {
            return res.send(error)
        }
    }

    static async postAddProfile(req, res) {
        try {
            const { fullName, city, age } = req.body;
            let UserId = req.session.UserId

            let createdProfile = await Profile.create({
                fullName,
                city,
                age,
                UserId
            })

            
            return res.redirect(`/login`)
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                let errorNotif = error.errors.map(el => el.message)
                return res.redirect(`/profile?error=${errorNotif}`)
            } else {
                return res.send(error)
            }
        }
    }
}

module.exports = UserController