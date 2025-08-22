import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

const GurgaonGlobe = () => {
  const globeEl = useRef();
  const animationRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

 

  // Get user's current location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding to get address from coordinates
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          setUserLocation({
            lat: latitude,
            lng: longitude,
            address: data.display_name || 'Address not available'
          });
        } catch (err) {
          setError('Failed to get address information');
          setUserLocation({
            lat: latitude,
            lng: longitude,
            address: 'Address lookup failed'
          });
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setError(`Error getting location: ${err.message}`);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, []);

  // Update dimensions when component mounts
  useEffect(() => {
    const updateSize = () => {
      if (globeEl.current && globeEl.current.parentElement) {
        const { width, height } = globeEl.current.parentElement.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (!globeEl.current) return;

    const controls = globeEl.current.controls();

    // Enable rotation
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.enableZoom = true;
    controls.enableRotate = true;

    // Initial camera view
    globeEl.current.pointOfView({ lat: 20, lng: 78, altitude: 2.5 }, 1000);

    // Animation loop
    const animate = () => {
      controls.update();
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '12px'
    }}>
      <Globe
        ref={globeEl}
        globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg"
        backgroundColor="rgba(0,0,0,0)"
        pointResolution={10}
        width={dimensions.width}
        height={dimensions.height}
        onGlobeReady={() => {
          if (globeEl.current) {
            globeEl.current.atmosphereAltitude(0);
          }
        }}
        onPointClick={(point) => {
          if (globeEl.current) {
            globeEl.current.pointOfView({
              lat: point.lat,
              lng: point.lng,
              altitude: 1.2
            }, 2000);
          }
        }}
      />

      {/* Info Panel */}
      <div style={{
        position: 'absolute',
        bottom: '10px', 
        right: '30px',    
        color: 'white',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '12px',
        zIndex: 1000,
        maxWidth: '250px'
      }}>
       
        
        {isLoading && <p style={{ margin: '10px 0 0 0', fontStyle: 'italic' }}>Detecting your location...</p>}
        
        {error && (
          <div style={{ marginTop: '10px', color: '#ff6b6b' }}>
            <p style={{ margin: '0' }}>{error}</p>
          </div>
        )}
        
        {userLocation && (
          <div style={{ marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '10px' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '13px' }}>Your Location:</h4>
            <p style={{ margin: '2px 0' }}>Lat: {userLocation.lat.toFixed(4)}°</p>
            <p style={{ margin: '2px 0' }}>Lng: {userLocation.lng.toFixed(4)}°</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '11px', wordBreak: 'break-word' }}>
              {userLocation.address}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GurgaonGlobe;