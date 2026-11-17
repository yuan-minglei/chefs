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
        playerNote: '分组依据：报名等级、男女比例、团队人数及平均等级综合平衡。{red}，{green}，{blue}。团队计分时，可考虑根据不同的团队人数调整分数。',
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
        playerNote: 'Teams balance player ratings, gender mix, roster sizes, and average ratings. {red}, {green}, and {blue}. For team scoring, consider adjusting scores for different team sizes.',
        teamSize: '{team}: {count} players'
    }
};

let language = localStorage.getItem('language') || (document.documentElement.lang.startsWith('zh') ? 'zh' : 'en');

function translate(key, values = {}) {
    return Object.entries(values).reduce(
        (text, [name, value]) => text.replaceAll(`{${name}}`, value),
        translations[language][key]
    );
}
function setLanguage(lang) {
	if(language === lang) return;
    language = lang;
    localStorage.setItem('language', lang);
    applyLanguage();
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

setLanguage(language);

document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('language-toggle').addEventListener('click', () => {
		setLanguage(language === 'zh' ? 'en' : 'zh');
	});
});
