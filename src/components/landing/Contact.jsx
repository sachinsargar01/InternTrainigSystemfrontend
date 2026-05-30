import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative bg-white py-24 sm:py-32 overflow-hidden border-t border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-base font-semibold leading-7 text-teal-600 tracking-wide uppercase">
              Contact Us
            </h2>

            <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Let's talk about your intern program
            </p>

            <p className="mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto">
              Have questions about how InternHub can streamline your processes?
              Our team is here to help you set up and scale effortlessly.
            </p>
          </motion.div>

          {/* Static Contact Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Address */}
            <div className="bg-white rounded-3xl p-8 shadow-sm ring-1 ring-slate-200 text-center hover:shadow-lg transition-all duration-300">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50">
                <MapPin className="h-7 w-7 text-teal-600" />
              </div>

              <h3 className="mt-6 text-lg font-semibold text-slate-900">
                Address
              </h3>

              <p className="mt-3 text-slate-600 leading-7">
                Phase 2 Hinjewadi,
                <br />
                Pune 411057
                <br />
                Maharashtra, India
              </p>
            </div>

            {/* Phone */}
            <div className="bg-white rounded-3xl p-8 shadow-sm ring-1 ring-slate-200 text-center hover:shadow-lg transition-all duration-300">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50">
                <Phone className="h-7 w-7 text-teal-600" />
              </div>

              <h3 className="mt-6 text-lg font-semibold text-slate-900">
                Phone
              </h3>

              <a
                href="tel:+15551234567"
                className="mt-3 block text-slate-600 hover:text-teal-600 transition-colors"
              >
                +91 9881884005
              </a>
            </div>

            {/* Email */}
            <div className="bg-white rounded-3xl p-8 shadow-sm ring-1 ring-slate-200 text-center hover:shadow-lg transition-all duration-300">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50">
                <Mail className="h-7 w-7 text-teal-600" />
              </div>

              <h3 className="mt-6 text-lg font-semibold text-slate-900">
                Email
              </h3>

              <a
                href="mailto:support@internhub.com"
                className="mt-3 block text-slate-600 hover:text-teal-600 transition-colors"
              >
                support@internhub.com
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
