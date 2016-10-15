var config;
var current_status;

$( document ).ready(function() {
	getconfig();
	getstatus();
});

function getstatus() {

    $.ajax({
        url: "../out/getconfig",
        dataType: "text",
        timeout: 5000,

        success: function (parsed_json) {
        var results = jQuery.parseJSON(parsed_json);
	
	document.getElementById("left"+results.left).className = "resButton btn btn-success";
	document.getElementById("right"+results.right).className = "resButton btn btn-success";
	document.getElementById("video"+results.asset).className = "vidButton btn btn-success";

       
        current_status=results;
        },

        error: function (parsedjson, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });

}


function getconfig() {

    $.ajax({
        url: "../out/config.json",
        dataType: "text",
        timeout: 5000,

        success: function (parsed_json) {
	var results = jQuery.parseJSON(parsed_json);
	
	var rates = results.config.bitrate;
	var assets = results.config.asset;

	for (var i in rates) {
		var rate = rates[i].rate;
		$('#leftDiv').first().append('<button id="left'+ rate +'" class="resButton btn btn-default"  type="button" onclick=rateChange('+rate+',"left")>'+rate+'kbps</button>');
		$('#rightDiv').first().append('<button id="right'+ rate +'" class="resButton btn btn-default"  type="button" onclick=rateChange('+rate+',"right")>'+rate+'kbps</button>');
		console.log(rate);
        }
	for (var i in assets){
		var asset = assets[i].name;
		$('#bottomDiv').first().append('<button id="video'+asset+'" class="vidButton btn btn-default"  type="button" onclick=videoChange("'+asset+'")>'+asset+'</button>');
	}

	config=results;
	},

        error: function (parsedjson, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });

}

function rateChange(rate, screen){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.log(rate);
			document.getElementById(screen+rate).className = "resButton btn btn-success";
			for(i = 0; i < config.config.bitrate.length; i++) {
				if(config.config.bitrate[i].rate != rate) {
					document.getElementById(screen+config.config.bitrate[i].rate).className = "resButton btn btn-default";
				}
			}
    	}
	}
	xhttp.open("GET", "/set?"+screen+"="+rate, true);
	xhttp.send();
}


function videoChange(videoName) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("video"+videoName).className = "vidButton btn btn-success";
			for(i = 0; i < config.config.asset.length; i++) {
				if(config.config.asset[i].name != videoName) {
					document.getElementById("video"+config.config.asset[i].name).className = "vidButton btn btn-default";
				}
			}
		}
	}
	xhttp.open("GET", "/set?asset="+videoName, true);
	xhttp.send();
}

