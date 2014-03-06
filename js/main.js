function stripslashes(str) {
  return (str + '')
    .replace(/\\(.?)/g, function(s, n1) {
      switch (n1) {
        case '\\':
          return '\\';
        case '0':
          return '\u0000';
        case '':
          return '';
        default:
          return n1;
      }
    });
}

jQuery(document).ready(function($) {
	manifest = chrome.runtime.getManifest();

	$('title').text(manifest.name + " v" + manifest.version);


	oldSong = '';
	notificationname = 'Spotify-chrome';
	notificationi = 0
	setNotfication = false;
	function getSong(){
		$.ajax({
			url: "https://www.arago.utwente.nl/spotcommander/nowplaying.php",
			cache: false
		}).done(function( data ) {
			console.log(data);
		});
	}

	setInterval(function () {
		$.ajax({
			url: "https://www.arago.utwente.nl/spotcommander/nowplaying.php",
			cache: false
		}).done(function( response ) {
			data = JSON.parse(response);
			//console.log(data);

			output = data.title + " - " + data.artist;

			newSong = data.uri;
			if (newSong != oldSong) {
				oldSong = newSong;
				console.log('New song!!! ' + output);

				var xhr = new XMLHttpRequest();
				xhr.open("GET", stripslashes(data.cover_art));
				xhr.responseType = "blob";

				var options = {
					type: "basic",
					title: "Spotify, Now playing:",
					message: output
				}

				xhr.onload = function(){
					var blob = this.response;
					options.iconUrl = window.URL.createObjectURL(blob);
					notificationi == 0 || chrome.notifications.clear(notificationname + notificationi, function(){});
					chrome.notifications.create(notificationname + (notificationi++), options, function(){});
					// if (setNotfication) {
					// 	chrome.notifications.update(notificationid, options, function(){ console.log('update')});
					// } else {
					// 	chrome.notifications.create(notificationid, options, function(){});
					// 	setNotfication = true;
					// }
				}
				xhr.send(null);


			}
		});
	}, 2000);
});