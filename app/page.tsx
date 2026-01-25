'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiUser, FiBriefcase, FiBook, FiCode, FiAward, FiMail, 
  FiGithub, FiLinkedin, FiExternalLink, FiChevronRight,
  FiDatabase, FiCloud, FiCpu, FiGlobe, FiLayers, FiZap,
  FiTarget, FiUsers, FiTrendingUp, FiShield, FiServer,
  FiMenu, FiX
} from 'react-icons/fi';

export default function Home() {
  const [expandedAwards, setExpandedAwards] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <a href="#" className="text-lg sm:text-xl font-semibold hover:text-[#a0a0a0] transition-colors">Tyler Malone</a>
            <div className="hidden md:flex gap-6">
              <a href="#about" className="hover:text-cyan-400 transition-colors relative group inline-flex items-center gap-1">
                <FiUser className="text-sm" />
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all"></span>
              </a>
              <a href="#work" className="hover:text-purple-400 transition-colors relative group inline-flex items-center gap-1">
                <FiBriefcase className="text-sm" />
                Experience
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all"></span>
              </a>
              <a href="#education" className="hover:text-blue-400 transition-colors relative group inline-flex items-center gap-1">
                <FiBook className="text-sm" />
                Education
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all"></span>
              </a>
              <a href="#projects" className="hover:text-pink-400 transition-colors relative group inline-flex items-center gap-1">
                <FiCode className="text-sm" />
                Projects
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-400 group-hover:w-full transition-all"></span>
              </a>
              <a href="#skills" className="hover:text-green-400 transition-colors relative group inline-flex items-center gap-1">
                <FiAward className="text-sm" />
                Skills
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all"></span>
              </a>
              <a href="#contact" className="hover:text-cyan-400 transition-colors relative group inline-flex items-center gap-1">
                <FiMail className="text-sm" />
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all"></span>
              </a>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-[#ededed] hover:text-[#a0a0a0] transition-colors p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-[#1a1a1a]">
              <div className="flex flex-col gap-4 pt-4">
                <a 
                  href="#about" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-cyan-400 transition-colors inline-flex items-center gap-2 py-2"
                >
                  <FiUser />
                  About
                </a>
                <a 
                  href="#work" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-purple-400 transition-colors inline-flex items-center gap-2 py-2"
                >
                  <FiBriefcase />
                  Experience
                </a>
                <a 
                  href="#education" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-blue-400 transition-colors inline-flex items-center gap-2 py-2"
                >
                  <FiBook />
                  Education
                </a>
                <a 
                  href="#projects" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-pink-400 transition-colors inline-flex items-center gap-2 py-2"
                >
                  <FiCode />
                  Projects
                </a>
                <a 
                  href="#skills" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-green-400 transition-colors inline-flex items-center gap-2 py-2"
                >
                  <FiAward />
                  Skills
                </a>
                <a 
                  href="#contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-cyan-400 transition-colors inline-flex items-center gap-2 py-2"
                >
                  <FiMail />
                  Contact
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className={`space-y-4 sm:space-y-6 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-[#ededed] to-[#a0a0a0] bg-clip-text text-transparent">
              Tyler Malone
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-[#a0a0a0] font-light">
              Software Engineer | Full-Stack & DevOps | AI Engineer
            </p>
            <p className="text-base sm:text-lg text-[#808080] max-w-2xl leading-relaxed">
              Software engineer specializing in full-stack development, DevOps, distributed systems, and agentic AI. Available for contract work.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <a
                href="#contact"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20 inline-flex items-center gap-2"
              >
                <FiMail />
                Get in Touch
              </a>
              <a
                href="#projects"
                className="px-6 py-3 border border-purple-500/30 rounded-lg font-medium hover:border-purple-500/50 hover:bg-purple-500/10 text-purple-400 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2"
              >
                <FiCode />
                View Projects
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-20 px-4 sm:px-6 border-t border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-[#ededed] to-[#a0a0a0] bg-clip-text text-transparent inline-flex items-center gap-3">
            <FiUser className="text-cyan-400" />
            <span>About</span>
          </h2>
          <div className="max-w-3xl">
            <p className="text-base sm:text-lg text-[#a0a0a0] leading-relaxed mb-4">
              I am a software engineer with professional experience in full-stack development, DevOps, distributed systems, and agentic AI. 
              I am proficient in building scalable, secure applications using Spark, HDFS, Next.js, Node.js, Nest.js, PostgreSQL, Python, and Java across GCP, AWS, and Azure.
            </p>
            <p className="text-base sm:text-lg text-[#a0a0a0] leading-relaxed mb-4">
              With a diverse background spanning from military service to academia and industry, I've developed a unique blend of technical 
              and interpersonal skills. I am committed to continuous learning and leveraging technology to solve real-world problems.
            </p>
            <p className="text-base sm:text-lg text-[#a0a0a0] leading-relaxed">
              I am currently available for contract work and consulting opportunities. Whether you need full-stack development, AI/ML solutions, 
              or DevOps expertise, I'm ready to help bring your projects to life.
            </p>
          </div>
        </div>
      </section>

      {/* Work Experience */}
      <section id="work" className="py-12 sm:py-20 px-4 sm:px-6 border-t border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 bg-gradient-to-r from-[#ededed] to-[#a0a0a0] bg-clip-text text-transparent inline-flex items-center gap-3">
            <FiBriefcase className="text-purple-400" />
            <span>Work Experience</span>
          </h2>
          
          <div className="space-y-8 sm:space-y-12">
            {/* WarTable */}
            <div className="group">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2">WarTable by Freestyle Consulting</h3>
                  <p className="text-lg sm:text-xl text-[#a0a0a0] mb-2">Software Engineer (Full-Stack & DevOps) - Contract</p>
                  <p className="text-sm sm:text-base text-[#808080]">Jun 2025 – Present</p>
                </div>
              </div>
              <p className="text-base sm:text-lg text-[#a0a0a0] leading-relaxed mb-4">
                Contract work in a start-up environment where I build secure agentic RAG systems using vector databases and knowledge graphs. 
                I contribute to custom Mixture of Experts models for secure AI and develop scalable applications using Next.js, Node.js, PostgreSQL, and FastAPI.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Next.js', 'Node.js', 'PostgreSQL', 'FastAPI', 'Vector Databases', 'Knowledge Graphs', 'Agentic AI', 'RAG Systems'].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-sm text-purple-400">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* HYVV */}
            <div className="group">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2">HYVV</h3>
                  <p className="text-lg sm:text-xl text-[#a0a0a0] mb-2">Software Engineer (Full-Stack & DevOps) - Contract</p>
                  <p className="text-sm sm:text-base text-[#808080]">Dec 2024 – Present</p>
                </div>
              </div>
              <p className="text-base sm:text-lg text-[#a0a0a0] leading-relaxed mb-4">
                Contract work in a start-up environment where I engineer AI-driven features using agent-based systems and real-time data pipelines. 
                I build full-stack applications using Next.js, NestJS, FastAPI, and PostgreSQL, and I implement TDD and CI/CD with regression testing.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Next.js', 'NestJS', 'FastAPI', 'PostgreSQL', 'Agent-Based Systems', 'Real-Time Data Pipelines', 'TDD', 'CI/CD'].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-sm text-green-400">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Sustain */}
            <div className="group">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2">Project Sustain, Colorado State University</h3>
                  <p className="text-lg sm:text-xl text-[#a0a0a0] mb-2">Software Engineer & Research Assistant</p>
                  <p className="text-sm sm:text-base text-[#808080]">Jan 2025 – Aug 2025</p>
                </div>
              </div>
              <p className="text-base sm:text-lg text-[#a0a0a0] leading-relaxed mb-4">
                I developed features for RamDesk, a Python Flask, React, and MongoDB application, including a real-time essay citation verification tool. 
                I contributed to HoneyComb, a UAV, AI, and ML system for rapid agricultural intelligence using drone swarms. 
                I received the REI Undergraduate Research Stipend in Summer 2025.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Python', 'Flask', 'React', 'MongoDB', 'AI/ML', 'UAV Systems', 'Research'].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-sm text-blue-400">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* CSU TA */}
            <div className="group">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2">Colorado State University</h3>
                  <p className="text-lg sm:text-xl text-[#a0a0a0] mb-2">Undergraduate Teaching Assistant</p>
                  <p className="text-sm sm:text-base text-[#808080]">Aug 2023 – Present</p>
                </div>
              </div>
              <p className="text-base sm:text-lg text-[#a0a0a0] leading-relaxed mb-4">
                I have taught Python (Fall 2023), Java (Spring 2024), and Software Development (Fall 2024 to present). 
                I mentor more than 200 students each semester in coding, debugging, and software best practices, and I develop labs and course materials.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Teaching', 'Public Speaking', 'Mentorship', 'Python', 'Java', 'Software Development'].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-teal-500/10 border border-teal-500/30 rounded-full text-sm text-teal-400">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* US Marine Corps */}
            <div className="group">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Image 
                      src="/64px-Seal_of_the_United_States_Marine_Corps.svg.png" 
                      alt="US Marine Corps EGA"
                      width={60}
                      height={60}
                      className="opacity-90"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold mb-2">US Marine Corps</h3>
                    <p className="text-lg sm:text-xl text-[#a0a0a0] mb-2">Refrigeration Technician | Utilities Operations SNCO | Utilities Quality Control SNCO</p>
                    <p className="text-sm sm:text-base text-[#808080]">Oct. 2018 - Oct. 2022</p>
                  </div>
                </div>
              </div>
              <p className="text-base sm:text-lg text-[#a0a0a0] leading-relaxed mb-4">
                I served as a Meritorious Corporal in the 4th Marines, 3rd Marine Division. I collaborated with Japanese 
                Self-Defense Forces and volunteered in local communities. I designed power plans and load distribution for MWX, 
                the largest Marine Corps field exercise at 29 Palms, and maintained generators, water purification systems, 
                electrical systems, and refrigeration systems.
              </p>
              <p className="text-[#a0a0a0] leading-relaxed mb-4">
                I served as Operations SNCO (Field), QC NCO (Garrison), and Operations NCO (Garrison), and I received the 
                Soo Chow Creek Medal for exceptional performance during COVID-19.
              </p>
              <button
                onClick={() => setExpandedAwards(!expandedAwards)}
                className="mb-4 px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:border-[#3a3a3a] transition-colors"
              >
                {expandedAwards ? 'Hide Awards' : 'Show Awards'}
              </button>
              {expandedAwards && (
                <div className="mt-4 p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Technical Training</h4>
                    <div className="space-y-6">
                      <div>
                        <p className="text-[#a0a0a0] mb-3 font-medium">Basic Refrigeration And Air Conditioning Technician's Course</p>
                        <div className="relative w-full max-w-2xl">
                          <Image 
                            src="/Reefer.png" 
                            alt="Basic Refrigeration And Air Conditioning Technician's Course Certificate"
                            width={800}
                            height={600}
                            className="rounded-lg border border-[#2a2a2a]"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-[#a0a0a0] mb-3 font-medium">Advanced Engineer Equipment Electrical Systems Technician's Course</p>
                        <div className="relative w-full max-w-2xl">
                          <Image 
                            src="/ACourse.png" 
                            alt="Advanced Engineer Equipment Electrical Systems Technician's Course Certificate"
                            width={800}
                            height={600}
                            className="rounded-lg border border-[#2a2a2a]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Military Awards</h4>
                    <div className="space-y-6">
                      <div>
                        <p className="text-[#a0a0a0] font-medium mb-2">National Defense Service Medal</p>
                        <p className="text-sm text-[#808080] mb-3">Awarded for active federal service in the armed forces between June 27, 1950 - July 1954; Jan. 1, 1961 - Aug. 14, 1974; and from Aug. 2, 1990 - Dec. 31, 2022.</p>
                        <div className="relative w-48">
                          <Image 
                            src="/NN.png" 
                            alt="National Defense Service Medal"
                            width={200}
                            height={200}
                            className="rounded-lg"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-[#a0a0a0] font-medium mb-2">Marine Corps Good Conduct Medal</p>
                        <p className="text-sm text-[#808080] mb-3">Awarded to Marines after three consecutive years of honorable and faithful service.</p>
                        <div className="relative w-48">
                          <Image 
                            src="/GC.png" 
                            alt="Marine Corps Good Conduct Medal"
                            width={200}
                            height={200}
                            className="rounded-lg"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-[#a0a0a0] font-medium mb-2">USMC Sea Service Deployment Ribbon (x3)</p>
                        <p className="text-sm text-[#808080] mb-3">Awarded to Marines who complete a deployment at sea or with an overseas unit.</p>
                        <div className="relative w-48">
                          <Image 
                            src="/SD.png" 
                            alt="USMC Sea Service Deployment Ribbon"
                            width={200}
                            height={200}
                            className="rounded-lg"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-[#a0a0a0] font-medium mb-2">Global War on Terrorism Service Medal</p>
                        <p className="text-sm text-[#808080] mb-3">Awarded to military personnel who have served in support of operations related to the Global War on Terrorism.</p>
                        <div className="relative w-48">
                          <Image 
                            src="/WT.png" 
                            alt="Global War on Terrorism Service Medal"
                            width={200}
                            height={200}
                            className="rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Special Military Recognitions</h4>
                    <div className="space-y-6">
                      <div>
                        <p className="text-[#a0a0a0] font-medium mb-3">Meritorious Promotion to Noncommissioned officer</p>
                        <div className="relative w-full max-w-2xl">
                          <Image 
                            src="/promotion.png" 
                            alt="Meritorious Promotion to Noncommissioned officer"
                            width={800}
                            height={600}
                            className="rounded-lg border border-[#2a2a2a]"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-[#a0a0a0] font-medium mb-2">Soochow Creek Medal</p>
                        <p className="text-sm text-[#808080] mb-3">Awarded by the 4th Marine Regiment Commanding Officer, Colonel Tracy, for exemplary performance of duties at the height of the COVID-19 pandemic.</p>
                        <div className="relative w-full max-w-2xl">
                          <Image 
                            src="/SoochowAward.png" 
                            alt="Soochow Creek Medal"
                            width={800}
                            height={600}
                            className="rounded-lg border border-[#2a2a2a]"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-[#a0a0a0] font-medium mb-2">Meritorious Mast</p>
                        <p className="text-sm text-[#808080] mb-3">Won 1st place in company shooting competition, after which I competed against the Japanese Self-Defense Forces in a joint-service shooting competition.</p>
                        <div className="relative w-full max-w-2xl">
                          <Image 
                            src="/ShootingComp.png" 
                            alt="Meritorious Mast - Shooting Competition"
                            width={800}
                            height={600}
                            className="rounded-lg border border-[#2a2a2a]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-4">
                {['Leadership', 'Strategic Planning', 'Technical Expertise'].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-sm text-red-400">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Education */}
      <section id="education" className="py-12 sm:py-20 px-4 sm:px-6 border-t border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 bg-gradient-to-r from-[#ededed] to-[#a0a0a0] bg-clip-text text-transparent inline-flex items-center gap-3">
            <FiBook className="text-blue-400" />
            <span>Education</span>
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-2">Colorado State University</h3>
              <p className="text-xl text-[#a0a0a0] mb-2">Bachelor of Science in Computer Science</p>
              <p className="text-[#808080] mb-2">Jan 2023 – Dec 2025</p>
              <p className="text-green-400 mb-2 font-semibold">✓ Graduated December 2025</p>
              <p className="text-[#808080] mb-4">GPA: 3.95/4.0</p>
              <div className="mt-4">
                <p className="text-lg text-[#a0a0a0] mb-3 font-semibold">Relevant Coursework:</p>
                <div className="flex flex-wrap gap-2">
                  {['Machine Learning', 'Reinforcement Learning', 'Distributed Systems (P2P and Cluster Computing)', 'AI Agents', 'Software Engineering', 'System Security', 'Game Design'].map((course) => (
                    <span key={course} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-sm text-indigo-400">
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-12 sm:py-20 px-4 sm:px-6 border-t border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 bg-gradient-to-r from-[#ededed] to-[#a0a0a0] bg-clip-text text-transparent inline-flex items-center gap-3">
            <FiCode className="text-pink-400" />
            <span>Projects</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-4 sm:p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:border-[#3a3a3a] transition-all hover:scale-[1.02] group">
              <h3 className="text-lg sm:text-xl font-semibold mb-3">
                <Link 
                  href="https://www.mealplangenerator.ai" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#a0a0a0] transition-colors inline-flex items-center gap-2"
                >
                  <FiZap className="text-pink-400" />
                  Meal Plan Generator AI
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </h3>
              <p className="text-xs sm:text-sm text-[#808080] mb-3">Aug 2025 – Present</p>
              <p className="text-sm sm:text-base text-[#a0a0a0] leading-relaxed mb-4">
                I am building an AI-powered meal planning platform that generates personalized weekly meal plans with recipes, 
                nutrition information, and shopping lists. The platform uses reinforcement learning for user preference adaptation 
                and includes human-in-the-loop verification and dynamic recipe ranking.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {['Python', 'Reinforcement Learning', 'AI', 'Meal Planning', 'Nutrition Tracking'].map((tech) => (
                  <span key={tech} className="px-2 py-1 bg-pink-500/10 border border-pink-500/30 rounded text-xs text-pink-400">
                    {tech}
                  </span>
                ))}
              </div>
              <a
                href="https://www.mealplangenerator.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:border-cyan-500/50 hover:bg-cyan-500/20 transition-all text-sm font-medium text-cyan-400"
              >
                <FiExternalLink />
                Visit Site
              </a>
            </div>

            <div className="p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:border-[#3a3a3a] transition-all hover:scale-[1.02] group">
              <h3 className="text-xl font-semibold mb-3">
                <Link 
                  href="https://wartable.ai" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#a0a0a0] transition-colors inline-flex items-center gap-2"
                >
                  <FiGlobe className="text-purple-400" />
                  WarTable™
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </h3>
              <p className="text-sm text-[#808080] mb-3">Jun 2025 – Present</p>
              <p className="text-[#a0a0a0] leading-relaxed mb-4">
                A B2B SaaS platform built under Freestyle Consulting that provides one-click business diagnostics using advanced 
                RAG (Retrieval-Augmented Generation) systems. I build secure agentic RAG systems using vector databases and 
                knowledge graphs to deliver comprehensive business insights and analytics.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {['Next.js', 'Node.js', 'PostgreSQL', 'FastAPI', 'RAG', 'Vector Databases', 'Knowledge Graphs', 'Agentic AI', 'B2B SaaS'].map((tech) => (
                  <span key={tech} className="px-2 py-1 bg-purple-500/10 border border-purple-500/30 rounded text-xs text-purple-400">
                    {tech}
                  </span>
                ))}
              </div>
              <a
                href="https://wartable.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:border-cyan-500/50 hover:bg-cyan-500/20 transition-all text-sm font-medium text-cyan-400"
              >
                <FiExternalLink />
                Visit Site
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-12 sm:py-20 px-4 sm:px-6 border-t border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 bg-gradient-to-r from-[#ededed] to-[#a0a0a0] bg-clip-text text-transparent inline-flex items-center gap-3">
            <FiAward className="text-green-400" />
            <span>Skills</span>
          </h2>
          
          <div className="space-y-8 sm:space-y-10">
            {/* Programming Languages */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-[#a0a0a0] inline-flex items-center gap-2">
                <FiCode className="text-blue-400" />
                Programming Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Python', 'Java', 'TypeScript'].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-sm text-blue-400">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Frontend */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-[#a0a0a0] inline-flex items-center gap-2">
                <FiLayers className="text-cyan-400" />
                Frontend
              </h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'Next.js'].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-sm text-cyan-400">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Backend & Frameworks */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-[#a0a0a0] inline-flex items-center gap-2">
                <FiServer className="text-green-400" />
                Backend & Frameworks
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Node.js', 'NestJS', 'FastAPI', 'Flask'].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-sm text-green-400">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Databases */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-[#a0a0a0] inline-flex items-center gap-2">
                <FiDatabase className="text-orange-400" />
                Databases
              </h3>
              <div className="flex flex-wrap gap-2">
                {['PostgreSQL', 'MongoDB', 'Vector Databases'].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-sm text-orange-400">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Cloud & DevOps */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-[#a0a0a0] inline-flex items-center gap-2">
                <FiCloud className="text-purple-400" />
                Cloud & DevOps
              </h3>
              <div className="flex flex-wrap gap-2">
                {['AWS', 'GCP', 'Azure', 'Docker', 'GitHub Actions'].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-sm text-purple-400">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* AI/ML & Data */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-[#a0a0a0] inline-flex items-center gap-2">
                <FiCpu className="text-pink-400" />
                AI/ML & Data
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Agentic AI', 'RAG', 'Reinforcement Learning', 'Knowledge Graphs', 'Spark', 'HDFS'].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-pink-500/10 border border-pink-500/30 rounded-full text-sm text-pink-400">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Distributed Systems */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-[#a0a0a0] inline-flex items-center gap-2">
                <FiGlobe className="text-indigo-400" />
                Distributed Systems
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Distributed Systems', 'Peer-to-Peer Systems'].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-sm text-indigo-400">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Methodologies */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-[#a0a0a0] inline-flex items-center gap-2">
                <FiTarget className="text-yellow-400" />
                Methodologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {['TDD', 'Agile Methodologies'].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-sm text-yellow-400">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-[#a0a0a0] inline-flex items-center gap-2">
                <FiUsers className="text-teal-400" />
                Soft Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Communication', 'Leadership', 'Problem-Solving'].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-teal-500/10 border border-teal-500/30 rounded-full text-sm text-teal-400">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-12 sm:py-20 px-4 sm:px-6 border-t border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 bg-gradient-to-r from-[#ededed] to-[#a0a0a0] bg-clip-text text-transparent inline-flex items-center gap-3">
            <FiMail className="text-cyan-400" />
            <span>Contact</span>
          </h2>
          
          <div className="max-w-2xl">
            <p className="text-base sm:text-lg text-[#a0a0a0] leading-relaxed mb-6">
              I'm available for contract work and consulting opportunities. I'm always open to discussing new projects, interesting challenges, 
              or just having a conversation about technology and software development.
            </p>
            <div className="space-y-4">
              <a
                href="mailto:tylermalone@contraptionsoft.com"
                className="block p-5 sm:p-6 bg-[#1a1a1a] border border-cyan-500/30 rounded-lg hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all hover:scale-[1.02] group"
              >
                <div className="text-sm sm:text-base text-cyan-400/70 mb-3 sm:mb-4 flex items-center gap-2">
                  <FiMail />
                  <span>Email</span>
                </div>
                <div className="text-base sm:text-lg text-cyan-400 group-hover:text-cyan-300 transition-colors flex items-center gap-2 break-all">
                  <span>tylermalone@contraptionsoft.com</span>
                  <span className="group-hover:translate-x-1 transition-transform flex-shrink-0">→</span>
                </div>
              </a>
              <a
                href="https://linkedin.com/in/tylermmalone"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-5 sm:p-6 bg-[#1a1a1a] border border-blue-500/30 rounded-lg hover:border-blue-500/50 hover:bg-blue-500/10 transition-all hover:scale-[1.02] group"
              >
                <div className="text-sm sm:text-base text-blue-400/70 mb-3 sm:mb-4 flex items-center gap-2">
                  <FiLinkedin />
                  <span>LinkedIn</span>
                </div>
                <div className="text-base sm:text-lg text-blue-400 group-hover:text-blue-300 transition-colors flex items-center gap-2 break-all">
                  <span>linkedin.com/in/tylermmalone</span>
                  <span className="group-hover:translate-x-1 transition-transform flex-shrink-0">→</span>
                </div>
              </a>
              <a
                href="https://github.com/19tylermalone94"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-5 sm:p-6 bg-[#1a1a1a] border border-gray-500/30 rounded-lg hover:border-gray-500/50 hover:bg-gray-500/10 transition-all hover:scale-[1.02] group"
              >
                <div className="text-sm sm:text-base text-gray-400/70 mb-3 sm:mb-4 flex items-center gap-2">
                  <FiGithub />
                  <span>GitHub</span>
                </div>
                <div className="text-base sm:text-lg text-gray-400 group-hover:text-gray-300 transition-colors flex items-center gap-2 break-all">
                  <span>github.com/19tylermalone94</span>
                  <span className="group-hover:translate-x-1 transition-transform flex-shrink-0">→</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto text-center text-sm sm:text-base text-[#808080]">
          <p>© {new Date().getFullYear()} Tyler Malone. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
