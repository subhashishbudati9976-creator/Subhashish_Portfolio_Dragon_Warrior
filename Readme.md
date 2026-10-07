# 🐉 SUBHASHISH — DRAGON WARRIOR PORTFOLIO

<p align="center">
  <img src="./Screenshot%202026-09-15%20172644.png" alt="Subhashish Dragon Warrior Portfolio" width="100%" />
</p>

<p align="center">
  <strong>A portfolio built as an engineering project, a visual experiment, and a personal story.</strong>
</p>

<p align="center">
  <em>Not a template. Not a one-shot AI generation. Built, broken, rebuilt, tested, and refined.</em>
</p>

---

## 🎬 THE EXPERIENCE

<video src="./shadowfox-cinematic.mp4" autoplay muted loop playsinline controls width="100%"></video>

> **Place the final cinematic video at `./shadowfox-cinematic.mp4` in the repository.**
>
> The video is intentionally placed at the beginning of this README because the cinematic experience is one of the defining parts of the portfolio. If GitHub blocks autoplay, the video will still be available through the native controls.

---

# THE STORY BEHIND THE PORTFOLIO

This portfolio did not start as a dragon.

It did not start with a cinematic intro.

It did not start with a perfect design system, a 3D scene, an AI assistant, or a carefully engineered animation architecture.

It started with a much simpler question:

> **"How do I build a portfolio that actually feels like me?"**

I didn't want another developer portfolio with a gradient background, a few cards, a GitHub button, and a list of technologies.

I wanted something that could communicate how I think.

Something that could show engineering, creativity, experimentation, curiosity, and the willingness to keep rebuilding something until it finally feels right.

That became the idea behind the **Dragon Warrior Portfolio**.

And building it turned into a project of its own.

---

# 🐉 FROM PORTFOLIO TO DRAGON WARRIOR

The first versions were much more conventional.

There were cleaner layouts.

There were blue and cyan accents.

There were standard hero sections.

There were familiar portfolio patterns.

They worked.

But they didn't feel like **Subhashish**.

So the visual direction changed.

The blue/cyan identity gradually disappeared and was replaced with a darker **crimson, ember, black and warrior-inspired visual system**.

The portfolio stopped trying to look like every other modern developer website.

The goal became:

> **Make the website feel like entering a world.**

That is where the dragon came from.

Not because a dragon looks cool.

But because it became a visual metaphor for the way the project was being built:

**slowly, experimentally, through failures, iterations and constant refinement.**

---

# ⚔️ THE HARDEST PART — MAKING THE DRAGON REAL

The dragon cinematic became the most ambitious part of the entire project.

And it was also where most of the problems happened.

The journey went through multiple approaches.

### 1. Finding the right dragon

Different dragon assets and visual directions were explored.

There were:

- different dragon silhouettes
- different colors
- different 3D models
- different poses
- different materials
- different camera compositions
- different lighting setups

The screenshots from the development process show the dragon evolving from rough scene experiments into a much more deliberate cinematic composition.

There was no single "perfect asset" that solved the problem.

It had to be experimented with.

---

### 2. Building the cinematic scene

The dragon eventually became part of a real scene rather than simply being placed behind the hero.

The scene involved:

- a dragon model
- cinematic camera positioning
- directional lighting
- fog
- sky/background treatment
- ambient shadows
- foreground/background depth
- camera transforms
- scene events
- animation triggers
- responsive framing

The objective was never simply:

> "Put a dragon on the homepage."

The objective was:

> **Make the visitor feel like the camera is entering a world.**

---

# 🎞️ THE SCROLL-DRIVEN ANIMATION PROBLEM

This was probably the most frustrating part of the build.

The first cinematic approach relied too heavily on a normal video timeline.

That created a fundamental problem.

A video can look cinematic, but if the user cannot control the cinematic through scrolling, it doesn't feel like an interactive portfolio.

So the problem became:

> **How do you make scroll position control a cinematic sequence?**

We experimented with video scrubbing, frame-based animation, sprite sheets, cursor tracking, and different approaches to synchronizing animation with user input.

There were moments where:

- the animation lagged
- frames jumped
- the direction felt reversed
- the dragon appeared to move incorrectly
- the video became pixelated
- high-resolution output became difficult to maintain
- too many frames created performance problems
- the animation looked smooth in isolation but broke when connected to real scrolling

At one point the approach evolved from a few hundred frames toward a much larger frame sequence in an attempt to make the movement feel continuous.

That introduced a new problem:

> **More frames do not automatically mean better animation.**

The project had to balance:

