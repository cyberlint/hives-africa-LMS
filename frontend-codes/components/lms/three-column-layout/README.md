# Three-Column Layout - DeepLearning.AI Inspired Design

## Overview

This is a modern, responsive three-column layout for the LMS lecture interface, inspired by DeepLearning.AI's elegant design. The layout provides an optimal learning experience with intelligent content organization and graceful degradation.

## Architecture

### Layout Structure

```
┌─────────────┬──────────────────────┬─────────────┐
│  Chapters   │   Content Viewer     │    Video    │
│  (Left)     │   (Center)           │   (Right)   │
│             │                      │             │
│  - Progress │   - Quiz             │  - Player   │
│  - Sections │   - Document         │  - Controls │
│  - Lectures │   - Resources        │  - Info     │
│             │   - Video Info       │             │
└─────────────┴──────────────────────┴─────────────┘
```

### Column Breakdown

#### 1. **Left Column - Chapter Navigation** (320px)
- **Purpose**: Course structure and progress tracking
- **Features**:
  - Collapsible sections
  - Progress bar with percentage
  - Lecture type icons
  - Completion indicators
  - Duration display
  - Active lecture highlighting

#### 2. **Center Column - Content Viewer** (Flexible)
- **Purpose**: Primary learning content
- **Supported Types**:
  - **Video**: Info card with attachments (video plays in right column)
  - **Quiz**: Interactive quiz interface
  - **Document**: PDF/reading material viewer
  - **Resource**: Downloadable resources and links
- **Features**:
  - Content type badges
  - Completion status
  - Rich content rendering
  - Scrollable content area

#### 3. **Right Column - Video Player** (480px, Conditional)
- **Purpose**: Video playback when available
- **Features**:
  - Full video controls
  - Quality settings
  - Playback speed
  - Captions toggle
  - Keyboard shortcuts
  - Auto-hide when no video

## Responsive Behavior

### Desktop (> 1024px)
- **3 Columns**: All panels visible when video exists
- **2 Columns**: Chapters + Content when no video
- **Collapsible**: Each panel can be collapsed independently

### Tablet (768px - 1024px)
- **2 Columns**: Prioritizes Content + Video OR Chapters + Content
- **Smart Layout**: Adapts based on content type
- **Touch Optimized**: Larger touch targets

### Mobile (< 768px)
- **1 Column**: Stacked vertical layout
- **Full Width**: Each section takes full width
- **Swipeable**: Easy navigation between sections

## Features

### 🎨 **Design**
- Clean, minimal aesthetic
- Dark theme optimized
- Smooth transitions
- Custom scrollbars
- Consistent spacing

### ⌨️ **Keyboard Shortcuts**
- `Space`: Play/Pause video
- `←/→`: Skip backward/forward (10s)
- `Alt + ←/→`: Previous/Next lecture
- `↑/↓`: Volume up/down
- `F`: Fullscreen
- `M`: Mute/Unmute

### ♿ **Accessibility**
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support
- High contrast support

### 📱 **Mobile Optimizations**
- Touch-friendly controls
- Responsive typography
- Optimized spacing
- Swipe gestures ready

## Component Structure

```
components/lms/three-column-layout/
├── ThreeColumnLayout.tsx          # Main orchestrator
├── ChapterNavigationPanel.tsx     # Left column
├── ContentViewerPanel.tsx         # Center column
├── VideoPanel.tsx                 # Right column
├── hooks/
│   ├── useLayoutState.ts          # Panel visibility logic
│   └── useResponsiveColumns.ts    # Breakpoint management
└── index.ts                       # Barrel exports
```

## Usage

```tsx
import { ThreeColumnLayout } from '@/components/lms/three-column-layout';

<ThreeColumnLayout
  courseData={courseData}
  activeLecture={activeLecture}
  activeLectureId={activeLectureId}
  completedLectures={completedLectures}
  onLectureSelect={handleLectureSelect}
  onMarkComplete={handleMarkComplete}
  onTimeUpdate={setCurrentTime}
  onVideoEnd={handleVideoEnd}
  onNext={goToNextLecture}
  onPrevious={goToPreviousLecture}
/>
```

## Props

### ThreeColumnLayout

| Prop                | Type                     | Description                    |
| ------------------- | ------------------------ | ------------------------------ |
| `courseData`        | `CourseData`             | Complete course information    |
| `activeLecture`     | `Lecture?`               | Currently selected lecture     |
| `activeLectureId`   | `number`                 | ID of active lecture           |
| `completedLectures` | `number[]`               | Array of completed lecture IDs |
| `onLectureSelect`   | `(id: number) => void`   | Lecture selection handler      |
| `onMarkComplete`    | `(id: number) => void`   | Mark lecture complete handler  |
| `onTimeUpdate`      | `(time: number) => void` | Video time update handler      |
| `onVideoEnd`        | `() => void`             | Video end handler              |
| `onNext`            | `() => void`             | Next lecture handler           |
| `onPrevious`        | `() => void`             | Previous lecture handler       |

## Content Type Handling

### Video Lectures
- Video plays in **right column**
- Info and attachments in **center column**
- Chapters in **left column**

### Quiz
- Quiz interface in **center column**
- Chapters in **left column**
- No video column (unless supplementary video exists)

### Documents/PDFs
- Document viewer in **center column**
- Chapters in **left column**
- No video column (unless supplementary video exists)

### Resources
- Resource list in **center column**
- Chapters in **left column**
- No video column (unless supplementary video exists)

## Graceful Degradation

The layout intelligently adapts when content is missing:

1. **No Video**: Right column hides, center expands
2. **No Content**: Shows empty state with helpful message
3. **Collapsed Panels**: Smooth transitions, toggle buttons remain
4. **Mobile**: Automatically stacks, maintains functionality

## Styling

### Color Palette
```css
--bg-primary: #0f0f0f;
--bg-secondary: #1a1a1a;
--border: #2a2a2a;
--text-primary: #ffffff;
--text-secondary: #a0a0a0;
--accent-blue: #3b82f6;
--accent-green: #10b981;
--hover: #252525;
```

### Spacing
- Panel padding: `1.5rem` (24px)
- Section spacing: `1rem` (16px)
- Element gap: `0.75rem` (12px)

## Performance

- **Lazy Loading**: Content loads on demand
- **Optimized Rendering**: Only active content renders
- **Smooth Animations**: 60fps transitions
- **Memory Efficient**: Cleans up on unmount

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- [ ] Picture-in-Picture for video
- [ ] Resizable columns
- [ ] Customizable layout preferences
- [ ] Offline support
- [ ] Video bookmarks
- [ ] Note-taking integration
- [ ] AI assistant panel (4th column option)

## Migration from Old Layout

The old two-column layout has been completely replaced. Key changes:

1. **Removed**: `CourseSidebar` component (replaced by `ChapterNavigationPanel`)
2. **Removed**: Video in content area (moved to `VideoPanel`)
3. **Added**: Dedicated content viewer for non-video content
4. **Added**: Responsive hooks for breakpoint management
5. **Simplified**: Page component (now just a placeholder)

## Troubleshooting

### Video not showing
- Check if `lecture.videoUrl` exists
- Verify `lecture.type === 'video'`
- Check browser console for errors

### Layout not responsive
- Verify window resize events are firing
- Check `useResponsiveColumns` hook
- Ensure CSS breakpoints match

### Content not rendering
- Check `ContentViewerPanel` props
- Verify content type is supported
- Check for TypeScript errors

## Credits

Design inspired by [DeepLearning.AI](https://www.deeplearning.ai/) - one of the best online learning platforms for AI education.

## License

Part of the Hives Africa LMS project.
