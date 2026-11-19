let me='guest';

const teams = [
	{ id: 'RED', color: '#B94B4B' },
	{ id: 'GREEN', color: '#268653' },
	{ id: 'BLUE', color: '#3478B9' }
];

const roundTimes = [
	'2:00',
	'2:15',
	'2:30',
	'2:45',
	'3:00',
	'3:15',
	'3:30',
	'3:45'
];

function createTextElement(tagName, text) {
	const element = document.createElement(tagName);
	element.textContent = text;
	return element;
}

function appendRow(tbody, values, heading = false, centerValues = true) {
	const row = document.createElement('tr');
	values.forEach((value, index) => {
		const cell = createTextElement(heading ? 'th' : 'td', value);
		if (centerValues && index > 0) {
			cell.className = 'center';
		}
		row.appendChild(cell);
	});
	tbody.appendChild(row);
}

function formatLevel(level) {
	return Number.isInteger(level) ? level.toFixed(1) : String(level);
}

function renderTournament(tournament) {
	const teamStats = teams.map(team => {
		const teamPlayers = tournament.players.filter(player => player.team === team.id);
		const levelTotal = teamPlayers.reduce((total, player) => total + Number(player.level), 0);
		const women = teamPlayers.filter(player => player.gender === 'F').length;
		const men = teamPlayers.filter(player => player.gender === 'M').length;

		return { ...team, players: teamPlayers, levelTotal, women, men };
	});

	teamStats.forEach(team => {
		const table = document.getElementsByClassName("roster-table team-" + team.id)[0];
		table.style.setProperty('--team-color', team.color);

		const tbody = table.querySelector("tbody");
		tbody.replaceChildren();
		team.players.forEach(player => {
			appendRow(tbody, [player.id + ' ' + player.player, formatLevel(Number(player.level)), player.gender], false, false);
		});

		table.querySelector('caption').innerHTML = `${team.id} - ${team.women}F/${team.men}M | Total Rating ${team.levelTotal}`;
	});

	const scheduleTable = document.querySelector('.schedule-table.stage-1 tbody');
	scheduleTable.replaceChildren();

	const roundFilter = document.getElementById('round-filter').value;
	const courtFilter = document.getElementById('court-filter').value;
	const playerFilter = document.getElementById('player-filter').value;
	tournament.matches.sort((a, b) => a.round - b.round || a.court - b.court)
		.filter(match => match.round <= 5)
		.filter(match => (roundFilter === 'ALL' || match.round == roundFilter) &&
			(courtFilter === 'ALL' || match.court == courtFilter) &&
			(playerFilter === 'ALL' || match.team1.includes(playerFilter) || match.team2.includes(playerFilter)))
		.forEach((match, index) => {
			const player1 = tournament.players.find(p => p.id === match.team1[0]);
			const player2 = tournament.players.find(p => p.id === match.team1[1]);
			const player3 = tournament.players.find(p => p.id === match.team2[0]);
			const player4 = tournament.players.find(p => p.id === match.team2[1]);
			const winner1 = match.score[0] > match.score[1];
			const winner2 = match.score[1] > match.score[0];
			const tr = scheduleTable.appendChild(document.createElement('tr'));
			tr.innerHTML = `
			<td>${match.round} - ${roundTimes[match.round - 1]}</td>
			<td>${match.court}</td>
			<td class="${winner1 ? 'winner' : ''}"><div>${player1.id} ${player1.player}</div> <div>${player2.id} ${player2.player}</div></td>
			<td class="${winner2 ? 'winner' : ''}"><div>${player3.id} ${player3.player}</div> <div>${player4.id} ${player4.player}</div></td>
			<td><div onclick="editScore(${match.round}, ${match.court})">${match.score.join(' - ')}</div></td>
		`;
		});

	const rankingTable = document.querySelector('.ranking-table.stage-1 tbody');
	rankingTable.replaceChildren();

	[...tournament.players].sort((a, b) => a.rank - b.rank)
		.forEach((player, index) => {
			const tr = rankingTable.appendChild(document.createElement('tr'));
			tr.innerHTML = `
				<td>${player.id} ${player.player}</td>
				<td>${player.wins ?? 0}</td>
				<td>${player.losses ?? 0}</td>
				<td>${player.points ?? 0}</td>
				<td>${player.rank ?? 0}</td>
			`;
		});

	const scheduleTable2 = document.querySelector('.schedule-table.stage-2 tbody');
	scheduleTable2.replaceChildren();
	const teamMatches = tournament.matches.filter(match => match.round > 5);
	teamMatches
		.forEach((match, index) => {
			const tr = scheduleTable2.appendChild(document.createElement('tr'));
			tr.innerHTML = `
			<td>${match.round} - ${roundTimes[match.round - 1]}</td>
			<td>${match.court}</td>
			<td><div class="${match.team1[0]}">${match.team1[0]}</div></td>
			<td><div class="${match.team2[0]}">${match.team2[0]}</div></td>
			<td><div onclick="editScore(${match.round}, ${match.court})">${match.score.join(' - ')}</div></td>
		`;
		});

	const teamRankingTable = document.querySelector('.ranking-table.team-ranking tbody');
	teamRankingTable.replaceChildren();
	tournament.teams.forEach((team, index) => {
			const tr = teamRankingTable.appendChild(document.createElement('tr'));
			tr.innerHTML = `
				<td><div class="${team.id}" >${team.id}</div></td>
				<td>${team.wins ?? 0}</td>
				<td>${team.losses ?? 0}</td>
				<td>${team.points ?? 0}</td>
				<td><div class="rank-${team.rank ?? 0}"></div></td>
			`;
		});

}

