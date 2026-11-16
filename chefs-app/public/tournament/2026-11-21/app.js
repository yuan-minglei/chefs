const teams = [
    { id: 'RED', color: '#B94B4B' },
    { id: 'GREEN', color: '#268653' },
    { id: 'BLUE', color: '#3478B9' }
];

const translations = {
    zh: {
        pageTitle: '红绿蓝团队分组方案',
        pageHeading: '红绿蓝团队分组',
        languageButton: 'English',
        languageButtonLabel: '切换到英文',
        distributionTitle: '团队等级分布与实力对比',
        levelHeader: '等级',
        redHeader: '🔴 红队',
        greenHeader: '🟢 绿队',
        blueHeader: '🔵 蓝队',
        totalHeader: '总计',
        rosterSectionTitle: '各队选手名单',
        scheduleTitle: '比赛安排',
        stageOne: '第一阶段 · 个人竞技',
        stageOneTime: '2:00 PM – 3:15 PM · 个人积分计入所属团队',
        individualMatches: '每人参加4场比赛',
        individualMatchCount: '总比赛场数：37场',
        individualCourts: '场地：8',
        individualRounds: '轮数：5轮，每轮15分钟',
        scoring: '积分: 胜一场3分, 负一场1分',
        groupingTitle: '赛事分组',
        groupingByLevel: '建议一 · 按等级分组',
        levelGroupA: 'A组（2.5–2.75）',
        levelGroupADetails: '：15人（女8人，男7人）；每人参加4场，4个场地，总比赛场数15场',
        levelGroupB: 'B组（3.0）',
        levelGroupBDetails: '：13人（女10人，男3人）；每人参加4场，总比赛场数13场',
        levelGroupC: 'C组（3.25–3.5）',
        levelGroupCDetails: '：9人（女3人，男6人）；每人参加4场，总比赛场数9场',
        groupingByLevelGender: '建议二 · 按等级与性别分组',
        mixedGroupA: 'A组（2.5–2.75）',
        mixedGroupADetails: '：15人（女8人，男7人）',
        womenGroupB: 'B组（3.0–3.5女子组）',
        womenGroupBDetails: '：13人（女13人，男0人）',
        menGroupC: 'C组（3.0–3.5男子组）',
        menGroupCDetails: '：9人（女0人，男9人）',
        stageTwo: '第二阶段 · 团体对抗',
        stageTwoTime: '3:20 PM – 4:00 PM',
        teamCourts: '场地：6',
        teamRounds: '轮数：3轮，每轮15分钟',
        redVsGreen: '红队 vs 绿队',
        redVsBlue: '红队 vs 蓝队',
        greenVsBlue: '绿队 vs 蓝队',
        subtitle: '{count}位选手 · 个人竞技 · 团体积分',
        redTeam: '红队',
        greenTeam: '绿队',
        blueTeam: '蓝队',
        teamPlayerCount: '{count} 人',
        teamGenderCount: '{women} 女 / {men} 男',
        teamLevelTotal: '等级总分：{total}',
        teamAverage: '平均等级：{average}',
        totalPlayers: '总人数',
        levelTotal: '等级总分',
        averageLevel: '平均等级',
        womenMen: '女性 / 男性',
        playerHeader: '选手',
        genderHeader: '性别',
        teamCardHeading: '{team} {id}',
        rosterHeading: '{team} {id} · {count}人',
        scheduleTotal: '总计：{total}人（女{women}人，男{men}人）',
        playerNote: '分组依据：报名等级、男女比例、团队人数及平均等级综合平衡。{red}，{green}，{blue}。团队积分建议采用队员个人积分总和除以团队人数，减少人数差异带来的影响。',
        teamSize: '{team}{count}人'
    },
    en: {
        pageTitle: 'Red, Green & Blue Team Grouping Plan',
        pageHeading: 'Red, Green & Blue Team Assignments',
        languageButton: '中文',
        languageButtonLabel: 'Switch to Chinese',
        distributionTitle: 'Team Ratings & Strength Comparison',
        levelHeader: 'Rating',
        redHeader: '🔴 Red Team',
        greenHeader: '🟢 Green Team',
        blueHeader: '🔵 Blue Team',
        totalHeader: 'Total',
        rosterSectionTitle: 'Team Rosters',
        scheduleTitle: 'Tournament Schedule',
        stageOne: 'Stage 1 · Individual Competition',
        stageOneTime: '2:00 PM – 3:15 PM · Individual points count toward team totals',
        individualMatches: '4 matches per player',
        individualMatchCount: 'Total matches: 37',
        individualCourts: 'Courts: 8',
        individualRounds: 'Rounds: 5 × 15 minutes',
        scoring: 'Scoring: 3 points for a win, 1 point for a loss',
        groupingTitle: 'Individual Event Groups',
        groupingByLevel: 'Option 1 · Grouped by rating',
        levelGroupA: 'Group A (2.5–2.75)',
        levelGroupADetails: ': 15 players (8 women, 7 men); 4 matches per player, 4 courts, 15 matches total',
        levelGroupB: 'Group B (3.0)',
        levelGroupBDetails: ': 13 players (10 women, 3 men); 4 matches per player, 13 matches total',
        levelGroupC: 'Group C (3.25–3.5)',
        levelGroupCDetails: ': 9 players (3 women, 6 men); 4 matches per player, 9 matches total',
        groupingByLevelGender: 'Option 2 · Grouped by rating and gender',
        mixedGroupA: 'Group A (2.5–2.75)',
        mixedGroupADetails: ': 15 players (8 women, 7 men)',
        womenGroupB: 'Group B (women, 3.0–3.5)',
        womenGroupBDetails: ': 13 players (13 women, 0 men)',
        menGroupC: 'Group C (men, 3.0–3.5)',
        menGroupCDetails: ': 9 players (0 women, 9 men)',
        stageTwo: 'Stage 2 · Team Competition',
        stageTwoTime: '3:20 PM – 4:00 PM',
        teamCourts: 'Courts: 6',
        teamRounds: 'Rounds: 3 × 15 minutes',
        redVsGreen: 'Red vs Green',
        redVsBlue: 'Red vs Blue',
        greenVsBlue: 'Green vs Blue',
        subtitle: '{count} players · Individual competition · Team points',
        redTeam: 'Red Team',
        greenTeam: 'Green Team',
        blueTeam: 'Blue Team',
        teamPlayerCount: '{count} players',
        teamGenderCount: '{women} women / {men} men',
        teamLevelTotal: 'Total rating points: {total}',
        teamAverage: 'Average rating: {average}',
        totalPlayers: 'Total players',
        levelTotal: 'Total rating points',
        averageLevel: 'Average rating',
        womenMen: 'Women / Men',
        playerHeader: 'Player',
        genderHeader: 'Gender',
        teamCardHeading: '{team}',
        rosterHeading: '{team} · {count} players',
        scheduleTotal: 'Total: {total} players ({women} women, {men} men)',
        playerNote: 'Teams balance player ratings, gender mix, roster sizes, and average ratings. {red}, {green}, and {blue}. For team scoring, consider dividing each team’s total individual points by its roster size to account for different team sizes.',
        teamSize: '{team}: {count} players'
    }
};

