import { useState, useEffect } from 'react';

const AudioButton = ({ texts }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState([]);

  // Clean up function
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    // Some browsers need this event listener
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    // Load immediately if voices are already available
    loadVoices();

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handlePlay = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Clean and prepare texts with Indian English specific modifications
    const cleanedTexts = texts.map(text => 
      text.replace(/_+/g, ' ')
         .replace(/\s+/g, ' ')
         .replace(/([a-zA-Z])\.([a-zA-Z])/g, '$1. $2') // Add space after abbreviations
         .replace(/,/g, ', ')
         .trim()
    );

    console.log('Cleaned texts:', cleanedTexts);
    setIsPlaying(true);

    let currentIndex = 0;

    const speakNext = () => {
      if (currentIndex >= cleanedTexts.length) {
        setIsPlaying(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanedTexts[currentIndex]);
      
      // Configure utterance for Indian English characteristics
      utterance.rate = 0.95; // Slightly slower for clarity
      utterance.pitch = 1.05; // Slightly higher pitch common in Indian English
      utterance.volume = 1;

      // Prioritize Indian English voices
      const indianVoices = voices.filter(v => 
        v.lang === 'en-IN' || // Indian English locale
        v.name.toLowerCase().includes('india') ||
        v.name.toLowerCase().includes('indian') ||
        v.name.toLowerCase().includes('ravi') || // Common Indian voice name
        v.name.toLowerCase().includes('neela') || // Another common Indian voice
        v.name.toLowerCase().includes('google हिन्दी') || // Hindi voices often work
        v.name.toLowerCase().includes('hin') // Hindi abbreviation
      );

      // Fallback to other English voices that might sound closer to Indian accent
      const fallbackVoices = voices.filter(v => 
        v.lang.includes('en') && 
        !v.lang.includes('en-US') // Avoid American voices
      );

      // Select the best available voice
      if (indianVoices.length > 0) {
        // Sort by most likely to be good Indian English
        indianVoices.sort((a, b) => {
          const aScore = a.lang === 'en-IN' ? 3 : 
                       a.name.toLowerCase().includes('ravi') ? 2 : 
                       a.name.toLowerCase().includes('india') ? 1 : 0;
          const bScore = b.lang === 'en-IN' ? 3 : 
                       b.name.toLowerCase().includes('ravi') ? 2 : 
                       b.name.toLowerCase().includes('india') ? 1 : 0;
          return bScore - aScore;
        });
        
        utterance.voice = indianVoices[0];
        console.log('Using Indian English voice:', indianVoices[0].name);
      } else if (fallbackVoices.length > 0) {
        // Prefer UK English as it's closer to Indian English than US
        fallbackVoices.sort((a, b) => {
          const aScore = a.lang.includes('en-GB') ? 1 : 0;
          const bScore = b.lang.includes('en-GB') ? 1 : 0;
          return bScore - aScore;
        });
        
        utterance.voice = fallbackVoices[0];
        console.log('Fallback to English voice:', fallbackVoices[0].name);
        
        // Adjust settings to make it sound more Indian-like
        utterance.rate = 0.92;
        utterance.pitch = 1.1;
      }

      // Add Indian English specific pronunciation adjustments
      utterance.text = utterance.text
        .replace(/\bth\b/gi, 't') // Common Indian pronunciation of "th" as "t"
        .replace(/v/g, 'w') // Some Indian accents pronounce "v" as "w"
        .replace(/\bthe\b/gi, 'da') // Common pronunciation of "the" as "da"
        .replace(/\bthat\b/gi, 'dat'); // Common pronunciation of "that" as "dat"

      utterance.onboundary = (event) => {
        console.log('Speech progress:', event.charIndex, 'of', event.utterance.text.length);
      };

      utterance.onend = () => {
        console.log('Finished speaking:', cleanedTexts[currentIndex]);
        currentIndex++;
        setTimeout(speakNext, 500); // Slightly longer delay between utterances
      };

      utterance.onerror = (event) => {
        console.error('Speech error:', event.error, 'on text:', cleanedTexts[currentIndex]);
        setIsPlaying(false);
        
        // Fallback - try speaking without voice selection
        if (event.error === 'synthesis-failed') {
          const fallbackUtterance = new SpeechSynthesisUtterance(cleanedTexts[currentIndex]);
          fallbackUtterance.rate = 0.95;
          fallbackUtterance.pitch = 1.05;
          window.speechSynthesis.speak(fallbackUtterance);
        }
      };

      try {
        console.log('Attempting to speak:', cleanedTexts[currentIndex]);
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Speak error:', error);
        setIsPlaying(false);
      }
    };

    speakNext();
  };

  return (
    <button
      onClick={handlePlay}
      className="ml-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
      aria-label={isPlaying ? 'Stop audio' : 'Play audio'}
      disabled={!('speechSynthesis' in window)}
    >
      {isPlaying ? (
        <>
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="ml-1 text-sm">Stop</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
          </svg>
          <span className="ml-1 text-sm">Listen</span>
        </>
      )}
    </button>
  );
};

export default AudioButton;