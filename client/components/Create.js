/* eslint-disable jsx-a11y/label-has-associated-control */
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { getBytes32FromIpfsHash } from '../helpers/ipfsHashConverter';
import LicenseSelector from './LicenseSelector';

export default function Create(props) {
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const [loading, setLoading] = useState(false);
  const [licenseTypes, setLicenseTypes] = useState([]);

  const { ipfsNode } = props;

  const router = useRouter();

  const ipfsUpload = async () => {
    if (!ipfsNode) return;

    const data = JSON.stringify({
      name: title,
      description: body,
    });

    return ipfsNode.add(data).then(res => {
      const { path } = res;
      toast.success(
        <>
          Upload to IPFS successful:
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://ipfs.io/ipfs/${path}`}
          >
            {path}
          </a>
        </>,
      );
      return path;
    });
  };

  const createLicense = async () => {
    let hasLicenseType = false;
    const licenseIds = [];
    const licensePrices = [];
    const licenseSupply = [];
    licenseTypes.forEach(lType => {
      if (lType.isSelected) {
        hasLicenseType = true;
        licenseIds.push(lType.licenseId + 1);
        licensePrices.push(lType.price * Math.pow(10, 6));
        licenseSupply.push(lType.limit);
      }
    });
    if (!hasLicenseType) {
      toast.error(`Please select at least one license type!`);
      return;
    }
    setLoading(true);
    const hash = await ipfsUpload();
    toast('Submitting transaction...');
    const { drizzle } = props;
    const contract = drizzle.contracts.Factory;
    return contract.methods
      .createLicense(
        getBytes32FromIpfsHash(hash),
        licenseIds,
        licensePrices,
        licenseSupply,
      )
      .send()
      .then(res => {
        const { transactionHash } = res;
        toast.success(transactionHash);
        // Reset
        setTitle(undefined);
        setBody(undefined);
        setLoading(false);
        router.push('/');
      })
      .catch(err => {
        toast.error(
          `Creating license failed: ${JSON.stringify(err).substring(0, 300)}`,
        );
        setLoading(false);
      });
  };

  return (
    <div className="max-w-xl p-5 m-auto">
      <h1 className="text-xl text-gray-900 font-bold">License a post</h1>
      <label className="block mt-2">
        <span className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
          Title
        </span>
        <input
          className="input input-bordered mt-1 block w-full disabled:bg-gray-100"
          placeholder="Title of your post"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </label>
      <label className="block mt-2">
        <span className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
          Text
        </span>
        <textarea
          className="input input-bordered mt-1 block w-full disabled:bg-gray-100"
          rows="3"
          placeholder="Your post"
          value={body}
          onChange={e => setBody(e.target.value)}
        />
      </label>
      <LicenseSelector
        {...props}
        licenseTypes={licenseTypes}
        setLicenseTypes={setLicenseTypes}
      />
      <div className="text-right">
        <button
          className={`btn btn-primary ${
            loading ? 'loading ' : ''
          }ml-2 mt-5 p-2 disabled:opacity-50`}
          type="button"
          onClick={createLicense}
          disabled={!title || !body}
        >
          Create License
        </button>
      </div>
    </div>
  );
}
