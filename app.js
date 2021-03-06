var exp = require("express");
var app = exp();
var http = require('http').Server(app);
var io=require('socket.io')(http);

var cmd = require('node-cmd');

app.set('view engine', 'ejs');

var routes = require('./routes/routes.js');

// to make the css and all bootstrap file render properly on the get request
app.use(exp.static(__dirname+'/views'));

// for ligra
app.get('/', routes.mainpage);

// for members
app.get('/members', routes.members_page);



// app.get('/:graph_medusa', routes.medusa);

var port = process.env.PORT || 3000;

// communication work
io.on('connection', function(socket){
  console.log('A new Connection Established!');

    socket.on('compileandrun', function(msg, dataset_name){
        compileAndRun(msg, dataset_name, socket)
      });

    socket.on('disconnect', function(){
        console.log('Connection Broken!');
      });
});

http.listen(port, function(){
    console.log("Server is listening on port "+port);
});

// program_code is the program name, so I compile the program with that name itself
function compileAndRun(program_code, dataset_name, socket)
{
    console.log('dataset_name: ' + dataset_name);
    // check if name of the dataset is passed or not, if not passed then set the default dataset
    if (dataset_name === '')
    {
        dataset_name = 'rMatGraph_J_5_100';
        // setting the appropriate input data for BellmanFord and programs like that
        if (program_code === 'BellmanFord')
            dataset_name = 'rMatGraph_WJ_5_100';
    }
    // check if the program is written for the passed program_code, then only do further steps
    if (program_code === 'BFS' || program_code === 'KCore' || program_code === 'BellmanFord')
    {
        // for building compile command and run command
        var compile_command = '';
        var run_command = '';

        compile_command = 'g++ '+'./frame_l/apps/'+program_code+'.C -o '+program_code;
        // compiled object code is gonna be in the current directory
        run_command = './' + program_code + ' -s -start 1 ./frame_l/inputs/'+dataset_name;

        console.log(compile_command);
        console.log(run_command);

        // compiling the program first
        cmd.get(compile_command,
            function (err, data, stderr)
            {
                if (err)
                {
                    // writing err to the timeout channel, passing the program_code code coz, program_code is the id for the view to display
                    socket.emit('timeoutput', err, program_code);
                    console.log('something went wrong: ' + err);
                }
                // if no error found then running the program
                else
                {
                    console.log(data);
                    cmd.get(run_command,
                        function (err, data, stderr)
                        {
                            if (err)
                            {
                                socket.emit('timeoutput', err, program_code);
                                console.log('something went wrong: '+err);
                            }
                            else
                            {
                                // find the last occurrence of : in the data string
                                var last_occr = data.lastIndexOf(':');
                                // now get the substring after the last occurred ':'
                                var time = data.substring(last_occr+1, data.length);
                                console.log('Running time: ' + time);
                                // emit this time, don't broadcase because I don't want to display to everyone
                                socket.emit('timeoutput', time, program_code);
                            }
                        }
                    );
                }
            });
    }
    else
    {
        socket.emit('timeoutput', 'You haven\'t written program for', program_code);
        console.log('You don\'t yet have the program for ' + program_code);

    }
}
