const Score = require('../models/score-model');

module.exports.sendScore = (req, res) => {
    Score.findOrCreate({ username: req.user.username }, (err, record, created) => {
        if (err) { console.log(`An error has occured ${err}`); }
        record.score = req.body.score;

        record.save()
            .then((data) => {
                console.log(`Saved new score to database: ${data}`);
                res.redirect('/');
            })
            .catch((err) => {
                console.log(`An error has occured when registering new score: ${err}`);
                res.redirect('/');
            });
    });
};

module.exports.clearScore = (req, res) => {
    Score.deleteMany({}, (err) => {
        if (err) { console.log('Error encountered when removing scores'); }
        else { console.log('Scores removed. '); }
    });

    res.redirect('/');
};