**visual quality + frame density + file size + browser performance + scroll responsiveness.**

That became an engineering problem rather than simply a design problem.

---

# 🧠 THE BIG LESSON

The biggest change was realizing that the cinematic should not be treated as:

```text
Video → Play → Finish

It needed to behave more like:
Scroll Position
       ↓
Cinematic Progress
       ↓
Camera + Dragon + Environment
       ↓
Visual State
```
That change completely altered the architecture.
The final direction became scroll-first rather than autoplay-first.
Scrolling down advances the cinematic.
Stopping the scroll freezes the cinematic.
Scrolling backward reverses it.
Continuing forward progresses naturally.
The cinematic should eventually hand control back to the portfolio instead of feeling like a separate video page.
## 🎨 BUILDING THE VISUAL LANGUAGE
The portfolio gradually developed its own visual system.
The earlier blue/cyan aesthetic was replaced with a more controlled palette:
- deep black
- near-black surfaces
- crimson
- ember red
- muted gray
- white typography
- restrained accent gradients
The goal was not to use red everywhere.
The goal was to make red feel meaningful.
The typography was also deliberately separated by purpose.
Display
Editorial/display typography for major statements and hero content.
UI
A clean sans-serif system for navigation, descriptions and interface elements.
Technical
Monospace typography for labels, metrics, technical details and system-like elements.
This helped the portfolio feel less like a collection of effects and more like a designed interface.
## 🧩 BUILDING THE PORTFOLIO AS A REAL APPLICATION
Underneath the cinematic layer, the portfolio was structured as a real React application.
The project was broken into focused sections rather than one giant component.
src/
├── components/
├── hooks/
├── sections/
│   ├── AboutSection.tsx
│   ├── ExperienceSection.tsx
│   ├── HeroSection.tsx
│   ├── ProjectsSection.tsx
│   ├── SkillsSection.tsx
│   ├── ContactSection.tsx
│   ├── AssistantSection.tsx
│   └── MindsetSection.tsx
├── styles/
│   ├── components.css
│   ├── layout.css
│   ├── portfolio.css
│   ├── reset.css
│   ├── surfaces.css
│   ├── tokens.css
│   └── typography.css
├── types/
├── App.tsx
└── main.tsx

This became important because the project kept changing.
When the cinematic changed, the entire portfolio didn't need to be rewritten.
When the typography changed, the component structure didn't have to change.
When the color system changed, the visual tokens could change without destroying the application.
## 🧱 THE PORTFOLIO SECTIONS
HERO
The hero became the first statement of the portfolio.
It evolved from a conventional introduction into a more cinematic identity built around:
SUBHASHISH BUDATI
CSE + AI APPLICATIONS + SOFTWARE ENGINEERING
with the goal of immediately communicating:
I'm not only interested in writing code.
I'm interested in building things.

ABOUT — THE JOURNEY
The About section became less like a résumé paragraph and more like a personal timeline.
The central idea became:
BUILDING WITH CURIOSITY.
LEARNING BY DOING.

It connects computer science, engineering and creativity.
It also includes something that is genuinely part of my journey:
🎤 BEATBOXING
Engineering and beatboxing may seem unrelated.
But the portfolio intentionally connects them.
Both involve:
- timing
- rhythm
- repetition
- precision
- practice
- modular patterns
- continuous improvement
The portfolio uses that relationship as part of its personal identity rather than treating the website as a purely technical résumé.
💻 EXPERIENCE
The Experience section was designed around a timeline rather than a collection of generic cards.
The goal was to make progression visible.
The section also went through motion refinement so that entries reveal progressively while remaining readable and accessible.
Motion was treated as enhancement rather than something the content depends on.
🛠️ SKILLS
The Skills section was designed around the idea of:
TOOLS OF THE CRAFT

