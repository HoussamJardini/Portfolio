// ==========================================
// 📝 PORTFOLIO CONFIGURATION FILE
// ==========================================
// Just edit this file to update your portfolio!
// No need to touch any other code.
// ==========================================

// ------------------------------------------
// 👤 PERSONAL INFO
// ------------------------------------------
export const personalInfo = {
  name: "Houssam Jardini",
  title: "AI Engineer",
  subtitle: "Deep Learning • NLP • Computer Vision • AI Automation",
  email: "jardini.houssam@uit.ac.ma",
  phone: "+212 689 631 536",
  location: "Kénitra, Morocco",
  
  // Social Links
  github: "https://github.com/HoussamJardini",
  linkedin: "https://linkedin.com/in/houssam-jardini",
  
  // CV Download (put your CV in the /public folder)
  cvFile: "/Houssam_Jardini_CV.pdf",
  
  // Profile Image (put your photo in /public folder as profile.jpg)
  profileImage: "/profile.jpg",
  
  // Hero Section
  heroTagline: "Building Intelligent Systems",
  heroDescription: "Boeing Innovation Prize winner specializing in end-to-end AI solutions — from computer vision and NLP to intelligent automation agents. Building systems that think, learn, and automate.",
  
  // About Section - UPDATED with latest projects
  aboutTitle: "About Me",
  aboutDescription: `AI Engineer passionate about building intelligent systems that solve real-world problems. I specialize in computer vision, reinforcement learning, natural language processing, and AI-powered automation.

My journey includes winning the Boeing Innovation Prize at the Injaz Al Maghrib National Competition, achieving 98% cost reduction in annotation at Arteka through innovative AI solutions, and developing production-ready RAG systems and intelligent automation workflows.

I build across the AI spectrum — from training robotic arms with reinforcement learning, to creating conversational AI for underrepresented languages, to designing multi-agent systems that automate complex business processes. Currently exploring the intersection of LLMs, automation platforms, and intelligent agents.`,
};

// ------------------------------------------
// 📊 STATS (shown in About section)
// ------------------------------------------
export const stats = [
  { value: "10+", label: "AI Projects" },
  { value: "🏆", label: "Boeing Prize" },
  { value: "98%", label: "Cost Reduction" },
];

// ------------------------------------------
// 🛠️ SKILLS
// ------------------------------------------
export const skills = {
  categories: [
    {
      name: "Languages & Frameworks",
      skills: ["Python", "C#", "JavaScript", "React", "React Native", "FastAPI", "Unity"]
    },
    {
      name: "Machine Learning & AI",
      skills: ["TensorFlow", "PyTorch", "LlamaIndex", "LangChain", "LSTM", "Transformers", "ONNX"]
    },
    {
      name: "LLMs & RAG",
      skills: ["OpenAI API", "Google Gemini", "Ollama", "Qdrant", "Vector Databases", "Prompt Engineering"]
    },
    {
      name: "Computer Vision",
      skills: ["YOLOv8", "MediaPipe", "OpenCV", "Pose Estimation", "Object Detection", "Segmentation"]
    },
    {
      name: "Automation & Agents",
      skills: ["n8n", "Multi-Agent Systems", "Workflow Automation", "API Integration"]
    },
    {
      name: "Tools & Platforms",
      skills: ["Git", "Docker", "Arduino", "Google Cloud", "Streamlit", "NumPy"]
    }
  ]
};

// ------------------------------------------
// 💼 PROJECTS
// ------------------------------------------
// To add a new project:
// 1. Add project image to /public/projects/ folder
// 2. Add a new object below with your project details
// 3. Set the image path like: "/projects/your-image.png"
// ------------------------------------------

