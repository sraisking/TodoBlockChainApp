import React, {useState, useEffect } from 'react';
import {TextField , Button } from '@mui/material';
import Todo from './Todo';
import './App.css';

import { TodoContractAddress } from './config.js';
import {ethers} from 'ethers';
import TodoAbi from './utils/TodoContract.json'


function App() {
  const [tasks,setTasks]=useState([]);
  const [input, setInput]=useState('');
  const [currentAccount, setCurrentAccount] = useState('');
  const [correctNetwork, setCorrectNetwork] = useState(false);
  
  const getAllTodos = async() => {
  try {
    const {ethereum} = window

    if(ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const TaskContract = new ethers.Contract(
        TodoContractAddress,
        TodoAbi.abi,
        signer
      )

      let allTasks = await TaskContract.getMyTodos();
      setTasks(allTasks);
    } else {
      console.log("Ethereum object doesn't exist");
    }
  } catch(error) {
    console.log(error);
  }
}
  
  useEffect(() => {
      getAllTodos()
    },[]);
    
    // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log('Metamask not detected')
        return
      }
      let chainId = await ethereum.request({ method: 'eth_chainId'})
      console.log('Connected to chain:' + chainId)

      const goerliChainId = '0x5'

      if (chainId !== goerliChainId) {
        alert('You are not connected to the Guerli Testnet!')
        return
      } else {
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      console.log('Found account', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log('Error connecting to metamask', error)
    }
  }  
    
  const addTodo= async (e)=>{
    e.preventDefault();

    let task = {
      'desc': input,
      'isDeleted': false
    };

    try {
      const {ethereum} = window

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TodoContractAddress,
          TodoAbi.abi,
          signer
        )

        TaskContract.addTodo(task.desc, task.isDeleted)
        .then(response => {
          setTasks([...tasks, task]);
          console.log("Completed Task");
        })
        .catch(err => {
          console.log("Error occured while adding a new task");
        });
        ;
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch(error) {
      console.log("Error submitting new Tweet", error);
    }

    setInput('')
  };
  
  const deletTodo = key => async() => {
    console.log(key);

    // Now we got the key, let's delete our tweet
    try {
      const {ethereum} = window

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TodoContractAddress,
          TodoAbi.abi,
          signer
        )

        let deletTodoTx = await TaskContract.deletTodo(key, true);
        let allTasks = await TaskContract.getMyTodos();
        setTasks(allTasks);
      } else {
        console.log("Ethereum object doesn't exist");
      }

    } catch(error) {
      console.log(error);
    }
  }

  return (
    <div>
{currentAccount === '' ? (
  <button
  className='text-2xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
  onClick={connectWallet}
  >
  Connect Wallet
  </button>
  ) : correctNetwork ? (
    <div className="App">
      <h2> ToDo App</h2>
      <form>
         <TextField id="outlined-basic" label="Make Todo" variant="outlined" style={{margin:"0px 5px"}} size="small" value={input}
         onChange={e=>setInput(e.target.value)} />
        <Button variant="contained" color="primary" onClick={addTodo}  >Add Task</Button>
      </form>
      <ul>
          {tasks.map(item=> 
            <Todo 
              key={item.id} 
              taskText={item.desc} 
              onClick={deletTodo(item.id)}
            />)
          }
      </ul>
    </div>
  ) : (
  <div className='flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3'>
  <div>----------------------------------------</div>
  <div>Please connect to the Guerli Testnet</div>
  <div>and reload the page</div>
  <div>----------------------------------------</div>
  </div>
)}
</div>
  );
}

export default App;
