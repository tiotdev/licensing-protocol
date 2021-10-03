import { useState, useEffect } from 'react';
import License from '../../build/contracts/License.json';

export default function ClaimableCheck(props) {
  const [claimableAddresses, setClaimableAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [claimableAmount, setClaimableAmount] = useState(0);

  const claim = async () => {
    setLoading(true);
    const accounts =
      await props.drizzle.contracts.Factory.web3.eth.getAccounts();
    claimableAddresses.forEach(address => {
      const licenseInstance =
        new props.drizzle.contracts.Factory.web3.eth.Contract(
          License.abi,
          address,
        );

      licenseInstance.methods.claim().send({ from: accounts[0] });
    });
    setLoading(false);
  };

  const checkClaimable = async address => {
    const licenseInstance =
      new props.drizzle.contracts.Factory.web3.eth.Contract(
        License.abi,
        address,
      );
    const accounts =
      await props.drizzle.contracts.Factory.web3.eth.getAccounts();
    return licenseInstance.methods
      .claimable()
      .call({ from: accounts[0] })
      .then(res => {
        const amountClaimable = parseInt(res);
        if (amountClaimable !== 0) {
          let newClaimableAmount = claimableAmount;
          newClaimableAmount += amountClaimable;
          setClaimableAmount(newClaimableAmount);
          const newClaimableAddresses = [...claimableAddresses, address];
          setClaimableAddresses(newClaimableAddresses);
        }
      })
      .catch(err => {
        console.warn(err);
      });
  };

  useEffect(() => {
    if (claimableAddresses.length === 0)
      props.addresses.forEach(address => checkClaimable(address));
  }, [props]);

  return (
    <>
      {claimableAddresses.length === 0 ? (
        <></>
      ) : (
        <>
          <button
            className={`btn btn-primary btn-md ${loading ? 'loading ' : ''}`}
            type="button"
            onClick={() => claim()}
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Claim {claimableAmount / Math.pow(10, 6)} $
          </button>
        </>
      )}
    </>
  );
}
