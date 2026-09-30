# Wazee wa Betting TZ

Jukwaa la Tanzania la betting tips, mikeka na community ya michezo.

## Hali ya sasa

- Dashboard mpya, mobile-first na responsive
- Community picks, mechi za leo, leaderboard na responsible betting guidance
- Ticket builder ya kuanza kuchagua selections na kuhesabu total odds
- Login/ticket states ziko tayari kuunganishwa na authentication provider
- Hakuna matokeo ya michezo yaliyobuniwa; sports results zitaingia kupitia API ya server-side

## Kuendesha locally

```bash
pnpm install
pnpm run dev
```

## Production integrations zinazohitajika

Ili kukamilisha platform ya production kulingana na brief, ongeza backend/database/auth na secrets hizi kupitia hosting provider (usiweke kwenye frontend):

```env
SPORTS_API_KEY=
SPORTS_API_BASE_URL=
DATABASE_URL=
AUTH_SECRET=
```

Sports API service inapaswa kuhifadhi `event_id`, league/team IDs na match time kabla ya settlement engine ku-settle selections. Status ya WON/LOST haipaswi kuwekwa bila final result kutoka source hiyo.
