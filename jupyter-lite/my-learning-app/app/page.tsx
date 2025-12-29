import JupyterEmbed from './components/JupyterEmbed';
import styles from './page.module.css'; // We'll create this CSS file next

// Placeholder component for the left navigation (Course Items)
function CourseNavigation() {
  return (
    <div className={styles.navColumn}>
      <h2>Course Outline</h2>
      <p>Lesson 1: Introduction</p>
      <p>Lesson 2: Python Basics</p>
      {/* Add your actual course links/structure here */}
    </div>
  );
}

// Placeholder component for the video player
function VideoPlayer() {
  // In a real app, you'd embed a YouTube or video provider component here
  // For now, we'll use a placeholder
  return (
    <div className={styles.videoColumn}>
      <h2>Lesson Video</h2>
      <div style={{ padding: '56.25% 0 0 0', position: 'relative', backgroundColor: '#333' }}>
        <p style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white' }}>
          Video Player Placeholder (16:9)
        </p>
      </div>
      {/* Real video player component goes here */}
    </div>
  );
}

export default function HomePage() {
  return (
    // Apply the grid layout class to the main container
    <div className={styles.gridContainer}>
      {/* 1. Left Navigation (Ratio 1) */}
      <CourseNavigation />

      {/* 2. JupyterLite Iframe (Ratio 7) */}
      <JupyterEmbed />

      {/* 3. Video Player (Ratio 4) */}
      <VideoPlayer />
    </div>
  );
}