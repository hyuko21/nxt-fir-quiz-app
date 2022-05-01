import { useTranslation } from 'next-i18next'
import { Grid } from "@chakra-ui/react";
import Head from "next/head";
import { Footer } from "./Footer";
import Navbar from "./Navbar";

export const Layout = ({ children }) => {
  const { t } = useTranslation()

  return (
    <>
      <Head>
        <title>{t('appName')}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Grid minH='100vh' gridTemplateRows={'auto 2fr auto'}>
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
      </Grid>
    </>
  )
}