<?php 

if (isset($_REQUEST['action'])) {
    switch ($_REQUEST['action']) {
        case 'getStats':
			def();
            break;
    }
}

function def(){
	
	$servername = "localhost";
	$username = "root";
	$password = "";
	$dbname = "nhlstats";

	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	
	$games = array();
	
	//get schedule
	$ch = curl_init('http://statsapi.web.nhl.com/api/v1/schedule');
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$result=curl_exec($ch);
	$schedule=json_decode($result, true);
	curl_close($ch);
	
	//get current games from schedule
	foreach($schedule["dates"][0]["games"] as $value){
		$ch = curl_init('http://statsapi.web.nhl.com'.$value["link"].'');
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$result=curl_exec($ch);
		$match=json_decode($result, true);
		curl_close($ch);				
		array_push($games, $match);		
	}
	
	$exportData = array();
	
	foreach($games as $value){
		
		$playerStatsAway = array();
		$playerStatsHome = array();
		
		//get away stats
		$sql = "SELECT name, position, gamesPlayed, goals, assists, points, plusMinus, shots, hits, penaltyMinutes, wins, shotsAgainst, saves, goalsAgainst, savePercentage, goalAgainstAverage, shutouts FROM `".$value["gameData"]["teams"]["away"]["name"]."`";
		$result = $conn->query($sql);
		if ($result->num_rows > 0) {
			while($row = $result->fetch_assoc()) {
				array_push($playerStatsAway, $row);			
			}
		}
		
		//get home stats
		$sql = "SELECT name, position, gamesPlayed, goals, assists, points, plusMinus, shots, hits, penaltyMinutes, wins, shotsAgainst, saves, goalsAgainst, savePercentage, goalAgainstAverage, shutouts FROM `".$value["gameData"]["teams"]["home"]["name"]."`";
		$result = $conn->query($sql);
		if ($result->num_rows > 0) {
			while($row = $result->fetch_assoc()) {
				array_push($playerStatsHome, $row);			
			}
		}		
		
		$matchData = array(
		"gameStats" => $value,
		"awayStats" => $playerStatsAway,
		"homeStats" => $playerStatsHome
		);	
		array_push($exportData, $matchData);
		
	}
	echo(json_encode($exportData, JSON_UNESCAPED_UNICODE));
	
}

?>