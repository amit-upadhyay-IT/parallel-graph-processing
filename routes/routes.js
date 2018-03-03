var os = require('os')

function mainpage(req, res){
    res.render('../views/home.ejs', {cores: os.cpus().length,
                            arg2:"body arg2"});
}

module.exports.mainpage = mainpage;
