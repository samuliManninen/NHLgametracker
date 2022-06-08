<?php
//This should be run once a day for up to date stats.

ini_set('max_execution_time', 300);

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
	
	foreach($games as $value){
		
		//get rosters from current games
		$ch = curl_init('http://statsapi.web.nhl.com'.$value["gameData"]["teams"]["away"]["link"].'/roster');
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$result=curl_exec($ch);
		$awayRoster=json_decode($result, true);
		curl_close($ch);
		
		$ch = curl_init('http://statsapi.web.nhl.com'.$value["gameData"]["teams"]["home"]["link"].'/roster');
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$result=curl_exec($ch);
		$homeRoster=json_decode($result, true);
		curl_close($ch);
		
		
		$sql = "TRUNCATE TABLE `".$value["gameData"]["teams"]["away"]["name"]."`";
	
		if ($conn->query($sql) === TRUE) {
			//echo "New record created successfully";
		} else {
			echo "Error: " . $sql . "<br>" . $conn->error;
		}
		
		$sql = "TRUNCATE TABLE `".$value["gameData"]["teams"]["home"]["name"]."`";
	
		if ($conn->query($sql) === TRUE) {
			//echo "New record created successfully";
		} else {
			echo "Error: " . $sql . "<br>" . $conn->error;
		}
		
		
		
		//insert away stats
		foreach($awayRoster["roster"] as $value2){
			$ch2 = curl_init('http://statsapi.web.nhl.com/api/v1/people/'.$value2["person"]["id"].'/stats?stats=statsSingleSeason&season=20182019');
			curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
			$result2=curl_exec($ch2);
			$awayStats=json_decode($result2, true);
			
			if($value2["position"]["code"] != "G" && !empty($awayStats["stats"][0]["splits"])){
			
				$sql = $conn->prepare("INSERT INTO `".$value["gameData"]["teams"]["away"]["name"]."` (id, name, position, gamesPlayed, goals, assists, points, plusMinus, shots, hits, penaltyMinutes)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
				$sql->bind_param("issiiiiiiii", $id, $name, $position, $gamesPlayed, $goals, $assists, $points, $plusMinus, $shots, $hits, $penaltyMinutes);
				$id = $value2["person"]["id"];
				$name = $value2["person"]["fullName"];
				$position = $value2["position"]["code"];
				$gamesPlayed = $awayStats["stats"][0]["splits"][0]["stat"]["games"]; 
				$goals = $awayStats["stats"][0]["splits"][0]["stat"]["goals"];
				$assists = $awayStats["stats"][0]["splits"][0]["stat"]["assists"];
				$points = $awayStats["stats"][0]["splits"][0]["stat"]["points"];
				$plusMinus = $awayStats["stats"][0]["splits"][0]["stat"]["plusMinus"];
				$shots = $awayStats["stats"][0]["splits"][0]["stat"]["shots"];
				$hits = $awayStats["stats"][0]["splits"][0]["stat"]["hits"];
				$penaltyMinutes = $awayStats["stats"][0]["splits"][0]["stat"]["pim"];
				$sql->execute();
			}
			else if ($value2["position"]["code"] == "G" && !empty($awayStats["stats"][0]["splits"])) {
				$sql = $conn->prepare("INSERT INTO `".$value["gameData"]["teams"]["away"]["name"]."` (id, name, position, gamesPlayed, wins, shotsAgainst, saves, goalsAgainst, savePercentage, goalAgainstAverage, shutouts)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
				$sql->bind_param("issiiiiiddi", $id, $name, $position, $gamesPlayed, $wins, $shotsAgainst, $saves, $goalsAgainst, $savePercentage, $goalsAgainstAverage, $shutouts);
				$id = $value2["person"]["id"];
				$name = $value2["person"]["fullName"];
				$position = $value2["position"]["code"];
				$gamesPlayed = $awayStats["stats"][0]["splits"][0]["stat"]["games"]; 
				$wins = $awayStats["stats"][0]["splits"][0]["stat"]["wins"];
				$shotsAgainst = $awayStats["stats"][0]["splits"][0]["stat"]["shotsAgainst"];
				$saves = $awayStats["stats"][0]["splits"][0]["stat"]["saves"];
				$goalsAgainst = $awayStats["stats"][0]["splits"][0]["stat"]["goalsAgainst"];
				$savePercentage = $awayStats["stats"][0]["splits"][0]["stat"]["savePercentage"];
				$goalsAgainstAverage = $awayStats["stats"][0]["splits"][0]["stat"]["goalAgainstAverage"];
				$shutouts = $awayStats["stats"][0]["splits"][0]["stat"]["shutouts"];
				$sql->execute();
			}
		}
		
		// insert home stats
		foreach($homeRoster["roster"] as $value2){
			$ch2 = curl_init('http://statsapi.web.nhl.com/api/v1/people/'.$value2["person"]["id"].'/stats?stats=statsSingleSeason&season=20182019');
			curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
			$result2=curl_exec($ch2);
			$homeStats=json_decode($result2, true);
			
			if($value2["position"]["code"] != "G" && !empty($homeStats["stats"][0]["splits"])){					

				$sql = $conn->prepare("INSERT INTO `".$value["gameData"]["teams"]["home"]["name"]."` (id, name, position, gamesPlayed, goals, assists, points, plusMinus, shots, hits, penaltyMinutes)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
				$sql->bind_param("issiiiiiiii", $id, $name, $position, $gamesPlayed, $goals, $assists, $points, $plusMinus, $shots, $hits, $penaltyMinutes);
				$id = $value2["person"]["id"];
				$name = $value2["person"]["fullName"];
				$position = $value2["position"]["code"];
				$gamesPlayed = $homeStats["stats"][0]["splits"][0]["stat"]["games"]; 
				$goals = $homeStats["stats"][0]["splits"][0]["stat"]["goals"];
				$assists = $homeStats["stats"][0]["splits"][0]["stat"]["assists"];
				$points = $homeStats["stats"][0]["splits"][0]["stat"]["points"];
				$plusMinus = $homeStats["stats"][0]["splits"][0]["stat"]["plusMinus"];
				$shots = $homeStats["stats"][0]["splits"][0]["stat"]["shots"];
				$hits = $homeStats["stats"][0]["splits"][0]["stat"]["hits"];
				$penaltyMinutes = $homeStats["stats"][0]["splits"][0]["stat"]["pim"];
				$sql->execute();			
			}	
			else if ($value2["position"]["code"] == "G" && !empty($homeStats["stats"][0]["splits"])) {
				$sql = $conn->prepare("INSERT INTO `".$value["gameData"]["teams"]["home"]["name"]."` (id, name, position, gamesPlayed, wins, shotsAgainst, saves, goalsAgainst, savePercentage, goalAgainstAverage, shutouts)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
				$sql->bind_param("issiiiiiddi", $id, $name, $position, $gamesPlayed, $wins, $shotsAgainst, $saves, $goalsAgainst, $savePercentage, $goalsAgainstAverage, $shutouts);
				$id = $value2["person"]["id"];
				$name = $value2["person"]["fullName"];
				$position = $value2["position"]["code"];
				$gamesPlayed = $homeStats["stats"][0]["splits"][0]["stat"]["games"]; 
				$wins = $homeStats["stats"][0]["splits"][0]["stat"]["wins"];
				$shotsAgainst = $homeStats["stats"][0]["splits"][0]["stat"]["shotsAgainst"];
				$saves = $homeStats["stats"][0]["splits"][0]["stat"]["saves"];
				$goalsAgainst = $homeStats["stats"][0]["splits"][0]["stat"]["goalsAgainst"];
				$savePercentage = $homeStats["stats"][0]["splits"][0]["stat"]["savePercentage"];
				$goalsAgainstAverage = $homeStats["stats"][0]["splits"][0]["stat"]["goalAgainstAverage"];
				$shutouts = $homeStats["stats"][0]["splits"][0]["stat"]["shutouts"];
				$sql->execute();
			}
		}
		
	}

$conn->close(); 




?>