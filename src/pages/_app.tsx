import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { AppProvider } from '../lib/app';
import { AuthProvider } from '../lib/auth';
import Navbar from '../common/Navbar';

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <AuthProvider>
        <AppProvider>
          <Navbar />
          <Component {...pageProps} />
        </AppProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
