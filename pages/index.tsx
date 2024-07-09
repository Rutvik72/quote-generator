import React, {useState} from 'react'

import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";

//Components
import { BackgroundImage1, BackgroundImage2, FootCon, GeneratorQuoteButton, GeneratorQuoteButtonText, GradientBackgroundCon, QuoteGeneratorCon, QuoteGeneratorInnerCon, QuoteGeneratorSubTitle, QuoteGeneratorTitle } from "@/components/QuoteGenerator/QuoteGeneratorElements";

//Assets
import Clouds1 from '@/assets/Clouds1.png'
import Clouds2 from '@/assets/Clouds2.png'

export default function Home() {
  const [numberOfQuotes, setNumberOfQuotes] = useState<Number | null>(0);

  return (
    <>
      <Head>
        <title>Quote Generator</title>
        <meta name="description" content="Quote generator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Background */}
      <GradientBackgroundCon>

        {/* Quote Generator Modal Pop up */}
        {/* <QuoteGeneratorModal/> */}

        {/* Quote Generator */}
        <QuoteGeneratorCon>
          <QuoteGeneratorInnerCon>
            <QuoteGeneratorTitle>
              Quote Generator
            </QuoteGeneratorTitle>

            <QuoteGeneratorSubTitle>
              Generator cool quotes
            </QuoteGeneratorSubTitle>

            <GeneratorQuoteButton>
              <GeneratorQuoteButtonText onClick={null}>
                Make Quote
              </GeneratorQuoteButtonText>
            </GeneratorQuoteButton>
            
          </QuoteGeneratorInnerCon>
        </QuoteGeneratorCon>

        {/* Background Images */}
        <BackgroundImage1
          src = {Clouds1}
          height="300"
          alt="cloudybackground1"
        />
        <BackgroundImage2
          src = {Clouds2}
          height="300"
          alt="cloudybackground2"
        />

        <FootCon>
          <>
            Quotes Generated: {numberOfQuotes}
            <br/>
            Developed by Rutvik
          </>
        </FootCon>

      </GradientBackgroundCon>
    </>
  );
}
