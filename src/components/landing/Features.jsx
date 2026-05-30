import { motion } from "framer-motion";
import {
  Video,
  CheckCircle2,
  FileText,
  Calendar,
  LineChart,
  BarChart3,
} from "lucide-react";

const features = [
  {
    title: "Training Management",
    description:
      "Upload and organize training videos with easy access for interns. Track viewing progress and completion rates.",
    icon: Video,
    color: "bg-blue-100/80 text-blue-600 border-blue-200",
  },
  {
    title: "Daily Tasks",
    description:
      "Assign daily tasks to interns, set deadlines, and review submissions with seamless feedback and scoring.",
    icon: CheckCircle2,
    color: "bg-teal-100/80 text-teal-600 border-teal-200",
  },
  {
    title: "Online Tests",
    description:
      "Create MCQ-based tests, schedule rigorous assessments, and automatically evaluate intern performance.",
    icon: FileText,
    color: "bg-indigo-100/80 text-indigo-600 border-indigo-200",
  },
  {
    title: "Meeting Management",
    description:
      "Schedule one-on-one or group meetings, send automated reminders, and easily integrate with video platforms.",
    icon: Calendar,
    color: "bg-rose-100/80 text-rose-600 border-rose-200",
  },
  {
    title: "Progress Tracking",
    description:
      "Deeply monitor intern progress with detailed analytics, performance reports, and visual metrics dashboards.",
    icon: LineChart,
    color: "bg-emerald-100/80 text-emerald-600 border-emerald-200",
  },
  {
    title: "Reports & Analytics",
    description:
      "Generate comprehensive reports on intern performance, precise attendance, and overall program effectiveness.",
    icon: BarChart3,
    color: "bg-violet-100/80 text-violet-600 border-violet-200",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function Features() {
  return (
    <section
      id="features"
      className="bg-white py-24 sm:py-32 overflow-hidden relative"
    >
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-base font-semibold leading-7 text-teal-600 tracking-wide uppercase">
              Everything in one place
            </h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Powerful tools for modern teams
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Stop juggling multiple tools. InternHub provides a comprehensive
              suite of features designed entirely to help you seamlessly manage
              and elevate your intern program.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
        >
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="flex flex-col bg-slate-50 rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 hover:bg-white transition-all duration-300 group"
                >
                  <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-slate-900">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border ${feature.color} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
                    >
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </motion.div>
              );
            })}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
