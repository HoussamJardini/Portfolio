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
  eyebrow: "AI engineer · Kénitra, Morocco",
  title: ["I build AI that runs", "where the cloud can't."],
  highlight: "the cloud can't.",
  intro:
    "Small, fast models trained from scratch and shipped inside real apps: on a phone, on an 8 GB laptop, fully offline. I just finished my Master's in AI and I'm available now.",
  trust: ["Boeing Innovation Prize", "Research paper for Springer LNCS", "4 AI roles before graduating"],
};

// The 3D shapes in the hero. Each one comes from a real project.
export const specimens = [
  { id: "hand", label: "Hand tracking", source: "VoxMea, Code212 gripper" },
  { id: "table", label: "Table structure", source: "my table-reading model" },
  { id: "pose", label: "Body pose", source: "MotionSync" },
  { id: "pitch", label: "Football pitch lines", source: "Arteka" },
  { id: "arm", label: "Robot arm", source: "Robotic Arm RL" },
];

export const about = {
  paragraphs: [
    "I like problems with a hard limit. No internet, no GPU, a phone instead of a server. That's where you can't just call a bigger model, so you have to understand the problem and build something that fits.",
    "Before my end-of-studies project I generated 10,000 labelled training images in Unity instead of drawing them by hand, led a student team to the Boeing Innovation Prize, and published a mobile game on Google Play on my own.",
  ],
  facts: [
    ["Based in", "Kénitra, can work in Rabat"],
    ["Degree", "Master of Excellence in AI (Bac+5)"],
    ["Languages", "Arabic, English (C1), French (B2)"],
    ["Also", "Part-time programming teacher"],
  ],
};

// ------------------------------------------
// HIGHLIGHT: the end-of-studies project, told as a story
// ------------------------------------------
export const highlight = {
  where: "Harmony Technology · Feb – Aug 2026",
  title: "Reading documents without the cloud",
  steps: [
    {
      label: "The problem",
      text: "A company needed to pull data out of confidential documents. Nothing could leave the building, and the laptops had no GPU.",
      big: "0",
      unit: "cloud calls allowed",
    },
    {
      label: "What I built",
      text: "DocStruct: an offline app that reads PDFs, scans and Office files and turns them into clean, structured data.",
      big: "99%",
      unit: "valid output",
    },
    {
      label: "The twist",
      text: "The best table-reading model was too heavy for those laptops. So I designed and trained my own, much smaller one.",
      big: "5.5×",
      unit: "smaller, nearly as accurate",
    },
  ],
  compare: {
    title: "My model vs. the state of the art",
    rows: [
      { name: "Mine", size: 9.7, score: 87.2 },
      { name: "TableFormer", size: 53, score: 88.8 },
    ],
    sizeLabel: "Size (million parameters)",
    scoreLabel: "Accuracy on real scanned tables (%)",
  },
  outcome: "Every goal in the spec was met, and the model was written up as a research paper.",
};

