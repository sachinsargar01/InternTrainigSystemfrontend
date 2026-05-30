import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      initials: "SA",
      name: "Sarah Anderson",
      role: "Software Development Intern",
      color: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50",
      textAcc: "text-blue-600",
      feedback:
        "The platform made my internship experience incredibly smooth and organized. I could securely track my progress, access high-quality training materials anytime, and communicate seamlessly with my mentor.",
    },
    {
      initials: "MK",
      name: "Michael Kumar",
      role: "Marketing Intern",
      color: "from-teal-500 to-emerald-600",
      bgLight: "bg-teal-50",
      textAcc: "text-teal-600",
      feedback:
        "Daily tasks and automated milestone tests kept me highly engaged and motivated. The robust feedback system helped me continuously improve my skills. I highly recommend this structured program!",
    },
    {
      initials: "EC",
      name: "Emily Chen",
      role: "Design Intern",
      color: "from-purple-500 to-pink-600",
      bgLight: "bg-purple-50",
      textAcc: "text-purple-600",
      feedback:
        "A fantastic learning experience! The clear, stage-based approach and transparent milestones helped me stay on track every week. The direct mentor support was excellent and very responsive throughout.",
    },
  ];

  return (
    <section className="bg-slate-50 py-24 sm:py-32 relative overflow-hidden text-center">
      {/* Background decoration */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-200 to-teal-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
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
              Real Feedback
            </h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Don't just take our word for it
            </p>
            <p className="mt-4 text-lg text-slate-600">
              Hear directly from interns who have successfully navigated and accelerated their careers through our platform.
            </p>
          </motion.div>
        </div>

        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
              className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 hover:shadow-xl hover:ring-blue-100 transition-all duration-300 group text-left relative"
            >
              {/* Subtle Quote Icon Background */}
              <Quote className="absolute top-8 right-8 h-20 w-20 text-slate-50 opacity-50 -rotate-12 group-hover:-rotate-0 transition-transform duration-500" aria-hidden="true" />
              
              <div>
                <div className="flex gap-x-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                  ))}
                </div>
                
                <p className="text-base leading-relaxed text-slate-700 relative z-10">
                  "{testimonial.feedback}"
                </p>
              </div>

              <div className="mt-8 flex items-center gap-x-4 border-t border-slate-100 pt-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.color} shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-sm font-bold text-white tracking-wide">
                    {testimonial.initials}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-slate-900">{testimonial.name}</h3>
                  <p className={`text-xs leading-5 font-medium ${testimonial.textAcc}`}>{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
