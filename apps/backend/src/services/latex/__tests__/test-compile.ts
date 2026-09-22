import { normalizeResumeData, LATEX_TEMPLATES } from '../latex-renderer.service';
import { LatexCompilerService } from '../latex-compiler.service';

async function testAllTemplates() {
  const sampleData = {
    personalInfoData: {
      full_name: "Jake Ryan",
      email: "jake@example.com",
      phone: "+1 123-456-7890",
      location: "San Francisco, CA",
      linkedin: "https://linkedin.com/in/jakeryan",
      github: "https://github.com/jakeryan",
      website: "https://jakeryan.dev",
      profession: "Senior Full Stack Engineer",
    },
    professionalSummaryData: "Senior Software Engineer with 5+ years building scalable distributed web applications with TypeScript, React, and Node.js.",
    experienceData: [
      {
        company: "Tech Corp",
        position: "Senior Software Engineer",
        location: "San Francisco, CA",
        startDate: "2021-01",
        endDate: "Present",
        isCurrent: true,
        description: "Architected real-time messaging pipeline handling 10M+ daily events.\nReduced p99 latency by 45% using Redis caching and Postgres indexing.\nMentored 4 junior engineers in production deployment workflows.",
      },
      {
        company: "Startup Labs",
        position: "Full Stack Developer",
        location: "Austin, TX",
        startDate: "2019-06",
        endDate: "2020-12",
        isCurrent: false,
        description: "Built Next.js web application with 50K+ active users.\nIntegrated Stripe and Razorpay payment gateways with 99.9% success rate.",
      }
    ],
    educationData: [
      {
        institution: "Stanford University",
        degree: "Bachelor of Science",
        field: "Computer Science",
        location: "Stanford, CA",
        graduationDate: "2019",
        gpa: "3.9",
        graduationType: "cgpa"
      }
    ],
    projectData: [
      {
        name: "BuildForJob Platform",
        techStack: "Next.js, Node.js, PostgreSQL, Docker",
        liveUrl: "https://buildforjob.com",
        githubUrl: "https://github.com/rupesh0001-tech/buildforjob",
        description: "Engineered high-performance resume builder with automated LaTeX compilation and PDF export.",
      }
    ],
    skillData: ["TypeScript", "React", "Node.js", "PostgreSQL", "Docker", "Next.js", "Redis", "Tailwind CSS"],
    sectionVisibility: {
      summary: true,
      experience: true,
      education: true,
      projects: true,
      skills: true,
    },
    sectionOrder: ["experience", "skills", "projects", "education", "summary"]
  };

  const canonical = normalizeResumeData(sampleData);
  console.log("Canonical data prepared for:", canonical.name);

  for (const [id, template] of Object.entries(LATEX_TEMPLATES)) {
    console.log(`\n--- Testing Template: ${template.name} (${id}) ---`);
    const texSource = template.render(canonical);
    console.log(`Generated TeX size: ${texSource.length} chars`);
    
    const start = Date.now();
    const result = await LatexCompilerService.compile(texSource, { timeoutMs: 60000 });
    const duration = Date.now() - start;

    if (result.success && result.pdfBuffer) {
      console.log(` SUCCESS in ${duration}ms! PDF Size: ${result.pdfBuffer.length} bytes`);
    } else {
      console.error(` FAILED in ${duration}ms:`, result.error);
      console.error("Logs:", result.logs);
    }
  }
}

testAllTemplates().catch(console.error);
