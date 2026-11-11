/**
 * Generate a tournament schedule
 */
function generateTournament(queens, kings, matchesPerPlayer, courts) {
	const shuffle = arr => {
        const result = [...arr];

        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }

        return result;
    };

    // Validate input
    if (queens.length !== kings.length) {
        throw new Error("Queens and Kings must have equal numbers.");
    }

    if (queens.length !== 6 || kings.length !== 6 ||
        matchesPerPlayer !== 4 || courts !== 2) {
        throw new Error(
            "This version currently supports 6 Queens, 6 Kings, " +
            "4 matches per player and 2 courts."
        );
    }

    const players = [...queens, ...kings];

    if (new Set(players).size !== players.length) {
        throw new Error("Player names must be unique.");
    }

    const totalRounds = 6;
    const schedule = [];
    const partnerHistory = new Set();

    // Generate the 3 possible ways to divide 4 players into 2 pairs.
    function getPairings(list) {
        const [a, b, c, d] = list;

        return [
            [[a, b], [c, d]],
            [[a, c], [b, d]],
            [[a, d], [b, c]]
        ];
    }

    // Generate all possible two-match combinations for one round.
    function getRoundCandidates(activeQueens, activeKings) {

        const candidates = [];

        const queenPairings = getPairings(activeQueens);
        const kingPairings = getPairings(activeKings);

        for (const qp of queenPairings) {
            for (const kp of kingPairings) {

                for (let orientation = 0; orientation < 4; orientation++) {

                    const matches = [];

                    for (let i = 0; i < 2; i++) {

                        const kingPair = kp[i];
                        const reverse = (orientation >> i) & 1;

                        matches.push({
                            team1: [qp[i][0], kingPair[reverse]],
                            team2: [qp[i][1], kingPair[1 - reverse]]
                        });
                    }

                    candidates.push(matches);
                }
            }
        }

        return shuffle(candidates);
    }

    function getPartnerKeys(matches) {
        return matches.flatMap(match => [
            [...match.team1].sort().join("|"),
            [...match.team2].sort().join("|")
        ]);
    }

    // Build the active players for each round.
    // Each player rests in exactly two rounds, three rounds apart.
    const roundPlayers = [];

    for (let r = 0; r < totalRounds; r++) {

        const restingQueens = new Set([
            queens[r],
            queens[(r + 3) % 6]
        ]);

        const restingKings = new Set([
            kings[(r + 1) % 6],
            kings[(r + 4) % 6]
        ]);

        roundPlayers.push({
            queens: queens.filter(q => !restingQueens.has(q)),
            kings: kings.filter(k => !restingKings.has(k))
        });
    }

    // Backtracking only across 6 rounds and their 36 possible pairings.
    function solve(roundIndex) {

        if (roundIndex === totalRounds) {
            return true;
        }

        const active = roundPlayers[roundIndex];

        const candidates = getRoundCandidates(
            active.queens,
            active.kings
        );

        for (const matches of candidates) {

            const keys = getPartnerKeys(matches);

            // Do not repeat partners.
            if (keys.some(key => partnerHistory.has(key))) {
                continue;
            }

            keys.forEach(key => partnerHistory.add(key));
            schedule.push(matches);

            if (solve(roundIndex + 1)) {
                return true;
            }

            schedule.pop();
            keys.forEach(key => partnerHistory.delete(key));
        }

        return false;
    }

    if (!solve(0)) {
        throw new Error(
            "Unable to generate a schedule without repeated partners. " +
            "Please try generating again."
        );
    }

    // Flatten rounds and assign courts.
    const result = [];

    schedule.forEach((roundMatches, roundIndex) => {

        shuffle(roundMatches).forEach((match, courtIndex) => {

            result.push({
                ...match,
                round: roundIndex + 1,
                court: courtIndex + 1,
                score: [0, 0]
            });
        });
    });

    return result;
}



