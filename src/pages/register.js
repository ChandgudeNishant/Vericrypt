import React from 'react';
import styled from "styled-components";
//import Logo from './logo.jpg';
import Logo from "./logo.png";
import { ethers } from "ethers";
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Certification from './Certification.json'
import {connectWallet} from './login';
import image from './VERICRYPT.png';
import image1 from './image1.jpeg';

 function Dashboard() {
  let navigate = useNavigate();
  const [gotError, setGotError] = useState('');
  const [gotError1, setGotError1] = useState('');

  const [ownerRight, setOwnerRight] = useState('');
const owner = '0x15279489697176dA1E5f0B0d15f376f1b22fD9aC'
  const [walletAddress, setWalletAddress] = useState("");
  const [certificateId, setCertificateId] = useState('');
  const [certificateData, setCertificateData] = useState({});
  const contractAddress = '0xa46ea385B908b6D232Ebf94cc0Fef9ceBdC771a6';
  //const privateKey = process.env.REACT_APP_PRIVATE_KEY;
  const providerUrl = process.env.REACT_APP_PROVIDER_URL;

      const accounts =  window.ethereum.request({ method: 'eth_requestAccounts' });

      // Create Web3Provider instance
      const provider = new ethers.providers.Web3Provider(window.ethereum);
  
      // Create Signer instance
      const signer = provider.getSigner(accounts[0]);
  
      // Create contract instance
      const contract = new ethers.Contract(contractAddress, Certification.abi, signer);
  
  //const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  //const signer = provider.getSigner();
  //const wallet = new ethers.Wallet(privateKey, provider);

  //const contract = new ethers.Contract(contractAddress, Certification.abi, wallet);
 

  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');

  useEffect(() => {
    async function getAccountInfo() {
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Connect to MetaMask
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          // Create provider and signer objects
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();

          // Get account address
          const address = await signer.getAddress();
          setAddress(address);

          // Get account balance
          const balanceWei = await signer.getBalance();
          const balanceEth = ethers.utils.formatEther(balanceWei);
          setBalance(balanceEth);
        } catch (err) {
          console.error(err);
        }
      } else {
        console.log('MetaMask not detected');
      }
    }

    getAccountInfo();
  }, []);
  // async function accountData(){
  //   const address = await signer.getAddress();
  //   console.log('Account Address:', address);
  //   const balanceWei = await signer.getBalance();
  //   const balanceEth = ethers.utils.formatEther(balanceWei);
  //   console.log('Account Balance:', balanceEth, 'Matic');
  // }
  // accountData();
  const generateCertificate = async () => {
    try {
   if(address == owner){
    
  let CertificateId = document.querySelector("#CertificateId").value;
  let NameOfStudent = document.querySelector("#NameOfStudent").value;
  let NameOfOrg = document.querySelector("#NameOfOrg").value;
  let NameOfCourse = document.querySelector("#NameOfCourse").value;
  let BatchYear = document.querySelector("#BatchYear").value;

      const tx = await contract.generateCertificate(
        CertificateId,
        NameOfStudent,
        NameOfOrg,
        NameOfCourse,
        BatchYear
      );
      await tx.wait();
      setGotError('');
      setOwnerRight('');
      console.log('Certificate generated!');
      alert("Certificate generated!");
   }else{
    console.log("You are not the Admin");
    setOwnerRight(`You don't have Admin Rights`);
   }
    } catch (error) {
      console.log('Error generating certificate:', error);
      setGotError(`"Error" Please check the Book ID and for more info check console`);

    }
  };


