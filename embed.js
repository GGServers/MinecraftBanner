function Generate() {
    var ip_full = document.getElementById('ip').value.split(":");
    var style = document.getElementById('style').value;
    var ip = ip_full[0];
    var port = ip_full[1];
    var template = document.getElementById('style').value;
    MinecraftAPI.getServerStatus(ip, {
        port: port
    }, function(err, _status) {
        if (err) {
            console.log(err);
        }
        console.log(status);
        if (_status.online == true) {
            var status = "Online";
        } else {
            var status = "Offline";
        }
        var playerstring = "Players: " + _status.players.now + "/" + _status.players.max;
        LoadJson(template,
            function(data) {
              BannerRender(data, ip, port, status, playerstring, template);
            },
            function(xhr) {
                console.error(xhr);
            }
        );
    });
}

function BannerRender(info, ip, port, status, playerstring, template) {
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    var imageObj = new Image();
    imageObj.onload = function() {
        context.drawImage(imageObj, 0, 0);
        context.font = info.font.ip_size + " " + info.font.family;
        context.fillText(ip + ":" + port, info.ip.x, info.ip.y);
        context.font = info.font.status_size + " " + info.font.family;
        context.fillText(status + "!", info.status.x, info.status.y);
        context.font = info.font.players_size + " " + info.font.family;
        context.fillText(playerstring, info.players.x, info.players.y);

        //var tmp = canvas.toDataURL("image/png");
        //document.getElementById("banner").src = tmp;
        //win.document.write("<img src='" + canvas.toDataURL() + "'/>");
    }
    imageObj.src = "template/image/" + template + ".png";
}

function LoadJson(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", "template/json/"+path+".json", true);
    xhr.send();
}
