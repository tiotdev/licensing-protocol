import { DrizzleContext } from '@drizzle/react-plugin';
import Header from '../components/Header';
import Create from '../components/Create';
import MetamaskButton from '../components/MetamaskButton';

export default function CreatePage({ ipfsNode }) {
  return (
    <>
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;

          return (
            <>
              <Header drizzle={drizzle} />
              {!initialized ? (
                <MetamaskButton />
              ) : (
                <Create
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
