/**
 * Generate a fair, randomized mixed-doubles pickleball schedule.
 *
 * Inputs: queens and kings (arrays of unique names), matchesPerPlayer, courts.
 *
 * Hard rules (always hold):
 * 1. Equal numbers of Queens and Kings.
 * 2. Each team has 1 Queen + 1 King. A match is two teams.
 * 3. Every player plays exactly matchesPerPlayer matches.
 * 4. A player plays at most once per round.
 * 5. No Queen-King partnership repeats.
 * 6. Use the fewest rounds: every round fills every court except the last.
 *
 * Soft rules:
 * 1. Opponents are spread evenly: two players face each other across the net
 *    as few times as possible.
 * 2. Rests are spread out: each round, the players with the most games left
 *    play. Rule 1 wins over a strict rest rotation, so some players get a few
 *    games or rests in a row.
 *
 * Builds ATTEMPTS random schedules and returns the one with the most even
 * opponents. Throws if the input is invalid or no attempt keeps the hard rules.
 * Tested for up to 24 Queens + 24 Kings and up to 8 courts.
 */

const ATTEMPTS = 200;

// When no attempt has worked yet, keep trying up to this many in all.
const MAX_ATTEMPTS = 2000;

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
const opponentKeys = (a, b) => a.flatMap(x => b.map(y => pairKey(x, y)));

function generateTournament(queens, kings, matchesPerPlayer, courts) {
    const playerCount = queens.length;

    // Validate input
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
            `${playerCount} Queens Ã— ${matchesPerPlayer} matches is odd, ` +
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
    const matchesInRound = r => (r < totalRounds - 1
        ? courts
        : totalMatches - courts * (totalRounds - 1));

    let best = null;

    for (let i = 0; i < ATTEMPTS || (!best && i < MAX_ATTEMPTS); i++) {
        const attempt = buildAttempt(
            queens, kings, matchesPerPlayer, totalRounds, matchesInRound
        );

        if (attempt && (!best || attempt.score < best.score)) {
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
        })));
}

// Build one random schedule. Returns { rounds, score }, where each round is a
// list of [team1, team2] matches and a lower score means more even opponents.
// Returns null when some round cannot be filled with new partners.
function buildAttempt(queens, kings, matchesPerPlayer, totalRounds, matchesInRound) {
    const gamesLeft = new Map(
        [...queens, ...kings].map(player => [player, matchesPerPlayer])
    );
    const partnered = new Set();
    const met = new Map();
    const rounds = [];

    for (let r = 0; r < totalRounds; r++) {
        const teams = matchPartners(
            queens, kings, 2 * matchesInRound(r), gamesLeft, partnered
        );

        if (!teams) {
            return null;
        }

        for (const [queen, king] of teams) {
            partnered.add(pairKey(queen, king));
            gamesLeft.set(queen, gamesLeft.get(queen) - 1);
            gamesLeft.set(king, gamesLeft.get(king) - 1);
        }

        rounds.push(pairTeams(teams, met));
    }

    const score = [...met.values()].reduce((sum, n) => sum + n * n, 0);

    return { rounds, score };
}

// Players who still have games left, in the order they should be picked:
// 1. Most games left first, so rests stay even and no one falls behind.
// 2. Then fewest new partners still available, so the hardest to place go
//    before their options run out.
// 3. Remaining ties in random order.
function pickOrder(players, others, gamesLeft, partnered) {
    const options = player => others.filter(other =>
        gamesLeft.get(other) > 0 && !partnered.has(pairKey(player, other))
    ).length;

    return shuffle(players.filter(player => gamesLeft.get(player) > 0))
        .map(player => [player, gamesLeft.get(player), options(player)])
        .sort((a, b) => b[1] - a[1] || a[2] - b[2])
        .map(([player]) => player);
}

// Choose size teams of a Queen and a King who have not partnered before,
// using Kuhn's augmenting paths. Players are tried in pickOrder. Returns
// [queen, king] teams, or null when size teams cannot be made.
function matchPartners(queens, kings, size, gamesLeft, partnered) {
    const queenOfKing = new Map();
    const kingOrder = pickOrder(kings, queens, gamesLeft, partnered);

    const placeQueen = (queen, seen) => {
        for (const king of kingOrder) {

            if (seen.has(king) || partnered.has(pairKey(queen, king))) {
                continue;
            }

            seen.add(king);

            if (!queenOfKing.has(king) || placeQueen(queenOfKing.get(king), seen)) {
                queenOfKing.set(king, queen);
                return true;
            }
        }

        return false;
    };

    for (const queen of pickOrder(queens, kings, gamesLeft, partnered)) {
        if (queenOfKing.size === size) {
            break;
        }

        placeQueen(queen, new Set());
    }

    return queenOfKing.size === size
        ? [...queenOfKing].map(([king, queen]) => [queen, king])
        : null;
}

