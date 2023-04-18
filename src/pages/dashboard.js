import {React} from 'react';
import styled from "styled-components";
import Logo from "./logo.png";
import { ethers } from "ethers";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Certification from './Certification.json'
import image from './VERICRYPT.png';
import image1 from './image1.jpeg';
export default function Login() {

  

  let navigate = useNavigate();
  return(
    
<>    
<FormContainer> 
  {/* <img className='bg' src={image} alt='bg'/> */}
    <form action=''>
      <div className="brand">
      <img src={Logo} alt="Logo.png"/>
        <h1>Vericrypt</h1>
      </div>
      <center>
        <h2>What you want to Generate?</h2>
      <button type="submit" onClick={() => {navigate('/register')}} >Certificate</button>
      <br/>
      <br/>
      <button type="submit" onClick={() => {navigate('/marksheet')}}>Marksheet</button>
      </center>
    </form>
    </FormContainer> 
</>
  );

}
const FormContainer = styled.div`
height: 170vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #1e1928  ;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.1)),
  url(${image1});
height: 100vh;
background-position: center;
background-size: cover;
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
  h2 {
    color: white;
    text-transform: uppercase;
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
