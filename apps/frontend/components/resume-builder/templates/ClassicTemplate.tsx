import { Mail, Phone, MapPin, Linkedin, Globe } from '@/lib/icons';
import { TemplateProps } from "@/types/resume";

const ClassicTemplate = ({ data, accentColor }: TemplateProps) => {
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        const parts = dateStr.split("-");
        if (parts.length === 1) {
            const y = parseInt(parts[0]);
            if (isNaN(y)) return dateStr;
            return parts[0];
        }
        const [year, month] = parts;
        const y = parseInt(year);
        const m = parseInt(month);
        if (isNaN(y) || isNaN(m)) return dateStr;
        return new Date(y, m - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short"
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white text-gray-800 leading-relaxed">
            {/* Header */}
            <header className="text-center mb-8 pb-6 border-b-2" style={{ borderColor: accentColor }}>
                <h1 className="text-3xl font-bold mb-2" style={{ color: accentColor }}>
                    {data.personal_info?.full_name || "Your Name"}
                </h1>

                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                    {data.personal_info?.email && (
                        <div className="flex items-center gap-1">
                            <Mail className="size-4" />
                            <a href={`mailto:${data.personal_info.email}`} className="hover:underline hover:text-black">
                                {data.personal_info.email}
                            </a>
                        </div>
                    )}
                    {data.personal_info?.phone && (
                        <div className="flex items-center gap-1">
                            <Phone className="size-4" />
                            <a href={`tel:${data.personal_info.phone}`} className="hover:underline hover:text-black">
                                {data.personal_info.phone}
                            </a>
                        </div>
                    )}
                    {data.personal_info?.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="size-4" />
                            <span>{data.personal_info.location}</span>
                        </div>
                    )}
                    {data.personal_info?.linkedin && (
                        <div className="flex items-center gap-1">
                            <Linkedin className="size-4" />
                            <a
                                href={data.personal_info.linkedin.startsWith("http") ? data.personal_info.linkedin : `https://${data.personal_info.linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline hover:text-black break-all"
                            >
                                {data.personal_info.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}
                            </a>
                        </div>
                    )}
                    {data.personal_info?.website && (
                        <div className="flex items-center gap-1">
                            <Globe className="size-4" />
                            <a
                                href={data.personal_info.website.startsWith("http") ? data.personal_info.website : `https://${data.personal_info.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline hover:text-black break-all"
                            >
                                {data.personal_info.website}
                            </a>
                        </div>
                    )}
                </div>
            </header>

            {/* Professional Summary */}
            {data.sectionVisibility.summary && data.professional_summary && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-3 uppercase tracking-wider" style={{ color: accentColor }}>
                        Professional Summary
                    </h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{data.professional_summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.sectionVisibility.experience && data.experience && data.experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4 uppercase tracking-wider" style={{ color: accentColor }}>
                        Professional Experience
                    </h2>

                    <div className="space-y-6">
                        {data.experience.map((exp, index) => (
                            <div key={index} className="border-l-4 pl-4" style={{ borderColor: accentColor }}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg uppercase tracking-tight">{exp.position}</h3>
                                        <p className="text-gray-800 font-bold italic">{exp.company}</p>
                                    </div>
                                    <div className="text-right text-sm font-bold text-gray-600">
                                        <p>{formatDate(exp.startDate)} - {exp.is_current ? "Present" : formatDate(exp.endDate)}</p>
                                    </div>
                                </div>
                                {exp.description && (
                                    <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-1 text-sm">
                                        {exp.description.split("\n").filter(l => l.trim()).map((line, i) => (
                                            <li key={i}>{line}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {data.sectionVisibility.projects && data.project && data.project.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4 uppercase tracking-wider" style={{ color: accentColor }}>
                        Key Projects
                    </h2>

                    <div className="space-y-4">
                        {data.project.map((proj, index) => (
                            <div key={index} className="border-l-4 border-gray-200 pl-4 py-1">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-gray-800 uppercase tracking-tight">{proj.name}</h3>
                                    <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 rounded-full" style={{ color: accentColor }}>
                                        {proj.techStack}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {data.sectionVisibility.education && data.education && data.education.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4 uppercase tracking-wider" style={{ color: accentColor }}>
                        Education
                    </h2>

                    <div className="space-y-4">
                        {data.education.map((edu, index) => (
                            <div key={index} className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-900 uppercase">
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                    </h3>
                                    <p className="text-gray-700 font-medium italic">{edu.institution}</p>
                                    {edu.gpa && (
                                        <p className="text-sm font-bold text-gray-600">
                                            {edu.graduationType === "cgpa" ? "GPA" : "Percentage"}: {edu.gpa}
                                        </p>
                                    )}
                                </div>
                                <div className="text-sm font-bold text-gray-600">
                                    <p>{formatDate(edu.graduation_date)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.sectionVisibility.skills && data.skills && data.skills.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-3 uppercase tracking-wider" style={{ color: accentColor }}>
                        Technical Skills
                    </h2>

                    <div className="flex gap-x-6 gap-y-2 flex-wrap">
                        {data.skills.map((skill, index) => (
                            <div key={index} className="text-gray-700 font-medium flex items-center gap-2 capitalize">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                                {skill}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default ClassicTemplate;
