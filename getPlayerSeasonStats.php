<?php
	
if ($_REQUEST['away'] != "" && $_REQUEST['home'] != "" ) {
	def();
}
	
function def() {
	
	$teamKey = array(
	"NJD" => "New Jersey Devils",
	"NYI" => "New York Islanders",
	"NYR" => "New York Rangers",
	"PHI" => "Philadelphia Flyers",
	"PIT" => "Pittsburgh Penguins",
	"BOS" => "Boston Bruins",
	"BUF" => "Buffalo Sabres",
	"MTL" => "Montréal Canadiens",
	"OTT" => "Ottawa Senators",
	"TOR" => "Toronto Maple Leafs",
	"CAR" => "Carolina Hurricanes",
	"FLA" => "Florida Panthers",
	"TBL" => "Tampa Bay Lightning",
	"WSH" => "Washington Capitals",
	"CHI" => "Chicago Blackhawks",
	"DET" => "Detroit Red Wings",
	"NSH" => "Nashville Predators",
	"STL" => "St. Louis Blues",
	"CGY" => "Calgary Flames",
	"COL" => "Colorado Avalanche",
	"EDM" => "Edmonton Oilers",
	"VAN" => "Vancouver Canucks",
	"ANA" => "Anaheim Ducks",
	"DAL" => "Dallas Stars",
	"LAK" => "Los Angeles Kings",
	"SJS" => "San Jose Sharks",
	"CBJ" => "Columbus Blue Jackets",
	"MIN" => "Minnesota Wild",
	"WPG" => "Winnipeg Jets",
	"ARI" => "Arizona Coyotes",
	"VGK" => "Vegas Golden Knights"
	);
	
	$awayTeam = $teamKey[$_REQUEST['away']];
	$homeTeam = $teamKey[$_REQUEST['home']];
		
	$servername = "localhost";
	$username = "root";
	$password = "";
	$dbname = "nhlstats";

	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);

	$exportData = array();

	$playerStatsAway = array();
	$playerStatsHome = array();
	
	//get away stats
	$sql = "SELECT name, position, gamesPlayed, goals, assists, points, plusMinus, shots, hits, penaltyMinutes, wins, shotsAgainst, saves, goalsAgainst, savePercentage, goalAgainstAverage, shutouts FROM `".$awayTeam."`";
	$result = $conn->query($sql);
	if ($result->num_rows > 0) {
		while($row = $result->fetch_assoc()) {
			array_push($playerStatsAway, $row);			
		}
	}
	
	//get home stats
	$sql = "SELECT name, position, gamesPlayed, goals, assists, points, plusMinus, shots, hits, penaltyMinutes, wins, shotsAgainst, saves, goalsAgainst, savePercentage, goalAgainstAverage, shutouts FROM `".$homeTeam."`";
	$result = $conn->query($sql);
	if ($result->num_rows > 0) {
		while($row = $result->fetch_assoc()) {
			array_push($playerStatsHome, $row);		
		}
	}		
	
	$playerStats = array(
	"homeTeamName" => $homeTeam,
	"awayTeamName" => $awayTeam,
	"awayStats" => $playerStatsAway,
	"homeStats" => $playerStatsHome
	);	
	array_push($exportData, $playerStats);

	echo(json_encode($playerStats, JSON_UNESCAPED_UNICODE));
}

?>