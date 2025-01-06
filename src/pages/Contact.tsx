import Header from "@/components/Header";
import { ContactForm } from "@/components/ContactForm";

const Contact = () => {
  return (
    <div className="min-h-screen bg-ethiopian-cream/50">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-ethiopian-coffee mb-6">Contact Us</h1>
          <p className="text-gray-600 mb-8">
            Have a question or need assistance? Fill out the form below and we'll get back to you as soon as possible.
          </p>
          <div className="bg-white rounded-lg shadow-md p-6">
            <ContactForm />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Contact;