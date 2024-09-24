import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Classes | Kids DIY Platform',
};

export default function Page() {
  return <div className="flex justify-center items-center min-h-screen">
    <iframe
      src="https://sfu.mirotalk.com/newroom"
      width="100%"
      height="700px"
      allow="camera; microphone; fullscreen; display-capture"
      className="border-0"
    />
  </div>;
}