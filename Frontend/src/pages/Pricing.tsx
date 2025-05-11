import React from "react";
import PublicLayout from "../components/layout/PublicLayout";

const Pricing: React.FC = () => {
  return (
    <PublicLayout>
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
              Pricing
            </h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Simple, transparent pricing
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Choose the plan that works best for you and your household
            </p>
          </div>

          <div className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
            {/* Free Plan */}
            <div className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">Free</h3>
                <p className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-5xl font-extrabold tracking-tight">
                    $0
                  </span>
                  <span className="ml-1 text-xl font-semibold">/month</span>
                </p>
                <p className="mt-6 text-gray-500">
                  Perfect for small households just getting started.
                </p>

                <ul role="list" className="mt-6 space-y-6">
                  <li className="flex">
                    <svg
                      className="flex-shrink-0 w-6 h-6 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-500">
                      Up to 3 household members
                    </span>
                  </li>
                  <li className="flex">
                    <svg
                      className="flex-shrink-0 w-6 h-6 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-500">
                      Basic chore management
                    </span>
                  </li>
                  <li className="flex">
                    <svg
                      className="flex-shrink-0 w-6 h-6 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-500">
                      Simple expense tracking
                    </span>
                  </li>
                </ul>
              </div>

              <a
                href="#"
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium"
              >
                Get started
              </a>
            </div>

            {/* Standard Plan */}
            <div className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  Standard
                </h3>
                <p className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-5xl font-extrabold tracking-tight">
                    $9
                  </span>
                  <span className="ml-1 text-xl font-semibold">/month</span>
                </p>
                <p className="mt-6 text-gray-500">
                  For households that need more advanced features.
                </p>

                <ul role="list" className="mt-6 space-y-6">
                  <li className="flex">
                    <svg
                      className="flex-shrink-0 w-6 h-6 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-500">
                      Up to 6 household members
                    </span>
                  </li>
                  <li className="flex">
                    <svg
                      className="flex-shrink-0 w-6 h-6 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-500">
                      Advanced chore scheduling
                    </span>
                  </li>
                  <li className="flex">
                    <svg
                      className="flex-shrink-0 w-6 h-6 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-500">
                      Detailed expense reports
                    </span>
                  </li>
                  <li className="flex">
                    <svg
                      className="flex-shrink-0 w-6 h-6 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-500">
                      Calendar integration
                    </span>
                  </li>
                </ul>
              </div>

              <a
                href="#"
                className="bg-blue-600 text-white hover:bg-blue-700 mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium"
              >
                Get started
              </a>
            </div>

            {/* Premium Plan */}
            <div className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">Premium</h3>
                <p className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-5xl font-extrabold tracking-tight">
                    $19
                  </span>
                  <span className="ml-1 text-xl font-semibold">/month</span>
                </p>
                <p className="mt-6 text-gray-500">
                  For large households with complex needs.
                </p>

                <ul role="list" className="mt-6 space-y-6">
                  <li className="flex">
                    <svg
                      className="flex-shrink-0 w-6 h-6 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-500">
                      Unlimited household members
                    </span>
                  </li>
                  <li className="flex">
                    <svg
                      className="flex-shrink-0 w-6 h-6 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-500">
                      AI-powered chore suggestions
                    </span>
                  </li>
                  <li className="flex">
                    <svg
                      className="flex-shrink-0 w-6 h-6 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-500">
                      Advanced financial analytics
                    </span>
                  </li>
                  <li className="flex">
                    <svg
                      className="flex-shrink-0 w-6 h-6 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-500">Priority support</span>
                  </li>
                  <li className="flex">
                    <svg
                      className="flex-shrink-0 w-6 h-6 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-500">
                      Custom integrations
                    </span>
                  </li>
                </ul>
              </div>

              <a
                href="#"
                className="bg-blue-600 text-white hover:bg-blue-700 mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium"
              >
                Get started
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Frequently asked questions
          </h2>
          <div className="mt-12">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12">
              <div>
                <dt className="text-lg leading-6 font-medium text-gray-900">
                  Can I cancel my subscription at any time?
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  Yes, you can cancel your subscription at any time. Your plan
                  will remain active until the end of your current billing
                  cycle.
                </dd>
              </div>
              <div>
                <dt className="text-lg leading-6 font-medium text-gray-900">
                  How do I invite my roommates?
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  Once you've created a household, you can invite roommates
                  directly from your dashboard by entering their email
                  addresses.
                </dd>
              </div>
              <div>
                <dt className="text-lg leading-6 font-medium text-gray-900">
                  Is there a mobile app?
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  We're currently developing mobile apps for iOS and Android. In
                  the meantime, our web application is fully responsive and
                  works great on mobile devices.
                </dd>
              </div>
              <div>
                <dt className="text-lg leading-6 font-medium text-gray-900">
                  How secure is my financial data?
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  We take security seriously. All your data is encrypted and we
                  never store complete payment information on our servers.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Pricing;
