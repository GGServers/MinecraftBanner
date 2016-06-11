const app = require('express')(),
      fs = require('fs');

const gen = require('./lib/generator.js');

app.listen(8080);

app.get("/img/:id", function(req,res){
  var id = req.params.id;
  gen.check(id,function(file){
    res.sendFile(file,{
      root: __dirname
    });
  });
});

app.get("/new/:ip/:template", function(req,res){
  var ip = req.params.ip;
  var template = req.params.template;
  gen.generate(ip,template,function(file){
    res.sendFile(file,{
      root: __dirname + "/cache"
    });
  });
});
