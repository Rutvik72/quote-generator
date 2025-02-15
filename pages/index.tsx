import React, {useEffect, useState} from 'react'

import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";


//Components
import { BackgroundImage1, BackgroundImage2, FootCon, FooterLink, GeneratorQuoteButton, GeneratorQuoteButtonText, GradientBackgroundCon, QuoteGeneratorCon, QuoteGeneratorInnerCon, QuoteGeneratorModalCon, QuoteGeneratorSubTitle, QuoteGeneratorTitle } from "@/components/QuoteGenerator/QuoteGeneratorElements";

//Assets
import Clouds1 from '@/assets/Clouds1.png'
import Clouds2 from '@/assets/Clouds2.png'
import { generateClient, GraphQLResult } from 'aws-amplify/api';
import { generateAQuote, quotesQueryName } from '@/src/graphql/queries';
import { responsiveFontSizes } from '@mui/material';
import QuoteGeneratorModal from '@/components/QuoteGenerator';


// Interface for our AppSync to Lambda JSON response
interface GenerateAQuoteData {
  generateAQuote: {
    statusCose: number;
    headers: {
      [key: string]: string
    };
    body: string;
  }
}


// interface for our DynamoDB object
interface UpdateQuoteInfoData {
  id: string;
  queryName: string;
  quotesGenerated: number
  createdAt: string;
  updatedAt: string;

}

// type guard for our fetch function
function isGraphQLResultForquotesQueryName(response: any): response is GraphQLResult<{
  quotesQueryName: {
    items: [UpdateQuoteInfoData];
  }
}> {
  return response.data && response.data.quotesQueryName && response.data.quotesQueryName.items;
}

export default function Home() {
  const [numberOfQuotes, setNumberOfQuotes] = useState<Number | null>(0);
  const [openGenerator, setOpenGenerator] = useState(false);
  const [processingQuote, setProcessingQuote] = useState(false);
  const [quoteReceived, setQuoteReceived] = useState<String | null>(null);
  
  // Function to fetch our DynamoDB object (quotes generated)
  const client = generateClient();
  const updateQuoteInfo = async () => {
    try {
      const response = await client.graphql<UpdateQuoteInfoData>({
        query: quotesQueryName,
        authMode: "iam",
        variables: {
          queryName: "LIVE"
        }
      })

      if (!isGraphQLResultForquotesQueryName(response)) {
        throw new Error('Unexpected response from client.graphql');
      }

      if (!response.data) {
        throw new Error('Response data is undefined');
      }

      const receivedNumberOfQuotes = response.data.quotesQueryName.items[0].quotesGenerated;
      setNumberOfQuotes(receivedNumberOfQuotes);

    } catch (error) {
      console.log('error getting quote data', error);
    }
  }

  useEffect(() => {
    updateQuoteInfo();
  }, [])

  // Function for quote generator modal
  const handleCloseGenerator = () => {
    setOpenGenerator(false);
    setProcessingQuote(false);
    setQuoteReceived(null); 
  }

  const handleOpenGenerator = async(e: React.SyntheticEvent) => {
    e.preventDefault();
    setOpenGenerator(true);
    setProcessingQuote(true);
    try {
      // Run Lambda Function
      const runFunction = "runFunction";
      const runFunctionStringified = JSON.stringify(runFunction);
      const response = await client.graphql<GenerateAQuoteData>({
        query: generateAQuote,
        authMode: "iam",
        variables: {
          input: runFunctionStringified,
        },
      });
      const responseStringified = JSON.stringify(response);
      const responseReStringified = JSON.stringify(responseStringified);
      const bodyIndex = responseReStringified.indexOf("body=") + 5;
      const bodyAndbase64 = responseReStringified.substring(bodyIndex);
      const bodyArray = bodyAndbase64.split(",");
      const body = bodyArray[0];
      console.log(body);
      setQuoteReceived(body);

      // End State
      setProcessingQuote(false);

      // Fetch if any new quotes were generated from counter
      updateQuoteInfo()

      // setTimeout(() => {
      //   setProcessingQuote(false);
      // }, 3000);
    } catch (error) {
      console.log('error generating quote', error);
      setProcessingQuote(false);
    }
  }

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
        <QuoteGeneratorModal
          open={openGenerator}
          close={handleCloseGenerator}
          processingQuote={processingQuote}
          setProcessingQuote={setProcessingQuote}
          quoteReceived={quoteReceived}
          setQuoteReceived={setQuoteReceived}
        
        />

        {/* Quote Generator */}
        <QuoteGeneratorCon>
          <QuoteGeneratorInnerCon>
            <QuoteGeneratorTitle>
              Quote Generator
            </QuoteGeneratorTitle>

            <QuoteGeneratorSubTitle>
              Cool Quote Generator Using <FooterLink href="https://zenquotes.io/" target="_blank" rel="noopener noreferrer">ZenQuotes API</FooterLink>.
            </QuoteGeneratorSubTitle>

            <GeneratorQuoteButton onClick={handleOpenGenerator} >
              <GeneratorQuoteButtonText>
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
