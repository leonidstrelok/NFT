import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Material UI imports
import {
  Button,
  MenuItem,
  Menu,
  Avatar,
  Divider,
  Backdrop,
  IconButton,
  useMediaQuery,
  Select,
  InputLabel,
} from '@mui/material';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useMetaplex } from '../hooks/useMetaplex';
import GetAuctionHouseAddress from '../pages/api/back/get-auction-house-address';
import { PublicKey } from '@solana/web3.js';

import { useSelector } from 'react-redux';
import { selectThemeColor } from '../store/theme';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useTranslation } from 'next-i18next';
import AppContainer from './common/container';
import LanguageSelector from './common/language-selector';
import { isEmptyObj } from '../pages/api/commo';
import { WRAPPED_SOL_MINT } from '@metaplex-foundation/js';

function reverseString(str) {
  let splitString = str.split('');
  let reverseArray = splitString.reverse();
  let joinArray = reverseArray.join('');
  return joinArray;
}

export default function Header(props) {
  const { t, i18n } = useTranslation('common');

  const router = useRouter();
  const { pathname, asPath, query, locale } = router;
  const [isAdmin, setIsAdmin] = useState(false);
  const { connection } = useConnection();
  const { metaplex } = useMetaplex();
  const [currentPage, setCurrentPage] = useState(props.current);
  const [isInitAuction, setInitAuction] = useState(false);

  const [headers, setHeaders] = useState([
    { id: 1, name: t('header.market'), href: '/auction' },
    { id: 2, name: t('header.createNft'), href: '/nft/create' },
    {
      id: 3,
      name: t('header.createCollection'),
      href: '/collections/create',
    },
    {
      id: 4,
      name: t('header.history'),
      href: '/transaction',
    },
  ]);

  const [isClient, setIsClient] = useState(false);
  const [balance, setBalance] = useState(null);
  const { publicKey, connected } = useWallet();
  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);

  const [accountMenuAnchorEl, setAccountMenuAnchorEl] = useState(null);
  const [accountChangeLanguage, setAccountChangeLanguage] = useState(null);
  const accountMenuOpen = Boolean(accountMenuAnchorEl);
  const accountMenuOpenLanguage = Boolean(accountChangeLanguage);
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false);
  const [auctionHouseAddress, setAuctionHouseAddress] = useState();

  const colorMode = useSelector(selectThemeColor);
  const themeMode = colorMode === 'dark';

  const getBalance = async () => {
    const balance = await connection.getBalance(publicKey);
    
    let balanceStr = String(balance);
    if (balanceStr.length < 10) {
      balanceStr = `0,${balanceStr}`;
    } else {
      balanceStr = reverseString(balanceStr);
      balanceStr = balanceStr.slice(0, 9) + ',' + balanceStr.slice(9);
      balanceStr = reverseString(balanceStr);
    }
    setBalance(balanceStr);
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  const styles = {
    color: 'white',
    backgroundColor: 'DodgerBlue',
    padding: '10px',
    // fontFamily: 'Arial',
  };

  useEffect(() => {
    setIsClient(true);
    const getBalanceAndCheckUser = async () => {
      try {
        if (base58) {
          const auctionHouseAddress = await GetAuctionHouseAddress();
          
          await getBalance();
          
          if (auctionHouseAddress !== '') {
            const getCreator = await metaplex.auctionHouse().findByCreatorAndMint({
              creator: new PublicKey(auctionHouseAddress.auctionHouseAddress),
              treasuryMint: WRAPPED_SOL_MINT
            })
           
            
            const auction = await metaplex.auctionHouse().findByAddress({
              address: getCreator.address,
            });
            
            if (
              metaplex.identity().publicKey.toBase58() ==
              auction.creatorAddress.toBase58()
            ) {
              setIsAdmin(true);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    const isExistAuction = async () => {
      try {
        const auctionHouseAddress = await GetAuctionHouseAddress();

        if (isEmptyObj(auctionHouseAddress)) {
          if (auctionHouseAddress.isExistAddress) {
            setInitAuction(true);
          }
        } else {
          const newHeaders = headers;

          if (newHeaders.length > 2) {
            if (newHeaders[2].id === 3) {
              newHeaders.pop();
            }
          }

          // const publicKey = 'AGh7mSXc9m8RWLfXhRqJuNPx7RuXQJUUvHVpZ8hdaNg9';
          const publicKey = 'DGvZ5nEL7U13a5WZA6VYu2begSnjk8D3JsdwWMsvtveB';
          // const publicKey = 'zkDpbjPMYLHSXZj6EwyrLyx5HZEm3YgDiLzgq9nuWCy';

          if (connected) {
            if (publicKey === metaplex.identity().publicKey.toBase58()) {
              if (headers.filter((p) => p.id !== 5)) {
                newHeaders.push({
                  id: 5,
                  name: t('header.initAuctionHouse'),
                  href: '/admin',
                });
              }
            }
          }

          setHeaders(newHeaders);
        }
      } catch (error) {
        console.error(error);
      }
    };

    isExistAuction();
    getBalanceAndCheckUser();
  }, [base58, connected]);

  const matchesDesktop = useMediaQuery('(min-width:905px)');
  return (
    <>
      <div className="header-container">
        <AppContainer>
          <div className="header-wrapper">
            <div className="header-nav">
              <div className="header-nav__logo" style={{ cursor: 'pointer' }}>
                <Link href="/" passHref legacyBehavior>
                  <img
                    src="/assets/svg/logo-goldor.svg"
                    alt=""
                    width={120}
                    height={60}
                  />
                </Link>
              </div>
              <div className="header-nav__menu">
                {matchesDesktop && (
                  <>
                    {headers.map((item, index) => (
                      <div
                        key={item.name}
                        className={classNames(
                          'header-nav__link',
                          index === currentPage ? '' : '',
                        )}
                      >
                        <Link
                          href={item.href}
                          legacyBehavior
                          className="header-nav__link-local"
                        >
                          <a
                            className="header-nav__link-local"
                            aria-current={
                              index === currentPage ? 'page' : undefined
                            }
                            onClick={() => setCurrentPage(index)}
                          >
                            {item.name}
                          </a>
                        </Link>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
            {!matchesDesktop ? (
              <div className="header-nav__language-selector__mobile">
                <LanguageSelector />
              </div>
            ) : (
              <div className="header-nav__language-selector__desktop">
                <LanguageSelector />
              </div>
            )}

            {matchesDesktop && (
              <>
                {isClient && !base58 ? (
                  <WalletMultiButton className="header-account">
                    <span className="header-account__name">
                      {t('header.connectWallet')}
                    </span>
                  </WalletMultiButton>
                ) : (
                  <>
                    <Button
                      id="account-button"
                      className="header-account"
                      aria-controls={
                        accountMenuOpen ? 'account-menu' : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={accountMenuOpen ? 'true' : undefined}
                      onClick={(e) => {
                        setAccountMenuAnchorEl(e.currentTarget);
                      }}
                    >
                      <Avatar
                        className="header-account__avatar"
                        alt=""
                        src="/assets/svg/user.svg"
                      ></Avatar>
                      <div className="header-account__info">
                        <div className="header-account__username">
                          {base58
                            ? base58.slice(0, 7) + '...' + base58.slice(-4)
                            : '0'}
                        </div>
                        <div className="header-account__balance">
                          {balance} SOL
                        </div>
                      </div>
                    </Button>

                    <Menu
                      className="account-menu"
                      id="account-menu"
                      open={accountMenuOpen}
                      sx={{
                        marginTop: '20px',
                      }}
                      anchorEl={accountMenuAnchorEl}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      onClose={(e) => setAccountMenuAnchorEl(null)}
                    >
                      <Link
                        href="/market/nft-purchased"
                        passHref
                        legacyBehavior
                      >
                        <MenuItem
                          id="1"
                          onClick={(e) => setAccountMenuAnchorEl(null)}
                        >
                          <img src="/assets/svg/purchased.svg" alt="" />
                          {t('header.myNft')}
                        </MenuItem>
                      </Link>
                      <Divider
                        className="account-menu__divider"
                        variant="middle"
                      />
                      <Link href="/collections" passHref legacyBehavior>
                        <MenuItem
                          id="1"
                          onClick={(e) => setAccountMenuAnchorEl(null)}
                        >
                          <img src="/assets/svg/resell.svg" alt="" />
                          {t('header.myCollection')}
                        </MenuItem>
                      </Link>

                      {isAdmin ? (
                        <>
                          <Divider
                            className="account-menu__divider"
                            variant="middle"
                          />
                          <Link href="/fees" passHref legacyBehavior>
                            <MenuItem
                              id="1"
                              onClick={(e) => setAccountMenuAnchorEl(null)}
                            >
                              <img src="/assets/svg/percent.svg" alt="" />
                              <p className="content-page__withdrawal-gradient">
                                {t('header.auctionFees')}
                              </p>
                            </MenuItem>
                          </Link>
                        </>
                      ) : null}
                    </Menu>
                  </>
                )}
              </>
            )}
            {!matchesDesktop && (
              <>
                <IconButton
                  onClick={() => setMobileMenuOpened((current) => !current)}
                >
                  <img src="/assets/svg/menu.svg" />
                </IconButton>
              </>
            )}
          </div>
        </AppContainer>
      </div>
      {!matchesDesktop && (
        <>
          <Backdrop
            sx={{
              color: '#fff',
              zIndex: (theme) => theme.zIndex.drawer + 1,
              background:
                'linear-gradient(198.96deg, rgba(13, 16, 35, 0.5) 5.86%, rgba(20, 26, 52, 0.5) 87.21%)',
              backdropFilter: 'blur(15px)',
            }}
            open={mobileMenuOpened}
          >
            <IconButton
              className="header-mobile__close-btn"
              onClick={() => setMobileMenuOpened((current) => false)}
            >
              <img src="/assets/svg/cross-big.svg" width="32px" />
            </IconButton>
            <div className="header-account header-mobile__account">
              <>
                {isClient && !base58 ? (
                  <WalletMultiButton className="header-account">
                    <span
                      className="header-account__name"
                      onClick={() => setMobileMenuOpened((current) => false)}
                    >
                      {t('header.connectWallet')}
                    </span>
                  </WalletMultiButton>
                ) : (
                  <>
                    <Avatar
                      className="header-account__avatar"
                      alt=""
                      src="/assets/svg/user.svg"
                    ></Avatar>
                    <div className="header-account__info">
                      <div className="header-account__username">
                        {base58
                          ? base58.slice(0, 7) + '...' + base58.slice(-4)
                          : '0'}
                      </div>
                      <div className="header-account__balance">
                        {balance} SOL
                      </div>
                    </div>
                  </>
                )}
              </>
            </div>
            <div className="header-mobile__nav">
              <Link href="/market/nft-purchased" legacyBehavior>
                <div
                  className="header-nav__link header-mobile__link"
                  onClick={() => setMobileMenuOpened(false)}
                >
                  {t('header.myNft')}
                </div>
              </Link>
              <Link href="/collections" legacyBehavior>
                <div
                  className="header-nav__link header-mobile__link"
                  onClick={() => setMobileMenuOpened(false)}
                >
                  {t('header.myCollection')}
                </div>
              </Link>

              {headers.map((item, index) => (
                <Link href={item.href} key={item.name} passHref legacyBehavior>
                  <div
                    className={classNames(
                      'header-nav__link header-mobile__link',
                      index === currentPage ? '' : '',
                    )}
                    onClick={() => setMobileMenuOpened(false)}
                  >
                    <a
                      href={item.href}
                      aria-current={index === currentPage ? 'page' : undefined}
                    >
                      {item.name}
                    </a>
                  </div>
                </Link>
              ))}
            </div>
          </Backdrop>
        </>
      )}
    </>
  );
}
