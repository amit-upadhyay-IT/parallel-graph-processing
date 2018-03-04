var exp = require("express");
var app = exp();
var http = require('http').Server(app);
var io=require('socket.io')(http);

app.set('view engine', 'ejs');

var routes = require('./routes/routes.js');

// to make the css and all bootstrap file render properly on the get request
app.use(exp.static(__dirname+'/views'));

// for ligra
app.get('/', routes.mainpage);



// app.get('/:graph_medusa', routes.medusa);

var port = process.env.PORT || 3000;

// communication work
io.on('connection', function(socket){
  console.log('A new Connection Established!');

    socket.on('compileandrun', function(msg){
        compileAndRun(msg)
      });

    socket.on('disconnect', function(){
        console.log('Connection Broken!');
      });
});

http.listen(port, function(){
    console.log("Server is listening on port "+port);
});

function compileAndRun(program_code)
{
    var compile_command = '';
    var run_command = '';
    if (program_code == 11)  // BFS
    {
        compile_command = 'g++ '+'./frame_l/apps/'+'BFS.C -o BFS';
        run_command = './frame_l/apps/'+'BFS'
    }

    console.log(compile_command);
    console.log(run_command);
}
