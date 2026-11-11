PS C:\yml\workspace\chefs\git\chefs\chefs-app> npx wrangler d1 execute chefs --remote --command="CREATE TABLE IF NOT EXISTS tournament (TournamentId INTEGER PRIMARY KEY AUTOINCREMENT, TournamentName TEXT NOT NULL, LastUpdatedEpoch INTEGER NOT NULL DEFAULT (unixepoch()), TournamentData TEXT NOT NULL CHECK (json_valid(TournamentData)));"

 ⛅️ wrangler 4.159.0 (update available 4.160.0)
───────────────────────────────────────────────
Resource location: remote

🌀 Executing on remote database chefs (849fcb6c-854d-4aea-a190-0a655a574ec7):
🌀 To execute on your local development database, remove the --remote flag from your wrangler command.
🚣 Executed 1 command in 0.53ms
PS C:\yml\workspace\chefs\git\chefs\chefs-app> npx wrangler d1 execute chefs --remote --command="SELECT name FROM sqlite_master WHERE type='table';"

 ⛅️ wrangler 4.159.0 (update available 4.160.0)
───────────────────────────────────────────────
Resource location: remote

🌀 Executing on remote database chefs (849fcb6c-854d-4aea-a190-0a655a574ec7):
🌀 To execute on your local development database, remove the --remote flag from your wrangler command.
🚣 Executed 1 command in 0.23ms
┌─────────────────┐
│ name            │
├─────────────────┤
│ _cf_KV          │
├─────────────────┤
│ tournament      │
├─────────────────┤
│ sqlite_sequence │
└─────────────────┘
PS C:\yml\workspace\chefs\git\chefs\chefs-app> npx wrangler d1 execute chefs --remote --command="CREATE TRIGGER IF NOT EXISTS trg_tournament_updated AFTER UPDATE OF TournamentName, TournamentData ON tournament FOR EACH ROW WHEN NEW.LastUpdatedEpoch = OLD.LastUpdatedEpoch BEGIN UPDATE tournament SET LastUpdatedEpoch = unixepoch() WHERE TournamentId = NEW.TournamentId; END;"

 ⛅️ wrangler 4.159.0 (update available 4.160.0)
───────────────────────────────────────────────
Resource location: remote

🌀 Executing on remote database chefs (849fcb6c-854d-4aea-a190-0a655a574ec7):
🌀 To execute on your local development database, remove the --remote flag from your wrangler command.
🚣 Executed 1 command in 0.14ms

PS C:\yml\workspace\chefs\git\chefs\chefs-app> npx wrangler d1 execute chefs --remote --command="PRAGMA table_info(tournament);"

 ⛅️ wrangler 4.159.0 (update available 4.160.0)
───────────────────────────────────────────────
Resource location: remote

🌀 Executing on remote database chefs (849fcb6c-854d-4aea-a190-0a655a574ec7):
🌀 To execute on your local development database, remove the --remote flag from your wrangler command.
🚣 Executed 1 command in 0.16ms
┌─────┬──────────────────┬─────────┬─────────┬─────────────┬────┐
│ cid │ name             │ type    │ notnull │ dflt_value  │ pk │
├─────┼──────────────────┼─────────┼─────────┼─────────────┼────┤
│ 0   │ TournamentId     │ INTEGER │ 0       │ null        │ 1  │
├─────┼──────────────────┼─────────┼─────────┼─────────────┼────┤
│ 1   │ TournamentName   │ TEXT    │ 1       │ null        │ 0  │
├─────┼──────────────────┼─────────┼─────────┼─────────────┼────┤
│ 2   │ LastUpdatedEpoch │ INTEGER │ 1       │ unixepoch() │ 0  │
├─────┼──────────────────┼─────────┼─────────┼─────────────┼────┤
│ 3   │ TournamentData   │ TEXT    │ 1       │ null        │ 0  │
└─────┴──────────────────┴─────────┴─────────┴─────────────┴────┘
PS C:\yml\workspace\chefs\git\chefs\chefs-app>


PS C:\yml\workspace\chefs\git\chefs\chefs-app> npx wrangler d1 execute chefs --remote --command="select TournamentId,TournamentName,LastUpdatedEpoch,substr(TournamentData,1,50) as TournamentData from tournament;"

 ⛅️ wrangler 4.159.0 (update available 4.160.0)
───────────────────────────────────────────────
Resource location: remote

🌀 Executing on remote database chefs (849fcb6c-854d-4aea-a190-0a655a574ec7):
🌀 To execute on your local development database, remove the --remote flag from your wrangler command.
🚣 Executed 1 command in 0.23ms
┌──────────────┬─────────────────────────┬──────────────────┬─────────────────────────────────────────────────┐
│ TournamentId │ TournamentName          │ LastUpdatedEpoch │ TournamentData                                  │
├──────────────┼─────────────────────────┼──────────────────┼─────────────────────────────────────────────────┤
│ 1            │ CHEFS-SCHOOL-2026-11-13 │ 1794321759       │ {         "queens": [             { "player": "Judy", "total": 8, " │
└──────────────┴─────────────────────────┴──────────────────┴─────────────────────────────────────────────────┘
