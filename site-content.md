# Tyler Malone

Software Engineer specializing in full-stack development, DevOps, distributed systems, and agentic AI.

Role: Software Engineer · Full-Stack · DevOps · AI / Agent Systems

## About

I am a software engineer specializing in agentic AI systems — agent memory, retrieval, and tool use — and the full-stack and DevOps work required to deploy them. Most recently I built WarTable: an AI agent that operates over a user's connected apps and knowledge bases, a multi-agent system that scores business health, and the supporting infrastructure on GCP. I primarily work with Next.js, Nest.js, Prisma, PostgreSQL, and ChromaDB, and I handle projects from development through deployment.

I served four years in the US Marine Corps as a refrigeration technician and later managed maintenance for a fleet of generators. I then studied computer science at Colorado State University, where I worked as a teaching assistant, conducted research, and spent a year on a robotics project. I am currently available for contract work and open to roles in the United States or Japan.

## Experience

### WarTable by Freestyle Consulting
Software Engineer (Full-Stack & DevOps) — Contract
Jul 2025 – Jun 2026

Took WarTable from nothing to a production application built around Athena, an AI agent users chat with on the web and on mobile. Athena can connect to roughly 3,000 apps through Pipedream Connect, and I built a filtering layer that lets users turn individual MCP server tools on or off, plus support for dynamic client MCP servers so users can plug in their own.

I built the knowledge base system on ChromaDB: users connect and browse their Drive apps and sync files into knowledge bases, where document contents are extracted, chunked, and embedded (or summarized), and both Athena and the WBHI draw on those alongside the connected apps. Syncing is automatic — users can watch a folder, get a WarTable notification when new files land, and choose to sync all, some, or none, with an ignore feature for files they want skipped. Memory is handled with mem0, scoped at both the user and workspace level, and real-time notifications and AI response streaming run over WebSockets.

I built the agent orchestration behind the WarTable Business Health Index (WBHI), where agents divide and conquer across a user's connected apps and notes, discuss findings among themselves, and produce a score for how the business is doing. On top of it I added a guided feedback loop: tasks are generated from your last evaluation, each with a predicted score increase and a definition of done, followed by an agentic verification step that checks whether the requirements were genuinely met — keeping the score honest and everyone accountable.

I added a Routines feature for scheduling an agent to carry out long, multi-step tasks or skills, and built the app configuration for billing, credits, plan features, and quotas. Those are managed through a completely separate admin app I also built, which communicates directly with the database — so the WarTable backend only exposes endpoints meant for a logged-in user, with no admin endpoints in the main app. I set up staging, dev, and release environments on GCP, deploying to Cloud Run with GitHub Actions and Docker (including migrations), and used Linear for project management.

Technologies: Next.js · Nest.js · Prisma + PostgreSQL · GCP · Firebase · OpenRouter · Pipedream · Vapi · ChromaDB · mem0 · Stripe

### HYVV
Software Engineer (Full-Stack & DevOps) — Contract
Dec 2024 – Dec 2025

Built early AI features for the platform on the OpenAI API. One was a conversational agent backed by a clipboard-style questionnaire and talking points that extracted context from users so the platform could plan and carry out tasks for their business. Another let users generate products and features — complete with images — from a single prompt. This was early 2025, when AI apps were still mostly structured output behind a button, before heavy tool use or MCP.

After the other engineers separated from the company, I took responsibility for the entire development pipeline — running everything on GCP, handling CI/CD through GitHub Actions, and managing the database.

Technologies: OpenAI API · Structured Output · Next.js · Node.js · Express · Prisma + PostgreSQL · GCP · Stripe · GitHub Actions · CI/CD

### Project Sustain, Colorado State University
Software Engineer & Research Assistant
Jan 2025 – Aug 2025

My first feature on RamDesk — the CSU computer-science department's platform — was a statistics suite: Python backend endpoints feeding frontend graphs and plots that surface student grades, submission counts, submission timing, and similar metrics.

I then extended a tool built to detect AI-written student papers by adding a system that flags suspicious references in a paper's bibliography. It uses OpenAI structured output to extract citation details from any format (MLA and the rest), then cross-checks that metadata against the open web. The checker tries the cheapest signal first — a DOI if there is one, then a URL, and finally an author/title/year lookup that actually has to search — and runs across DuckDuckGo, Bing, and Google so a rate limit on one engine falls through to the others. It drives Selenium with Firefox inside a container; getting past bot detection is hard, so the system deliberately errs toward false negatives, only flagging a reference when nothing checks out.

The verification work ran in Docker and was dispatched to worker machines, since the web-automation side is memory-heavy — solid, hands-on Docker experience. I also built an admin view showing who is currently logged in and when each user last signed in, generated student profile pictures through the Canvas API, and worked constantly against the Canvas LMS API — requesting scopes through my team lead — to build grading and inspection features, plus faster replacements for things the sluggish Canvas web shell already does. Along the way I helped produce tutorial videos and user-facing documentation, and contributed to HoneyComb, a UAV/AI drone-swarm system for agricultural intelligence. I received the REI Undergraduate Research Stipend in Summer 2025.

Technologies: Python · Flask · React · MongoDB · OpenAI API · Structured Output · Selenium · Docker · Canvas API · Web Scraping · Data Viz · UAV Systems

### Colorado State University
Undergraduate Teaching Assistant
Aug 2023 – Dec 2025

I taught Python (Fall 2023), Java (Spring 2024), and Software Development (Fall 2024 onward). I mentored more than 200 students each semester in coding, debugging, and software best practices, and I developed labs and course materials.

Technologies: Teaching · Public Speaking · Mentorship · Python · Java · Software Development

### CSU Robotics Lab
Robotics Research Volunteer
Jan 2024 – Dec 2025

A year of unpaid, volunteer robotics research at CSU — I took it for the chance to work with expensive hardware. A friend from the video game dev club I'd done game jams with got me into the lab before he transferred schools. The lab had an old ROS-based Fetch robot and a newer ROS2 robot I worked with virtually. My first task was to master the Fetch in simulation: I spent about a month buried in the ROS and Fetch docs, running the demos, and learning the fiddly details — placing AR tags in Gazebo, catching when configs are in meters versus millimeters, lighting, and driving and monitoring the robot through RViz.

Next I checked whether the physical robot still worked, now that the student who had been running it was gone, so I spent several nights verifying that everything I'd done in simulation held up on real hardware, writing scripts to reset the robot to known positions while testing routines and keeping it well clear of obstacles. Late one night, with the building empty, I mapped the lobby of the CS building using ROS's Fetch navigation and mapping nodes, building an occupancy map from the LIDAR and laser scans and marking out no-go zones.

On Halloween we ran a demo on that map: Fetch used ROS navigation and localization plus a bit I wrote with YOLO to spot a person, then roamed to a waypoint, looked around, picked someone, rolled up playing Ghostbusters, delivered a Halloween joke in spooky TTS, extended its arm to hand over candy from a pumpkin bucket, and tucked and scurried off to the next waypoint. I also started a project bridging the Unity game engine to ROS2 for research with TurtleBot.

Technologies: ROS · ROS2 · Gazebo · RViz · Python 2/3 · YOLO · Unity · XR · LIDAR · SLAM

### US Marine Corps
Refrigeration Technician · Utilities Operations SNCO · Utilities Quality Control SNCO
Oct 2018 – Oct 2022

I served as a Meritorious Corporal in the 4th Marines, 3rd Marine Division. I started as a refrigeration technician — air conditioning and HVAC/R — reading schematics, troubleshooting from technical manuals, and repairing equipment, and my scope quickly grew beyond AC to electrical systems, diesel-engine generators, and water purification systems, along with the inventory and maintenance they required.

I moved up to Quality Control NCO and effectively became the operator-maintenance manager for the section. Most equipment had tasks the operator was responsible for and others handled at a different echelon — scheduled or corrective — and the program was a mess when I arrived. I brought our entire generator fleet under control: more than fifty AMMPS sets ranging from 1.5kW to 30kW, powered by Cummins, Kubota, and Yanmar engines. I owned the scheduled maintenance while a counterpart handled corrective, tracking technician sheets, scheduling services, moving equipment, and ordering parts through a clunky maintenance system where every level of the chain of command had its own rules for how fields should be filled in and categorized. You would think it could scan a technical manual, match a manufacturer ID, and load the checklists and intervals automatically — it could not. Once it was sorted, it ran smoothly. I was trusted enough with the maintenance-management process that I was also put in charge of the company's combat engineer equipment — heavy demolition and construction gear — even though we had no combat engineers.

