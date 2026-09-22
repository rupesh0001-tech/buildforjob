import { escapeLatex, escapeLatexUrl } from './latex-escaper.util';

export interface CanonicalCoverLetterData {
  fullName: string;
  firstName: string;
  lastName: string;
  profession: string;
  address: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  website: string;
  date: string;
  managerName: string;
  teamName: string;
  companyName: string;
  salutation: string;
  mode: 'structured' | 'manual';
  paragraphs: string[];
  signOff: string;
  accentColor: string;
}

export function normalizeCoverLetterData(input: any): CanonicalCoverLetterData {
  const content = input?.content || input || {};
  const personal = content.personalInfo || content.personal_info || content.personalInfoData || {};
  const employer = content.employerInfo || content.employer_info || {};
  const body = content.body || {};

  // Resolve Name
  let fullName = personal.fullName || personal.full_name || '';
  if (!fullName && (personal.firstName || personal.lastName)) {
    fullName = `${personal.firstName || ''} ${personal.lastName || ''}`.trim();
  }

  const nameParts = fullName ? fullName.split(' ') : [];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Paragraphs
  const mode = content.mode || 'structured';
  let paragraphs: string[] = [];

  if (mode === 'manual' && content.manualContent) {
    paragraphs = content.manualContent
      .split('\n\n')
      .map((p: string) => p.trim())
      .filter((p: string) => p.length > 0);
  } else if (body) {
    const rawParas = [
      body.intro,
      body.body1,
      body.body2,
      body.body3,
      body.conclusion,
    ].filter(Boolean);

    paragraphs = rawParas.map((p: string) => p.trim()).filter((p: string) => p.length > 0);
  }

  return {
    fullName: fullName || '',
    firstName,
    lastName,
    profession: personal.profession || personal.jobTitle || '',
    address: personal.address || personal.location || '',
    phone: personal.phone || '',
    email: personal.email || '',
    linkedin: personal.linkedin || '',
    github: personal.github || '',
    website: personal.website || '',
    date: content.date || '',
    managerName: employer.managerName || employer.manager_name || '',
    teamName: employer.teamName || employer.team_name || '',
    companyName: employer.companyName || employer.company_name || '',
    salutation: content.salutation || '',
    mode,
    paragraphs,
    signOff: content.signOff || content.sign_off || '',
    accentColor: content.accentColor || '#0E5484',
  };
}

export interface CoverLetterLatexTemplate {
  id: string;
  name: string;
  description: string;
  render: (data: CanonicalCoverLetterData) => string;
}

