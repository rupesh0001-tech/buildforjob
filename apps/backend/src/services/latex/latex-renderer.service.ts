import { escapeLatex, escapeLatexUrl, formatMonthYear } from './latex-escaper.util';

export interface CanonicalResumeData {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  profession: string;
  summary: string;
  experience: {
    company: string;
    position: string;
    location?: string;
    startDate: string;
    endDate?: string;
    isCurrent?: boolean;
    description: string;
    bullets: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    field: string;
    location?: string;
    graduationDate: string;
    gpa?: string;
    graduationType?: string;
  }[];
  projects: {
    name: string;
    techStack?: string;
    liveUrl?: string;
    githubUrl?: string;
    link?: string;
    description: string;
    bullets: string[];
  }[];
  skills: {
    category?: string;
    items: string[];
  }[];
  rawSkills: string[];
  accentColor?: string;
  sectionVisibility: {
    summary: boolean;
    experience: boolean;
    education: boolean;
    projects: boolean;
    skills: boolean;
  };
  sectionOrder: string[];
}

export function normalizeResumeData(input: any): CanonicalResumeData {
  const content = input?.content || input || {};
  const personal = content.personalInfoData || content.personal_info || content.personalInfo || {};

  // Resolve Name
  let name = personal.full_name || personal.fullName || '';
  if (!name && (personal.firstName || personal.lastName)) {
    name = `${personal.firstName || ''} ${personal.lastName || ''}`.trim();
  }
  if (!name) name = 'Your Name';

  // Normalize Summary
  const summary = content.professionalSummaryData || content.professional_summary || content.summary || personal.bio || '';

  // Normalize Experience
  const expRaw = content.experienceData || content.experience || [];
  const experience = (Array.isArray(expRaw) ? expRaw : []).map((exp: any) => {
    const desc = exp.description || '';
    const bullets = desc
      .split('\n')
      .map((l: string) => l.trim().replace(/^[-*•]\s*/, ''))
      .filter((l: string) => l.length > 0);

    return {
      company: exp.company || 'Company Name',
      position: exp.position || 'Position Title',
      location: exp.location || '',
      startDate: exp.startDate || exp.start_date || '',
      endDate: exp.endDate || exp.end_date || (exp.is_current ? 'Present' : ''),
      isCurrent: Boolean(exp.is_current || exp.isCurrent),
      description: desc,
      bullets: bullets.length > 0 ? bullets : [desc || 'Responsibilities and key achievements.'],
    };
  });

  // Normalize Education
  const eduRaw = content.educationData || content.education || [];
  const education = (Array.isArray(eduRaw) ? eduRaw : []).map((edu: any) => ({
    institution: edu.institution || 'University Name',
    degree: edu.degree || 'Degree',
    field: edu.field || '',
    location: edu.location || '',
    graduationDate: edu.graduation_date || edu.graduationDate || '',
    gpa: edu.gpa || '',
    graduationType: edu.graduationType || 'cgpa',
  }));

  // Normalize Projects
  const projRaw = content.projectData || content.project || content.projects || [];
  const projects = (Array.isArray(projRaw) ? projRaw : []).map((proj: any) => {
    const desc = proj.description || '';
    const bullets = desc
      .split('\n')
      .map((l: string) => l.trim().replace(/^[-*•]\s*/, ''))
      .filter((l: string) => l.length > 0);

    return {
      name: proj.name || 'Project Name',
      techStack: proj.techStack || proj.tech_stack || '',
      liveUrl: proj.liveUrl || proj.live_url || proj.demoUrl || '',
      githubUrl: proj.githubUrl || proj.github_url || proj.repoUrl || '',
      link: proj.link || proj.url || '',
      description: desc,
      bullets: bullets.length > 0 ? bullets : [desc || 'Project overview and outcomes.'],
    };
  });

  // Normalize Skills
  const skillsRaw = content.skillData || content.skills || [];
  let rawSkills: string[] = [];
  if (Array.isArray(skillsRaw)) {
    rawSkills = skillsRaw.map((s: any) => (typeof s === 'string' ? s : s.name || '')).filter(Boolean);
  } else if (typeof skillsRaw === 'string') {
    rawSkills = skillsRaw.split(',').map((s: string) => s.trim()).filter(Boolean);
  }

  // Section Visibility
  const vis = content.sectionVisibility || {};
  const sectionVisibility = {
    summary: vis.summary !== false,
    experience: vis.experience !== false,
    education: vis.education !== false,
    projects: vis.projects !== false,
    skills: vis.skills !== false,
  };

  // Section Order
  const defaultOrder = ['summary', 'education', 'experience', 'projects', 'skills'];
  const rawOrder = content.sectionOrder || content.section_order;
  let sectionOrder = defaultOrder;
  if (Array.isArray(rawOrder) && rawOrder.length > 0) {
    const filtered = rawOrder.filter(k => defaultOrder.includes(k));
    const missing = defaultOrder.filter(k => !filtered.includes(k));
    sectionOrder = [...filtered, ...missing];
  }

  return {
    name,
    email: personal.email || '',
    phone: personal.phone || '',
    location: personal.location || '',
    linkedin: personal.linkedin || '',
    github: personal.github || '',
    website: personal.website || '',
    profession: personal.profession || '',
    summary,
    experience,
    education,
    projects,
    skills: [{ category: 'Technical Skills', items: rawSkills }],
    rawSkills,
    accentColor: content.accentColor || '#0E5484',
    sectionVisibility,
    sectionOrder,
  };
}

