const Web3 = require('web3');
const Factory = require('../../../../build/contracts/Factory.json');
const {
  getIpfsHashFromBytes32,
} = require('../../../helpers/ipfsHashConverter');
const axios = require('axios');

export default function handler(req, res) {
  const web3 = new Web3(process.env.WEB3_API);
  const { id } = req.query;
  const factoryInstance = new web3.eth.Contract(
    Factory.abi,
    Factory.networks['3'].address,
  );
  // Workaround to convert to regular int
  if (web3.utils.toBN(id) + 1 - 1 === 0)
    res.status(200).json({
      name: 'License Income Rights',
      description:
        'This token contains the rights to earning fees derived from licensing',
    });
  else
    return factoryInstance.methods
      .availableLicenseTypes(web3.utils.toBN(id) - 1)
      .call()
      .then(ipfsHash => {
        return axios
          .get(
            `https://cloudflare-ipfs.com/ipfs/${getIpfsHashFromBytes32(
              ipfsHash,
            )}`,
          )
          .then(ipfs => {
            const { title, body } = ipfs.data;
            // Licenses cannot change => Long term cache
            res.setHeader(
              'Cache-Control',
              's-maxage=31536000, stale-while-revalidate',
            );
            res.status(200).json({ name: title, description: body });
          });
      })
      .catch(err => {
        res.status(404).json({ name: 'License type not valid' });
      });
}
