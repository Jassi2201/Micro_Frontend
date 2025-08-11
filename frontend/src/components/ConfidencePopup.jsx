import { useEffect } from 'react';

const ConfidencePopup = ({ 
  isOpen, 
  onClose, 
  onConfidenceSelect, 
  questionId,
  currentAnswer 
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const speak = () => {
      if (!('speechSynthesis' in window)) {
        console.log('Text-to-speech not supported');
        return;
      }

      // Prepare the text to be spoken
      const text = `You selected ${currentAnswer}. How confident are you in your answer? Choose "Sure" if you're confident or "Not Sure" if you're uncertain.`;
      
      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure for Hindi-accented English
      utterance.rate = 0.95;  // Slightly slower
      utterance.pitch = 1.05; // Slightly higher pitch
      utterance.volume = 1;

      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      
      // Find Hindi or Indian English voices
      const hindiAccentVoices = voices.filter(v => 
        v.lang === 'en-IN' || // Indian English
        v.lang === 'hi-IN' || // Hindi
        v.name.toLowerCase().includes('india') ||
        v.name.toLowerCase().includes('indian') ||
        v.name.toLowerCase().includes('ravi') ||
        v.name.toLowerCase().includes('neela') ||
        v.name.toLowerCase().includes('google हिन्दी') ||
        v.name.toLowerCase().includes('hin')
      );

      // Fallback to other English voices (non-US)
      const fallbackVoices = voices.filter(v => 
        v.lang.includes('en') && 
        !v.lang.includes('en-US')
      );

      // Select best available voice
      if (hindiAccentVoices.length > 0) {
        // Sort by most likely to be good Hindi-accented English
        hindiAccentVoices.sort((a, b) => {
          const aScore = a.lang === 'en-IN' ? 3 : 
                       a.lang === 'hi-IN' ? 2 :
                       a.name.toLowerCase().includes('ravi') ? 2 : 
                       a.name.toLowerCase().includes('india') ? 1 : 0;
          const bScore = b.lang === 'en-IN' ? 3 : 
                       b.lang === 'hi-IN' ? 2 :
                       b.name.toLowerCase().includes('ravi') ? 2 : 
                       b.name.toLowerCase().includes('india') ? 1 : 0;
          return bScore - aScore;
        });
        utterance.voice = hindiAccentVoices[0];
      } else if (fallbackVoices.length > 0) {
        // Prefer UK English as it's closer to Indian English than US
        fallbackVoices.sort((a, b) => {
          const aScore = a.lang.includes('en-GB') ? 1 : 0;
          const bScore = b.lang.includes('en-GB') ? 1 : 0;
          return bScore - aScore;
        });
        utterance.voice = fallbackVoices[0];
        utterance.rate = 0.92;
        utterance.pitch = 1.1;
      }

      // Apply Hindi-accent pronunciation adjustments
      utterance.text = utterance.text
        .replace(/\bth\b/gi, 't') // "th" -> "t"
        .replace(/v/g, 'w')       // "v" -> "w"
        .replace(/\bthe\b/gi, 'da') // "the" -> "da"
        .replace(/\bthat\b/gi, 'dat'); // "that" -> "dat"

      // Speak the text
      window.speechSynthesis.speak(utterance);
    };

    // Handle voice loading
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = speak;
    } else {
      speak();
    }

    // Cleanup
    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [isOpen, currentAnswer]);

  const handleSelect = (isSure) => {
    window.speechSynthesis.cancel();
    onConfidenceSelect(questionId, isSure);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4" style={{background : '#00000091'}}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-semibold mb-4">Confirmation</h3>
        <p className="mb-4">You selected: <strong>{currentAnswer}</strong></p>
        <p className="mb-6">How confident are you in your answer?</p>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={() => handleSelect(true)}
            className="flex-1 py-3 px-4 rounded-lg bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
          >
            Sure
          </button>
          <button
            onClick={() => handleSelect(false)}
            className="flex-1 py-3 px-4 rounded-lg bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors"
          >
            Not Sure
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfidencePopup;