window.onload = function() {

//style for active game
var activeCell = document.getElementById("gameReelCell0");
activeCell.style.borderColor = "white";
activeCell.style.backgroundColor = "#4a4b51";
activeCell.style.color = "white";

var actualGameCount;
var team;
var scorer;
var assist1;
var assist2;
var statTableAway = document.getElementById("statTableAway");
var statTableHome = document.getElementById("statTableHome");
var goalieStatTableAway = document.getElementById("statTableAwayGoalies");
var goalieStatTableHome = document.getElementById("statTableHomeGoalies");
var teamNameAway = document.getElementById("teamNameAway");
var teamNameHome = document.getElementById("teamNameHome");

// get and display nhl gamedata
data =  {'action': "getStats"};
    $.post('getstats.php', data, function (response) {
		var result = JSON.parse(response);
		actualGameCount = result.length;
		gameCount = actualGameCount -1;
	
	if(gameCount >= 0) {	
		//fill stat-table		
		teamNameAway.innerHTML = result[0].gameStats.gameData.teams.away.name;
		teamNameHome.innerHTML = result[0].gameStats.gameData.teams.home.name;
		
		//fill away-table
		for(i = 0; i < result[0].awayStats.length; i++){
			if(result[0].awayStats[i].position != "G"){
				var newRow = statTableAway.insertRow(-1);
				newRow.insertCell(-1).innerHTML = result[0].awayStats[i].name;
				newRow.insertCell(-1).innerHTML = result[0].awayStats[i].position;
				newRow.insertCell(-1).innerHTML = result[0].awayStats[i].gamesPlayed;
				newRow.insertCell(-1).innerHTML = result[0].awayStats[i].goals;
				newRow.insertCell(-1).innerHTML = result[0].awayStats[i].assists;
				newRow.insertCell(-1).innerHTML = result[0].awayStats[i].points;
				newRow.insertCell(-1).innerHTML = result[0].awayStats[i].plusMinus;
				newRow.insertCell(-1).innerHTML = result[0].awayStats[i].shots;
				newRow.insertCell(-1).innerHTML = result[0].awayStats[i].hits;
				newRow.insertCell(-1).innerHTML = result[0].awayStats[i].penaltyMinutes;
			}
			else {
				var newRow = goalieStatTableAway.insertRow(-1);
				newRow.insertCell(-1).innerHTML = result[0].awayStats[i].name;
				newRow.insertCell(-1).innerHTML = result[0].awayStats[i].position;
				newRow.insertCell(-1).innerHTML = result[0].awayStats[i].gamesPlayed;
				newRow.insertCell(-1).innerHTML = result[0].awayStats[i].wins;
				newRow.insertCell(-1).innerHTML = result[0].awayStats[i].shotsAgainst;
				newRow.insertCell(-1).innerHTML = result[0].awayStats[i].saves;
				newRow.insertCell(-1).innerHTML = result[0].awayStats[i].goalsAgainst;
				newRow.insertCell(-1).innerHTML = result[0].awayStats[i].savePercentage;
				newRow.insertCell(-1).innerHTML = result[0].awayStats[i].goalAgainstAverage;
				newRow.insertCell(-1).innerHTML = result[0].awayStats[i].shutouts;
			}
		}
		
		//fill home-table
		for(i = 0; i < result[0].homeStats.length; i++){
			if(result[0].homeStats[i].position != "G"){
				var newRow = statTableHome.insertRow(-1);
				newRow.insertCell(-1).innerHTML = result[0].homeStats[i].name;
				newRow.insertCell(-1).innerHTML = result[0].homeStats[i].position;
				newRow.insertCell(-1).innerHTML = result[0].homeStats[i].gamesPlayed;
				newRow.insertCell(-1).innerHTML = result[0].homeStats[i].goals;
				newRow.insertCell(-1).innerHTML = result[0].homeStats[i].assists;
				newRow.insertCell(-1).innerHTML = result[0].homeStats[i].points;
				newRow.insertCell(-1).innerHTML = result[0].homeStats[i].plusMinus;
				newRow.insertCell(-1).innerHTML = result[0].homeStats[i].shots;
				newRow.insertCell(-1).innerHTML = result[0].homeStats[i].hits;
				newRow.insertCell(-1).innerHTML = result[0].homeStats[i].penaltyMinutes;
			}
			else {
				var newRow = goalieStatTableHome.insertRow(-1);
				newRow.insertCell(-1).innerHTML = result[0].homeStats[i].name;
				newRow.insertCell(-1).innerHTML = result[0].homeStats[i].position;
				newRow.insertCell(-1).innerHTML = result[0].homeStats[i].gamesPlayed;
				newRow.insertCell(-1).innerHTML = result[0].homeStats[i].wins;
				newRow.insertCell(-1).innerHTML = result[0].homeStats[i].shotsAgainst;
				newRow.insertCell(-1).innerHTML = result[0].homeStats[i].saves;
				newRow.insertCell(-1).innerHTML = result[0].homeStats[i].goalsAgainst;
				newRow.insertCell(-1).innerHTML = result[0].homeStats[i].savePercentage;
				newRow.insertCell(-1).innerHTML = result[0].homeStats[i].goalAgainstAverage;
				newRow.insertCell(-1).innerHTML = result[0].homeStats[i].shutouts;
			}
		}
		
		
		// fill the gamereel
		for(i = 0; i <= gameCount; i++){
			
			var table = document.getElementById("eventList"+i);
			var team1 = document.getElementById("teamOne"+i);
			var teamScore = document.getElementById("teamScore"+i);
			var gameTime = document.getElementById("gameTime"+i);
			var team2 = document.getElementById("teamTwo"+i);
			var period = "TBD";
			
			//these are needed to count the goals scored in shootout to determine the winner. 
			var awayTeam = result[i].gameStats.gameData.teams.away.name;
			var homeTeam = result[i].gameStats.gameData.teams.home.name;
			var awaySOscore = 0;
			var homeSOscore = 0;
			
			team1.innerHTML = result[i].gameStats.gameData.teams.away.triCode;
			team2.innerHTML = result[i].gameStats.gameData.teams.home.triCode;
			team1.style.backgroundImage = `url("logos/${result[i].gameStats.gameData.teams.away.triCode}.png")`;
			team2.style.backgroundImage = `url("logos/${result[i].gameStats.gameData.teams.home.triCode}.png")`;
		
		
			if (result[i].gameStats.gameData.status.statusCode != 1) { //see if game has started.
				var numberOfEvents = result[i].gameStats.liveData.plays.allPlays.length;
				
				for(j = 0; j < numberOfEvents; j++){
					
					//set game times
					if(result[i].gameStats.liveData.plays.allPlays[j].result.event == "Game End"){
						gameTime.innerHTML = "Final";
					} else if (result[i].gameStats.liveData.plays.allPlays[j].result.event == "Period End"){
						gameTime.innerHTML = result[i].gameStats.liveData.plays.allPlays[j].result.description;
					} else if (numberOfEvents - j == 1 && result[i].gameStats.liveData.plays.allPlays[j].result.event != "Game End") {
						gameTime.innerHTML = (result[i].gameStats.liveData.plays.allPlays[j].about.periodTime+" / "+period);
					}
					
					// find the goals
					if(result[i].gameStats.liveData.plays.allPlays[j].result.event == "Goal"){
						
						// find the current period
						if (result[i].gameStats.liveData.plays.allPlays[j].about.period == 1){
							period = "1st";
						} else if (result[i].gameStats.liveData.plays.allPlays[j].about.period == 2){
							period = "2nd";
						} else if (result[i].gameStats.liveData.plays.allPlays[j].about.period == 3){
							period = "3rd";
						} else if (result[i].gameStats.liveData.plays.allPlays[j].about.period == 4){
							period = "OT";
						}
						
						// conditions are to check how many players are involved in a goal.
						if (result[i].gameStats.liveData.plays.allPlays[j].players.length >= 3) {
							team =  result[i].gameStats.liveData.plays.allPlays[j].team.triCode+" - "+result[i].gameStats.liveData.plays.allPlays[j].about.periodTime+" / "+period;
							scorer = result[i].gameStats.liveData.plays.allPlays[j].players[0].player.fullName;
							if (result[i].gameStats.liveData.plays.allPlays[j].players[1].playerType == "Assist"){
								assist1 = (result[i].gameStats.liveData.plays.allPlays[j].players[1].player.fullName);
							} else { assist1 = "Unassisted"}
							if (result[i].gameStats.liveData.plays.allPlays[j].players[2].playerType == "Assist"){
								assist2 = (", "+result[i].gameStats.liveData.plays.allPlays[j].players[2].player.fullName);
							} else { assist2 = ""}							
							table.innerHTML += (team+"<br>"+"G: "+scorer+"<br>"+"A: "+assist1+assist2+"<br></br>");
						} else if (result[i].gameStats.liveData.plays.allPlays[j].players.length == 2 && result[i].gameStats.liveData.plays.allPlays[j].about.periodType != "SHOOTOUT") {
							team = result[i].gameStats.liveData.plays.allPlays[j].team.triCode+" - "+result[i].gameStats.liveData.plays.allPlays[j].about.periodTime+" / "+period;
							scorer = result[i].gameStats.liveData.plays.allPlays[j].players[0].player.fullName;
							if (result[i].gameStats.liveData.plays.allPlays[j].players[1].playerType == "Assist"){
								assist1 = (result[i].gameStats.liveData.plays.allPlays[j].players[1].player.fullName);
							} else { assist1 = "Unassisted"; assist2="";}					
							table.innerHTML += (team+"<br>"+"G: "+scorer+"<br>"+"A: "+assist1+assist2+"<br></br>");						
						} else if (result[i].gameStats.liveData.plays.allPlays[j].players.length == 2 && result[i].gameStats.liveData.plays.allPlays[j].about.periodType == "SHOOTOUT") {
							team = result[i].gameStats.liveData.plays.allPlays[j].team.triCode+" - "+"Shootout";
							scorer = result[i].gameStats.liveData.plays.allPlays[j].players[0].player.fullName;
							if (result[i].gameStats.liveData.plays.allPlays[j].team.name == awayTeam) {
								awaySOscore ++;
							} else {
								homeSOscore ++;
							}
							table.innerHTML += (team+"<br>"+"G: "+scorer+"<br></br>");
						} else {
							team = result[i].gameStats.liveData.plays.allPlays[j].team.triCode+" - "+result[i].gameStats.liveData.plays.allPlays[j].about.periodTime+" / "+period;
							scorer = result[i].gameStats.liveData.plays.allPlays[j].players[0].player.fullName;
							assist1 = "Unassisted";
							assist2 = "";
							table.innerHTML += (team+"<br>"+"G: "+scorer+"<br>"+"A: "+assist1+assist2+"<br></br>");	
						}
					}
				}
				//add a goal for the winner of games that ended in shootout.
				if (awaySOscore > homeSOscore) {
					teamScore.innerHTML = (result[i].gameStats.liveData.plays.currentPlay.about.goals.away+1)+"\xa0\xa0\xa0-\xa0\xa0\xa0"+result[i].gameStats.liveData.plays.currentPlay.about.goals.home;
				} else if (homeSOscore > awaySOscore) {
					teamScore.innerHTML = result[i].gameStats.liveData.plays.currentPlay.about.goals.away+"\xa0\xa0\xa0-\xa0\xa0\xa0"+(result[i].gameStats.liveData.plays.currentPlay.about.goals.home+1);
				} else {
					teamScore.innerHTML = result[i].gameStats.liveData.plays.currentPlay.about.goals.away+"\xa0\xa0\xa0-\xa0\xa0\xa0"+result[i].gameStats.liveData.plays.currentPlay.about.goals.home;
				}
			} else {
				teamScore.innerHTML = "0"+"\xa0\xa0\xa0-\xa0\xa0\xa0"+"0";
				gameTime.innerHTML = "Game has not started";
			}
		}
	}
	document.getElementById("slideRight").disabled = false;
	document.getElementById("slideLeft").disabled = false;	
});


//get stats for clicked game
$('.gameReelCell').click(function(){
	
	//style for active cell	
	activeCell.style.borderColor = "#b2b2b2";
	activeCell.style.backgroundColor = "#323438";
	activeCell.style.color = "#999999";
	activeCell = this;
	activeCell.style.borderColor = "white";
	activeCell.style.backgroundColor = "#4a4b51";
	activeCell.style.color = "white";
	
	//get team names of selected game
	var team1td = $('.singleGame .team1', this);
	var team2td = $('.singleGame .team2', this);	
	var team1 = $(team1td).html();
	var team2 = $(team2td).html();
		
	data =  {'away': team1, 'home': team2};
    $.post('getPlayerSeasonStats.php', data, function (response) {
		var result = JSON.parse(response);
		console.log(result);
		
		//set team names
		teamNameAway.innerHTML = result.awayTeamName;
		teamNameHome.innerHTML = result.homeTeamName;
		
		//fill away-table
		$("#statTableAway tr:not(#keyRow)").remove();
		$("#statTableAwayGoalies tr:not(#keyRow)").remove();	
		for(i = 0; i < result.awayStats.length; i++){
			if(result.awayStats[i].position != "G"){
				var newRow = statTableAway.insertRow(-1);
				newRow.insertCell(-1).innerHTML = result.awayStats[i].name;
				newRow.insertCell(-1).innerHTML = result.awayStats[i].position;
				newRow.insertCell(-1).innerHTML = result.awayStats[i].gamesPlayed;
				newRow.insertCell(-1).innerHTML = result.awayStats[i].goals;
				newRow.insertCell(-1).innerHTML = result.awayStats[i].assists;
				newRow.insertCell(-1).innerHTML = result.awayStats[i].points;
				newRow.insertCell(-1).innerHTML = result.awayStats[i].plusMinus;
				newRow.insertCell(-1).innerHTML = result.awayStats[i].shots;
				newRow.insertCell(-1).innerHTML = result.awayStats[i].hits;
				newRow.insertCell(-1).innerHTML = result.awayStats[i].penaltyMinutes;
			}
			else {
				var newRow = goalieStatTableAway.insertRow(-1);
				newRow.insertCell(-1).innerHTML = result.awayStats[i].name;
				newRow.insertCell(-1).innerHTML = result.awayStats[i].position;
				newRow.insertCell(-1).innerHTML = result.awayStats[i].gamesPlayed;
				newRow.insertCell(-1).innerHTML = result.awayStats[i].wins;
				newRow.insertCell(-1).innerHTML = result.awayStats[i].shotsAgainst;
				newRow.insertCell(-1).innerHTML = result.awayStats[i].saves;
				newRow.insertCell(-1).innerHTML = result.awayStats[i].goalsAgainst;
				newRow.insertCell(-1).innerHTML = result.awayStats[i].savePercentage;
				newRow.insertCell(-1).innerHTML = result.awayStats[i].goalAgainstAverage;
				newRow.insertCell(-1).innerHTML = result.awayStats[i].shutouts;
			}
		}
		
		//fill home-table
		$("#statTableHome tr:not(#keyRow)").remove();	
		$("#statTableHomeGoalies tr:not(#keyRow)").remove();
		for(i = 0; i < result.homeStats.length; i++){
			if(result.homeStats[i].position != "G"){
				var newRow = statTableHome.insertRow(-1);
				newRow.insertCell(-1).innerHTML = result.homeStats[i].name;
				newRow.insertCell(-1).innerHTML = result.homeStats[i].position;
				newRow.insertCell(-1).innerHTML = result.homeStats[i].gamesPlayed;
				newRow.insertCell(-1).innerHTML = result.homeStats[i].goals;
				newRow.insertCell(-1).innerHTML = result.homeStats[i].assists;
				newRow.insertCell(-1).innerHTML = result.homeStats[i].points;
				newRow.insertCell(-1).innerHTML = result.homeStats[i].plusMinus;
				newRow.insertCell(-1).innerHTML = result.homeStats[i].shots;
				newRow.insertCell(-1).innerHTML = result.homeStats[i].hits;
				newRow.insertCell(-1).innerHTML = result.homeStats[i].penaltyMinutes;
			}
			else {
				var newRow = goalieStatTableHome.insertRow(-1);
				newRow.insertCell(-1).innerHTML = result.homeStats[i].name;
				newRow.insertCell(-1).innerHTML = result.homeStats[i].position;
				newRow.insertCell(-1).innerHTML = result.homeStats[i].gamesPlayed;
				newRow.insertCell(-1).innerHTML = result.homeStats[i].wins;
				newRow.insertCell(-1).innerHTML = result.homeStats[i].shotsAgainst;
				newRow.insertCell(-1).innerHTML = result.homeStats[i].saves;
				newRow.insertCell(-1).innerHTML = result.homeStats[i].goalsAgainst;
				newRow.insertCell(-1).innerHTML = result.homeStats[i].savePercentage;
				newRow.insertCell(-1).innerHTML = result.homeStats[i].goalAgainstAverage;
				newRow.insertCell(-1).innerHTML = result.homeStats[i].shutouts;
			}
		}
		
		
	});
	
});

//slide the gamereel.
var buttonDisabler = 0;
$("#slideLeft").click(function(){
	if (actualGameCount > 5) {
		$("#gameReel").filter(':not(:animated)').animate({left: '-=1432px'},{queue: false});
		buttonDisabler += 1;
		actualGameCount -= 4;
	}
});
$("#slideRight").click(function(){
	if (buttonDisabler > 0) {
		$("#gameReel").filter(':not(:animated)').animate({left: '+=1432px'},{queue: false});
		buttonDisabler -= 1;
		actualGameCount += 4;
	}
});

//parallax background
$(window).scroll(function () {
    $("body").css("background-position","0 " + ($(this).scrollTop() / 2) + "px");
});
}
