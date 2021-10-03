/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { getIpfsHashFromBytes32 } from '../helpers/ipfsHashConverter';
import License from '../../build/contracts/License.json';

export default function LicenseDetail(props) {
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const [creator, setCreator] = useState();
  const [contractAddress, setContractAddress] = useState();
  const [isBought, setIsBought] = useState(false);
  const [availableLicenseTypes, setAvailableLicenseTypes] = useState();
  const [isOwner, setIsOwner] = useState(false);

  const { type } = props;

  const fetchIpfsContents = async hashToFetch => {
    axios
      .get(`https://cloudflare-ipfs.com/ipfs/${hashToFetch}`)
      .then(({ data }) => {
        setTitle(data.name);
        setBody(data.description);
      });
  };

  const fetchLicense = async (address, instance) => {
    setContractAddress(address);
    const newAvailableLicenseTypes = await instance.methods
      .availableLicenseTypesLength()
      .call();
    setAvailableLicenseTypes(newAvailableLicenseTypes);
    const contract = new instance.web3.eth.Contract(License.abi, address);
    const ipfsHash = await contract.methods.ipfsHash().call();
    const formattedHash = getIpfsHashFromBytes32(ipfsHash);
    fetchIpfsContents(formattedHash);
    const accounts = await instance.web3.eth.getAccounts();
    const batchFetchAccounts = [];
    const batchFetchIds = [];
    for (let id = 0; id <= availableLicenseTypes; id++) {
      batchFetchAccounts.push(accounts[0]);
      batchFetchIds.push(id);
    }
    const fetchedBalance = await contract.methods
      .balanceOfBatch(batchFetchAccounts, batchFetchIds)
      .call();
    const intBalances = [];
    fetchedBalance.forEach((balance, i) => {
      intBalances.push(parseInt(balance));
      if (i === 0 && parseInt(balance) > 0) setIsOwner(true);
      if (i > 0 && parseInt(balance) > 0) setIsBought(true);
    });
    const newCreator = await contract.methods.creator().call();
    setCreator(newCreator);
  };

  useEffect(() => {
    const { drizzle } = props;
    const contract = drizzle.contracts.Factory;

    fetchLicense(props.address, contract);
  }, [props]);

  if (!title || !body) return <></>;
  if (type === 'owned' && !isOwner) return <></>;
  if (type === 'bought' && !isBought) return <></>;
  return (
    <>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
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
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-900">{title}</div>
          <div className="text-sm text-gray-500">{body.substring(0, 300)}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {isOwner ? (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
              Owned
            </span>
          ) : isBought ? (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              Bought
            </span>
          ) : (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
              Available
            </span>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <Link href={`/licenses/${contractAddress}`}>
            <a>
              <button
                className="text-indigo-600 hover:text-indigo-900"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </a>
          </Link>
        </td>
      </tr>
    </>
  );
}
