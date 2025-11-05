import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="dark bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-24 sm:py-32">
        <article className="prose prose-invert lg:prose-xl mx-auto">
          <h1>Privacy Policy</h1>
          <p className="lead">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <p>FastFind360 ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.</p>

          <h2>1. Information We Collect</h2>
          <p>We may collect information about you in a variety of ways. The information we may collect includes:</p>
          <ul>
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you register with the service or when you choose to participate in various activities related to the service.</li>
            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the service, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the service.</li>
            <li><strong>Geospatial Data:</strong> We utilize and process geospatial data, including satellite imagery and property coordinates, which are primarily sourced from public or third-party providers like Google Open Buildings. This data is generally anonymized and not linked to individuals.</li>
          </ul>

          <h2>2. Use of Your Information</h2>
          <p>Having accurate information permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:</p>
          <ul>
            <li>Create and manage your account.</li>
            <li>Provide our core services, including property classification and data intelligence.</li>
            <li>Communicate with you regarding your account or order.</li>
            <li>Compile anonymous statistical data and analysis for use internally or with third parties.</li>
            <li>Increase the efficiency and operation of the application.</li>
            <li>Monitor and analyze usage and trends to improve your experience.</li>
          </ul>

          <h2>3. Disclosure of Your Information</h2>
          <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
          <ul>
            <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
            <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including data analysis, email delivery, hosting services, and customer service.</li>
            <li><strong>Business Partners:</strong> We may share your information with our business partners (e.g., government agencies, financial institutions) to offer you certain products, services or promotions, as part of our contractual obligations.</li>
          </ul>

          <h2>4. Security of Your Information</h2>
          <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>

          <h2>5. Contact Us</h2>
          <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
          <p>
            FastFind360 Legal Department<br/>
            legal@fastfind360.com
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