export const LATEX_TEMPLATES: Record<string, { id: string; name: string; description: string; render: (data: CanonicalResumeData) => string }> = {
  'latex-jake': {
    id: 'latex-jake',
    name: 'Classic ATS',
    description: 'Gold standard single-column ATS optimized resume template based on Jake Gutierrez (f1.txt).',
    render: renderJakeTemplate,
  },
  'latex-faang': {
    id: 'latex-faang',
    name: 'FAANG Compact',
    description: 'High-density resume format popular among big-tech and software engineering roles (f2.txt).',
    render: renderFaangTemplate,
  },
  'latex-corporate': {
    id: 'latex-corporate',
    name: 'Corporate Modern',
    description: 'Professional layout with summary-first structure and clean section dividers (f3.txt).',
    render: renderCorporateTemplate,
  },
  'latex-executive': {
    id: 'latex-executive',
    name: 'Executive Blue',
    description: 'Clean modern styling featuring subtle colored section headers and typography (f4.txt).',
    render: renderExecutiveTemplate,
  },
  'latex-minimal': {
    id: 'latex-minimal',
    name: 'Clean Tech',
    description: 'Minimalist, clear-cut layout ideal for engineers, researchers, and creators (f5.txt).',
    render: renderMinimalTemplate,
  },
};

// ==========================================
// Project Links Formatting Helpers
// ==========================================
function formatJakeProjectLinks(proj: CanonicalResumeData['projects'][0]): string {
  const parts: string[] = [`\\textbf{${escapeLatex(proj.name)}}`];
  if (proj.githubUrl) {
    parts.push(`\\href{${escapeLatexUrl(proj.githubUrl)}}{\\underline{GitHub}}`);
  }
  if (proj.liveUrl) {
    parts.push(`\\href{${escapeLatexUrl(proj.liveUrl)}}{\\underline{Live Demo}}`);
  }
  if (!proj.githubUrl && !proj.liveUrl && proj.link) {
    parts.push(`\\href{${escapeLatexUrl(proj.link)}}{\\underline{Link}}`);
  }
  if (proj.techStack) {
    parts.push(`\\emph{${escapeLatex(proj.techStack)}}`);
  }
  return parts.join(' $|$ ');
}

function formatFaangProjectItem(proj: CanonicalResumeData['projects'][0]): string {
  const linkBadges: string[] = [];
  if (proj.githubUrl) {
    linkBadges.push(`\\href{${escapeLatexUrl(proj.githubUrl)}}{\\underline{GitHub}}`);
  }
  if (proj.liveUrl) {
    linkBadges.push(`\\href{${escapeLatexUrl(proj.liveUrl)}}{\\underline{Live Demo}}`);
  }
  if (!proj.githubUrl && !proj.liveUrl && proj.link) {
    linkBadges.push(`\\href{${escapeLatexUrl(proj.link)}}{\\underline{Link}}`);
  }
  const linksStr = linkBadges.length > 0 ? ` [${linkBadges.join(' | ')}]` : '';
  const techStr = proj.techStack ? ` \\emph{(${escapeLatex(proj.techStack)})}` : '';
  const bulletsStr = proj.bullets.map(b => escapeLatex(b)).join(' ');
  return `\\item \\textbf{${escapeLatex(proj.name)}}${linksStr}.${techStr} ${bulletsStr}`;
}