export const projects = [
  // ===== FEATURED PROJECTS (show first) =====
  {
    id: 1,
    title: "MotionSync",
    subtitle: "AI-Powered Movement Analysis Platform",
    description: "Cross-platform fitness app with real-time AI coaching — automated form correction, rep counting, and performance metrics. Delivers 24-28 FPS pose estimation on mobile.",
    longDescription: "Won Innovation Category (top 21 of 234 teams nationally) at Injaz Al Maghrib National Competition. The app uses MediaPipe Pose for real-time body tracking, achieving 24-28 FPS on mobile devices. Features include automated form correction that analyzes joint angles, rep counting with state machine logic, and detailed performance metrics. Built with React Native for cross-platform deployment and FastAPI backend for data processing.",
    technologies: ["React Native", "FastAPI", "MediaPipe", "TensorFlow"],
    category: "AI/ML",
    featured: true,
    award: "🏆 Boeing Innovation Prize Winner",
    github: "https://github.com/HoussamJardini/motionsync",
    live: null,
    image: "/projects/motionsync.png", // Add your image to /public/projects/
  },
  {
    id: 2,
    title: "SchemaForge",
    subtitle: "AI Database Schema Designer",
    description: "Conversational AI agent that designs database schemas from natural language. Features interactive ER diagrams with drag-and-drop, zoom/pan, and export to HTML/JSON.",
    technologies: ["React", "FastAPI", "Google Gemini", "AI Agents"],
    category: "AI Agents",
    featured: true,
    github: "https://github.com/HoussamJardini/schemaforge",
    live: null,
    image: "/projects/schemaforge.png",
  },
  {
    id: 3,
    title: "AI Resume Screening System",
    subtitle: "Automated Recruitment with n8n & Gemini",
    description: "End-to-end recruitment automation: monitors Gmail, extracts PDF content, scores candidates 0-100 with AI, and routes through 3-tier engagement system. 95% reduction in screening time.",
    technologies: ["n8n", "Google Gemini", "Gmail API", "Google Sheets"],
    category: "Automation",
    featured: true,
    github: "https://github.com/HoussamJardini/ai-resume-screener",
    live: null,
    image: "/projects/AI Resume Screening System.png",
  },
  {
    id: 4,
    title: "RAG Document Assistant",
    subtitle: "Chat with Your Documents",
    description: "Production-ready RAG system for document Q&A. Upload PDFs, Word docs, or text files and get intelligent answers with source citations. Semantic search with Qdrant vector DB.",
    technologies: ["LlamaIndex", "Qdrant", "Ollama", "Streamlit", "Python"],
    category: "AI/ML",
    featured: true,
    github: "https://github.com/HoussamJardini/rag-document-assistant",
    live: null,
    image: "/projects/rag.png",
  },

  // ===== OTHER PROJECTS =====
  {
    id: 5,
    title: "Robotic Arm RL",
    subtitle: "Reinforcement Learning Control",
    description: "4-DOF robotic arm trained with PPO (36 parallel agents) to reach 3D targets. 70% success rate with emergent inverse kinematics — no explicit solvers needed.",
    technologies: ["Unity", "ML-Agents", "PPO", "ONNX", "C#"],
    category: "Robotics",
    featured: false,
    github: "https://github.com/HoussamJardini/robotic-arm-rl",
    live: null,
    image: "/projects/robotic-arm.png",
  },
  {
    id: 6,
    title: "Q-Learning Platform",
    subtitle: "Interactive RL Training Environment",
    description: "Educational platform where users design 2D mazes and train Q-learning agents with full hyperparameter control. Real-time visualization and performance tracking.",
    technologies: ["Unity", "FastAPI", "Q-Learning", "Python"],
    category: "AI/ML",
    featured: false,
    github: "https://github.com/HoussamJardini/qlearning-platform",
    live: null,
    image: "/projects/qlearning.png",
  },
  {
    id: 7,
    title: "Teleoperation System",
    subtitle: "Gesture-Controlled Robotics",
    description: "Real-time gesture-controlled robotic gripper using MediaPipe + OpenCV at 30 FPS. Deployed in factory environment for industrial teleoperation.",
    technologies: ["MediaPipe", "OpenCV", "Arduino", "Python"],
    category: "Robotics",
    featured: false,
    github: "https://github.com/HoussamJardini/teleoperation",
    live: null,
    image: "/projects/teleoperation.png",
  },
  {
    id: 8,
    title: "Darija Chatbot",
    subtitle: "Moroccan Dialect NLP",
    description: "Q&A chatbot for Moroccan Darija with custom LSTM architecture (183K params). Built proprietary dataset from scratch for this low-resource language.",
    technologies: ["TensorFlow", "LSTM", "NLP", "Python"],
    category: "AI/ML",
    featured: false,
    github: "https://github.com/HoussamJardini/darija-chatbot",
    live: null,
    image: "/projects/darija.png",
  },
  {
    id: 9,
    title: "vSlide",
    subtitle: "Hyper Casual Mobile Game",
    description: "Solo-developed mobile game with ad monetization. Live 9+ months on Google Play Store, full product lifecycle from design to deployment.",
    technologies: ["Unity", "C#", "AdMob", "Mobile"],
    category: "Game Dev",
    featured: false,
    live: "https://play.google.com/store/apps/details?id=com.yourcompany.vslide",
    github: null,
    image: "/projects/vslide.png",
  },
];