function loadData() {
	// load tournament data from the server using the tournamentId
	fetch(`/api/tournaments/2`)
		.then((response) => response.json())
		.then(data => {
			tournament = data;

			const playerFilterCtrl = document.getElementById('player-filter');
			playerFilterCtrl.replaceChildren();
			const allOption = document.createElement('option');
			allOption.value = 'ALL';
			allOption.textContent = '-- All Players --';
			playerFilterCtrl.appendChild(allOption);
			tournament.players.forEach(player => {
				const option = document.createElement('option');
				option.value = player.id;
				option.textContent = player.id + ' ' + player.player;
				playerFilterCtrl.appendChild(option);
			});

			const roundFilter = localStorage.getItem('roundFilter') || 'ALL';
			const courtFilter = localStorage.getItem('courtFilter') || 'ALL';
			const playerFilter = localStorage.getItem('playerFilter') || 'ALL';

			document.getElementById('round-filter').value = roundFilter;
			document.getElementById('court-filter').value = courtFilter;
			document.getElementById('player-filter').value = playerFilter;

			renderTournament(tournament);

		})
		.catch(error => console.error('Error loading data:', error));
}

function editScore(round, court) {
	if (me !== 'admin') return;

	const match = tournament.matches.find(m => m.round === round && m.court === court);
	if (!match) return;

	const newScore = prompt(
		`Enter new score\n- Round ${match.round}\n- Court ${match.court}\n- Format: x-y (any separator)`,
		`${match.score[0]}-${match.score[1]}`,
	);

	if (newScore) {
		// spliit by any non-digit character
		const [score1, score2] = newScore.split(/\D+/).map(Number);
		if (!isNaN(score1) && !isNaN(score2)) {
			match.score = [score1, score2];
			calculateTournament();
			renderTournament(tournament);

			// save the updated tournament data to the server
			fetch(`/api/tournaments/2`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(tournament)
			})
			.then((response) => response.json())
			.then((data) => {
				console.log('Database saved:', data);
			})
			.catch((error) => {
				console.error('Error saving database:', error);
				alert('Error saving database. Please try again.\n' + error);
				loadData();
			});
		} else {
			alert('Invalid score format.');
		}
	}
}

