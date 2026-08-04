import { useEffect, useState } from "react";
import './App.css';

function App() {
  const [users, setUsers] = useState<{ id: number; name: string; email: string; votes: number; role: string }[]>([]);
  const [name, setName] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<{ id: number; name: string; email: string; votes: number; role: string } | null>(null);
  const [error, setError] = useState("");


  const deleteUser = async (id: number) => {
    if(id === selectedUser?.id){
      setSelectedUser(null);
    }

    try{
      await fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
      });

      // refresh list
      const response = await fetch("http://localhost:3000/users");
      const data = await response.json();
      setUsers(data);

    }catch(error){
      console.error("Error deleting user:", error);
    }
  };
  
  const addUser = async () => {
    const trimmedName = name.trim();
    
    if(users.find(u => u.name.toLowerCase() === trimmedName.toLowerCase())){
      // alert("User already exists!");
      setError("User already exists!");
      return;
    }

      setError(""); // Clear any previous error message
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
        const response = await fetch("http://localhost:3000/users");  //resets data on restarting server
        const data = await response.json();
        setUsers(data);

        // setUsers([...users, { id: users.length + 1, name }]);
        // setName(""); //resets data on refresh

      }catch(error){
        console.error("Error adding user:", error);
      }
  }

  
  useEffect(() => {
    const remErrors = async () => {
      setError("");
    };
    remErrors();
  }, [name]);
  
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
    <div className="App">
      <div className="userList">
        <h1>Users</h1>
        
        <div className="userListContent">
          {users.map(user => (
            <div className={`userItem ${selectedUser?.id === user.id ? "selectedUser" : ""}`}
              key={user.id} onClick={() => selectedUser === user ? setSelectedUser(null) : setSelectedUser(user)
            }>
              <span className="userText">{user.name}</span>   <button className="deleteButton" onClick={(e) => {
                e.stopPropagation();
                deleteUser(user.id);
              }}>Delete</button>
            </div>
          ))}
        </div>
      </div>

        <div className="rightPanel">

          <div className="addUserForm">

            <h1>Add User</h1>

            <form className="addUserInput" onSubmit={(e) => {
              e.preventDefault();
              addUser();
              }}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
              />

              {/* <div className="addUserButton"> */}
                <button type="submit" disabled={!name.trim()}>
                  Add User
                </button>
              {/* </div> */}
            </form>
              {error && <p className="error">{error}</p>}

          </div>

          <div className="userDetails">

            <h1>User Details</h1>

            <div >
              {selectedUser ? (
                <div>
                  <p><strong>Name:</strong> {selectedUser.name}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Votes:</strong> {selectedUser.votes}</p>
                  <p><strong>Role:</strong> {selectedUser.role}</p>
                </div>
              ):(
                <p>Select a user to see details</p>
              )}
            </div>

          </div>

        </div>
    </div>
  );
}

export default App;