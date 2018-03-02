var exp = require("express");
var app = exp();

app.set('view engine', 'ejs');

var routes = require('./routes/routes.js');

// to make the css and all bootstrap file render properly on the get request
app.use(exp.static(__dirname+'/views'));

// for ligra
app.get('/', routes.mainpage);



// app.get('/:graph_medusa', routes.medusa);

var port = process.env.PORT || 3000;

app.listen(port, function(){
    console.log("Server is listening on port "+port);
});
