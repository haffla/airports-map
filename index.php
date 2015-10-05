<?php

require 'vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;

$app = new \Silex\Application();

$app['debug'] = true;

$dbopts = parse_url(getenv('DATABASE_URL'));
if(isset($dbopts["user"])) {
  $app->register(new Herrera\Pdo\PdoServiceProvider(),
    array(
      'pdo.dsn' => 'pgsql:dbname='.ltrim($dbopts["path"],'/').';host='.$dbopts["host"],
      'pdo.port' => $dbopts["port"],
      'pdo.username' => $dbopts["user"],
      'pdo.password' => $dbopts["pass"]
    )
  );
}
else {
  $app->register(new Herrera\Pdo\PdoServiceProvider(),
    array(
      'pdo.dsn' => 'pgsql:dbname=airport;host=localhost',
      'pdo.port' => '5432',
      'pdo.username' => 'jacke',
      'pdo.password' => 'hintern'
    )
  );
}

$app->get('/', function () use ($app) {
  return $app->sendFile('static/index.html');
});

$app->get('/within', function (Request $request) use ($app) {

  $type = $request->get('type');
  $query = "SELECT * FROM airports WHERE (latitude_deg BETWEEN " .
  	$request->get('lat1') . " AND " . $request->get('lat2') . ") AND (longitude_deg BETWEEN " .
  	$request->get('lon1') . " AND " . $request->get('lon2') .")";

    if($request->get('type') != 'all') {
      $query .= " AND type = '$type'";
    }

  $st = $app['pdo']->prepare($query);
  $st->execute();

	$rows = array();

	while($r = $st->fetch(PDO::FETCH_ASSOC)) {
	    $rows[] = $r;
	}
 	return $app->json(json_encode($rows));

});

$app->run();
