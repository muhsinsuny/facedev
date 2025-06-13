interface FooterProps {
  className?: string;
}

function Footer({ className }: FooterProps) {
  return (
    <div className='relative custom-container'>
      <div
        className={`mt-10 border-t border-neutral-300 py-6.5 md:mt-12 ${className}`}
      >
        <div>
          <p className='text-center text-xs-regular md:text-sm-regular text-neutral-600'>
            © 2025 Facedev. Muhsin Suny Blog All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
