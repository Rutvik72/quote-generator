import React from 'react'
import Image from 'next/image'

interface ImageBlobProps {
    quoteReveived: string;
    blobUrl: string | null;
}

const ImageBlob = ({quoteReveived, blobUrl}: ImageBlobProps) => {
  return (
    <div>ImageBlob</div>
  )
}

export default ImageBlob