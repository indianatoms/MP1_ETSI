module.exports = (app) => {
    const notes = require('../controllers/note.controller.js');

    // Create a new Note
    app.post('/applications/:noteId/subscriptions', notes.create);

    // Retrieve all Notes
    app.get('/applications/:noteId/subscriptions', notes.findAll);

    // Retrieve a single Note with noteId
    app.get('/applications/:noteId/subscriptions/:subType/:subId', notes.findOne);

    // Delete a Note with noteId
    app.delete('/applications/:noteId/subscriptions/:subType/:subId', notes.delete);
}
