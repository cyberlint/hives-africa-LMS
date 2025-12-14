"use client";
import { useRef } from 'react'
import Navbar from './components/Navbar'
import Section from './sections/FirstSection'
import SecondSection from './sections/SecondSection'
import Footer from './components/Footer'

function Waitlist() {

    const waitlistRef = useRef(null);
    const classesRef = useRef(null);
    const contactRef = useRef(null);

    const scrollToSection = (ref:any) => {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    };
  return (
    <>
      <div className="flex flex-col min-h-screen mx-auto p-4  max-w-[1400px] bg-white dark:bg-[#1d2026] transition-colors duration-300">
   
        <Navbar
          scrollToSection={scrollToSection}
          waitlistRef={waitlistRef}
          classesRef={classesRef}
          contactRef={contactRef}
        />
     
   
        <Section waitlistRef={waitlistRef} />
        <SecondSection
          classesRef={classesRef}
        />
          
        
      </div>
      <footer className='bg-amber-300 dark:bg-amber-700 transition-colors duration-300 p-4 md:p-8 '>
      <Footer contactRef={contactRef}/>
      </footer>
    </>
  );
}

export default Waitlist
