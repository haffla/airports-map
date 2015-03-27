<?php

require 'vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;

$app = new \Silex\Application();

$app['debug'] = true;

$app->get('/', function () use ($app) {
  return $app->sendFile('static/index.html');
});

$app->get('/within', function (Request $request) use ($app) {

	$con = mysql_connect(getenv('db_host'),getenv('db_user'), getenv('db_pw')) or die('Could not connect: ' . mysql_error());

 	mysql_select_db("airports", $con);

 
 	$query = 'SELECT * FROM tbl_airp WHERE (latitude_deg BETWEEN ' .
 		$request->get('lat1') . ' AND ' . $request->get('lat2') . ') AND (longitude_deg BETWEEN ' . 
 		$request->get('lon1') . ' AND ' . $request->get('lon2') .') AND type = "large_airport"';

 	$result = mysql_query($query, $con) or die (mysql_error());

 	$rows = array();
	while($r = mysql_fetch_assoc($result)) {
	    $rows[] = $r;
	}
 	
 	mysql_close($con);

 	return $app->json(json_encode($rows));

});

$app->run();