/* eslint-disable jsx-a11y/label-has-associated-control */

export default function LicenseSelectorItem({ license, changeLicenseType }) {
  const setChecked = isChecked => {
    const newLicense = license;
    license.isSelected = isChecked;
    changeLicenseType(newLicense);
  };

  const handlePriceChange = e => {
    const newLicense = license;
    license.price = e.target.value;
    changeLicenseType(newLicense);
  };

  const handleLimitChange = e => {
    const newLicense = license;
    license.limit = e.target.value;
    changeLicenseType(newLicense);
  };

  return (
    <>
      <div>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="checkbox p-2"
            checked={license.isSelected}
            onChange={e => setChecked(e.target.checked)}
          />
          <div className="ml-2">
            <div className="inline-flex">
              <span className="flex-grow font-medium text-gray-600 text-sm">
                {license.title}
              </span>
              <label
                htmlFor={`my-modal-${license.licenseId}`}
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
                id={`my-modal-${license.licenseId}`}
                className="modal-toggle"
              />
              <div className="modal">
                <div className="modal-box">
                  <h2 className="text-xl font-semibold">{license.title}</h2>
                  <p>{license.body}</p>
                  <div className="modal-action">
                    <a
                      href={`https://ipfs.io/ipfs/${license.ipfsHash}`}
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
                      htmlFor={`my-modal-${license.licenseId}`}
                      className="btn"
                    >
                      Close
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs font-light text-gray-400">
              {license.description}
            </div>
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0 mr-1">
            <label
              className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
              htmlFor="price"
            >
              Price
            </label>
            <input
              disabled={license.isSelected ? undefined : 'disabled'}
              className="input input-bordered"
              type="number"
              placeholder="100"
              id="price"
              min="0"
              value={license.price}
              onChange={handlePriceChange}
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0 ml-2">
            <label
              className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
              htmlFor="limit"
            >
              Limit
            </label>
            <input
              value={license.limit}
              onChange={handleLimitChange}
              id="limit"
              disabled={license.isSelected ? undefined : 'disabled'}
              className="input input-bordered"
              type="number"
              placeholder="0"
              min="0"
            />
          </div>
        </label>
      </div>
    </>
  );
}
