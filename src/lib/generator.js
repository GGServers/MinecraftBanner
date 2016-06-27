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
        var info = JSON.parse(fs.readFileSync(__dirname + "/../template/json/" + template + ".json"));
        var ipColor = img.colorAllocate(info.ip.r,info.ip.g,info.ip.b);
        var statusColor = img.colorAllocate(info.status.r,info.status.g,info.status.b);
        var playersColor = img.colorAllocate(info.players.r,info.players.g,info.players.b);
        var fontPath = __dirname + "/../template/fonts/" + info.font;
        img.stringFT(ipColor, fontPath, info.ip.size, 0, info.ip.x, info.ip.y, ip);
        img.stringFT(statusColor, fontPath, info.status.size, 0, info.status.x, info.status.y, status);
        img.stringFT(playersColor, fontPath, info.players.size, 0, info.players.x, info.players.y, players);

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
                image(undefined, template, players, status, ip, function(hex,img) {
                    callback(hex,img);
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
                        image(files[0], template, players, status, ip, function(hex,img) {
                            callback("cache/" + img, false);
                        });
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
