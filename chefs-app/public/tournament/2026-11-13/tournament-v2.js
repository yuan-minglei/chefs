
/**
 * Generate a fair randomized pickleball tournament schedule.
 *
 * Rules:
 * 1. Equal numbers of Queens and Kings.
 * 2. Each match has 2 Queens and 2 Kings.
 * 3. Each team has 1 Queen + 1 King.
 * 4. Every player plays exactly matchesPerPlayer matches.
 * 5. A player cannot play twice in the same round.
 * 6. No repeated Queen-King partnerships.
 * 7. Minimize consecutive games.
 * 8. Distribute rest rounds evenly.
 * 9. Generate multiple schedules and select the fairest.
 */
function generateTournament(
    queens,
    kings,
    matchesPerPlayer,
    courts,
    maxAttempts = 100
) {
    // --------------------------------
    // 1. Utility functions
    // --------------------------------

    const shuffle = arr => {
        const result = [...arr];

        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }

        return result;
    };

    // --------------------------------
    // 2. Validate inputs
    // --------------------------------

    if (!Array.isArray(queens) || !Array.isArray(kings)) {
        throw new Error("Queens and Kings must be arrays.");
    }

    const n = queens.length;

    if (n !== kings.length) {
        throw new Error("Queens and Kings must have equal numbers.");
    }

    if (n < 2) {
        throw new Error("At least 2 Queens and 2 Kings are required.");
    }

    if (!Number.isInteger(matchesPerPlayer) ||
        matchesPerPlayer < 1 ||
        matchesPerPlayer > n) {
        throw new Error(
            `matchesPerPlayer must be between 1 and ${n}.`
        );
    }

    if (!Number.isInteger(courts) || courts < 1) {
        throw new Error("Courts must be a positive integer.");
    }

    if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
        throw new Error("maxAttempts must be a positive integer.");
    }

    const players = [...queens, ...kings];

    if (players.some(p => p == null || p === "")) {
        throw new Error("Player names cannot be empty.");
    }

    if (new Set(players).size !== players.length) {
        throw new Error("Player names must be unique.");
    }

    // --------------------------------
    // 3. Calculate schedule dimensions
    // --------------------------------

    const totalMatches = n * matchesPerPlayer / 2;

    if (!Number.isInteger(totalMatches)) {
        throw new Error(
            "Impossible schedule: Queens × matchesPerPlayer " +
            "must be divisible by 2."
        );
    }

    const effectiveCourts = Math.min(
        courts,
        Math.floor(n / 2)
    );

    const totalRounds = Math.max(
        matchesPerPlayer,
        Math.ceil(totalMatches / effectiveCourts)
    );

    const baseMatches = Math.floor(totalMatches / totalRounds);
    const extraMatches = totalMatches % totalRounds;

    // Same round capacities for every attempt.
    const roundCapacities = shuffle([
        ...Array(extraMatches).fill(baseMatches + 1),
        ...Array(totalRounds - extraMatches).fill(baseMatches)
    ]);

    // --------------------------------
    // 4. Generate candidate matches
    // --------------------------------

    function getCandidates(
        remainingQ,
        remainingK,
        usedPlayers,
        partnerHistory
    ) {
        const candidates = [];

        const availableQ = shuffle(
            queens.filter(q =>
                remainingQ.get(q) > 0 &&
                !usedPlayers.has(q)
            )
        );

        const availableK = shuffle(
            kings.filter(k =>
                remainingK.get(k) > 0 &&
                !usedPlayers.has(k)
            )
        );

        for (let i = 0; i < availableQ.length - 1; i++) {
            for (let j = i + 1; j < availableQ.length; j++) {

                const q1 = availableQ[i];
                const q2 = availableQ[j];

                for (let x = 0; x < availableK.length - 1; x++) {
                    for (let y = x + 1; y < availableK.length; y++) {

                        const k1 = availableK[x];
                        const k2 = availableK[y];

                        const pairings = [
                            [[q1, k1], [q2, k2]],
                            [[q1, k2], [q2, k1]]
                        ];

                        for (const pairing of pairings) {

                            const keys = pairing.map(([q, k]) =>
                                JSON.stringify([q, k])
                            );

                            if (keys.some(key =>
                                partnerHistory.has(key)
                            )) {
                                continue;
                            }

                            candidates.push({
                                match: {
                                    team1: pairing[0],
                                    team2: pairing[1]
                                },
                                keys,
                                players: [q1, q2, k1, k2],
                                priority:
                                    remainingQ.get(q1) +
                                    remainingQ.get(q2) +
                                    remainingK.get(k1) +
                                    remainingK.get(k2) +
                                    Math.random()
                            });
                        }
                    }
                }
            }
        }

        return candidates.sort(
            (a, b) => b.priority - a.priority
        );
    }

    // --------------------------------
    // 5. Evaluate schedule fairness
    // --------------------------------

    function evaluateFairness(schedule) {

        const played = new Map(
            players.map(p => [
                p,
                Array(totalRounds).fill(false)
            ])
        );

        schedule.forEach((matches, roundIndex) => {
            matches.forEach(match => {
                [...match.team1, ...match.team2].forEach(player => {
                    played.get(player)[roundIndex] = true;
                });
            });
        });

        let penalty = 0;
        let overallMaxStreak = 0;
        let totalConsecutivePairs = 0;

        players.forEach(player => {

            const rounds = played.get(player);

            let streak = 0;
            let maxStreak = 0;
            let consecutivePairs = 0;

            const restRounds = [];

            rounds.forEach((isPlaying, index) => {

                if (isPlaying) {
                    streak++;

                    maxStreak = Math.max(maxStreak, streak);

                    if (streak > 1) {
                        consecutivePairs++;
                    }
                } else {
                    streak = 0;
                    restRounds.push(index);
                }
            });

            overallMaxStreak = Math.max(
                overallMaxStreak,
                maxStreak
            );

            totalConsecutivePairs += consecutivePairs;

            // Penalize consecutive games.
            penalty += maxStreak * maxStreak * 100;
            penalty += consecutivePairs * 100;

            // Penalize uneven rest distribution.
            if (restRounds.length > 1) {

                const gaps = restRounds.map((r, i) => {
                    const next = restRounds[
                        (i + 1) % restRounds.length
                    ];

                    return (next - r + totalRounds) % totalRounds;
                });

                const average =
                    totalRounds / restRounds.length;

                const variance = gaps.reduce(
                    (sum, gap) =>
                        sum + Math.pow(gap - average, 2),
                    0
                ) / gaps.length;

                penalty += variance * 50;
            }
        });

        return {
            score: penalty,
            maxConsecutiveGames: overallMaxStreak,
            totalConsecutivePairs
        };
    }

    // --------------------------------
    // 6. Generate and optimize schedules
    // --------------------------------

    let bestSchedule = null;
    let bestScore = Infinity;
    let bestFairness = null;

    let successfulAttempts = 0;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {

        console.log(`Generating attempt ${attempt + 1}/${maxAttempts}`);

        const remainingQ = new Map(
            queens.map(q => [q, matchesPerPlayer])
        );

        const remainingK = new Map(
            kings.map(k => [k, matchesPerPlayer])
        );

        const partnerHistory = new Set();
        const schedule = [];

        let failed = false;

        for (let round = 0; round < totalRounds; round++) {

            const roundMatches = [];
            const usedPlayers = new Set();

            const targetMatches = roundCapacities[round];

            for (let m = 0; m < targetMatches; m++) {

                const candidates = getCandidates(
                    remainingQ,
                    remainingK,
                    usedPlayers,
                    partnerHistory
                );

                if (candidates.length === 0) {
                    failed = true;
                    break;
                }

                const selected = candidates[0];

                roundMatches.push(selected.match);

                selected.players.forEach(player => {

                    usedPlayers.add(player);

                    const remaining = queens.includes(player)
                        ? remainingQ
                        : remainingK;

                    remaining.set(
                        player,
                        remaining.get(player) - 1
                    );
                });

                selected.keys.forEach(key =>
                    partnerHistory.add(key)
                );
            }

            if (failed) {
                break;
            }

            schedule.push(roundMatches);
        }

        if (failed) {
            continue;
        }

        // Verify exact match counts.
        const allPlayersCorrect = players.every(player => {

            const remaining = queens.includes(player)
                ? remainingQ
                : remainingK;

            return remaining.get(player) === 0;
        });

        if (!allPlayersCorrect) {
            continue;
        }

        successfulAttempts++;

        // Evaluate fairness.
        const fairness = evaluateFairness(schedule);

        console.log(
            `Attempt ${attempt + 1}:`,
            "Fairness score =", fairness.score,
            "Max consecutive =", fairness.maxConsecutiveGames
        );

        // Keep the best schedule.
        if (fairness.score < bestScore) {

            bestScore = fairness.score;
            bestFairness = fairness;

            bestSchedule = schedule.map(round =>
                round.map(match => ({
                    ...match,
                    team1: [...match.team1],
                    team2: [...match.team2]
                }))
            );
        }

        // No return here!
        // Continue until all attempts are completed.
    }

    // --------------------------------
    // 7. Return best schedule
    // --------------------------------

    if (!bestSchedule) {
        throw new Error(
            `Unable to generate a valid schedule after ${maxAttempts} attempts.`
        );
    }

    console.log("--------------------------------");
    console.log("Requested attempts:", maxAttempts);
    console.log("Successful attempts:", successfulAttempts);
    console.log("Best fairness score:", bestScore);
    console.log(
        "Maximum consecutive games:",
        bestFairness.maxConsecutiveGames
    );
    console.log(
        "Total consecutive game pairs:",
        bestFairness.totalConsecutivePairs
    );
    console.log("--------------------------------");

    // Assign courts and flatten schedule.
    const result = [];

    bestSchedule.forEach((roundMatches, roundIndex) => {

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
