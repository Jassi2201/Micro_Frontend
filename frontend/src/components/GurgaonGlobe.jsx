import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

const GurgaonGlobe = () => {
  const globeEl = useRef();
  const animationRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });

  const gurgaonCoords = {
    lat: 28.4595,
    lng: 77.0266,
    name: 'Gurgaon, India',
    size: 0.5,
  };

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
        pointsData={[gurgaonCoords]}
        pointRadius="size"
        pointColor={() => 'orange'}
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
        right: '10px',
      
        color: 'white',
        padding: '8px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 1000,
        maxWidth: '180px'
      }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '14px' }}>{gurgaonCoords.name}</h3>
        <p style={{ margin: '2px 0' }}>Lat: {gurgaonCoords.lat.toFixed(4)}°</p>
        <p style={{ margin: '2px 0' }}>Lng: {gurgaonCoords.lng.toFixed(4)}°</p>
      </div>
    </div>
  );
};

export default GurgaonGlobe;