import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Fade from '@mui/material/Fade';
import s from './styles.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { TFunction, useTranslation } from 'next-i18next';
import classNames from 'classnames';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

type locales = string[];

interface IDropdownMenuProps {
  locales: locales;
  t: TFunction;
  locale: string;
  route: string;
}

const DropdownMenu: React.FC<IDropdownMenuProps> = ({
  locales,
  locale,
  route,
  t,
}) => {
  const router = useRouter();
  const getTanslation = (lc: string) => t(lc);
  const reload = () => {
    router.events.on('routeChangeComplete', () => {
      console.log('here');

      router.reload();
    });
  };
  return (
    <ul className={s['langs']}>
      {locales.map(
        (lacale) =>
          locale != lacale && (
            <li key={lacale}>
              <Link href={route} locale={lacale} legacyBehavior>
                <a onClick={reload} className={`${s['lang']} ${lacale}`}>
                  <span> {getTanslation(lacale)} </span>
                </a>
              </Link>
            </li>
          ),
      )}
    </ul>
  );
};

interface ILanguageSelectorProps {
  className?: string;
}

const LanguageSelector: React.FC<ILanguageSelectorProps> = (props) => {
  const { className } = props;
  const router = useRouter();
  const { locales = [], asPath } = router;
  const [visible, setVisible] = useState<boolean>(false);
  const { t: tLocales } = useTranslation('locales');

  const wrapperClassNames = classNames(s['lang-selector'], className);
  const buttonClassNames = classNames(
    s['lang'],
    router.locale,
    s['lang-button'],
  );

  return (
    <div className={wrapperClassNames}>
      <button className={buttonClassNames} onClick={() => setVisible(!visible)}>
        <Image
          className={s['flag']}
          loading="lazy"
          width={20}
          height={20}
          src={`/icons/language.svg`}
          alt={`${router.locale}`}
        />
        <span> {tLocales(`${router.locale}`)} </span>
        {visible ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </button>
      <Fade in={visible} style={{ zIndex: 1000 }}>
        <div className={s['fade-wrapper']}>
          <DropdownMenu
            locales={locales}
            route={asPath}
            t={tLocales}
            locale={`${router.locale}`}
          />
        </div>
      </Fade>
    </div>
  );
};

export default LanguageSelector;
