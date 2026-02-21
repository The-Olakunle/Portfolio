"use client";

import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "motion/react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import "../self-serve-returns/page.css";

const VIDEO_INDICES = new Set([2, 3]);

interface ProjectData {
  title: string;
  role: string;
  duration: string;
  description: string;
  background: string;
  goal: string;
}

const projectData: ProjectData = {
  title: "Self serve returns v.2",
  role: "Product designer",
  duration: "4 months",
  description: "Empowering customers to independently complete returns",
  background:
    "After launching Self-Serve Returns Phase 1 in 13 markets, we set out to release Phase 2, a fully autonomous returns experience that would eliminate the need for Customer Experience interaction entirely. While Phase 1 enabled customers to initiate returns on-platform, they still needed to engage with CE through Intercom to complete the process.",
  goal: "We aimed to enable customers to complete their entire returns journey on-platform without Customer Experience intervention, giving them full autonomy to choose between a refund or exchange.",
};

export default function ProjectPage() {
  const sidebarRef = useRef<HTMLElement>(null);
  const exchangeVideoRef = useRef<HTMLVideoElement>(null);
  const refundSwitchVideoRef = useRef<HTMLVideoElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Reset pause on scroll; control exchange video
  useEffect(() => {
    setIsPaused(false);
  }, [activeImageIndex]);

  useEffect(() => {
    if (!VIDEO_INDICES.has(activeImageIndex)) return;
    const activeVideo = activeImageIndex === 2 ? exchangeVideoRef.current : refundSwitchVideoRef.current;
    if (!activeVideo) return;

    if (isPaused) {
      activeVideo.pause();
    } else {
      activeVideo.play().catch(() => { });
    }
  }, [isPaused, activeImageIndex]);

  const { scrollYProgress } = useScroll({
    container: sidebarRef,
  });

  // Switch image/video based on scroll thresholds
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (value < 0.15) {
      setActiveImageIndex(0); // Intro -> Project frame 2
    } else if (value < 0.4) {
      setActiveImageIndex(1); // Goal / Delivered -> SSR phase 2 video
    } else if (value < 0.6) {
      setActiveImageIndex(2); // 0.1 Exchange flow -> Project frame 2
    } else if (value < 0.8) {
      setActiveImageIndex(3); // 0.2 Refund flow -> Mid Exchange refund.gif
    } else if (value < 0.95) {
      setActiveImageIndex(4); // 0.3 Final review -> Review your return.png
    } else {
      setActiveImageIndex(5); // 0.4 Confirmation -> Confirmation page.png
    }
  });

  // Text highlighting based on scroll
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.2], [0.6, 1]);

  return (
    <main className="project-page">
      {/* Back link — outside sidebar so it can float independently on mobile */}
      <Link href="/" className="back-link">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M10 12L6 8L10 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Home
      </Link>

      {/* Left Sidebar */}
      <aside className="project-sidebar" ref={sidebarRef}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="project-detail-title">{projectData.title}</h1>
          <p className="project-detail-meta">
            {projectData.role} | {projectData.duration}
          </p>
          <p className="project-detail-description">
            {projectData.description}
          </p>

          <motion.section
            className="project-section"
            style={{ opacity: sectionOpacity }}
          >
            <h2>Background</h2>
            <p>{projectData.background}</p>
            <p className={`italic-note${activeImageIndex === 0 ? " highlighted" : ""}`}>
              Phase 2 would close this gap by allowing users to choose their
              preferred resolution (exchange or refund) and complete the entire
              journey independently on-platform. This would improve customer
              experience through faster resolutions and greater control, while
              freeing the CE team to focus on complex, high-value issues.
            </p>
          </motion.section>

          <motion.section
            className="project-section"
            style={{ opacity: sectionOpacity }}
          >
            <h2>The goal</h2>
            <p>{projectData.goal}</p>
          </motion.section>

          <motion.section
            className="project-section"
            style={{ opacity: sectionOpacity }}
          >
            <h2>What we delivered</h2>
            <p>
              Beyond reducing friction, I aimed to introduce delight into the
              exchange flow transforming what's typically a frustrating
              experience into an opportunity for customers to discover their
              next perfect item and stay engaged with MPB
            </p>
            <hr className="project-divider" />
          </motion.section>

          <motion.section
            className="project-section"
            style={{ opacity: sectionOpacity }}
          >
            <h2>0.1 Self service exchange selection</h2>
            <p>
              Customers who are returning an item and have opted to get an
              exchange item can now independently select a replacement
              on-platform without any help from our Customer Experience team.
            </p>
            <p className={`italic-note${activeImageIndex === 2 ? " highlighted" : ""}`}>
              I designed the experience in a way where customers can search for
              exchange items, choose from a range of available items to resolve
              their return.
            </p>
          </motion.section>

          <motion.section
            className="project-section"
            style={{ opacity: sectionOpacity }}
          >
            <h2>0.2 Flexibility to switch from exchange to refund</h2>
            <p>
              I designed for scenarios where customers started the exchange
              journey but changed their mind mid-way to opt for a refund.
            </p>
            <p className={`italic-note${activeImageIndex === 3 ? " highlighted" : ""}`}>
              This flexibility built within the system allowed customers to have
              control over their returns experience and choose the resolution
              method that best suited their needs.
            </p>
          </motion.section>

          <motion.section
            className="project-section"
            style={{ opacity: sectionOpacity }}
          >
            <h2>0.3 Final review with full transparency</h2>
            <p>
              I designed the review page to give customers complete visibility
              before they commit. The page clearly separates what they're
              returning from what they're getting in exchange, with a summary
              panel that breaks down the financial outcome.
            </p>
            <p className={`italic-note${activeImageIndex === 4 ? " highlighted" : ""}`}>
              When customers are owed money back, we highlight the refund amount
              and explain when they'll receive it, building confidence at this
              critical decision point.
            </p>
          </motion.section>

          <motion.section
            className="project-section"
            style={{ opacity: sectionOpacity }}
          >
            <h2>0.4 Guiding customers after confirmation</h2>
            <p>
              Once the return was placed, I designed a confirmation page that
              clearly outlined what happens next and provided actionable
              guidance for packaging and shipping. We included drop-off details,
              a step-by-step packing guide with manufacturer recommendations,
              and a summary of their return for reference.
            </p>
            <p className={`italic-note${activeImageIndex === 5 ? " highlighted" : ""}`}>
              This reduced confusion and support queries by ensuring customers
              had everything they needed to complete their return successfully.
            </p>
          </motion.section>
        </motion.div>
      </aside>

      {/* Right Content Area */}
      <div className="project-content">
        {/* Play/Pause overlay */}
        {VIDEO_INDICES.has(activeImageIndex) && (
          <div className="media-control-overlay">
            <button
              className="media-control-btn"
              onClick={() => setIsPaused((p) => !p)}
              aria-label={isPaused ? "Play" : "Pause"}
            >
              {isPaused ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              )}
            </button>
          </div>
        )}
        <div className="project-image-container">
          {/* Image 0 - Return 2.2 image 1.png */}
          <motion.div
            className="project-detail-image-wrapper"
            initial={{ opacity: 1 }}
            animate={{ opacity: activeImageIndex === 0 ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src="/Return 2.2 image 1.png"
              alt="Self serve returns v2 - intro"
              width={1200}
              height={800}
              className="project-screenshot"
              priority
            />
          </motion.div>

          {/* Image 1+ - Return 2.2 image 1.png (non-video states) */}
          <motion.div
            className="project-detail-image-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: activeImageIndex === 1 ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src="/Return 2.2 image 1.png"
              alt="Self serve returns v2 exchange flow"
              width={1200}
              height={800}
              className="project-screenshot"
            />
          </motion.div>

          {/* Exchange selection video - index 2 */}
          <motion.div
            className="project-detail-image-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: activeImageIndex === 2 ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <video
              ref={exchangeVideoRef}
              className="project-screenshot"
              muted
              loop
              playsInline
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            >
              <source src="/Exchange selection.mp4" type="video/mp4" />
            </video>
          </motion.div>

          {/* Mid Exchange refund video - index 3 */}
          <motion.div
            className="project-detail-image-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: activeImageIndex === 3 ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <video
              ref={refundSwitchVideoRef}
              className="project-screenshot"
              muted
              loop
              playsInline
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            >
              <source src="/Mid Exchange refund.mp4" type="video/mp4" />
            </video>
          </motion.div>

          {/* Review your return - index 4 */}
          <motion.div
            className="project-detail-image-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: activeImageIndex === 4 ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src="/Review your return.png"
              alt="Review your return"
              width={1200}
              height={800}
              className="project-screenshot"
            />
          </motion.div>

          {/* Confirmation page - index 5 */}
          <motion.div
            className="project-detail-image-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: activeImageIndex === 5 ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src="/Confirmation page.png"
              alt="Confirmation page"
              width={1200}
              height={800}
              className="project-screenshot"
            />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
