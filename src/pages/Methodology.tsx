import {
  Database,
  Brain,
  Code,
  Cloud,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const techStack = [
  { name: "Python", category: "Backend", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { name: "Pandas", category: "Data", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  { name: "Scikit-learn", category: "ML", color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  { name: "XGBoost", category: "ML", color: "bg-green-500/10 text-green-600 border-green-500/20" },
  { name: "GeoPandas", category: "Geo", color: "bg-teal-500/10 text-teal-600 border-teal-500/20" },
  { name: "Folium", category: "Mapping", color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20" },
  { name: "Plotly", category: "Viz", color: "bg-pink-500/10 text-pink-600 border-pink-500/20" },
  { name: "Streamlit", category: "Frontend", color: "bg-red-500/10 text-red-600 border-red-500/20" },
  { name: "Flask", category: "API", color: "bg-gray-500/10 text-gray-600 border-gray-500/20" },
  { name: "Docker", category: "DevOps", color: "bg-blue-600/10 text-blue-700 border-blue-600/20" },
  { name: "Twilio", category: "Alerts", color: "bg-red-600/10 text-red-700 border-red-600/20" },
  { name: "Heroku", category: "Hosting", color: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
];

const workflow = [
  {
    step: 1,
    title: "Data Collection",
    icon: Database,
    description: "Gather real-time data from multiple sources",
    details: [
      "Rainfall sensor data (mm/hour)",
      "River water level measurements",
      "LiDAR elevation mapping",
      "Historical flood records",
      "Weather API integration",
    ],
  },
  {
    step: 2,
    title: "Model Training",
    icon: Brain,
    description: "Train ML models on historical data",
    details: [
      "Feature engineering & selection",
      "Linear Regression baseline",
      "XGBoost gradient boosting",
      "Random Forest ensemble",
      "Cross-validation (94% accuracy)",
    ],
  },
  {
    step: 3,
    title: "API Integration",
    icon: Code,
    description: "Connect models to real-time data streams",
    details: [
      "Flask REST API endpoints",
      "Real-time prediction pipeline",
      "Twilio SMS integration",
      "WebSocket live updates",
      "Geospatial data processing",
    ],
  },
  {
    step: 4,
    title: "Deployment",
    icon: Cloud,
    description: "Deploy scalable monitoring system",
    details: [
      "Docker containerization",
      "Heroku cloud hosting",
      "Automated CI/CD pipeline",
      "Monitoring & logging",
      "Load balancing",
    ],
  },
];

const mlModels = [
  {
    name: "Linear Regression",
    accuracy: "82%",
    use: "Baseline predictions",
    pros: "Fast, interpretable",
  },
  {
    name: "XGBoost",
    accuracy: "94%",
    use: "Primary model",
    pros: "High accuracy, handles non-linear patterns",
  },
  {
    name: "Random Forest",
    accuracy: "91%",
    use: "Ensemble backup",
    pros: "Robust, reduces overfitting",
  },
];

export default function Methodology() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Our{" "}
            <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Methodology
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            A deep dive into the technology and processes powering our flood prediction system
          </p>
        </div>

        {/* Tech Stack */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 text-center">Technology Stack</h2>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className={`px-4 py-2 rounded-lg border font-medium text-sm transition-all hover:scale-105 ${tech.color}`}
              >
                <span className="opacity-60 text-xs mr-2">{tech.category}</span>
                {tech.name}
              </div>
            ))}
          </div>
        </section>

        {/* Workflow */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-12 text-center">Development Workflow</h2>
          <div className="relative max-w-5xl mx-auto">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-24 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary via-primary to-primary/30" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {workflow.map((item, index) => (
                <div
                  key={item.step}
                  className="relative p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-all duration-300"
                >
                  {/* Step indicator */}
                  <div className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm z-10">
                    {item.step}
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mt-2 mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>

                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {item.description}
                  </p>

                  <ul className="space-y-2">
                    {item.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-risk-low flex-shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Arrow for desktop */}
                  {index < workflow.length - 1 && (
                    <div className="hidden lg:flex absolute -right-3 top-24 w-6 h-6 rounded-full bg-background border border-border items-center justify-center z-10">
                      <ArrowRight className="w-3 h-3 text-primary" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ML Models */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Machine Learning Models
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {mlModels.map((model) => (
              <div
                key={model.name}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">{model.name}</h3>
                  <span className="text-2xl font-bold text-primary">
                    {model.accuracy}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Use Case</span>
                    <span>{model.use}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Strengths</span>
                    <span className="text-right max-w-[60%]">{model.pros}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture Diagram */}
        <section>
          <h2 className="text-2xl font-bold mb-8 text-center">
            System Architecture
          </h2>
          <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-card border border-border">
            <div className="grid grid-cols-3 gap-4 text-center">
              {/* Data Layer */}
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <h4 className="font-semibold text-blue-600 mb-2">Data Layer</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Sensors</p>
                  <p>APIs</p>
                  <p>Database</p>
                </div>
              </div>

              {/* Processing Layer */}
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <h4 className="font-semibold text-green-600 mb-2">
                  Processing Layer
                </h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>ML Models</p>
                  <p>Prediction Engine</p>
                  <p>Geo Processing</p>
                </div>
              </div>

              {/* Application Layer */}
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <h4 className="font-semibold text-purple-600 mb-2">
                  Application Layer
                </h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Dashboard</p>
                  <p>Alerts</p>
                  <p>Reports</p>
                </div>
              </div>
            </div>

            {/* Flow arrows */}
            <div className="flex justify-center items-center mt-6 gap-4 text-muted-foreground">
              <span className="text-sm">Input</span>
              <ArrowRight className="w-4 h-4" />
              <span className="text-sm">Process</span>
              <ArrowRight className="w-4 h-4" />
              <span className="text-sm">Output</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
