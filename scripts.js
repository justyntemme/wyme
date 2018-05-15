var app;
(function() {

	app = new Vue({
		el: '#app',
		data: {
			loginVisible: false,
			checkinVisible: false,
			loggedIn: true, //TODO implement cookie based token system
			heatPoints: [
				new google.maps.LatLng(37.673222,-97.401393),
				new google.maps.LatLng(37.673222,-97.401393),
				new google.maps.LatLng(37.673222,-97.401393),
				new google.maps.LatLng(37.673222,-97.401393),
				new google.maps.LatLng(37.673222,-97.401393)

			],
			clubs: 
				{}
		},
		methods: {
			initMap: function() {
				map = new window.google.maps.Map(document.getElementById('map'), {
					center: {lat:37.6872, lng: -97.3301},
					zoom:12
				});
				heatmap = new window.google.maps.visualization.HeatmapLayer({
					data: this.heatPoints,
					map: map
				});

			},
			initLogin: function() {
				var authObject = window.firebase.auth();
				var ui = new window.firebaseui.auth.AuthUI(window.firebase.auth());
				var uiConfig = {
					callbacks: {
						signInSuccessWithAuthResult: function(authResult, redirectUrl) {
							return true;
						},
						uiShown: function() {
						}
					},
					signInflow: 'popup',
					signInSuccessUrl: '/',
					signInOptions: [
						window.firebase.auth.GoogleAuthProvider.PROVIDER_ID,
						window.firebase.auth.TwitterAuthProvider.PROVIDER_ID,
						window.firebase.auth.FacebookAuthProvider.PROVIDER_ID,
					],
					tosUrl: '/'
				};
				window.document.addEventListener("DOMContentLoaded", function(event) {
					ui.start('#firebaseui-auth-container', uiConfig);
	 			});
				
			},
			checkIn: function(club) {
				clubObj = firebase.database().ref('clubs/'+ club);
				clubObj.on('value', function(snapshot){
					console.log(snapshot.val()['name'])
					name = snapshot.val()['name']
					count = (snapshot.val()['count'] + 1)
					lon = snapshot.val()['lon']
					lat = snapshot.val()['lat']
					console.log(name + count + lon + lat)
				});
				firebase.database().ref('clubs/' + club).set({

					'count': count,
					'name': name,
					'lon': lon,
					'lat': lat

				});
			},
			getClubCount: function(club){
				var count = firebase.database().ref('clubs/' + club);
				count.on('value', function(snapshot){
					return snapshot.val();
				});
			},
			getClubs: function(){
				var v = this;
				dbclubs = firebase.database().ref('clubs/');
				dbclubs.on('value', function(snapshot){
					for (var club in snapshot.val()) {
						Vue.set(v.clubs,club,snapshot.val()[club])
					} 
				});

			},
			updateClubCount: function(club, count) {

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
			this.initMap();
			this.initLogin();
			this.getClubs();
		}
	});

})();