import { Divider, useMediaQuery } from '@mui/material';
import Link from 'next/link';
import AppContainer from './common/container';
import { useTranslation } from 'next-i18next';

export default function Footer() {
  const { t, i18n } = useTranslation('common');
  const matchesDesktop = useMediaQuery('(min-width:905px)');
  return (
    <div className="footer-container">
      <AppContainer>
        {!matchesDesktop ? (
          <div className="footer-wrapper__mobile">
            <div className="footer-left__mobile">
              <Link href="/" passHref>
                <div className="footer-logo">
                  <img
                    src="/assets/svg/logo-goldor.svg"
                    alt=""
                    className="footer-logo__icon"
                    width={120}
                    height={60}
                  />
                </div>
              </Link>
              <Divider orientation="vertical" flexItem />
            </div>
            <Divider
              orientation="horizontal"
              sx={{
                width: '50px',
                height: '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                textAlign: 'center',
                margin: '20px 0',
              }}
            />
            <div className="footer-right__mobile">
              <div className="footer-nav__mobile">
                {/* <Link href="/faq" passHref>
                <div className="footer-name__item">{t('footer.faq')}</div>
              </Link> */}
                <Link href="/" passHref>
                  <div className="footer-nav__item">{t('footer.kaplii')}</div>
                </Link>
                <Link href="/" passHref>
                  <div className="footer-nav__item">
                    {t('footer.privacyPolicy')}
                  </div>
                </Link>
                <Link href="/" passHref>
                  <div className="footer-nav__item">
                    {t('footer.termsAndCondition')}
                  </div>
                </Link>
              </div>
            </div>
            <Divider
              orientation="horizontal"
              sx={{
                width: '50px',
                height: '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                textAlign: 'center',
                margin: '20px 0',
              }}
            />
            <div className="footer-copyright__mobile">
              Ⓒ 2022 GOLDOR. {t('footer.allRightsReserved')}
            </div>
          </div>
        ) : (
          <div className="footer-wrapper">
            <div className="footer-left">
              <Link href="/" passHref>
                <div className="footer-logo">
                  <img
                    src="/assets/svg/logo-goldor.svg"
                    alt=""
                    className="footer-logo__icon"
                    width={120}
                    height={60}
                  />
                </div>
              </Link>
              <Divider orientation="vertical" flexItem />
              <div className="footer-copyright">
                Ⓒ 2022 GOLDOR. {t('footer.allRightsReserved')}
              </div>
            </div>
            <div className="footer-right">
              <div className="footer-nav">
                {/* <Link href="/faq" passHref>
                <div className="footer-name__item">{t('footer.faq')}</div>
              </Link> */}
                <Link href="/" passHref>
                  <div className="footer-nav__item">
                    {t('footer.privacyPolicy')}
                  </div>
                </Link>
                <Link href="/" passHref>
                  <div className="footer-nav__item">
                    {t('footer.termsAndCondition')}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </AppContainer>
    </div>
  );
}
