'use client'; // Make this a Client Component

import React, { useState, useEffect, useRef } from 'react'; // Import hooks
import { FaXTwitter, FaInstagram, FaGithub, FaDiscord, FaYoutube, FaReddit } from 'react-icons/fa6';
import Link from 'next/link';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' | null }>({
    message: '',
    type: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State to track which sections should be blurred (index corresponds to section)
  const [blurredSections, setBlurredSections] = useState<boolean[]>([false, false, false, false, false]);

  // Refs for each sticky section
  const sectionRefs = [
    useRef<HTMLElement>(null), // 0: Hero
    useRef<HTMLElement>(null), // 1: Goals
    useRef<HTMLElement>(null), // 2: Features
    useRef<HTMLElement>(null), // 3: Metrics
    useRef<HTMLElement>(null), // 4: Questions
  ];

  useEffect(() => {
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      return; // Exit if IntersectionObserver is not supported
    }

    // Store intersection status and position for quicker lookup
    const intersectionData = new Map<Element, { isIntersecting: boolean; top: number }>();

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Update the intersection data map with the latest entries
      entries.forEach(entry => {
        intersectionData.set(entry.target, {
          isIntersecting: entry.isIntersecting,
          top: entry.boundingClientRect.top,
        });
      });

      // Recalculate the entire blur state based on current data
      const newBlurredState = [false, false, false, false, false]; // Start fresh

      // Loop through sections that *can* be blurred (Hero to Metrics)
      for (let i = 0; i < sectionRefs.length - 1; i++) {
        const nextSectionRef = sectionRefs[i + 1]; // The section that covers section `i`

        if (nextSectionRef.current) {
          const nextSectionData = intersectionData.get(nextSectionRef.current);

          if (nextSectionData) {
            // Check if the *next* section (i+1) is near the top of the viewport
            const isNextNearTop = nextSectionData.top <= 5 && nextSectionData.top >= -5;
            
            // Section `i` should be blurred IF the next section (i+1) is intersecting AND near the top
            const shouldCurrentBeBlurred = nextSectionData.isIntersecting && isNextNearTop;
            
            newBlurredState[i] = shouldCurrentBeBlurred;
          } else {
             // If we haven't observed the next section yet, assume current isn't blurred by it
             newBlurredState[i] = false;
          }
        } else {
            // Should not happen if refs are correct, but defensively set to false
            newBlurredState[i] = false;
        }
      }

      // Only update state if it actually changed to prevent infinite loops
      if (JSON.stringify(newBlurredState) !== JSON.stringify(blurredSections)) {
        setBlurredSections(newBlurredState);
      }
    };

    const observerOptions = {
      root: null, // Use the viewport
      rootMargin: '0px',
      threshold: [0, 0.01, 0.99, 1.0] // Trigger frequently near edges
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionRefs.forEach(ref => {
      if (ref.current) {
        // Initial population of intersectionData map
        intersectionData.set(ref.current, { isIntersecting: false, top: window.innerHeight }); 
        observer.observe(ref.current);
      }
    });

    // Cleanup observer on component unmount
    return () => {
       sectionRefs.forEach(ref => {
          if (ref.current) {
              observer.unobserve(ref.current);
          }
       });
       observer.disconnect();
    };
    // Dependency array includes blurredSections to ensure state updates trigger re-checks if needed,
    // although the core logic now relies less on the previous state.
  }, [sectionRefs]); // Removed blurredSections from dependencies

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ message: '', type: null });

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ message: data.message, type: 'success' });
        setEmail(''); // Clear the input on success
      } else {
        setStatus({ message: data.error, type: 'error' });
      }
    } catch (error) {
      setStatus({
        message: 'Failed to subscribe. Please try again later.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update the form in both mobile and desktop sections
  const emailForm = (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-2.5 rounded-md text-white bg-black/30 placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200 w-full sm:w-auto sm:flex-grow"
        aria-label="Email for updates"
        disabled={isSubmitting}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto px-6 py-2.5 rounded-md border border-secondary text-secondary font-semibold font-poppins hover:bg-secondary/50 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Subscribing...' : 'Notify Me'}
      </button>
    </form>
  );

  const statusMessage = status.message && (
    <p className={`mt-2 text-sm ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
      {status.message}
    </p>
  );

  return (
    <main className="relative w-full bg-primary">
      {/* Container that enables sticky behavior only on desktop */}
      <div className="md:hidden">
        {/* Mobile Layout - Simple flowing sections */}
        <section className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-secondary font-poppins">
              Virtara
            </h1>
            <p className="text-lg text-gray-300 font-inter max-w-2xl mx-auto">
              Exercise Analysis, using state of the art pose analysis and large language models to provide objective feedback to enhance performance.
            </p>
            <div className="pt-2">
              <p className="text-base text-gray-400 font-inter mb-2">Stay updated:</p>
              {emailForm}
              {statusMessage}
            </div>
            <h2 className="text-3xl font-semibold text-white font-poppins pt-4">
              Coming Soon
            </h2>
            <div className="flex justify-center gap-6 pt-4">
              <a href="https://www.twitter.com/virtara_" target="_blank" rel="noopener noreferrer" aria-label="X (formerly Twitter)" className="text-secondary hover:text-white transition-colors duration-200">
                <FaXTwitter size={24} />
              </a>
              <a href="https://www.instagram.com/virtara_" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-secondary hover:text-white transition-colors duration-200">
                <FaInstagram size={24} />
              </a>
              <a href="https://www.github.com/virtara" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-secondary hover:text-white transition-colors duration-200">
                <FaGithub size={24} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="text-secondary hover:text-white transition-colors duration-200">
                <FaDiscord size={24} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-secondary hover:text-white transition-colors duration-200">
                <FaYoutube size={24} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Reddit" className="text-secondary hover:text-white transition-colors duration-200">
                <FaReddit size={24} />
              </a>
            </div>
          </div>
        </section>

        {/* Goals Section - Mobile */}
        <section className="py-16 px-4">
          <div className="w-full max-w-6xl mx-auto bg-black/30 backdrop-blur-lg rounded-2xl p-6">
            <h2 className="text-3xl font-bold text-center mb-8 font-poppins">
              Goals <span className="text-secondary">and</span> Objectives
            </h2>
            <div className="space-y-4">
              {/* Goal Cards */}
              <div className="bg-[#111]/50 backdrop-blur-sm p-6 rounded-xl border border-secondary/20">
                <h3 className="text-xl font-semibold mb-3 font-poppins text-secondary">
                  Impartial Analysis
                </h3>
                <p className="font-inter text-gray-300">
                  Deliver technical feedback using pose analysis, biomechanics, and AI for actionable insights.
                </p>
              </div>
              <div className="bg-[#111]/50 backdrop-blur-sm p-6 rounded-xl border border-secondary/20">
                <h3 className="text-xl font-semibold mb-3 font-poppins text-secondary">
                  Progress Tracking
                </h3>
                <p className="font-inter text-gray-300">
                  Track key metrics (bar path, velocity, RIR) and visualize trends over time.
                </p>
              </div>
              <div className="bg-[#111]/50 backdrop-blur-sm p-6 rounded-xl border border-secondary/20">
                <h3 className="text-xl font-semibold mb-3 font-poppins text-secondary">
                  Real-Time Feedback
                </h3>
                <p className="font-inter text-gray-300">
                  Provide instant feedback during training and enable VAR-style meet verification.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Mobile */}
        <section className="py-16 px-4">
          <div className="w-full max-w-6xl mx-auto bg-black/30 backdrop-blur-lg rounded-2xl p-6">
            <h2 className="text-3xl font-bold text-center mb-8 font-poppins">
              <span className="text-secondary">Core</span> Features
            </h2>
            <div className="space-y-4">
              <div className="bg-[#111]/50 backdrop-blur-sm p-6 rounded-xl border border-secondary/20">
                <h3 className="text-xl font-semibold mb-3 font-poppins text-secondary">
                  Pose Analysis
                </h3>
                <p className="font-inter text-gray-300">
                  Get technical feedback on bar path, joint angles, velocity, symmetry, and more using advanced pose estimation.
                </p>
              </div>
              <div className="bg-[#111]/50 backdrop-blur-sm p-6 rounded-xl border border-secondary/20">
                <h3 className="text-xl font-semibold mb-3 font-poppins text-secondary">
                  AI-Powered Insights
                </h3>
                <p className="font-inter text-gray-300">
                  Leverage custom LLMs and Google Gemini for actionable insights tailored to your technique, goals, and injury prevention.
                </p>
              </div>
            </div>
            <div className="text-center mt-8">
              <Link href="/features" className="inline-block px-6 py-2.5 rounded-md border border-secondary text-secondary font-semibold font-poppins hover:bg-secondary/50 hover:text-white transition-colors duration-200 text-base">
                Learn More About Features
              </Link>
            </div>
          </div>
        </section>

        {/* Metrics Section - Mobile */}
        <section className="py-16 px-4">
          <div className="w-full max-w-6xl mx-auto bg-black/30 backdrop-blur-lg rounded-2xl p-6">
            <h2 className="text-3xl font-bold text-center mb-8 font-poppins">
              Key <span className="text-secondary">Metrics</span>
            </h2>
            <div className="space-y-4">
              <div className="bg-[#111]/50 backdrop-blur-sm p-6 rounded-xl border border-secondary/20">
                <h3 className="text-xl font-semibold mb-3 font-poppins text-secondary">
                  Pose Accuracy
                </h3>
                <p className="font-inter text-gray-300">
                  Target: 95% accuracy for pose detection across diverse body types.
                </p>
              </div>
              <div className="bg-[#111]/50 backdrop-blur-sm p-6 rounded-xl border border-secondary/20">
                <h3 className="text-xl font-semibold mb-3 font-poppins text-secondary">
                  Real-Time Latency
                </h3>
                <p className="font-inter text-gray-300">
                  Target: Feedback latency under 500ms for live sessions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Questions Section - Mobile */}
        <section className="py-16 px-4 pb-32">
          <div className="w-full max-w-6xl mx-auto bg-black/30 backdrop-blur-lg rounded-2xl p-6">
            <h2 className="text-3xl font-bold text-center mb-8 font-poppins">
              Open <span className="text-secondary">Questions</span>
            </h2>
            <div className="space-y-3">
              {[
                "What specific datasets will be used to train the custom LLM?",
                "Should Google Gemini AI be the default reasoning engine, or selectable?",
                "What additional features should be prioritized for the calorie counter?",
              ].map((question, index) => (
                <p 
                  key={index} 
                  className={`font-inter text-base p-3 rounded ${index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}`}
                >
                  <span className="text-secondary mr-2">?</span> {question}
                </p>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Desktop Layout - Original sticky sections */}
      <div className="hidden md:block">
        {/* Hero Section - index 0 */}
        <section 
          ref={sectionRefs[0]} 
          className={`sticky top-0 min-h-screen flex flex-col items-center justify-center bg-primary p-10 text-center z-10 transition-filter duration-300 ease-in-out ${blurredSections[0] ? 'blur-underneath' : ''}`}>
          <div className="space-y-6">
            <h1 className="text-6xl font-bold text-secondary font-poppins">
              Virtara
            </h1>
            <p className="text-xl text-gray-300 font-inter max-w-2xl mx-auto">
              Exercise Analysis, using state of the art pose analysis and large language models to provide objective feedback to enhance performance.
            </p>
            <div className="pt-4">
              <p className="text-lg text-gray-400 font-inter mb-2">Stay updated:</p>
              {emailForm}
              {statusMessage}
            </div>
            <h2 className="text-4xl font-semibold text-white font-poppins pt-4">
              Coming Soon
            </h2>
            <div className="flex justify-center gap-6 pt-4">
              <a href="https://www.twitter.com/virtara_" target="_blank" rel="noopener noreferrer" aria-label="X (formerly Twitter)" className="text-secondary hover:text-white transition-colors duration-200">
                <FaXTwitter size={24} />
              </a>
              <a href="https://www.instagram.com/virtara_" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-secondary hover:text-white transition-colors duration-200">
                <FaInstagram size={24} />
              </a>
              <a href="https://www.github.com/virtara" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-secondary hover:text-white transition-colors duration-200">
                <FaGithub size={24} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="text-secondary hover:text-white transition-colors duration-200">
                <FaDiscord size={24} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-secondary hover:text-white transition-colors duration-200">
                <FaYoutube size={24} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Reddit" className="text-secondary hover:text-white transition-colors duration-200">
                <FaReddit size={24} />
              </a>
            </div>
          </div>
        </section>

        {/* Goals Section - index 1 */}
        <section 
          ref={sectionRefs[1]} 
          className={`sticky top-0 min-h-screen flex flex-col justify-center items-center bg-primary text-white p-10 lg:p-20 z-20 mask-fade-bottom transition-filter duration-300 ease-in-out ${blurredSections[1] ? 'blur-underneath' : ''}`}>
          <div className="w-full max-w-6xl bg-black/30 backdrop-blur-lg rounded-2xl p-10 lg:p-16 opacity-0 translate-y-10 animate-fade-in-up">
            <h2 className="text-5xl font-bold text-center mb-16 font-poppins">
              Goals <span className="text-secondary">and</span> Objectives
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Goal Cards */}
              <div className="group bg-[#111]/50 backdrop-blur-sm p-8 rounded-xl border border-secondary/20 hover:border-secondary transition-all duration-300 shadow-lg hover:shadow-secondary/20">
                <h3 className="text-2xl font-semibold mb-4 font-poppins text-secondary group-hover:text-white transition-colors duration-300">
                  Impartial Analysis
                </h3>
                <p className="font-inter text-gray-300 group-hover:text-white transition-colors duration-300">
                  Deliver technical feedback using pose analysis, biomechanics, and AI for actionable insights.
                </p>
              </div>
              <div className="group bg-[#111]/50 backdrop-blur-sm p-8 rounded-xl border border-secondary/20 hover:border-secondary transition-all duration-300 shadow-lg hover:shadow-secondary/20">
                <h3 className="text-2xl font-semibold mb-4 font-poppins text-secondary group-hover:text-white transition-colors duration-300">
                  Progress Tracking
                </h3>
                <p className="font-inter text-gray-300 group-hover:text-white transition-colors duration-300">
                  Track key metrics (bar path, velocity, RIR) and visualize trends over time.
                </p>
              </div>
              <div className="group bg-[#111]/50 backdrop-blur-sm p-8 rounded-xl border border-secondary/20 hover:border-secondary transition-all duration-300 shadow-lg hover:shadow-secondary/20">
                <h3 className="text-2xl font-semibold mb-4 font-poppins text-secondary group-hover:text-white transition-colors duration-300">
                  Real-Time Feedback
                </h3>
                <p className="font-inter text-gray-300 group-hover:text-white transition-colors duration-300">
                  Provide instant feedback during training and enable VAR-style meet verification.
                </p>
              </div>
              <div className="group bg-[#111]/50 backdrop-blur-sm p-8 rounded-xl border border-secondary/20 hover:border-secondary transition-all duration-300 shadow-lg hover:shadow-secondary/20">
                <h3 className="text-2xl font-semibold mb-4 font-poppins text-secondary group-hover:text-white transition-colors duration-300">
                  Nutrition Integration
                </h3>
                <p className="font-inter text-gray-300 group-hover:text-white transition-colors duration-300">
                  Include calorie counting with barcode scanning and AI food picture analysis.
                </p>
              </div>
              <div className="group bg-[#111]/50 backdrop-blur-sm p-8 rounded-xl border border-secondary/20 hover:border-secondary transition-all duration-300 shadow-lg hover:shadow-secondary/20">
                <h3 className="text-2xl font-semibold mb-4 font-poppins text-secondary group-hover:text-white transition-colors duration-300">
                  Community Building
                </h3>
                <p className="font-inter text-gray-300 group-hover:text-white transition-colors duration-300">
                  Foster collaboration between athletes and coaches through shared progress and tools.
                </p>
              </div>
              <div className="group bg-[#111]/50 backdrop-blur-sm p-8 rounded-xl border border-secondary/20 hover:border-secondary transition-all duration-300 shadow-lg hover:shadow-secondary/20">
                <h3 className="text-2xl font-semibold mb-4 font-poppins text-secondary group-hover:text-white transition-colors duration-300">
                  Open Source
                </h3>
                <p className="font-inter text-gray-300 group-hover:text-white transition-colors duration-300">
                  Build a transparent, collaborative platform encouraging contributions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - index 2 */}
        <section 
          ref={sectionRefs[2]} 
          className={`sticky top-0 min-h-screen flex flex-col justify-center items-center bg-primary text-white p-10 lg:p-20 z-30 mask-fade-bottom transition-filter duration-300 ease-in-out ${blurredSections[2] ? 'blur-underneath' : ''}`}>
          <div className="w-full max-w-6xl bg-black/30 backdrop-blur-lg rounded-2xl p-10 lg:p-16 opacity-0 translate-y-10 animate-fade-in-up">
            <h2 className="text-5xl font-bold text-center mb-16 font-poppins">
              <span className="text-secondary">Core</span> Features
            </h2>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <div className="group bg-[#111]/50 backdrop-blur-sm p-8 rounded-xl border border-secondary/20 hover:border-secondary transition-all duration-300 shadow-lg hover:shadow-secondary/20">
                <h3 className="text-2xl font-semibold mb-4 font-poppins text-secondary group-hover:text-white transition-colors duration-300">
                  Pose Analysis
                </h3>
                <p className="font-inter text-gray-300 group-hover:text-white transition-colors duration-300">
                  Get technical feedback on bar path, joint angles, velocity, symmetry, and more using advanced pose estimation.
                </p>
              </div>
              <div className="group bg-[#111]/50 backdrop-blur-sm p-8 rounded-xl border border-secondary/20 hover:border-secondary transition-all duration-300 shadow-lg hover:shadow-secondary/20">
                <h3 className="text-2xl font-semibold mb-4 font-poppins text-secondary group-hover:text-white transition-colors duration-300">
                  Progress Tracking
                </h3>
                <p className="font-inter text-gray-300 group-hover:text-white transition-colors duration-300">
                  Visualize your improvements over time with detailed metrics and charts. Monitor trends and set performance goals.
                </p>
              </div>
              <div className="group bg-[#111]/50 backdrop-blur-sm p-8 rounded-xl border border-secondary/20 hover:border-secondary transition-all duration-300 shadow-lg hover:shadow-secondary/20">
                <h3 className="text-2xl font-semibold mb-4 font-poppins text-secondary group-hover:text-white transition-colors duration-300">
                  AI-Powered Insights
                </h3>
                <p className="font-inter text-gray-300 group-hover:text-white transition-colors duration-300">
                  Leverage custom LLMs and Google Gemini for actionable insights tailored to your technique, goals, and injury prevention.
                </p>
              </div>
              <div className="group bg-[#111]/50 backdrop-blur-sm p-8 rounded-xl border border-secondary/20 hover:border-secondary transition-all duration-300 shadow-lg hover:shadow-secondary/20">
                <h3 className="text-2xl font-semibold mb-4 font-poppins text-secondary group-hover:text-white transition-colors duration-300">
                  Nutrition Tracking
                </h3>
                <p className="font-inter text-gray-300 group-hover:text-white transition-colors duration-300">
                  Integrated calorie counter with barcode scanning and AI food picture analysis to monitor your diet effectively.
                </p>
              </div>
            </div>
            <div className="text-center mt-12">
              <Link href="/features" className="inline-block px-8 py-3 rounded-md border border-secondary text-secondary font-semibold font-poppins hover:bg-secondary/50 hover:text-white transition-colors duration-200 text-base">
                Learn More About Features
              </Link>
            </div>
          </div>
        </section>

        {/* Metrics Section - index 3 */}
        <section 
          ref={sectionRefs[3]} 
          className={`sticky top-0 min-h-screen flex flex-col justify-center items-center bg-primary text-white p-10 lg:p-20 z-40 mask-fade-bottom transition-filter duration-300 ease-in-out ${blurredSections[3] ? 'blur-underneath' : ''}`}>
          <div className="w-full max-w-6xl bg-black/30 backdrop-blur-lg rounded-2xl p-10 lg:p-16 opacity-0 translate-y-10 animate-fade-in-up">
            <h2 className="text-5xl font-bold text-center mb-16 font-poppins">
              Key <span className="text-secondary">Metrics</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              <div className="group bg-[#111]/50 backdrop-blur-sm p-8 rounded-xl border border-secondary/20 hover:border-secondary transition-all duration-300 shadow-lg hover:shadow-secondary/20">
                <h3 className="text-2xl font-semibold mb-4 font-poppins text-secondary group-hover:text-white transition-colors duration-300">
                  Pose Accuracy
                </h3>
                <p className="font-inter text-gray-300 group-hover:text-white transition-colors duration-300">
                  Target: 95% accuracy for pose detection across diverse body types.
                </p>
              </div>
              <div className="group bg-[#111]/50 backdrop-blur-sm p-8 rounded-xl border border-secondary/20 hover:border-secondary transition-all duration-300 shadow-lg hover:shadow-secondary/20">
                <h3 className="text-2xl font-semibold mb-4 font-poppins text-secondary group-hover:text-white transition-colors duration-300">
                  Feedback Precision
                </h3>
                <p className="font-inter text-gray-300 group-hover:text-white transition-colors duration-300">
                  Target: 90% alignment of AI feedback with biomechanical principles.
                </p>
              </div>
              <div className="group bg-[#111]/50 backdrop-blur-sm p-8 rounded-xl border border-secondary/20 hover:border-secondary transition-all duration-300 shadow-lg hover:shadow-secondary/20">
                <h3 className="text-2xl font-semibold mb-4 font-poppins text-secondary group-hover:text-white transition-colors duration-300">
                  Real-Time Latency
                </h3>
                <p className="font-inter text-gray-300 group-hover:text-white transition-colors duration-300">
                  Target: Feedback latency under 500ms for live sessions.
                </p>
              </div>
              <div className="group bg-[#111]/50 backdrop-blur-sm p-8 rounded-xl border border-secondary/20 hover:border-secondary transition-all duration-300 shadow-lg hover:shadow-secondary/20">
                <h3 className="text-2xl font-semibold mb-4 font-poppins text-secondary group-hover:text-white transition-colors duration-300">
                  User Retention
                </h3>
                <p className="font-inter text-gray-300 group-hover:text-white transition-colors duration-300">
                  Target: 70% monthly retention rate.
                </p>
              </div>
              <div className="group bg-[#111]/50 backdrop-blur-sm p-8 rounded-xl border border-secondary/20 hover:border-secondary transition-all duration-300 shadow-lg hover:shadow-secondary/20">
                <h3 className="text-2xl font-semibold mb-4 font-poppins text-secondary group-hover:text-white transition-colors duration-300">
                  Community Engagement
                </h3>
                <p className="font-inter text-gray-300 group-hover:text-white transition-colors duration-300">
                  Target: 50% monthly active users engaging with community features.
                </p>
              </div>
              <div className="group bg-[#111]/50 backdrop-blur-sm p-8 rounded-xl border border-secondary/20 hover:border-secondary transition-all duration-300 shadow-lg hover:shadow-secondary/20">
                <h3 className="text-2xl font-semibold mb-4 font-poppins text-secondary group-hover:text-white transition-colors duration-300">
                  Platform Scalability
                </h3>
                <p className="font-inter text-gray-300 group-hover:text-white transition-colors duration-300">
                  Target: Support 10,000+ concurrent users without degradation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Questions Section - index 4 */}
        <section 
          ref={sectionRefs[4]} 
          className={`sticky top-0 min-h-screen flex flex-col justify-center items-center bg-primary text-white p-10 lg:p-20 z-50 transition-filter duration-300 ease-in-out ${blurredSections[4] ? 'blur-underneath' : ''}`}>
          <div className="w-full max-w-6xl bg-black/30 backdrop-blur-lg rounded-2xl p-10 lg:p-16 opacity-0 translate-y-10 animate-fade-in-up">
            <h2 className="text-5xl font-bold text-center mb-16 font-poppins">
              Open <span className="text-secondary">Questions</span>
            </h2>
            <div className="space-y-4">
              {
                [
                  "What specific datasets will be used to train the custom LLM?",
                  "Should Google Gemini AI be the default reasoning engine, or selectable?",
                  "What additional features should be prioritized for the calorie counter?",
                  "Should the dedicated camera be a standalone product or integrated accessory?",
                  "Should community features be included in the MVP or added later?",
                  "What pricing model should be used for the meet verification tier?",
                  "Which open-source license (MIT or Apache 2.0) is most appropriate?",
                  "What infrastructure is needed for scalable real-time analysis?",
                  "What marketing and launch strategy should be employed?",
                ].map((question, index) => (
                  <p 
                    key={index} 
                    className={`font-inter text-base sm:text-lg p-3 sm:p-4 rounded ${index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'} transition-colors duration-200`}
                  >
                    <span className="text-secondary mr-2">?</span> {question}
                  </p>
                ))
              }
            </div>
          </div>
        </section>

        {/* Final Hero Section - Highest z-index */}
        <section 
          className={`sticky top-0 min-h-screen flex flex-col items-center justify-center bg-primary p-10 text-center z-60 transition-filter duration-300 ease-in-out`}>
          <div className="space-y-6">
            <h1 className="text-6xl font-bold text-secondary font-poppins">
              Virtara
            </h1>
            <p className="text-xl text-gray-300 font-inter max-w-2xl mx-auto">
              Exercise Analysis, using state of the art pose analysis and large language models to provide objective feedback to enhance performance.
            </p>
            <div className="pt-4">
              <p className="text-lg text-gray-400 font-inter mb-2">Stay updated:</p>
              {emailForm}
              {statusMessage}
            </div>
            <h2 className="text-4xl font-semibold text-white font-poppins pt-4">
              Coming Soon
            </h2>
            <div className="flex justify-center gap-6 pt-4">
              <a href="https://www.twitter.com/virtara_" target="_blank" rel="noopener noreferrer" aria-label="X (formerly Twitter)" className="text-secondary hover:text-white transition-colors duration-200">
                <FaXTwitter size={24} />
              </a>
              <a href="https://www.instagram.com/virtara_" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-secondary hover:text-white transition-colors duration-200">
                <FaInstagram size={24} />
              </a>
              <a href="https://www.github.com/virtara" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-secondary hover:text-white transition-colors duration-200">
                <FaGithub size={24} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="text-secondary hover:text-white transition-colors duration-200">
                <FaDiscord size={24} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-secondary hover:text-white transition-colors duration-200">
                <FaYoutube size={24} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Reddit" className="text-secondary hover:text-white transition-colors duration-200">
                <FaReddit size={24} />
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

// Add default fonts to the component scope if needed globally later
// const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] });
// const inter = Inter({ subsets: ['latin'], weight: ['400', '500'] }); 