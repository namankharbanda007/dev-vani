
import React from 'react';
import { buildMetadata } from "@/app/lib/seo";

export const metadata = buildMetadata({
    title: "Terms and Conditions",
    description:
        "Read SMART Murti's terms and conditions for website, mobile app, and AI-enabled hardware devices.",
    path: "/terms",
});

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-karla">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-3xl md:text-4xl font-bold font-lora text-gray-900 mb-8 border-b pb-4">
                    Terms and Conditions
                </h1>

                <div className="prose prose-purple max-w-none text-gray-700 space-y-6">
                    <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
                        <p>
                            Welcome to <strong>SMART मूर्ति</strong> ("we," "our," or "us"). By accessing or using our website, mobile application, and AI-enabled hardware devices (collectively, the "Services"), you agree to be bound by these Terms and Conditions ("Terms"). If you disagree with any part of the terms, then you may not access the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">2. Use of Our Services</h2>
                        <p>
                            To use our Services, you must be at least 13 years old. You agree to use the Services only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account and password.
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>You must not use our Services to harass, abuse, or harm others.</li>
                            <li>You must not attempt to reverse engineer our hardware or software.</li>
                            <li>You must not use the Services to generate content that is illegal, offensive, or harmful.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">3. AI Interactions</h2>
                        <p>
                            Our Services utilize Artificial Intelligence (AI) to generate responses. Please note:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Accuracy:</strong> AI responses may not always be accurate. You should verify important information.</li>
                            <li><strong>Safety:</strong> While we implement safety filters, unexpected outputs may occur.</li>
                            <li><strong>Not Professional Advice:</strong> The AI Companion is not a substitute for professional medical, legal, or financial advice.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">4. Intellectual Property</h2>
                        <p>
                            The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of SMART मूर्ति and its licensors.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">5. User Accounts</h2>
                        <p>
                            When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">6. Limitation of Liability</h2>
                        <p>
                            In no event shall SMART मूर्ति, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">7. Changes</h2>
                        <p>
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">8. Contact Us</h2>
                        <p>
                            If you have any questions about these Terms, please contact us at support@smartmurti.com.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
