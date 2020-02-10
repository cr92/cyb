'use strict';

function v(req,res,next){
    if (!req.body.name || !req.body.price){
        throw new Error("whoopsie")
    }
    next();
}

module.exports={
    v
}