function calculateTournament() {
	tournament.players.forEach(player => {
		player.wins = tournament.matches.filter(
			(match) =>
				(match.team1.includes(player.id) && match.score[0] > match.score[1]) ||
				(match.team2.includes(player.id) && match.score[1] > match.score[0]),
		).length;
		player.losses = tournament.matches.filter(
			(match) =>
				(match.team1.includes(player.id) && match.score[0] < match.score[1]) ||
				(match.team2.includes(player.id) && match.score[1] < match.score[0]),
		).length;

		// points = sum(score difference) for all matches played by the player
		player.points = tournament.matches.filter(match => match.team1.includes(player.id) || match.team2.includes(player.id))
			.reduce((sum, match) => {
				if (match.team1.includes(player.id)) {
					const scoreDiff = match.score[0] - match.score[1];
					return sum + scoreDiff;
				} else if (match.team2.includes(player.id)) {
					const scoreDiff = match.score[1] - match.score[0];
					return sum + scoreDiff;
				}
				return sum;
			}, 0);
		});

	const sortedPlayers = [...tournament.players].sort(
		(a, b) => b.win - a.win || b.points - a.points
	);

	let rank = 0;

	sortedPlayers.forEach((player, index) => {
		const previous = sortedPlayers[index - 1];

		if (
			index === 0 ||
			player.win !== previous.win ||
			player.points !== previous.points
		) {
			rank = index + 1;
		}

		player.rank = rank;
	});
	tournament.players.forEach((player) => {
		player.rank = sortedPlayers.find(p => p.id === player.id).rank;
	});

	// get total wins and losses for each team
	tournament.teams = [];
	teams.map(v=>v.id).forEach(teamId => {
		const playerWins = tournament.players.filter(player => player.team === teamId).map(player => player.wins).reduce((sum, wins) => sum + wins, 0);
		const playerLosses = tournament.players.filter(player => player.team === teamId).map(player => player.losses).reduce((sum, losses) => sum + losses, 0);

		let teamWins = tournament.matches.filter(match => match.team1.includes(teamId)).map(match => match.score[0]).reduce((sum, win) => sum + win, 0);
		teamWins += tournament.matches.filter(match => match.team2.includes(teamId)).map(match => match.score[1]).reduce((sum, win) => sum + win, 0);
		let teamLosses = tournament.matches.filter(match => match.team1.includes(teamId)).map(match => match.score[1]).reduce((sum, loss) => sum + loss, 0);
		teamLosses += tournament.matches.filter(match => match.team2.includes(teamId)).map(match => match.score[0]).reduce((sum, loss) => sum + loss, 0);

		teamWins = teamWins * 2;
		teamLosses = teamLosses * 2;
		teamWins += playerWins;
		teamLosses += playerLosses;

		tournament.teams.push({id: teamId, wins: teamWins, losses: teamLosses, points: teamWins*3 + teamLosses});
	});
	// team rank
	tournament.teams.sort((a, b) => b.points - a.points);
	let teamRank = 0;
	tournament.teams.forEach((team, index) => {
		const previous = tournament.teams[index - 1];
		if (index === 0 || team.points !== previous.points) {
			teamRank = index + 1;
		}
		team.rank = teamRank;
	});
	tournament.teams.sort((a, b) => a.rank - b.rank);
}


let tournament = {};

document.addEventListener('DOMContentLoaded', () => {
	loadData();
});

document.getElementById('round-filter').addEventListener('change', (e) => {
	localStorage.setItem('roundFilter', e.target.value);
	renderTournament(tournament);
});
document.getElementById('court-filter').addEventListener('change', (e) => {
	localStorage.setItem('courtFilter', e.target.value);
	renderTournament(tournament);
});
document.getElementById('player-filter').addEventListener('change', (e) => {
	localStorage.setItem('playerFilter', e.target.value);
	renderTournament(tournament);
});
document.getElementById('chefsClub').addEventListener('dblclick', () => {
	me = prompt('CHEFS Pickleball Club');
	if (me === 'admin') {
		document.getElementById('chefsClub').style.color = 'red';
		renderTournament(tournament);
	}
});
