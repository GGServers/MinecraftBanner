const express = require('express'),
    app = express(),
    cors = require('cors');
const gen = require('./lib/generator.js');

app.use(cors());
app.listen(8080);
app.use(express.static('frontend'));

app.get("/img/:id", function(req, res) {
    var id = req.params.id;
    gen.check(id, function(file, err) {
        if (err) {
          console.log(err);
            res.status(404).send("Not Found");
        } else {
            res.sendFile(file, {
                root: __dirname
            });
        }
    });
});

app.get("/new/:ip/:template", function(req, res) {
    var ip = req.params.ip;
    var template = req.params.template;
    gen.generate(ip, template, function(hex,img) {
      res.send({image: hex,direct: "http://" + req.headers.host + "/img/" + hex });
    });
});
