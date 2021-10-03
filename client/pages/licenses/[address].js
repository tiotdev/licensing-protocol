import { DrizzleContext } from '@drizzle/react-plugin';
import Header from '../../components/Header';
import MetamaskButton from '../../components/MetamaskButton';
import BuyLicense from '../../components/BuyLicense';

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true, // See the "fallback" section below
  };
}

export async function getStaticProps({ params }) {
  const { address } = params;
  return {
    props: { address }, // will be passed to the page component as props
  };
}

export default function LicenseAddress({ address }) {
  return (
    <>
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, initialized } = drizzleContext;

          return (
            <>
              <Header drizzle={drizzle} />
              {!initialized ? (
                <MetamaskButton />
              ) : (
                <>
                  {address && (
                    <BuyLicense address={address} drizzle={drizzle} />
                  )}
                </>
              )}
            </>
          );
        }}
      </DrizzleContext.Consumer>
    </>
  );
}
