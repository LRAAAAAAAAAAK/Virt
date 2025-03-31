import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Virtara - Core Features',
  description: 'Detailed explanation of Virtara\'s core features including Pose Analysis, Progress Tracking, AI Insights, and Nutrition Tracking.',
};

export default function FeaturesPage() {
  return (
    <main className="bg-gradient-to-b from-primary to-[#111] text-white min-h-screen p-10 lg:p-20">
      <div className="max-w-4xl mx-auto">
        {/* Back to Home Link */}
        <div className="mb-8">
          <Link href="/" className="text-secondary hover:text-yellow-300 transition-colors duration-200 font-inter">
            &larr; Back to Home
          </Link>
        </div>

        <h1 className="text-5xl font-bold text-center mb-16 font-poppins">
          Virtara <span className="text-secondary">Core</span> Features
        </h1>

        {/* Feature Sections */}
        <div className="space-y-12">

          {/* 1. Pose Analysis */}
          <section>
            <h2 className="text-3xl font-semibold mb-6 font-poppins text-secondary border-b border-secondary/30 pb-2">1. Pose Analysis</h2>
            <p className="font-inter text-lg text-gray-300 mb-6">Leveraging MediaPipe, TensorFlow, and Google Gemini AI for detailed biomechanical feedback.</p>
            <div className="space-y-6 pl-4 border-l-2 border-secondary/50">
              {/* Sub-features */}
              <div>
                <h3 className="text-xl font-semibold mb-2 font-poppins text-gray-100">1.1 Bar Path Trajectory</h3>
                <p className="font-inter text-gray-300 mb-2">The path the barbell travels during a lift. Calculated by extracting the barbell position frame-by-frame and plotting the trajectory. Deviation from optimal path assessed via Root Mean Square Calculation.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 font-poppins text-gray-100">1.2 Joint Angles</h3>
                <p className="font-inter text-gray-300 mb-2">Angles at key joints (knees, hips, shoulders). Calculated using pose detection and the law of cosines: <code className="text-sm bg-gray-700 px-2 py-1 rounded">arccos((a²+b²-c²)/(2ab))</code>.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 font-poppins text-gray-100">1.3 Velocity</h3>
                <p className="font-inter text-gray-300 mb-2">Speed of the barbell. Calculated as: <code className="text-sm bg-gray-700 px-2 py-1 rounded">Velocity = Displacement / Time</code>.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 font-poppins text-gray-100">1.4 Acceleration</h3>
                <p className="font-inter text-gray-300 mb-2">Rate of change of barbell velocity. Calculated as: <code className="text-sm bg-gray-700 px-2 py-1 rounded">Acceleration = (Final Velocity - Initial Velocity) / Time</code>.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 font-poppins text-gray-100">1.5 Symmetry and Balance</h3>
                <p className="font-inter text-gray-300 mb-2">Comparison of left/right side movements. Calculated as: <code className="text-sm bg-gray-700 px-2 py-1 rounded">Symmetry = ((Left Metric - Right Metric) / Average Metric) * 100</code>.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 font-poppins text-gray-100">1.6 Range of Motion (ROM)</h3>
                <p className="font-inter text-gray-300 mb-2">Total distance a joint travels. Calculated as: <code className="text-sm bg-gray-700 px-2 py-1 rounded">ROM = Max Position - Min Position</code>.</p>
              </div>
              <div>
                 <h3 className="text-xl font-semibold mb-2 font-poppins text-gray-100">1.7 Power Output</h3>
                 <p className="font-inter text-gray-300 mb-2">Rate at which work is done. Calculated as: <code className="text-sm bg-gray-700 px-2 py-1 rounded">Power = (Force * Velocity) / Time</code>, where <code className="text-sm bg-gray-700 px-1 py-0.5 rounded">Force = Mass * Acceleration</code>.</p>
               </div>
               <div>
                 <h3 className="text-xl font-semibold mb-2 font-poppins text-gray-100">1.8 Control</h3>
                 <p className="font-inter text-gray-300 mb-2">Stability of the barbell/joints. Measured via deviation analysis, e.g., <code className="text-sm bg-gray-700 px-2 py-1 rounded">Control = 1 - Std Dev(Bar Trajectory)</code>.</p>
               </div>
               <div>
                 <h3 className="text-xl font-semibold mb-2 font-poppins text-gray-100">1.9 Time Under Tension (TUT)</h3>
                 <p className="font-inter text-gray-300 mb-2">Total time muscles are engaged. Calculated as: <code className="text-sm bg-gray-700 px-2 py-1 rounded">TUT = Time_eccentric + Time_concentric</code>.</p>
               </div>
               <div>
                 <h3 className="text-xl font-semibold mb-2 font-poppins text-gray-100">1.10 Reps in Reserve (RIR)</h3>
                 <p className="font-inter text-gray-300 mb-2">Estimated reps before failure. Calculated using velocity changes and fatigue coefficient: <code className="text-sm bg-gray-700 px-2 py-1 rounded">RIR = ((Max Velocity - Current Velocity) / Max Velocity) * Fatigue Coeff</code>.</p>
               </div>
            </div>
          </section>

          {/* 2. Progress Tracking */}
          <section>
            <h2 className="text-3xl font-semibold mb-6 font-poppins text-secondary border-b border-secondary/30 pb-2">2. Progress Tracking</h2>
            <ul className="list-disc list-inside space-y-2 font-inter text-gray-300 text-lg">
              <li>Track historical trends for all pose analysis metrics.</li>
              <li>Visualize progress with graphs and charts.</li>
              <li>Enable goal setting and tracking (e.g., improve squat depth).</li>
              <li>Provide injury risk monitoring (e.g., excessive knee valgus).</li>
            </ul>
          </section>

          {/* 3. Real-Time Analysis */}
          <section>
            <h2 className="text-3xl font-semibold mb-6 font-poppins text-secondary border-b border-secondary/30 pb-2">3. Real-Time Analysis</h2>
            <ul className="list-disc list-inside space-y-2 font-inter text-gray-300 text-lg">
              <li>Instant feedback during training using pose analysis and AI reasoning.</li>
              <li>Display visual overlays (bar path, joint angles) on video feeds.</li>
              <li>Enable VAR-style verification for powerlifting meets.</li>
            </ul>
          </section>

          {/* 4. Calorie Counter */}
          <section>
            <h2 className="text-3xl font-semibold mb-6 font-poppins text-secondary border-b border-secondary/30 pb-2">4. Calorie Counter</h2>
            <ul className="list-disc list-inside space-y-2 font-inter text-gray-300 text-lg">
              <li>Barcode Scanning: Quickly log nutritional info.</li>
              <li>AI Food Picture Analysis: Identify food items (user inputs weights).</li>
              <li>Manual Entry: Add custom foods and nutritional data.</li>
              <li>Daily calorie and macro tracking (protein, carbs, fats).</li>
            </ul>
          </section>

           {/* 5. User Profiles */}
           <section>
             <h2 className="text-3xl font-semibold mb-6 font-poppins text-secondary border-b border-secondary/30 pb-2">5. User Profiles</h2>
             <ul className="list-disc list-inside space-y-2 font-inter text-gray-300 text-lg">
               <li>Showcase favorite lifts, progress highlights, and achievements.</li>
               <li>Include profile picture, bio, social media links, and badges.</li>
               <li>Share profiles with others in the community.</li>
             </ul>
           </section>

           {/* 6. Cryptocurrency Integration (Potential) */}
           <section>
             <h2 className="text-3xl font-semibold mb-6 font-poppins text-secondary border-b border-secondary/30 pb-2">6. Cryptocurrency Integration <span className="text-sm text-gray-400">(Potential)</span></h2>
             <ul className="list-disc list-inside space-y-2 font-inter text-gray-300 text-lg">
               <li>Blockchain: Solana (SPL standard for Virtara Token).</li>
               <li>Payments: USDC only for subscriptions and services.</li>
               <li>Virtara Token: Pegged to constant value (1:1 USDC) for rewards, tipping, funding.</li>
             </ul>
           </section>

        </div>
      </div>
    </main>
  );
} 