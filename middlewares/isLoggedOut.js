module.exports.isLoggedOut = (req,res,next)=>{
    if(req.isAuthenticated()){
        // req.session.returnTo = req.originalUrl;
        // req.flash('error' , 'You musst be siigned in first');
        return res.redirect('/logout');
    }
    next();
}