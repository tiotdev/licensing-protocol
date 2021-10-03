/* eslint-disable no-plusplus */
/* eslint-disable radix */
import React, { useEffect, useState } from 'react';
import LicenseDetail from './LicenseDetail';
import ClaimableCheck from './ClaimableCheck';

export default function LicenseTable(props) {
  const { ipfsNode } = props;

  const [licenseList, setLicenseList] = useState([]);

  const getOwned = async instance => {
    const licensesLength = await instance.methods.allLicensesLength().call();
    const licenseIdPromises = [];
    for (let licenseId = 0; licenseId < licensesLength; licenseId++) {
      licenseIdPromises.push(instance.methods.allLicenses(licenseId).call());
    }
    return Promise.all(licenseIdPromises).then(licenses => {
      setLicenseList(licenses);
    });
  };

  useEffect(() => {
    const { drizzle } = props;
    const factory = drizzle.contracts.Factory;

    getOwned(factory);
  }, [props]);

  return (
    <>
      <div className="flex flex-col p-5">
        {licenseList.length > 0 ? (
          <div className="grid justify-items-end">
            <ClaimableCheck addresses={licenseList} {...props} />
          </div>
        ) : (
          <></>
        )}
        <div className="overflow-x-auto">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Creator
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {licenseList.map(address => (
                    <LicenseDetail
                      key={address}
                      address={address}
                      {...props}
                      ipfsNode={ipfsNode}
                      type={props.type}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