const getData = async () => {
  
    try {
      
  let CertificateId1 = document.querySelector("#CertificateId1").value;
       const data = await contract.getData(CertificateId1);
      setCertificateData({
        
        candidateName: data[0],
        orgName: data[1],
        courseName: data[2],
        batchYear: data[3].toString(),
      });
      //console.log(data);
setGotError1('');
    } catch (error) {
      console.log('Error getting certificate data:', error);
      setGotError1(`"Error" Please enter valid ID and for more info check console`);

    }
  };




  return(
    <FormContainer> 
  {/* <img className='bg' src={image} alt='bg'/> */}

      <div className='forms'>
    <form action=''>
      <div className="brand">
      <img src={Logo} alt="Sanjivani.png"/>
        <h1>Vericrypt</h1>

        <p><span>Account Address:</span> <p className='under'>{address}</p></p>
        <p><span>Account Balance:</span> <p className='under'> {balance}</p> <span>Matic</span></p>   
         </div>
      <label>Certificate ID</label>
      <input type="text" id = "CertificateId"
        placeholder="Certificate ID" name="Certificate ID" required/>
      <label>Name of Student</label>
      <input type="text" id='NameOfStudent' placeholder="Name of Student"
        name="Name of Student" required/>
      <label>Name of Organization</label>
      <input type="text" id='NameOfOrg'
        placeholder="Name of Organization"  name="COrganization Name" required/>
    <label>Name of Course</label>
      <input type="text" id='NameOfCourse'
        placeholder="Name of Course" name="Course Name" required/>
      <label>Batch Year</label>
      <input type="text" id='BatchYear'
        placeholder="Batch Year"  name="Batch Year" required/>
       
    </form>
     <p>{gotError}</p>
     <p>{ownerRight}</p>

    <button className="button1" type="submit" onClick={generateCertificate}> register</button>
        </div>
      
      <button className='button2' onClick={() => {navigate('/down')}}> Generate Certificate</button>
    
      <div className='data1'>
        <button className="button" onClick={getData}>Verify Certificate Data</button>
        <label>Certificate ID</label>
      <input type="text" id = "CertificateId1" placeholder="Certificate ID" name="Certificate ID" required/>
      <h4>{gotError1}</h4>

          <h2>Certificate Credential:</h2>
          <p>Candidate Name: <span className='data'>{certificateData.candidateName}</span></p>
          <p>Organization Name: <span className='data'>{certificateData.orgName}</span></p>
          <p>Course Name: <span className='data'>{certificateData.courseName}</span></p>
          <p>Batch Year: <span className='data'>{certificateData.batchYear}</span></p>
      </div>
    </FormContainer> 

  );

}
const FormContainer = styled.div`
height: auto;
  width: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #1e1928  ;
  
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
    .under{
      color:grey;
      text-decoration: underline;
    }
    p {
   
      color: white;
      text-transform: uppercase;
    }



  }
  .data1{  
    margin-top:50px;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
    border: 0.1rem solid #5a2651
    ;

    h2 {
      color: white;
      text-transform: capitalize;
    }
    p{
      color: white;
      border: 0.1rem solid #5a2651
      ;
      border-radius: 0.4rem;
      padding: 1rem;
     }
    }
  
  .button{
    margin-right: 10px;
    margin-left: 10px;
  }

  form {
    height: 100vh;
    display: flex;
    justify-items: center;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }

  .forms {
    position: relative;
    align-items: center;
    p{
      color: white;
      
      text-transform: capitalize;
      align-items: center;
  
     }
  }

  .button1{
    position: absolute;
    bottom: 2rem;
    left: 15rem;
    margin-bottom: 2rem;
  }
  
 
  h3{
    color: white;
      text-transform: uppercase;
  }
  label{
    color: white;
      text-transform: uppercase;
  }
  h4{
    color: white;
  }

  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #5a2651
    ;
    border-radius: 0.4rem;
    color: white;
    width: 60%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #5a2651
      ;
      outline: none;
    }
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
    text-transform: capitalize;
    &:hover {
      background-color: #8c58ae;
    }
    
  }.button2{
     margin-top:50px;
      align-items: center;

    }
  .data {
    text-decoration: underline;

    font-weight:bold;
    
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
  span{
    font-weight:bold;

  }


`;
export default Dashboard;
export async function getData(){};