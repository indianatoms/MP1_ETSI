module.exports = (app) => {
    const subs = require('../controllers/sub.controller.js');

    // Create a new Note
    app.post('/mp1/v1/applications/:AppId/subscriptions', subs.create);

    // Retrieve all termsubs
    app.get('/mp1/v1/applications/:AppId/subscriptions', subs.findAll);

    // Retrieve a single Note with AppId
    app.get('/mp1/v1/applications/:AppId/subscriptions/:subType/:subId', subs.findOne);

    // Delete a Note with AppId
    app.delete('/mp1/v1/applications/:AppId/subscriptions/:subType/:subId', subs.delete);

    app.get('/mp1/v1/timing/current_time', subs.currentTime);

    app.get('/mp1/v1/timing/timing_caps', subs.timingCaps);
}
