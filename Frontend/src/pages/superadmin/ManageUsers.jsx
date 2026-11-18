
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import Navbar from "../../components/Navbar";
import "../../styles/ManageUsers.css";

function ManageUsers() {

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const data = await api.get("/users");

      setUsers(data.users || []);

    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {

    try {
      await api.put(`/users/${id}/role`, { roleName: newRole });

      fetchUsers();

    } catch (error) {
      alert(error.message);
      fetchUsers();
    }
  };

  return (
    <div>
      <Navbar />

      <div className="manage-users-container">
        <h2>Manage Users</h2>

        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Current Role</th>
              <th>Change Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role?.name || user.role}</td>

                <td>
                  <select
                    value={user.role?.name || user.role}
                    onChange={(event) =>
                      handleRoleChange(user._id, event.target.value)
                    }
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER ADMIN">SUPER ADMIN</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageUsers;
