# Wazee wa Betting TZ

Jukwaa la Tanzania la betting tips, mikeka na community ya michezo.

## Hali ya sasa

- Dashboard mpya, mobile-first na responsive
- Community picks, mechi za leo, leaderboard na responsible betting guidance
- Ticket builder ya kuanza kuchagua selections na kuhesabu total odds
- Firebase Authentication: email/password, registration na Google sign-in
- Cloud Firestore: user profiles na betting drafts
- Firebase Storage: profile image uploads
- Firestore na Storage security rules ziko kwenye `firestore.rules` na `storage.rules`
- Hakuna matokeo ya michezo yaliyobuniwa; sports results zitaingia kupitia API ya server-side

## Kuendesha locally

```bash
pnpm install
pnpm run dev
```

## Firebase setup

Firebase web configuration hutumia `VITE_FIREBASE_*` environment variables. Nakili template hii:

```bash
cp .env.example .env.local
```

Kisha hakikisha Firebase Console imewezeshwa:

1. Authentication: Email/Password na Google provider
2. Firestore Database
3. Storage
4. Rules kutoka `firestore.rules` na `storage.rules`
5. Authorized domain ya production: `steward-tz.github.io`

Firebase web API key si credential ya server; usalama unatokana na Authentication na rules. Usitie service-account private key kwenye frontend.

## Production integrations zinazohitajika

Ili kukamilisha platform ya production kulingana na brief, ongeza backend/database/auth na secrets hizi kupitia hosting provider (usiweke kwenye frontend):

```env
SPORTS_API_KEY=
SPORTS_API_BASE_URL=
DATABASE_URL=
AUTH_SECRET=
```

Sports API service inapaswa kuhifadhi `event_id`, league/team IDs na match time kabla ya settlement engine ku-settle selections. Status ya WON/LOST haipaswi kuwekwa bila final result kutoka source hiyo.
