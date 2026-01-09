"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { PiWhatsappLogoBold } from "react-icons/pi";

const faqs = [
  {
    question: "How does the EMI payment work?",
    answer:
      "Our EMI plans allow you to pay for your vacation in easy monthly installments. Choose a 3, 6, or 12-month plan, pay the first installment to lock your booking, and complete the remaining payments before your travel date. It's that simple!",
  },
  {
    question: "Is there any interest on EMI?",
    answer:
      "We offer No-Cost EMI on select packages! This means the total amount you pay remains the same whether you pay upfront or in installments. Check each package for EMI eligibility and terms.",
  },
  {
    question: "What happens if I need to cancel my trip?",
    answer:
      "We understand plans can change. Our cancellation policy varies by package and how close it is to the travel date. Generally, you can get a full refund if cancelled 30+ days before travel. Check our Cancellation & Refund Policy for details.",
  },
  {
    question: "Are flights included in the package?",
    answer:
      "Flight inclusion varies by package. Some packages include domestic flights, while others cover only accommodation, transfers, and activities. Each package clearly mentions what's included - look for the 'Inclusions' section.",
  },
  {
    question: "How are TripXplo packages different from other online travel sites?",
    answer:
      "Our packages offer a comprehensive range of services including travel, sightseeing, breakfast, adventures, and accommodation. Additionally, we have a network of well-trained Trip Captains across India who guide our customers, ensuring they feel at home and can travel with ease.",
  },
  {
    question: "How do I make EMI payments?",
    answer:
      "After your initial booking payment, you'll receive monthly payment reminders via email and SMS. Pay easily through UPI, debit/credit card, or net banking on our secure payment portal. Auto-debit options are also available.",
  },
];

const FAQItem = ({
  question,
  answer,
  isOpen,
  onClick,
  index,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`mb-4 rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? "border-gold-500 shadow-lg shadow-gold-100/50 bg-white"
          : "border-slate-200 hover:border-gold-300 bg-white shadow-sm shadow-slate-100/50"
      }`}
    >
      <button
        onClick={onClick}
        className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left group"
      >
        <span
          className={`text-base lg:text-lg font-bold transition-colors pr-4 ${
            isOpen
              ? "text-gold-600"
              : "text-slate-800 group-hover:text-gold-600"
          }`}
        >
          {question}
        </span>
        <div
          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "bg-gold-500 text-white rotate-180"
              : "bg-slate-100 text-slate-500 group-hover:bg-gold-50 group-hover:text-gold-600"
          }`}
        >
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-0 border-t border-slate-50">
              <p className="mt-4 text-slate-600 leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gold-100 text-gold-700 text-sm font-semibold rounded-full mb-4"
            >
              <HelpCircle className="w-4 h-4" />
              Got Questions?
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4"
            >
              Frequently Asked <span className="text-gold-600">Questions</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-slate-600"
            >
              Everything you need to know about our EMI travel packages
            </motion.p>
          </div>

          {/* FAQ List */}
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                index={index}
              />
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 text-center"
          >
            <p className="text-slate-600 mb-4">Still have questions?</p>
            <a
              href="https://wa.me/919442424492"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 gold-gradient text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-gold-500/25 transition-all duration-300"
            >
              Chat with Us on WhatsApp<PiWhatsappLogoBold/>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
