const gd = require('node-gd'),
    crypto = require('crypto'),
    glob = require('glob'),
    dig = require('gamedig');

function queryServer(ip, callback) {
    dig.query({
            type: 'minecraftping',
            host: ip
        },
        function(state) {
            if (state.error) console.log(state);
            else callback(state);
        });
}

module.exports = {
    generate: function(ip, template, callback) {
        queryServer(ip, function(state) {
            gd.openFile('template/image/' + template + ".png", function(err, img) {
                if (err) {
                    throw err;
                }
                var hex = crypto.randomBytes(16).toString('hex');
                var filename = hex + "-" + ip + "-" + template + ".png";

                var txtColor = img.colorAllocate(255, 0, 255);
                var fontPath = "template/fonts/Roboto-Light.ttf";
                img.stringFT(txtColor, fontPath, 24, 0, 10, 40, ip);
                img.stringFT(txtColor, fontPath, 24, 0, 20, 100, "Online");
                img.stringFT(txtColor, fontPath, 24, 0, 20, 160, state.players.length.toString() + " / " + state.maxplayers.toString());

                img.savePng("cache/" + filename, 1, function(err) {
                    if (err) {
                        throw err;
                    }
                    callback(filename);
                });
            });
        });
    },
    check: function(id, callback) {
        glob("cache/" + id + "-*.png", function(er, files) {
          var ip = files[0].split("-")[1];
          var template = files[0].split("-")[2].replace(".png","");
          queryServer(ip, function(state) {
              gd.openFile('template/image/' + template + ".png", function(err, img) {
                  if (err) {
                      throw err;
                  }
                  var txtColor = img.colorAllocate(255, 0, 255);
                  var fontPath = "template/fonts/Roboto-Light.ttf";
                  img.stringFT(txtColor, fontPath, 24, 0, 10, 40, ip);
                  img.stringFT(txtColor, fontPath, 24, 0, 20, 100, "Online");
                  img.stringFT(txtColor, fontPath, 24, 0, 20, 160, state.players.length.toString() + " / " + state.maxplayers.toString());

                  img.savePng(files[0], 1, function(err) {
                      if (err) {
                          throw err;
                      }
                      callback(files[0]);
                  });
              });
          });
        });
    }
}
