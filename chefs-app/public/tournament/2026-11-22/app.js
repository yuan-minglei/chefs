const teams = [
    { id: 'RED', color: '#B94B4B' },
    { id: 'GREEN', color: '#268653' },
    { id: 'BLUE', color: '#3478B9' }
];


function teamName(team) {
    return translate(`${team.id.toLowerCase()}Team`);
}

function formatNumber(number) {
    return language === 'en'
        ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number)
        : number.toFixed(2);
}

function formatAverage(number) {
    return number.toFixed(4);
}

function formatCount(number) {
    return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'zh-CN').format(number);
}

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

function renderTournament(players) {
    const teamStats = teams.map(team => {
        const teamPlayers = players.filter(player => player.team === team.id);
        const levelTotal = teamPlayers.reduce((total, player) => total + Number(player.level), 0);
        const women = teamPlayers.filter(player => player.gender === 'F').length;
        const men = teamPlayers.filter(player => player.gender === 'M').length;

        return { ...team, players: teamPlayers, levelTotal, women, men };
    });
    const women = players.filter(player => player.gender === 'F').length;
    const men = players.filter(player => player.gender === 'M').length;
    const levelTotal = players.reduce((total, player) => total + Number(player.level), 0);

    document.getElementById('player-subtitle').textContent =
        translate('subtitle', { count: formatCount(players.length) });

    const summary = document.getElementById('team-summary');
    summary.replaceChildren();
    teamStats.forEach(team => {
        const card = document.createElement('section');
        card.className = 'team-card';
        card.style.setProperty('--team', team.color);
        const name = teamName(team);
        card.appendChild(createTextElement('h2', translate('teamCardHeading', {
            team: name,
            id: team.id
        })));
        card.appendChild(createTextElement('div', translate('teamPlayerCount', {
            count: formatCount(team.players.length)
        }))).className = 'big';
        card.appendChild(createTextElement('div', translate('teamGenderCount', {
            women: formatCount(team.women),
            men: formatCount(team.men)
        })));

        const details = createTextElement('p', '');
        details.className = 'small';
        details.append(
            document.createTextNode(translate('teamLevelTotal', {
                total: formatNumber(team.levelTotal)
            })),
            document.createElement('br'),
            document.createTextNode(translate('teamAverage', {
                average: formatAverage(team.players.length ? team.levelTotal / team.players.length : 0)
            }))
        );
        card.appendChild(details);
        summary.appendChild(card);
    });

    const distribution = document.getElementById('level-distribution');
    distribution.replaceChildren();
    const levels = [...new Set(players.map(player => Number(player.level)))].sort((a, b) => a - b);
    levels.forEach(level => {
        const counts = teamStats.map(team => team.players.filter(player => Number(player.level) === level).length);
        appendRow(distribution, [formatLevel(level), ...counts, counts.reduce((total, count) => total + count, 0)]);
    });
    appendRow(distribution, [
        translate('totalPlayers'),
        ...teamStats.map(team => formatCount(team.players.length)),
        formatCount(players.length)
    ], true);
    appendRow(distribution, [
        translate('levelTotal'),
        ...teamStats.map(team => formatNumber(team.levelTotal)),
        formatNumber(levelTotal)
    ], true);
    appendRow(distribution, [
        translate('averageLevel'),
        ...teamStats.map(team => formatAverage(team.players.length ? team.levelTotal / team.players.length : 0)),
        formatAverage(players.length ? levelTotal / players.length : 0)
    ], true);
    appendRow(distribution, [
        translate('womenMen'),
        ...teamStats.map(team => `${formatCount(team.women)} / ${formatCount(team.men)}`),
        `${formatCount(women)} / ${formatCount(men)}`
    ], true);

    const rosters = document.getElementById('team-rosters');
    rosters.replaceChildren();
    teamStats.forEach(team => {
        const roster = document.createElement('section');
        roster.className = 'roster';
        roster.style.setProperty('--team', team.color);
        roster.appendChild(createTextElement('h2', translate('rosterHeading', {
            team: teamName(team),
            id: team.id,
            count: formatCount(team.players.length)
        })));

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const header = document.createElement('tr');
        ['playerHeader', 'levelHeader', 'genderHeader'].forEach(key => {
            header.appendChild(createTextElement('th', translate(key)));
        });
        thead.appendChild(header);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        team.players.forEach(player => {
            appendRow(tbody, [player.id + ' ' + player.player, formatLevel(Number(player.level)), player.gender], false, false);
        });
        table.appendChild(tbody);
        roster.appendChild(table);
        rosters.appendChild(roster);
    });

    // document.getElementById('schedule-total').textContent = translate('scheduleTotal', {
    //     total: formatCount(players.length),
    //     women: formatCount(women),
    //     men: formatCount(men)
    // });
    document.getElementById('player-note').textContent = translate('playerNote', {
        red: translate('teamSize', { team: teamName(teamStats[0]), count: formatCount(teamStats[0].players.length) }),
        green: translate('teamSize', { team: teamName(teamStats[1]), count: formatCount(teamStats[1].players.length) }),
        blue: translate('teamSize', { team: teamName(teamStats[2]), count: formatCount(teamStats[2].players.length) })
    });
}

function loadData() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            tournament.players = data.players;
            renderTournament(tournament.players);
        })
        .catch(error => console.error('Error loading data:', error));
}

const tournament = {};

document.addEventListener('DOMContentLoaded', () => {
	loadData();
});
