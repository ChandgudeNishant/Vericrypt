import React, { useState } from "react";
import styled from "styled-components";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import Certification from "./smart-contract-abi/Certification.json";

import {
  FaSearch,
  FaFileContract,
  FaUserGraduate,
  FaBuilding,
  FaBook,
  FaCalendarAlt,
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import { getProviderAndSigner } from "../utils/ethereum";
import {
  PageContainer,
  GlassCard,
  GlassInput,
  GlassInputGroup,
  GlassButton,
  BackButton,
} from "../components/common/GlassComponents";

import DashboardHeader from "../components/common/DashboardHeader";
import polygonIcon from "./images/image.png";

function Dashboard() {
  let navigate = useNavigate();
  const [gotError, setGotError] = useState("");
  const [gotError1, setGotError1] = useState("");
  const [ownerRight, setOwnerRight] = useState("");

  // Hardcoded for now, but ideally env var
  const owner = "0xEc3d549d355f2c1daab12C8D519EA170Cf086Ffe"; // Vericrypt-Admin-Polygon-Amoy-Testnet wallet address
  const contractAddress = "0x21f994799C737f9516daDB69DB3cD3e61DA8Ee77"; // Vericrypt-Admin-Polygon-Amoy-Testnet contract address

  const [certificateData, setCertificateData] = useState({});

  // Form State for validation
  const [certId, setCertId] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [showIdChecks, setShowIdChecks] = useState(false);
  const [showBatchChecks, setShowBatchChecks] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdCertId, setCreatedCertId] = useState("");

  // Validation Check Functions
  const isIdLengthValid = certId.length > 5;
  // Check if starts with exactly 3 alphabets
  const isIdAlphasValid = /^[a-zA-Z]{3}/.test(certId);
  // Check if the rest (after first 3) are numbers.
  // We can just check the whole string pattern: ^[a-zA-Z]{3}[0-9]+$
  // But to keep separate checks for the UI checklist:
  // "Remaining characters should be numbers" implies we check characters from index 3 onwards
  const isIdNumbersValid =
    /^[0-9]+$/.test(certId.slice(3)) && certId.length > 3;

  const isBatchValid = /^\d{4}$/.test(batchYear);

  const generateCertificate = async (e) => {
    e.preventDefault();
    try {
      const { signer } = await getProviderAndSigner();
      if (signer) {
        const contract = new ethers.Contract(
          contractAddress,
          Certification.abi,
          signer,
        );

        const currentAddress = await signer.getAddress();

        if (currentAddress === owner) {
          let CertificateId = certId; // Use state
          let NameOfStudent = document.getElementById("NameOfStudent").value;
          let NameOfOrg = document.getElementById("NameOfOrg").value;
          let NameOfCourse = document.getElementById("NameOfCourse").value;
          let BatchYear = batchYear; // Use state

          // Validation Logic (using the computed checks)
          if (!isIdLengthValid || !isIdAlphasValid || !isIdNumbersValid) {
            let errorDetails = [];
            if (!isIdLengthValid) errorDetails.push("ID length > 5");
            if (!isIdAlphasValid)
              errorDetails.push("First 3 chars must be alphabets");
            if (!isIdNumbersValid)
              errorDetails.push("Ending chars must be numbers");

            setGotError(`Invalid Certificate ID: ${errorDetails.join(", ")}`);
            return;
          }

          if (!isBatchValid) {
            setGotError("Batch Year must be exactly 4 digits.");
            return;
          }

          const tx = await contract.generateCertificate(
            CertificateId,
            NameOfStudent,
            NameOfOrg,
            NameOfCourse,
            BatchYear,
          );
          await tx.wait();
          setGotError("");
          setOwnerRight("");
          // alert("Certificate generated successfully!");
          setCreatedCertId(CertificateId);
          setShowSuccessModal(true);
        } else {
          setOwnerRight(
            `Access Denied: Admin Rights Required, Login with Admin Wallet: ${owner}`,
          );
        }
      }
    } catch (error) {
      console.error(error);
      // Extract detailed error reason if available
      const reason =
        error.reason || error.data?.message || error.message || "Unknown Error";
      // Simplify common errors
      let displayError = reason;
      if (reason.includes("user rejected")) {
        displayError = "Transaction rejected by user.";
      } else if (reason.includes("Certificate with this ID already exists")) {
        displayError = "Error: Certificate ID already exists!";
      } else {
        // Truncate very long error messages
        displayError =
          displayError.length > 100
            ? displayError.substring(0, 100) + "..."
            : displayError;
      }

      setGotError(`Transaction Failed: ${displayError}`);
    }
  };

  const getData = async () => {
    try {
      const { signer } = await getProviderAndSigner();
      if (signer) {
        const contract = new ethers.Contract(
          contractAddress,
          Certification.abi,
          signer,
        );

        let CertificateId1 = document.getElementById("CertificateId1").value;
        const data = await contract.getData(CertificateId1);
        console.log(data[4].toString());
        setCertificateData({
          candidateName: data[0],
          orgName: data[1],
          courseName: data[2],
          batchYear: data[3].toString(),
          blockNumber: data[4].toString(),
        });
        setGotError1("");
      }
    } catch (error) {
      console.error(error);
      setGotError1(`Certificate not found or invalid ID.`);
    }
  };

  return (
    <PageContainer>
      <DashboardHeader />

      <MainGrid>
        <BackButton
          onClick={() => navigate("/dashboard")}
          style={{
            gridColumn: "1 / -1",
            marginBottom: "1rem",
            width: "fit-content",
          }}
        >
          <FaArrowLeft /> Back
        </BackButton>

        {/* Generation Section */}
        <GlassCard maxWidth="100%">
          <SectionTitle>Generate Certificate</SectionTitle>
          <Form onSubmit={generateCertificate}>
            <GlassInputGroup>
              <FaFileContract className="icon" />
              <GlassInput
                type="text"
                id="CertificateId"
                placeholder="Certificate ID"
                required
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                onFocus={() => setShowIdChecks(true)}
              />
            </GlassInputGroup>
            {showIdChecks && (
              <ValidationContainer>
                <ValidationItem isValid={isIdLengthValid}>
                  {isIdLengthValid ? <FaCheck /> : <FaTimes />} More than 5
                  characters (e.g. ABC123)
                </ValidationItem>
                <ValidationItem isValid={isIdAlphasValid}>
                  {isIdAlphasValid ? <FaCheck /> : <FaTimes />} First 3
                  characters should be alphabets
                </ValidationItem>
                <ValidationItem isValid={isIdNumbersValid}>
                  {isIdNumbersValid ? <FaCheck /> : <FaTimes />} Remaining
                  characters should be numbers
                </ValidationItem>
              </ValidationContainer>
            )}
            <GlassInputGroup>
              <FaUserGraduate className="icon" />
              <GlassInput
                type="text"
                id="NameOfStudent"
                placeholder="Student Name"
                required
              />
            </GlassInputGroup>
            <GlassInputGroup>
              <FaBuilding className="icon" />
              <GlassInput
                type="text"
                id="NameOfOrg"
                placeholder="Organization"
                required
              />
            </GlassInputGroup>
            <GlassInputGroup>
              <FaBook className="icon" />
              <GlassInput
                type="text"
                id="NameOfCourse"
                placeholder="Course Name"
                required
              />
            </GlassInputGroup>
            <GlassInputGroup>
              <FaCalendarAlt className="icon" />
              <GlassInput
                type="text"
                id="BatchYear"
                placeholder="Batch Year"
                required
                value={batchYear}
                onChange={(e) => setBatchYear(e.target.value)}
                onFocus={() => setShowBatchChecks(true)}
              />
            </GlassInputGroup>
            {showBatchChecks && (
              <ValidationContainer>
                <ValidationItem isValid={isBatchValid}>
                  {isBatchValid ? <FaCheck /> : <FaTimes />} Exact 4 digits
                </ValidationItem>
              </ValidationContainer>
            )}

            {gotError && <ErrorMessage>{gotError}</ErrorMessage>}
            {ownerRight && <ErrorMessage>{ownerRight}</ErrorMessage>}

            <GlassButton type="submit" fullWidth>
              Create Certificate
            </GlassButton>
            <GlassButton
              type="button"
              secondary
              fullWidth
              onClick={() => navigate("/down")}
              style={{ marginTop: "10px" }}
            >
              Go to Download
            </GlassButton>
          </Form>
        </GlassCard>

        {/* Verification Section */}
        <GlassCard maxWidth="100%">
          <SectionTitle>Verify Certificate</SectionTitle>
          <VerificationBox>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                width: "100%",
              }}
            >
              <SearchBox>
                <GlassInputGroup style={{ flex: 1 }}>
                  <FaFileContract className="icon" />
                  <GlassInput
                    type="text"
                    id="CertificateId1"
                    placeholder="Enter Certificate ID to Verify"
                  />
                </GlassInputGroup>
                <IconButton onClick={getData}>
                  <FaSearch />
                </IconButton>
              </SearchBox>
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  marginLeft: "0.5rem",
                  textAlign: "left",
                }}
              >
                Example: <strong>Ver123</strong>
              </span>
            </div>

            {gotError1 && <ErrorMessage>{gotError1}</ErrorMessage>}

            {certificateData.candidateName && (
              <ResultCard>
                <h3>Certificate Details</h3>
                <ResultRow>
                  <span>Candidate:</span> {certificateData.candidateName}
                </ResultRow>
                <ResultRow>
                  <span>Organization:</span> {certificateData.orgName}
                </ResultRow>
                <ResultRow>
                  <span>Course:</span> {certificateData.courseName}
                </ResultRow>
                <ResultRow>
                  <span>Year:</span> {certificateData.batchYear}
                </ResultRow>
                <ResultRow>
                  <span>Verification:</span>
                  <a
                    href={`https://amoy.polygonscan.com/block/${certificateData.blockNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "var(--accent-color)",
                      textDecoration: "underline",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <img
                      src={polygonIcon}
                      alt="Polygon"
                      style={{ width: "20px", height: "20px" }}
                    />
                    View on Polygonscan
                  </a>
                </ResultRow>
              </ResultCard>
            )}
          </VerificationBox>
        </GlassCard>
      </MainGrid>

      {showSuccessModal && (
        <ModalOverlay>
          <ModalContent>
            <FaCheckCircle
              style={{
                color: "var(--success-color)",
                fontSize: "3rem",
                marginBottom: "1rem",
              }}
            />
            <SectionTitle
              style={{
                textAlign: "center",
                borderBottom: "none",
                marginBottom: "0.5rem",
              }}
            >
              Success!
            </SectionTitle>
            <p
              style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}
            >
              Certificate generated successfully.
            </p>
            <CertificateIdDisplay>
              ID: <span>{createdCertId}</span>
            </CertificateIdDisplay>
            <GlassButton onClick={() => setShowSuccessModal(false)} fullWidth>
              Back
            </GlassButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
}

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 480px));
  justify-content: center;
  gap: 2rem;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 480px;
  }
`;

const SectionTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 1rem;
  color: var(--text-primary);
  width: 100%;
  text-align: left;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const VerificationBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const SearchBox = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
`;

const IconButton = styled.button`
  background: var(--accent-gradient);
  border: none;
  width: 50px; // Fixed width for icon button
  border-radius: 12px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;

  &:hover {
    transform: scale(1.05);
  }
`;

const ResultCard = styled.div`
  background: rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  margin-top: 1rem;
  border: 1px solid var(--success-color);

  h3 {
    margin-top: 0;
    color: var(--success-color);
  }
`;

const ResultRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  span {
    color: var(--text-secondary);
    font-weight: 500;
    margin-right: 10px;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ValidationContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 0.25rem;
  padding-left: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ValidationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: ${(props) =>
    props.isValid ? "var(--success-color)" : "var(--text-secondary)"};
  margin-bottom: 4px;
  transition: color 0.3s;

  svg {
    font-size: 0.75rem;
    color: ${(props) => (props.isValid ? "var(--success-color)" : "#999")};
  }
`;

const ErrorMessage = styled.div`
  color: var(--danger-color);
  background: rgba(255, 75, 43, 0.1);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--danger-color);
  margin-bottom: 1rem;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CertificateIdDisplay = styled.div`
  background: rgba(0, 200, 83, 0.1);
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  color: var(--success-color);
  font-weight: 600;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  border: 1px dashed var(--success-color);

  span {
    color: var(--text-primary);
    margin-left: 0.5rem;
    font-weight: 700;
  }
`;

export default Dashboard;
