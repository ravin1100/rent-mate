import React from "react";
import PublicLayout from "../components/layout/PublicLayout";

const AboutUs: React.FC = () => {
  return (
    <PublicLayout>
      <div className="bg-white">
        {/* Hero section */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover opacity-30"
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80"
              alt="People in a meeting"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 mix-blend-multiply" />
          </div>
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              About RentMate
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-3xl">
              We're on a mission to make shared living easier, more transparent,
              and stress-free.
            </p>
          </div>
        </div>

        {/* Our Story section */}
        <div className="relative py-16 bg-white overflow-hidden">
          <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
            <div
              className="relative h-full text-lg max-w-prose mx-auto"
              aria-hidden="true"
            >
              <svg
                className="absolute top-12 left-full transform translate-x-32"
                width="404"
                height="384"
                fill="none"
                viewBox="0 0 404 384"
              >
                <defs>
                  <pattern
                    id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="4"
                      height="4"
                      className="text-blue-100"
                      fill="currentColor"
                    />
                  </pattern>
                </defs>
                <rect
                  width="404"
                  height="384"
                  fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)"
                />
              </svg>
              <svg
                className="absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32"
                width="404"
                height="384"
                fill="none"
                viewBox="0 0 404 384"
              >
                <defs>
                  <pattern
                    id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="4"
                      height="4"
                      className="text-blue-100"
                      fill="currentColor"
                    />
                  </pattern>
                </defs>
                <rect
                  width="404"
                  height="384"
                  fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)"
                />
              </svg>
            </div>
          </div>
          <div className="relative px-4 sm:px-6 lg:px-8">
            <div className="text-lg max-w-prose mx-auto">
              <h2>
                <span className="block text-base text-center text-blue-600 font-semibold tracking-wide uppercase">
                  Our Story
                </span>
                <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  How RentMate Began
                </span>
              </h2>
              <p className="mt-8 text-xl text-gray-500 leading-8">
                RentMate was born out of a simple frustration: managing shared
                living spaces is hard. Our founders, all former roommates,
                experienced firsthand the challenges of tracking expenses,
                assigning chores, and maintaining harmony in a shared household.
              </p>
            </div>
            <div className="mt-6 prose prose-blue prose-lg text-gray-500 mx-auto">
              <p>
                In 2023, after one too many arguments about who forgot to take
                out the trash or who still owed money for utilities, our team
                decided there had to be a better way. We set out to create a
                platform that would eliminate the friction points of communal
                living and help roommates focus on what really matters: building
                a home together.
              </p>
              <p>
                What started as a simple expense-tracking tool quickly evolved
                into a comprehensive household management platform. We listened
                to our users, added features they requested, and continuously
                refined our approach to make RentMate the go-to solution for
                modern shared living.
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-12">
                Our Values
              </h3>
              <p>At RentMate, we believe in:</p>
              <ul>
                <li>
                  <strong>Transparency:</strong> Clear communication is the
                  foundation of any successful shared living arrangement.
                </li>
                <li>
                  <strong>Fairness:</strong> Everyone should contribute
                  equitably to the household, based on agreed-upon terms.
                </li>
                <li>
                  <strong>Simplicity:</strong> Managing a home shouldn't be
                  complicated. Our tools are designed to be intuitive and easy
                  to use.
                </li>
                <li>
                  <strong>Community:</strong> We're building more than just an
                  app; we're fostering better relationships between roommates.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Team section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Meet Our Team
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                We're a small but dedicated team passionate about making shared
                living better for everyone.
              </p>
            </div>
            <div className="mt-12 space-y-12 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
              {/* Team Member 1 */}
              <div className="space-y-4">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    className="object-cover shadow-lg rounded-lg"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
                    alt="Team member"
                  />
                </div>
                <div className="space-y-1 text-lg font-medium leading-6">
                  <h3 className="text-gray-900">Sarah Johnson</h3>
                  <p className="text-blue-600">Co-Founder & CEO</p>
                </div>
                <div className="text-gray-500">
                  <p>
                    Former property manager who experienced the challenges of
                    roommate coordination firsthand. Sarah leads our product
                    vision and strategy.
                  </p>
                </div>
              </div>

              {/* Team Member 2 */}
              <div className="space-y-4">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    className="object-cover shadow-lg rounded-lg"
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
                    alt="Team member"
                  />
                </div>
                <div className="space-y-1 text-lg font-medium leading-6">
                  <h3 className="text-gray-900">Michael Chen</h3>
                  <p className="text-blue-600">Co-Founder & CTO</p>
                </div>
                <div className="text-gray-500">
                  <p>
                    Software engineer with a passion for creating intuitive user
                    experiences. Michael oversees our technical development and
                    infrastructure.
                  </p>
                </div>
              </div>

              {/* Team Member 3 */}
              <div className="space-y-4">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    className="object-cover shadow-lg rounded-lg"
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
                    alt="Team member"
                  />
                </div>
                <div className="space-y-1 text-lg font-medium leading-6">
                  <h3 className="text-gray-900">Aisha Patel</h3>
                  <p className="text-blue-600">Head of Customer Success</p>
                </div>
                <div className="text-gray-500">
                  <p>
                    With a background in community management, Aisha ensures our
                    users have the best possible experience with RentMate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Get in Touch
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Have questions or feedback? We'd love to hear from you!
              </p>
            </div>
            <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-2 lg:max-w-none">
              <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Support
                    </h3>
                    <p className="mt-3 text-base text-gray-500">
                      Need help with your account or have questions about how
                      RentMate works?
                    </p>
                  </div>
                  <div className="mt-6">
                    <a
                      href="mailto:support@rentmate.com"
                      className="text-blue-600 hover:text-blue-500"
                    >
                      support@rentmate.com
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Partnerships
                    </h3>
                    <p className="mt-3 text-base text-gray-500">
                      Interested in partnering with RentMate or exploring
                      business opportunities?
                    </p>
                  </div>
                  <div className="mt-6">
                    <a
                      href="mailto:partnerships@rentmate.com"
                      className="text-blue-600 hover:text-blue-500"
                    >
                      partnerships@rentmate.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default AboutUs;
