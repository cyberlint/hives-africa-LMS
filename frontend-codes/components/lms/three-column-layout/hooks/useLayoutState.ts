"use client";
import { useState, useEffect } from 'react';
import type { Lecture } from '@/types/course';

interface LayoutState {
    showChapters: boolean;
    showContent: boolean;
    showVideo: boolean;
    isChaptersCollapsed: boolean;
    isVideoCollapsed: boolean;
}

export const useLayoutState = (activeLecture?: Lecture) => {
    const [layoutState, setLayoutState] = useState<LayoutState>({
        showChapters: true,
        showContent: true,
        showVideo: false,
        isChaptersCollapsed: true, // Closed by default
        isVideoCollapsed: false,
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isDesktop = window.innerWidth >= 1024;
            if (isDesktop) {
                setLayoutState(prev => ({ ...prev, isChaptersCollapsed: false }));
            }
        }
    }, []);

    useEffect(() => {
        if (!activeLecture) {
            setLayoutState(prev => ({ ...prev, showVideo: false }));
            return;
        }
        const hasVideo = Boolean(
            activeLecture.type === 'video' ||
            (activeLecture.videoUrl && activeLecture.videoUrl.length > 0)
        );
        setLayoutState(prev => ({ ...prev, showVideo: hasVideo }));
    }, [activeLecture]);

    const toggleChapters = () => {
        setLayoutState(prev => ({
            ...prev,
            isChaptersCollapsed: !prev.isChaptersCollapsed
        }));
    };

    const toggleVideo = () => {
        setLayoutState(prev => ({
            ...prev,
            isVideoCollapsed: !prev.isVideoCollapsed
        }));
    };

    return { ...layoutState, toggleChapters, toggleVideo };
};