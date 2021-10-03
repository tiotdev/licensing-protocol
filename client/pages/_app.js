import { DrizzleContext } from '@drizzle/react-plugin';
import { Drizzle, generateStore } from '@drizzle/store';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { create } from 'ipfs-http-client';
import Factory from '../../build/contracts/Factory.json';
import Market from '../../build/contracts/Market.json';
import '../styles/globals.css';

// Setup the drizzle instance.
const options = {
  contracts: [Market, Factory],
};
const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

function MyApp({ Component, pageProps }) {
  const [ipfsNode, setIpfsNode] = useState();

  const createNode = async () => {
    const node = create('https://ipfs.infura.io:5001/api/v0');
    setIpfsNode(node);
  };

  useEffect(() => {
    createNode();
  }, []);

  return (
    <>
      <Head>
        <title>Licensing Protocol</title>
      </Head>
      <DrizzleContext.Provider drizzle={drizzle}>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              style: {
                color: 'white',
                background: 'green',
              },
            },
            error: {
              style: {
                color: 'white',
                background: 'red',
              },
            },
          }}
        />
        <Component {...pageProps} ipfsNode={ipfsNode} />
      </DrizzleContext.Provider>
    </>
  );
}

export default MyApp;
