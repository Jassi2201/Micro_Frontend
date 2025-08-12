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

  // Function to split text into manageable chunks
  const splitTextIntoChunks = (text) => {
    // First split by major sections (numbered points)
    const sections = text.split(/\d+\.\s+/g).filter(section => section.trim());
    
    let chunks = [];
    
    sections.forEach(section => {
      // Split each section into paragraphs
      const paragraphs = section.split(/\n\s*\n/).filter(p => p.trim());
      
      paragraphs.forEach(paragraph => {
        // Clean up the paragraph
        let cleanParagraph = paragraph
          .replace(/_+/g, ' ')
          .replace(/\s+/g, ' ')
          .replace(/([a-zA-Z])\.([a-zA-Z])/g, '$1. $2')
          .replace(/,/g, ', ')
          .trim();
        
        // Split long paragraphs into sentences
        const sentences = cleanParagraph.split(/(?<=[.!?])\s+/);
        
        // Group sentences into chunks of ~200 characters
        let currentChunk = '';
        sentences.forEach(sentence => {
          if ((currentChunk + sentence).length <= 200) {
            currentChunk += (currentChunk ? ' ' : '') + sentence;
          } else {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = sentence;
          }
        });
        if (currentChunk) chunks.push(currentChunk);
      });
    });
    
    return chunks;
  };

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

    // Process all texts into chunks
    let allChunks = [];
    texts.forEach(text => {
      const chunks = splitTextIntoChunks(text);
      allChunks = [...allChunks, ...chunks];
    });

    console.log('Processed text chunks:', allChunks);
    setIsPlaying(true);

    let currentIndex = 0;

    const speakNext = () => {
      if (currentIndex >= allChunks.length) {
        setIsPlaying(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(allChunks[currentIndex]);
      
      // Configure utterance for Indian English characteristics
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      // Prioritize Indian English voices
      const indianVoices = voices.filter(v => 
        v.lang === 'en-IN' ||
        v.name.toLowerCase().includes('india') ||
        v.name.toLowerCase().includes('indian') ||
        v.name.toLowerCase().includes('ravi') ||
        v.name.toLowerCase().includes('neela') ||
        v.name.toLowerCase().includes('google हिन्दी') ||
        v.name.toLowerCase().includes('hin')
      );

      // Fallback to other English voices
      const fallbackVoices = voices.filter(v => 
        v.lang.includes('en') && 
        !v.lang.includes('en-US')
      );

      // Select the best available voice
      if (indianVoices.length > 0) {
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
      } else if (fallbackVoices.length > 0) {
        fallbackVoices.sort((a, b) => {
          const aScore = a.lang.includes('en-GB') ? 1 : 0;
          const bScore = b.lang.includes('en-GB') ? 1 : 0;
          return bScore - aScore;
        });
        utterance.voice = fallbackVoices[0];
        utterance.rate = 0.92;
        utterance.pitch = 1.1;
      }

      // Add Indian English specific pronunciation adjustments
      utterance.text = utterance.text
        .replace(/\bth\b/gi, 't')
        .replace(/v/g, 'w')
        .replace(/\bthe\b/gi, 'da')
        .replace(/\bthat\b/gi, 'dat');

      utterance.onend = () => {
        console.log('Finished speaking chunk:', currentIndex);
        currentIndex++;
        setTimeout(speakNext, 300); // Short pause between chunks
      };

      utterance.onerror = (event) => {
        console.error('Speech error:', event.error);
        setIsPlaying(false);
        
        // Fallback - try speaking without voice selection
        if (event.error === 'synthesis-failed') {
          const fallbackUtterance = new SpeechSynthesisUtterance(allChunks[currentIndex]);
          fallbackUtterance.rate = 0.95;
          fallbackUtterance.pitch = 1.05;
          window.speechSynthesis.speak(fallbackUtterance);
        }
      };

      try {
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