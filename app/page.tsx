import Link from "next/link";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import TypingHero from "./components/TypingHero";
import Tags from "./components/Tags";

const skills: { category: string; items: string[] }[] = [
  { category: "Languages", items: ["Python", "TypeScript", "JavaScript", "Java"] },
  { category: "Frontend", items: ["React", "Next.js"] },
  { category: "Backend", items: ["Node.js", "Express", "NestJS", "FastAPI", "Flask"] },
  { category: "Databases & ORM", items: ["PostgreSQL", "Prisma", "MongoDB", "ChromaDB"] },
  { category: "Cloud & DevOps", items: ["GCP", "AWS", "Azure", "Cloud Run", "Docker", "GitHub Actions", "CI/CD"] },
  { category: "AI & Agents", items: ["Agentic AI", "RAG", "MCP", "OpenAI API", "OpenRouter", "Structured Output", "mem0", "Reinforcement Learning"] },
  { category: "Robotics & CV", items: ["ROS", "ROS2", "Gazebo", "RViz", "YOLO", "Unity", "Computer Vision"] },
  { category: "Integrations & Realtime", items: ["Pipedream", "Stripe", "Vapi", "Firebase", "WebSockets", "Canvas API", "Selenium"] },
  { category: "Data & Distributed Systems", items: ["Distributed Systems", "Peer-to-Peer Systems", "Spark", "HDFS", "Data Visualization"] },
  { category: "Methodologies", items: ["TDD", "Agile", "Git"] },
  { category: "Soft Skills", items: ["Communication", "Leadership", "Problem-Solving", "Mentorship"] },
];

// rotate violet → coral → green → amber across the skill blocks
const skillAccents = ["accent-violet", "accent-coral", "accent-green", "accent-amber"];