Rather than simply dumping a list of technologies, the portfolio separates them into conceptual groups.
Languages
- C
- Python
- Java
- HTML
- CSS
- SQL
Tools
- Git
- GitHub
- Docker
- GitHub Actions
Core Computer Science
- Data Structures
- DBMS
- Operating Systems
- Computer Networks
- Software Engineering
- Computer Organization & Architecture
- Algorithms
AI & Software Development
- AI-powered applications
- software engineering
- automation
- deployment
- developer tooling
The intention is to show both what I know and how I think about what I know.
🚀 PROJECTS
The Projects section is the engineering core of the portfolio.
Instead of presenting projects as simple cards, the goal was to communicate the problem, the engineering and the result.
Some of the projects represented in the portfolio include:
AI-Driven Chatbot
A containerized AI application developed around a full-stack architecture and DevOps workflow.
Technologies explored included:
- Python
- SQLAlchemy
- SQLite
- Docker
- Docker Compose
- GitHub Actions
- Prometheus
- Grafana
- AI APIs
This project also became part of the foundation for understanding containerization, observability and deployment.
AVENUE
An intelligent banking/branch operations project focused on:
- demand forecasting
- bottleneck detection
- wait-time estimation
- recommendation systems
- simulation
- feedback analysis
- branch management
The project combines data engineering, machine learning and application development.
Railway Reservation System
A software engineering project focused on modelling and implementing a reservation workflow.
Expense Tracker
A practical application focused on managing expenses and presenting structured financial information.
## 🤖 ZEBX AI
One of the most ambitious ideas in the portfolio was making the portfolio itself interactive.
Instead of forcing recruiters to navigate everything manually, the portfolio gained its own AI assistant:
ZEBX AI
The concept:
Ask the portfolio about Subhashish.

Zebx was designed as a personal intelligence layer capable of explaining:
- projects
- skills
- experience
- education
- technical interests
- portfolio content
The assistant was deliberately separated behind a service boundary so that the UI would not become tightly coupled to the AI provider.
That became important when the AI integration didn't behave perfectly.
At one point the interface displayed:
"ZEBX AI could not respond right now."

That wasn't hidden.
It became another engineering lesson.
AI features need:
- failure handling
- clear boundaries
- graceful UI states
- provider isolation
- predictable APIs
A portfolio should never become unusable just because an external AI service fails.
## 🧪 THE PROBLEMS I ACTUALLY FACED
This project was not a straight line.
There were failures everywhere.
❌ The first visual direction didn't feel right
Solution:
Reworked the identity from a generic modern portfolio into the Dragon Warrior / ShadowFox concept.
❌ Blue/cyan styling weakened the identity
Solution:
Replaced the palette with a controlled crimson/ember system.
❌ The cinematic looked like a normal video
Solution:
Changed the architecture toward scroll-controlled cinematic progression.
❌ Scroll animation lagged
Solution:
Investigated frame density, scrubbing strategy, asset resolution and browser-side performance instead of simply adding more animation.
❌ Animation direction felt wrong
Solution:
Reworked the mapping between user input and cinematic progress.
❌ High-frame-count approaches became heavy
Solution:
Evaluated the tradeoff between frame count, visual quality, responsiveness and browser performance.
❌ AI assistant failed to respond
Solution:
Introduced a cleaner service boundary and treated provider failure as a state the interface must handle rather than allowing the entire application to depend on successful AI responses.
❌ The portfolio kept becoming visually overloaded
Solution:
Separated motion systems and made animation serve hierarchy instead of adding effects everywhere.
❌ Building with AI tools introduced another challenge
AI could generate code quickly.
But generated code is not automatically good architecture.
The project therefore went through repeated cycles of:
Generate
   ↓
Run
   ↓
Break
   ↓
Inspect
   ↓
Understand
   ↓
Refactor
   ↓
Validate
   ↓
Repeat

That loop became one of the most important parts of the project.
## 🧰 TOOLS THAT BECAME PART OF THE JOURNEY
The development process involved far more than writing React code.
Different tools were used for different problems:
- React
- Vite
- TypeScript
- CSS
- Motion / animation tooling
- Antigravity IDE
- Blender
- 3D scene editors
- Meshy
- Sketchfab
- Higgsfield
- Gemini
- Git
- GitHub
- Vercel
- FFmpeg
Some tools generated assets.
Some helped construct scenes.
Some helped debug code.
Some helped generate ideas.
And some simply helped prove that a particular approach was not going to work.
That is part of the process too.
## 🔬 THE 3D / DRAGON LAB
The screenshots captured during development show the dragon going through multiple iterations.
There were scenes with:
- different dragon models
- different materials
- different camera positions
- different lighting
- different compositions
- fog
- environment settings
- animation/event controls
- responsive scene configurations
The dragon wasn't simply downloaded and dropped into the website.
The scene itself became an experiment.
A large part of the work was figuring out:
What does the camera need to do for the dragon to actually feel cinematic?

That question was harder than:
"How do I render a dragon?"

## 📐 DESIGNING FOR MOTION WITHOUT DESTROYING UX
One of the biggest principles that emerged from the project was:
Motion should explain the interface, not fight it.

