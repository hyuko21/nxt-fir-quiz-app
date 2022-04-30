import { Grid } from "@chakra-ui/react";
import Head from "next/head";
import { Footer } from "./Footer";
import Navbar from "./Navbar";

export const Layout = ({ children }) => (
  <>
    <Head>
      <title>QuizApp</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Grid minH='100vh'>
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </Grid>
  </>
)