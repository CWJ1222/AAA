import Image from 'next/image';
import qrCodeImage from '../../public/adobe-express-qr-code.png';

const HomePage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-4xl">Welcome to NoticeBoard</h1>
    <div className="mt-20">
      <Image src={qrCodeImage} alt="QR Code" width={200} height={200} />
    </div>
  </div>
);

export default HomePage;