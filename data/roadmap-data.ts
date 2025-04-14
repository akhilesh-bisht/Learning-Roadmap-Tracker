export interface RoadmapItem {
  title: string
  difficulty?: string
  timeEstimate: string
  completed?: boolean
}

export interface RoadmapSection {
  title: string
  items: RoadmapItem[]
}

export const staticRoadmapData: RoadmapSection[] = [
  {
    title: "Full Stack dev",
    items: [],
  },
  {
    title: "Foundations",
    items: [
      { title: "HTML", difficulty: "Easy", timeEstimate: "2 hours" },
      { title: "CSS", difficulty: "Easy", timeEstimate: "4 hours" },
      {
        title: "Bash basics (cd, ls, pwd, mkdir, touch, vi)",
        difficulty: "Easy",
        timeEstimate: "3 hours",
      },
      {
        title: "Bash medium (grep, piping, reverse search)",
        difficulty: "Medium",
        timeEstimate: "5 hours",
      },
      { title: "Git/Github", difficulty: "Easy", timeEstimate: "4 hours" },
      {
        title: "JS Intro, Single threaded nature of JS",
        difficulty: "Easy",
        timeEstimate: "3 hours",
      },
      {
        title: "Async JS, callback queue, event loop",
        difficulty: "Medium",
        timeEstimate: "6 hours",
      },
      {
        title: "Creating promises, Common Promise API methods",
        difficulty: "Hard",
        timeEstimate: "8 hours",
      },
      {
        title: "Common JS APIs (map, filter, reduce, Object.keys)",
        difficulty: "Easy",
        timeEstimate: "4 hours",
      },
      { title: "East Medium", difficulty: "Hard", timeEstimate: "2 Hours" },
    ],
  },
  {
    title: "Simple frontend, DOM",
    items: [
      {
        title: "Intro to DOM, DOM Tree Structure",
        difficulty: "Easy",
        timeEstimate: "2 hours",
      },
      {
        title:
          "Common DOM APIs (getElementById, getElementsByClassName, querySelector, innerHTML, innerText, getAttribute, setAttribute).  ",
        difficulty: "Easy",
        timeEstimate: "4 hours",
      },
      {
        title: "Event handlers, onClick, stopPropagation,  ",
        difficulty: "Easy",
        timeEstimate: "3 hours",
      },
      { title: "localStorage", difficulty: "Easy", timeEstimate: "2 hours" },
      {
        title: "DOM Manipulation, Dynamic frontends",
        difficulty: "Medium",
        timeEstimate: "6 hours",
      },
      {
        title: "Creating a simple reconciler, Foundation for react",
        difficulty: "Hard",
        timeEstimate: "8 hours",
      },
    ],
  },
  {
    title: "Project",
    items: [
      {
        title: "Pure frontend TODO app using DOM Manipulation",
        timeEstimate: "2 days",
      },
    ],
  },
  {
    title: "Node.js/Bun/Cloudflare Runtime - Various JS runtimes",
    items: [
      { title: "What is a JS runtime", difficulty: "Easy", timeEstimate: "1 hour" },
      {
        title: "Node.js installation, common APIs",
        difficulty: "Easy",
        timeEstimate: "3 hours",
      },
      { title: "file system api, fetch.", difficulty: "Easy", timeEstimate: "4 hours" },
      {
        title: "External packages, axios vs fetch",
        difficulty: "Easy",
        timeEstimate: "3 hours",
      },
      { title: "v8, cf runtime", difficulty: "Medium", timeEstimate: "6 hours" },
      {
        title: "stream, worker threads, cluster module, ",
        difficulty: "Hard",
        timeEstimate: "8 hours",
      },
    ],
  },
  {
    title: "HTTP Servers",
    items: [
      { title: "What are HTTP Servers", difficulty: "Easy", timeEstimate: "1 hour" },
      { title: "Methods, routes, URLs, IPs and domains", difficulty: "Easy", timeEstimate: "3 hours" },
      { title: "headers, body, query parameters", difficulty: "Medium", timeEstimate: "5 hours" },
      {
        title: "Intro to express, creating routes",
        difficulty: "Medium",
        timeEstimate: "4 hours",
      },
      { title: "Middlewares in express", difficulty: "Medium", timeEstimate: "4 hours" },
      { title: "File system like DBs", difficulty: "Medium", timeEstimate: "6 hours" },
      {
        title: "Authentication using jwts, basics of jwts",
        difficulty: "Medium",
        timeEstimate: "6 hours",
      },
      {
        title: "Secret management using Doppler",
        difficulty: "Medium",
        timeEstimate: "4 hours",
      },
    ],
  },
  {
    title: "NoSQL Databases",
    items: [
      { title: "Intro to Databases", difficulty: "Easy", timeEstimate: "1 hour" },
      { title: "SQL vs NoSQL", difficulty: "Medium", timeEstimate: "2 hours" },
      {
        title: "MongoDB Intro, getting your first DB",
        difficulty: "Easy",
        timeEstimate: "3 hours",
      },
      {
        title: "mongoose, Schemas etc. Simple CRUD",
        difficulty: "Easy",
        timeEstimate: "4 hours",
      },
      { title: "Relationships intro", difficulty: "Medium", timeEstimate: "4 hours" },
      { title: "Relationsips in Mongo", difficulty: "Medium", timeEstimate: "6 hours" },
      { title: "Aggregations in mongo", difficulty: "Medium", timeEstimate: "8 hours" },
    ],
  },
  {
    title: "SQL Databases",
    items: [
      { title: "Recap SQL vs NoSQL", difficulty: "Easy", timeEstimate: "1 hour" },
      {
        title: "Postgres intro, getting your free",
        difficulty: "Medium",
        timeEstimate: "3 hours",
      },
      {
        title: "Creating schemas while dealing with SQL databases, CREATE TABLE",
        difficulty: "Medium",
        timeEstimate: "4 hours",
      },
      { title: "SQL queries (CRUD)", difficulty: "Medium", timeEstimate: "6 hours" },
      { title: "Indexes", difficulty: "Medium", timeEstimate: "5 hours" },
      {
        title: "Transactions and Concurrency Control",
        difficulty: "Hard",
        timeEstimate: "8 hours",
      },
      { title: "Normalization", difficulty: "Hard", timeEstimate: "6 hours" },
      { title: "Sub queries, batch queries", difficulty: "Medium", timeEstimate: "4 hours" },
    ],
  },
  {
    title: "ORMs",
    items: [
      { title: "Intro to ORMs", difficulty: "Easy", timeEstimate: "1 hour" },
      {
        title: "Prisma basics, setup, schema generation and CRUD queries",
        difficulty: "Medium",
        timeEstimate: "4 hours",
      },
      { title: "Transactions and relationships in prisma", difficulty: "Medium", timeEstimate: "6 hours" },
      { title: "Drizzle basics, setup, schema ", difficulty: "Medium", timeEstimate: "4 hours" },
      { title: "Txns and relationships in drizzle", difficulty: "Medium", timeEstimate: "6 hours" },
    ],
  },
  {
    title: "React",
    items: [
      {
        title: "Revise DOM, foundation of React, why frontend frameworks",
        difficulty: "Easy",
        timeEstimate: "3 hours",
      },
      { title: "Components in react", difficulty: "Easy", timeEstimate: "4 hours" },
      { title: "useState, useEffect", difficulty: "Medium", timeEstimate: "6 hours" },
      { title: "Routing in react", difficulty: "Easy", timeEstimate: "3 hours" },
      { title: "Connecting FE to BE", difficulty: "Hard", timeEstimate: "8 hours" },
      { title: "useRef, useMemo, useCallback", difficulty: "Hard", timeEstimate: "6 hours" },
      { title: "Custom hooks", difficulty: "Medium", timeEstimate: "4 hours" },
      { title: "Context API", difficulty: "Medium", timeEstimate: "5 hours" },
      { title: "Intro to state management", difficulty: "Medium", timeEstimate: "3 hours" },
      { title: "intro to recoil, atoms and selectors", difficulty: "Medium", timeEstimate: "4 hours" },
      { title: "atomFamily, selectorFamily", difficulty: "Hard", timeEstimate: "6 hours" },
    ],
  },
  {
    title: "Styling React apps",
    items: [
      { title: "Material UI", difficulty: "Easy", timeEstimate: "4 hours" },
      { title: "Tailwind", difficulty: "Medium", timeEstimate: "6 hours" },
      { title: "Shadcn", difficulty: "Medium", timeEstimate: "5 hours" },
    ],
  },
  {
    title: "Typescript",
    items: [
      { title: "TS vs JS, why TS?", difficulty: "Easy", timeEstimate: "2 hours" },
      { title: "types in ts", difficulty: "Medium", timeEstimate: "5 hours" },
      { title: "interfaces in ts", difficulty: "Medium", timeEstimate: "4 hours" },
      {
        title: "Advance TS APIs (Partial, Exclude …)",
        difficulty: "Hard",
        timeEstimate: "8 hours",
      },
    ],
  },
  {
    title: "Project",
    items: [
      { title: "Gmail clone", timeEstimate: "3 weeks" },
      { title: "Excelidraw", timeEstimate: "4 weeks" },
    ],
  },
  {
    title: "NextJS",
    items: [
      { title: "Why NextJS, SSR vs CSR", difficulty: "Medium", timeEstimate: "4 hours" },
      { title: "File based routing", difficulty: "Medium", timeEstimate: "5 hours" },
      { title: "Middlewares", difficulty: "Medium", timeEstimate: "4 hours" },
      { title: "SSG, ISR", difficulty: "Medium", timeEstimate: "6 hours" },
      { title: "Tailwind, shadcn integration", difficulty: "Medium", timeEstimate: "4 hours" },
      { title: "API routes", difficulty: "Medium", timeEstimate: "5 hours" },
      { title: "Data fetching", difficulty: "Easy", timeEstimate: "3 hours" },
      { title: "NextAuth, Cookie based auth", difficulty: "Medium", timeEstimate: "6 hours" },
      { title: "Internationalization", difficulty: "Medium", timeEstimate: "4 hours" },
    ],
  },
  {
    title: "Monorepos, Turborepo, lints",
    items: [
      { title: "What is linting", difficulty: "Easy", timeEstimate: "1 hour" },
      { title: "Prettier, eslint", difficulty: "Medium", timeEstimate: "4 hours" },
      { title: "pre commit hooks/husky", difficulty: "Hard", timeEstimate: "6 hours" },
      { title: "lints in CI", difficulty: "Hard", timeEstimate: "4 hours" },
      { title: "What is a monorepo", difficulty: "Easy", timeEstimate: "1 hour" },
      { title: "Basic yarn workspaces monorepo", difficulty: "Medium", timeEstimate: "5 hours" },
      { title: "What is turborepo", difficulty: "Easy", timeEstimate: "1 hour" },
      { title: "Turborepo", difficulty: "Medium", timeEstimate: "5 hours" },
    ],
  },
  {
    title: "Websockets, rtc",
    items: [
      { title: "one way vs two way comm", difficulty: "Easy", timeEstimate: "1 hour" },
      {
        title: "what are ws, how are they diff from http",
        difficulty: "Easy",
        timeEstimate: "2 hours",
      },
      { title: "Creating a websocket server", difficulty: "Medium", timeEstimate: "6 hours" },
      {
        title: "Client side logic to connect to a ws server",
        difficulty: "Medium",
        timeEstimate: "5 hours",
      },
      { title: "UDP vs TCP communication, webrtc", difficulty: "Medium", timeEstimate: "6 hours" },
      { title: "SFUs and Mediasoup", difficulty: "Hard", timeEstimate: "8 hours" },
    ],
  },
  {
    title: "Testing",
    items: [
      { title: "Why testing?", difficulty: "Easy", timeEstimate: "1 hour" },
      { title: "Unit tests", difficulty: "Medium", timeEstimate: "6 hours" },
      { title: "Integration tests", difficulty: "Hard", timeEstimate: "8 hours" },
      { title: "End to end tests", difficulty: "Hard", timeEstimate: "10 hours" },
    ],
  },
  {
    title: "Advance backend",
    items: [
      { title: "Advance BE communication", difficulty: "Medium", timeEstimate: "6 hours" },
      { title: "queues (redis)", difficulty: "Medium", timeEstimate: "8 hours" },
      {
        title: "pub subs (redis/kafka/RabitMQ)",
        difficulty: "Medium",
        timeEstimate: "6 hours",
      },
      { title: "Scaling ws, http servers", difficulty: "Medium", timeEstimate: "8 hours" },
      {
        title: "Node.js vs golang vs rust for performance",
        difficulty: "Medium",
        timeEstimate: "6 hours",
      },
    ],
  },
  {
    title: "Data Structures and Algorithms",
    items: [
      { title: "Arrays", difficulty: "Easy", timeEstimate: "3 hours" },
      { title: "Linked Lists", difficulty: "Medium", timeEstimate: "5 hours" },
      { title: "Trees", difficulty: "Medium", timeEstimate: "7 hours" },
      { title: "Graphs", difficulty: "Hard", timeEstimate: "10 hours" },
      { title: "Sorting Algorithms", difficulty: "Medium", timeEstimate: "6 hours" },
      { title: "Searching Algorithms", difficulty: "Easy", timeEstimate: "4 hours" },
    ],
  },
  {
    title: "System Design",
    items: [
      { title: "CAP Theorem", difficulty: "Medium", timeEstimate: "4 hours" },
      { title: "Load Balancing", difficulty: "Medium", timeEstimate: "6 hours" },
      { title: "Caching Strategies", difficulty: "Medium", timeEstimate: "5 hours" },
      { title: "Database Sharding", difficulty: "Hard", timeEstimate: "8 hours" },
      { title: "Microservices Architecture", difficulty: "Hard", timeEstimate: "10 hours" },
    ],
  },
  {
    title: "DevOps",
    items: [
      { title: "Docker", difficulty: "Medium", timeEstimate: "6 hours" },
      { title: "Kubernetes", difficulty: "Hard", timeEstimate: "10 hours" },
      { title: "CI/CD Pipelines", difficulty: "Medium", timeEstimate: "7 hours" },
      {
        title: "Infrastructure as Code (IaC)",
        difficulty: "Medium",
        timeEstimate: "8 hours",
      },
      { title: "Monitoring and Alerting", difficulty: "Medium", timeEstimate: "5 hours" },
    ],
  },
  {
    title: "Security",
    items: [
      { title: "Authentication", difficulty: "Medium", timeEstimate: "5 hours" },
      { title: "Authorization", difficulty: "Medium", timeEstimate: "6 hours" },
      { title: "OWASP Top 10", difficulty: "Medium", timeEstimate: "8 hours" },
      { title: "Cryptography", difficulty: "Hard", timeEstimate: "10 hours" },
      { title: "Secure Coding Practices", difficulty: "Medium", timeEstimate: "7 hours" },
    ],
  },
  {
    title: "Clean Code and Architecture",
    items: [
      { title: "SOLID Principles", difficulty: "Medium", timeEstimate: "6 hours" },
      { title: "Design Patterns", difficulty: "Medium", timeEstimate: "8 hours" },
      { title: "Code Smells", difficulty: "Medium", timeEstimate: "5 hours" },
      { title: "Refactoring", difficulty: "Medium", timeEstimate: "7 hours" },
      { title: "Domain-Driven Design (DDD)", difficulty: "Hard", timeEstimate: "10 hours" },
    ],
  },
  {
    title: "More topics",
    items: [
      { title: "ZOD", timeEstimate: "4 hours" },
      { title: "Serverless BE", timeEstimate: "6 hours" },
      { title: "openAPI spec", timeEstimate: "5 hours" },
      { title: "Autogenerated clients", timeEstimate: "6 hours" },
      { title: "Rate Limiting", timeEstimate: "4 hours" },
      { title: "Captcha", timeEstimate: "3 hours" },
      { title: "ddos protection", timeEstimate: "6 hours" },
      { title: "sharding, replication, Resiliency", timeEstimate: "8 hours" },
      { title: "GRPC", timeEstimate: "6 hours" },
      { title: "Load Balancers", timeEstimate: "8 hours" },
      { title: "CAP theorem", timeEstimate: "5 hours" },
    ],
  },
  {
    title: "Project",
    items: [
      { title: "Building codeforces/leetcode", timeEstimate: "4 weeks" },
      { title: "Scale your realtime app", timeEstimate: "6 weeks" },
    ],
  },
  {
    title: "Good auxilary stacks to know -",
    items: [
      { title: "Firebase", timeEstimate: "2 days" },
      { title: "Strapi", timeEstimate: "3 days" },
    ],
  },
]
