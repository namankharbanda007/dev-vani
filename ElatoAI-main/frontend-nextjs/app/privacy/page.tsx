
import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-karla">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-3xl md:text-4xl font-bold font-lora text-gray-900 mb-8 border-b pb-4">
                    Privacy Policy
                </h1>

                <div className="prose prose-purple max-w-none text-gray-700 space-y-6">
                    <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
                        <p>
                            <strong>SMART मूर्ति</strong> ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our AI devices.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
                        <p>We may collect information about you in a variety of ways:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and demographic information that you voluntarily give to us when you register with the Services.</li>
                            <li><strong>Voice Data:</strong> To provide our AI conversation services, we process voice inputs. Meaningful conversations may be stored to provide context for your AI companion's memory, subject to your control.</li>
                            <li><strong>Usage Data:</strong> Information about your device, IP address, and how you use our Services.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Provide, operate, and maintain our Services.</li>
                            <li>Improve, personalize, and expand our Services.</li>
                            <li>Develop new products, services, features, and functionality.</li>
                            <li>Communicate with you, either directly or through one of our partners, including for customer service.</li>
                            <li>Process your transactions.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">4. Data Security</h2>
                        <p>
                            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">5. Sharing Your Information</h2>
                        <p>
                            We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">6. Children's Privacy</h2>
                        <p>
                            Our Services are not intended for use by children under the age of 13 without parental consent. We do not knowingly collect personally identifiable information from children under 13. If you become aware that a child has provided us with Personal Data, please contact us.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">7. Contact Us</h2>
                        <p>
                            If you have questions or comments about this Privacy Policy, please contact us at support@smartmurti.com.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
