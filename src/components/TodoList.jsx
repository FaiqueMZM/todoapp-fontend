import React, { useEffect, useState } from "react";
import axios from "axios";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editTodoId, setEditTodoId] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    axios
      .get("http://localhost:8080/api/todos")
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) =>
        console.error("There was an error fetching todos!", error)
      );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!newTodo.title || !newTodo.description) {
      alert("Please fill in both fields!");
      return;
    }

    if (isEditing) {
      // Update existing todo (PUT request)
      axios
        .put(`http://localhost:8080/api/todos/${editTodoId}`, newTodo)
        .then(() => {
          fetchTodos(); // Refresh the todo list
          setIsEditing(false);
          setEditTodoId(null);
          setNewTodo({ title: "", description: "" }); // Clear form
        })
        .catch((error) =>
          console.error("There was an error updating the todo!", error)
        );
    } else {
      // Create new todo (POST request)
      axios
        .post("http://localhost:8080/api/todos", newTodo)
        .then((response) => {
          setTodos([...todos, response.data]);
          setNewTodo({ title: "", description: "" });
        })
        .catch((error) =>
          console.error("There was an error adding the todo!", error)
        );
    }
  };

  const handleEdit = (todo) => {
    setNewTodo({ title: todo.title, description: todo.description });
    setIsEditing(true);
    setEditTodoId(todo.id); // Set the ID of the todo being edited
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/api/todos/${id}`)
      .then(() => {
        fetchTodos(); // Refresh the todo list
      })
      .catch((error) =>
        console.error("There was an error deleting the todo!", error)
      );
  };

  return (
    <div>
      <h1>Todo List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTodo.description}
          onChange={(e) =>
            setNewTodo({ ...newTodo, description: e.target.value })
          }
        />
        <button type="submit">{isEditing ? "Update Todo" : "Add Todo"}</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <strong>{todo.title}</strong> - {todo.description}
            <button onClick={() => handleEdit(todo)}>Edit</button>
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
