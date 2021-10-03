/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import License from '../../build/contracts/License.json';
import { getIpfsHashFromBytes32 } from '../helpers/ipfsHashConverter';
import ViewButtons from './ViewButtons';
import { USDC_ABI } from '../helpers/abis';
import ClaimableCheck from './ClaimableCheck';

const frontendWallet = '0xB9569D8C0FD8c10503F83Fd68082a4282BB81a15';
const usdcContract = '0x07865c6e87b9f70255377e024ace6630c1eaa37f';

export default function BuyLicense(props) {
  const [ownedLicenses, setOwnedLicenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState([]);
  const [supply, setSupply] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const [hash, setHash] = useState();
  const [licenseTexts, setLicenseTexts] = useState([]);
  const [creator, setCreator] = useState();
  const [isOwner, setIsOwner] = useState(false);

  const fetchIpfsContents = async hashToFetch => {
    axios
      .get(`https://cloudflare-ipfs.com/ipfs/${hashToFetch}`)
      .then(({ data }) => {
        setTitle(data.name);
        setBody(data.description);
      });
  };

  const fetchLicense = async address => {
    const existsToFetch = [];
    const pricesToFetch = [];
    const supplyToFetch = [];

    const licenseInstance =
      new props.drizzle.contracts.Factory.web3.eth.Contract(
        License.abi,
        address,
      );

    const ipfsHash = await licenseInstance.methods.ipfsHash().call();
    const formattedHash = getIpfsHashFromBytes32(ipfsHash);
    setHash(formattedHash);
    fetchIpfsContents(formattedHash);

    // Get license types available in Factory (for any item)
    const availableLicenseTypes = await props.drizzle.contracts.Factory.methods
      .availableLicenseTypesLength()
      .call();

    // Check which license types exist for this item
    for (let type = 0; type <= availableLicenseTypes; type++) {
      existsToFetch.push(
        licenseInstance.methods.licenseTypeExists(type).call(),
      );
    }
    const availableLicenseIds = [];
    const licenseDetailPromises = [];
    const accounts =
      await props.drizzle.contracts.Factory.web3.eth.getAccounts();

    const newCreator = await licenseInstance.methods.creator().call();
    setCreator(newCreator);
    if (newCreator === accounts[0]) setIsOwner(true);

    const batchBalanceCheck = [];
    const batchAccountsCheck = [];
    await Promise.all(existsToFetch).then(allLicenses => {
      allLicenses.forEach((exists, i) => {
        if (exists) {
          availableLicenseIds.push(i);
          licenseDetailPromises.push(
            props.drizzle.contracts.Factory.methods
              .availableLicenseTypes(i - 1)
              .call(),
          );
          batchBalanceCheck.push(i);
          batchAccountsCheck.push(accounts[0]);
          pricesToFetch.push(
            licenseInstance.methods.licenseTypeToPrice(i).call(),
          );
          supplyToFetch.push(
            licenseInstance.methods.licenseTypeToLimitRemaining(i).call(),
          );
        }
      });
    });
    setLicenses(availableLicenseIds);
    const fetchedPrices = [];
    await Promise.all(pricesToFetch).then(all => {
      all.forEach(price => {
        fetchedPrices.push(parseInt(price));
      });
    });
    setPrices(fetchedPrices);
    const fetchedSupply = [];
    await Promise.all(supplyToFetch).then(all => {
      all.forEach(availableSupply => {
        fetchedSupply.push(parseInt(availableSupply));
      });
    });
    setSupply(fetchedSupply);

    const fetchBatchBalances = await licenseInstance.methods
      .balanceOfBatch(batchAccountsCheck, batchBalanceCheck)
      .call();
    const batchBalances = [];
    fetchBatchBalances.forEach(balance => {
      batchBalances.push(parseInt(balance));
    });
    setOwnedLicenses(batchBalances);
    return Promise.all(licenseDetailPromises).then(hashes => {
      const ipfsPromises = [];
      hashes.forEach(ihash => {
        ipfsPromises.push(
          axios.get(
            `https://cloudflare-ipfs.com/ipfs/${getIpfsHashFromBytes32(ihash)}`,
          ),
        );
      });
      return Promise.all(ipfsPromises).then(fetchedLicenses => {
        const newLicenseTexts = [];
        fetchedLicenses.forEach((licenseText, i) =>
          newLicenseTexts.push({
            ipfsHash: getIpfsHashFromBytes32(hashes[i]),
            ...licenseText.data,
          }),
        );
        setLicenseTexts(newLicenseTexts);
      });
    });
  };

  useEffect(() => {
    fetchLicense(props.address);
  }, [props]);

  const approveUsdc = async requiredAllowance => {
    const usdcInstance = new props.drizzle.contracts.Market.web3.eth.Contract(
      USDC_ABI,
      usdcContract,
    );

    const accounts =
      await props.drizzle.contracts.Market.web3.eth.getAccounts();

    const allowance = await usdcInstance.methods
      .allowance(accounts[0], props.drizzle.contracts.Market.address)
      .call();

    if (allowance < requiredAllowance) {
      return usdcInstance.methods
        .approve(
          props.drizzle.contracts.Market.address,
          props.drizzle.contracts.Market.web3.utils.toWei(
            '80000000000',
            'ether',
          ), // unlimited
        )
        .send({ from: accounts[0] })
        .then(res => {
          const { transactionHash } = res;
          toast.success(`Approving USDC spending ${transactionHash}`);
          return true;
        })
        .catch(err => {
          console.error(err);
          toast.error(
            `Approving USDC spending failed: ${JSON.stringify(err).substring(
              0,
              300,
            )}`,
          );
          setLoading(false);
          return false;
        });
    }
    return true;
  };

  const buyLicense = async (id, price, index) => {
    setLoading(true);

    const isApprovalSuccess = await approveUsdc(price);
    if (!isApprovalSuccess) return;
    const { drizzle } = props;
    const market = drizzle.contracts.Market;

    return market.methods
      .buyLicense(id, props.address, frontendWallet)
      .send()
      .then(res => {
        const { transactionHash } = res;
        toast.success(transactionHash);
        const newOwnedLicenses = [...ownedLicenses];
        newOwnedLicenses[index] += 1;
        setOwnedLicenses(newOwnedLicenses);
        setLoading(false);
      })
      .catch(err => {
        toast.error(
          `Buying license failed: ${JSON.stringify(err).substring(0, 300)}`,
        );
        setLoading(false);
      });
  };

  return (
    <>
      <div className="max-w-xl p-5 m-auto">
        <div className="text-sm font-medium text-gray-900">
          <a
            href={`https://ropsten.etherscan.io/address/${creator}`}
            target="_blank"
            rel="noreferrer"
          >
            {creator ? creator.substring(0, 4) : ''}...
            {creator
              ? creator.substring(creator.length - 4, creator.length)
              : ''}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="ml-1 mb-2 w-3 h-3 inline"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
          {isOwner && (
            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
              Owned
            </span>
          )}
        </div>
        <h1 className="text-xl text-gray-900 font-bold">{title}</h1>
        <div className="mt-2">{body}</div>
        <div className="flex mt-2 mb-2">
          <ViewButtons contractAddress={props.address} ipfsHash={hash} />
        </div>
        <ClaimableCheck addresses={[props.address]} {...props} />
        <div className="overflow-x-auto mt-4">
          <table className="table w-full table-zebra">
            <thead>
              <tr>
                <th>License Type</th>
                <th>Price</th>
                <th>Buy</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map((licenseId, i) => (
                <tr key={licenseId}>
                  <th>
                    {licenseTexts[i] ? licenseTexts[i].title : ''}{' '}
                    <label
                      htmlFor={`licensebuy-modal-${i}`}
                      className="flex-1 h-6 w-6 bg-primary-900 cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </label>
                    <input
                      type="checkbox"
                      id={`licensebuy-modal-${i}`}
                      className="modal-toggle"
                    />
                    <div className="modal">
                      <div className="modal-box">
                        <h2 className="text-xl font-semibold">
                          {licenseTexts[i] ? licenseTexts[i].title : ''}
                        </h2>
                        <p>
                          Available licenses:{' '}
                          {supply[i] === 0 ? 'unlimited' : supply[i] - 1}
                        </p>
                        <p className="overflow-ellipsis overflow-hidden">
                          {licenseTexts[i] ? licenseTexts[i].body : ''}
                        </p>
                        <div className="modal-action">
                          <a
                            href={`https://ipfs.io/ipfs/${
                              licenseTexts[i] ? licenseTexts[i].ipfsHash : ''
                            }`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <label className="btn">
                              View on IPFS{' '}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-6 h-6 mr-2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </label>
                          </a>
                          <label
                            htmlFor={`licensebuy-modal-${i}`}
                            className="btn"
                          >
                            Close
                          </label>
                        </div>
                      </div>
                    </div>
                  </th>
                  <td>$ {prices[i] / Math.pow(10, 6)},-</td>
                  <td>
                    {ownedLicenses[i] ? (
                      'Owned'
                    ) : supply[i] === 1 ? (
                      'Sold out'
                    ) : (
                      <button
                        className={`btn btn-primary btn-md ${
                          loading ? 'loading ' : ''
                        }`}
                        type="button"
                        onClick={() => buyLicense(licenses[i], prices[i], i)}
                        disabled={loading}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-4 h-4 mr-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        Buy
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
