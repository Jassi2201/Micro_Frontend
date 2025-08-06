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

    window.speechSynthesis.onvoiceschanged = loadVoices;
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

    // Clean and prepare texts
    const cleanedTexts = texts.map(text => 
      text.replace(/_+/g, ' ')
         .replace(/\s+/g, ' ')
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
      
      // Configure utterance
      utterance.rate = 0.9; // Slightly slower
      utterance.pitch = 1;
      utterance.volume = 1;

      // Select a voice (prefer natural sounding voices)
      const preferredVoice = voices.find(v => 
        v.lang.includes('en') && 
        (v.name.includes('Natural') || v.name.includes('David') || v.name.includes('Zira'))
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onboundary = (event) => {
        console.log('Speech progress:', event.charIndex, 'of', event.utterance.text.length);
      };

      utterance.onend = () => {
        console.log('Finished speaking:', cleanedTexts[currentIndex]);
        currentIndex++;
        setTimeout(speakNext, 300); // Add small delay between utterances
      };

      utterance.onerror = (event) => {
        console.error('Speech error:', event.error, 'on text:', cleanedTexts[currentIndex]);
        setIsPlaying(false);
        
        // Fallback - try speaking without voice selection
        if (event.error === 'synthesis-failed') {
          const fallbackUtterance = new SpeechSynthesisUtterance(cleanedTexts[currentIndex]);
          fallbackUtterance.rate = 0.9;
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