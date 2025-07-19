import Image from "next/image";
import Chat from '@/components/Chat';
import Link from "next/link";

export default function Home() {
  return (
    <div className=''>
      <div className="text-center flex flex-row justify-center gap-20 py-10 bg-gray-900">
        <Link href='/bergs'><p className='text-white pt-1 text-lg'>Bergs</p></Link>
        <p className='text-blue-200 text-2xl'>Icebreaker</p>
        <Link href='/ships' ><p className='text-white pt-1 text-lg'>Ships</p></Link>
      </div>
      <div className='pt-20'>
        <Chat
          title="Icebreaker Chat"
          bodyPlaceholder="Response will appear here..."
          inputPlaceholder="Type a message..."
          aiTag="portfolio-general-chat"
          /> 
      </div>
    </div>
  );
}
