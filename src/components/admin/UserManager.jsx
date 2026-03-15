import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { isSupabaseConfigured } from '../../lib/supabaseClient';
import { getRank } from '../../data/constants';
import Button from '../ui/Button';
import styles from './UserManager.module.css';

export default function UserManager() {
  const { store, persist } = useStore();
  const { currentUser } = useAuth();
  const { notify }         = useNotification();

  const users = Object.entries(store.users);

  function handleRemove(uid) {
    if (uid === 'admin')        return notify('Cannot remove admin', 'error');
    if (uid === currentUser)    return notify('Cannot remove yourself', 'error');
    persist(s => {
      const u = { ...s.users };
      delete u[uid];
      return { ...s, users: u };
    });
    notify('User removed', 'info');
  }



  function handleResetPassword(uid) {
    if (uid === 'admin') return notify('Use the profile page to change admin password.', 'info');

    if (isSupabaseConfigured) {
      notify('Cloud mode: ask the user to use "Forgot Password" on sign in.', 'info');
      return;
    }

    const tempPassword = `quizforge-${Math.random().toString(36).slice(2, 8)}`;
    persist(s => ({
      ...s,
      users: {
        ...s.users,
        [uid]: {
          ...s.users[uid],
          password: tempPassword,
        },
      },
    }));
    notify(`Temporary password for @${uid}: ${tempPassword}`, 'success');
  }

  function handleToggleRole(uid) {
    if (uid === 'admin') return;
    persist(s => ({
      ...s,
      users: {
        ...s.users,
        [uid]: {
          ...s.users[uid],
          role: s.users[uid].role === 'admin' ? 'student' : 'admin',
        },
      },
    }));
    notify('Role updated');
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>XP / Rank</th>
              <th>Quizzes</th>
              <th>Badges</th>
              <th>Streak</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(([uid, u]) => {
              const rank = getRank(u.xp || 0);
              return (
                <tr key={uid} className={uid === currentUser ? styles.selfRow : ''}>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.avatar}>
                        {(u.displayName || uid)[0].toUpperCase()}
                      </div>
                      <div>
                        <div className={styles.displayName}>{u.displayName || uid}</div>
                        <div className={styles.username}>@{uid}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.roleTag} ${u.role === 'admin' ? styles.adminTag : styles.studentTag}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={styles.xp}>{(u.xp || 0).toLocaleString()} XP</span>
                    <span className={styles.rank}>{rank.icon} {rank.label}</span>
                  </td>
                  <td className={styles.mono}>{u.totalQuizzes || 0}</td>
                  <td className={styles.mono}>{(u.badges || []).length}</td>
                  <td className={styles.mono}>{u.streak || 0} 🔥</td>
                  <td>
                    <div className={styles.actions}>
                      {uid !== 'admin' && uid !== currentUser && (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => handleToggleRole(uid)}>
                            {u.role === 'admin' ? 'Demote' : 'Promote'}
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => handleResetPassword(uid)}>
                            Reset Password
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => handleRemove(uid)}>
                            Remove
                          </Button>
                        </>
                      )}
                      {uid === currentUser && <span className={styles.you}>You</span>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
