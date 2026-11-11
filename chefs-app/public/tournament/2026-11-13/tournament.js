/**
 * Generate a fair, randomized mixed-doubles pickleball schedule.
 *
 * Inputs: queens and kings (arrays of unique names), matchesPerPlayer, courts.
 *
 * Hard rules:
 * 1. Equal numbers of Queens and Kings.
 * 2. Each team has 1 Queen + 1 King.
 * 3. Every player plays exactly matchesPerPlayer matches.
 * 4. A player plays at most once per round.
 * 5. No Queen-King partnership repeats.
 * 6. Use the fewest rounds; every round fills every court except the last.
 *
 * Soft rules:
 * 1. Maximize each player's number of distinct opponents.
 * 2. Balance opponent repeats across all players.
 * 3. Minimize repeated opponent pairings overall.
 * 4. Spread playing opportunities as evenly as possible.
 *
 * Tested for up to 24 Queens + 24 Kings and 8 courts.
 */

const ATTEMPTS = 500;
const MAX_ATTEMPTS = 3000;

/**
 * predefine Tournament structure
 * ------------------------------------------------
12 rounds 3 courts 9 queens 9 kings
R  Court 1        Court 2        Court 3
-  -------------- -------------- --------------
1  W6+M5 vs W1+M4 W7+M7 vs W8+M9 W9+M2 vs W2+M6
2  W2+M4 vs W4+M8 W5+M5 vs W6+M7 W9+M6 vs W3+M1
3  W3+M5 vs W5+M9 W4+M3 vs W8+M2 W7+M4vsW1+M8
4  W2+M1 vs W6+M9 W5+M4 vs W9+M3 W8+M7 vs W3+M6
5  W1+M7 vs W4+M2 W6+M8 vs W8+M3 W7+M6 vs W2+M5
6  W1+M9 vs W5+M8 W2+M2 vs W3+M4 W4+M6 vs W6+M1
7  W3+M3 vs W4+M5 W5+M7 vs W7+M2 W8+M8 vs W9+M1
8  W1+M1 vs W2+M3 W5+M2 vs W8+M6 W7+M9 vs W9+M4
9  W1+M3 vs W3+M7 W6+M6 vs W7+M8 W8+M5 vs W2+M9
10 W3+M9 vs W6+M4 W8+M1 vs W1+M5 W9+M8 vs W4+M7
11 W3+M2 vs W7+M1 W4+M4 vs W5+M6 W6+M3 vs W9+M7
12 W2+M8 vs W5+M3 W4+M1 vs W7+M5 W9+M9 vs W1+M2
 */
 const tournament_12_rounds_3_courts_9_queens_9_kings = [
    { team1: ['W6', 'M5'], team2: ['W1', 'M4'], round: 1, court: 1, score: [0, 0]},
    { team1: ['W7', 'M7'], team2: ['W8', 'M9'], round: 1, court: 2, score: [0, 0]},
    { team1: ['W9', 'M2'], team2: ['W2', 'M6'], round: 1, court: 3, score: [0, 0]},
    { team1: ['W2', 'M4'], team2: ['W4', 'M8'], round: 2, court: 1, score: [0, 0]},
    { team1: ['W5', 'M5'], team2: ['W6', 'M7'], round: 2, court: 2, score: [0, 0]},
    { team1: ['W9', 'M6'], team2: ['W3', 'M1'], round: 2, court: 3, score: [0, 0]},
    { team1: ['W3', 'M5'], team2: ['W5', 'M9'], round: 3, court: 1, score: [0, 0]},
    { team1: ['W4', 'M3'], team2: ['W8', 'M2'], round: 3, court: 2, score: [0, 0]},
    { team1: ['W7', 'M4'], team2: ['W1', 'M8'], round: 3, court: 3, score: [0, 0]},
    { team1: ['W2', 'M1'], team2: ['W6', 'M9'], round: 4, court: 1, score: [0, 0]},
    { team1: ['W5', 'M4'], team2: ['W9', 'M3'], round: 4, court: 2, score: [0, 0]},
    { team1: ['W8', 'M7'], team2: ['W3', 'M6'], round: 4, court: 3, score: [0, 0]},
    { team1: ['W1', 'M7'], team2: ['W4', 'M2'], round: 5, court: 1, score: [0, 0]},
    { team1: ['W6', 'M8'], team2: ['W8', 'M3'], round: 5, court: 2, score: [0, 0]},
    { team1: ['W7', 'M6'], team2: ['W2', 'M5'], round: 5, court: 3, score: [0, 0]},
    { team1: ['W1', 'M9'], team2: ['W5', 'M8'], round: 6, court: 1, score: [0, 0]},
    { team1: ['W2', 'M2'], team2: ['W3', 'M4'], round: 6, court: 2, score: [0, 0]},
    { team1: ['W4', 'M6'], team2: ['W6', 'M1'], round: 6, court: 3, score: [0, 0]},
    { team1: ['W3', 'M3'], team2: ['W4', 'M5'], round: 7, court: 1, score: [0, 0]},
    { team1: ['W5', 'M7'], team2: ['W7', 'M2'], round: 7, court: 2, score: [0, 0]},
    { team1: ['W8', 'M8'], team2: ['W9', 'M1'], round: 7, court: 3, score: [0, 0]},
    { team1: ['W1', 'M1'], team2: ['W2', 'M3'], round: 8, court: 1, score: [0, 0]},
    { team1: ['W5', 'M2'], team2: ['W8', 'M6'], round: 8, court: 2, score: [0, 0]},
    { team1: ['W7', 'M9'], team2: ['W9', 'M4'], round: 8, court: 3, score: [0, 0]},
    { team1: ['W1', 'M3'], team2: ['W3', 'M7'], round: 9, court: 1, score: [0, 0]},
    { team1: ['W6', 'M6'], team2: ['W7', 'M8'], round: 9, court: 2, score: [0, 0]},
    { team1: ['W8', 'M5'], team2: ['W2', 'M9'], round: 9, court: 3, score: [0, 0]},
    { team1: ['W3', 'M9'], team2: ['W6', 'M4'], round: 10, court: 1, score: [0, 0]},
    { team1: ['W8', 'M1'], team2: ['W1', 'M5'], round: 10, court: 2, score: [0, 0]},
    { team1: ['W9', 'M8'], team2: ['W4', 'M7'], round: 10, court: 3, score: [0, 0]},
    { team1: ['W3', 'M2'], team2: ['W7', 'M1'], round: 11, court: 1, score: [0, 0]},
    { team1: ['W4', 'M4'], team2: ['W5', 'M6'], round: 11, court: 2, score: [0, 0]},
    { team1: ['W6', 'M3'], team2: ['W9', 'M7'], round: 11, court: 3, score: [0, 0]},
    { team1: ['W2', 'M8'], team2: ['W5', 'M3'], round: 12, court: 1, score: [0, 0]},
    { team1: ['W4', 'M1'], team2: ['W7', 'M5'], round: 12, court: 2, score: [0, 0]},
    { team1: ['W9', 'M9'], team2: ['W1', 'M2'], round: 12, court: 3, score: [0, 0]},
];

