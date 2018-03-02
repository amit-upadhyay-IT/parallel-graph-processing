function mainpage(req, res){
    res.render('../views/home.ejs', {arg1:"body arg1",
                            arg2:"body arg2"});
}

module.exports.mainpage = mainpage;
