import React from "react";
import "./Style.css";
import InputTodo from "./InputTodo";
import ShowTodo from "./ShowTodo";


export default function TodoHandle() {
    const [loading, setLoading] = React.useState(false);
    const [Todolist, setTodolist] = React.useState([]);
    const [Error, setError] = React.useState(false);

    React.useEffect(() => {
        setLoading(true);
        fetchAndUpdateData();
    }, []);

    const fetchAndUpdateData = () => {
        // https://fakestoreapi.com/products
        setLoading(true)
        fetch("http://localhost:4000/Todos")
            .then((res) => res.json())
            .then((res) => {
                //  console.log(res);
                setTodolist(res)
            })
            .catch((err) => setError(err))
            .finally(() => {
                setLoading(false);
            });
    }

    const postData = (payload) => {
        fetch("http://localhost:4000/Todos", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            }
        }).then(() => {
            fetchAndUpdateData();
        })
    }

    const addTodo = (todo) => {
        let payload = {
            title: todo,
            status: false
        }
        postData(payload)
    }

    const handleUpdate = (id) => {
        let selectedTodo = Todolist.filter((ele) => ele.id === id);
        selectedTodo[0].status = (!selectedTodo[0].status);
        let updated = selectedTodo[0];
        //  console.log(updated);
        fetch(`http://localhost:4000/Todos/${id}`, {
            method: "PATCH",
            body: JSON.stringify(updated),
            headers: {
                "Content-Type": "application/json",
            }
        }).then(() => {
            fetchAndUpdateData();
        });

    }

    const handleDelete = (id) => {
        // setLoading(true);
        fetch(`http://localhost:4000/Todos/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(() => {
            fetchAndUpdateData();
        });
    }

    return (
        <div>
            <InputTodo addTodo={addTodo} />
            <hr />
            {loading ? (<h1 className="center">Loading...</h1>)
                : Error ?
                    (<h2 className="red">Error occured : Something went wrong </h2>)
                    : (
                        <div>
                            <h1 className="center">Todo List</h1>
                            {Todolist.map((todo) => {
                                //        <ShowTodo
                                //        key={todo.id}
                                //        {...todo}
                                //        handleDelete={handleDelete}
                                //    />    

                                return <div className="TodoRow" key={todo.id}>
                                    <p>{todo.title}</p>
                                    {todo.status ? <p className="green">Completed</p> : <p className="red">Pending</p>}
                                    <button onClick={() => handleUpdate(todo.id)}>Update</button>
                                    <button onClick={() => handleDelete(todo.id)}>Delete</button>
                                </div>
                            })}
                        </div>)
            }
        </div>
    );
}