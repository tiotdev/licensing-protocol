export default function ViewButtons({ contractAddress, ipfsHash }) {
  return (
    <>
      <a
        href={`https://ipfs.io/ipfs/${ipfsHash}`}
        target="_blank"
        rel="noreferrer"
        className="rounded p-2 bg-gray-800 text-white flex mr-2"
      >
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
        View on IPFS
      </a>
      <a
        href={`https://ropsten.etherscan.io/token/${contractAddress}`}
        target="_blank"
        rel="noreferrer"
        className="rounded p-2 bg-gray-800 text-white flex"
      >
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
        View on Etherscan
      </a>
    </>
  );
}