// 1. Executive Header Column Template (Based on l2.txt)
const executiveTemplate: CoverLetterLatexTemplate = {
  id: 'latex-executive',
  name: 'Executive Professional',
  description: 'Clean header columns with contact metadata and bold header accent',
  render: (data) => {
    const name = escapeLatex(data.fullName);
    const profession = escapeLatex(data.profession);
    const phone = escapeLatex(data.phone);
    const email = escapeLatex(data.email);
    const emailUrl = escapeLatexUrl(data.email);
    const linkedin = escapeLatex(data.linkedin.replace(/^https?:\/\/(www\.)?/, ''));
    const linkedinUrl = escapeLatexUrl(data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`);
    const github = escapeLatex(data.github.replace(/^https?:\/\/(www\.)?/, ''));
    const githubUrl = escapeLatexUrl(data.github.startsWith('http') ? data.github : `https://${data.github}`);
    const date = escapeLatex(data.date);
    const company = escapeLatex(data.companyName);
    const manager = escapeLatex(data.managerName);
    const team = escapeLatex(data.teamName);
    const salutation = escapeLatex(data.salutation);
    const signOff = escapeLatex(data.signOff);
    const accentHex = data.accentColor.replace('#', '') || '204097';

    const hasHeader = Boolean(name || profession || phone || email || linkedin || github);
    const hasRecipient = Boolean(company || manager || team);
    const paras = data.paragraphs.map(p => escapeLatex(p)).join('\n\n\\vspace{0.2cm}\n');

    return `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=1in]{geometry}
\\usepackage[usenames,dvipsnames]{xcolor}
\\usepackage[hidelinks]{hyperref}
\\usepackage{parskip}

\\definecolor{UI_blue}{HTML}{${accentHex}}

\\begin{document}

${hasHeader ? `\\noindent
\\begin{tabular*}{\\textwidth}{@{\\extracolsep{\\fill}} l c r}
\\begin{tabular}[t]{@{}l@{}}
${phone ? `\\small ${phone} \\\\` : ''}
${email ? `\\small \\href{mailto:${emailUrl}}{${email}}` : ''}
\\end{tabular}
&
\\begin{tabular}[t]{@{}c@{}}
${name ? `{\\Huge \\textbf{${name}}} \\\\[2pt]` : ''}
${profession ? `{\\color{UI_blue} \\large \\textbf{${profession}}}` : ''}
\\end{tabular}
&
\\begin{tabular}[t]{@{}r@{}}
${linkedin ? `\\small \\href{${linkedinUrl}}{${linkedin}} \\\\` : ''}
${github ? `\\small \\href{${githubUrl}}{${github}}` : ''}
\\end{tabular}
\\end{tabular*}

\\vspace{4pt}
{\\color{UI_blue}\\hrule height 1.5pt}

\\vspace{16pt}` : ''}

${date ? `\\noindent ${date}\n\\vspace{12pt}` : ''}

${hasRecipient ? `\\noindent ${company ? `\\textbf{${company}} \\\\` : ''}
${manager ? `${manager} \\\\` : ''}
${team ? `${team} \\\\` : ''}
\\vspace{14pt}` : ''}

${salutation ? `\\noindent ${salutation}\n\\vspace{8pt}` : ''}

${paras ? `${paras}\n\\vspace{20pt}` : ''}

${signOff || name ? `\\noindent ${signOff || ''} ${signOff && name ? `\\\\[24pt]` : ''}
${name ? `\\textbf{${name}}` : ''}` : ''}

${!hasHeader && !date && !hasRecipient && !salutation && !paras && !signOff && !name ? `\\vspace*{\\fill}\\begin{center}\\textcolor{gray!40}{\\textit{Empty Cover Letter Draft}}\\end{center}\\vspace*{\\fill}` : ''}

\\end{document}
`;
  }
};

// 2. ModernCV Style Template (Based on l1.txt)
const moderncvTemplate: CoverLetterLatexTemplate = {
  id: 'latex-moderncv',
  name: 'ModernCV Casual',
  description: 'Contemporary European standard with clean header and recipient alignment',
  render: (data) => {
    const firstName = escapeLatex(data.firstName);
    const lastName = escapeLatex(data.lastName);
    const profession = escapeLatex(data.profession);
    const address = escapeLatex(data.address);
    const phone = escapeLatex(data.phone);
    const email = escapeLatex(data.email);
    const linkedin = escapeLatex(data.linkedin.replace(/^https?:\/\/(www\.)?/, ''));
    const linkedinUrl = escapeLatexUrl(data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`);
    const date = escapeLatex(data.date);
    const company = escapeLatex(data.companyName);
    const manager = escapeLatex(data.managerName);
    const team = escapeLatex(data.teamName);
    const salutation = escapeLatex(data.salutation);
    const signOff = escapeLatex(data.signOff);

    const paras = data.paragraphs.map(p => escapeLatex(p)).join('\n\n');
    const hasRecipient = Boolean(manager || company || team);

    return `\\documentclass[11pt,a4paper,sans]{moderncv}
\\moderncvstyle{casual}
\\moderncvcolor{blue}
\\usepackage[utf8]{inputenc}
\\usepackage[scale=0.75]{geometry}

\\name{${firstName || '~'}}{${lastName || '~'}}
${profession ? `\\title{${profession}}` : ''}
${address ? `\\address{${address}}{}{}` : ''}
${phone ? `\\phone[mobile]{${phone}}` : ''}
${email ? `\\email{${email}}` : ''}
${linkedin ? `\\extrainfo{\\href{${linkedinUrl}}{${linkedin}}}` : ''}

\\begin{document}
${hasRecipient ? `\\recipient{${manager || ''}}{${company || ''}${team ? ` \\\\ ${team}` : ''}}` : '\\recipient{~}{~}'}
${date ? `\\date{${date}}` : '\\date{~}'}
${salutation ? `\\opening{${salutation}}` : '\\opening{~}'}
${signOff ? `\\closing{${signOff}}` : '\\closing{~}'}
\\makelettertitle

${paras || '~'}

\\makeletterclosing
\\end{document}
`;
  }
};

// 3. Classic Minimal / Academic Template (Based on l3.txt)
const classicTemplate: CoverLetterLatexTemplate = {
  id: 'latex-classic',
  name: 'Classic Minimalist',
  description: 'Timeless Harvard-style centered header with elegant typography',
  render: (data) => {
    const name = escapeLatex(data.fullName);
    const address = escapeLatex(data.address);
    const phone = escapeLatex(data.phone);
    const email = escapeLatex(data.email);
    const emailUrl = escapeLatexUrl(data.email);
    const linkedin = escapeLatex(data.linkedin.replace(/^https?:\/\/(www\.)?/, ''));
    const linkedinUrl = escapeLatexUrl(data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`);
    const date = escapeLatex(data.date);
    const company = escapeLatex(data.companyName);
    const manager = escapeLatex(data.managerName);
    const team = escapeLatex(data.teamName);
    const salutation = escapeLatex(data.salutation);
    const signOff = escapeLatex(data.signOff);

    const contactItems = [
      address,
      phone,
      email ? `\\href{mailto:${emailUrl}}{${email}}` : '',
      linkedin ? `\\href{${linkedinUrl}}{${linkedin}}` : ''
    ].filter(Boolean);

    const hasHeader = Boolean(name || contactItems.length > 0);
    const hasRecipient = Boolean(manager || company || team);
    const paras = data.paragraphs.map(p => escapeLatex(p)).join('\n\n\\vspace{0.2cm}\n');

    return `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=1in]{geometry}
\\usepackage[hidelinks]{hyperref}
\\usepackage{xcolor}
\\usepackage{parskip}

\\begin{document}

${hasHeader ? `\\begin{center}
  ${name ? `{\\Large \\textbf{${name}}} \\\\[4pt]` : ''}
  ${contactItems.length > 0 ? `\\small ${contactItems.join(' \\ \\textbullet\\ ')}\n  \\vspace{8pt}` : ''}
  \\hrule
\\end{center}\n\\vspace{12pt}` : ''}

${date ? `\\noindent ${date}\n\\vspace{12pt}` : ''}

${hasRecipient ? `\\noindent ${manager ? `\\textbf{${manager}} \\\\` : ''}
${team ? `${team} \\\\` : ''}
${company ? `${company}\n` : ''}
\\vspace{12pt}` : ''}

${salutation ? `\\noindent ${salutation}\n\\vspace{8pt}` : ''}

${paras ? `${paras}\n\\vspace{18pt}` : ''}

${signOff || name ? `\\noindent ${signOff || ''} ${signOff && name ? `\\\\[24pt]` : ''}
${name ? `\\textbf{${name}}` : ''}` : ''}

${!hasHeader && !date && !hasRecipient && !salutation && !paras && !signOff && !name ? `\\vspace*{\\fill}\\begin{center}\\textcolor{gray!40}{\\textit{Empty Cover Letter Draft}}\\end{center}\\vspace*{\\fill}` : ''}

\\end{document}
`;
  }
};

// 4. Tech / Modern Corporate Accent Template
const techModernTemplate: CoverLetterLatexTemplate = {
  id: 'latex-tech',
  name: 'Modern Tech Accent',
  description: 'Bold colored accent bar with structured metadata for tech applicants',
  render: (data) => {
    const name = escapeLatex(data.fullName);
    const profession = escapeLatex(data.profession);
    const address = escapeLatex(data.address);
    const phone = escapeLatex(data.phone);
    const email = escapeLatex(data.email);
    const emailUrl = escapeLatexUrl(data.email);
    const linkedin = escapeLatex(data.linkedin.replace(/^https?:\/\/(www\.)?/, ''));
    const linkedinUrl = escapeLatexUrl(data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`);
    const github = escapeLatex(data.github.replace(/^https?:\/\/(www\.)?/, ''));
    const githubUrl = escapeLatexUrl(data.github.startsWith('http') ? data.github : `https://${data.github}`);
    const date = escapeLatex(data.date);
    const company = escapeLatex(data.companyName);
    const manager = escapeLatex(data.managerName);
    const team = escapeLatex(data.teamName);
    const salutation = escapeLatex(data.salutation);
    const signOff = escapeLatex(data.signOff);
    const accentHex = data.accentColor.replace('#', '') || '0E5484';

    const contactItems = [
      email ? `\\href{mailto:${emailUrl}}{${email}}` : '',
      phone,
      address,
      linkedin ? `\\href{${linkedinUrl}}{${linkedin}}` : '',
      github ? `\\href{${githubUrl}}{${github}}` : ''
    ].filter(Boolean);

    const hasHeader = Boolean(name || profession || contactItems.length > 0);
    const hasRecipient = Boolean(manager || company || team);
    const paras = data.paragraphs.map(p => escapeLatex(p)).join('\n\n\\vspace{0.25cm}\n');

    return `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=1in]{geometry}
\\usepackage[hidelinks]{hyperref}
\\usepackage{xcolor}
\\usepackage{parskip}

\\definecolor{brandColor}{HTML}{${accentHex}}

\\begin{document}

${hasHeader ? `{\\color{brandColor}\\rule{\\linewidth}{3pt}}
\\vspace{8pt}

${name ? `{\\LARGE \\textbf{${name}}} \\\\` : ''}
${profession ? `{\\color{brandColor} \\large \\textbf{${profession}}} \\\\[4pt]` : ''}
${contactItems.length > 0 ? `\\small ${contactItems.join(' \\ $|$ \\ ')}\n\\vspace{14pt}` : ''}` : ''}

${date ? `\\noindent \\textbf{Date:} ${date}\n\\vspace{10pt}` : ''}

${hasRecipient ? `\\noindent \\textbf{To:} \\\\
${manager ? `${manager} \\\\` : ''}
${team ? `${team} \\\\` : ''}
${company ? `\\textbf{${company}}\n` : ''}
\\vspace{12pt}` : ''}

${salutation ? `\\noindent \\textbf{${salutation}}\n\\vspace{8pt}` : ''}

${paras ? `${paras}\n\\vspace{18pt}` : ''}

${signOff || name ? `\\noindent ${signOff || ''} ${signOff && name ? `\\\\[20pt]` : ''}
${name ? `\\textbf{${name}}` : ''}` : ''}

${!hasHeader && !date && !hasRecipient && !salutation && !paras && !signOff && !name ? `\\vspace*{\\fill}\\begin{center}\\textcolor{gray!40}{\\textit{Empty Cover Letter Draft}}\\end{center}\\vspace*{\\fill}` : ''}

\\end{document}
`;
  }
};

export const COVER_LETTER_LATEX_TEMPLATES: Record<string, CoverLetterLatexTemplate> = {
  'latex-executive': executiveTemplate,
  'latex-moderncv': moderncvTemplate,
  'latex-classic': classicTemplate,
  'latex-tech': techModernTemplate,
  // Aliases for legacy or simplified identifiers
  'executive': executiveTemplate,
  'modern': moderncvTemplate,
  'moderncv': moderncvTemplate,
  'classic': classicTemplate,
  'tech': techModernTemplate,
};

export function getCoverLetterTemplate(templateId?: string): CoverLetterLatexTemplate {
  if (!templateId) return executiveTemplate;
  const normalized = templateId.toLowerCase().trim();
  return COVER_LETTER_LATEX_TEMPLATES[normalized] || COVER_LETTER_LATEX_TEMPLATES[`latex-${normalized}`] || executiveTemplate;
}
