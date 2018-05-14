var app;
(function() {

	app = new Vue({
		el: '#app',
		data: {
			loginVisible: false,
			checkinVisible: false
		},
		methods: {
	
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
			initMap();
			window.renderLogin();
		}
	})

})();

function getPoints() {
	return [
		new google.maps.LatLng(37.673222,-97.401393),
		new google.maps.LatLng(37.673222,-97.401393),
		new google.maps.LatLng(37.673222,-97.401393),
		new google.maps.LatLng(37.673222,-97.401393),
		new google.maps.LatLng(37.673222,-97.401393)
	];
}

function initMap() {
		map = new window.google.maps.Map(document.getElementById('map'), {
			center: {lat:37.673222, lng: -97.401393},
			zoom:12
		});
		heatmap = new google.maps.visualization.HeatmapLayer({
			data: getPoints(),
			map: map
		});
}

function renderLogin() {
	var authObject = firebase.auth();
	var ui = new firebaseui.auth.AuthUI(firebase.auth());
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
			firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			firebase.auth.TwitterAuthProvider.PROVIDER_ID,
			firebase.auth.FacebookAuthProvider.PROVIDER_ID,
		],
		tosUrl: '/'
	};
	document.addEventListener("DOMContentLoaded", function(event) {
		ui.start('#firebaseui-auth-container', uiConfig);
	  });
	
}

function updateClubCount(club){
	return firebase.database().ref('clubs/'+ club + '/count').once('value').then(function(snapshot){
		console.log(snapshot.val());
		firebase.database().ref('clubs/' + club).set({
			'count': (snapshot.val() + 1)
		});
	});
};

function getClubCount(club){
	var count = firebase.database().ref('clubs/' + club);
	count.on('value', function(snapshot){
		updatecount(club, snapshot.val());
	});
};



