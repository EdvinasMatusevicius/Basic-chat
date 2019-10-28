// const connectDb = require('./connection');
UserModel = require('./schema');

const storageUser = {
    storageAddUser: function(userNew){
        let user = new UserModel({
            nick: userNew.nick,
            password: userNew.password1
        });
        user.save().then(function(){
            console.log('suveike saugojimas su schema');
        })
    },
    storageFindUser: function(userOld){
       return new Promise(function(resolve,reject){
        UserModel.findOne({nick:userOld.nick}).then(function(result){
            resolve(result); 
         })
       })
        
    }
};
    module.exports = storageUser;