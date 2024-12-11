import React from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import s from './default-layout.module.css';

interface IDefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout: React.FC<IDefaultLayoutProps> = ({ children }) => {
  return (
    <div className={s['default-layout']}>
      <Header />
      <div className={s['content']}>{children}</div>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
