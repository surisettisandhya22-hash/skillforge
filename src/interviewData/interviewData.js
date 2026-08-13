const interviewData = [
  {
    id: 1,
    technology: "System Design",
    level: "Hard",
    question: "How would you design a scalable microservices architecture for an e-commerce platform?",
    answer: "I would use an API Gateway for routing, separate domains (Auth, Inventory, Orders) into individual microservices communicating via gRPC or message queues like Kafka. I'd implement the Saga pattern for distributed transactions and use Redis for caching."
  },
  {
    id: 2,
    technology: "React",
    level: "Hard",
    question: "Explain how React's concurrent mode and transitions improve performance in large applications.",
    answer: "Concurrent mode allows React to interrupt a long-rendering task to handle high-priority events (like user input). useTransition lets us mark non-urgent state updates, keeping the UI responsive while complex components render in the background."
  },
  {
    id: 3,
    technology: "Node.js",
    level: "Hard",
    question: "How do you handle memory leaks and profile performance bottlenecks in a Node.js production application?",
    answer: "I use tools like Clinic.js and Chrome DevTools to take heap snapshots and CPU profiles. I look for closures retaining references unnecessarily, improper event listener cleanup, and use standard monitoring (like Prometheus) to track memory usage over time."
  },
  {
    id: 4,
    technology: "DevOps",
    level: "Hard",
    question: "Describe a robust CI/CD pipeline for deploying a containerized application to Kubernetes.",
    answer: "Code push triggers a GitHub Action running unit and integration tests. Upon success, a Docker image is built, scanned for vulnerabilities (e.g., Trivy), and pushed to an ECR/ACR registry. Finally, ArgoCD or Flux (GitOps) detects the new image tag and automatically applies the updated Helm chart to the K8s cluster."
  }
];

export default interviewData;