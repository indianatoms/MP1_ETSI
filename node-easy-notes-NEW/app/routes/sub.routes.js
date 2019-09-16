module.exports = (app) => {
    const subs = require('../controllers/sub.controller.js');
    const basicAuth = require('express-basic-auth')

    //Retrieve a single Service with serviceId

    // Retrieve all termsubs
    app.get('/mp1/v1/applications/:AppId/subscriptions', subs.findAll);

    // Retrieve a single Note with AppId
    app.get('/mp1/v1/applications/:AppId/subscriptions/:subType/:subId', subs.findOne);

    // Retrieve all Services

//FROM HERE I NEED AUTH
    app.use(basicAuth({
        users: { 'admin': 'supersecret' }
    }))

    app.post('/mp1/v1/applications/:AppId/subscriptions',subs.create);

    // Update a Service with serviceId
    app.put('/mp1/v1/services/:serviceId', subs.putService);

    app.delete('/mp1/v1/applications/:AppId/subscriptions/:subType/:subId', subs.delete);

}
