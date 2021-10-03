export default function MetamaskButton() {
  return (
    <div className="p-5 max-w-xl m-auto">
      <div className="pb-3 text-2xl font-bold text-gray-900">
        Connect with Metamask to the Ropsten testnet to use this dApp
      </div>
      <button
        className="rounded bg-red-500 text-white p-2"
        type="button"
        onClick={() => window.location.reload()}
      >
        Connect with Metamask
      </button>
    </div>
  );
}
