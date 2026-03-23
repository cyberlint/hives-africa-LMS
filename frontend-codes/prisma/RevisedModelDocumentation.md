# NextHive Architecture: The Activity Engine

## 1. Executive Summary & Vision

NextHive is designed to be a community-driven, pan-African learning ecosystem. To bridge the gap between the isolation of self-paced learning and the rigidity of cohort-based bootcamps, the platform shifts the primary metric of success from "content consumption" (videos watched) to "proof of capability" (projects built, events hosted, peers mentored).

The **Activity Engine** is the core database architecture powering this vision. It sits parallel to the standard content hierarchy (`Course` → `Module` → `Lesson`), providing a highly scalable, flexible system for evaluating real-world competencies (KSBs), facilitating peer-to-peer review, and generating verifiable career portfolios.

## 2. Core Architectural Pillars

### Pillar A: Program & Graduation Grouping

Instead of tying graduation strictly to individual courses, the architecture uses a `Program` layer to allow for flexible graduation pathways and macro-level skill tracking.

* **`Program`**: Groups multiple courses and activities into a unified track (e.g., "Data Engineering Track").
* **`ProgramCourse`**: A pivot table that allows the system to designate which courses are mandatory versus optional electives within a specific program.

### Pillar B: The Universal Activity Layer

The system does not hardcode separate tables for Projects, Capstones, or Events. Instead, it utilizes a single, unified `Activity` model. This allows the platform to evolve infinitely without requiring structural database migrations.

* **`Activity`**: The central entity representing anything a learner *does*. Activities can be bound to a specific course, an entire program, or exist globally (e.g., a community-hosted "AI Tutorial in Yoruba").
* *Key Enums*: Controlled by `ActivityType` (e.g., `PROJECT`, `EVENT_HOSTING`, `PEER_REVIEW`) and `ActivityDifficulty`.


* **`ActivityRequirement`**: Defines the specific deliverables required for the activity using strict enums (`RequirementType` like `GITHUB_REPO`, `LIVE_DEMO`), ensuring consistent data payloads while remaining flexible via a JSON config field.

### Pillar C: Collaboration & Participation

Learning is inherently social. The engine natively supports collaborative work and dynamic user roles.

* **`Participation`**: Tracks a user's relationship to an activity. Through the `ParticipationRole` enum, a single activity can simultaneously manage `PARTICIPANT`s (learners doing the work), `REVIEWER`s (peers evaluating), and `MENTOR`s (guides).
* **`Team` & `TeamMember**`: Supports startup-style learning, hackathons, and group capstones. Teams are strictly bound to specific activities to prevent cross-contamination of group data.

### Pillar D: Submission & Scalable Validation (The Review Engine)

To prevent human-review bottlenecks as the platform scales, the architecture distributes evaluation across the community.

* **`Submission`**: The immutable record of a learner's or team's submitted evidence. Uses a JSON payload (`content`) to support any deliverable type. Application-layer logic enforces that a submission belongs to *either* a user *or* a team, never both.
* **`ReviewAssignment`**: The traffic controller. This model drives the "Distribution Engine," ensuring peer reviews are systematically assigned with tracking for pending, completed, or expired tasks.
* **`Review`**: The actual evaluation, capturing scores, written feedback, and granular rubric breakdowns. Credibility is weighted using the `ReviewType` enum (`PEER`, `INSTRUCTOR`, `MENTOR`).

### Pillar E: The Value Layer (Career Currency)

The ultimate output of the Activity Engine is verifiable proof of capability, turning the platform into a talent marketplace.

* **`KSB` (Knowledge, Skills, Behaviors)**: The atomic units of competency.
* **`ActivityKSB` & `UserKSB**`: Activities are mapped to specific KSBs. When a submission is approved, the learner is permanently awarded those competencies via `UserKSB`, creating a highly queryable skills transcript.
* **`ReputationTransaction`**: A ledger-based gamification engine. Users earn points for high-value actions (reviewing peers, hosting events, building projects), creating organic motivation and unlocking higher community status.
* **`PortfolioItem`**: Curation layer. Approved submissions can be published to a user's public portfolio, transforming their learning history into an employer-facing showcase.