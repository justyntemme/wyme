var app;
(function mapLoaded() {
	app = new Vue({
		el: '#app',
		data: {
			loginVisible: false,
			checkinVisible: false,
			loggedIn: false,
			user: firebase.auth.user, 
			heatPoints: new google.maps.MVCArray(),
			clubs: 
				{}
		},
		methods: {
			initMap: function() {
				var v = this;
				for (var key in v.clubs) {
					var lat = this.clubs[key].lat;
					var lon = this.clubs[key].lon;
					var i = 0;
					while (i < this.clubs[key].count) {
						this.heatPoints.push(new google.maps.LatLng(lat,lon));
						// old method not needed Vue.set(this.heatPoints,(this.heatPoints.length + i), new google.maps.LatLng(lat, lon))
						i++;
					}
				}
				map = new window.google.maps.Map(document.getElementById('map'), {
					center: {lat:37.6872, lng: -97.3301},
					zoom:12
				});
				
				heatmap = new window.google.maps.visualization.HeatmapLayer({
					data: this.heatPoints,
					map: map,
					maxIntensity: 100,
					radius: 50,
					dissipating: true
				});
			},
			initLogin: function() {
				var v = this;
				var authObject = window.firebase.auth();
				var ui = new window.firebaseui.auth.AuthUI(window.firebase.auth());
				var uiConfig = {
					callbacks: {
						signInSuccessWithAuthResult: function(authResult, redirectUrl) {
							console.log(authResult);
								v.user = authResult.user;
								v.loginVisible = false;
								v.loggedIn = true;
							return true;
						},
						uiShown: function() {
						}
					},
					signInflow: 'popup',
					signInSuccessUrl: '',
					signInOptions: [
						window.firebase.auth.GoogleAuthProvider.PROVIDER_ID,
						window.firebase.auth.TwitterAuthProvider.PROVIDER_ID,
						window.firebase.auth.FacebookAuthProvider.PROVIDER_ID,
					],
					tosUrl: ''
				};
				window.document.addEventListener("DOMContentLoaded", function(event) {
					ui.start('#firebaseui-auth-container', uiConfig);
	 			});
			},
			checkIn: function(club) {
				clubObj = firebase.database().ref('clubs/'+ club);
				clubObj.on('value', function(snapshot){
					console.log(snapshot.val()['name'] + " clicked");
					name = snapshot.val()['name'];
					count = (snapshot.val()['count'] + 1);
					lon = snapshot.val()['lon'];
					lat = snapshot.val()['lat'];
	
				});
				console.log(count);
				console.log(name);
				console.log(lon);
				console.log(lat);
				firebase.database().ref('clubs/' + club).set({

					'count': count,
					'name': name,
					'lon': lon,
					'lat': lat

				});
			},
			updateMaps: function() {
				var v = this;
				for (var key in v.clubs) {
					var lat = this.clubs[key].lat;
					var lon = this.clubs[key].lon;
					var i = this.heatPoints.length;
					while (i < this.clubs[key].count) {
						this.heatPoints.push(new google.maps.LatLng((lat + (.0001 + i)),(lon + (.0001 * i))));
						// not needed Vue.set(this.heatPoints,(this.heatPoints.length + i), new google.maps.LatLng(lat, (lon - (i *.0001))))
						i++;
					}
				}
			},
			getClubs: function(){
				return new Promise((resolve, reject) => {
				var v = this;
				dbclubs = firebase.database().ref('clubs/');
				dbclubs.on('value', function(snapshot){
					for (var club in snapshot.val()) {
						Vue.set(v.clubs,snapshot.val()[club].name,snapshot.val()[club]);
						app.updateMaps();
					} 
				resolve("SUCCESS");
				});
			});
			},
		},
		mounted: function() {
			var config = {
				apiKey: "AIzaSyBBBwB7S6ekYD-oxLPWFu1G7CkKGTXdw-Q",
				authDomain: "wyme-wichita.firebaseapp.com",
				databaseURL: "https://wyme-wichita.firebaseio.com",
				projectId: "wyme-wichita",
				storageBucket: "wyme-wichita.appspot.com",
				messagingSenderId: "831469219617"
			  };
			firebase.initializeApp(config);
			const promise = this.getClubs();
			promise.then(this.initMap, null);
			this.initLogin();
		}
	});

}