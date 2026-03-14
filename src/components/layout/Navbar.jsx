import { useAuth } from '../../context/AuthContext';
import { getRank } from '../../data/constants';
import ProgressBar from '../ui/ProgressBar';
import styles from './Navbar.module.css';

const NAV_ITEMS = [
  { id: 'home',        icon: '⌂',  label: 'Home'       },
  { id: 'challenges',  icon: '⚡',  label: 'Challenges' },
  { id: 'history',     icon: '📊',  label: 'History'    },
  { id: 'leaderboard', icon: '🏆',  label: 'Ranks'      },
  { id: 'profile',     icon: '👤',  label: 'Profile'    },
];

const ADMIN_ITEM = { id: 'admin', icon: '⚙', label: 'Admin' };

export default function Navbar({ page, setPage }) {
  const { user, currentUser, logout } = useAuth();
  if (!user) return null;

  const rank     = getRank(user.xp || 0);
  const isAdmin  = user.role === 'admin';
  const navItems = isAdmin ? [...NAV_ITEMS, ADMIN_ITEM] : NAV_ITEMS;

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {/* Logo */}
        <button className={styles.logo} onClick={() => setPage('home')}>
          <span className={styles.logoIcon}>⬡</span>
          <span className="shimmer-text" style={{ fontFamily: "'Space Mono', monospace", fontSize: 18, fontWeight: 700, letterSpacing: 2 }}>
            QUIZFORGE
          </span>
        </button>

        {/* Nav links */}
        <div className={styles.links}>
          {navItems.map(n => (
            <button
              key={n.id}
              className={`${styles.link} ${page === n.id ? styles.active : ''}`}
              onClick={() => setPage(n.id)}
            >
              <span className={styles.linkIcon}>{n.icon}</span>
              <span className={styles.linkLabel}>{n.label}</span>
            </button>
          ))}
        </div>

        {/* User area */}
        <div className={styles.userArea}>
          <div className={styles.xpWidget}>
            <div className={styles.xpTop}>
              <span className={styles.rankIcon}>{rank.icon}</span>
              <span className={styles.rankLabel}>{rank.label}</span>
              <span className={styles.xpValue} style={{ fontFamily: "'Space Mono', monospace" }}>
                {user.xp?.toLocaleString()} XP
              </span>
            </div>
          </div>

          <button className={styles.avatar} onClick={() => setPage('profile')}>
            {(user.displayName || currentUser || 'U')[0].toUpperCase()}
          </button>

          <button className={styles.logoutBtn} onClick={logout} title="Logout">
            ↪
          </button>
        </div>
      </div>
    </nav>
  );
}
