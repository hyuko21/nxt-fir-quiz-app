import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { AppProvider } from '../lib/app';
import { AuthProvider } from '../lib/auth';
import { Layout } from '../common/Layout';

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <AuthProvider>
        <AppProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AppProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
