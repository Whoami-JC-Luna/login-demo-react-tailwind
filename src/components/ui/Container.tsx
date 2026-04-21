interface ContainerProps {
  children: React.ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return (
    <div className="max-w-360 mx-auto w-full">
      {children}
    </div>
  );
}