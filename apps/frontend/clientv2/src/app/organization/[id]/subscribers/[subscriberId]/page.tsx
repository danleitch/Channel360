import SubscriberDetailsView from 'src/sections/organization/subscribers/subscriber-details/view';

// ----------------------------------------------------------------------
export const metadata = {
  title: 'Subscriber Details',
};
export default function Page({ params: { subscriberId } }: any) {
  return <SubscriberDetailsView modelId={subscriberId} />;
}
