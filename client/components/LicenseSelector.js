import { useEffect } from 'react';
import axios from 'axios';
import LicenseSelectorItem from './LicenseSelectorItem';
import { getIpfsHashFromBytes32 } from '../helpers/ipfsHashConverter';

export default function LicenseSelector(props) {
  const fetchLicenses = () => {
    const newLicenses = [];
    const { drizzle } = props;
    const contract = drizzle.contracts.Factory;
    return contract.methods
      .availableLicenseTypesLength()
      .call()
      .then(length => {
        const promises = [];
        for (let i = 0; i < length; i++) {
          promises.push(contract.methods.availableLicenseTypes(i).call());
        }
        return Promise.all(promises).then(hashes => {
          const ipfsPromises = [];
          hashes.forEach(hash => {
            ipfsPromises.push(
              axios.get(
                `https://cloudflare-ipfs.com/ipfs/${getIpfsHashFromBytes32(
                  hash,
                )}`,
              ),
            );
          });
          return Promise.all(ipfsPromises).then(fetchedLicenses => {
            fetchedLicenses.forEach((license, licenseId) => {
              newLicenses.push({
                licenseId,
                isSelected: false,
                ipfsHash: getIpfsHashFromBytes32(hashes[licenseId]),
                price: 100,
                limit: 0,
                ...license.data,
              });
            });
            props.setLicenseTypes(newLicenses);
          });
        });
      });
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const changeLicenseType = licenseType => {
    const newLicenses = [...props.licenseTypes];
    newLicenses[licenseType.licenseId] = licenseType;
    props.setLicenseTypes(newLicenses);
  };

  return (
    <>
      <div className="block mt-3">
        <span className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
          license type
        </span>
        <div className="mt-2">
          {props.licenseTypes.map(license => (
            <LicenseSelectorItem
              license={license}
              key={license.licenseId}
              changeLicenseType={changeLicenseType}
            />
          ))}
        </div>
      </div>
    </>
  );
}
