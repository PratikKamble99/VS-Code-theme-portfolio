import { PortfolioData } from '@/types';

// Portfolio data for Pratik Kamble
export const portfolioData: PortfolioData = {
  about: {
    name: "Pratik Kamble",
    title: "Software Developer",
    summary: "Software Developer with 2+ years of experience building scalable web applications and secure backend systems. Specialized in React.js, TypeScript, Node.js, and modern web technologies with a focus on user experience and security. Experienced in building RESTful APIs, implementing authentication systems, and working with various databases. Passionate about creating efficient, maintainable code and exploring new technologies like AI/ML integration."

  },
  skills: [
    {
      category: "Frontend",
      items: ["React.js", "Next.js", "TypeScript", "JavaScript", "Material UI", "Tailwind CSS", "HTML5", "CSS3", "Redux", "Zustand"]
    },
    {
      category: "Backend",
      items: ["Node.js", "Express.js", "RESTful APIs", "GraphQL", "JWT Authentication", "bcrypt", "Session Management"]
    },
    {
      category: "Databases",
      items: ["MongoDB", "MySQL", "PostgreSQL", "Vector Databases"]
    },
    {
      category: "Tools & DevOps",
      items: ["Git", "Docker", "VS Code", "Webpack", "Vite", "Agile/Scrum", "CI/CD"]
    },
    {
      category: "Other Technologies",
      items: ["WebRTC", "Stripe.js", "Generative AI", "RAG", "Chart.js", "Encryption (AES, RSA, SHA-1)"]
    }
  ],
  projects: [
    {
      id: "2fa-auth",
      name: "2 Factor Authentication: MERN Stack",
      description: "Developed a secure MERN-based Multi-Factor Authentication (MFA) system with session management features, including login with 1FA/2FA, session revocation, and the ability to enable/disable 2FA. Implemented JWT-based authentication, bcrypt for password hashing, and secure token handling to enhance application security.",
      technologies: ["React", "Node.js", "MongoDB", "Tailwind CSS", "bcrypt", "speakeasy", "JWT"],
      links: {
        github: "https://github.com/PratikKamble99/2-factor-auth-MERN",
        demo: ""
      },
      status: "completed",
      image: "./2fa-auth.png"
    },
    {
      id: "cadis-eziexpert",
      name: "Cadis EziExpert: Real-time Video Calling",
      description: "Real-time video calling application with WebRTC. Implemented features like authentication, authorization, session management, state management, real-time video calling between Rockid Glass and web app.",
      technologies: ["React", "MySQL", "Material UI", "WebRTC"],
      links: {},
      status: "completed"
    },
    {
      id: "expense-tracker",
      name: "Expense Tracker: Personal Finance Management",
      description: "Developed an application to record and manage personal transactions. Features include authentication, adding transactions, uploading images, and data visualization with charts.",
      technologies: ["React", "express-graphql", "MongoDB", "Tailwind CSS", "Chart.js"],
      links: {
        github: "https://github.com/PratikKamble99/expense-tracker-graphql-react",
        demo: "https://expense-tracker-graphql-react.onrender.com"
      },
      status: "completed",
      image: "./expenseTracker-2.png"
    },
    {
      id: "image-ai",
      name: "Image-AI: Advanced Image Processing SaaS",
      description: "Developed a full-fledged Next.js SaaS application from scratch. Implemented authentication, authorization, session/state management, and payment gateway integration. Added object detection and removal, image quality enhancement, and noise reduction features.",
      technologies: ["Next.js", "MySQL", "Tailwind CSS", "Stripe", "AI/ML"],
      links: {
        github: "https://github.com/PratikKamble99/image-ai"
      },
      status: "completed",
      image: "./imageAi.png"
    },
    {
      id: "onco-healthcare",
      name: "ONCO Healthcare",
      description: "Built an appointment booking platform for oncology treatment, allowing patients to schedule consultations with doctors via a user-friendly interface. Integrated Stripe.js for secure, seamless payments and implemented real-time updates for availability and bookings.",
      technologies: ["React", "PostgreSQL", "Material UI", "Stripe", "Redux", "JWT"],
      links: {},
      status: "completed",
      image: "./oncoHealthcare.png"
    },
    {
      id: "pontis",
      name: "Pontis: System Health Monitoring",
      description: "Developed a System Health Monitoring and Log Management application to track real-time performance metrics and user activities. Designed a dynamic UI with React.js and Redux that updates based on backend data. Integrated APIs for live system health tracking, log retrieval, and alert notifications.",
      technologies: ["React", "Material UI", "Redux", "Chart.js"],
      links: {},
      status: "completed",
      image: "./pontis.png"
    },
    {
      id: "munitrix",
      name: "Munitrix: Secure Database Management",
      description: "Built a secure database management frontend using React.js, MUI, and Redux, enabling users to dynamically create, update, and delete tables and columns. Implemented AES, RSA, and SHA-1 encryption protocols to ensure secure API communication and protect sensitive data.",
      technologies: ["React", "Material UI", "Redux", "Encryption (AES, RSA, SHA-1)"],
      links: {},
      status: "completed",
      image: "./munitrix.png"
    },
    {
      id: "chatbot-ai",
      name: "Chatbot Application with Generative AI",
      description: "Developed a chatbot application leveraging Generative AI for natural language understanding and response generation. Integrated with a React frontend and a Node.js backend, utilizing MongoDB for data storage and GenAI concepts like tool calling, vector databases, and prompt engineering.",
      technologies: ["React", "Express", "RAG.js", "Vector Embeddings", "Tailwind CSS", "MongoDB"],
      links: {
        github: "https://github.com/PratikKamble99/RAG-pdf-analyzer-chat-bot"
      },
      status: "completed",
      image: "./chatbot.png"
    },
    {
      id: "3d-portfolio",
      name: "3D Portfolio: Interactive Portfolio",
      description: "Developed an interactive portfolio showcasing 3D design and animation. Implemented dynamic UI with smooth transitions, project highlights, and responsive layout using React, Tailwind, and 3D rendering libraries.",
      technologies: ["React", "Three.js", "Tailwind CSS", "3D Animation"],
      links: {
        github: "https://github.com/PratikKamble99/3d-portfolio",
        demo: "https://3d-portfolio-tawny-xi.vercel.app/"
      },
      status: "completed",
      image: "./3dportfolio.png"
    }
  ],
  experience: [
    {
      id: "ciklum-2022",
      company: "Ciklum",
      position: "Software Developer",
      duration: "Dec 2022 - Present",
      startDate: "2022-12-01",
      description: [
        "Built scalable web interfaces using React.js, TypeScript, and Material UI for enterprise applications",
        "Designed and developed secure RESTful APIs for authentication, authorization, session management, and core feature development",
        "Used Docker for containerization to ensure consistent development and deployment environments",
        "Created reusable UI components with efficient state management using Redux and Zustand",
        "Collaborated with designers, product owners, and backend engineers in Agile sprints to deliver user-centric features through rapid iteration and code reviews"
      ],
      technologies: ["React.js", "TypeScript", "Material UI", "Node.js", "Docker", "Redux", "Zustand", "RESTful APIs"]
    },
    {
      id: "infogen-2022",
      company: "Infogen Labs",
      position: "Junior Software Developer",
      duration: "June 2022 - Dec 2022",
      startDate: "2022-06-01",
      endDate: "2022-12-01",
      description: [
        "Built reusable UI components in ReactJS, ensuring consistency with design guidelines and enhancing user experience",
        "Gained hands-on experience with ReactJS and Material UI for building modern web applications",
        "Proactively fixed bugs in legacy code and improved code quality",
        "Collaborated with cross-functional teams to understand best practices and project objectives",
        "Participated in code reviews and contributed to team knowledge sharing"
      ],
      technologies: ["React.js", "Material UI", "JavaScript", "HTML5", "CSS3"]
    }
  ],
  contact: {
    email: "kamblepratik1137@gmail.com",
    github: "https://github.com/PratikKamble99",
    linkedin: "https://www.linkedin.com/in/pratikpkamble/",
    location: "India"
  }
};