export default function Home() {
  return (
    <div>
      <Nav />

      <main className="shell" id="top">
        {/* ── Hero (violet) ──────────────────────────────────── */}
        <section className="hero accent-violet">
          <div className="hero__left">
            <h1 className="hero__name">Tyler Malone</h1>
            <p className="hero__role">Software Engineer · Full-Stack · DevOps · AI / Agent Systems</p>
            <TypingHero />
          </div>
          <div className="hero__right">
            <div className="stats">
              <div className="stat">
                <p className="stat__label">Experience</p>
                <p className="stat__value">3+ years — full-stack · DevOps · AI</p>
              </div>
              <div className="stat">
                <p className="stat__label">Availability</p>
                <p className="stat__value stat__value--accent">
                  <span className="status-dot" />
                  Open to contract
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── About (violet) ─────────────────────────────────── */}
        <section className="section accent-violet" id="about">
          <div className="section-bar">
            <span className="section-bar__label">[ ABOUT ]</span>
            <span className="section-bar__line" />
          </div>
          <p className="prose">
            I am a software engineer specializing in agentic AI systems — agent memory, retrieval, and tool use — and the
            full-stack and DevOps work required to deploy them. Most recently I built WarTable: an AI agent that operates
            over a user&apos;s connected apps and knowledge bases, a multi-agent system that scores business health, and the
            supporting infrastructure on GCP. I primarily work with Next.js, Nest.js, Prisma, PostgreSQL, and ChromaDB, and
            I handle projects from development through deployment.
          </p>
          <p className="prose">
            I served four years in the US Marine Corps as a refrigeration technician and later managed maintenance for a
            fleet of generators. I then studied computer science at Colorado State University, where I worked as a teaching
            assistant, conducted research, and spent a year on a robotics project. I am currently available for contract
            work and open to roles in the United States or Japan.
          </p>
        </section>

        {/* ── Experience (coral) ─────────────────────────────── */}
        <section className="section accent-coral" id="experience">
          <div className="section-bar">
            <span className="section-bar__label">[ EXPERIENCE ]</span>
            <span className="section-bar__line" />
            <Link href="/work" className="section-bar__action">
              full work history →
            </Link>
          </div>

          <div className="timeline">
            <div className="timeline__row timeline__row--active">
              <div className="timeline__meta">
                <p className="timeline__company">WarTable by Freestyle Consulting</p>
                <p className="timeline__role">Software Engineer (Full-Stack &amp; DevOps) — Contract</p>
                <p className="timeline__date">Jul 2025 – Jun 2026</p>
              </div>
              <div className="timeline__body">
                <p className="prose">
                  Took WarTable from zero to production: Athena, a web and mobile AI agent that connects ~3,000 apps
                  through Pipedream with per-tool MCP filtering and user-supplied MCP servers; ChromaDB knowledge bases
                  auto-synced from users&apos; Drive files with mem0-backed user and workspace memory; the multi-agent WarTable
                  Business Health Index (WBHI) with a closed-loop task generation and agentic verification scoring system;
                  scheduled agent routines; real-time notifications and AI streaming over WebSockets; a separate admin app
                  for billing, credits, and quotas; and full CI/CD to Cloud Run on GCP.
                </p>
                <Tags items="Next.js · Nest.js · Prisma + PostgreSQL · GCP · Firebase · OpenRouter · Pipedream · Vapi · ChromaDB · mem0 · Stripe" />
              </div>
            </div>

            <div className="timeline__row">
              <div className="timeline__meta">
                <p className="timeline__company">HYVV</p>
                <p className="timeline__role">Software Engineer (Full-Stack &amp; DevOps) — Contract</p>
                <p className="timeline__date">Dec 2024 – Dec 2025</p>
              </div>
              <div className="timeline__body">
                <p className="prose">
                  Built early AI features on the OpenAI API — a conversational agent that ran a structured intake
                  questionnaire to pull business context for planning, and a prompt-driven generator for products and
                  features with images, back when structured output was the state of the art. After the other engineers
                  left, I took over the full development pipeline: GCP, CI/CD on GitHub Actions, and database management.
                </p>
                <Tags items="OpenAI API · Structured Output · Next.js · Node.js · Express · Prisma + PostgreSQL · GCP · Stripe · GitHub Actions · CI/CD" />
              </div>
            </div>

            <div className="timeline__row">
              <div className="timeline__meta">
                <p className="timeline__company">Project Sustain, CSU</p>
                <p className="timeline__role">Software Engineer &amp; Research Assistant</p>
                <p className="timeline__date">Jan 2025 – Aug 2025</p>
              </div>
              <div className="timeline__body">
                <p className="prose">
                  Built statistics and data-science features for RamDesk, CSU&apos;s CS-department platform — Python backend
                  endpoints and frontend graphs for student grades, submissions, and timing. Extended its AI-detection
                  tooling with a citation-verification system that uses OpenAI structured output to parse references in any
                  format, then cross-checks them across DuckDuckGo, Bing, and Google with containerized Selenium. Also did
                  extensive Canvas API integration, admin and documentation work, and contributed to HoneyComb, a UAV/AI
                  drone-swarm system. Received the REI Undergraduate Research Stipend.
                </p>
                <Tags items="Python · Flask · React · MongoDB · OpenAI API · Selenium · Docker · Canvas API" />
              </div>
            </div>

            <div className="timeline__row">
              <div className="timeline__meta">
                <p className="timeline__company">CSU Robotics Lab</p>
                <p className="timeline__role">Robotics Research Volunteer</p>
                <p className="timeline__date">Jan 2024 – Dec 2025</p>
              </div>
              <div className="timeline__body">
                <p className="prose">
                  A year of volunteer robotics research on a ROS-based Fetch robot. I mastered it in simulation (Gazebo +
                  RViz), took over the physical robot after the student running it transferred schools, and mapped the CS
                  building lobby with its LIDAR navigation stack. For a Halloween demo I wrote a routine where Fetch roamed to waypoints, used YOLO to
                  pick out a person, rolled up with a spooky TTS joke, and handed over candy from its arm — then tucked and
                  sped off. I also started a Unity-to-ROS2 bridge for TurtleBot research.
                </p>
                <Tags items="ROS · ROS2 · Gazebo · RViz · Python · YOLO · Unity · LIDAR" />
              </div>
            </div>

            <div className="timeline__row">
              <div className="timeline__meta">
                <p className="timeline__company">Colorado State University</p>
                <p className="timeline__role">Undergraduate Teaching Assistant</p>
                <p className="timeline__date">Aug 2023 – Dec 2025</p>
              </div>
              <div className="timeline__body">
                <p className="prose">
                  Taught Python, Java, and Software Development as a CSU undergraduate teaching assistant, mentoring 200+
                  students per semester in coding, debugging, and software best practices, and developed labs and course
                  materials.
                </p>
                <Tags items="Teaching · Mentorship · Public Speaking · Python · Java" />
              </div>
            </div>

            <div className="timeline__row">
              <div className="timeline__meta">
                <p className="timeline__company">US Marine Corps</p>
                <p className="timeline__role">Refrigeration Tech · Utilities QC NCO</p>
                <p className="timeline__date">Oct 2018 – Oct 2022</p>
              </div>
              <div className="timeline__body">
                <p className="prose">
                  Four years in the US Marine Corps — a refrigeration technician who moved up to utilities QC NCO, running
                  scheduled-maintenance management for a fleet of 50+ AMMPS generators and field power operations, and a
                  Meritorious Corporal awarded the Soo Chow Creek Medal.{" "}
                  <Link href="/work" className="inline-link">
                    full service record →
                  </Link>
                </p>
                <Tags items="Leadership · Maintenance Management · Power Generation · Logistics" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Education (amber) ──────────────────────────────── */}
        <section className="section accent-amber" id="education">
          <div className="section-bar">
            <span className="section-bar__label">[ EDUCATION ]</span>
            <span className="section-bar__line" />
          </div>

          <div className="timeline">
            <div className="timeline__row">
              <div className="timeline__meta">
                <p className="timeline__company">Colorado State University</p>
                <p className="timeline__role">B.S. Computer Science</p>
                <p className="timeline__date">Jan 2023 – Dec 2025</p>
                <p className="timeline__date">
                  <span className="callout">GPA 3.96 / 4.0</span>
                </p>
              </div>
              <div className="timeline__body">
                <p className="prose">
                  Graduated December 2025. Relevant coursework: Machine Learning · Reinforcement Learning · Distributed
                  Systems (P2P and Cluster Computing) · AI Agents · Software Engineering · System Security · Game Design.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Projects (emerald) ─────────────────────────────── */}
        <section className="section accent-green" id="projects">
          <div className="section-bar">
            <span className="section-bar__label">[ PROJECTS ]</span>
            <span className="section-bar__line" />
          </div>

          <div className="card-grid">
            <article className="card">
              <p className="card__date">Aug 2025 – Present</p>
              <h3 className="card__title">
                <Link href="https://www.mealplangenerator.ai" target="_blank" rel="noopener noreferrer">
                  Meal Plan Generator AI
                </Link>
              </h3>
              <p className="prose">
                AI-powered meal planning platform that generates personalized weekly meal plans with recipes, nutrition
                information, and shopping lists. Uses reinforcement learning for preference adaptation with
                human-in-the-loop verification and dynamic recipe ranking.
              </p>
              <div className="card__spacer" />
              <Tags items="Python · Reinforcement Learning · AI · Nutrition Tracking" />
              <a className="card__link" href="https://www.mealplangenerator.ai" target="_blank" rel="noopener noreferrer">
                mealplangenerator.ai →
              </a>
            </article>

            <article className="card">
              <p className="card__date">Jul 2025 – Jun 2026</p>
              <h3 className="card__title">
                <Link href="https://wartable.ai" target="_blank" rel="noopener noreferrer">
                  WarTable™
                </Link>
              </h3>
              <p className="prose">
                A B2B SaaS platform built under Freestyle Consulting, centered on Athena — an AI agent that connects ~3,000
                apps through Pipedream and reasons over users&apos; tools and synced knowledge bases — and the WarTable Business
                Health Index, a multi-agent system that scores how a business is doing and generates verified, accountable
                improvement tasks.
              </p>
              <div className="card__spacer" />
              <Tags items="Next.js · Nest.js · Prisma + PostgreSQL · GCP · OpenRouter · Pipedream · ChromaDB · mem0 · Stripe" />
              <a className="card__link" href="https://wartable.ai" target="_blank" rel="noopener noreferrer">
                wartable.ai →
              </a>
            </article>
          </div>
        </section>

        {/* ── Skills (rotating accents) ──────────────────────── */}
        <section className="section accent-violet" id="skills">
          <div className="section-bar">
            <span className="section-bar__label">[ SKILLS ]</span>
            <span className="section-bar__line" />
          </div>

          <div className="skills-grid">
            {skills.map((block, i) => (
              <div className={`skill-block ${skillAccents[i % skillAccents.length]}`} key={block.category}>
                <h3 className="skill-block__head">{block.category}</h3>
                <ul className="skill-block__list">
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Contact (per-link accents) ─────────────────────── */}
        <section className="section accent-coral" id="contact">
          <div className="section-bar">
            <span className="section-bar__label">[ CONTACT ]</span>
            <span className="section-bar__line" />
          </div>

          <div className="contact-grid">
            <p className="prose">
              I&apos;m available for contract work and consulting opportunities — full-stack development, agentic AI, or
              DevOps. Always open to discussing new projects, interesting challenges, or permanent roles.
            </p>
            <div className="contact">
              <div className="contact__row accent-coral">
                <span className="contact__label">email</span>
                <a href="mailto:tyler@contraptionsoft.com">tyler@contraptionsoft.com</a>
              </div>
              <div className="contact__row accent-violet">
                <span className="contact__label">linkedin</span>
                <a href="https://linkedin.com/in/tylermmalone" target="_blank" rel="noopener noreferrer">
                  linkedin.com/in/tylermmalone
                </a>
              </div>
              <div className="contact__row accent-green">
                <span className="contact__label">github</span>
                <a href="https://github.com/19tylermalone94" target="_blank" rel="noopener noreferrer">
                  github.com/19tylermalone94
                </a>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
