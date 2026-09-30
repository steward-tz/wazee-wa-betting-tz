import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { User } from "firebase/auth";
import {
  loginWithGoogle,
  loginWithEmail,
  logout,
  registerWithEmail,
  saveBettingDraft,
  subscribeToAuth,
} from "../lib/firebase";
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  Bookmark,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  Filter,
  Heart,
  LayoutDashboard,
  LogIn,
  Menu,
  MessageCircle,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wazee wa Betting TZ — Tips, mikeka na jamii ya michezo" },
      {
        name: "description",
        content:
          "Jukwaa la Tanzania la kushiriki betting tips, mikeka na takwimu za michezo kwa uwazi.",
      },
      { property: "og:title", content: "Wazee wa Betting TZ" },
      { property: "og:description", content: "Tips, mikeka na jamii ya michezo Tanzania." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BettingHome,
});
type Ticket = {
  id: number;
  creator: string;
  avatar: string;
  title: string;
  league: string;
  odds: number;
  risk: string;
  picks: string[];
  likes: number;
  comments: number;
  status: "PENDING" | "WON";
};
const tickets: Ticket[] = [
  {
    id: 1,
    creator: "Mzee wa Odds",
    avatar: "MO",
    title: "Weekend ya uhakika",
    league: "Premier League",
    odds: 4.82,
    risk: "Kati",
    picks: ["Arsenal — 1X", "Liverpool — Over 1.5", "Chelsea — GG"],
    likes: 128,
    comments: 24,
    status: "PENDING",
  },
  {
    id: 2,
    creator: "Bongo Predictor",
    avatar: "BP",
    title: "Mchanganyiko wa leo",
    league: "La Liga · Serie A",
    odds: 7.15,
    risk: "Juu",
    picks: ["Real Madrid — Win", "Inter — 1X", "Barcelona — Over 2.5"],
    likes: 94,
    comments: 18,
    status: "WON",
  },
  {
    id: 3,
    creator: "Captain Tips",
    avatar: "CT",
    title: "Safe picks",
    league: "CAF · EPL",
    odds: 2.36,
    risk: "Ndogo",
    picks: ["Simba — 1X", "Man City — Win"],
    likes: 76,
    comments: 11,
    status: "PENDING",
  },
];
const matches = [
  { time: "15:00", home: "Arsenal", away: "Brighton", league: "Premier League", code: "EPL" },
  { time: "18:30", home: "Simba SC", away: "Yanga SC", league: "NBC Premier League", code: "TZ" },
  { time: "21:00", home: "Barcelona", away: "Sevilla", league: "La Liga", code: "LAL" },
];
function BettingHome() {
  const [active, setActive] = useState("Nyumbani");
  const [query, setQuery] = useState("");
  const [sport, setSport] = useState("Zote");
  const [liked, setLiked] = useState<number[]>([]);
  const [saved, setSaved] = useState<number[]>([]);
  const [showTicket, setShowTicket] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [selections, setSelections] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => subscribeToAuth(setUser), []);
  const filteredTickets = useMemo(
    () =>
      tickets.filter((t) =>
        `${t.title} ${t.creator} ${t.league}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );
  const totalOdds = selections.reduce(
    (total, item) =>
      total * (item.includes("Arsenal") ? 1.75 : item.includes("Simba") ? 1.42 : 1.65),
    1,
  );
  const addSelection = (label: string) => {
    if (!selections.includes(label)) {
      setSelections([...selections, label]);
      toast.success("Selection imeongezwa kwenye mkeka");
    }
  };
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">W</div>
          <div>
            <strong>WAZEE WA</strong>
            <span>BETTING TZ</span>
          </div>
        </div>
        <div className="live-pill">
          <span /> Mfumo uko hewani
        </div>
        <nav className="side-nav">
          {[
            { label: "Nyumbani", icon: LayoutDashboard },
            { label: "Tips", icon: Target },
            { label: "Mechi", icon: CalendarDays },
            { label: "Leaderboard", icon: Trophy },
            { label: "Jamii", icon: Users },
          ].map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setActive(label)}
              className={active === label ? "nav-item active" : "nav-item"}
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === "Tips" && <em>12</em>}
            </button>
          ))}
        </nav>
        <div className="side-card">
          <Sparkles size={18} />
          <strong>Jiunge na jamii</strong>
          <p>Unda mkeka wako na uwashirikishe wengine.</p>
          <button onClick={() => setShowTicket(true)}>
            Anza mkeka <ArrowUpRight size={15} />
          </button>
        </div>
        <div className="sidebar-foot">
          <button>
            <CircleHelp size={17} /> Msaada
          </button>
          <button>
            <ShieldCheck size={17} /> Uwajibikaji
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu">
            <Menu size={20} />
          </button>
          <div className="search-box">
            <Search size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tafuta tips, watumiaji au ligi..."
            />
            <kbd>⌘ K</kbd>
          </div>
          <div className="top-actions">
            <button className="icon-button">
              <Bell size={18} />
              <i />
            </button>
            <button className="profile-button" onClick={() => setShowLogin(true)}>
              <span className="avatar small">SW</span>
              <span className="profile-copy">
                <b>{user?.displayName || "Karibu"}</b>
                <small>{user ? "Akaunti yangu" : "Ingia / Jisajili"}</small>
              </span>
              <ChevronDown size={15} />
            </button>
          </div>
        </header>
        <div className="content-wrap">
          <section className="hero">
            <div className="hero-copy">
              <span className="eyebrow">
                <Zap size={14} /> Jukwaa la tips Tanzania
              </span>
              <h1>
                Cheza kwa <span>maarifa.</span>
                <br />
                Shinda kwa nidhamu.
              </h1>
              <p>
                Gundua tips zinazoshirikishwa na jamii, tengeneza mikeka yako na fuatilia matokeo
                kwa uwazi.
              </p>
              <div className="hero-actions">
                <button className="primary-button" onClick={() => setShowTicket(true)}>
                  Tengeneza mkeka <Plus size={17} />
                </button>
                <button className="ghost-button" onClick={() => setActive("Tips")}>
                  Angalia tips <ArrowUpRight size={17} />
                </button>
              </div>
            </div>
            <div className="hero-art">
              <div className="hero-orb orb-one" />
              <div className="hero-orb orb-two" />
              <div className="score-float">
                <div className="mini-icon green">
                  <Trophy size={15} />
                </div>
                <div>
                  <small>Win rate ya jamii</small>
                  <strong>68.4%</strong>
                </div>
                <span>+4.2%</span>
              </div>
              <div className="hero-ball">
                W<span>+</span>
              </div>
            </div>
          </section>
          <div className="stats-row">
            <Stat icon={Users} value="12.8K" label="Wanajamii" trend="+18% mwezi huu" />
            <Stat
              icon={Target}
              value="68.4%"
              label="Win rate ya jamii"
              trend="Imethibitishwa"
              green
            />
            <Stat icon={Trophy} value="4,291" label="Mikeka iliyoshinda" trend="Wiki hii" />
            <Stat icon={BarChart3} value="2.84" label="Wastani wa odds" trend="Tips zote" />
          </div>
          <section className="section-block">
            <div className="section-heading">
              <div>
                <span className="section-kicker">LIVE BOARD</span>
                <h2>Mechi za leo</h2>
              </div>
              <button className="text-button" onClick={() => setActive("Mechi")}>
                Ratiba yote <ArrowUpRight size={15} />
              </button>
            </div>
            <div className="match-strip">
              {matches.map((match) => (
                <button
                  key={match.home}
                  className="match-card"
                  onClick={() => addSelection(`${match.home} — Win`)}
                >
                  <div className="match-meta">
                    <span>{match.league}</span>
                    <b>{match.time}</b>
                  </div>
                  <div className="teams">
                    <span>{match.home}</span>
                    <strong>vs</strong>
                    <span>{match.away}</span>
                  </div>
                  <div className="match-cta">
                    <span className="league-code">{match.code}</span>
                    <span>
                      + ongeza <Plus size={13} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
          <section className="section-block">
            <div className="section-heading">
              <div>
                <span className="section-kicker">COMMUNITY PICKS</span>
                <h2>Tips za jamii</h2>
              </div>
              <div className="filter-row">
                <div className="select-wrap">
                  <Filter size={14} />
                  <select value={sport} onChange={(e) => setSport(e.target.value)}>
                    <option>Zote</option>
                    <option>Football</option>
                    <option>Basketball</option>
                  </select>
                </div>
                <button className="text-button" onClick={() => setActive("Tips")}>
                  Tazama zote <ArrowUpRight size={15} />
                </button>
              </div>
            </div>
            <div className="ticket-grid">
              {filteredTickets.map((ticket) => (
                <article className="ticket-card" key={ticket.id}>
                  <div className="ticket-top">
                    <div className="creator">
                      <span className="avatar">{ticket.avatar}</span>
                      <div>
                        <b>{ticket.creator}</b>
                        <small>{ticket.league} · Dakika 24 zilizopita</small>
                      </div>
                    </div>
                    <button className="more-button">•••</button>
                  </div>
                  <div className="ticket-title">
                    <h3>{ticket.title}</h3>
                    <span className={ticket.status === "WON" ? "status won" : "status pending"}>
                      {ticket.status === "WON" ? "✓ WON" : "◷ PENDING"}
                    </span>
                  </div>
                  <div className="picks">
                    {ticket.picks.map((pick) => (
                      <button key={pick} onClick={() => addSelection(pick)}>
                        <span>{pick.split(" — ")[0]}</span>
                        <b>{pick.split(" — ")[1]}</b>
                        <Plus size={14} />
                      </button>
                    ))}
                  </div>
                  <div className="ticket-bottom">
                    <div>
                      <small>Total odds</small>
                      <strong>{ticket.odds.toFixed(2)}</strong>
                    </div>
                    <div>
                      <small>Risk</small>
                      <strong
                        className={
                          ticket.risk === "Ndogo"
                            ? "risk-low"
                            : ticket.risk === "Juu"
                              ? "risk-high"
                              : "risk-mid"
                        }
                      >
                        {ticket.risk}
                      </strong>
                    </div>
                    <div className="engagement">
                      <button
                        onClick={() =>
                          setLiked((current) =>
                            current.includes(ticket.id)
                              ? current.filter((x) => x !== ticket.id)
                              : [...current, ticket.id],
                          )
                        }
                        className={liked.includes(ticket.id) ? "engaged" : ""}
                      >
                        <Heart
                          size={15}
                          fill={liked.includes(ticket.id) ? "currentColor" : "none"}
                        />{" "}
                        {ticket.likes + (liked.includes(ticket.id) ? 1 : 0)}
                      </button>
                      <button>
                        <MessageCircle size={15} /> {ticket.comments}
                      </button>
                      <button
                        onClick={() =>
                          setSaved((current) =>
                            current.includes(ticket.id)
                              ? current.filter((x) => x !== ticket.id)
                              : [...current, ticket.id],
                          )
                        }
                        className={saved.includes(ticket.id) ? "engaged" : ""}
                      >
                        <Bookmark
                          size={15}
                          fill={saved.includes(ticket.id) ? "currentColor" : "none"}
                        />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section className="lower-grid">
            <div className="panel leaderboard">
              <div className="section-heading">
                <div>
                  <span className="section-kicker">THIS WEEK</span>
                  <h2>Leaderboard</h2>
                </div>
                <button className="icon-button">
                  <ArrowUpRight size={17} />
                </button>
              </div>
              <div className="leader-head">
                <span>CREATOR</span>
                <span>WIN RATE</span>
              </div>
              {[
                {
                  rank: "01",
                  name: "Mzee wa Odds",
                  sub: "1,284 followers",
                  rate: "82.6%",
                  avatar: "MO",
                },
                {
                  rank: "02",
                  name: "Bongo Predictor",
                  sub: "934 followers",
                  rate: "79.1%",
                  avatar: "BP",
                },
                {
                  rank: "03",
                  name: "Captain Tips",
                  sub: "721 followers",
                  rate: "74.8%",
                  avatar: "CT",
                },
              ].map((item) => (
                <div className="leader-row" key={item.rank}>
                  <b className="rank">{item.rank}</b>
                  <span className="avatar">{item.avatar}</span>
                  <div className="leader-name">
                    <b>{item.name}</b>
                    <small>{item.sub}</small>
                  </div>
                  <strong>{item.rate}</strong>
                </div>
              ))}
            </div>
            <div className="panel responsible">
              <div className="responsible-icon">
                <ShieldCheck size={22} />
              </div>
              <span className="section-kicker">CHEZA KWA UWAZIBIKAJI</span>
              <h2>
                Betting ni burudani,
                <br />
                si chanzo cha kipato.
              </h2>
              <p>
                Weka bajeti yako. Usifukuze hasara. Ukiwa na changamoto, zungumza na mtu
                unayemwamini.
              </p>
              <button className="text-button">
                Soma mwongozo <ArrowUpRight size={15} />
              </button>
            </div>
          </section>
        </div>
      </main>
      {selections.length > 0 && (
        <div className="slip-bar">
          <div>
            <span className="slip-dot" />
            <b>Mkeka wako</b>
            <small>
              {selections.length} selection{selections.length > 1 ? "s" : ""}
            </small>
          </div>
          <strong>
            {totalOdds.toFixed(2)} <small>Total odds</small>
          </strong>
          <button onClick={() => setShowTicket(true)}>
            Fungua mkeka <ArrowUpRight size={15} />
          </button>
          <button className="close-slip" onClick={() => setSelections([])}>
            <X size={16} />
          </button>
        </div>
      )}
      {showTicket && (
        <TicketModal
          selections={selections}
          totalOdds={totalOdds}
          user={user}
          onClose={() => setShowTicket(false)}
          onRequireLogin={() => {
            setShowTicket(false);
            setShowLogin(true);
          }}
        />
      )}
      {showLogin && <LoginModal user={user} onClose={() => setShowLogin(false)} onUser={setUser} />}
    </div>
  );
}
function Stat({
  icon: Icon,
  value,
  label,
  trend,
  green = false,
}: {
  icon: typeof Users;
  value: string;
  label: string;
  trend: string;
  green?: boolean;
}) {
  return (
    <div className="stat-card">
      <div className={green ? "stat-icon green" : "stat-icon"}>
        <Icon size={18} />
      </div>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
        <small className={green ? "green-text" : ""}>{trend}</small>
      </div>
    </div>
  );
}
function TicketModal({
  selections,
  totalOdds,
  user,
  onClose,
  onRequireLogin,
}: {
  selections: string[];
  totalOdds: number;
  user: User | null;
  onClose: () => void;
  onRequireLogin: () => void;
}) {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <span className="section-kicker">TICKET BUILDER</span>
            <h2>Tengeneza mkeka</h2>
          </div>
          <button onClick={onClose}>
            <X size={19} />
          </button>
        </div>
        <div className="notice">
          <ShieldCheck size={17} />
          <span>
            Matokeo halisi yataunganishwa kupitia Sports API baada ya kusanidi API key ya
            production.
          </span>
        </div>
        <label>
          Kichwa cha mkeka
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Mfano: Weekend ya uhakika"
          />
        </label>
        <div className="modal-selections">
          <div className="label-row">
            <b>Selections</b>
            <span>{selections.length} zimechaguliwa</span>
          </div>
          {selections.length ? (
            selections.map((s) => (
              <div className="selection-row" key={s}>
                <span>{s}</span>
                <b>1.65</b>
              </div>
            ))
          ) : (
            <div className="empty-slip">Chagua mechi kwenye board ili kuanza mkeka.</div>
          )}
        </div>
        <div className="modal-total">
          <span>Total odds</span>
          <strong>{selections.length ? totalOdds.toFixed(2) : "—"}</strong>
        </div>
        <button
          className="primary-button full"
          disabled={saving}
          onClick={async () => {
            if (!user) {
              onRequireLogin();
              return;
            }
            setSaving(true);
            try {
              await saveBettingDraft(user.uid, {
                title: title.trim() || "Mkeka mpya",
                selections,
                totalOdds,
              });
              toast.success("Mkeka umehifadhiwa kwenye akaunti yako.");
              onClose();
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "Imeshindikana kuhifadhi mkeka.",
              );
            } finally {
              setSaving(false);
            }
          }}
        >
          {saving ? "Inahifadhi..." : "Hifadhi kama draft"} <ArrowUpRight size={16} />
        </button>
        <p className="modal-foot">
          {user
            ? "Draft itaonekana kwenye akaunti yako."
            : "Ingia ili kuhifadhi mkeka wako kwenye Firestore."}
        </p>
      </div>
    </div>
  );
}
function LoginModal({
  user,
  onClose,
  onUser,
}: {
  user: User | null;
  onClose: () => void;
  onUser: (user: User | null) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [registering, setRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  if (user) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal login-modal" onClick={(event) => event.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            <X size={19} />
          </button>
          <div className="login-mark">W</div>
          <span className="section-kicker">AKAUNTI YAKO</span>
          <h2>{user.displayName || user.email}</h2>
          <p>{user.email}</p>
          <button className="primary-button full" onClick={() => logout().then(() => onUser(null))}>
            Toka kwenye akaunti
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={19} />
        </button>
        <div className="login-mark">W</div>
        <span className="section-kicker">KARIBU KWENYE JAMII</span>
        <h2>Ingia kwenye akaunti</h2>
        <p>Unda mikeka, fuatilia creators na shiriki tips zako.</p>
        {registering && (
          <label>
            Jina lako
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Mzee wa Odds"
            />
          </label>
        )}
        <label>
          Barua pepe
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="username@mfano.com"
            type="email"
          />
        </label>
        <label>
          Password
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="••••••••"
          />
        </label>
        {error && <p className="modal-error">{error}</p>}
        <button
          className="primary-button full"
          disabled={loading}
          onClick={async () => {
            setError("");
            setLoading(true);
            try {
              const account = registering
                ? await registerWithEmail(email, password, displayName)
                : await loginWithEmail(email, password);
              onUser(account);
              toast.success(registering ? "Akaunti imetengenezwa." : "Umeingia kwa mafanikio.");
              onClose();
            } catch (authError) {
              setError(authError instanceof Error ? authError.message : "Imeshindikana kuingia.");
            } finally {
              setLoading(false);
            }
          }}
        >
          <LogIn size={16} /> {loading ? "Inasubiri..." : registering ? "Jisajili" : "Ingia"}
        </button>
        <button
          className="ghost-button full"
          disabled={loading}
          onClick={async () => {
            setError("");
            try {
              const account = await loginWithGoogle();
              onUser(account);
              onClose();
            } catch (authError) {
              setError(
                authError instanceof Error ? authError.message : "Google sign-in imeshindikana.",
              );
            }
          }}
        >
          Endelea na Google
        </button>
        <button className="link-button" onClick={() => setRegistering((value) => !value)}>
          {registering ? "Tayari una akaunti? Ingia" : "Huna akaunti? Jisajili"}
        </button>
      </div>
    </div>
  );
}
