import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import Logo from "./logo.png";
//import {useNavigate} from 'react-router-dom';
import { useEffect, useState } from "react";
import image from './VERICRYPT.png';
//let [contractData, setContractData] = useState("");

export default function Login() {
  
    const [walletAddress, setWalletAddress] = useState("");
  
    useEffect(() => {
      getCurrentWalletConnected();
      addWalletListener();
    }, [walletAddress]);
    let [account , setAccount]= useState("");

    const connectWallet = async () => {
      if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
        try {
          /* MetaMask is installed */
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setWalletAddress(accounts[0]);
          localStorage.setItem("walletAddress", accounts[0]); // store the address in local storage

          console.log(accounts[0]);
         
         
          } 
        catch (err) {
          console.error(err.message);
        }
      } else {
        /* MetaMask is not installed */
        console.log("Please install MetaMask");
      }
    };
  
    const getCurrentWalletConnected = async () => {
      if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            console.log(accounts[0]);
            navigate('/dashboard', {replace: true})
          } else {
            console.log("Connect to MetaMask using the Connect button");
          }
        } catch (err) {
          console.error(err.message);
        }
      } else {
        /* MetaMask is not installed */
        console.log("Please install MetaMask");
      }
    };
  
    const addWalletListener = async () => {
      if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
        window.ethereum.on("accountsChanged", (accounts) => {
          setWalletAddress(accounts[0]);
          console.log(accounts[0]);
        });
      } else {
        /* MetaMask is not installed */
        setWalletAddress("");
        console.log("Please install MetaMask");
      }
    };
  

  //const navigate = useNavigate();
  
  //const handleClick = () => {
    // 👇️ navigate programmatically
    //navigate('/dashboard', {replace: true})
  //};
  let navigate = useNavigate();
  
  return(
    <FormContainer> 
        <img className='bg' src={image} alt='bg'/>

    <form action=''>
      <div className="brand">
      <img src={Logo} alt="Logo.png"/>
      <h1>Vericrypt</h1>
       
      </div>
      <h1>Certificate Verification System</h1>
      <button type="button" onClick= {connectWallet}>Login</button>
    </form>
    </FormContainer> 

  );

}
const FormContainer = styled.div`
height: 165vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #1e1928  ;
  .bg{
  
    height: 1200vh;
    background-position: center;
    background-size: cover;
    }
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  button {
    background-color: #893177;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #8c58ae;
    }
  }
  h1 {
    color: white;
    text-transform: capitalize;
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