function formatCorporateProjectHeading(proj: CanonicalResumeData['projects'][0]): { title: string; subtitle: string } {
  const links: string[] = [];
  if (proj.githubUrl) {
    links.push(`\\href{${escapeLatexUrl(proj.githubUrl)}}{\\underline{GitHub}}`);
  }
  if (proj.liveUrl) {
    links.push(`\\href{${escapeLatexUrl(proj.liveUrl)}}{\\underline{Live Demo}}`);
  }
  if (!proj.githubUrl && !proj.liveUrl && proj.link) {
    links.push(`\\href{${escapeLatexUrl(proj.link)}}{\\underline{Link}}`);
  }
  const linksStr = links.length > 0 ? ` $|$ ${links.join(' $|$ ')}` : '';
  const title = `\\textbf{${escapeLatex(proj.name)}}${linksStr}`;
  const subtitle = proj.techStack ? escapeLatex(proj.techStack) : 'Project Details';
  return { title, subtitle };
}

// ==========================================
// 1. Template: Classic ATS (f1.txt - Jake Gutierrez)
// ==========================================
function renderJakeTemplate(data: CanonicalResumeData): string {
  const headerLinks: string[] = [];
  if (data.phone) headerLinks.push(escapeLatex(data.phone));
  if (data.email) headerLinks.push(`\\href{mailto:${escapeLatexUrl(data.email)}}{\\underline{${escapeLatex(data.email)}}}`);
  if (data.linkedin) headerLinks.push(`\\href{${escapeLatexUrl(data.linkedin)}}{\\underline{${escapeLatex(data.linkedin.replace(/^https?:\/\/(www\.)?/, ''))}}}`);
  if (data.github) headerLinks.push(`\\href{${escapeLatexUrl(data.github)}}{\\underline{${escapeLatex(data.github.replace(/^https?:\/\/(www\.)?/, ''))}}}`);
  if (data.website) headerLinks.push(`\\href{${escapeLatexUrl(data.website)}}{\\underline{${escapeLatex(data.website.replace(/^https?:\/\/(www\.)?/, ''))}}}`);

  let summarySection = '';
  if (data.sectionVisibility.summary && data.summary) {
    summarySection = `
%-----------SUMMARY-----------
\\section{Summary}
  \\resumeSubHeadingListStart
    \\item\\small{${escapeLatex(data.summary)}}
  \\resumeSubHeadingListEnd
`;
  }

  let educationSection = '';
  if (data.sectionVisibility.education && data.education.length > 0) {
    educationSection = `
%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
${data.education.map(edu => `    \\resumeSubheading
      {${escapeLatex(edu.institution)}}{${escapeLatex(edu.location)}}
      {${escapeLatex(edu.degree)}${edu.field ? `, ${escapeLatex(edu.field)}` : ''}${edu.gpa ? ` (GPA: ${escapeLatex(edu.gpa)})` : ''}}{${formatMonthYear(edu.graduationDate)}}`).join('\n')}
  \\resumeSubHeadingListEnd
`;
  }

  let experienceSection = '';
  if (data.sectionVisibility.experience && data.experience.length > 0) {
    experienceSection = `
%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
${data.experience.map(exp => `    \\resumeSubheading
      {${escapeLatex(exp.position)}}{${formatMonthYear(exp.startDate)}${exp.endDate ? ` -- ${formatMonthYear(exp.endDate)}` : ''}}
      {${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}
      \\resumeItemListStart
${exp.bullets.map(b => `        \\resumeItem{${escapeLatex(b)}}`).join('\n')}
      \\resumeItemListEnd`).join('\n')}
  \\resumeSubHeadingListEnd
`;
  }

  let projectSection = '';
  if (data.sectionVisibility.projects && data.projects.length > 0) {
    projectSection = `
%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
${data.projects.map(proj => `      \\resumeProjectHeading
          {${formatJakeProjectLinks(proj)}}{}
          \\resumeItemListStart
${proj.bullets.map(b => `            \\resumeItem{${escapeLatex(b)}}`).join('\n')}
          \\resumeItemListEnd`).join('\n')}
    \\resumeSubHeadingListEnd
`;
  }

  let skillsSection = '';
  if (data.sectionVisibility.skills && data.rawSkills.length > 0) {
    skillsSection = `
%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Skills}{: ${data.rawSkills.map(s => escapeLatex(s)).join(', ')}}
    }}
 \\end{itemize}
`;
  }

  const sectionsMap: Record<string, string> = {
    summary: summarySection,
    education: educationSection,
    experience: experienceSection,
    projects: projectSection,
    skills: skillsSection,
  };
  const bodySections = data.sectionOrder.map(k => sectionsMap[k] || '').filter(Boolean).join('\n');

  return `%-------------------------
% Resume in Latex
% Author : Jake Gutierrez
% License : MIT
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\ifdefined\\pdfgentounicode
\\input{glyphtounicode}
\\pdfgentounicode=1
\\fi

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(data.name)}} \\\\ \\vspace{1pt}
    \\small ${headerLinks.join(' $|$ ')}
\\end{center}

${bodySections}

\\end{document}
`;
}

// ==========================================
// 2. Template: FAANG Compact (f2.txt)
// ==========================================
function renderFaangTemplate(data: CanonicalResumeData): string {
  const addressLine1 = [data.phone, data.location].filter(Boolean).map(escapeLatex).join(' \\\\ ');
  const addressLinks: string[] = [];
  if (data.email) addressLinks.push(`\\href{mailto:${escapeLatexUrl(data.email)}}{${escapeLatex(data.email)}}`);
  if (data.linkedin) addressLinks.push(`\\href{${escapeLatexUrl(data.linkedin)}}{${escapeLatex(data.linkedin.replace(/^https?:\/\/(www\.)?/, ''))}}`);
  if (data.github) addressLinks.push(`\\href{${escapeLatexUrl(data.github)}}{${escapeLatex(data.github.replace(/^https?:\/\/(www\.)?/, ''))}}`);
  if (data.website) addressLinks.push(`\\href{${escapeLatexUrl(data.website)}}{${escapeLatex(data.website.replace(/^https?:\/\/(www\.)?/, ''))}}`);

  let summarySection = '';
  if (data.sectionVisibility.summary && data.summary) {
    summarySection = `
\\begin{rSection}{OBJECTIVE}
${escapeLatex(data.summary)}
\\end{rSection}
`;
  }

  let educationSection = '';
  if (data.sectionVisibility.education && data.education.length > 0) {
    educationSection = `
\\begin{rSection}{Education}
${data.education.map(edu => `{\\bf ${escapeLatex(edu.degree)}${edu.field ? `, ${escapeLatex(edu.field)}` : ''}}, ${escapeLatex(edu.institution)} \\hfill {${formatMonthYear(edu.graduationDate)}}\\\\
${edu.gpa ? `GPA: ${escapeLatex(edu.gpa)}\\\\` : ''}`).join('\n')}
\\end{rSection}
`;
  }

  let skillsSection = '';
  if (data.sectionVisibility.skills && data.rawSkills.length > 0) {
    skillsSection = `
\\begin{rSection}{SKILLS}
\\begin{tabular}{ @{} >{\\bfseries}l @{\\hspace{6ex}} l }
Technical Skills & ${data.rawSkills.map(s => escapeLatex(s)).join(', ')} \\\\
\\end{tabular}\\\\
\\end{rSection}
`;
  }

  let experienceSection = '';
  if (data.sectionVisibility.experience && data.experience.length > 0) {
    experienceSection = `
\\begin{rSection}{EXPERIENCE}
${data.experience.map(exp => `\\textbf{${escapeLatex(exp.position)}} \\hfill ${formatMonthYear(exp.startDate)}${exp.endDate ? ` - ${formatMonthYear(exp.endDate)}` : ''}\\\\
${escapeLatex(exp.company)} \\hfill \\textit{${escapeLatex(exp.location)}}
 \\begin{itemize}
    \\itemsep -3pt {}
${exp.bullets.map(b => `     \\item ${escapeLatex(b)}`).join('\n')}
 \\end{itemize}`).join('\n')}
\\end{rSection}
`;
  }

  let projectSection = '';
  if (data.sectionVisibility.projects && data.projects.length > 0) {
    projectSection = `
\\begin{rSection}{PROJECTS}
\\vspace{-1.25em}
${data.projects.map(proj => formatFaangProjectItem(proj)).join('\n')}
\\end{rSection}
`;
  }

  const sectionsMap: Record<string, string> = {
    summary: summarySection,
    education: educationSection,
    experience: experienceSection,
    projects: projectSection,
    skills: skillsSection,
  };
  const bodySections = data.sectionOrder.map(k => sectionsMap[k] || '').filter(Boolean).join('\n');

  return `\\documentclass{resume}

\\usepackage[left=0.4 in,top=0.4in,right=0.4 in,bottom=0.4in]{geometry}
\\usepackage[hidelinks]{hyperref}
\\newcommand{\\tab}[1]{\\hspace{.2667\\textwidth}\\rlap{#1}} 
\\newcommand{\\itab}[1]{\\hspace{0em}\\rlap{#1}}
\\name{${escapeLatex(data.name)}}
${addressLine1 ? `\\address{${addressLine1}}` : ''}
${addressLinks.length > 0 ? `\\address{${addressLinks.join(' \\\\ ')}}` : ''}

\\begin{document}

${bodySections}

\\end{document}
`;
}

// ==========================================
// 3. Template: Corporate Modern (f3.txt)
// ==========================================
function renderCorporateTemplate(data: CanonicalResumeData): string {
  let summarySection = '';
  if (data.sectionVisibility.summary && data.summary) {
    summarySection = `
%-----------Professional Summary-----------------
\\section{Professional Summary}
 \\resumeItemListStart
    \\resumeItem{Profile: }{${escapeLatex(data.summary)}}
 \\resumeItemListEnd
`;
  }

  let experienceSection = '';
  if (data.sectionVisibility.experience && data.experience.length > 0) {
    experienceSection = `
%-----------EXPERIENCE-----------------
\\section{Experience}
  \\resumeSubHeadingListStart
${data.experience.map(exp => `    \\resumeSubheading
      {${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}
      {${escapeLatex(exp.position)}}{${formatMonthYear(exp.startDate)}${exp.endDate ? ` -- ${formatMonthYear(exp.endDate)}` : ''}}
      \\resumeItemListStart
${exp.bullets.map(b => `        \\resumeItem{${escapeLatex(b)}}`).join('\n')}
      \\resumeItemListEnd`).join('\n')}
  \\resumeSubHeadingListEnd
`;
  }

  let skillsSection = '';
  if (data.sectionVisibility.skills && data.rawSkills.length > 0) {
    skillsSection = `
%--------PROGRAMMING SKILLS------------
\\section{Programming Skills}
 \\resumeSubHeadingListStart
   \\item{\\textbf{Skills}{: ${data.rawSkills.map(s => escapeLatex(s)).join(', ')}}}
 \\resumeSubHeadingListEnd
`;
  }

  let educationSection = '';
  if (data.sectionVisibility.education && data.education.length > 0) {
    educationSection = `
%-----------EDUCATION-----------------
\\section{Education}
  \\resumeSubHeadingListStart
${data.education.map(edu => `    \\resumeSubheading
      {${escapeLatex(edu.institution)}}{${escapeLatex(edu.location)}}
      {${escapeLatex(edu.degree)}${edu.field ? `, ${escapeLatex(edu.field)}` : ''}${edu.gpa ? `; GPA: ${escapeLatex(edu.gpa)}` : ''}}{${formatMonthYear(edu.graduationDate)}}`).join('\n')}
  \\resumeSubHeadingListEnd
`;
  }

  let projectSection = '';
  if (data.sectionVisibility.projects && data.projects.length > 0) {
    projectSection = `
%-----------PROJECTS-----------------
\\section{Projects}
  \\resumeSubHeadingListStart
${data.projects.map(proj => {
  const { title, subtitle } = formatCorporateProjectHeading(proj);
  return `    \\resumeSubheading
      {${title}}{}
      {\\emph{${subtitle}}}{}
      \\resumeItemListStart
${proj.bullets.map(b => `        \\resumeItem{${escapeLatex(b)}}`).join('\n')}
      \\resumeItemListEnd`;
}).join('\n')}
  \\resumeSubHeadingListEnd
`;
  }

  const sectionsMap: Record<string, string> = {
    summary: summarySection,
    education: educationSection,
    experience: experienceSection,
    projects: projectSection,
    skills: skillsSection,
  };
  const bodySections = data.sectionOrder.map(k => sectionsMap[k] || '').filter(Boolean).join('\n');

  return `%-------------------------
% Resume in Latex
% Author : Vidushi Wahal
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.375in}
\\addtolength{\\evensidemargin}{-0.375in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-5pt}
}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=*]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

%----------HEADING-----------------
\\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
  \\textbf{{\\Large ${escapeLatex(data.name)}}} & Email : \\href{mailto:${escapeLatexUrl(data.email)}}{${escapeLatex(data.email)}}\\\\
  ${data.location ? escapeLatex(data.location) : ''} & Mobile : ${escapeLatex(data.phone)}\\\\
\\end{tabular*}

${bodySections}

\\end{document}
`;
}

// ==========================================
// 4. Template: Executive Blue (f4.txt)
// ==========================================
function renderExecutiveTemplate(data: CanonicalResumeData): string {
  const headerParts: string[] = [];
  if (data.phone) headerParts.push(`{${escapeLatex(data.phone)}}`);
  if (data.email) headerParts.push(`\\href{mailto:${escapeLatexUrl(data.email)}}{\\color{blue}{${escapeLatex(data.email)}}}`);
  if (data.linkedin) headerParts.push(`\\href{${escapeLatexUrl(data.linkedin)}}{\\color{blue}{${escapeLatex(data.linkedin.replace(/^https?:\/\/(www\.)?/, ''))}}}`);
  if (data.github) headerParts.push(`\\href{${escapeLatexUrl(data.github)}}{\\color{blue}{${escapeLatex(data.github.replace(/^https?:\/\/(www\.)?/, ''))}}}`);
  if (data.website) headerParts.push(`\\href{${escapeLatexUrl(data.website)}}{\\color{blue}{${escapeLatex(data.website.replace(/^https?:\/\/(www\.)?/, ''))}}}`);

  let summarySection = '';
  if (data.sectionVisibility.summary && data.summary) {
    summarySection = `
%-----------SUMMARY-----------
\\section{\\color{airforceblue}SUMMARY}
 \\begin{itemize}[leftmargin=0in, label={}]
    \\small{\\item{${escapeLatex(data.summary)}}}
 \\end{itemize}
`;
  }

  let educationSection = '';
  if (data.sectionVisibility.education && data.education.length > 0) {
    educationSection = `
%-----------EDUCATION-----------
\\section{\\color{airforceblue}EDUCATION}
  \\resumeSubHeadingListStart
${data.education.map(edu => `    \\resumeSubheading
      {${escapeLatex(edu.institution)}}{${escapeLatex(edu.location)}}
      {${escapeLatex(edu.degree)}${edu.field ? `, ${escapeLatex(edu.field)}` : ''}${edu.gpa ? ` (GPA: ${escapeLatex(edu.gpa)})` : ''}}{${formatMonthYear(edu.graduationDate)}}`).join('\n')}
  \\resumeSubHeadingListEnd
`;
  }

  let skillsSection = '';
  if (data.sectionVisibility.skills && data.rawSkills.length > 0) {
    skillsSection = `
%-----------PROGRAMMING SKILLS-----------
\\section{\\color{airforceblue}TECHNICAL SKILLS}
 \\begin{itemize}[leftmargin=0in, label={}]
    \\small{\\item{
     \\textbf{\\normalsize{Skills:}}{ \\normalsize{${data.rawSkills.map(s => escapeLatex(s)).join(', ')}}}
    }}
 \\end{itemize}
`;
  }

  let experienceSection = '';
  if (data.sectionVisibility.experience && data.experience.length > 0) {
    experienceSection = `
%-----------EXPERIENCE-----------
\\section{\\color{airforceblue}EXPERIENCE}
  \\resumeSubHeadingListStart
${data.experience.map(exp => `    \\resumeSubheading
      {${escapeLatex(exp.position)}}{${formatMonthYear(exp.startDate)}${exp.endDate ? ` -- ${formatMonthYear(exp.endDate)}` : ''}}
      {${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}
      \\resumeItemListStart
${exp.bullets.map(b => `        \\resumeItem{${escapeLatex(b)}}`).join('\n')}
      \\resumeItemListEnd`).join('\n')}
  \\resumeSubHeadingListEnd
`;
  }

  let projectSection = '';
  if (data.sectionVisibility.projects && data.projects.length > 0) {
    projectSection = `
%-----------PROJECTS-----------
\\section{\\color{airforceblue}PROJECTS}
    \\resumeSubHeadingListStart
${data.projects.map(proj => `      \\resumeProjectHeading
          {${formatJakeProjectLinks(proj)}}{}
          \\resumeItemListStart
${proj.bullets.map(b => `            \\resumeItem{${escapeLatex(b)}}`).join('\n')}
          \\resumeItemListEnd`).join('\n')}
    \\resumeSubHeadingListEnd
`;
  }

  const sectionsMap: Record<string, string> = {
    summary: summarySection,
    education: educationSection,
    experience: experienceSection,
    projects: projectSection,
    skills: skillsSection,
  };
  const bodySections = data.sectionOrder.map(k => sectionsMap[k] || '').filter(Boolean).join('\n');

  return `%-------------------------
% Resume in Latex
% Author : Vaishanth
% License : MIT
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{multicol}
\\usepackage{graphicx}
\\setlength{\\multicolsep}{-3.0pt}
\\setlength{\\columnsep}{-1pt}
\\ifdefined\\pdfgentounicode
\\input{glyphtounicode}
\\pdfgentounicode=1
\\fi

\\usepackage{xcolor}

\\definecolor{cvblue}{HTML}{0E5484}
\\definecolor{black}{HTML}{130810}
\\definecolor{darkcolor}{HTML}{0F4539}
\\definecolor{cvgreen}{HTML}{3BD80D}
\\definecolor{taggreen}{HTML}{00E278}
\\definecolor{SlateGrey}{HTML}{2E2E2E}
\\definecolor{LightGrey}{HTML}{666666}

% serif
\\usepackage{charter}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.6in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.19in}
\\addtolength{\\topmargin}{-.7in}
\\addtolength{\\textheight}{1.4in}
\\urlstyle{same}

\\definecolor{airforceblue}{rgb}{0.36, 0.54, 0.66}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-1pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{\\large#1} & \\textbf{\\small #2} \\\\
      \\textit{\\large#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{1.001\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & \\textbf{\\small #2}\\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}[leftmargin=0.1in]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

\\begin{center}
    {\\huge ${escapeLatex(data.name)}} \\\\ \\vspace{2pt} 
    ${headerParts.join(' ~ \\small{-} ~ ')}
    \\vspace{-7pt}
\\end{center}

${bodySections}

\\end{document}
`;
}

// ==========================================
// 5. Template: Clean Tech Minimal (f5.txt)
// ==========================================
function renderMinimalTemplate(data: CanonicalResumeData): string {
  let summarySection = '';
  if (data.sectionVisibility.summary && data.summary) {
    summarySection = `
\\begin{ResumeSection}{summary}
    \\begin{ResumeSubsection}{org=Profile}
        \\begin{itemize}
            \\item ${escapeLatex(data.summary)}
        \\end{itemize}
    \\end{ResumeSubsection}
\\end{ResumeSection}
`;
  }

  let skillsSection = '';
  if (data.sectionVisibility.skills && data.rawSkills.length > 0) {
    skillsSection = `
\\begin{ResumeSection}{skills}
    \\newcommand{\\skill}[2]{\\textbf{#1} - #2}
    \\begin{ResumeSubsection}{org=Technical Competencies}
        \\begin{itemize}
            \\item \\skill{Skills}{${data.rawSkills.map(s => escapeLatex(s)).join(', ')}}
        \\end{itemize}
    \\end{ResumeSubsection}
\\end{ResumeSection}
`;
  }

  let experienceSection = '';
  if (data.sectionVisibility.experience && data.experience.length > 0) {
    experienceSection = `
\\begin{ResumeSection}{experience}
${data.experience.map(exp => `    \\begin{ResumeSubsection}{org={${escapeLatex(exp.company)}},position={${escapeLatex(exp.position)}},duration={${formatMonthYear(exp.startDate)}${exp.endDate ? ` -- ${formatMonthYear(exp.endDate)}` : ''}}}
        \\begin{itemize}
${exp.bullets.map(b => `            \\item ${escapeLatex(b)}`).join('\n')}
        \\end{itemize}
    \\end{ResumeSubsection}`).join('\n')}
\\end{ResumeSection}
`;
  }

  let educationSection = '';
  if (data.sectionVisibility.education && data.education.length > 0) {
    educationSection = `
\\begin{ResumeSection}{education}
${data.education.map(edu => `    \\begin{ResumeSubsection}{org={${escapeLatex(edu.institution)}},position={${escapeLatex(edu.degree)}${edu.field ? ` in ${escapeLatex(edu.field)}` : ''}},duration={${formatMonthYear(edu.graduationDate)}}}
        \\begin{itemize}
            ${edu.gpa ? `\\item GPA: ${escapeLatex(edu.gpa)}` : '\\item Completed coursework and degree requirements.'}
        \\end{itemize}
    \\end{ResumeSubsection}`).join('\n')}
\\end{ResumeSection}
`;
  }

  let projectSection = '';
  if (data.sectionVisibility.projects && data.projects.length > 0) {
    projectSection = `
\\begin{ResumeSection}{projects}
    \\begin{itemize}
${data.projects.map(proj => {
  const links: string[] = [];
  if (proj.githubUrl) links.push(`\\href{${escapeLatexUrl(proj.githubUrl)}}{\\underline{GitHub}}`);
  if (proj.liveUrl) links.push(`\\href{${escapeLatexUrl(proj.liveUrl)}}{\\underline{Live Demo}}`);
  if (!proj.githubUrl && !proj.liveUrl && proj.link) links.push(`\\href{${escapeLatexUrl(proj.link)}}{\\underline{Link}}`);
  const linksStr = links.length > 0 ? ` (${links.join(', ')})` : '';
  return `        \\item \\textbf{${escapeLatex(proj.name)}}${linksStr}: ${proj.bullets.map(b => escapeLatex(b)).join(' ')}`;
}).join('\n')}
    \\end{itemize}
\\end{ResumeSection}
`;
  }

  const sectionsMap: Record<string, string> = {
    summary: summarySection,
    education: educationSection,
    experience: experienceSection,
    projects: projectSection,
    skills: skillsSection,
  };
  const bodySections = data.sectionOrder.map(k => sectionsMap[k] || '').filter(Boolean).join('\n');

  return `\\documentclass{resume}
\\usepackage[hidelinks]{hyperref}

\\name{${escapeLatex(data.name)}}
${data.phone ? `\\contact{\\href{tel:${escapeLatexUrl(data.phone)}}{${escapeLatex(data.phone)}}}` : ''}
${data.email ? `\\contact{\\href{mailto:${escapeLatexUrl(data.email)}}{${escapeLatex(data.email)}}}` : ''}
${data.github ? `\\contact{\\href{${escapeLatexUrl(data.github)}}{${escapeLatex(data.github.replace(/^https?:\/\/(www\.)?/, ''))}}}` : ''}
${data.linkedin ? `\\contact{\\href{${escapeLatexUrl(data.linkedin)}}{${escapeLatex(data.linkedin.replace(/^https?:\/\/(www\.)?/, ''))}}}` : ''}

\\begin{document}
\\makeheader

${bodySections}

\\end{document}
`;
}

