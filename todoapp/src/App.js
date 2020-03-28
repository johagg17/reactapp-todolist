import React, { useState, useEffect } from 'react'
import './App.css'
import firebase from './firebase'

/* Destructing props:
    instead of function(props) we can use function({fName, lName, age})
*/

/* function todo that takes in props but destructed
  it returns an div element which inludes the given row(number) and the text for the todo
*/

function Todo({ todo, index, completeTodo, removeTodo }) { // (props) = {todo, index, completeTodo, removeTodo}
  return (
    <div style={{ textDecoration: todo.isCompleted ? 'line-through' : 'none' }} className="todo">
      {index + 1}{' '}{todo.text}
      <div>
        <button onClick={() => completeTodo(index)}>Completed</button>
        <button onClick={() => removeTodo(index)}>x</button>
      </div>
    </div>
  )
}

function TodoForm({ addTodo }) { // props = {addTodo}
  const [value, setValue] = useState('');
  function handleSubmit(e) {
    e.preventDefault();
    if (!value) return; // Just pressing enter without any text
    addTodo(value);
    setValue('');
  }
  function change(e) {
    setValue(e.target.value); // e.target returns the value which got triggerd setValue is the function for setting value
  }
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" className="input" value={value} placeholder="Add Todo..." onChange={change} />
    </form>
  )
}
function App() {
  const [todos, setTodos] = useState([]);
  useEffect(()=>{
    const unsubcribe = firebase
    .firestore()
    .collection('time')
    .onSnapshot((snapshot) =>{
      const newTimes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setTodos(newTimes);
    });
    return () => unsubcribe()
  },[]);
  function addTodo(text) {
    const newvalue = {
      id: todos.length + 1,
      text: text,
      isCompleted: false
    };
    const unsubcribe = firebase
    .firestore()
    .collection('time').doc(newvalue.id + "")
    .set(newvalue);
    const newTodolist = [...todos, newvalue];
    setTodos(newTodolist);
    return () => unsubcribe();
  }

  function completeTodo(index) {
    const newTodos = [...todos];
    const unsubcribe = firebase
    .firestore()
    .collection('time')
    .doc(newTodos[index].id + "").update({isCompleted:true});
    newTodos[index].isCompleted = true;
    setTodos(newTodos);
  }

  function removeTodo(index) {
    const newTodos = [...todos];
    const removed = newTodos.splice(index, 1);
    console.log(removed[0].id);
    const unsubcribe = firebase
    .firestore()
    .collection('time')
    .doc(removed[0].id +"").delete();
    setTodos(newTodos);
    return () => unsubcribe(); 
  }

  return (
    <div className="app">
      <div className="todo-list">
        {todos.map((todo, index) => (
          <Todo index={index} todo={todo} completeTodo={completeTodo} removeTodo={removeTodo} />
        ))}
        <TodoForm addTodo={addTodo} />

      </div>
    </div>
  )
}

export default App;
