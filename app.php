<?php

require 'vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;

$app = new \Silex\Application();

$app['debug'] = true;

$dbopts = parse_url(getenv('DATABASE_URL'));

$app->register(new Herrera\Pdo\PdoServiceProvider(),
  array(
    'pdo.dsn' => 'pgsql:dbname='.ltrim($dbopts["path"],'/').';host='.$dbopts["host"],
    'pdo.port' => $dbopts["port"],
    'pdo.username' => $dbopts["user"],
    'pdo.password' => $dbopts["pass"]
  )
);

$app->get('/', function () use ($app) {
  return $app->sendFile('static/index.html');
});

$app->get('/within', function (Request $request) use ($app) {

 	$query = 'SELECT * FROM tbl_airp WHERE (latitude_deg BETWEEN ' .
 		$request->get('lat1') . ' AND ' . $request->get('lat2') . ') AND (longitude_deg BETWEEN ' .
 		$request->get('lon1') . ' AND ' . $request->get('lon2') .') AND type = "large_airport"';

  $st = $app['pdo']->prepare('SELECT name FROM airports');
  $st->execute();

	$rows = array();

	while($r = $result->fetch(PDO::FETCH_ASSOC)) {
	    $rows[] = $r;
	}


 	return $app->json(json_encode($rows));

});

$app->run();
