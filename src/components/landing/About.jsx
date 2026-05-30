import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, Zap } from "lucide-react";

export default function About() {
  const benefits = [
    {
      title: "Automated Onboarding",
      description:
        "Streamline the critical first 2 months of training with structured, automated curriculum delivery.",
      icon: Zap,
    },
    {
      title: "Reduced Mentor Load",
      description:
        "Free up your senior engineers. We handle the day-to-day task tracking while they provide strategic guidance.",
      icon: CheckCircle2,
    },
    {
      title: "Actionable Analytics",
      description:
        "Identify top performers during the 4-month internship phase with objective performance metrics.",
      icon: TrendingUp,
    },
  ];

  return (
    <section
      id="about"
      className="bg-white py-24 sm:py-32 overflow-hidden border-t border-slate-100 relative"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Content: Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative lg:order-first order-last"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-slate-200/60 p-2 bg-white/50 backdrop-blur-sm">
              <img
                src="../../../public/discussion-young-group-busines-training.jpg"
                alt="Team collaborating on intern training"
                className="rounded-2xl w-full h-auto object-cover"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-900/5 mix-blend-overlay"></div>
            </div>

            {/* Decorative background shape */}
            <div className="absolute -inset-y-16 -inset-x-16 -z-10 bg-gradient-to-tr from-blue-50 to-teal-50 blur-3xl opacity-50 rounded-full mix-blend-multiply" />
          </motion.div>

          {/* Right Content: Text & Features */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          >
            <h2 className="text-base font-semibold leading-7 text-teal-600 tracking-wide uppercase">
              About Our Platform
            </h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Built specifically for ambitious startups
            </p>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Our Intern Training & Management System is purposefully designed
              to help fast-growing companies efficiently manage their talent
              pipeline.
            </p>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              We understand that your senior mentors are busy. That's why we
              built a platform that automates routine tasks, structures
              training, and bridges the gap between hiring an intern and
              deploying a productive team member.
            </p>

            <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-slate-600 lg:max-w-none">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="relative pl-12">
                    <dt className="inline font-semibold text-slate-900">
                      <div className="absolute left-1 top-1 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                        <Icon
                          className="h-5 w-5 text-teal-600"
                          aria-hidden="true"
                        />
                      </div>
                      {benefit.title}
                    </dt>{" "}
                    <dd className="inline">{benefit.description}</dd>
                  </div>
                );
              })}
            </dl>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
