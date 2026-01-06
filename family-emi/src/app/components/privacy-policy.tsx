'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Mail } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-[#d1fbd2]/20">
      {/* Header */}
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-[#15ab8b] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-linear-to-br from-[#15ab8b] to-[#1ec9a5] rounded-2xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
              <p className="text-slate-400 mt-1">Last updated: June 1st, 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 space-y-8">
            {/* Introduction */}
            <section>
              <p className="text-slate-600 leading-relaxed">
                At TripXplo, a brand of Tripmilestone Tours Pvt Ltd, your privacy is of the utmost
                importance to us. We are committed to protecting your personal information and
                ensuring that your experience with us is secure and enjoyable. We assure you that we
                will not spam you with unsolicited emails, messages, or calls.
              </p>
              <p className="text-slate-600 leading-relaxed mt-4">
                This Privacy Policy outlines our policies regarding the collection, use, and
                protection of personal information provided by users of the TripXplo website.
                Personal information refers to data that can identify an individual, such as name,
                address, telephone number, email address, and payment details.
              </p>
              <p className="text-slate-600 leading-relaxed mt-4">
                We encourage you to review this Privacy Policy to understand our practices. Please
                note that we periodically update our Privacy Policy, so we recommend bookmarking
                this page and reviewing it from time to time to ensure you have the latest
                information. Regardless of updates, we will adhere to the privacy practices outlined
                in this policy when you provide us with your personal information.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#15ab8b]/10 rounded-lg flex items-center justify-center text-[#15ab8b] text-sm font-bold">
                  1
                </span>
                Information We Collect and How We Use It
              </h2>

              <div className="space-y-6 ml-11">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Browsing Our Site</h3>
                  <p className="text-slate-600 leading-relaxed">
                    You are not required to provide any personal information when browsing our site
                    unless you choose to make a purchase or sign up for our services.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Making a Purchase</h3>
                  <p className="text-slate-600 leading-relaxed">
                    To purchase travel and related services through our site, you will need to
                    provide certain personal information, including your name, payment details (such
                    as credit card number and expiration date), billing address, telephone number,
                    email address, and the names of any travellers. We may also request additional
                    information, such as frequent flier numbers.
                  </p>
                  <p className="text-slate-600 leading-relaxed mt-2">
                    This information is necessary to process, fulfill, and confirm your reservations
                    and transactions, and to keep you informed of their status. If you are making a
                    reservation for others, you must confirm that you have their consent to provide
                    their personal information to us.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Member Registration</h3>
                  <p className="text-slate-600 leading-relaxed">
                    If you choose to register as a member of the TripXplo website, you will need to
                    provide your name, address, telephone number, email address, a unique login
                    name, password, and a password hint. This information is collected for various
                    purposes, including:
                  </p>
                  <ul className="list-disc list-inside text-slate-600 mt-2 space-y-1">
                    <li>Personal identification</li>
                    <li>Completing holiday, air, hotel, car, and other reservations</li>
                    <li>Contacting you for customer service purposes, if necessary</li>
                    <li>Customizing site content to meet your specific needs</li>
                    <li>Improving our site and services</li>
                  </ul>
                  <p className="text-slate-600 leading-relaxed mt-2">
                    We also need your email address to confirm your registration and each
                    reservation you make on our site.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">TripXplo Web App</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Our app will not publicly disclose any personal or sensitive data related to
                    financial or payment activities or government identification numbers.
                  </p>
                </div>
              </div>
            </section>

            {/* Access to Information */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#15ab8b]/10 rounded-lg flex items-center justify-center text-[#15ab8b] text-sm font-bold">
                  2
                </span>
                Access to Information
              </h2>
              <div className="ml-11 space-y-4">
                <p className="text-slate-600 leading-relaxed">
                  <strong>Permissions we may request include:</strong>
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>
                    GPS Location (Android, Web App): To suggest nearby places and enhance your
                    travel experience.
                  </li>
                </ul>
                <p className="text-slate-600 leading-relaxed">
                  As a member of the TripXplo site, you will occasionally receive updates about fare
                  sales, special offers, travel inspirations, and other noteworthy items. You can
                  opt out of these communications at any time (see our Opt-out Policy below).
                </p>
              </div>
            </section>

            {/* Member Profile */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#15ab8b]/10 rounded-lg flex items-center justify-center text-[#15ab8b] text-sm font-bold">
                  3
                </span>
                Member Profile
              </h2>
              <div className="ml-11">
                <p className="text-slate-600 leading-relaxed">
                  As a TripXplo site member, you can complete your online profile with travel
                  preferences, frequent traveller or affinity numbers, billing information, delivery
                  addresses, and other personal details. This information is used to assist you in
                  making reservations quickly and easily, without repeatedly entering the same
                  information.
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#15ab8b]/10 rounded-lg flex items-center justify-center text-[#15ab8b] text-sm font-bold">
                  4
                </span>
                Cookies
              </h2>
              <div className="ml-11 space-y-4">
                <p className="text-slate-600 leading-relaxed">
                  Cookies are small pieces of information stored by your browser on your
                  computer&#39;s hard drive. Despite various myths about cookies, it is important to
                  know that cookies can only be read by the server that placed them and cannot run
                  programs, plant viruses, or harvest your personal information. The use of cookies
                  is widespread on the Internet, and TripXplo&#39;s use of cookies is similar to
                  that of reputable online companies.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  First and foremost, be assured that no personally identifiable information (PII)
                  such as your name or address is gathered or stored in the cookies placed by the
                  TripXplo site. As a result, no PII can be passed on to any third parties. Cookies
                  enable us to serve you better and more efficiently, and to personalize your
                  experience on our site.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  TripXplo uses cookies to personalize your experience on our site and in relation
                  to advertisements. For instance, these cookies allow you to log in without typing
                  your login name each time (only your password is needed). We may also use cookies
                  to display advertisements to you while you are on the TripXplo site or to send you
                  emails such as Best Day to Buy (assuming you have not opted out of receiving such
                  emails) focused on destinations we believe may interest you. None of this
                  information is passed to any third party and is used solely by us to provide you
                  with a better user experience on the TripXplo site.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  A cookie may also be placed by our advertising server. These cookies are used
                  solely for tracking the effectiveness of advertising served by us on our site, and
                  no PII is gathered by these cookies nor is any information shared with third
                  parties. Similarly, a cookie may be placed by third-party advertising companies.
                  These companies may use aggregated statistics about your visits to this and other
                  websites to provide advertisements about travel-related goods and services that
                  may interest you. The information they collect does not include your PII.
                  Third-party advertising companies may also use technology to measure the
                  effectiveness of ads. This information is anonymous and does not link online
                  actions to an identifiable person.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Most web browsers automatically accept cookies. However, by changing your browser
                  settings or using certain software programs, you can control how and whether
                  cookies are accepted by your browser. TripXplo supports your right to block any
                  unwanted Internet activity, especially from unscrupulous websites. However,
                  blocking TripXplo cookies may disable certain features on our site and may make it
                  impossible to purchase or use certain services available on our site. Please note
                  that it is possible to block cookie activity from certain websites while
                  permitting cookies from sites you trust, like TripXplo.
                </p>
              </div>
            </section>

            {/* Other Services */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#15ab8b]/10 rounded-lg flex items-center justify-center text-[#15ab8b] text-sm font-bold">
                  5
                </span>
                Other Services
              </h2>
              <div className="ml-11">
                <p className="text-slate-600 leading-relaxed">
                  From time to time, we may add or enhance services available on the TripXplo site.
                  To the extent these services are provided and used by you, we will use the
                  information you provide to facilitate the requested service. For example, if you
                  email us with a question, we will use your email address, name, and nature of the
                  question to respond. We may also store this information to help us improve the
                  site and make it easier to use.
                </p>
              </div>
            </section>

            {/* What Other Information */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#15ab8b]/10 rounded-lg flex items-center justify-center text-[#15ab8b] text-sm font-bold">
                  6
                </span>
                What Other Information Should I Know About My Privacy?
              </h2>
              <div className="ml-11 space-y-4">
                <p className="text-slate-600 leading-relaxed">
                  The TripXplo website may contain links to other websites. Please be aware that
                  when you click on one of these links, you will be directed to a website that
                  operates under its own privacy policy, over which Tripmilestone Tours Pvt Ltd has
                  no control. We recommend that you review the privacy policies of any linked
                  websites as their practices may differ significantly from ours.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Additionally, it is your responsibility to keep your passwords and account
                  information confidential. Be vigilant and responsible with your personal
                  information, especially while online.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  In certain situations, Tripmilestone Tours Pvt Ltd may be required to disclose
                  your information. This could be due to legal obligations, court orders, requests
                  from law enforcement or other government authorities, or if we believe it is
                  necessary to protect our rights or properties. This may include situations where
                  we need to identify, contact, or take legal action against someone who may be
                  causing harm or interference with our rights or properties, whether intentionally
                  or unintentionally.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Moreover, if Tripmilestone Tours Pvt Ltd or substantially all of its assets are
                  acquired, customer information may be transferred as part of the acquisition
                  process.
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section className="bg-linear-to-br from-[#15ab8b]/5 to-[#d1fbd2]/30 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-3">Questions or Concerns?</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                If you have any questions or concerns about our Privacy Policy or practices, please
                contact us. Please include &quot;Privacy Policy&quot; in the subject line of your
                email. Tripmilestone Tours Pvt Ltd aims to address all reasonable concerns or
                inquiries within seven working days.
              </p>
              <a
                href="mailto:hello@tripxplo.com?subject=Privacy Policy"
                className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-[#15ab8b] to-[#1ec9a5] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#15ab8b]/25 transition-all"
              >
                <Mail className="w-5 h-5" />
                hello@tripxplo.com
              </a>
            </section>

            {/* Effective Date */}
            <div className="text-center pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                This policy is effective as of <strong>June 1st, 2024</strong>. Any significant
                changes in how we handle personal information will be communicated in updates to
                this Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
