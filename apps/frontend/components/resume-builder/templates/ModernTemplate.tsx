import { Mail, Phone, MapPin, Linkedin, Globe } from '@/lib/icons';
import { TemplateProps } from "@/types/resume";

const ModernTemplate = ({ data, accentColor }: TemplateProps) => {
	
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
		<div className="max-w-4xl mx-auto bg-white text-gray-800">
			{/* Header */}
			<header className="p-8 text-white" style={{ backgroundColor: accentColor }}>
				<h1 className="text-4xl font-light mb-3">
					{data.personal_info?.full_name || "Your Name"}
				</h1>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm ">
					{data.personal_info?.email && (
						<div className="flex items-center gap-2">
							<Mail className="size-4" />
							<a href={`mailto:${data.personal_info.email}`} className="hover:underline text-white">
								{data.personal_info.email}
							</a>
						</div>
					)}
					{data.personal_info?.phone && (
						<div className="flex items-center gap-2">
							<Phone className="size-4" />
							<a href={`tel:${data.personal_info.phone}`} className="hover:underline text-white">
								{data.personal_info.phone}
							</a>
						</div>
					)}
					{data.personal_info?.location && (
						<div className="flex items-center gap-2">
							<MapPin className="size-4" />
							<span>{data.personal_info.location}</span>
						</div>
					)}
					{data.personal_info?.linkedin && (
						<a
							target="_blank"
							href={data.personal_info.linkedin.startsWith("http") ? data.personal_info.linkedin : `https://${data.personal_info.linkedin}`}
							rel="noopener noreferrer"
							className="flex items-center gap-2 hover:underline text-white"
						>
							<Linkedin className="size-4" />
							<span className="break-all text-xs">
								{data.personal_info.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}
							</span>
						</a>
					)}
					{data.personal_info?.website && (
						<a
							target="_blank"
							href={data.personal_info.website.startsWith("http") ? data.personal_info.website : `https://${data.personal_info.website}`}
							rel="noopener noreferrer"
							className="flex items-center gap-2 hover:underline text-white"
						>
							<Globe className="size-4" />
							<span className="break-all text-xs">
								{data.personal_info.website.replace(/^https?:\/\/(www\.)?/, "")}
							</span>
						</a>
					)}
				</div>
			</header>

			<div className="p-8">
				{/* Professional Summary */}
				{data.sectionVisibility.summary && data.professional_summary && (
					<section className="mb-8">
						<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200 uppercase tracking-wide">
							Professional Summary
						</h2>
						<p className="text-gray-700 whitespace-pre-line leading-relaxed">{data.professional_summary}</p>
					</section>
				)}

				{/* Experience */}
				{data.sectionVisibility.experience && data.experience && data.experience.length > 0 && (
					<section className="mb-8">
						<h2 className="text-2xl font-light mb-6 pb-2 border-b border-gray-200 uppercase tracking-wide">
							Experience
						</h2>

						<div className="space-y-6">
							{data.experience.map((exp, index) => (
								<div key={index} className="relative pl-6 border-l border-gray-200">

									<div className="flex justify-between items-start mb-2">
										<div>
											<h3 className="text-xl font-medium text-gray-900">{exp.position}</h3>
											<p className="font-medium" style={{ color: accentColor }}>{exp.company}</p>
										</div>
										<div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
											{formatDate(exp.startDate)} - {exp.is_current ? "Present" : formatDate(exp.endDate)}
										</div>
									</div>
									{exp.description && (
										<div className="text-gray-700 leading-relaxed mt-3 whitespace-pre-line">
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
					<section className="mb-8">
						<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200 uppercase tracking-wide">
							Projects
						</h2>

						<div className="space-y-6">
							{data.project.map((p, index) => (
								<div key={index} className="relative pl-6 border-l border-gray-200" style={{borderLeftColor: accentColor}}>
									<div className="flex justify-between items-start">
										<div>
											<h3 className="text-lg font-medium text-gray-900">{p.name}</h3>
											<p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: accentColor }}>{p.techStack}</p>
										</div>
									</div>
									{p.description && (
										<div className="text-gray-700 leading-relaxed text-sm mt-3">
											{p.description}
										</div>
									)}
								</div>
							))}
						</div>
					</section>
				)}

				<div className="grid sm:grid-cols-2 gap-8">
					{/* Education */}
					{data.sectionVisibility.education && data.education && data.education.length > 0 && (
						<section>
							<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200 uppercase tracking-wide">
								Education
							</h2>

							<div className="space-y-4">
								{data.education.map((edu, index) => (
									<div key={index}>
										<h3 className="font-semibold text-gray-900">
											{edu.degree} {edu.field && `in ${edu.field}`}
										</h3>
										<p style={{ color: accentColor }}>{edu.institution}</p>
										<div className="flex justify-between items-center text-sm text-gray-600">
											<span>{formatDate(edu.graduation_date)}</span>
											{edu.gpa && <span>{edu.graduationType === "cgpa" ? "GPA" : "%"}: {edu.gpa}</span>}
										</div>
									</div>
								))}
							</div>
						</section>
					)}

					{/* Skills */}
					{data.sectionVisibility.skills && data.skills && data.skills.length > 0 && (
						<section>
							<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200 uppercase tracking-wide">
								Skills
							</h2>

							<div className="flex flex-wrap gap-2">
								{data.skills.map((skill, index) => (
									<span
										key={index}
										className="px-3 py-1 text-sm text-white rounded-full capitalize"
										style={{ backgroundColor: accentColor }}
									>
										{skill}
									</span>
								))}
							</div>
						</section>
					)}
				</div>
			</div>
		</div>
	);
}

export default ModernTemplate;
