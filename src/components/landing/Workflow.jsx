import { motion } from "framer-motion";
export default function Workflow() {
  const steps = [
    {
      number: 1,
      title: "Registration",
      desc: "Interns securely sign up and are rapidly onboarded.",
    },
    {
      number: 2,
      title: "Training Videos",
      desc: "Instant access to required, curated training curriculums.",
    },
    {
      number: 3,
      title: "Daily Tasks",
      desc: "Complete and seamlessly submit daily assignments.",
    },
    {
      number: 4,
      title: "Assessments",
      desc: "Take automated, periodic milestone evaluations.",
    },
    {
      number: 5,
      title: "Evaluation",
      desc: "Complete the program safely and become certified.",
    },
  ];

  return (
    <section
      id="workflow"
      className="relative bg-white py-24 sm:py-32 overflow-hidden border-t border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-base font-semibold leading-7 text-teal-600 tracking-wide uppercase">
              How It Works
            </h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Simple and structured workflow
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              We've designed a clear, straightforward path for interns to
              follow, ensuring consistent success and easy management.
            </p>
          </motion.div>
        </div>

        <div className="relative mx-auto lg:max-w-5xl">
          {/* Connecting Line for Desktop */}
          <div
            className="hidden lg:block absolute top-[3.25rem] left-8 right-8 h-0.5 bg-slate-100"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                  ease: "easeOut",
                }}
                className="relative flex flex-col items-center group"
              >
                {/* Number Circle */}
                <div className="relative z-10 flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white border-2 border-slate-100 shadow-sm group-hover:border-teal-500 group-hover:bg-teal-50 transition-all duration-300">
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-slate-700 to-slate-900 group-hover:from-teal-600 group-hover:to-teal-500 transition-all duration-300">
                    {step.number}
                  </span>

                  {/* Subtle ring animation on hover */}
                  <div className="absolute inset-0 rounded-2xl ring-4 ring-blue-500/10 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-110 transition-all duration-500" />
                </div>

                {/* Content */}
                <div className="mt-6 text-center">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-6 text-slate-600 px-2">
                    {step.desc}
                  </p>
                </div>

                {/* Mobile Connecting Line */}
                {index < steps.length - 1 && (
                  <div
                    className="lg:hidden absolute -bottom-10 left-1/2 -translate-x-1/2 h-8 w-px bg-slate-200"
                    aria-hidden="true"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