// ------------------------------------------
// 🏷️ PROJECT CATEGORIES (for filtering)
// ------------------------------------------
export const projectCategories = [
  "All",
  "AI/ML",
  "AI Agents",
  "Automation",
  "Robotics",
  "Game Dev"
];

// ------------------------------------------
// 💼 WORK EXPERIENCE
// ------------------------------------------
export const experience = [
  {
    id: 1,
    role: "Data Analyst & AI Engineer",
    company: "Arteka",
    location: "Amiens, France (Remote)",
    duration: "July - October 2024",
    type: "Internship",
    current: false,
    description: "Sports Analytics Startup",
    achievements: [
      "Built AI football pitch analysis system with automated annotation pipeline using Unity 3D",
      "Reduced labeling time by 98% through innovative auto-annotation approach",
      "Trained YOLOv8 segmentation models on 10K auto-generated images",
      "Developed 28 field intersection class detection system"
    ],
    technologies: ["Unity 3D", "YOLOv8", "Python", "Computer Vision"]
  },
  // Add more experiences here...
];

// ------------------------------------------
// 🎓 EDUCATION
// ------------------------------------------
export const education = [
  {
    id: 1,
    degree: "Master of Excellence",
    field: "Artificial Intelligence and Connected Objects",
    school: "Ibn Tofail University",
    location: "Kénitra, Morocco",
    duration: "2024 - Present",
    description: "Advanced studies in AI systems, IoT integration, and intelligent connected devices."
  },
  {
    id: 2,
    degree: "Bachelor of Excellence",
    field: "AI and Data Engineering",
    school: "Ibn Tofail University",
    location: "Kénitra, Morocco",
    duration: "2023 - 2024",
    grade: "Good",
    description: "Foundation in machine learning, data science, and software engineering."
  },
];

// ------------------------------------------
// 📬 CONTACT SECTION
// ------------------------------------------
export const contactInfo = {
  title: "Let's Work Together",
  description: "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Feel free to reach out!",
  // Optional: Add Formspree ID for working contact form
  // Sign up at formspree.io and get your form ID
  formspreeId: null, // Example: "xyzabc123"
};

// ------------------------------------------
// 🌐 SEO CONFIG
// ------------------------------------------
export const siteConfig = {
  title: "Houssam Jardini | AI Engineer",
  description: "AI Engineer specializing in Deep Learning, NLP, Computer Vision, and AI Automation. Boeing Innovation Prize winner.",
  keywords: "AI Engineer, Deep Learning, Machine Learning, Computer Vision, NLP, RAG, LLM, Python, TensorFlow, n8n, Automation",
};
