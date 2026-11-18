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

	const scheduleTable = document.querySelector('.schedule-table tbody');
	scheduleTable.replaceChildren();

	const roundFilter = document.getElementById('round-filter').value;
	const courtFilter = document.getElementById('court-filter').value;
	const playerFilter = document.getElementById('player-filter').value;
	localStorage.setItem('roundFilter', roundFilter);
	localStorage.setItem('courtFilter', courtFilter);
	localStorage.setItem('playerFilter', playerFilter);
	tournament.matches.sort((a, b) => a.round - b.round || a.court - b.court)
		.filter(match => (roundFilter === 'ALL' || match.round == roundFilter) &&
			(courtFilter === 'ALL' || match.court == courtFilter) &&
			(playerFilter === 'ALL' || match.team1.includes(playerFilter) || match.team2.includes(playerFilter)))
		.forEach((match, index) => {
			const player1 = tournament.players.find(p => p.id === match.team1[0]);
			const player2 = tournament.players.find(p => p.id === match.team1[1]);
			const player3 = tournament.players.find(p => p.id === match.team2[0]);
			const player4 = tournament.players.find(p => p.id === match.team2[1]);

			const tr = scheduleTable.appendChild(document.createElement('tr'));
			tr.innerHTML = `
			<td>${match.round}</td>
			<td>${roundTimes[match.round - 1]}</td>
			<td>${match.court}</td>
			<td><div>${player1.id} ${player1.player}</div> <div>${player2.id} ${player2.player}</div></td>
			<td><div>${player3.id} ${player3.player}</div> <div>${player4.id} ${player4.player}</div></td>
			<td>${match.score.join(' - ')}</td>
		`;
		});

}

function loadData() {
	fetch('data.json')
		.then(response => response.json())
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
