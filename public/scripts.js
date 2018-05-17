var app;
function mapLoaded() {
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
				console.log("init map")
				return new Promise((resolve, reject) => {
				for (var key in v.clubs) {
					var lat = v.clubs[key].lat;
					var lon = v.clubs[key].lon;
					var i = 0;
					while (i < this.clubs[key].count) {
						console.log("updating map with" + key)
						v.heatPoints.push(new google.maps.LatLng(lat,lon));
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
				if (map) {
					resolve("SUCCESS");
				}
			});
			},
			initLogin: function() {
				var v = this;
				console.log("init login");
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
					ui.start('#firebaseui-auth-container', uiConfig);
			},
			checkIn: function(club) {
				var v = this;
				firebase.database().ref('clubs/' + club).set({
					'count': (v.clubs[club]['count'] + 1 ),
					'name': v.clubs[club]['name'],
					'lon': v.clubs[club]['lon'],
					'lat': v.clubs[club]['lat']
	
			});
			},
			updateMaps: function() {
				var v = this;
				return new Promise((resolve, reject) => {
					console.log("updating maps");
					console.log(this.clubs);
				for (var key in v.clubs) {
					console.log(key);
					var lat = this.clubs[key].lat;
					var lon = this.clubs[key].lon;
					var i = this.heatPoints.length;
					while (i < this.clubs[key]['count']) {
						Vue.set(this.heatPoints,(this.heatPoints.length + 1), new google.maps.LatLng(lat, lon));
						//this.heatPoints.push(new google.maps.LatLng(lat,lon));
						// not needed Vue.set(this.heatPoints,(this.heatPoints.length + i), new google.maps.LatLng(lat, (lon - (i *.0001))))
						i++;
					}
					console.log(this.heatPoints);
				}
				resolve("SUCCESS");
				});
			},
			getClubs: function(){
				var v = this;
				console.log("getting clubs")
				return new Promise((resolve, reject) => {
				dbclubs = firebase.database().ref('clubs/').once('value').then(function(snapshot){
					for (var club in snapshot.val()) {
						Vue.set(v.clubs,snapshot.val()[club].name,snapshot.val()[club]);
		
					} 
					resolve("SUCCESS");
				});
			});
			},
			initializeFirebase: function() {
				return new Promise((resolve, reject) => {
					var config = {
						apiKey: "AIzaSyBBBwB7S6ekYD-oxLPWFu1G7CkKGTXdw-Q",
						authDomain: "wyme-wichita.firebaseapp.com",
						databaseURL: "https://wyme-wichita.firebaseio.com",
						projectId: "wyme-wichita",
						storageBucket: "wyme-wichita.appspot.com",
						messagingSenderId: "831469219617"
					  };
					 firebase.initializeApp(config);
					resolve("SUCCESS");
				});
			},
		},
		mounted: function() {
			
			const promise = this.initializeFirebase();
			const promise_clubs = promise.then(this.getClubs());
			const promise_map = promise_clubs.then(this.updateMaps());
			promise_map.then(this.initMap());
			promise_map.then(this.initLogin());
		}
	});

}