import React, {useState} from 'react'
import './App.css'
//import firebase from './firebase'
/* Destructing props:
    instead of function(props) we can use function({fName, lName, age})

*/
/* function todo that takes in props but destructed
  it returns an div element which inludes the given row(number) and the text for the todo
*/

function Todo({todo, index, completeTodo, removeTodo}){
  return(
  <div style={{textDecoration: todo.isCompleted ? 'line-through': 'none'}} className = "todo">
  {index+1}{' '}{todo.text}
    <div>
      <input type = "checkbox" onChange = {() => completeTodo(index)}></input>
      <button onClick = {() => removeTodo(index)}>x</button>
    </div>
  </div>
  )
}

function TodoForm({addTodo}){
  const [value, setValue] = useState('');
  function handleSubmit (e) {
    e.preventDefault();
    if(!value) return; // Just pressing enter without any text
    addTodo(value);
    setValue('');
  }
  function change(e){
    setValue(e.target.value); // e.target returns the value which got triggerd setValue is the function for setting value
  }
  return (
    <form onSubmit = {handleSubmit}>
      <input type = "text" className= "input" value = {value} placeholder="Add Todo..." onChange = {change}/>
    </form>
  )
}
function App() {
  const [todos, setTodos] = useState([]);
  function addTodo(text){
    const newvalue = {
      text: text,
      isCompleted: false
    };
    const newTodolist = [...todos, newvalue];
    setTodos(newTodolist);
  }
  function completeTodo(index){
    const newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
  }
  function removeTodo(index){
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  }
  return(
    <div className = "app">
      <div className = "todo-list">
        {todos.map((todo, index) => (
          <Todo index = {index}  todo = {todo} completeTodo = {completeTodo} removeTodo = {removeTodo}/>
        ))}
        <TodoForm addTodo = {addTodo}/>

      </div>
    </div>
  )
}

export default App;
