import TemplateDetailsView from 'src/sections/organization/templates/template-details/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Template Details',
};

export default function Page({ params: { templateId } }: any) {
  return <TemplateDetailsView modelId={templateId} />;
}
