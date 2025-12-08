import { useState, useEffect } from 'react';

type BreakpointType = 'mobile' | 'tablet' | 'desktop';

interface ResponsiveConfig {
    breakpoint: BreakpointType;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    columnsToShow: number;
}

export const useResponsiveColumns = (hasVideo: boolean): ResponsiveConfig => {
    const [breakpoint, setBreakpoint] = useState<BreakpointType>('desktop');

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;

            if (width < 768) {
                setBreakpoint('mobile');
            } else if (width < 1024) {
                setBreakpoint('tablet');
            } else {
                setBreakpoint('desktop');
            }
        };

        // Initial check
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = breakpoint === 'mobile';
    const isTablet = breakpoint === 'tablet';
    const isDesktop = breakpoint === 'desktop';

    // Determine how many columns to show
    let columnsToShow = 3;
    if (isMobile) {
        columnsToShow = 1;
    } else if (isTablet) {
        columnsToShow = hasVideo ? 2 : 2; // Chapters + Content OR Content + Video
    } else {
        columnsToShow = hasVideo ? 3 : 2; // All three OR Chapters + Content
    }

    return {
        breakpoint,
        isMobile,
        isTablet,
        isDesktop,
        columnsToShow,
    };
};
