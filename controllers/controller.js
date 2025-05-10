const {Ship, Survey, ShipSurvey, Profile, User} = require('../models/index')
const { Op } = require('sequelize')
const yearOnly = require('../helpers/helper')

const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf-node');
const ejs = require('ejs');


class Controller {
    static async profileHome(req, res) {
        try {
            const ProfileId = req.params.id
            let profile = await Profile.findOne({
                where: {
                    id: ProfileId
                },
                include : User
            })

            const role = req.session.role
            res.render('profileHome', {profile, role})
        } catch (error) {
            console.log(error);
            
            res.send(error)
        }
    }

    static async profileLogout(req, res) {
        try {
            // const ProfileId = req.params.id
            req.session.destroy();
            return res.redirect('/');
        } catch (error) {
            res.send(error);
        }
    }

    static async getProfileEdit(req, res) {
        try {
            let { error } = req.query

            if(error) {
                error = error.split(",")
            } else {
                error = []
              }

            const ProfileId = req.params.id
            let selectedProfile = await Profile.findByPk(ProfileId)
            console.log(selectedProfile);
            
            return res.render('editProfile', {selectedProfile, error})
        } catch (error) {
            return res.send(error)
        }
    }

    static async postProfileEdit(req, res) {
        try {
            const ProfileId = req.params.id
            let { fullName, city, age } = req.body
            await Profile.update(
                {
                    fullName,
                    city,
                    age
                },
                {
                    where: {
                        id: ProfileId
                    }
                }
            )
            res.redirect(`/profile/${ProfileId}`)
        } catch (error) {
            const ProfileId = req.params.id
            if (error.name === "SequelizeValidationError") {
                let errorNotif = error.errors.map(el => el.message)
                return res.redirect(`/profile/${ProfileId}/edit?error=${errorNotif}`)
            } else {
                return res.send(error)
            }
        }
    }

    static async profileDetail(req, res) {
        try {
            const ProfileId = req.params.id;
    
            const profile = await Profile.findByPk(ProfileId, {
                include: User
            });
    
   
            res.render('profileDetail', { profile });
        } catch (error) {
            res.send(error);
        }
    }

    static async deleteProfile(req, res) {
        try {
            const ProfileId = req.params.id;

            const profile = await Profile.findByPk(ProfileId);    
            const userId = profile.UserId;
    
            await User.destroy({ 
                where: { 
                    id: userId 
                } 
            });
    
            req.session.destroy()
            res.redirect('/')
        } catch (error) {
            res.send(error);
        }
    }

    static async ships(req, res) {
        try {
            const {id} = req.params

            let ships = await Ship.shipByProfile(id)
           
            res.render('profileShip', {ships, yearOnly})
        } catch (error) {                     
            res.send(error)
        }
    }
    
    static async allShips(req, res) {
        try {
            const ProfileId = req.params.id
            const { name, search } = req.query
            let findShip = {
                include : {
                    model: Survey
                },
                where : {
                    
                }
            }
            
            if (search) {
                findShip.where = {
                    name : {
                        [Op.iLike] : `%${search}%`
                    }
                }
            }
            let allShips = await Ship.findAll(findShip)
            res.render('allShips', {allShips, yearOnly, name, ProfileId })
        } catch (error) {
            res.send(error)
        }
    }

    static async getAddShips(req, res) {
        try {
            let { error } = req.query

            if(error) {
                error = error.split(",")
            } else {
                error = []
            }

            const ProfileId = req.params.id
            let surveys = await Survey.findAll()

            res.render('addShips', {surveys, ProfileId, error})
        } catch (error) {
            console.log(error);
            
            res.send(error)
        }
    }

    static async postAddShips(req, res) {
        try {
            const {id} = req.params
            const {name, IMONumber, shipType, yearBuilt, portRegistry, imageUrl, surveyType} = req.body

            let newShip = await Ship.create({
                name,
                IMONumber,
                type: shipType,
                yearBuilt,
                portRegistry,
                imageUrl,
                ProfileId: id
            })

            await ShipSurvey.create({
                ShipId: newShip.id,
                SurveyId: surveyType
            })

            res.redirect(`/profile/${id}/ships`)
        } catch (error) {
            const {id} = req.params
            if (error.name === "SequelizeValidationError") {
                let errorNotif = error.errors.map(el => el.message)
                return res.redirect(`/profile/${id}/ships/add?error=${errorNotif}`)
            } else {
                return res.send(error)
            }
        }
    }

    static async deleteShips(req, res) {
        try {
            console.log(req.params);
            
            const { id, shipId } = req.params;

            let selectedShip = await Ship.findByPk(shipId)
            let shipName = selectedShip.addMVtoName
            await selectedShip.destroy()

            res.redirect(`/profile/${id}/ships/?name=${shipName}`)
        } catch (error) {
            res.send(error)
        }
    }
    
    static async shipListToPDF(req, res) {
      try {
        const { id } = req.params;
        const { search } = req.query;
    
        // Ambil data kapal
        const profile = await Profile.findByPk(id, { include: User });
        const ships = await Ship.findAll({
          include: [Survey],
          where: search ? { name: { [Op.iLike]: `%${search}%` } } : undefined
        });
    
        // Render EJS menjadi HTML string
        const htmlString = await ejs.renderFile(path.join(__dirname, '../views/pdf/shipList.ejs'), {
          allShips: ships,
          ProfileId: id,
          profile,
          yearOnly: year => new Date(year).getFullYear(),
          name: search
        });
    
        // PDF config
        let options = { format: 'A4', printBackground: true };
        let file = { content: htmlString };
    
        const pdfBuffer = await pdf.generatePdf(file, options);
    
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="vessel_list.pdf"',
          'Content-Length': pdfBuffer.length
        });
    
        res.send(pdfBuffer);
      } catch (error) {
        console.error(error);
        res.status(500).send('Failed to generate PDF');
      }
    }
}

module.exports = Controller