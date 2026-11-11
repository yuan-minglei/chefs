/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	// total count of messages request

	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname.startsWith('/api/')) {
			// Handle API requests here if needed

			// GET: Retrieve all tournaments
			if (url.pathname === '/api/tournaments' && request.method === 'GET') {
				const { results } = await env.DB
					.prepare(`
                        SELECT TournamentId, TournamentName, LastUpdatedEpoch
                        FROM tournament
                    `)
					.all();

				return Response.json(results);
			}

			const tournamentMatch = url.pathname.match(
				/^\/api\/tournaments\/(\d+)$/
			);

			// GET: Retrieve tournament by ID
			if (tournamentMatch && request.method === 'GET') {
				const id = tournamentMatch[1];
				const result = await env.DB
					.prepare(`
							SELECT TournamentData
							FROM tournament
							WHERE TournamentId = ?
						`)
					.bind(id)
					.first<{ TournamentData: string }>();

				if (!result) {
					return Response.json(
						{ error: 'Tournament not found' },
						{ status: 404 }
					);
				}

				const jsonData = JSON.parse(result.TournamentData);

				return Response.json(jsonData);
			}


			// PUT /api/tournaments/:id
			if (tournamentMatch && request.method === 'PUT') {
				const tournamentId = Number(tournamentMatch[1]);

				if (!Number.isSafeInteger(tournamentId) || tournamentId <= 0) {
					return Response.json(
						{ error: 'Invalid tournament ID' },
						{ status: 400 }
					);
				}

				// Validate request body
				let body: unknown;

				try {
					body = await request.json();
				} catch {
					return Response.json(
						{ error: 'Invalid JSON request body' },
						{ status: 400 }
					);
				}

				// Ensure the request body is a JSON object
				if (
					body === null ||
					typeof body !== 'object' ||
					Array.isArray(body)
				) {
					return Response.json(
						{ error: 'Tournament data must be a JSON object' },
						{ status: 400 }
					);
				}

				const updatedData = JSON.stringify(body);

				// Read existing data for optimistic concurrency protection
				const existing = await env.DB
					.prepare(`
            SELECT TournamentData
            FROM tournament
            WHERE TournamentId = ?
        `)
					.bind(tournamentId)
					.first<{ TournamentData: string }>();

				if (!existing) {
					return Response.json(
						{ error: 'Tournament not found' },
						{ status: 404 }
					);
				}

				// Update only if the original data has not changed
				const updateResult = await env.DB
					.prepare(`
            UPDATE tournament
            SET TournamentData = ?
            WHERE TournamentId = ?
              AND TournamentData = ?
        `)
					.bind(
						updatedData,
						tournamentId,
						existing.TournamentData
					)
					.run();

				if (updateResult.meta.changes === 0) {
					return Response.json(
						{
							error: 'Tournament was modified by another user. Please reload and try again.'
						},
						{ status: 409 }
					);
				}

				return Response.json({
					success: true,
					tournamentId
				});
			}



			// PUT /api/tournaments/:id/matches/:matchIndex
			// Request body: { "score": [11, 9] }
			const matchUpdate = url.pathname.match(
				/^\/api\/tournaments\/(\d+)\/matches\/(\d+)$/
			);

			if (matchUpdate && request.method === 'PUT') {

				const tournamentId = Number(matchUpdate[1]);
				const matchIndex = Number(matchUpdate[2]);

				// Validate URL parameters
				if (!Number.isSafeInteger(tournamentId) || tournamentId <= 0 ||
					!Number.isSafeInteger(matchIndex)) {
					return Response.json(
						{ error: 'Invalid tournament ID or match index' },
						{ status: 400 }
					);
				}

				// Validate request body
				let body: unknown;

				try {
					body = await request.json();
				} catch {
					return Response.json(
						{ error: 'Invalid JSON request body' },
						{ status: 400 }
					);
				}

				const score = (body as { score?: unknown })?.score;

				if (
					!Array.isArray(score) ||
					score.length !== 2 ||
					!score.every(
						value => Number.isInteger(value) && value >= 0
					)
				) {
					return Response.json(
						{ error: 'Score must contain exactly two non-negative integers' },
						{ status: 400 }
					);
				}

				// Retrieve tournament
				const result = await env.DB
					.prepare(`
				SELECT TournamentData
				FROM tournament
				WHERE TournamentId = ?
			`)
					.bind(tournamentId)
					.first<{ TournamentData: string }>();

				if (!result) {
					return Response.json(
						{ error: 'Tournament not found' },
						{ status: 404 }
					);
				}

				// Parse tournament JSON
				let jsonData: {
					matchs?: Array<{ score?: number[];[key: string]: unknown }>;
					[key: string]: unknown;
				};

				try {
					jsonData = JSON.parse(result.TournamentData);
				} catch {
					return Response.json(
						{ error: 'Invalid tournament data in database' },
						{ status: 500 }
					);
				}

				// Validate matches array
				if (!Array.isArray(jsonData.matchs)) {
					return Response.json(
						{ error: 'Tournament matches not found' },
						{ status: 500 }
					);
				}

				// Validate match index (zero-based)
				if (
					matchIndex < 0 ||
					matchIndex >= jsonData.matchs.length ||
					!jsonData.matchs[matchIndex]
				) {
					return Response.json(
						{ error: 'Match not found' },
						{ status: 404 }
					);
				}

				// Update match score
				jsonData.matchs[matchIndex].score = score;

				const updatedData = JSON.stringify(jsonData);

				// Save tournament with optimistic concurrency protection
				const updateResult = await env.DB
					.prepare(`
				UPDATE tournament
				SET TournamentData = ?
				WHERE TournamentId = ?
				AND TournamentData = ?
			`)
					.bind(
						updatedData,
						tournamentId,
						result.TournamentData
					)
					.run();

				if (updateResult.meta.changes === 0) {
					return Response.json(
						{
							error: 'Tournament was modified by another user. Please reload and try again.'
						},
						{ status: 409 }
					);
				}

				return Response.json({
					success: true,
					tournamentId,
					matchIndex,
					score
				});
			}

		}

		switch (url.pathname) {
			case '/message':
				return new Response('Hello, World!');
			case '/random':
				return new Response(crypto.randomUUID());
			default:
				return new Response('Not Found', { status: 404 });
		}
	},
} satisfies ExportedHandler<Env>;