// ------------------------------------------
// PROJECTS (featured ones show as cards, the rest under "More")
// slug = folder name under src/assets/projects/
// figure = which drawing to use when no screenshot exists
// ------------------------------------------
export const projects = [
  {
    slug: "docstruct",
    featured: true,
    title: "DocStruct",
    year: "2026",
    field: "Document AI",
    metric: "Runs offline",
    figure: "document",
    summary: "An offline app that turns PDFs, scans and Office files into clean, structured data.",
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
    summary: "A small model I trained to read tables in scanned documents. 5.5× lighter than the best one.",
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
    featured: true,
    title: "MasterCV",
    year: "2026",
    field: "Product",
    metric: "Google Play beta",
    figure: "phone",
    summary: "A mobile app that tailors your CV and cover letter to each job.",
    body: [
      "A solo-built Expo / React Native app, in closed testing on Google Play. It researches the target company, tailors the CV and cover letter with an LLM, and exports PDFs that applicant-tracking systems can parse.",
      "The backend is 14 Supabase Edge Functions with row-level security per user. LLM keys never touch the client. Subscriptions run through RevenueCat.",
    ],
    numbers: [["14", "edge functions"], ["RLS", "per-user security"], ["Solo", "design to store"]],
    stack: ["Expo", "React Native", "TypeScript", "Supabase", "RevenueCat"],
  },
  {
    slug: "voxmea",
    featured: true,
    title: "VoxMea",
    year: "2025",
    field: "Vision",
    metric: "96% accurate",
    figure: "hand",
    summary: "Translates French Sign Language into text and voice, live on a phone.",
    body: [
      "A team of six; we built the dataset ourselves: 4,594 samples across 26 LSF letters, captured with MediaPipe Holistic and reduced from 1,662 landmark features to 128.",
      "The classifier is an 88K-parameter MicroTransformer: four attention heads, small enough to run at 20 ms per prediction on mobile, with text-to-speech on the output.",
    ],
    numbers: [["96.23%", "accuracy"], ["88K", "parameters"], ["4,594", "samples, built from scratch"]],
    stack: ["MediaPipe", "TensorFlow", "Transformers", "Mobile"],
  },
  {
    slug: "motionsync",
    featured: true,
    title: "MotionSync",
    year: "2025",
    field: "Vision · Startup",
    metric: "Boeing Prize",
    figure: "pose",
    summary: "A fitness app that watches your form and counts your reps.",
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
    featured: true,
    title: "LangDetect",
    year: "",
    field: "NLP",
    metric: "98% accurate",
    figure: "bars",
    summary: "Tells you which of 28 languages a text is written in.",
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
    summary: "Ask questions about your own documents and get answers with sources.",
    body: [
      "Upload PDFs, Word files or text; LlamaIndex chunks and embeds them into Qdrant, and a local model served by Ollama answers with citations back to the passages it used.",
    ],
    numbers: [["Local", "LLM via Ollama"], ["Qdrant", "vector store"], ["Cited", "every answer"]],
    stack: ["LlamaIndex", "Qdrant", "Ollama", "Streamlit"],
    links: { code: "https://github.com/HoussamJardini/rag" },
  },
  {
    slug: "robotic-arm",
    featured: true,
    title: "Robotic Arm RL",
    year: "",
    field: "Reinforcement learning",
    metric: "70% success",
    figure: "arm",
    summary: "A robot arm that taught itself to reach targets in 3D.",
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
    metric: "95% faster",
    figure: "flow",
    summary: "Reads incoming CVs, scores them and sorts the candidates automatically.",
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
    metric: "Text to diagram",
    figure: "graph",
    summary: "Describe your data in plain words and get a database diagram.",
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
    metric: "Interactive",
    figure: "maze",
    summary: "Draw a maze and watch an AI agent learn to solve it.",
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
    metric: "Real time",
    figure: "hand",
    summary: "A robotic gripper you control with hand gestures through a webcam.",
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
    metric: "Low-resource NLP",
    figure: "chat",
    summary: "A chatbot that answers questions in Moroccan Darija.",
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
    summary: "A mobile game I designed, built and published on my own.",
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
  { area: "AI & models", items: ["PyTorch", "TensorFlow", "Hugging Face", "Scikit-learn", "ONNX"] },
  { area: "Vision", items: ["YOLO", "MediaPipe", "OpenCV", "PaddleOCR"] },
  { area: "LLMs & documents", items: ["RAG", "LlamaIndex", "llama.cpp", "Ollama", "Docling", "n8n"] },
  { area: "Building apps", items: ["Python", "TypeScript", "FastAPI", "React", "React Native", "Supabase", "Docker"] },
];

export const site = {
  title: "Houssam Jardini · AI / ML Engineer",
  description:
    "AI engineer in Morocco. Offline document AI, a table-structure model trained from scratch, computer vision and NLP, built end to end.",
};
