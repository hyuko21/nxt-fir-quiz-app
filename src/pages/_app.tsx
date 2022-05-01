import { ChakraProvider } from '@chakra-ui/react';
import { appWithTranslation } from 'next-i18next'
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
            {/* @ts-ignore */}
            <Component {...pageProps} />
          </Layout>
        </AppProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default appWithTranslation(App);

