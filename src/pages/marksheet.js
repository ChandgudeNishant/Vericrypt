import React from 'react';
import styled from "styled-components";
import Logo from './logo.png'


export default function Marksheet() {


  
  
  
  
  
  
  
  
  return (
<FormContainer>
<img src={Logo} alt="Logo.png"/>

<h1>Vericrypt</h1>
 <div className='head'>Coming soon...✌️ </div>
 
 </FormContainer>
  );
}
const FormContainer = styled.div`
height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #1e1928  ;
  .head{
    color: white;
    font-weight:bold;
    font-size: calc(30px + 2vmin);

    text-transform: uppercase;
  }
  img {
    height: 10rem;
  }
  h1 {
    color: white;
    text-transform: uppercase;
    font-size: calc(20px + 2vmin);
  }

  `;