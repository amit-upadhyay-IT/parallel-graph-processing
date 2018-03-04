var os = require('os')

function mainpage(req, res){
    res.render('../views/home.ejs', {cores: os.cpus().length,
                            arg2:"body arg2"});
}

function members_page(req, res){
    res.render('../views/members.ejs', {});
}

module.exports.mainpage = mainpage;
module.exports.members_page = members_page;
