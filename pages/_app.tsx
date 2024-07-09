import "@/styles/globals.css";
import type { AppProps } from "next/app";

// AWS imports
import { Amplify } from "aws-amplify";
import awsExports from '../src/aws-exports';
import amplifyConfig from '../src/amplifyconfiguration.json';

Amplify.configure(amplifyConfig, { ssr: true});

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}