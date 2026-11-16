import { useState } from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { ShieldCheck, Calendar } from 'lucide-react';
import { usePortfolioData } from '../../contexts/PortfolioDataContext';
import { ContentBlockRenderer } from '../blocks/ContentBlockRenderer';

export const Certifications = () => {
  const { data } = usePortfolioData();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = data.certifications.find((certificate) => certificate.id === selectedId);

  return <section id="certifications" className="py-20 md:py-28 border-b border-[#E8E4DC] bg-[#FAF8F5]">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader index="05" kicker="Specialized Training" title="Professional Certifications"
        description="Technical credentials and continued learning." />
      <div className="space-y-6">
        {data.certifications.map((certificate) => <article key={certificate.id}
          className="max-w-3xl p-7 sm:p-9 rounded-2xl bg-white border border-[#E8E4DC] space-y-5">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#EBF0EA] text-[#4D5E4B]"><ShieldCheck className="h-6 w-6" /></div>
            <div className="space-y-2 flex-1">
              <h3 className="text-xl font-semibold text-[#181A18]">{certificate.title}</h3>
              <p className="text-sm text-[#4D5E4B]">{certificate.issuer}</p>
              <p className="flex items-center gap-1.5 text-xs text-[#707670]"><Calendar className="h-3.5 w-3.5" />{certificate.issueDate}</p>
            </div>
            {certificate.isVerified && <Badge variant="verified" size="sm">Verified</Badge>}
          </div>
          {certificate.topics.length > 0 && <div className="flex flex-wrap gap-2">
            {certificate.topics.map((topic) => <Badge key={topic} variant="neutral" size="sm">{topic}</Badge>)}
          </div>}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#F0ECE4]">
            <Button variant="outline" size="sm" onClick={() => setSelectedId(certificate.id)}>View details &amp; attachments</Button>
            {certificate.verificationUrl && <Button variant="sage" size="sm" href={certificate.verificationUrl} external>Verify credential</Button>}
          </div>
        </article>)}
      </div>
      {selected && <Modal isOpen onClose={() => setSelectedId(null)} title={selected.title} subtitle={selected.issuer} maxWidth="lg">
        <div className="space-y-5 text-sm text-[#414741]">
          <p>Issued: {selected.issueDate}</p>
          {selected.credentialId && <p>Credential ID: {selected.credentialId}</p>}
          {selected.topics.length > 0 && <ul className="list-disc list-inside space-y-2">{selected.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>}
          {selected.previewDocument && <ContentBlockRenderer block={selected.previewDocument} />}
          {selected.contentBlocks?.map((block) => <ContentBlockRenderer key={block.id} block={block} />)}
        </div>
      </Modal>}
    </div>
  </section>;
};