The portfolio therefore separates different kinds of motion.
Micro interaction
Buttons, cards and small interface feedback.
Section reveal
Content enters when it becomes relevant.
Parallax
Adds depth without controlling the entire experience.
Cinematic motion
Reserved for the major Dragon Warrior experience.
Reduced motion
Users who prefer reduced motion should still receive the complete content and experience.
The goal was to make the website feel alive without making it exhausting.
## 🧠 ENGINEERING OVER EFFECTS
One of the easiest mistakes when building a visually ambitious portfolio is to focus entirely on appearance.
This project repeatedly forced the opposite lesson.
A beautiful effect that:
- breaks scrolling
- destroys performance
- fails on mobile
- blocks content
- breaks accessibility
- crashes when an API fails
is not a good feature.
So the project gradually moved toward a philosophy of:
Visual ambition
        +
Engineering discipline
        =
A useful experience

## 🧪 VALIDATION
The portfolio was not considered finished simply because the browser showed something.
The implementation went through repeated validation involving:
- development builds
- production builds
- responsive layouts
- browser testing
- animation testing
- scroll behavior
- AI failure states
- Git/GitHub integration
- deployment checks
- visual inspection
- component refactoring
The project was also pushed into GitHub as an actual version-controlled application rather than remaining an experiment inside an IDE.
## 📸 THE BUILD JOURNEY
The screenshots in this repository document the evolution of the project across September 2026.
They capture the project at different stages:
September 6
The project was being established as a real Git repository and application.
September 10
The 3D/dragon experimentation began accelerating.
Different models, scenes and cinematic directions were tested.
September 12
The dragon scene became much more deliberate.
Camera positioning, lighting, fog, assets and cinematic composition were being actively tuned.
September 13
The portfolio and cinematic systems began coming together.
The concept shifted from isolated experiments toward an actual portfolio experience.
September 14
The visual identity became more consistent.
September 15
Major portfolio sections, typography, colors, assistant UI and cinematic integration were being refined simultaneously.
September 18
The project entered a deeper refinement stage involving the cinematic welcome experience, code architecture and additional runtime dependencies.
What looks like a finished portfolio today is therefore not the result of one implementation.
It is the result of many discarded implementations.
## 🗂️ DEVELOPMENT ARCHIVE
The repository contains the visual record of that process.
Representative milestones include:
The portfolio taking shape
<img src="./Screenshot%202026-09-15%20172644.png" alt="Portfolio identity" width="100%" />

Early dragon experimentation
<img src="./Screenshot%202026-09-10%20022313.png" alt="Early Blender dragon experimentation" width="100%" />

Building the cinematic scene
<img src="./Screenshot%202026-09-13%20001001.png" alt="ShadowFox Dragon Cinematic scene" width="100%" />

Camera and scene engineering
<img src="./Screenshot%202026-09-12%20230729.png" alt="Dragon cinematic camera setup" width="100%" />

Portfolio architecture
<img src="./Screenshot%202026-09-13%20150945.png" alt="Portfolio React architecture" width="100%" />

Typography and visual system
<img src="./Screenshot%202026-09-06%20014514.png" alt="Typography and Git setup" width="100%" />

The journey section
<img src="./Screenshot%202026-09-18%20154615.png" alt="Portfolio journey section" width="100%" />

Skills system
<img src="./Screenshot%202026-09-15%20093903.png" alt="Portfolio skills section" width="100%" />

Contact experience
<img src="./Screenshot%202026-09-15%20101336.png" alt="Portfolio contact section" width="100%" />

Zebx AI
<img src="./Screenshot%202026-09-15%20133053.png" alt="Zebx AI portfolio assistant" width="100%" />

## 🏗️ ARCHITECTURE
The portfolio is built using a component-based React architecture.
                    ┌─────────────────────┐
                    │      React App      │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        Portfolio UI       Motion System    AI Assistant
              │                │                │
              │                │                ▼
              │                │          Zebx Service
              │                │                │
              │                │                ▼
              │                │          Gemini Provider
              │                │
              ▼                ▼
       Content Sections   Cinematic Layer
              │                │
              │                ▼
              │        Dragon / Camera /
              │        Parallax / Effects
              │
              ▼
        Responsive Layout

