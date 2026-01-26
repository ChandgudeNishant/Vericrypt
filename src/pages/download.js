import React, { useState, useRef } from "react";
import styled from "styled-components";
import { ethers } from "ethers";
import Certification from "./smart-contract-abi/Certification.json";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Cert from "./images/certificate.png";
import { useNavigate } from "react-router-dom";
import { getProviderAndSigner } from "../utils/ethereum";
import {
  PageContainer,
  GlassInput,
  GlassInputGroup,
  GlassButton,
  BackButton,
} from "../components/common/GlassComponents";
import {
  FaDownload,
  FaSearch,
  FaArrowLeft,
  FaSpinner,
  FaFileContract,
} from "react-icons/fa";
import DashboardHeader from "../components/common/DashboardHeader";

const CertificateGenerator = () => {
  const navigate = useNavigate();
  const [certificateData, setCertificateData] = useState(null);
  const [inputCertId, setInputCertId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const certificateRef = useRef(null);

  // Hardcoded for now, but ideally from environment or config
  const contractAddress = "0x4de5523c1000104AB91007DBF0210bF8c303D5c4";

  const getData = async () => {
    if (!inputCertId.trim()) {
      setError("Please enter a Certificate ID");
      return;
    }

    setIsLoading(true);
    setError("");
    setCertificateData(null);

    try {
      const { signer } = await getProviderAndSigner();
      if (signer) {
        const contract = new ethers.Contract(
          contractAddress,
          Certification.abi,
          signer,
        );

        // Call the smart contract
        const data = await contract.getData(inputCertId);
        console.log(data);
        // Data structure: [candidate_name, org_name, course_name, batch_year]
        setCertificateData({
          candidateName: data[0],
          orgName: data[1],
          courseName: data[2],
          batchYear: data[3].toString(),
          id: inputCertId,
        });
      }
    } catch (error) {
      console.error("Error getting certificate data:", error);
      // Extract specific error message if possible
      if (error.reason && error.reason.includes("No data exists")) {
        setError("Certificate ID not found. Please check and try again.");
      } else {
        setError("Failed to fetch certificate. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!certificateData || !certificateRef.current) return;

    const certificateElement = certificateRef.current;

    try {
      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        useCORS: true, // Important for potential external images
        backgroundColor: null, // Transparent background if needed
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4"); // landscape
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `Vericrypt_Certificate_${certificateData.candidateName.replace(
          /\s+/g,
          "_",
        )}.pdf`,
      );
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <PageContainer>
      <DashboardHeader />
      <Header>
        <BackButton onClick={() => navigate("/register")}>
          <FaArrowLeft /> Back
        </BackButton>
        <Title>Certificate Download</Title>
      </Header>

      <ControlPanel>
        <InputGroup>
          <GlassInputGroup style={{ maxWidth: "400px" }}>
            <FaFileContract className="icon" />
            <GlassInput
              type="text"
              value={inputCertId}
              onChange={(e) => {
                setInputCertId(e.target.value);
                setError(""); // Clear error on type
              }}
              placeholder="Enter Certificate ID"
            />
          </GlassInputGroup>
          <GlassButton
            onClick={getData}
            disabled={isLoading}
            style={{ minWidth: "120px" }}
          >
            {isLoading ? (
              <FaSpinner className="spin" />
            ) : (
              <>
                <FaSearch /> Fetch
              </>
            )}
          </GlassButton>
          <GlassButton
            onClick={generatePDF}
            disabled={!certificateData}
            style={{
              opacity: certificateData ? 1 : 0.5,
              cursor: certificateData ? "pointer" : "not-allowed",
              minWidth: "160px",
            }}
          >
            <FaDownload /> Download PDF
          </GlassButton>
        </InputGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </ControlPanel>

      {certificateData && (
        <PreviewSection>
          <h3>Preview</h3>
          <CertificateWrapper ref={certificateRef}>
            <img src={Cert} alt="Certificate Background" />

            {/* Candidate Name - using cursive font */}
            <OverlayText
              top="43.5%"
              left="11%"
              size="52px"
              font="'Great Vibes', cursive"
              color="#1a1a1a"
            >
              {certificateData.candidateName}
            </OverlayText>

            {/* Organization */}
            <OverlayText
              top="58.5%"
              left="3.5%"
              transform="translate(0, -50%)"
              size="25px"
              font="'Outfit', sans-serif"
              weight="500"
              align="left"
            >
              {certificateData.orgName}
            </OverlayText>

            {/* Course */}
            <OverlayText
              top="70.5%"
              left="3.5%"
              transform="translate(0, -50%)"
              size="25px"
              font="'Outfit', sans-serif"
              weight="500"
              align="left"
            >
              {certificateData.courseName}
            </OverlayText>

            {/* Batch Year */}
            <OverlayText
              top="82.5%"
              left="3.5%"
              transform="translate(0, -50%)"
              size="25px"
              font="'Outfit', sans-serif"
              weight="600"
              align="left"
            >
              {certificateData.batchYear}
            </OverlayText>

            {/* Certificate ID */}
            <OverlayText
              top="90.4%"
              left="14.7%"
              transform="translate(0, -50%)"
              size="17.5px"
              color="#3f3e3eff"
              font="'Courier New', monospace"
              align="left"
            >
              {certificateData.id}
            </OverlayText>
          </CertificateWrapper>
        </PreviewSection>
      )}
    </PageContainer>
  );
};

export default CertificateGenerator;

const Header = styled.div`
  width: 100%;
  max-width: 1000px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  color: var(--text-primary);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-grow: 1;
  text-align: center;
`;

const ControlPanel = styled.div`
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  width: 100%;
  max-width: 800px;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;

  @media (max-width: 600px) {
    flex-direction: column;

    input,
    button {
      width: 100% !important;
    }
  }
`;

const ErrorMessage = styled.p`
  color: var(--danger-color);
  margin-top: 1rem;
  font-weight: 500;
`;

const PreviewSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 3rem;
  margin-bottom: 3rem;

  h3 {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  /* Animation for appearing */
  animation: fadeIn 0.5s ease-out;
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CertificateWrapper = styled.div`
  position: relative;
  width: 900px;
  height: 636px;
  background: white;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border-radius: 4px; /* Slight round for paper feel */
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain; /* Ensure entire template is visible */
  }

  /* Responsive scaling */
  @media (max-width: 950px) {
    transform: scale(0.8);
    transform-origin: top center;
    margin-bottom: -15%;
  }
  @media (max-width: 768px) {
    transform: scale(0.6);
    margin-bottom: -30%;
  }
  @media (max-width: 500px) {
    transform: scale(0.4);
    margin-bottom: -50%;
  }
`;

const OverlayText = styled.div`
  position: absolute;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  transform: ${(props) => props.transform || "translate(-50%, -50%)"};
  font-size: ${(props) => props.size};
  color: ${(props) => props.color || "#333"};
  font-family: ${(props) => props.font || "'Outfit', sans-serif"};
  font-weight: ${(props) => props.weight || "normal"};
  margin: 0;
  white-space: nowrap;
  text-align: ${(props) => props.align || "center"};
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
`;
