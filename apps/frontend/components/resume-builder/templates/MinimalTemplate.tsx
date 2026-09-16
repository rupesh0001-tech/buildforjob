import { TemplateProps } from "@/types/resume";

const MinimalTemplate = ({ data, accentColor }: TemplateProps) => {
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
        <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 font-light">
            {/* Header */}
            <header className="mb-10">
                <h1 className="text-4xl font-thin mb-4 tracking-wide">
                    {data.personal_info?.full_name || "Your Name"}
                </h1>

                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                    {data.personal_info?.email && (
                        <a href={`mailto:${data.personal_info.email}`} className="hover:underline hover:text-black">
                            {data.personal_info.email}
                        </a>
                    )}
                    {data.personal_info?.phone && (
                        <a href={`tel:${data.personal_info.phone}`} className="hover:underline hover:text-black">
                            {data.personal_info.phone}
                        </a>
                    )}
                    {data.personal_info?.location && <span>{data.personal_info.location}</span>}
                    {data.personal_info?.linkedin && (
                        <a
                            href={data.personal_info.linkedin.startsWith("http") ? data.personal_info.linkedin : `https://${data.personal_info.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline hover:text-black break-all"
                        >
                            {data.personal_info.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}
                        </a>
                    )}
                    {data.personal_info?.website && (
                        <a
                            href={data.personal_info.website.startsWith("http") ? data.personal_info.website : `https://${data.personal_info.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline hover:text-black break-all"
                        >
                            {data.personal_info.website}
                        </a>
                    )}
                </div>
            </header>

            {/* Professional Summary */}
            {data.sectionVisibility.summary && data.professional_summary && (
                <section className="mb-10">
                    <p className=" text-gray-700 leading-relaxed whitespace-pre-line">
                        {data.professional_summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {data.sectionVisibility.experience && data.experience && data.experience.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-bold" style={{ color: accentColor }}>
                        Professional Experience
                    </h2>

                    <div className="space-y-8">
                        {data.experience.map((exp, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-xl font-medium tracking-tight text-gray-900">{exp.position}</h3>
                                    <span className="text-sm text-gray-500 font-medium">
                                        {formatDate(exp.startDate)} - {exp.is_current ? "Present" : formatDate(exp.endDate)}
                                    </span>
                                </div>
                                <p className="text-gray-600 font-bold mb-3">{exp.company}</p>
                                {exp.description && (
                                    <div className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-line">
                                        {exp.description}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {data.sectionVisibility.projects && data.project && data.project.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-bold" style={{ color: accentColor }}>
                        Projects
                    </h2>

                    <div className="space-y-6">
                        {data.project.map((proj, index) => (
                            <div key={index} className="flex flex-col gap-1">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-lg font-medium text-gray-900">{proj.name}</h3>
                                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accentColor }}>{proj.techStack}</span>
                                </div>
                                <p className="text-[15px] text-gray-600 leading-relaxed">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {data.sectionVisibility.education && data.education && data.education.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-bold" style={{ color: accentColor }}>
                        Education
                    </h2>

                    <div className="space-y-6">
                        {data.education.map((edu, index) => (
                            <div key={index} className="flex justify-between items-baseline">
                                <div>
                                    <h3 className="font-medium text-gray-900">
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                    </h3>
                                    <p className="text-gray-600">{edu.institution}</p>
                                    {edu.gpa && (
                                        <p className="text-sm text-gray-500 font-bold">
                                            {edu.graduationType === "cgpa" ? "GPA" : "Percentage"}: {edu.gpa}
                                        </p>
                                    )}
                                </div>
                                <span className="text-sm text-gray-500 font-medium">
                                    {formatDate(edu.graduation_date)}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.sectionVisibility.skills && data.skills && data.skills.length > 0 && (
                <section>
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-bold" style={{ color: accentColor }}>
                        Skills
                    </h2>

                    <div className="text-gray-700 font-medium tracking-tight flex flex-wrap gap-x-2 gap-y-1">
                        {data.skills.map((skill, idx) => (
                            <span key={idx} className="capitalize">{skill}{idx < data.skills.length - 1 ? " • " : ""}</span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default MinimalTemplate;