let language = 'en';

function translate(key, values = {}) {
    return Object.entries(values).reduce(
        (text, [name, value]) => text.replaceAll(`{${name}}`, value),
        translations[language][key]
    );
}

function applyLanguage() {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.title = translate('pageTitle');
    document.querySelectorAll('[data-i18n]').forEach(element => {
        element.textContent = translate(element.dataset.i18n);
    });

    const button = document.getElementById('language-toggle');
    button.textContent = translate('languageButton');
    button.setAttribute('aria-label', translate('languageButtonLabel'));
    button.setAttribute('aria-pressed', String(language === 'en'));

    if (tournament.players) {
        renderTournament(tournament.players);
    }
}

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
            appendRow(tbody, [player.player, formatLevel(Number(player.level)), player.gender], false, false);
        });
        table.appendChild(tbody);
        roster.appendChild(table);
        rosters.appendChild(roster);
    });

    document.getElementById('schedule-total').textContent = translate('scheduleTotal', {
        total: formatCount(players.length),
        women: formatCount(women),
        men: formatCount(men)
    });
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

            console.log(tournament);
        })
        .catch(error => console.error('Error loading data:', error));
}

const tournament = {};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('language-toggle').addEventListener('click', () => {
        language = language === 'zh' ? 'en' : 'zh';
        applyLanguage();
    });
    applyLanguage();
    loadData();
});
