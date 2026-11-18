
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import "../../styles/ManageRoles.css";

function ManageRoles() {

  const [roles, setRoles] = useState([]);

  useEffect(() => {

    // These are the roles created by the backend seedRoles.js file.
    setRoles([
      {
        id: 1,
        name: "USER",
        description: "Can view products and place orders."
      },
      {
        id: 2,
        name: "ADMIN",
        description: "Can manage products and inventory."
      },
      {
        id: 3,
        name: "SUPER ADMIN",
        description: "Can manage the complete system."
      }
    ]);

  }, []);

  return (
    <div>
      <Navbar />

      <div className="manage-roles-container">
        <h2>Manage Roles</h2>

        <h3>Available Roles</h3>

        <table>
          <thead>
            <tr>
              <th>Role Name</th>
              <th>Description</th>
            </tr>
          </thead>

          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td>{role.name}</td>
                <td>{role.description}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default ManageRoles;
