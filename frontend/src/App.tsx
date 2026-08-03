import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [name, setName] = useState<string>("");

  

  const addUser = async () => {
    try{
      await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      setName("");

      // refresh list
      const response = await fetch("http://localhost:3000/users");
      const data = await response.json();
      setUsers(data);

      // setUsers([...users, { id: users.length + 1, name }]);
      // setName("");

    }catch(error){
      console.error("Error adding user:", error);
    }
  }

  useEffect(() => {

   const fetchUsers = async () => {
    try{
      const response = await fetch("http://localhost:3000/users");
      const data = await response.json();
      setUsers(data);
    }catch(error){
      console.error("Error fetching users:", error);
    }
  };
  fetchUsers();

  }, []);

  return (
    <>
      <h1>Users</h1>

      {users.map(user => (
        <div key={user.id}>
          {user.name}
        </div>
      ))}

       <div>
          <h1>Add User</h1>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
          />

          <button onClick={addUser}>
            Add User
          </button>
        </div>
    </>
  );
}

export default App;