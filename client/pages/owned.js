import { DrizzleContext } from '@drizzle/react-plugin';
import Header from '../components/Header';
import LicenseTable from '../components/LicenseTable';
import MetamaskButton from '../components/MetamaskButton';

export default function Owned({ ipfsNode }) {
  return (
    <>
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;

          return (
            <>
              <Header active="owned" drizzle={drizzle} />
              {!initialized ? (
                <MetamaskButton />
              ) : (
                <LicenseTable
                  type="owned"
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
