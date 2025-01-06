import Header from "@/components/Header";
import { ContactForm } from "@/components/ContactForm";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-site-blue/5 via-white to-site-blue/5">
      <Header />
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-site-black mb-4">Contact Us</h1>
            <p className="text-site-black/80 text-lg">
              Have a question or need assistance? Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <ContactForm />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Contact;