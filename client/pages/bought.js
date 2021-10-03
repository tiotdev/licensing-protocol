import { DrizzleContext } from '@drizzle/react-plugin';
import Header from '../components/Header';
import LicenseTable from '../components/LicenseTable';
import MetamaskButton from '../components/MetamaskButton';

export default function Bought({ ipfsNode }) {
  return (
    <>
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;

          return (
            <>
              <Header active="bought" drizzle={drizzle} />
              {!initialized ? (
                <MetamaskButton />
              ) : (
                <LicenseTable
                  type="bought"
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
