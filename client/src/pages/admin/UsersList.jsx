import { useState, useEffect } from 'react';
import { HiOutlineShieldCheck, HiOutlineBan } from 'react-icons/hi';
import Skeleton from '../../components/ui/Skeleton';
import { getAllUsersAPI, updateUserRoleAPI, toggleBlockUserAPI } from '../../store/api';
import toast from 'react-hot-toast';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try { const res = await getAllUsersAPI({ page, limit: 15 }); setUsers(res.data.users); setTotalPages(res.data.totalPages); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const handleRoleChange = async (id, role) => {
    try { await updateUserRoleAPI(id, { role }); toast.success('Role updated'); fetchUsers(); }
    catch (err) { toast.error('Failed'); }
  };

  const handleBlock = async (id) => {
    try { await toggleBlockUserAPI(id); toast.success('Status updated'); fetchUsers(); }
    catch (err) { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-navy-900">
              <tr>{['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? Array.from({length:5}).map((_,i) => <tr key={i}><td colSpan={6} className="p-4"><Skeleton className="h-10 w-full" /></td></tr>)
              : users.map(user => (
                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-navy-900/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">{user.name[0]?.toUpperCase()}</div>
                      <span className="font-medium text-sm">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">{user.email}</td>
                  <td className="px-4 py-3"><span className={`badge ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' : 'badge-info'}`}>{user.role}</span></td>
                  <td className="px-4 py-3"><span className={`badge ${user.isBlocked ? 'badge-error' : 'badge-success'}`}>{user.isBlocked ? 'Blocked' : 'Active'}</span></td>
                  <td className="px-4 py-3 text-xs text-[var(--color-text-secondary)]">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <select value={user.role} onChange={e => handleRoleChange(user._id, e.target.value)} className="text-xs border rounded-lg px-2 py-1 bg-transparent">
                        <option value="user">User</option><option value="admin">Admin</option>
                      </select>
                      <button onClick={() => handleBlock(user._id)} className={`p-2 rounded-lg text-sm ${user.isBlocked ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20' : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'}`} title={user.isBlocked ? 'Unblock' : 'Block'}>
                        {user.isBlocked ? <HiOutlineShieldCheck className="w-4 h-4" /> : <HiOutlineBan className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {totalPages > 1 && <div className="flex justify-center gap-2">{Array.from({length:totalPages},(_,i)=>i+1).map(p => <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 rounded-xl text-sm font-medium ${page === p ? 'bg-primary-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-navy-900'}`}>{p}</button>)}</div>}
    </div>
  );
};

export default UsersList;
