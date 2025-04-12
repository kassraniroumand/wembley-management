import { useAtom } from 'jotai';
import { authAtom } from '@/model/atoms';
import { logout } from '@/utils/authUtils';
import { useNavigate } from 'react-router-dom';

const UserAccount = () => {
  const [auth] = useAtom(authAtom);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Your Account</h1>

        <div className="space-y-4">
          <div>
            <p className="text-gray-500">Username</p>
            <p className="text-xl">{auth?.username}</p>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <p className="text-xl">{auth?.email}</p>
          </div>

          <div>
            <p className="text-gray-500">Roles</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {auth?.roles.map((role, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
