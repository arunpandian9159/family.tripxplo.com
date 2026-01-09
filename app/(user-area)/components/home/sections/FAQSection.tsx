"use client";
import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
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
    question:
      "How are TripXplo packages different from other online travel sites?",
    answer:
      "Our packages offer a comprehensive range of services including travel, sightseeing, breakfast, adventures, and accommodation. Additionally, we have a network of well-trained Trip Captains across India who guide our customers, ensuring they feel at home and can travel with ease.",
  },
  {
    question: "How do I make EMI payments?",
    answer:
      "After your initial booking payment, you'll receive monthly payment reminders via email and SMS. Pay easily through UPI, debit/credit card, or net banking on our secure payment portal. Auto-debit options are also available.",
  },
  {
    question: "What is Tripxplo?",
    answer:
      "TripXplo, registered as Tripmilestone Tours Pvt. Ltd, was founded in 2020 by a team of young travel enthusiasts. A Travel Company for travellers that have big destinations in mind and huge milestones to traverse yet low on pocket.",
  },
  {
    question:
      "What are the different modes of payment for booking a trip on TripXplo?",
    answer:
      "We provide various payment options for a seamless booking experience:",
    listItems: ["Debit/Credit Cards", "UPI", "Net Banking", "NEFT Transfer"],
  },
  {
    question: "What is included in the tour package?",
    answer:
      "The inclusions and exclusions of a tour package may vary depending on the specific package you choose. Generally, our tour packages include accommodation, transportation, sightseeing, and meals (as specified in the itinerary). Additional activities or services may be available at an extra cost.",
  },
  {
    question: "Is the price of the tour package per person or per group?",
    answer:
      "The price of the tour package is generally per person, based on double occupancy. Single occupancy and group rates are also available, with pricing varying depending on the package you choose.",
  },
  {
    question: "What is TripXplo's cancellation policy?",
    answer:
      "Our cancellation policy varies depending on the type of tour package and the booking date. Generally:",
    listItems: [
      "Cancellations made more than 30 days before the tour date are eligible for a full refund.",
      "Cancellations made between 15-30 days before the tour date are eligible for a 50% refund.",
      "Cancellations made within 15 days before the tour date are not eligible for a refund.",
    ],
  },
  {
    question: "What is your refund policy?",
    answer:
      "All refunds are processed within 21 days from the day of cancellation of the trip.",
  },
  {
    question: "Can I make changes to the tour itinerary after booking?",
    answer:
      "We understand that plans may change and we will try our best to accommodate any changes to the itinerary. However, please note that any changes made after the booking may incur additional charges.",
  },
  {
    question: "Is travel insurance included in the tour package?",
    answer:
      "No, travel insurance is not included in the tour package. We recommend purchasing travel insurance separately to cover any unexpected events or accidents during your trip.",
  },
  {
    question: "Can I request a vegetarian/vegan/gluten-free meal?",
    answer:
      "Yes, you can request a specific type of meal during the booking process or inform us in advance. We will do our best to accommodate your dietary preferences.",
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
    <div
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
      {isOpen && (
        <div className="overflow-hidden">
          <div className="px-6 pb-6 pt-0 border-t border-slate-50">
            <p className="mt-4 text-slate-600 leading-relaxed">{answer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showAll, setShowAll] = useState(false);

  const displayedFaqs = showAll ? faqs : faqs.slice(0, 6);
  const remainingCount = faqs.length - 6;

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-100 text-gold-700 text-sm font-semibold rounded-full mb-4">
              <HelpCircle className="w-4 h-4" />
              Got Questions?
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Frequently Asked <span className="text-gold-600">Questions</span>
            </h2>

            <p className="text-lg text-slate-600">
              Everything you need to know about our EMI travel packages
            </p>
          </div>

          {/* FAQ List */}
          <div className="max-w-4xl mx-auto space-y-4">
            {displayedFaqs.map((faq, index) => (
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

          {/* View More / Show Less Button */}
          {remainingCount > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-8 py-3 rounded-full border-2 border-gold-500 text-gold-600 font-bold hover:bg-gold-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-gold-200"
              >
                {showAll ? "Show Less" : `View ${remainingCount} More FAQs`}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
