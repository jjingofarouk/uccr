import React from 'react';
import Lottie from 'lottie-react';
// Import your Lottie animation JSON file
// Replace this path with the actual path to your JSON file
import loadingAnimation from './loadingAnimation.json';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-40 h-40">
        <Lottie 
          animationData={loadingAnimation} 
          loop={true}
          autoplay={true}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;