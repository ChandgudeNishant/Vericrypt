import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FaWallet, FaShieldAlt } from "react-icons/fa";
import Logo from "./images/logo.png";
import {
  connectWallet,
  getCurrentWalletConnected,
  addWalletListener,
} from "../utils/ethereum";
import {
  PageContainer,
  GlassCard,
  GlassButton,
  Title,
  SubTitle,
} from "../components/common/GlassComponents";

export default function Login() {
  const [isConnecting, setIsConnecting] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    const initWallet = async () => {
      const address = await getCurrentWalletConnected();
      if (address) {
        navigate("/dashboard", { replace: true });
      }
    };
    initWallet();

    addWalletListener((address) => {
      if (address) navigate("/dashboard", { replace: true });
    });
  }, [navigate]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const address = await connectWallet();
      if (address) {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Connection failed", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <GlassCard>
          <BrandSection>
            <LogoWrapper>
              {Logo ? (
                <img src={Logo} alt="Vericrypt Logo" />
              ) : (
                <FaShieldAlt size={50} color="#00d2ff" />
              )}
            </LogoWrapper>
            <Title>Vericrypt</Title>
            <SubTitle>Secure Certificate Verification System</SubTitle>
          </BrandSection>

          <ActionSection>
            <GlassButton
              onClick={handleConnect}
              disabled={isConnecting}
              fullWidth
            >
              <FaWallet className="icon" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </GlassButton>
            <MetaMaskHint>Ensure you have MetaMask installed</MetaMaskHint>
          </ActionSection>
        </GlassCard>
      </ContentWrapper>
    </PageContainer>
  );
}

const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
`;

const ContentWrapper = styled.div`
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const BrandSection = styled.div`
  margin-bottom: 3rem;
  animation: ${float} 6s ease-in-out infinite;
`;

const LogoWrapper = styled.div`
  margin-bottom: 1rem;
  img {
    height: 80px;
    filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.1));
  }
`;

const ActionSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const MetaMaskHint = styled.span`
  font-size: 0.85rem;
  color: var(--text-secondary);
  opacity: 0.8;
`;
