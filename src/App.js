import './App.css';
import React, {useState, useEffect, useRef} from 'react';
import Axios from 'axios'

function App() {
  const [ name, setName] = useState('')
  const [age, setAge] = useState(0)
  const [friends, setFriends] = useState([])
  const nameFocus = useRef()
  const addFriend = () => {
    Axios.post('https://mern-pedro.herokuapp.com/addfriend', {
      name, age
    }).then((response)=> {
      setFriends([...friends, { _id: response.data._id,
        name: response.data.name, age: response.data.age}])
      setName('')
      setAge(0)
    }).catch(()=> {
      alert("it didn't work")
    })
    nameFocus.current.focus()
  }
  useEffect(()=> {
    Axios.get('https://mern-pedro.herokuapp.com/read')
    .then((response)=> {
      setFriends(response.data)
    }).catch(()=> {
      console.log("error");
    })
    nameFocus.current.focus()
  }, [])
  const updateFriend = (id) => {
    const newAge = prompt("Enter new age: ")
    Axios.put('https://mern-pedro.herokuapp.com/update', {
      newAge, id
    })
    .then((response)=> {
      // const newFriends = friends.map((friend)=> {
      //   if (friend._id ===response.data._id)
      //     return {...friend, age:response.data.age}
      //   return friend
      // })
      setFriends(friends.map((friend)=> {
        return (friend._id === id)? {...friend, age:newAge} : friend
      }))
    })
      .catch(()=> {
      alert("it didn't work")
    })
    nameFocus.current.focus()
  }
  const deleteFriend =(id)=> {
    Axios.delete(`https://mern-pedro.herokuapp.com/delete/${id}`)
    .then(()=>{
      setFriends(friends.filter((friend)=> friend._id !== id))
    }) 
    .catch(()=> {
      alert("it didn't work")
    })
    nameFocus.current.focus()
  }
  return <div className='App'>
    <div className= 'inputs'>
      {/* <form onSubmit={addFriend}> */}
        Name:
      <input type='text' placeholder= 'Friend name...' ref={nameFocus}
      onChange={(event)=> setName(event.target.value)} value={name}/>
      Age:
      <input type='number' placeholder= 'Friend age...' 
      onChange={(event)=> setAge(event.target.value)} value={age}/>
      <button onClick={addFriend}>Add a friend</button>
      {/* </form> */}
    </div>
    <div className="friends">
      {friends.map((friend)=> {
        const {_id, name, age} = friend
        return (
          <div className='friendContainer' key={_id}> 
            <div className='friend'>
              <h3>Name: {name}</h3>
              <h3>Age: {age}</h3>
            </div>
            <button onClick={()=> updateFriend(_id)}>Update</button>
            <button id='removeBtn' onClick={()=> deleteFriend(_id)}>
              X</button>
          </div>
        )
      })}
    </div>
  </div>
}

export default App;
