import React, { useState } from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { Button } from '../common/Button';
import { Send, CheckCircle2, AlertCircle, ArrowUpRight, MessageSquare } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/Icons';
import { usePortfolioData } from '../../contexts/PortfolioDataContext';

export const Contact: React.FC = () => {
  const { data, submitInquiry } = usePortfolioData();
  const { profile } = data;

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      setError('Please provide your name, email, and message content.');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const res = await submitInquiry({
        name: formState.name.trim(),
        email: formState.email.trim(),
        subject: formState.subject.trim() || undefined,
        message: formState.message.trim(),
      });

      if (res.success) {
        setSubmitted(true);
      } else {
        setError(res.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred while transmitting your message.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormState({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="06"
          kicker="Contact"
          title="Let’s Build Something Useful"
          description="Have a project or an idea to discuss? Send a message or connect with me on LinkedIn."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Confirmed Channels Column (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="portfolio-card group flex items-center gap-4 p-6 sm:p-7 rounded-2xl bg-white border border-[#E8E4DC] hover:border-[#D5DDD2]">
              <span className="p-3 rounded-xl bg-[#EBF0EA] text-[#4D5E4B]"><LinkedinIcon className="w-5 h-5" /></span>
              <span className="flex-1"><span className="block text-base font-semibold text-[#181A18]">Connect on LinkedIn</span><span className="block text-xs text-[#5D635D] mt-1">Professional updates, projects and collaboration.</span></span>
              <ArrowUpRight className="w-4 h-4 text-[#4D5E4B]" />
            </a>}
            {/* Confirmed GitHub Profile Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E8E4DC] hover:border-[#D5DDD2] transition-colors space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="p-3 rounded-xl bg-[#181A18] text-[#FAF8F5] shrink-0">
                  <GithubIcon className="w-5 h-5" />
                </div>
                
              </div>

              <div>
                <h4 className="text-base font-semibold text-[#181A18]">
                  Explore My Code
                </h4>
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono-code text-xs text-[#4D5E4B] hover:underline inline-flex items-center gap-1 mt-1"
                >
                  <span>github.com/srimanikantakorivi</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <p className="text-xs text-[#5D635D] mt-2 leading-relaxed">
                  Browse my projects and follow what I am building.
                </p>
              </div>
            </div>
          </div>

          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-7 sm:p-9 rounded-2xl bg-white border border-[#E8E4DC]">
              {submitted ? (
                <div className="py-10 text-center space-y-4 animate-in fade-in duration-200">
                  <div className="w-12 h-12 rounded-full bg-[#EBF0EA] text-[#4D5E4B] mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#181A18]">
                    Message Sent
                  </h3>
                  <p className="text-xs sm:text-sm text-[#525852] max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-[#181A18]">{formState.name}</strong>. Your message has been received. I will get back to you using the email you provided.
                  </p>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Send Another Note
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-[#4D5E4B]" />
                    <h3 className="text-base font-semibold text-[#181A18]">
                      Send a Message
                    </h3>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] flex items-center gap-2 text-xs text-[#B91C1C]">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-mono-code font-medium text-[#292F29] mb-1.5">
                        Your Name <span className="text-[#B91C1C]">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        maxLength={100}
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="e.g. Alex Morgan"
                        className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18] placeholder:text-[#9A9E99] focus:outline-none focus:ring-2 focus:ring-[#4D5E4B] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-mono-code font-medium text-[#292F29] mb-1.5">
                        Your Email <span className="text-[#B91C1C]">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        maxLength={255}
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="alex@example.com"
                        className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18] placeholder:text-[#9A9E99] focus:outline-none focus:ring-2 focus:ring-[#4D5E4B] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-mono-code font-medium text-[#292F29] mb-1.5">
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      maxLength={150}
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      placeholder="Project Collaboration / Inquiries"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18] placeholder:text-[#9A9E99] focus:outline-none focus:ring-2 focus:ring-[#4D5E4B] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-mono-code font-medium text-[#292F29] mb-1.5">
                      Message <span className="text-[#B91C1C]">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      maxLength={3000}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Describe your inquiry or topic..."
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18] placeholder:text-[#9A9E99] focus:outline-none focus:ring-2 focus:ring-[#4D5E4B] focus:bg-white transition-all resize-y"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      disabled={submitting}
                      icon={<Send className="w-3.5 h-3.5" />}
                    >
                      {submitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