At MWX — the Marine Corps' largest field exercise, at 29 Palms — I designed the power plan and the full packing list for power operations, plus several on-base operations, and was relied on heavily. After a vehicle rollover I was moved onto tactical driving when I mentioned I held a license, and ran some genuinely gnarly JLTV driving courses. In the field I worked as the engineer, out with a couple of generators, cables, and breakers, constantly packing up, repositioning, and concealing in terrain and canyons during a notional war exercise. My 5kW set started leaking oil around the filter with no way to get parts forward, so I fell back to a far less forgiving backup — a dirty tank and a temperament where you could look at it wrong and it would quit. I spent three days more or less head-down in that machine, working the throttle by hand and siphoning fuel to keep it alive long enough for the comms and fire-support teams to do their jobs.

When COVID hit I put in a lot of work keeping that equipment running, and the 4th Marine Regiment's commanding officer, Col. Tracy, awarded me the Soo Chow Creek Medal — the same commander who gave me a Meritorious Mast for taking first place in the company shooting competition. The top shooters went on to compete against the Japan Ground Self-Defense Force in a joint match that even had US special forces in it; we lost, but it was an incredible experience. I also carried color guard for my company as the left rifle bearer, scored a 292/300 PFT and a near-perfect CFT, earned meritorious promotions, volunteered on beach cleanups, and took Japanese classes. I chipped away at online coursework the whole time — once finishing a class from the field — and started coding in 2021 with JavaScript on freeCodeCamp.

Technologies: Leadership · Maintenance Management · Power Generation · HVAC/R · Diesel Generators · Electrical Systems · Troubleshooting · Logistics

## Education

### Colorado State University
B.S. Computer Science
Jan 2023 – Dec 2025
GPA 3.96 / 4.0

Graduated December 2025. Relevant coursework: Machine Learning · Reinforcement Learning · Distributed Systems (P2P and Cluster Computing) · AI Agents · Software Engineering · System Security · Game Design.

## Skills

- Languages: Python, TypeScript, JavaScript, Java
- Frontend: React, Next.js
- Backend: Node.js, Express, NestJS, FastAPI, Flask
- Databases & ORM: PostgreSQL, Prisma, MongoDB, ChromaDB
- Cloud & DevOps: GCP, AWS, Azure, Cloud Run, Docker, GitHub Actions, CI/CD
- AI & Agents: Agentic AI, RAG, MCP, OpenAI API, OpenRouter, Structured Output, mem0, Reinforcement Learning
- Robotics & CV: ROS, ROS2, Gazebo, RViz, YOLO, Unity, Computer Vision
- Integrations & Realtime: Pipedream, Stripe, Vapi, Firebase, WebSockets, Canvas API, Selenium
- Data & Distributed Systems: Distributed Systems, Peer-to-Peer Systems, Spark, HDFS, Data Visualization
- Methodologies: TDD, Agile, Git
- Soft Skills: Communication, Leadership, Problem-Solving, Mentorship

## Service Record

### Technical Training
- Basic Refrigeration And Air Conditioning Technician's Course
- Advanced Engineer Equipment Electrical Systems Technician's Course

### Military Awards
- National Defense Service Medal — Awarded for active federal service in the armed forces between June 27, 1950 – July 1954; Jan. 1, 1961 – Aug. 14, 1974; and from Aug. 2, 1990 – Dec. 31, 2022.
- Marine Corps Good Conduct Medal — Awarded to Marines after three consecutive years of honorable and faithful service.
- USMC Sea Service Deployment Ribbon (x3) — Awarded to Marines who complete a deployment at sea or with an overseas unit.
- Global War on Terrorism Service Medal — Awarded to military personnel who have served in support of operations related to the Global War on Terrorism.

### Special Military Recognitions
- Meritorious Promotion to Noncommissioned Officer
- Soochow Creek Medal — Awarded by the 4th Marine Regiment Commanding Officer, Colonel Tracy, for exemplary performance of duties at the height of the COVID-19 pandemic.
- Meritorious Mast — Won 1st place in company shooting competition, after which I competed against the Japanese Self-Defense Forces in a joint-service shooting competition.

## Contact

- Email: tyler@contraptionsoft.com
- LinkedIn: https://linkedin.com/in/tylermmalone
- GitHub: https://github.com/19tylermalone94

Always open to discussing new projects and interesting challenges.
