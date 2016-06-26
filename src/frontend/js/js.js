var xhttp = new XMLHttpRequest();
document.getElementById("btn-gen").addEventListener("click", function() {
    // Generate button has been click
    var ip = document.getElementById("ip").value;
    var template = document.getElementById("template").value;
    xhttp.open("GET", "/new/" + ip + "/" + template, true);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log(xhttp.responseText);
            var result = JSON.parse(xhttp.responseText);
            document.getElementById("banner").style.visibility = "visible";
            document.getElementById("link").style.visibility = "visible";
            document.getElementById("banner").src = result['direct'];
            document.getElementById("code").innerHTML = result['direct'];
        }
    };
});
