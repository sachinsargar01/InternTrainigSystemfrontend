import { motion } from "framer-motion";
import { Users, BookOpen, GraduationCap, Target } from "lucide-react";

export default function Stats() {
  const stats = [
    { value: "500+", label: "Active Interns", icon: Users, delay: 0 },
    { value: "50+", label: "Expert Mentors", icon: GraduationCap, delay: 0.1 },
    { value: "100+", label: "Training Modules", icon: BookOpen, delay: 0.2 },
    { value: "95%", label: "Completion Rate", icon: Target, delay: 0.3 },
  ];

  return (
    <section className="bg-white py-16 sm:py-24 border-y border-slate-100 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600">
              Trusted by growing teams worldwide
            </h2>
          </div>
          
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4 sm:grid-cols-2">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: stat.delay, ease: "easeOut" }}
                  className="mx-auto flex max-w-xs flex-col gap-y-4 group"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 group-hover:bg-teal-100 transition-colors duration-300">
                    <Icon className="h-6 w-6 text-teal-600" aria-hidden="true" />
                  </div>
                  <dt className="text-base leading-7 text-slate-600">{stat.label}</dt>
                  <dd className="order-first text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl group-hover:text-teal-600 transition-colors duration-300">
                    {stat.value}
                  </dd>
                </motion.div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
