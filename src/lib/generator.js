const gd = require('node-gd'),
      crypto = require('crypto'),
      glob = require('glob'),
      dig = require('gamedig'),
      fs = require('fs');

function queryServer(ip, callback) {
    dig.query({
            type: 'minecraftping',
            host: ip
        },
        function(state) {
            callback(state);
        });
}

function image(name, template, players, status, ip, callback) {
    gd.openPng(__dirname + '/../template/image/' + template + ".png", function(err, img) {
      var hex;
        if (err) {
            throw err;
        }
        if (!name) {
            hex = crypto.randomBytes(16).toString('hex');
            var name = hex + "-" + ip + "-" + template + ".png";
        }
        var txtColor = img.colorAllocate(255, 0, 255);
        var info = JSON.parse(fs.readFileSync(__dirname + "/../template/json/" + template + ".json"));
        var fontPath = __dirname + "/../template/fonts/" + info.font;
        img.stringFT(txtColor, fontPath, 24, 0, info.ip.x, info.ip.y, ip);
        img.stringFT(txtColor, fontPath, 24, 0, info.status.x, info.status.y, status);
        img.stringFT(txtColor, fontPath, 24, 0, info.players.x, info.players.y, players);

        img.savePng(__dirname + "/../cache/" + name, 1, function(err) {
            if (err) {
                console.log(err);
            }
            callback(hex,name);
        });
    });
}
module.exports = {
    generate: function(ip, template, callback) {
        queryServer(ip, function(state) {
            if (state.error) {
                var players = "0 / 0";
                var status = "Offline";
                image(undefined, template, players, status, ip, function(img) {
                    callback(img);
                });
            } else {
                var players = state.players.length.toString() + " / " + state.maxplayers.toString();
                var status = "Online";
                image(undefined, template, players, status, ip, function(hex,img) {
                    callback(hex,img);
                });
            }
        });
    },
    check: function(id, callback) {
        glob(__dirname + "/../cache/" + id + "-*.png", function(er, files) {
            if (er || files[0] == undefined) {
                callback("", true);
            } else {
                file = files[0].split("/");
                console.log(file[file.length-1]);
                var ip = file[file.length-1].split("-")[1];
                var template = file[file.length-1].split("-")[2].replace(".png", "");
                queryServer(ip, function(state) {
                    if (state.error) {
                        var players = "0 / 0";
                        var status = "Offline";
                        image(template, players, status, ip);
                    } else {
                        var players = state.players.length.toString() + " / " + state.maxplayers.toString();
                        var status = "Online";
                        image(files[0], template, players, status, ip, function(hex,img) {
                            callback("cache/" + img, false);
                        });
                    }
                });
            }
        });
    }
}
