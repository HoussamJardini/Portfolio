// ==========================================
// PORTFOLIO CONTENT
// ==========================================
// Every word on the site lives in this file.
// Project media is picked up automatically from
// src/assets/projects/<project-slug>/ (see src/data/media.js).
// Files are shown in name order: 01-*.webp, 02-*.mp4, ...
// ==========================================

export const person = {
  name: "Houssam Jardini",
  role: "AI / Machine Learning Engineer",
  location: "Kénitra, Morocco",
  availability: "Available now",
  availabilityWhere: "Rabat / Kénitra",
  email: "jardini.houssam@uit.ac.ma",
  phone: "+212 689 631 536",
  github: "https://github.com/HoussamJardini",
  linkedin: "https://www.linkedin.com/in/jardini-houssam-116b762a7",
  cv: { en: "Houssam_Jardini_CV.pdf", fr: "Houssam_Jardini_CV_FR.pdf" },
};

export const hero = {
  lineA: "Models from scratch.",
  lineB: "Software around them.",
  intro:
    "I'm Houssam, an AI engineer who just finished a Master of Excellence in AI. I train models when the off-the-shelf ones are too heavy, too slow or too wrong, then build the app, the API and the edge cases that make them useful.",
  proof: [
    { value: "9.71M", unit: "params", note: "table-structure model, trained from scratch" },
    { value: "0.016", unit: "from SOTA", note: "S-TEDS gap to a 53M-param model" },
    { value: "−98%", unit: "labelling", note: "synthetic annotation at Arteka" },
    { value: "Boeing", unit: "Innovation Prize", note: "Injaz Al-Maghrib national competition" },
  ],
};

// The 3D specimen in the hero cycles through these. Each one is a real
// structure from a real project.
export const specimens = [
  { id: "hand", label: "21 hand landmarks", source: "VoxMea · Code212 gripper" },
  { id: "table", label: "Table structure, OTSL grid", source: "Table-structure model" },
  { id: "pose", label: "33-point body pose", source: "MotionSync" },
  { id: "pitch", label: "Pitch lines, 28 classes", source: "Arteka" },
  { id: "arm", label: "4-DOF arm, PPO", source: "Robotic Arm RL" },
];

export const about = {
  paragraphs: [
    "My best work happens where a research problem meets a hard constraint. At Harmony Technology the constraint was a confidential client and an 8 GB laptop with no GPU. So the whole document pipeline had to run offline, and the state-of-the-art table model was too heavy. I wrote a smaller one.",
    "Before that I generated 10,000 labelled football-pitch images in Unity instead of drawing them by hand, led a team of students to the Boeing Innovation Prize with a pose-tracking fitness app, and shipped a mobile game that stayed on Google Play for more than nine months.",
    "I like measuring things. Most projects below come with the number that convinced me they worked, and the benchmark it was measured on.",
  ],
  facts: [
    ["Based in", "Kénitra, mobile on Rabat"],
    ["Degree", "Master of Excellence, AI & Connected Objects (Bac+5)"],
    ["Languages", "Arabic · English C1 · French B2"],
    ["Also", "Part-time programming instructor, Group Academy"],
  ],
};

// ------------------------------------------
// FLAGSHIP: the PFE work, told in full
// ------------------------------------------
export const flagship = {
  org: "Harmony Technology · Data & AI Unit",
  period: "Feb – Aug 2026 · end-of-studies internship",
  title: "Reading documents without the cloud",
  lede:
    "Confidential client documents, CPU-only office hardware, no external API allowed at any step. I built DocStruct to work inside those walls, then replaced its heaviest component with a model of my own.",
  docstruct: {
    name: "DocStruct",
    blurb:
      "PDF, Office files and scans in; clean Markdown, JSON and user-defined schemas out. Docling pipeline extended with a custom PaddleOCR engine, a local GGUF LLM for structured extraction, React 19 workspace on a hardened FastAPI backend.",
    stats: [
      { k: "99%", v: "valid JSON with schema-constrained decoding, up from 34–54%" },
      { k: "+6.5 pts", v: "field accuracy from constrained decoding (80.3%)" },
      { k: "12 LLMs", v: "benchmarked on 409 real invoices" },
      { k: "8 GB", v: "RAM, no GPU. Every target in the spec met" },
    ],
  },
  tsr: {
    name: "Table-structure recognition model",
    blurb:
      "Image → OTSL tokens → HTML. PP-LCNet encoder, transformer decoder, multi-scale fusion neck, and an auxiliary cell-box head that trains the model then gets dropped at inference. Twelve controlled generations, one variable at a time, selected on real scanned tables rather than the easy benchmark.",
    compare: [
      { name: "Mine (v12 Fusion)", params: 9.71, steds: 0.872 },
      { name: "TableFormer", params: 53, steds: 0.888 },
    ],
    notes: [
      "Grammar-constrained decoding: invalid tables cannot be generated",
      "120k steps, 12.25 h unattended on one NVIDIA L4",
      "Less than half the catastrophic failures of the baseline",
      "Written up as a Springer LNCS paper with my supervisors",
    ],
  },
};

