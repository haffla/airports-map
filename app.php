<?php

require 'vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;

$app = new \Silex\Application();

$app['debug'] = true;

$app->get('/', function () use ($app) {
  return $app->sendFile('static/index.html');
});

$app->get('/within', function (Request $request) use ($app) {

	$mysqli = new mysqli(getenv('db_host'),getenv('db_user'), getenv('db_pw'), "airports");

	if ($mysqli->connect_errno) {
	    printf("Connect failed: %s\n", $mysqli->connect_error);
	    exit();
	}

 	$query = 'SELECT * FROM tbl_airp WHERE (latitude_deg BETWEEN ' .
 		$request->get('lat1') . ' AND ' . $request->get('lat2') . ') AND (longitude_deg BETWEEN ' . 
 		$request->get('lon1') . ' AND ' . $request->get('lon2') .') AND type = "large_airport"';

	$rows = array();

 	if($result = $mysqli->query($query)) {
		while($r = $result->fetch_assoc()) {
		    $rows[] = $r;
		}
	 	
	 	$mysqli->close();
 	}

 	
 	return $app->json(json_encode($rows));

});

$app->run();