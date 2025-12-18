import { Github, Linkedin, Mail, Users, Code, Lightbulb } from "lucide-react";

const teamMembers = [
  {
    name: "Dev Dharukiya",
    role: "Team Leader",
    avatar: "DD",
    bio: "Full-stack developer passionate about using technology for social good. Leading the architecture and ML model development.",
    skills: ["Python", "Machine Learning", "System Design", "Leadership"],
    color: "from-primary to-primary-dark",
  },
  {
    name: "Bhavesh Chaudhary",
    role: "Developer",
    avatar: "BC",
    bio: "Frontend specialist with expertise in data visualization. Building intuitive interfaces for complex disaster data.",
    skills: ["React", "Data Visualization", "UI/UX", "Geospatial"],
    color: "from-risk-medium to-risk-high",
  },
];

const teamValues = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Applying cutting-edge ML to solve real-world problems",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building solutions that protect and empower communities",
  },
  {
    icon: Code,
    title: "Excellence",
    description: "Committed to clean code and robust architecture",
  },
];

export default function Team() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            <span>Meet the Team</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Pixel-Coders
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            A passionate team dedicated to building technology that saves lives
          </p>
        </div>

        {/* Team Members */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="relative p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-all duration-300 group"
              >
                {/* Avatar */}
                <div className="flex items-start gap-6 mb-6">
                  <div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-105 transition-transform`}
                  >
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <p className="text-primary font-medium">{member.role}</p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-muted-foreground mb-6">{member.bio}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex gap-3">
                  <button className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Github className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Mail className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Values */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {teamValues.map((value) => (
              <div
                key={value.title}
                className="p-6 rounded-2xl bg-gradient-hero border border-border text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Project Info */}
        <section className="max-w-3xl mx-auto">
          <div className="p-8 rounded-2xl bg-card border border-border text-center">
            <h2 className="text-2xl font-bold mb-4">About This Project</h2>
            <p className="text-muted-foreground mb-6">
              This flood prediction system was developed as part of a hackathon
              challenge to create innovative solutions for disaster management.
              Our goal is to leverage AI and geospatial technology to provide
              early warnings and save lives.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="px-4 py-2 rounded-lg bg-muted">
                <span className="text-muted-foreground">Event:</span>{" "}
                <span className="font-medium">Hackathon 2024</span>
              </div>
              <div className="px-4 py-2 rounded-lg bg-muted">
                <span className="text-muted-foreground">Focus:</span>{" "}
                <span className="font-medium">Disaster Management</span>
              </div>
              <div className="px-4 py-2 rounded-lg bg-muted">
                <span className="text-muted-foreground">Status:</span>{" "}
                <span className="font-medium text-risk-low">Active Development</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