// ------------------------------------------
// WORK INDEX
// slug = folder name under src/assets/projects/
// figure = which drawing to use when no screenshot exists
// ------------------------------------------
export const projects = [
  {
    slug: "docstruct",
    title: "DocStruct",
    year: "2026",
    field: "Document AI",
    metric: "100% offline",
    figure: "document",
    summary: "Offline document parsing and structured extraction, CPU-only on 8 GB of RAM.",
    body: [
      "Turns PDF, DOCX, PPTX, XLSX, HTML and scanned images into Markdown, JSON and user-defined schemas with no cloud call at any stage.",
      "I extended Docling's PDF pipeline to plug in PaddleOCR PP-OCRv5 as a custom engine, and wrote the extraction module around a local GGUF model: templates become JSON Schemas, and decoding is constrained to them. That single change moved JSON validity from 34–54% to 99%.",
      "The frontend is a React 19 workspace with JSON-to-document highlighting, a visual schema builder and a full table editor. The FastAPI backend was hardened against path traversal, pickle RCE and oversized uploads.",
      "I also built LayoutAnnotator, a backend-free annotation tool with COCO and YOLO export, to produce the training data.",
    ],
    numbers: [["99%", "JSON validity"], ["0.67", "layout mAP@0.5"], ["409", "invoices benchmarked"]],
    stack: ["Python", "FastAPI", "Docling", "PaddleOCR", "llama.cpp", "React 19", "TypeScript"],
  },
  {
    slug: "table-structure-model",
    title: "Table-Structure Model",
    year: "2026",
    field: "Research",
    metric: "5.5× smaller",
    figure: "table",
    summary: "9.71M-parameter image → OTSL → HTML model, within 0.016 S-TEDS of a 53M SOTA.",
    body: [
      "Designed and trained from scratch to replace the heavy table engine inside DocStruct.",
      "The decision that mattered: selecting checkpoints on an out-of-distribution set of real scanned and photographed tables instead of the in-domain benchmark. It turned a brittle specialist (0.671 OOD, 27% catastrophic failures) into a robust model.",
      "Grammar-constrained decoding makes illegal table structures impossible by construction; beam search and a KV-cached greedy decoder handle speed. Training ran on a memory-mapped loader over about 1.2M rows from PubTabNet, SynthTabNet and FinTabNet.",
    ],
    numbers: [["0.872", "S-TEDS, real tables"], ["9.71M", "parameters"], ["120k", "training steps"]],
    stack: ["PyTorch", "PP-LCNet", "Transformers", "Beam search", "NVIDIA L4"],
  },
  {
    slug: "mastercv",
    title: "MasterCV",
    year: "2026",
    field: "Product",
    metric: "On Google Play",
    figure: "phone",
    summary: "AI job-application app: company research, tailored CV and letter, ATS-safe PDF.",
    body: [
      "A solo-built Expo / React Native app, in closed testing on Google Play. It researches the target company, tailors the CV and cover letter with an LLM, and exports PDFs that applicant-tracking systems can parse.",
      "The backend is 14 Supabase Edge Functions with row-level security per user. LLM keys never touch the client. Subscriptions run through RevenueCat.",
    ],
    numbers: [["14", "edge functions"], ["RLS", "per-user security"], ["Solo", "design to store"]],
    stack: ["Expo", "React Native", "TypeScript", "Supabase", "RevenueCat"],
  },
  {
    slug: "voxmea",
    title: "VoxMea",
    year: "2025",
    field: "Vision",
    metric: "49.5 FPS",
    figure: "hand",
    summary: "Real-time French Sign Language to text and voice, on a phone.",
    body: [
      "A team of six; we built the dataset ourselves: 4,594 samples across 26 LSF letters, captured with MediaPipe Holistic and reduced from 1,662 landmark features to 128.",
      "The classifier is an 88K-parameter MicroTransformer: four attention heads, small enough to run at 20 ms per prediction on mobile, with text-to-speech on the output.",
    ],
    numbers: [["96.23%", "accuracy"], ["88K", "parameters"], ["4,594", "samples, built from scratch"]],
    stack: ["MediaPipe", "TensorFlow", "Transformers", "Mobile"],
  },
  {
    slug: "motionsync",
    title: "MotionSync",
    year: "2025",
    field: "Vision · Startup",
    metric: "Boeing Prize",
    figure: "pose",
    summary: "AI fitness coach: pose tracking, form correction and rep counting on mobile.",
    award: "Boeing Innovation Prize · Pitch Deck Prize · 3rd Grand Prize, SporTech Hackathon",
    body: [
      "I founded and ran MotionSync as a junior enterprise through Injaz Al-Maghrib, leading product, team and pitch.",
      "MediaPipe Pose tracks the body at 24–28 FPS on a phone; joint angles drive form correction and a state machine counts reps. React Native app, FastAPI backend.",
    ],
    numbers: [["24–28", "FPS on mobile"], ["3", "awards"], ["Mar–Oct", "2025, as CEO"]],
    stack: ["React Native", "FastAPI", "MediaPipe", "TensorFlow"],
  },
  {
    slug: "langdetect",
    title: "LangDetect",
    year: "",
    field: "NLP",
    metric: "98.29%",
    figure: "bars",
    summary: "Language identification across 28 languages and five writing systems.",
    body: [
      "Trained on a balanced slice of WiLI-2018 (500 samples per language). Character n-grams with TF-IDF capture morphology across Latin, Arabic, Cyrillic, Chinese and Japanese scripts.",
      "I compared Naive Bayes, logistic regression and LinearSVC; the SVM won. Served through a Flask API with a React front end.",
    ],
    numbers: [["98.29%", "accuracy"], ["28", "languages"], ["3", "models compared"]],
    stack: ["Scikit-learn", "TF-IDF", "LinearSVC", "Flask", "React"],
    links: { code: "https://github.com/HoussamJardini/language-detector" },
  },
  {
    slug: "rag-document-assistant",
    title: "RAG Document Assistant",
    year: "",
    field: "LLM",
    metric: "Cited answers",
    figure: "chat",
    summary: "Ask questions about your own documents and get answers with their sources.",
    body: [
      "Upload PDFs, Word files or text; LlamaIndex chunks and embeds them into Qdrant, and a local model served by Ollama answers with citations back to the passages it used.",
    ],
    numbers: [["Local", "LLM via Ollama"], ["Qdrant", "vector store"], ["Cited", "every answer"]],
    stack: ["LlamaIndex", "Qdrant", "Ollama", "Streamlit"],
    links: { code: "https://github.com/HoussamJardini/rag" },
  },
  {
    slug: "robotic-arm",
    title: "Robotic Arm RL",
    year: "",
    field: "Reinforcement learning",
    metric: "70% success",
    figure: "arm",
    summary: "A 4-DOF arm that learned to reach 3D targets without an IK solver.",
    body: [
      "Trained with PPO across 36 parallel agents in Unity ML-Agents. Nobody gave it inverse kinematics; it worked them out. Exported to ONNX.",
    ],
    numbers: [["70%", "reach success"], ["36", "parallel agents"], ["0", "IK solvers"]],
    stack: ["Unity", "ML-Agents", "PPO", "ONNX", "C#"],
  },
  {
    slug: "ai-resume-screening",
    title: "AI Resume Screener",
    year: "",
    field: "Automation",
    metric: "−95% time",
    figure: "flow",
    summary: "Gmail in, scored and routed candidates out, with no one reading PDFs.",
    body: [
      "An n8n workflow watches an inbox, extracts the CV text, has Gemini score each candidate from 0 to 100, and routes them into three tiers with the right follow-up. Results land in Google Sheets.",
    ],
    numbers: [["−95%", "screening time"], ["0–100", "candidate score"], ["3", "routing tiers"]],
    stack: ["n8n", "Gemini", "Gmail API", "Google Sheets"],
  },
  {
    slug: "schemaforge",
    title: "SchemaForge",
    year: "",
    field: "Agents",
    metric: "Text → ER",
    figure: "graph",
    summary: "Describe your data in plain words; get an editable ER diagram.",
    body: [
      "A conversational agent built on Gemini designs the schema; the React canvas lets you drag, zoom and edit entities, then export to HTML or JSON. FastAPI orchestrates the agent.",
    ],
    numbers: [["Gemini", "schema agent"], ["Live", "editable diagram"], ["2", "export formats"]],
    stack: ["React", "FastAPI", "Gemini"],
  },
  {
    slug: "qlearning-platform",
    title: "Q-Learning Platform",
    year: "",
    field: "Reinforcement learning",
    metric: "Teach RL",
    figure: "maze",
    summary: "Draw a maze, tune the hyperparameters, watch an agent learn it.",
    body: [
      "An educational tool: users design 2D mazes in Unity, then train a Q-learning agent through a FastAPI backend with full control over learning rate, discount and exploration, and watch the policy improve in real time.",
    ],
    numbers: [["Unity", "maze editor"], ["Live", "training view"], ["Full", "hyperparameter control"]],
    stack: ["Unity", "FastAPI", "Python"],
  },
  {
    slug: "teleoperation-system",
    title: "Gesture-Controlled Gripper",
    year: "2023",
    field: "Robotics",
    metric: "30 FPS",
    figure: "hand",
    summary: "A robotic gripper driven by your hand, through a webcam.",
    body: [
      "Built during my internship at Code212. MediaPipe tracks hand landmarks, OpenCV handles the video at 30 FPS, and an Arduino moves the gripper. It was teleoperated live by hand gestures in the university robotics lab.",
    ],
    numbers: [["30", "FPS"], ["21", "landmarks"], ["Arduino", "actuation"]],
    stack: ["MediaPipe", "OpenCV", "Arduino", "Python"],
  },
  {
    slug: "darija-chatbot",
    title: "Darija Chatbot",
    year: "",
    field: "NLP",
    metric: "183K params",
    figure: "chat",
    summary: "Question answering in Moroccan Darija, a language with almost no data.",
    body: [
      "There was no usable dataset, so I built one from scratch. The model is a custom LSTM with 183K parameters, trained in TensorFlow.",
    ],
    numbers: [["183K", "parameters"], ["Own", "dataset"], ["LSTM", "architecture"]],
    stack: ["TensorFlow", "LSTM", "Python"],
  },
  {
    slug: "vslide",
    title: "vSlide",
    year: "2023",
    field: "Game",
    metric: "9+ months live",
    figure: "phone",
    summary: "A hyper-casual mobile game I designed, built and published alone.",
    body: [
      "Unity and C#, ad monetization, store listing and compliance, all solo. It stayed live on Google Play for more than nine months.",
    ],
    numbers: [["9+", "months live"], ["Solo", "developer"], ["Ads", "monetized"]],
    stack: ["Unity", "C#", "AdMob"],
  },
];

