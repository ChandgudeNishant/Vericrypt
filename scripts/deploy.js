const hre = require("hardhat");

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  const lockedAmount = hre.ethers.utils.parseEther("1");

  const Certification = await hre.ethers.getContractFactory("Certification");
  const certification = await Certification.deploy();

  await certification.deployed();

  console.log(
    `Deployed  contract Address ${certification.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
