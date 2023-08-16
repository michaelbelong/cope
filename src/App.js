import React, { useRef, useEffect, useState } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/src/locomotive-scroll.scss';
import './App.css';

function App() {
    const videoRef = useRef(null);
    const [scrollInstance, setScrollInstance] = useState(null);

    useEffect(() => {
        setScrollInstance(
            new LocomotiveScroll({
                el: document.querySelector(".App"),
                smooth: true,
                lerp: 0.05
            })
        );

        return () => scrollInstance && scrollInstance.destroy();
    }, []);

    useEffect(() => {
        let lastScrollYPosition = 0;
        let lastScrollXPosition = 0;

        const handleScroll = ({ scroll }) => {
            if (videoRef.current) {
                let currentScrollYPosition = scroll.y;
                let currentScrollXPosition = scroll.x;

                let deltaY = currentScrollYPosition - lastScrollYPosition;
                let deltaX = currentScrollXPosition - lastScrollXPosition;

                // Calculate the time change based on scroll delta
                let timeChange = (deltaY + deltaX) * 0.002;
                videoRef.current.currentTime += timeChange;

                // Ensure the video loops correctly
                if (videoRef.current.currentTime >= videoRef.current.duration) {
                    videoRef.current.currentTime = 0;
                } else if (videoRef.current.currentTime < 0) {
                    videoRef.current.currentTime = videoRef.current.duration - 1;
                }

                lastScrollYPosition = currentScrollYPosition;
                lastScrollXPosition = currentScrollXPosition;
            }
        };

        if (scrollInstance) {
            scrollInstance.on('scroll', handleScroll);
        }
    
        // Clean up listener to avoid memory leaks
        return () => {
            if (scrollInstance) {
                scrollInstance.off('scroll', handleScroll);
            }
        };
    
    }, [scrollInstance]);

    return (
        <>
            <video 
                autoplay
                ref={videoRef} 
                preload="auto" 
                src="/CopeCharBlkv2.mp4" 
                className="video-styling"  // Add this class
            />


            <div className="App" data-scroll-container></div>
        </>
    );
}

export default App;
