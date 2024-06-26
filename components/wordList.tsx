// components/WordList.tsx

import React from 'react';

const WordList: React.FC = () => {
  return (
    <div className="p-8 border border-white rounded-md bg-white/20 bg-opacity-25 backdrop-blur-lg backdrop-filter shadow-lg m-8">
      <h1 className="text-3xl font-extrabold text-center mb-2">AI-Generated NFT</h1>
      <p className="text-center text-black mb-4 italic">
        Experience the future of digital art with AI-Generated NFTs. Using advanced algorithms and machine learning techniques, we create unique, one-of-a-kind digital assets that you can own and trade. Each NFT is a masterpiece, generated by artificial intelligence to ensure its exclusivity and value.
      </p>
    </div>
  );
};

export default WordList;
