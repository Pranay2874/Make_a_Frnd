import React from "react";
import Header from "../components/Header";

const AboutUs = () => {
  return (
    <div className="min-h-dvh bg-gray-50 font-inter">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center">
          About <span className="text-indigo-600">MakeAFrnd</span>
        </h1>

        <section className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Random Chat</h2>
          <p className="mt-3 text-gray-700 text-sm sm:text-base leading-relaxed">
            Jump straight into a one-to-one conversation with a random online user. No setup, no profiles—just instant
            connection. It’s perfect when you want quick, spontaneous chats or to meet someone new without overthinking
            it. You can leave anytime using <span className="font-medium">Skip Chat</span>, and we’ll find you a new match whenever you’re ready.
          </p>
        </section>

        <section className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Interest Chat</h2>
          <p className="mt-3 text-gray-700 text-sm sm:text-base leading-relaxed">
            Prefer focused conversations? Enter a topic (e.g., “coding”, “cricket”, “travel”) and we’ll try to match you
            with someone who chose the same interest. If we can’t find a match within <span className="font-medium">30 seconds</span>, we
            automatically switch you to <span className="font-medium">Random Chat</span> so you don’t wait around. This gives you the best of both
            worlds: relevant chats when possible, and instant chats when not.
          </p>
        </section>

        <section className="mt-6 text-gray-600 text-xs sm:text-sm text-center">
          <p>
            Notes: Your username is your identity—keep it simple and unique. You’re always in control: leave or start a
            new chat anytime.
          </p>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;
