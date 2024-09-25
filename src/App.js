import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { io } from "socket.io-client"

// Components
import Navigation from './components/Navigation'
import Servers from './components/Servers'
import Channels from './components/Channels'
import Messages from './components/Messages'

// ABIs
import Dappcord from './abis/Echo.json'

// Config
import config from './config.json';

// Socket
const socket = io('ws://localhost:3030');

function App() {

  const [account,setAccount] = useState(null)

  async function loadBlockchainData() {
    window.ethereum.on('accountsChanged', async () => {
      window.location.reload()
    })
  }

  useEffect(()=>{
    loadBlockchainData()
    document.title = 'Your Voice, Your Echo!';
  }, [])
  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <main>
      </main>
    </div>
  );
}

export default App;
