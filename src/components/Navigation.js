import { ethers } from 'ethers'
import logo from '../assets/logo.png'

const Navigation = ({ account, setAccount }) => {
  async function connectHandler(){
    const accounts = await window.ethereum.request({method : 'eth_requestAccounts'})
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)
  }

  return (
    <nav>
      <img src={logo} className="navbar-logo" height='90' width='90' alt='ECHO'/>

      {account ? (
        <button type="button" className="nav__connect navbar-button">{account.slice(0,6)+"..."+account.slice(38,42)}</button> 
      ) : (
        <button type="button" className="nav__connect navbar-button" onClick={connectHandler}>Connect</button> 
      )}
    </nav>
  );
}

export default Navigation;