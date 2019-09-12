module.exports = (app) => {
    const subs = require('../controllers/sub.controller.js');

    app.get('/mp1/v1/timing/current_time', subs.currentTime);

    app.get('/mp1/v1/timing/timing_caps', subs.timingCaps);
}
