/**
 * Created by Administrator on 2016/12/9.
 */
var db = require('../../model/loginModel');
var GLOBAL = require('thinkmv').global;
var res ;
var req ;
var loginAction = {};
loginAction.index =function(){
    res.render('./user/log')
}
loginAction.log = function (param) {
    var p = param.post;
    if(p){
        var reurl = p.reurl||"/";
        if(p.user && p.pass){
            db.getUserByName(p.user,function(err,info){
                if(err){
                    res.render('./user/log',{message:err.message});
                }else{
                    if(!info){
                        res.render('./user/log',{message:"账号密码错误"});
                    }else{
                        if(info.pass == p.pass){
                            GLOBAL.marker({username:info.username,_id:info._id});
                            res.redirect(reurl);
                        }else{
                            res.render('./user/log',{message:'密码错误'});
                        }
                    }
                }
            });
        }else{
            res.render('./user/reg',{message:"账号密码错误"});
        }
    }else{
        res.render('./user/log');
    }
}
loginAction.reg = function (param){
    var p = param.post;
    if(p){
        var reurl = p.reurl||req.baseURI;
        if(p.username && p.pass && p.repass){
            if(p.pass != p.repass){
                res.render('./user/reg',{message:'密码不匹配'});
                return
            }
            db.addUser(p,function (err,result) {
                if(err){
                    res.render('./user/reg',{message:err.message});
                }else{
                    GLOBAL.marker({username:result.username,_id:result._id});
                    res.redirect(reurl);
                }
            })
        }else{
            res.render('./user/reg',{message:"账号密码不能为空"});
        }
    }else{
        res.render('./user/reg');
    }
}

loginAction.logout = function(param){
    req.session.username = '';
    res.clearCookie('username');
    res.redirect('/');
}

module.exports = function(q,s){
    res = s;
    req = q;
    return loginAction;
};

