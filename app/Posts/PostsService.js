app.service('PostsService', function($http, $filter, $q) { 
	this.getPosts = function (pageSize, pageNumber) {
    var deferred = $q.defer();
    $http.get("https://jsonplaceholder.typicode.com/posts").then(
    	// WEB SQL
    	function onSuccess(response) {
				var db = window.openDatabase('POSTS', '1.0', 'DB for posts caching', 2 * 1024 * 1024);
				caching(db, response.data);
				db.transaction(function (tx) {
					tx.executeSql("SELECT * FROM POSTS", [], function(tx, result) {
						var k = result.rows.length - 1;
						deferred.resolve({
							postsQuantity: JSON.parse(result.rows.item(k)['posts']).length,
							posts: JSON.parse(result.rows.item(k)['posts']).splice((pageNumber * pageSize) - pageSize, pageSize),
							timeStorage: result.rows.item(k)['timeStorage']
						});
						debugger;
					});
				});
    	},
			// LOCAL STORAGE
			// function onSuccess(response) {
			// 	caching(response.data);
			// 	deferred.resolve({
			// 		postsQuantity: JSON.parse(window.localStorage.posts).length,
			// 		posts: JSON.parse(window.localStorage.posts).splice((pageNumber * pageSize) - pageSize, pageSize),
			// 		timeStorage: window.localStorage.timeStorage
			// 	});
			// debugger;
  		// 	},
			function onError(response) {
				deferred.reject("GetPosts method's status: " + response.status + " " + response.statusText);
			}
		);
		return deferred.promise;
	};
	
	function caching(db, posts) {
		db.transaction(function (tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS POSTS (timeStorage, posts)');
			tx.executeSql("SELECT * FROM POSTS", [], function(tx, result) {
				var i = result.rows.length - 1;
				debugger;
				if (i == -1 || Date.now() - result.rows.item(i)['timeStorage'] > 60000) {
			 		tx.executeSql("INSERT INTO POSTS (timeStorage, posts) values(?, ?)",
		  			[new Date().getTime(), window.angular.toJson(posts)], null, null
		  		);
			  	debugger;
				}
			});
		});
	}

		// LOCAL STORAGE
		// if (!window.localStorage.timeStorage || Date.now() - window.localStorage.timeStorage > 300000) {
		// 	debugger;
		// 	window.localStorage.timeStorage = Date.parse($filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss'));	
		// 	window.localStorage.posts = window.angular.toJson(posts);
		// 	debugger;
		// }
	
	this.savePost = function (id, data) {
		return $http.put("https://jsonplaceholder.typicode.com/posts/" + id, data);
	};
	this.getCommentsByPostId = function (postId) {
		return $http.get("https://jsonplaceholder.typicode.com/posts/" + postId + "/comments");
	};  
});