The architecture intentionally keeps the cinematic experience from becoming the entire application.
The portfolio remains usable even when the cinematic or AI layer is unavailable.
## ⚙️ TECH STACK
Frontend
- React
- TypeScript
- Vite
- HTML
- CSS
Motion & Interaction
- Scroll-driven animation
- Parallax
- Responsive motion
- Cinematic transitions
- Intersection-based reveals
- Reduced-motion handling
AI
- Gemini
- @google/genai
- Zebx AI service architecture
3D / Media
- Blender
- 3D scene workflows
- FFmpeg
- AI-assisted asset generation
- Cinematic video workflows
Development
- Git
- GitHub
- Antigravity IDE
- Vercel
## 📱 RESPONSIVENESS
The portfolio was designed with the understanding that the cinematic experience cannot be allowed to destroy the actual website.
The interface therefore needs to adapt across:
- desktop
- laptop
- tablet
- mobile
The cinematic layer is treated differently depending on available screen space and device capability.
The content always remains more important than the effect.
## ♿ ACCESSIBILITY & RESILIENCE
A visually ambitious portfolio still needs to behave like a real application.
The project therefore considers:
- reduced-motion preferences
- keyboard interaction
- readable typography
- focus behavior
- graceful AI failure states
- responsive layouts
- non-cinematic fallbacks
The principle is simple:
If the animation disappears, the portfolio should still make sense.

## 🚀 DEPLOYMENT
The portfolio was ultimately taken from local experiments to a real deployed website.
Development involved:
npm install
npm run dev
npm run build

Git was used throughout the process to track the project and push the application into GitHub.
The production deployment was made through:
Vercel
## 📚 WHAT THIS PROJECT TAUGHT ME
This project taught me things that a normal tutorial project probably wouldn't have.
1. A design can be technically correct and still feel wrong.
That is why the portfolio was rebuilt multiple times.
2. More animation does not mean a better experience.
Animation needs hierarchy.
3. More frames do not automatically solve smoothness.
Performance is part of the design.
4. AI-generated code still needs an engineer.
The hardest part was often not generating code.
It was deciding:
Should this code exist at all?

5. Failure states are features.
The Zebx AI failure taught that an application must gracefully handle things going wrong.
6. Assets are engineering decisions.
A beautiful 3D model with the wrong license, wrong format, huge file size or poor browser performance is not automatically useful.
7. The browser is the final judge.
Something can look perfect inside an editor and completely different once connected to real scrolling, real assets and a real browser.
## 🐉 WHY "DRAGON WARRIOR"?
The dragon is not just decoration.
It represents the philosophy behind the project.
A warrior is not defined by never failing.
A warrior is defined by returning to the problem.
Again.
And again.
And again.
That is exactly what happened during this build.
The dragon changed.
The animation changed.
The colors changed.
The architecture changed.
The AI changed.
The implementation changed.
The idea itself changed.
But the goal stayed the same:
Build something that I can look at and say, "Yeah. This feels like mine."

## 🔥 THE REAL PROJECT
The final website is only one part of this project.
The other part is everything that happened before it.
The broken animations.
The failed video scrubbing.
The wrong camera angles.
The heavy frame sequences.
The pixelated output.
The API failures.
The 3D experiments.
The redesigns.
The refactors.
The late-night debugging.
The rebuilds.
The moments where the easiest option would have been to stop.
And then:
Try
 ↓
Break
 ↓
Learn
 ↓
Rebuild
 ↓
Improve
 ↓
Repeat

That loop is the real portfolio.
## 🏆 FINAL THOUGHT
I didn't build this portfolio to prove that I know every technology.
I built it to show how I approach problems.
Give me something complicated.
I'll probably break it first.
Then I'll figure out why.
Then I'll rebuild it better.
That is how this portfolio was made.
And that is probably the most accurate representation of how I want to build software.
<p align="center">

🐉 BUILD WITH CURIOSITY.
⚔️ LEARN BY DOING.
🔥 BREAK. REBUILD. IMPROVE.
<strong>SUBHASHISH BUDATI</strong>
CSE + AI APPLICATIONS + SOFTWARE ENGINEERING
</p>

## 📌 PROJECT STATUS
Status: 🟢 Deployed & continuously refined
Primary goal: Build a portfolio that combines software engineering, AI, interaction design, 3D experimentation and personal identity.
Signature experience: 🐉 ShadowFox / Dragon Warrior Cinematic
AI companion: 🤖 Zebx AI
Deployment: Vercel
📸 BUILD JOURNAL
The repository's screenshots are intentionally kept as a visual record of the development process.
They include:
- early portfolio iterations
- visual redesigns
- dragon model experiments
- Blender experiments
- 3D scene construction
- camera setup
- lighting and fog experiments
- cinematic interaction experiments
- React architecture
- typography system
- Git/GitHub workflow
- Zebx AI
- final portfolio sections
- responsive and visual refinement
These are not just screenshots of the finished product.
They are evidence of how the product was built.
<p align="center">
  <em>
  "The goal was never to build the perfect portfolio on the first attempt.<br/>
  The goal was to become better at building it every time it broke."
  </em>
</p>
```