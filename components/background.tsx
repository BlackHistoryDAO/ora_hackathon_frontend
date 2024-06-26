interface BackgroundProps {
  image: string;
  children: React.ReactNode;
}

const Background: React.FC<BackgroundProps> = ({ image, children }) => {
  return (
    <div 
      className="w-full h-full bg-cover bg-center overflow-hidden "
      style={{ backgroundImage: `url(${image})` }}
    >
      {children}
    </div>
  );
}

export default Background;
