import React from 'react';
import Footer from '../../components/footer';
import Header from '../../components/header';

interface IMainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<IMainLayoutProps> = (props) => {
  const { children } = props;
  return (
    <>
      <Header />
      <div>{children}</div>
      <Footer />
    </>
  );
};

export default MainLayout;
