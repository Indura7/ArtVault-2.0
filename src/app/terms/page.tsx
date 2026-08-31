'use client';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
                    <p className="text-gray-700 leading-relaxed">
                        By accessing and using ArtVault, you accept and agree to be bound by the terms and provision of this agreement.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Use License</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Permission is granted to temporarily download one copy of the materials (information or software) on ArtVault for personal, non-commercial transitory viewing only.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        This is the grant of a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 ml-4 mt-2">
                        <li>Modifying or copying the materials</li>
                        <li>Using the materials for any commercial purpose</li>
                        <li>Attempting to decompile or reverse engineer any software</li>
                        <li>Removing any copyright or other proprietary notations</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Disclaimer</h2>
                    <p className="text-gray-700 leading-relaxed">
                        The materials on ArtVault are provided on an 'as is' basis. ArtVault makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Limitations</h2>
                    <p className="text-gray-700 leading-relaxed">
                        In no event shall ArtVault or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ArtVault.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Accuracy of Materials</h2>
                    <p className="text-gray-700 leading-relaxed">
                        The materials appearing on ArtVault could include technical, typographical, or photographic errors. ArtVault does not warrant that any of the materials on ArtVault are accurate, complete, or current.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Modifications</h2>
                    <p className="text-gray-700 leading-relaxed">
                        ArtVault may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Governing Law</h2>
                    <p className="text-gray-700 leading-relaxed">
                        These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                    </p>
                </section>

                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-gray-600 text-sm">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
}