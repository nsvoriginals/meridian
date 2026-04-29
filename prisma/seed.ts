import { PrismaClient, ProjectStatus } from "@prisma/client";

const prisma = new PrismaClient();

const domains: Array<{
  id: string;
  title: string;
  description: string;
  coverKeyword: string;
  color: string;
  topics: string[];
  projects: { title: string; description: string; status: ProjectStatus }[];
}> = [
  {
    id: "fullstack",
    title: "Full Stack",
    description:
      "End-to-end web development from HTML/CSS fundamentals to advanced Node.js, databases, and modern frameworks.",
    coverKeyword: "coding,programming",
    color: "#3b82f6",
    topics: [
      "HTML/CSS",
      "JS Basics",
      "JS Architecture",
      "Async JS",
      "Node vs Browser JS",
      "HTTP and Express",
      "Databases and MongoDB",
      "Postgres + Prisma/Drizzle",
      "TypeScript",
      "Turborepo",
      "BunJS",
      "React",
      "Tailwind",
      "NextJS",
      "Websockets + WebRTC",
      "Queues/Pubsubs",
    ],
    projects: [
      { title: "Todo App", description: "A full-stack todo application", status: ProjectStatus.TODO },
      { title: "Lovable clone (easy)", description: "Clone of Lovable UI builder", status: ProjectStatus.TODO },
      { title: "Codeforces tracker", description: "Track competitive programming progress", status: ProjectStatus.TODO },
      { title: "Trading App", description: "Real-time stock trading dashboard", status: ProjectStatus.TODO },
    ],
  },
  {
    id: "devops",
    title: "DevOps",
    description:
      "Infrastructure, containerization, orchestration, CI/CD pipelines, and cloud-native operations.",
    coverKeyword: "server",
    color: "#10b981",
    topics: [
      "Bash/Terminal",
      "VMs/Baremetal machines",
      "Process management + Reverse proxies",
      "Certificates and cert management",
      "ASGs/MIGs",
      "Containers and container runtimes",
      "Docker",
      "Kubernetes 1",
      "Kubernetes 2",
      "CI/CD",
      "Monitoring/Observability",
      "IaC",
      "CDNs + Object stores",
      "Sandboxing/Firecracker",
    ],
    projects: [
      { title: "e2b clone", description: "Code execution sandbox environment", status: ProjectStatus.TODO },
      { title: "Replit clone", description: "Browser-based IDE with execution", status: ProjectStatus.TODO },
      { title: "Cloudflare Workers project", description: "Edge computing with Workers", status: ProjectStatus.TODO },
    ],
  },
  {
    id: "ai",
    title: "AI",
    description:
      "Machine learning fundamentals, deep learning, LLMs, agents, RAG, and production AI systems.",
    coverKeyword: "artificial intelligence",
    color: "#8b5cf6",
    topics: [
      "History (what is AI, transformers)",
      "History (DL, backprop, NLP)",
      "Neural networks + PyTorch",
      "RNNs/LSTMs/Sequential models",
      "CNNs",
      "Coding simple attention",
      "Vanilla attention to industry variants (KV cache, MQA, GQA, MLA, DSA)",
      "HuggingFace end-to-end",
      "Instrumenting LLM calls/observability/tracing",
      "Vector DBs and RAG",
      "Context engineering",
      "Agents from first principles",
      "Agent frameworks",
      "Memory",
      "MCP",
      "Computer use and multimodal agents",
      "What is Finetuning",
      "Finetuning a model",
      "RL Finetuning",
      "Evals - Testing agents",
      "Advanced topics",
      "Voice/image/video",
    ],
    projects: [
      { title: "Agent framework", description: "Build an agent orchestration framework from scratch", status: ProjectStatus.TODO },
      { title: "RL Finetuning project + writing evals", description: "Finetune a model with RL and comprehensive evals", status: ProjectStatus.TODO },
      { title: "Devin clone", description: "Autonomous coding agent", status: ProjectStatus.TODO },
      { title: "Memory framework", description: "Long-term memory system for AI agents", status: ProjectStatus.TODO },
    ],
  },
  {
    id: "web3",
    title: "Web3",
    description:
      "Blockchain fundamentals, Solana architecture, DeFi protocols, Rust smart contracts, and decentralized systems.",
    coverKeyword: "blockchain",
    color: "#f59e0b",
    topics: [
      "Intro to blockchains",
      "Cryptography",
      "Solana architecture",
      "Solana jargons (authority, owner)",
      "PDAs",
      "@solana/web3.js or Gill",
      "Solana wallet adapter",
      "Data model",
      "Token program",
      "DeFi (AMM, DLMM, CLMM, perps)",
      "Rust easy",
      "Rust advanced",
      "Anchor",
      "Common contracts (staking/escrow)",
      "Indexing",
      "MPC and Shamirs",
      "Ad hoc web2 + web3",
      "Partially centralized contracts",
    ],
    projects: [
      { title: "DEX", description: "Decentralized exchange on Solana", status: ProjectStatus.TODO },
      { title: "CEX", description: "Centralized exchange with on-chain settlement", status: ProjectStatus.TODO },
      { title: "Wallet", description: "Non-custodial Solana wallet", status: ProjectStatus.TODO },
      { title: "Prediction market", description: "On-chain prediction market protocol", status: ProjectStatus.TODO },
      { title: "Frontends/clients/tests for contracts", description: "UI and test suites for smart contracts", status: ProjectStatus.TODO },
    ],
  },
];

async function main() {
  console.log("Seeding database...");

  await prisma.topic.deleteMany();
  await prisma.project.deleteMany();
  await prisma.learningDomain.deleteMany();
  await prisma.habitLog.deleteMany();

  for (const domain of domains) {
    const created = await prisma.learningDomain.create({
      data: {
        id: domain.id,
        title: domain.title,
        description: domain.description,
        coverKeyword: domain.coverKeyword,
        color: domain.color,
        topics: {
          create: domain.topics.map((title, index) => ({
            title,
            order: index,
            completed: false,
          })),
        },
        projects: {
          create: domain.projects.map((p) => ({
            title: p.title,
            description: p.description,
            status: p.status,
          })),
        },
      },
    });
    console.log(`  Created domain: ${created.title}`);
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
