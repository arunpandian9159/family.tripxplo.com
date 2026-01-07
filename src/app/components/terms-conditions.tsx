'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Mail } from 'lucide-react';

const TermsConditionsPage = () => {
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
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Terms and Conditions</h1>
              <p className="text-slate-400 mt-1">User Agreement</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 space-y-8">
            {/* Applicability of The Agreement */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#15ab8b]/10 rounded-lg flex items-center justify-center text-[#15ab8b] text-sm font-bold">
                  1
                </span>
                Applicability of The Agreement
              </h2>
              <div className="ml-11">
                <p className="text-slate-600 leading-relaxed">
                  This agreement (User Agreement) outlines the terms and conditions for
                  Tripmilestone Tours Pvt Ltd (TripXplo) to provide services to individuals (the
                  User) who are purchasing or inquiring about any products and/or services from
                  TripXplo. This includes using TripXplo&#39;s websites or any other customer
                  interface channels such as salespersons, offices, call centers, advertisements,
                  and information campaigns. Both the User and TripXplo are individually referred to
                  as &quot;party&quot; and collectively as &quot;parties&quot; within this
                  agreement.
                </p>
              </div>
            </section>

            {/* User's Responsibility of Awareness */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#15ab8b]/10 rounded-lg flex items-center justify-center text-[#15ab8b] text-sm font-bold">
                  2
                </span>
                User&#39;s Responsibility of Awareness
              </h2>
              <div className="ml-11 space-y-4">
                <p className="text-slate-600 leading-relaxed">
                  By availing services from TripXplo, Users are deemed to have read, understood, and
                  expressly accepted the terms and conditions of this agreement. This agreement
                  governs the transactions or provision of services by TripXplo for all purposes and
                  is binding on the User. All rights and liabilities of the User and/or TripXplo
                  regarding any services provided by TripXplo are limited to the scope of this
                  agreement.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  TripXplo reserves the right, at its sole discretion, to terminate access to any or
                  all TripXplo websites or other sales channels and related services or any portion
                  thereof at any time without notice, for general maintenance or any other reason.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  In addition to this Agreement, there are specific terms of service (TOS) for the
                  various services or products provided by TripXplo, such as air tickets and holiday
                  packages. These TOS, as provided or updated by TripXplo, are considered part of
                  this Agreement. In the event of a conflict between such TOS and this Agreement,
                  the terms of this Agreement shall prevail.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Users must read and accept the relevant TOS for the service or product they avail.
                  Additionally, service providers may provide terms and guidelines that govern
                  particular features, offers, or the operating rules and policies applicable to
                  each service (e.g., flights, hotel reservations, packages). Users are responsible
                  for ensuring compliance with the terms, guidelines, or operating rules and
                  policies of the service providers with whom they choose to deal.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  TripXplo&#39;s services are offered to the User conditioned on acceptance without
                  modification of all terms, conditions, and notices contained in this Agreement and
                  the TOS, as applicable from time to time. By availing of the services, the User
                  acknowledges and accepts this Agreement and the TOS. If the User does not agree
                  with any part of these terms, conditions, and notices, they must not avail of
                  TripXplo&#39;s services.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  In the event of any conflict between the terms, conditions, and notices herein and
                  the additional terms or other terms and guidelines contained within any other
                  TripXplo document, these terms shall control.
                </p>
              </div>
            </section>

            {/* Third-Party Account Information */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#15ab8b]/10 rounded-lg flex items-center justify-center text-[#15ab8b] text-sm font-bold">
                  3
                </span>
                Third-Party Account Information
              </h2>
              <div className="ml-11 space-y-4">
                <p className="text-slate-600 leading-relaxed">
                  By using the Account Access service on TripXplo&#39;s websites, the User
                  authorizes TripXplo and its agents to access third-party sites, including banks
                  and other payment gateways, designated by them for retrieving requested
                  information.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  The User will choose a password during registration and is responsible for
                  maintaining the confidentiality of the password and account. The User is fully
                  responsible for all activities that occur under their password or account.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  The User must notify TripXplo immediately in writing of any unauthorized use of
                  their password or account or any other breach of security. TripXplo will not be
                  liable for any loss incurred by the User as a result of unauthorized use of their
                  password or account, whether with or without their knowledge. The User shall not
                  use anyone else&#39;s password at any time.
                </p>
              </div>
            </section>

            {/* Confidentiality */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#15ab8b]/10 rounded-lg flex items-center justify-center text-[#15ab8b] text-sm font-bold">
                  4
                </span>
                Confidentiality
              </h2>
              <div className="ml-11">
                <p className="text-slate-600 leading-relaxed">
                  Any information specifically mentioned by TripXplo as confidential shall be
                  maintained as confidential by the User and shall not be disclosed unless required
                  by law or to fulfill the purposes of this agreement and the obligations of both
                  parties herein.
                </p>
              </div>
            </section>

            {/* Website and Web App Usage */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#15ab8b]/10 rounded-lg flex items-center justify-center text-[#15ab8b] text-sm font-bold">
                  5
                </span>
                Website and Web App Usage
              </h2>
              <div className="ml-11 space-y-4">
                <p className="text-slate-600 leading-relaxed">
                  Your use of any information or materials on the TripXplo website and Web app is
                  entirely at your own risk. TripXplo shall not be liable for any risks you
                  undertake. It is your responsibility to ensure that any products, services, or
                  information available through our website or app meet your specific requirements.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  You are prohibited from altering, duplicating, distributing, transmitting,
                  reproducing, publishing, licensing, or selling any information, software,
                  products, or services obtained from this website or app. Duplicating content from
                  the website and app is forbidden and is in accordance with the copyright notice,
                  which forms part of the Terms of Use.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Additionally, TripXplo reserves the right to modify, revise, and delete any
                  contents without prior notice.
                </p>
              </div>
            </section>

            {/* Usage of Customer's Travel Pictures */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#15ab8b]/10 rounded-lg flex items-center justify-center text-[#15ab8b] text-sm font-bold">
                  6
                </span>
                Usage of Customer&#39;s Travel Pictures
              </h2>
              <div className="ml-11">
                <p className="text-slate-600 leading-relaxed">
                  Any pictures or videos shared by customers during or after their trip in support
                  groups or via email may be used on our social media platforms to engage with our
                  audience. If you prefer not to have your media shared, please email us at{' '}
                  <a
                    href="mailto:hello@tripxplo.com"
                    className="text-[#15ab8b] hover:underline font-medium"
                  >
                    hello@tripxplo.com
                  </a>
                  , and we will promptly address your request.
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section className="bg-linear-to-br from-[#15ab8b]/5 to-[#d1fbd2]/30 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-3">Questions?</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                If you have any questions or concerns about our Terms and Conditions, please feel
                free to contact us.
              </p>
              <a
                href="mailto:hello@tripxplo.com?subject=Terms and Conditions"
                className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-[#15ab8b] to-[#1ec9a5] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#15ab8b]/25 transition-all"
              >
                <Mail className="w-5 h-5" />
                hello@tripxplo.com
              </a>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditionsPage;