// Pair teams into matches. Each team plays the free team its players have
// met least as opponents; ties go to whichever comes first in a random order.
// Adds the new meetings to met.
function pairTeams(teams, met) {
    const free = shuffle(teams);
    const matches = [];
    const cost = (a, b) => opponentKeys(a, b)
        .reduce((sum, key) => sum + (met.get(key) ?? 0), 0);

    while (free.length > 0) {
        const team = free.pop();
        let bestIndex = 0;

        free.forEach((other, i) => {
            if (cost(team, other) < cost(team, free[bestIndex])) {
                bestIndex = i;
            }
        });

        const [other] = free.splice(bestIndex, 1);

        opponentKeys(team, other)
            .forEach(key => met.set(key, (met.get(key) ?? 0) + 1));
        matches.push([team, other]);
    }

    return matches;
}

// Self-check. Runs in Node (`node temp/test.js`); skipped in a browser.
function selfCheck() {
    const check = (ok, message) => {
        if (!ok) {
            throw new Error(`Self-check failed: ${message}`);
        }
    };
    const names = (prefix, count) =>
        Array.from({ length: count }, (_, i) => `${prefix}${i + 1}`);

    // [players per gender, matchesPerPlayer, courts]
    const cases = [[24, 6, 8], [4, 4, 1], [6, 3, 2], [6, 6, 1]];

    for (const [count, matchesPerPlayer, courts] of cases) {
        const label = `${count}+${count}, ${matchesPerPlayer} matches, ${courts} courts`;
        const queens = names("Q", count);
        const kings = names("K", count);
        const matches = generateTournament(queens, kings, matchesPerPlayer, courts);
        const totalRounds = Math.ceil(count * matchesPerPlayer / 2 / courts);
        const played = new Map();
        const partners = new Set();
        const busy = new Set();
        const met = new Map();

        for (const { team1, team2, round, court } of matches) {
            check(round >= 1 && round <= totalRounds, `${label}: round ${round} past the fewest rounds`);
            check(court >= 1 && court <= courts, `${label}: court ${court} does not exist`);

            for (const [queen, king] of [team1, team2]) {
                check(queens.includes(queen) && kings.includes(king), `${label}: team is not 1 Queen + 1 King`);
                check(!partners.has(`${queen}|${king}`), `${label}: ${queen} and ${king} partner twice`);
                partners.add(`${queen}|${king}`);

                for (const player of [queen, king]) {
                    check(!busy.has(`${round}|${player}`), `${label}: ${player} plays twice in round ${round}`);
                    busy.add(`${round}|${player}`);
                    played.set(player, (played.get(player) ?? 0) + 1);
                }
            }

            for (const x of team1) {
                for (const y of team2) {
                    const key = [x, y].sort().join("|");
                    met.set(key, (met.get(key) ?? 0) + 1);
                }
            }
        }

        for (const player of [...queens, ...kings]) {
            check(played.get(player) === matchesPerPlayer, `${label}: ${player} plays ${played.get(player)} matches`);
        }

        for (let round = 1; round < totalRounds; round++) {
            const used = matches.filter(match => match.round === round).length;
            check(used === courts, `${label}: round ${round} uses ${used} of ${courts} courts`);
        }

        // 48 players with 6 matches each have room to spread opponents. The
        // first script let about 30 pairs meet twice; allow at most 3.
        if (count === 24) {
            const repeats = [...met.values()].filter(n => n > 1).length;
            check(repeats <= 3, `${label}: ${repeats} pairs meet more than once as opponents`);
        }
    }

    const throws = (args, message) => {
        let threw = false;

        try {
            generateTournament(...args);
        } catch {
            threw = true;
        }

        check(threw, message);
    };

    throws([names("Q", 4), names("K", 5), 2, 1], "unequal Queens and Kings did not throw");
    throws([names("Q", 4), names("K", 4), 5, 1], "more matches than Queens did not throw");
    throws([names("Q", 3), names("K", 3), 1, 1], "odd Queen slots did not throw");
    throws([names("Q", 4), names("Q", 4), 2, 1], "duplicate names did not throw");

    console.log("Self-check passed.");
}

if (typeof process !== "undefined") {
    selfCheck();
}