// ------------------------------------------
// PATH (experience + education, newest first)
// ------------------------------------------
export const path = [
  {
    when: "Apr 2026 — now",
    what: "Programming & IT Instructor",
    where: "Group Academy · freelance, part-time",
    detail: "Teaching programming, algorithms and IT fundamentals to students, professionals and engineers.",
  },
  {
    when: "Feb — Aug 2026",
    what: "AI / ML Engineer, end-of-studies internship",
    where: "Harmony Technology · Data & AI Unit",
    detail: "DocStruct and the table-structure model. See above.",
  },
  {
    when: "2024 — 2026",
    what: "Master of Excellence, AI & Connected Objects",
    where: "Ibn Tofail University · Kénitra",
    detail: "Bac+5.",
    edu: true,
  },
  {
    when: "Mar — Oct 2025",
    what: "Founder & CEO, MotionSync",
    where: "Junior enterprise via Injaz Al-Maghrib",
    detail: "Boeing Innovation Prize, Pitch Deck Prize, 3rd Grand Prize at the SporTech Hackathon in Marrakech.",
  },
  {
    when: "Jul — Oct 2024",
    what: "Data Analyst & AI Engineer intern",
    where: "Arteka · Amiens, France (remote)",
    detail: "Unity 3D synthetic annotation pipeline: 10,000+ labelled images, 98% less manual labelling, YOLO segmentation over 28 pitch classes.",
  },
  {
    when: "2023 — 2024",
    what: "Bachelor of Excellence, AI & Data Engineering",
    where: "Ibn Tofail University · mention Bien",
    detail: "",
    edu: true,
  },
  {
    when: "Aug 2023",
    what: "AI & Robotics intern",
    where: "Code212 · Kénitra",
    detail: "Vision-controlled robotic gripper from real-time hand landmarks.",
  },
];

// ------------------------------------------
// TOOLKIT
// ------------------------------------------
export const toolkit = [
  {
    area: "Models",
    items: ["PyTorch", "TensorFlow", "Transformers", "Hugging Face", "Scikit-learn", "ONNX", "YOLO", "RT-DETR", "PP-LCNet", "U-Net", "ResNet", "ViT"],
  },
  {
    area: "Vision",
    items: ["MediaPipe", "OpenCV", "Segmentation", "Pose estimation", "Synthetic data (Unity)"],
  },
  {
    area: "LLM & documents",
    items: ["RAG", "LlamaIndex", "LangChain", "llama.cpp", "Ollama", "Qdrant", "Constrained decoding", "Docling", "PaddleOCR", "Tesseract", "n8n"],
  },
  {
    area: "Engineering",
    items: ["Python", "TypeScript", "C#", "SQL", "C++", "FastAPI", "Flask", "React", "React Native", "Supabase", "PostgreSQL", "Docker", "Linux", "Unity ML-Agents"],
  },
];

export const site = {
  title: "Houssam Jardini · AI / ML Engineer",
  description:
    "AI engineer in Morocco. Offline document AI, a table-structure model trained from scratch, computer vision and NLP, built end to end.",
};
