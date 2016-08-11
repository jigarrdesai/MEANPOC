'use strict';

// The Package is passed automatically as first parameter
module.exports = function(MeanPOC, app, auth, database) {

    app.route('/api/starter').get(function(req, res, next) {
        res.send('Ended...')
    });
};
