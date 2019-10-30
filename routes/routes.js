const express = require('express');
const router = express.Router();
const urlencodedParse = express.urlencoded({ extended: true });
const storage = require('../modules/storage.js');

const redirectLogin = (req, res, next) => {
    if (!req.session.user) {
        // res.redirect('/');
        next();
    } else {
        next();
    }
}
const redirectChat = (req, res, next) => {
    if (process.env.STAGE === 'prod') {
        res.redirect('/chat');
    } else {
        next();
    }
}
router.get('/', redirectChat, function (req, res) {
    res.render('index', { page: 'home' });  //SUTVARKYTI SITA
});
router.get('/chat', redirectLogin, function (req, res) {
    res.render('pagesEJS/chat', { page: 'chat' });
});

router.get('/logoff', function (req, res) {
    req.session.destroy(function (err) {
        if (err) return err
    });
    res.redirect('/');
});
router.get('/guest',function(req,res){
    req.session.user = { nick: 'Guest' };
    res.redirect('/chat');
})
router.post('/reg', [redirectChat, urlencodedParse], function (req, res, next) {
    if (req.body.password2) {
        if (req.body.userData.nick.length < 21 && req.body.userData.nick.length > 1) {
            storage.storageFindUser(req.body.userData).then(function (result) {
                if (result) {
                    res.send('nick exists');
                } else if (req.body.userData.password1 !== req.body.password2) {
                    res.send('psw mismatch');
                } else {
                    storage.storageAddUser(req.body.userData);
                    res.send('success');
                }
            })
        } else {
            res.send('nick length');
        }
    } else {
        res.send('emptyPsw2');
    }

})
router.post('/log', [redirectChat, urlencodedParse], function (req, res, next) {
    storage.storageFindUser(req.body.userData).then(function (result) {
        if (result) {
            if (result.nick === req.body.userData.nick && result.password === req.body.userData.password) {
                req.session.user = { nick: result.nick, id: result._id.toString() };

                res.send('successLog');
            } else {
                res.send('wrong');
            }
        } else {
            res.send('wrong');
        }
    })
})
module.exports = router;