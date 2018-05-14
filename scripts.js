var app;
(function() {

	app = new Vue({
		el: '#app',
		data: {
			loginVisible: false,
			checkinVisible: false,
			heatPoints: [
				new google.maps.LatLng(37.673222,-97.401393),
				new google.maps.LatLng(37.673222,-97.401393),
				new google.maps.LatLng(37.673222,-97.401393),
				new google.maps.LatLng(37.673222,-97.401393),
				new google.maps.LatLng(37.673222,-97.401393)

			],
		},
		methods: {
			initMap: function() {
				map = new window.google.maps.Map(document.getElementById('map'), {
					center: {lat:37.673222, lng: -97.401393},
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
				
			}
	
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
		}
	});

})();




function updateClubCount(club){
	return firebase.database().ref('clubs/'+ club + '/count').once('value').then(function(snapshot){
		console.log(snapshot.val());
		firebase.database().ref('clubs/' + club).set({
			'count': (snapshot.val() + 1)
		});
	});
}

function getClubCount(club){
	var count = firebase.database().ref('clubs/' + club);
	count.on('value', function(snapshot){
		updatecount(club, snapshot.val());
	});
}



