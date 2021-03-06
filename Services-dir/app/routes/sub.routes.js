module.exports = (app) => {
    const subs = require('../controllers/sub.controller.js');
    const basicAuth = require('express-basic-auth')

    // Retrieve all Services
    app.get('/mp1/v1/services', subs.findAllServices);

    
    //Retrieve a single Service with serviceId
    app.get('/mp1/v1/services/:serviceId', subs.findOneService);
        

    //FROM HERE I NEED AUTH
    app.use(basicAuth({
        users: { 'admin': 'supersecret' }
    }))

    // Update a Service with serviceId
    app.put('/mp1/v1/services/:serviceId', subs.putService);

    app.post('/mp1/v1/services', subs.createService);
    app.delete('/mp1/v1/services/purge', subs.purge);

    app.delete('/mp1/v1/services/:serviceId', subs.deleteService);
   

}
