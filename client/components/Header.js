/* eslint-disable no-nested-ternary */
/* eslint-disable react/button-has-type */
import Link from 'next/link';
import { useEffect, useState } from 'react';

const activeDesktop =
  'bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium';
const inactiveDesktop =
  'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium';
const activeMobile =
  'bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium';
const inactiveMobile =
  'text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium';

export default function Header(props) {
  const [open, setOpen] = useState(false);
  const [wallet, setWallet] = useState(undefined);

  const { active } = props;

  const checkWallet = async drizzle => {
    if (
      !drizzle ||
      !drizzle.contracts ||
      !drizzle.contracts.Factory ||
      !drizzle.contracts.Factory.web3
    ) {
      setWallet(false);
      return;
    }
    const contract = drizzle.contracts.Factory;
    const accounts = await contract.web3.eth.getAccounts();
    setWallet(accounts[0]);
  };

  useEffect(() => {
    checkWallet(props.drizzle);
  }, [props]);

  return (
    <>
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* <!-- Mobile menu button--> */}
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
                onClick={() => setOpen(!open)}
              >
                <span className="sr-only">Open main menu</span>
                {/* <!--
              Icon when menu is closed.
  
              Heroicon name: outline/menu
  
              Menu open: "hidden", Menu closed: "block"
            --> */}
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                {/* <!--
              Icon when menu is open.
  
              Heroicon name: outline/x
  
              Menu open: "block", Menu closed: "hidden"
            --> */}
                <svg
                  className="hidden h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 flex items-stretch justify-start ml-12 sm:ml-0">
              <Link href="/">
                <a className="flex-shrink-0 flex items-center text-white text-lg">
                  Licensing
                </a>
              </Link>
              <div className="hidden sm:block sm:ml-6">
                <div className="flex space-x-4">
                  {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
                  <Link href="/">
                    <a
                      className={
                        active === 'marketplace'
                          ? activeDesktop
                          : inactiveDesktop
                      }
                    >
                      Marketplace
                    </a>
                  </Link>
                  <Link href="/owned">
                    <a
                      className={
                        active === 'owned' ? activeDesktop : inactiveDesktop
                      }
                    >
                      My Content
                    </a>
                  </Link>
                  <Link href="/bought">
                    <a
                      className={
                        active === 'bought' ? activeDesktop : inactiveDesktop
                      }
                    >
                      My Purchases
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {wallet === undefined ? (
                <></>
              ) : wallet ? (
                <>
                  <div className="hidden sm:block">
                    <Link href="/create">
                      <a>
                        <button className="rounded bg-green-500 p-3 text-white flex">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-6 w-6 mr-1"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <div className="hidden md:block">Add License</div>
                        </button>
                      </a>
                    </Link>
                  </div>
                  <div className="text-white text-sm rounded-xl bg-gray-900 p-3 ml-2">
                    <a
                      href={`https://ropsten.etherscan.io/address/${wallet}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {wallet.substring(0, 4)}...
                      {wallet.substring(wallet.length - 4, wallet.length)}
                    </a>
                  </div>
                </>
              ) : (
                <button
                  className="rounded bg-red-500 text-white p-2"
                  type="button"
                  onClick={() => window.location.reload()}
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        </div>

        {/* <!-- Mobile menu, show/hide based on menu state. --> */}
        {open && (
          <div className="sm:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
              <Link href="/">
                <a
                  className={
                    active === 'marketplace' ? activeMobile : inactiveMobile
                  }
                >
                  Marketplace
                </a>
              </Link>
              <Link href="/owned">
                <a
                  className={active === 'owned' ? activeMobile : inactiveMobile}
                >
                  My Content
                </a>
              </Link>
              <Link href="/bought">
                <a
                  className={
                    active === 'bought' ? activeMobile : inactiveMobile
                  }
                >
                  My Purchases
                </a>
              </Link>
              <Link href="/create">
                <a className="flex text-gray-100 hover:bg-green-600 hover:text-white px-3 py-2 rounded-md text-base font-medium bg-green-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6 mr-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Add License
                </a>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
