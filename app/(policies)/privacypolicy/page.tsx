import Link from "next/link";
export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col  items-center justify-center min-h-screen py-5">
      <div className="border h-auto  shadow-lg p-6 w-4/5  rounded-lg gap-3  flex flex-col">
        <div className="flex flex-col snap-y snap-mandatory overflow-y-auto">
          <div className="flex-shrink-0 snap-start overflow-hidden">
            <h1 className="text-xl font-semibold mb-4 text-[#FF7865]">
              Privacy Policy
            </h1>

            <h1 className="text-sm text-neutral-700">
              At TripXplo, a brand of Tripmilestone Tours Pvt Ltd, your privacy
              is of the utmost importance to us. We are committed to protecting
              your personal information and ensuring that your experience with
              us is secure and enjoyable. We assure you that we will not spam
              you with unsolicited emails, messages, or calls. This Privacy
              Policy outlines our policies regarding the collection, use, and
              protection of personal information provided by users of the
              TripXplo website. Personal information refers to data that can
              identify an individual, such as name, address, telephone number,
              email address, and payment details. We encourage you to review
              this Privacy Policy to understand our practices. Please note that
              we periodically update our Privacy Policy, so we recommend
              bookmarking this page and reviewing it from time to time to ensure
              you have the latest information. Regardless of updates, we will
              adhere to the privacy practices outlined in this policy when you
              provide us with your personal information.
            </h1>

            <h1 className="mt-4 font-semibold text-lg text-neutral-700">
              Information We Collect and How We Use It
            </h1>
            <h1 className="text-neutal-700 font-semibold text-sm mt-3">
              Browsing Our Site
            </h1>
            <h1 className="mt-3 text-sm">
              You are not required to provide any personal information when
              browsing our site unless you choose to make a purchase or sign up
              for our services.
            </h1>

            <h1 className="text-neutal-700 font-semibold text-sm mt-3">
              Making a Purchase
            </h1>
            <h1 className="mt-3 text-sm">
              To purchase travel and related services through our site, you will
              need to provide certain personal information, including your name,
              payment details (such as credit card number and expiration date),
              billing address, telephone number, email address, and the names of
              any travellers. We may also request additional information, such
              as frequent flier numbers. This information is necessary to
              process, fulfill, and confirm your reservations and transactions,
              and to keep you informed of their status. If you are making a
              reservation for others, you must confirm that you have their
              consent to provide their personal information to us.
            </h1>

            <h1 className="text-neutal-700 font-semibold text-sm mt-3">
              Member Registration
            </h1>
            <h1 className="mt-3 text-sm">
              If you choose to register as a member of the TripXplo website, you
              will need to provide your name, address, telephone number, email
              address, a unique login name, password, and a password hint. This
              information is collected for various purposes, including:
            </h1>
            <div>
              <ul className="ml-7 text-sm mt-2 space-y-1">
                <li> Personal identification</li>
                <li>
                  Completing holiday, air, hotel, car, and other reservations
                </li>
                <li>
                  Contacting you for customer service purposes, if necessary
                </li>
                <li>Customizing site content to meet your specific needs</li>
                <li>Improving our site and services</li>
              </ul>
            </div>
            {/* <ul className="text-sm list-disc mt-2">
             */}

            {/* </ul> */}
            <h1 className="text-sm mt-1">
              We also need your email address to confirm your registration and
              each reservation you make on our site.
            </h1>

            <h1 className="text-neutal-700 font-semibold text-sm mt-3">
              TripXplo Web App
            </h1>
            <h1 className="mt-3 text-sm">
              Our app will not publicly disclose any personal or sensitive data
              related to financial or payment activities or government
              identification numbers. <br />
              <span className="flex flex-col space-y-2">
                <span className="my-2">Access to Information</span>
                <span className="mt-4">
                  Permissions we may request include:
                </span>
                <span className="ml-4 mb-2">
                  GPS Location (Android, Web App): To suggest nearby places and
                  enhance your travel experience.
                </span>
              </span>
              <span className="py-2">
                As a member of the TripXplo site, you will occasionally receive
                updates about fare sales, special offers, travel inspirations,
                and other noteworthy items. You can opt out of these
                communications at any time (see our Opt-out Policy below).
              </span>
            </h1>

            <h1 className="text-neutal-700 font-semibold text-sm mt-3">
              Member Profile
            </h1>
            <h1 className="mt-3 text-sm">
              As a TripXplo site member, you can complete your online profile
              with travel preferences, frequent traveller or affinity numbers,
              billing information, delivery addresses, and other personal
              details. This information is used to assist you in making
              reservations quickly and easily, without repeatedly entering the
              same information.
            </h1>

            <h1 className="text-neutal-700 font-semibold text-sm mt-3">
              Cookies
            </h1>
            <h1 className="mt-3 text-sm">
              <span className="text-neutral-900">Cookies</span> are small pieces
              of information stored by your browser on your computer &apos;s
              hard drive. Despite various myths about cookies, it is important
              to know that cookies can only be read by the server that placed
              them and cannot run programs, plant viruses, or harvest your
              personal information. The use of cookies is widespread on the
              Internet, and TripXplo &apos;s use of cookies is similar to that
              of reputable online companies.
              <br />
              <br />
              First and foremost, be assured that no personally identifiable
              information <span className="text-neutral-900">PTI</span>such as
              your name or address is gathered or stored in the cookies placed
              by the TripXplo site. As a result, no PII can be passed on to any
              third parties. Cookies enable us to serve you better and more
              efficiently, and to personalize your experience on our site.
              <br />
              <br />
              TripXplo uses cookies to personalize your experience on our site
              and in relation to advertisements. For instance, these cookies
              allow you to log in without typing your login name each time (only
              your password is needed). We may also use cookies to display
              advertisements to you while you are on the TripXplo site or to
              send you emails such as{" "}
              <span className="text-neutral-900">Best Day to Buy</span>{" "}
              (assuming you have not opted out of receiving such emails) focused
              on destinations we believe may interest you. None of this
              information is passed to any third party and is used solely by us
              to provide you with a better user experience on the TripXplo site.
              <br />A cookie may also be placed by our advertising server. These
              cookies are used solely for tracking the effectiveness of
              advertising served by us on our site, and no PII is gathered by
              these cookies nor is any information shared with third parties.
              Similarly, a cookie may be placed by third-party advertising
              companies. These companies may use aggregated statistics about
              your visits to this and other websites to provide advertisements
              about travel-related goods and services that may interest you. The
              information they collect does not include your PII. Third-party
              advertising companies may also use technology to measure the
              effectiveness of ads. This information is anonymous and does not
              link online actions to an identifiable person.
              <br />
              <br />
              Most web browsers automatically accept cookies. However, by
              changing your browser settings or using certain software programs,
              you can control how and whether cookies are accepted by your
              browser. TripXplo supports your right to block any unwanted
              Internet activity, especially from unscrupulous websites. However,
              blocking TripXplo cookies may disable certain features on our site
              and may make it impossible to purchase or use certain services
              available on our site. Please note that it is possible to block
              cookie activity from certain websites while permitting cookies
              from sites you trust, like TripXplo.
            </h1>

            <h1 className="text-neutal-700 font-semibold text-sm mt-3">
              Other Services
            </h1>
            <h1 className="mt-3 text-sm">
              From time to time, we may add or enhance services available on the
              TripXplo site. To the extent these services are provided and used
              by you, we will use the information you provide to facilitate the
              requested service. For example, if you email us with a question,
              we will use your email address, name, and nature of the question
              to respond. We may also store this information to help us improve
              the site and make it easier to use.
            </h1>

            <h1 className="text-neutal-700 font-semibold text-sm mt-3">
              What Other Information Should I Know About My Privacy?
            </h1>
            <h1 className="mt-3 text-sm">
              The TripXplo website may contain links to other websites. Please
              be aware that when you click on one of these links, you will be
              directed to a website that operates under its own privacy policy,
              over which Tripmilestone Tours Pvt Ltd has no control. We
              recommend that you review the privacy policies of any linked
              websites as their practices may differ significantly from ours.
              Additionally, it is your responsibility to keep your passwords and
              account information confidential. Be vigilant and responsible with
              your personal information, especially while online. In certain
              situations, Tripmilestone Tours Pvt Ltd may be required to
              disclose your information. This could be due to legal obligations,
              court orders, requests from law enforcement or other government
              authorities, or if we believe it is necessary to protect our
              rights or properties. This may include situations where we need to
              identify, contact, or take legal action against someone who may be
              causing harm or interference with our rights or properties,
              whether intentionally or unintentionally. Moreover, if
              Tripmilestone Tours Pvt Ltd or substantially all of its assets are
              acquired, customer information may be transferred as part of the
              acquisition process. This policy is effective as of June 1st,
              2024. Any significant changes in how we handle personal
              information will be communicated in updates to this Privacy
              Policy. If you have any questions or concerns about our Privacy
              Policy or practices, please contact us at hello@tripxplo.com.
              Please include{" "}
              <span className="text-neutral-900">Privacy Policy</span> in the
              subject line of your email. Tripmilestone Tours Pvt Ltd aims to
              address all reasonable concerns or inquiries within seven working
              days.
            </h1>
          </div>
        </div>
        <div className="border ml-auto p-2 rounded-lg">
          <Link className="" href="/">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}
