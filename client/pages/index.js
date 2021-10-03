import { DrizzleContext } from '@drizzle/react-plugin';
import Header from '../components/Header';
import LicenseTable from '../components/LicenseTable';
import MetamaskButton from '../components/MetamaskButton';

export default function Marketplace({ ipfsNode }) {
  return (
    <>
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;

          return (
            <>
              <Header active="marketplace" drizzle={drizzle} />
              {!initialized ? (
                <MetamaskButton />
              ) : (
                <LicenseTable
                  type="marketplace"
                  ipfsNode={ipfsNode}
                  drizzle={drizzle}
                  drizzleState={drizzleState}
                />
              )}
            </>
          );
        }}
      </DrizzleContext.Consumer>
    </>
  );
}
