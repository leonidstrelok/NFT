import React, { useEffect } from 'react';
import classNames from 'classnames';
import s from './styles.module.scss';
import { useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
import { Cairo } from '../../../public/fonts/cairo/local-font';
import { Raleway } from '../../../public/fonts/raleway/local-font-raleway';

export interface IAppContainerProps {
  className?: string;
  children: React.ReactNode;
}

const AppContainer: React.FC<IAppContainerProps> = (props) => {
  const { children, className = '' } = props;
  const containerClassNames = classNames(s['container'], className);
  const matchesDesktop = useMediaQuery('(min-width:905px)');
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = () => {
      const html = document.querySelector('html');

      if (router.locale === 'en') {
        html.style.fontFamily = Cairo.style.fontFamily;
      } else if (router.locale === 'ru') {
        html.style.fontFamily = Raleway.style.fontFamily;
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.locale]);
  return <div className={containerClassNames}>{children}</div>;
};

export default AppContainer;
