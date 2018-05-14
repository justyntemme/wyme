var app;
(function() {

	app = new Vue({
		el: '#app',
		data: {
			loginVisible: false,
			checkinVisible: false
		},
		methods: {
			toggle: function(dataVar) {
				var v = this;
				v.dataVar = !v.dataVar;
			},
			hideAllDropdowns: function() {
				var v = this;
				v.loginVisible = false;
				v.checkinVisible = false;
			}
		},
		mounted: function() {
			firebase.initializeApp(config);
			window.renderLogin();
		}
	})

})();

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
	if (!event.target.matches('.dropbtn')) {
		app.hideAllDropdowns();
	}
};

function getPoints() {
	return [
		new google.maps.LatLng(37.673222,-97.401393),
		new google.maps.LatLng(37.673222,-97.401393),
		new google.maps.LatLng(37.673222,-97.401393),
		new google.maps.LatLng(37.673222,-97.401393),
		new google.maps.LatLng(37.673222,-97.401393)
	];
}

var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
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
	ui.start('#firebaseui-auth-container', uiConfig);
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

var config = {
	apiKey: "AIzaSyBBBwB7S6ekYD-oxLPWFu1G7CkKGTXdw-Q",
	authDomain: "wyme-wichita.firebaseapp.com",
	databaseURL: "https://wyme-wichita.firebaseio.com",
	projectId: "wyme-wichita",
	storageBucket: "wyme-wichita.appspot.com",
	messagingSenderId: "831469219617"
};