// Randomize an array using Fisher-Yates.
function shuffle(arr) {
    const result = [...arr];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

// Same key whichever order the two players are given in.
const pairKey = (a, b) => JSON.stringify([a, b].sort());

// Keys for the four opponent pairs when team a plays team b.
const opponentKeys = (a, b) =>
    a.flatMap(x => b.map(y => pairKey(x, y)));

/**
 * Generate the tournament.
 *
 * Returns:
 * [
 *   {
 *     team1: [queen, king],
 *     team2: [queen, king],
 *     round: 1,
 *     court: 1,
 *     score: [0, 0]
 *   }
 * ]
 */
function generateTournament(queens, kings, matchesPerPlayer, courts) {
    const playerCount = queens.length;

    // Validate input.
    if (!Array.isArray(queens) || !Array.isArray(kings)) {
        throw new Error("Queens and Kings must be arrays.");
    }

    if (playerCount !== kings.length) {
        throw new Error("Queens and Kings must have equal numbers.");
    }

    if (!Number.isInteger(matchesPerPlayer) || matchesPerPlayer < 1 ||
        !Number.isInteger(courts) || courts < 1) {
        throw new Error(
            "Matches per player and courts must be positive whole numbers."
        );
    }

    if (playerCount < 2 * courts) {
        throw new Error(
            `Filling ${courts} court(s) needs at least ${2 * courts} Queens ` +
            `and ${2 * courts} Kings.`
        );
    }

    if (matchesPerPlayer > playerCount) {
        throw new Error(
            "Partners cannot repeat, so matches per player cannot exceed " +
            `the number of Queens (${playerCount}).`
        );
    }

    if ((playerCount * matchesPerPlayer) % 2 !== 0) {
        throw new Error(
            `${playerCount} Queens × ${matchesPerPlayer} matches is odd, ` +
            "but each match needs 2 Queens."
        );
    }

    const players = [...queens, ...kings];

    if (new Set(players).size !== players.length) {
        throw new Error("Player names must be unique.");
    }

    // Every round fills every court except the last,
    // which uses only the courts it needs.
    const totalMatches = playerCount * matchesPerPlayer / 2;
    const totalRounds = Math.ceil(totalMatches / courts);

	// tournament_12_rounds_3_courts_9_queens_9_kings
	if (totalRounds === 12 && courts === 3 && queens.length === 9 && kings.length === 9) {
		// Use predefined template
		/**
		  const tournament_12_rounds_3_courts_9_queens_9_kings = [
    		{ team1: ['W6', 'M5'], team2: ['W1', 'M4'], round: 1, court: 1, score: [0, 0]},
	      ];
	  	**/

		// randomly assign actual queen and king names to the template
		// replace W1, W2, ... with actual queen names
		// replace M1, M2, ... with actual king names
		const template = JSON.parse(JSON.stringify(tournament_12_rounds_3_courts_9_queens_9_kings));

		queens = [...queens].sort(() => Math.random() - 0.5);
		kings = [...kings].sort(() => Math.random() - 0.5);

		const queenMap = new Map(queens.map((q, i) => [`W${i + 1}`, q]));
		const kingMap = new Map(kings.map((k, i) => [`M${i + 1}`, k]));

		for (const match of template) {
			match.team1 = match.team1.map(p => queenMap.get(p) || kingMap.get(p));
			match.team2 = match.team2.map(p => queenMap.get(p) || kingMap.get(p));
		}
		return template;
	}

    const matchesInRound = r =>
        r < totalRounds - 1
            ? courts
            : totalMatches - courts * (totalRounds - 1);

    let best = null;

    for (let i = 0; i < ATTEMPTS || (!best && i < MAX_ATTEMPTS); i++) {
        const attempt = buildAttempt(
            queens,
            kings,
            matchesPerPlayer,
            totalRounds,
            matchesInRound
        );

        if (attempt && isBetterScore(attempt.score, best?.score)) {
            best = attempt;
        }
    }

    if (!best) {
        throw new Error(
            "Unable to find a schedule without repeated partners " +
            "for these numbers."
        );
    }

    return best.rounds.flatMap((matches, roundIndex) =>
        matches.map(([team1, team2], courtIndex) => ({
            team1,
            team2,
            round: roundIndex + 1,
            court: courtIndex + 1,
            score: [0, 0]
        }))
    );
}

/**
 * Compare two fairness scores lexicographically.
 *
 * Lower is better:
 * 1. Maximum repeated encounters for any player.
 * 2. Sum of squared repeated encounters per player.
 * 3. Sum of squared opponent-pair encounter counts.
 */
function isBetterScore(candidate, current) {
    if (!current) {
        return true;
    }

    for (let i = 0; i < candidate.length; i++) {
        if (candidate[i] < current[i]) {
            return true;
        }

        if (candidate[i] > current[i]) {
            return false;
        }
    }

    return false;
}

/**
 * Calculate the overall fairness score.
 *
 * Each player has exactly matchesPerPlayer matches.
 * Each match gives that player 2 opponents.
 *
 * Therefore:
 * total opponent encounters = matchesPerPlayer * 2.
 */
function calculateFairnessScore(met, players, matchesPerPlayer) {
    const opponentCounts = new Map(
        players.map(player => [player, new Set()])
    );

    // Build each player's distinct-opponent set.
    for (const key of met.keys()) {
        const [p1, p2] = JSON.parse(key);

        opponentCounts.get(p1).add(p2);
        opponentCounts.get(p2).add(p1);
    }

    const totalEncounters = matchesPerPlayer * 2;

    // Number of repeated opponent encounters for each player.
    const repeatedCounts = players.map(player =>
        totalEncounters - opponentCounts.get(player).size
    );

    // Prioritize the player with the most repeats.
    const worstPlayerRepeats = Math.max(...repeatedCounts);

    // Balance repeats across all players.
    const imbalanceScore = repeatedCounts.reduce(
        (sum, count) => sum + count * count,
        0
    );

    // Minimize repeated opponent pairings overall.
    const pairRepeatScore = [...met.values()].reduce(
        (sum, count) => sum + count * count,
        0
    );

    return [
        worstPlayerRepeats,
        imbalanceScore,
        pairRepeatScore
    ];
}

/**
 * Build one random schedule.
 *
 * Returns { rounds, score }.
 * Returns null when a round cannot be filled with new partners.
 */
function buildAttempt(
    queens,
    kings,
    matchesPerPlayer,
    totalRounds,
    matchesInRound
) {
    const players = [...queens, ...kings];

    const gamesLeft = new Map(
        players.map(player => [player, matchesPerPlayer])
    );

    const partnered = new Set();
    const met = new Map();
    const rounds = [];

    for (let r = 0; r < totalRounds; r++) {
        const teams = matchPartners(
            queens,
            kings,
            2 * matchesInRound(r),
            gamesLeft,
            partnered
        );

        if (!teams) {
            return null;
        }

        // Record partnerships and update remaining games.
        for (const [queen, king] of teams) {
            partnered.add(pairKey(queen, king));

            gamesLeft.set(queen, gamesLeft.get(queen) - 1);
            gamesLeft.set(king, gamesLeft.get(king) - 1);
        }

        // Find the best opposing-team combinations for this round.
        rounds.push(pairTeams(teams, met));
    }

    // All players must have completed exactly their required matches.
    if ([...gamesLeft.values()].some(count => count !== 0)) {
        return null;
    }

    const score = calculateFairnessScore(
        met,
        players,
        matchesPerPlayer
    );

    return { rounds, score };
}

/**
 * Prioritize players who:
 * 1. Have the most games left.
 * 2. Have the fewest available new partners.
 * 3. Win random tie-breaking.
 */
function pickOrder(players, others, gamesLeft, partnered) {
    const options = player => others.filter(other =>
        gamesLeft.get(other) > 0 &&
        !partnered.has(pairKey(player, other))
    ).length;

    return shuffle(players.filter(player => gamesLeft.get(player) > 0))
        .map(player => [
            player,
            gamesLeft.get(player),
            options(player)
        ])
        .sort((a, b) => b[1] - a[1] || a[2] - b[2])
        .map(([player]) => player);
}

/**
 * Choose size teams of one Queen + one King.
 *
 * Uses Kuhn's augmenting-path algorithm to find a matching
 * without repeating any previous Queen-King partnership.
 *
 * Returns:
 * [
 *   [queen, king],
 *   ...
 * ]
 *
 * Returns null if size teams cannot be made.
 */
function matchPartners(queens, kings, size, gamesLeft, partnered) {
    const queenOfKing = new Map();

    const kingOrder = pickOrder(
        kings,
        queens,
        gamesLeft,
        partnered
    );

    const placeQueen = (queen, seen) => {
        for (const king of kingOrder) {
            if (
                seen.has(king) ||
                partnered.has(pairKey(queen, king))
            ) {
                continue;
            }

            seen.add(king);

            if (
                !queenOfKing.has(king) ||
                placeQueen(queenOfKing.get(king), seen)
            ) {
                queenOfKing.set(king, queen);
                return true;
            }
        }

        return false;
    };

    const queenOrder = pickOrder(
        queens,
        kings,
        gamesLeft,
        partnered
    );

    for (const queen of queenOrder) {
        if (queenOfKing.size === size) {
            break;
        }

        placeQueen(queen, new Set());
    }

    return queenOfKing.size === size
        ? [...queenOfKing].map(([king, queen]) => [queen, king])
        : null;
}

/**
 * Pair teams into matches using exact minimum-cost matching.
 *
 * Instead of greedily selecting the next cheapest opponent,
 * this uses bitmask dynamic programming to find the lowest-cost
 * perfect matching for all teams in the current round.
 *
 * Incremental cost:
 *
 * If two players have already met c times, adding another
 * encounter changes their squared repeat score by:
 *
 * (c + 1)^2 - c^2 = 2c + 1
 *
 * Each match creates four opponent-pair encounters.
 *
 * The met map is updated only after the complete matching
 * has been found, so every candidate pairing is evaluated
 * against the same opponent history entering this round.
 */
function pairTeams(teams, met) {
    const n = teams.length;

    if (n % 2 !== 0) {
        throw new Error("Number of teams must be even.");
    }

    // Exact incremental cost of putting two teams against each other.
    const cost = (a, b) =>
        opponentKeys(a, b).reduce(
            (sum, key) => sum + 2 * (met.get(key) ?? 0) + 1,
            0
        );

    // Memoize the best solution for each remaining-team bitmask.
    const memo = new Map();

    function solve(mask) {
        if (mask === 0) {
            return {
                cost: 0,
                pairs: []
            };
        }

        if (memo.has(mask)) {
            return memo.get(mask);
        }

        // Find the first remaining team.
        let first = 0;

        while (!(mask & (1 << first))) {
            first++;
        }

        // Remove the first team from the remaining set.
        const remaining = mask ^ (1 << first);

        // Possible opponents for the first team.
        const candidates = [];

        for (let j = first + 1; j < n; j++) {
            if (remaining & (1 << j)) {
                candidates.push(j);
            }
        }

        // Randomize equal-cost solutions.
        const orderedCandidates = shuffle(candidates);

        let bestCost = Infinity;
        let bestPairs = null;

        for (const j of orderedCandidates) {
            const nextMask = remaining ^ (1 << j);
            const rest = solve(nextMask);

            const totalCost =
                cost(teams[first], teams[j]) + rest.cost;

            if (totalCost < bestCost) {
                bestCost = totalCost;
                bestPairs = [
                    [first, j],
                    ...rest.pairs
                ];
            }
        }

        const result = {
            cost: bestCost,
            pairs: bestPairs
        };

        memo.set(mask, result);

        return result;
    }

    const fullMask = (1 << n) - 1;
    const solution = solve(fullMask);

    // Convert the selected team indexes into matches.
    // Update opponent history after all pairings are selected.
    const matches = solution.pairs.map(([i, j]) => {
        const team1 = teams[i];
        const team2 = teams[j];

        opponentKeys(team1, team2).forEach(key => {
            met.set(key, (met.get(key) ?? 0) + 1);
        });

        return [team1, team2];
    });

    return matches;
}

/**
 * Self-check.
 *
 * Runs in Node:
 * node temp/test.js
 *
 * Skipped in a browser.
 */
function selfCheck() {
    const check = (ok, message) => {
        if (!ok) {
            throw new Error(`Self-check failed: ${message}`);
        }
    };

    const names = (prefix, count) =>
        Array.from(
            { length: count },
            (_, i) => `${prefix}${i + 1}`
        );

    // [players per gender, matchesPerPlayer, courts]
    const cases = [
        [24, 6, 8],
        [4, 4, 1],
        [6, 3, 2],
        [6, 6, 1]
    ];

    for (const [count, matchesPerPlayer, courts] of cases) {
        const label =
            `${count}+${count}, ${matchesPerPlayer} matches, ${courts} courts`;

        const queens = names("Q", count);
        const kings = names("K", count);

        const matches = generateTournament(
            queens,
            kings,
            matchesPerPlayer,
            courts
        );

        const totalRounds = Math.ceil(
            count * matchesPerPlayer / 2 / courts
        );

        const played = new Map();
        const partners = new Set();
        const busy = new Set();
        const met = new Map();

        for (const { team1, team2, round, court } of matches) {
            check(
                round >= 1 && round <= totalRounds,
                `${label}: round ${round} past the fewest rounds`
            );

            check(
                court >= 1 && court <= courts,
                `${label}: court ${court} does not exist`
            );

            for (const [queen, king] of [team1, team2]) {
                check(
                    queens.includes(queen) && kings.includes(king),
                    `${label}: team is not 1 Queen + 1 King`
                );

                const partner = pairKey(queen, king);

                check(
                    !partners.has(partner),
                    `${label}: ${queen} and ${king} partner twice`
                );

                partners.add(partner);

                for (const player of [queen, king]) {
                    const roundPlayer = `${round}|${player}`;

                    check(
                        !busy.has(roundPlayer),
                        `${label}: ${player} plays twice in round ${round}`
                    );

                    busy.add(roundPlayer);

                    played.set(
                        player,
                        (played.get(player) ?? 0) + 1
                    );
                }
            }

            // Record all four opponent encounters.
            for (const x of team1) {
                for (const y of team2) {
                    const key = pairKey(x, y);

                    met.set(key, (met.get(key) ?? 0) + 1);
                }
            }
        }

        // Every player must play exactly the required number of matches.
        for (const player of [...queens, ...kings]) {
            check(
                played.get(player) === matchesPerPlayer,
                `${label}: ${player} plays ${played.get(player)} matches`
            );
        }

        // Every round except the last must fill all courts.
        for (let round = 1; round < totalRounds; round++) {
            const used = matches.filter(
                match => match.round === round
            ).length;

            check(
                used === courts,
                `${label}: round ${round} uses ${used} of ${courts} courts`
            );
        }

        // Confirm the fairness score is valid.
        const fairnessScore = calculateFairnessScore(
            met,
            [...queens, ...kings],
            matchesPerPlayer
        );

        check(
            fairnessScore.length === 3 &&
            fairnessScore.every(Number.isFinite),
            `${label}: invalid fairness score`
        );

        // For the 24+24 test, check that opponent repeats remain low.
        // This is a regression threshold, not a mathematical guarantee.
        if (count === 24) {
            const repeats = [...met.values()].filter(
                n => n > 1
            ).length;

            check(
                repeats <= 3,
                `${label}: ${repeats} pairs meet more than once as opponents`
            );
        }
    }

    // Verify invalid inputs throw errors.
    const throws = (args, message) => {
        let threw = false;

        try {
            generateTournament(...args);
        } catch {
            threw = true;
        }

        check(threw, message);
    };

    throws(
        [names("Q", 4), names("K", 5), 2, 1],
        "unequal Queens and Kings did not throw"
    );

    throws(
        [names("Q", 4), names("K", 4), 5, 1],
        "more matches than Queens did not throw"
    );

    throws(
        [names("Q", 3), names("K", 3), 1, 1],
        "odd Queen slots did not throw"
    );

    throws(
        [names("Q", 4), names("Q", 4), 2, 1],
        "duplicate names did not throw"
    );

    console.log("Self-check passed.");
}

// Run self-check in Node, but not in a browser.
if (typeof process !== "undefined" && process.versions?.node) {
    selfCheck();
}

