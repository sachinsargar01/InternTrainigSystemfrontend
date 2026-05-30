import { motion } from "framer-motion";
import { ShieldCheck, GraduationCap, Users, Check } from "lucide-react";

export default function Roles() {
  const roles = [
    {
      name: "Administrator",
      description:
        "Complete control over the platform and organization structure.",
      icon: ShieldCheck,
      features: [
        "Create and manage training batches",
        "Onboard and assign mentors",
        "Manage intern accounts and access",
        "Define mentor-intern relationships",
      ],
      color: "teal",
      bgColor: "bg-teal-500",
      lightBg: "bg-teal-50",
      textColor: "text-teal-700",
      borderColor: "border-teal-200",
      iconColor: "text-teal-600",
    },
    {
      name: "Mentor",
      description:
        "Direct supervision and guidance of assigned intern batches.",
      icon: GraduationCap,
      features: [
        "Create and assign specific tasks",
        "Upload exclusive training materials",
        "Schedule 1-on-1 and group meetings",
        "Create tests and review submissions",
      ],
      color: "teal",
      bgColor: "bg-teal-500",
      lightBg: "bg-teal-50",
      textColor: "text-teal-700",
      borderColor: "border-teal-200",
      iconColor: "text-teal-600",
      featured: true, // Highlights the middle card
    },
    {
      name: "Intern",
      description:
        "Focused environment for learning, tracking progress, and performing.",
      icon: Users,
      features: [
        "View assigned tasks and submit work",
        "Access structured training videos",
        "Join scheduled mentoring sessions",
        "Attempt tests and view performance",
      ],
      color: "teal",
      bgColor: "bg-teal-500",
      lightBg: "bg-teal-50",
      textColor: "text-teal-700",
      borderColor: "border-teal-200",
      iconColor: "text-teal-600",
    },
  ];

  return (
    <section
      id="roles"
      className="bg-slate-50 py-24 sm:py-32 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden bg-white/50 ring-1 ring-slate-900/5 sm:w-[50rem]">
        <svg
          className="absolute inset-0 h-full w-full stroke-slate-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="pattern-roles"
              width={200}
              height={200}
              x="100%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M130 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#pattern-roles)"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-base font-semibold leading-7 text-teal-600 tracking-wide uppercase">
              Role-Based Access
            </h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Tailored experiences for everyone
            </p>
            <p className="mt-4 text-lg text-slate-600">
              InternHub provides dedicated, secure workflows and interfaces
              specifically designed for Administrators, Mentors, and Interns.
            </p>
          </motion.div>
        </div>

        <div className="isolate mx-auto grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <motion.div
                key={role.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`relative flex flex-col rounded-3xl bg-white p-8 xl:p-10 shadow-sm ring-1 ring-slate-200 hover:shadow-xl transition-all duration-300 group ${
                  role.featured
                    ? "lg:z-10 lg:-mt-4 lg:-mb-4 lg:shadow-md ring-2 ring-teal-200"
                    : ""
                }`}
              >
                {/* Header Section */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`p-3 rounded-xl ${role.lightBg} border ${role.borderColor} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`h-6 w-6 ${role.iconColor}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {role.name}
                  </h3>
                </div>

                <p className="text-sm leading-6 text-slate-600 mb-8 border-b border-slate-100 pb-8">
                  {role.description}
                </p>

                {/* Features List */}
                <ul className="mt-2 space-y-4 flex-1">
                  {role.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-x-3 text-sm leading-6 text-slate-700"
                    >
                      <Check
                        className={`h-6 w-5 flex-none ${role.textColor}`}
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Decorative Bottom Bar */}
                <div
                  className={`absolute bottom-0 inset-x-0 h-1 rounded-b-3xl ${role.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
