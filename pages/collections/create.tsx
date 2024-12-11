// Engine
import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Utils
import Sticky from 'react-stickynode';
import {
  categories,
  Category,
  getCategoryByName,
} from '../../utils/categories';
import axios from 'axios';

// Components
import Header from '../../components/header';
import Footer from '../../components/footer';
import { ImageIcon } from '../../components/icons/image';
import { PlusIcon } from '../../components/icons/plus';
import { CollectionCard } from '../../components/card/collection-card';

// UI Elements
import {
  Button,
  MenuItem,
  Select,
  TextField,
  InputAdornment,
  Modal,
  Box,
  Typography,
  useMediaQuery,
  Slider,
  Checkbox,
  SelectChangeEvent,
} from '@mui/material';

// Web3
import { useMetaplex } from '../../hooks/useMetaplex';
import {
  AuctionHouse,
  CreateNftInput,
  formatAmount,
  MetaplexFile,
  PublicKey,
  sol,
  toMetaplexFileFromBrowser,
  WRAPPED_SOL_MINT,
} from '@metaplex-foundation/js';
import { useWallet } from '@solana/wallet-adapter-react';
import GetAuctionHouseAddress from '../api/back/get-auction-house-address';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Diamond from '../../components/nft/classifications/diamonds';
import Wine from '../../components/nft/classifications/wine';
import RealEstate from '../../components/nft/classifications/real-state';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker, MobileDateTimePicker } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import moment from 'moment';
import 'moment/locale/de';
import 'moment/locale/en-gb';
import 'moment/locale/ru';
import { Tag } from '../../components/tag/tag';
import AppContainer from '../../components/common/container';
import s from './styles.module.scss';
import CreateCollectionPageAdaptive from './adaptive/create-collection-adaptive';

const buttonRootStyle = {
  padding: '4px 32px',

  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '16px',
  lineHeight: '42px',
  /* identical to box height, or 262% */

  letterSpacing: '0.744416px',

  color: '#FFFFFF',
  borderRadius: '8px',

  textTransform: 'none !important',
};

const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY;

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#031428',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '20px',
  boxShadow: 24,
  p: 4,
  color: '#fff',
  h4: {
     
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '24px',
    lineHeight: '40px',
    /* identical to box height, or 167% */

    textAlign: 'center',
    letterSpacing: '0.744416px',

    /* Typography/Сolor 1 */

    color: '#FFFFFF',
  },
};

interface NFTFormData {
  logoImage: File;
  bannerImage: File;
  nftImages: File[];
  name: string;
  symbol: string;
  price: number;
  maxPrice: number;
  nftPrice: number;
  royalities: number;
  category: Category;
  attributes?: Map<string, string>;
  collection?: any;
  description: string;
  endTime: string;
  collectionPrice: number;
  collectionVideo: File;
}
const initFormData: NFTFormData = {
  logoImage: null,
  bannerImage: null,
  nftImages: null,
  description: null,
  name: null,
  symbol: null,
  price: 0,
  nftPrice: 0,
  collectionPrice: 0,
  maxPrice: 0,
  royalities: null,
  category: categories.find((cat) => cat.name == 'others'),
  collection: null,
  attributes: new Map<string, string>(),
  endTime: null,
  collectionVideo: null,
};

interface IClassifications {
  id: string;
  name: string;
  description: string;
}

export default function CreateCollectionPage() {
  const { t } = useTranslation('common');
  const { metaplex } = useMetaplex();
  const { publicKey } = useWallet();
  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);

  const [formData, setFormData] = useState(initFormData);

  const [category, setCategory] = useState<string>('others');

  const [newAttributeKey, setNewAttributeKey] = useState('');
  const [newAttributeValue, setNewAttributeValue] = useState('');
  const [classification, setClassification] = useState<IClassifications>();
  const [isPutNftForSale, setPutNftForSale] = useState(false);
  const [createAttrBtnDisabled, setCreateAttrBtnDisabled] = useState(false);
  const [isPreview, setIsPreview] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSetMaxPrice, setSetMaxPrice] = useState(false);
  const [isGarant, setIsGarant] = useState(false);
  const [priceForLogo, setPriceForLogo] = useState('');
  const [priceForBanner, setPriceForBanner] = useState('');
  const [priceForNFTS, setPriceForNFTS] = useState('');
  const [videoPriceForCollection, setVideoPriceForCollection] = useState('');
  // const [usdt, setUsdt] = useState('');

  //#region  WINE
  const [modeProduction, setModeProduction] = useState('default');
  const [typeWine, setTypeWine] = useState('default');
  const [capacity, setCapacity] = useState('default');
  const [rawMaterial, setRawMaterial] = useState('default');
  const [alcohol, setAlcohol] = useState('default');
  const [colorWine, setColorWine] = useState('default');
  const [volume, setVolume] = useState('');
  const [region, setRegion] = useState('');
  const [brand, setBrand] = useState('');
  const [grapeVarieties, setGrapeVarieties] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [fortress, setFortress] = useState('');
  const [numberOfUnits, setNumberOfUnits] = useState('');
  const [cropYear, setCropYear] = useState('');
  const [isAuction, setIsAuction] = useState(false);

  const handleChangeModeProduction = (event: SelectChangeEvent) => {
    setModeProduction(event.target.value as string);
    addAttribute('Mode Production', event.target.value);
  };

  const onChangeCheckboxAuction = (e) => {
    setIsAuction(isAuction ? false : true);
  };

  const handleChangeRegion = (name: string) => {
    setRegion(name);
    addAttribute('Region', name);
  };
  const handleChangeBrand = (name: string) => {
    setBrand(name);
    addAttribute('Brand', name);
  };
  const handleChangeVolume = (name: string) => {
    setVolume(name);
    addAttribute('Volume', name);
  };
  const handleChangeGrapeVarieties = (name: string) => {
    setGrapeVarieties(name);
    addAttribute('Grape Varieties', name);
  };
  const handleChangeManufacturer = (name: string) => {
    setManufacturer(name);
    addAttribute('Manufacturer', name);
  };
  const handleChangeFortress = (name: string) => {
    setFortress(name);
    addAttribute('Fortress', name);
  };
  const handleChangeNumberOfUnits = (name: string) => {
    setNumberOfUnits(name);
    addAttribute('Number of Units', name);
  };
  const handleChangeCropYear = (name: string) => {
    setCropYear(name);
    addAttribute('Crop year', name);
  };

  const handleChangeTypeWine = (event: SelectChangeEvent) => {
    setTypeWine(event.target.value as string);
    addAttribute('Type wine', event.target.value);
  };
  const handleChangeCapacity = (event: SelectChangeEvent) => {
    setCapacity(event.target.value as string);
    addAttribute('Capacity', event.target.value);
  };
  const handleChangeRawMaterial = (event: SelectChangeEvent) => {
    setRawMaterial(event.target.value as string);
    addAttribute('Raw material', event.target.value);
  };
  const handleChangeColorWine = (event: SelectChangeEvent) => {
    setColorWine(event.target.value as string);
    addAttribute('Color wine', event.target.value);
  };
  const handleChangeAlcohol = (event: SelectChangeEvent) => {
    setAlcohol(event.target.value as string);
    addAttribute('Alcohol', event.target.value);
  };
  //#endregion

  //#region REAL ESTATE
  const [luxPropertyType, setLuxPropertyType] = useState('default');
  const [regionEstate, setRegionEstate] = useState('');
  const [realEstateArea, setRealEstateArea] = useState('');
  const [architect, setArchitect] = useState('');
  const [numberRooms, setNumberRooms] = useState('');
  const [star, setStar] = useState([
    {
      name: 'Economy',
      isActive: false,
      countStar: {
        activeComponent: [
          {
            component: (
              <StarIcon
                sx={{
                  width: '20px',
                  height: '20px',
                  color: 'orange',
                }}
              ></StarIcon>
            ),
          },
        ],
        disabledComponent: [
          {
            component: (
              <StarBorderIcon
                sx={{
                  color: 'rgba(255, 255, 255, 0.06)',
                  width: '20px',
                  height: '20px',
                }}
              ></StarBorderIcon>
            ),
          },
        ],
      },
    },
    {
      name: 'Standart',
      isActive: false,
      countStar: {
        activeComponent: [
          {
            component: (
              <StarIcon
                sx={{
                  width: '20px',
                  height: '20px',
                  color: 'orange',
                }}
              ></StarIcon>
            ),
          },
          {
            component: (
              <StarIcon
                sx={{
                  width: '20px',
                  height: '20px',
                  color: 'orange',
                }}
              ></StarIcon>
            ),
          },
        ],
        disabledComponent: [
          {
            component: (
              <StarBorderIcon
                height={14}
                width={16}
                sx={{
                  color: 'rgba(255, 255, 255, 0.06)',
                  width: '20px',
                  height: '20px',
                }}
              ></StarBorderIcon>
            ),
          },
          {
            component: (
              <StarBorderIcon
                sx={{
                  color: 'rgba(255, 255, 255, 0.06)',
                  width: '20px',
                  height: '20px',
                }}
              ></StarBorderIcon>
            ),
          },
        ],
      },
    },
    {
      name: 'Comfort',
      isActive: false,
      countStar: {
        activeComponent: [
          {
            component: (
              <StarIcon
                sx={{
                  width: '20px',
                  height: '20px',
                  color: 'orange',
                }}
              ></StarIcon>
            ),
          },
          {
            component: (
              <StarIcon
                sx={{
                  width: '20px',
                  height: '20px',
                  color: 'orange',
                }}
              ></StarIcon>
            ),
          },
          {
            component: (
              <StarIcon
                sx={{
                  width: '20px',
                  height: '20px',
                  color: 'orange',
                }}
              ></StarIcon>
            ),
          },
        ],
        disabledComponent: [
          {
            component: (
              <StarBorderIcon
                sx={{
                  color: 'rgba(255, 255, 255, 0.06)',
                  width: '20px',
                  height: '20px',
                }}
              ></StarBorderIcon>
            ),
          },
          {
            component: (
              <StarBorderIcon
                sx={{
                  color: 'rgba(255, 255, 255, 0.06)',
                  width: '20px',
                  height: '20px',
                }}
              ></StarBorderIcon>
            ),
          },
          {
            component: (
              <StarBorderIcon
                sx={{
                  color: 'rgba(255, 255, 255, 0.06)',
                  width: '20px',
                  height: '20px',
                }}
              ></StarBorderIcon>
            ),
          },
        ],
      },
    },
    {
      name: 'Prestige',
      isActive: false,
      countStar: {
        activeComponent: [
          {
            component: (
              <StarIcon
                sx={{
                  width: '20px',
                  height: '20px',
                  color: 'orange',
                }}
              ></StarIcon>
            ),
          },
          {
            component: (
              <StarIcon
                sx={{
                  width: '20px',
                  height: '20px',
                  color: 'orange',
                }}
              ></StarIcon>
            ),
          },
          {
            component: (
              <StarIcon
                sx={{
                  width: '20px',
                  height: '20px',
                  color: 'orange',
                }}
              ></StarIcon>
            ),
          },
          {
            component: (
              <StarIcon
                sx={{
                  width: '20px',
                  height: '20px',
                  color: 'orange',
                }}
              ></StarIcon>
            ),
          },
        ],
        disabledComponent: [
          {
            component: (
              <StarBorderIcon
                sx={{
                  color: 'rgba(255, 255, 255, 0.06)',
                  width: '20px',
                  height: '20px',
                }}
              ></StarBorderIcon>
            ),
          },
          {
            component: (
              <StarBorderIcon
                sx={{
                  color: 'rgba(255, 255, 255, 0.06)',
                  width: '20px',
                  height: '20px',
                }}
              ></StarBorderIcon>
            ),
          },
          {
            component: (
              <StarBorderIcon
                sx={{
                  color: 'rgba(255, 255, 255, 0.06)',
                  width: '20px',
                  height: '20px',
                }}
              ></StarBorderIcon>
            ),
          },
          {
            component: (
              <StarBorderIcon
                sx={{
                  color: 'rgba(255, 255, 255, 0.06)',
                  width: '20px',
                  height: '20px',
                }}
              ></StarBorderIcon>
            ),
          },
        ],
      },
    },
    {
      name: 'Lux',
      isActive: false,
      countStar: {
        activeComponent: [
          {
            component: (
              <StarIcon
                sx={{
                  width: '20px',
                  height: '20px',
                  color: 'orange',
                }}
              ></StarIcon>
            ),
          },
          {
            component: (
              <StarIcon
                sx={{
                  width: '20px',
                  height: '20px',
                  color: 'orange',
                }}
              ></StarIcon>
            ),
          },
          {
            component: (
              <StarIcon
                sx={{
                  width: '20px',
                  height: '20px',
                  color: 'orange',
                }}
              ></StarIcon>
            ),
          },
          {
            component: (
              <StarIcon
                sx={{
                  width: '20px',
                  height: '20px',
                  color: 'orange',
                }}
              ></StarIcon>
            ),
          },
          {
            component: (
              <StarIcon
                sx={{
                  width: '20px',
                  height: '20px',
                  color: 'orange',
                }}
              ></StarIcon>
            ),
          },
        ],
        disabledComponent: [
          {
            component: (
              <StarBorderIcon
                sx={{
                  color: 'rgba(255, 255, 255, 0.06)',
                  width: '20px',
                  height: '20px',
                }}
              ></StarBorderIcon>
            ),
          },
          {
            component: (
              <StarBorderIcon
                sx={{
                  color: 'rgba(255, 255, 255, 0.06)',
                  width: '20px',
                  height: '20px',
                }}
              ></StarBorderIcon>
            ),
          },
          {
            component: (
              <StarBorderIcon
                sx={{
                  color: 'rgba(255, 255, 255, 0.06)',
                  width: '20px',
                  height: '20px',
                }}
              ></StarBorderIcon>
            ),
          },
          {
            component: (
              <StarBorderIcon
                sx={{
                  color: 'rgba(255, 255, 255, 0.06)',
                  width: '20px',
                  height: '20px',
                }}
              ></StarBorderIcon>
            ),
          },
          {
            component: (
              <StarBorderIcon
                sx={{
                  color: 'rgba(255, 255, 255, 0.06)',
                  width: '20px',
                  height: '20px',
                }}
              ></StarBorderIcon>
            ),
          },
        ],
      },
    },
  ]);

  const handleChangeRegionEstate = (name: string) => {
    setRegionEstate(name);
    addAttribute('Region', name);
  };
  const handleChangeRealEstateArea = (name: string) => {
    setRealEstateArea(name);
    addAttribute('Real Estate Area', name);
  };
  const handleChangeArchitect = (name: string) => {
    setArchitect(name);
    addAttribute('Architect', name);
  };
  const handleChangeNumberRooms = (name: string) => {
    setNumberRooms(name);
    addAttribute('Number of rooms', name);
  };

  const handleChangeLuxPropertyType = (event: SelectChangeEvent) => {
    setLuxPropertyType(event.target.value as string);
    addAttribute('Lux Property Type', event.target.value);
  };
  const selectClassRealEstate = (nameButton) => {
    const newStar = star.map((p) => {
      if (p.name !== nameButton && p.isActive) {
        p.isActive = false;
      }
      if (p.name === nameButton) {
        p.isActive = true;
      }
      return p;
    });
    const isActiveClass = newStar.filter((p) => {
      if (p.isActive) {
        return p;
      }
    });

    setStar(newStar);
    addAttribute('Class', isActiveClass[0].name);
  };
  //#endregion
  const [color, setColor] = useState('default');
  const [carat, setCarat] = useState('default');
  const [clarity, setClarity] = useState('default');
  const [cut, setCut] = useState('default');

  const handleChangeCarat = (event: SelectChangeEvent) => {
    setCarat(event.target.value as string);
    addAttribute('Carat', event.target.value);
  };
  const handleChangeClarity = (event: SelectChangeEvent) => {
    setClarity(event.target.value as string);
    addAttribute('Clarity', event.target.value);
  };
  const handleChangeCut = (event: SelectChangeEvent) => {
    setCut(event.target.value as string);
    addAttribute('Cut', event.target.value);
  };
  const handleChangeColor = (event: SelectChangeEvent) => {
    setColor(event.target.value as string);
    addAttribute('Color', event.target.value);
  };

  const addAttribute = (key: string, value: string) => {
    setFormData((current) => {
      let { attributes } = current;

      if (attributes == undefined) attributes = new Map<string, string>();
      attributes.set(key, value);

      setNewAttributeKey('');
      setNewAttributeValue('');

      return { ...current, attributes };
    });
  };

  const router = useRouter();

  const [modalState, setModalState] = useState({
    opened: false,
    title: t('create.loading'),
  });

  const getAuctionByCreator = async (): Promise<AuctionHouse> => {
    try {
      const auctionHouseAddress = await GetAuctionHouseAddress();

      const getCreator = await metaplex.auctionHouse().findByCreatorAndMint({
        creator: new PublicKey(auctionHouseAddress.auctionHouseAddress),
        treasuryMint: WRAPPED_SOL_MINT
      })
    
      const auction = await metaplex.auctionHouse().findByAddress({
        address: getCreator.address,
      });

      return auction;
    } catch (error) {
      console.error('Error Get Auction By Creator: ', error);
    }
  };

  const handleCreateAttribute = (e) => {
    if (!newAttributeKey || !newAttributeValue) return;
    if (newAttributeKey.trim() == '' || newAttributeValue.trim() == '') return;

    setFormData((current) => {
      let { attributes } = current;

      if (attributes == undefined) attributes = new Map<string, string>();
      attributes.set(newAttributeKey.trim(), newAttributeValue.trim());

      setNewAttributeKey('');
      setNewAttributeValue('');

      return { ...current, attributes };
    });
  };

  const handleDeleteAttribute = (key) => {
    setFormData((current) => {
      const { attributes } = current;
      if (attributes == undefined) return;
      attributes.delete(key);
      return { ...current, attributes };
    });
  };

  const onLogoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files[0]) {
      const price = await metaplex
        .storage()
        .getUploadPriceForFile(
          await toMetaplexFileFromBrowser(e.target.files[0]),
        );
      const formatPrice = formatAmount(price);
      const cleanPrice = formatPrice.replace('SOL ', '');
      setPriceForLogo(cleanPrice);

      setFormData((current) => {
        return { ...current, logoImage: e.target.files[0] };
      });
    }
  };
  const onBannerChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files[0]) {
      const price = await metaplex
        .storage()
        .getUploadPriceForFile(
          await toMetaplexFileFromBrowser(e.target.files[0]),
        );
      const formatPrice = formatAmount(price);
      const cleanPrice = formatPrice.replace('SOL ', '');

      setPriceForBanner(cleanPrice);
      setFormData((current) => {
        return { ...current, bannerImage: e.target.files[0] };
      });
    }
  };
  const onDescriptionChange = (e) => {
    setFormData((current) => {
      return { ...current, description: e.target.value };
    });
  };
  const onNFTSChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files: File[] = [];
    const metaplexFiles: MetaplexFile[] = [];
    for (let i = 0; i < e.target.files.length; i++) {
      let file = e.target.files[i];
      files.push(file);
      metaplexFiles.push(await toMetaplexFileFromBrowser(e.target.files[i]));
    }

    const price = await metaplex
      .storage()
      .getUploadPriceForFiles(metaplexFiles);
    const formatPrice = formatAmount(price);
    const cleanPrice = formatPrice.replace('SOL ', '');

    setPriceForNFTS(cleanPrice);

    setFormData((current) => {
      return { ...current, nftImages: files };
    });
  };

  const onVideoCollectionChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const result = await toMetaplexFileFromBrowser(e.target.files[0]);
    const price = await metaplex.storage().getUploadPriceForFile(result);
    const formatPrice = formatAmount(price);
    const cleanPrice = formatPrice.replace('SOL ', '');
    setVideoPriceForCollection(cleanPrice);

    setFormData((current) => {
      return { ...current, collectionVideo: e.target.files[0] };
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setModalState({
        opened: true,
        title: t('createCollection.creatingCollection'),
      });

      const uri = await createURI();
      const collectionAddress = await createCollection(uri);
      if (formData.nftImages !== null) {
        await createURIS(collectionAddress);
      }
      router.push('/collections');
    } catch (error) {
      setModalState({
        opened: false,
        title: t('createCollection.failingCreatingNFTCollection'),
      });

      console.error(error);
    }
  };

  // Metaplex
  const createURI = async () => {
    const logoUri = await toMetaplexFileFromBrowser(formData.logoImage);
    const bannerURI = await toMetaplexFileFromBrowser(formData.bannerImage);
    const logoImageUrl = await metaplex.storage().upload(logoUri);
    const bannerImageUrl = await metaplex.storage().upload(bannerURI);
    let collectionVideoUrl = null;
    if (formData.collectionVideo.length > 0) {
      const collectionVideoLocal = await toMetaplexFileFromBrowser(
        formData.collectionVideo,
      );
      collectionVideoUrl = await metaplex
        .storage()
        .upload(collectionVideoLocal);
    }

    const attributes = [{ trait_type: 'category', value: category }];
    formData.attributes.forEach((key, value) => {
      attributes.push({
        trait_type: key,
        value: value,
      });
    });
    let maxPrice = 0;
    let formatPrice = [];
    if (formData.nftImages !== null) {
      const totalPrice = formData.nftImages.length * formData.nftPrice;
      maxPrice = formData.maxPrice + totalPrice;
      formatPrice = maxPrice.toString().split('.');
    } else {
      formatPrice = formData.price.toString().split('.');
    }
    const finalPrice =
      formatPrice.shift() +
      (formatPrice.length ? '.' + formatPrice.join('') : '');
    const uri = await metaplex.storage().uploadJson({
      image: logoImageUrl,
      logo: logoImageUrl,
      banner: bannerImageUrl,
      // sellerFeeBasisPoints: royality / 10,
      name: formData.name,
      attributes: attributes,
      description: formData.description ?? '',
      receiptAddressListings: [],
      price: formData.price ?? '',
      maxPrice: formData.maxPrice ?? '',
      nftPrice: formData.nftPrice ?? formData.price,
      collectionPrice: formData.collectionPrice ?? '',
      endTime: formData.endTime,
      isAuction: isAuction,
      isGarant: isGarant,
      collectionVideo: collectionVideoUrl,
    });

    return uri;
  };

  // Metaplex
  const createURIS = async (collectionAddress) => {
    const auctionHouseAddress = await GetAuctionHouseAddress();
    const attributes = [{ trait_type: 'category', value: category }];
    for (const file of formData.nftImages) {
      const nftImage = await toMetaplexFileFromBrowser(file);
      const nftImagesUrl = await metaplex.storage().upload(nftImage);
      const uri = await metaplex.storage().uploadJson({
        image: nftImagesUrl,
        description: formData.description ?? '',
        name: formData.name,
        attributes: attributes,
        receiptAddressListings: [],
        price: formData.price ?? '',
        nftPrice: formData.nftPrice ?? '',
        endTime: formData.endTime,
        isAuction: isAuction,
        isGarant: isGarant,
      });

      const { nft } = await metaplex.nfts().create({
        name: formData.name,
        // sellerFeeBasisPoints: royality / 10,
        sellerFeeBasisPoints: 0,
        uri: uri,
        isCollection: false,
        collection: collectionAddress,
        collectionAuthority: metaplex.identity(),
      });

      if (auctionHouseAddress.isExistAddress && isPutNftForSale) {
        await createLot(nft.mint.address);
      }
    }
  };

  const createLot = async (mintAddress) => {
    const auction = await getAuctionByCreator();
    const price = formData.price;

    const { listing } = await metaplex.auctionHouse().list(
      {
        auctionHouse: auction,
        mintAccount: mintAddress,
        price: sol(price),
      },
      { commitment: 'confirmed', confirmOptions: { skipPreflight: true } },
    );
  };

  const createCollection = async (uri) => {
    const { nft } = await metaplex.nfts().create({
      name: formData.name,
      description: formData.description ?? '',
      // sellerFeeBasisPoints: royality / 10,
      sellerFeeBasisPoints: 0,
      uri: uri,
      isCollection: true,
      collectionIsSized: true,
    } as CreateNftInput);
    const auctionHouseAddress = await GetAuctionHouseAddress();
    if (auctionHouseAddress.isExistAddress && isPutNftForSale) {
      await createLot(nft.mint.address);
    }

    return nft.address;
  };

  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    if (formData.logoImage || formData.bannerImage || formData.name)
      setIsPreview(false);
    else setIsPreview(true);

    if (
      formData.logoImage &&
      formData.bannerImage &&
      formData.name &&
      formData.category &&
      // formData.price &&
      !modalState.opened
    ) {
      console.log('SUCCESS');

      setIsFormValid(true);
    } else setIsFormValid(false);
    moment.locale(router.locale);
  }, [formData, modalState, router.locale]);

  useEffect(() => {
    if (newAttributeKey.trim() != '' && newAttributeValue.trim() != '') {
      setCreateAttrBtnDisabled(false);
    } else {
      setCreateAttrBtnDisabled(true);
    }
    // const converter = async () => {
    //   const { data } = await axios.get(
    //     'https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT',
    //   );
    //   setUsdt(data.price);
    // };
    // converter();
  }, [newAttributeKey, newAttributeValue]);

  const classifications: IClassifications[] = [
    {
      id: 'jewelry',
      name: 'classificationDiamond',
      description: 'classificationDiamondDescription',
    },
    {
      id: 'wine',
      name: 'classificationWine',
      description: 'classificationWineDescription',
    },
    {
      id: 'realEstate',
      name: 'classificationRealEstate',
      description: 'classificationRealEstateDescription',
    },
  ];

  const onSliderChange = (e) => {
    let royality = e.target?.value * 1000;

    setFormData((current) => {
      return { ...current, royalities: royality };
    });

    // setRoyality(e.target.value);
  };

  const onChangeCheckbox = (e) => {
    setPutNftForSale(isPutNftForSale ? false : true);
  };

  const onChangeCheckboxMaxPrice = (e) => {
    setSetMaxPrice(isSetMaxPrice ? false : true);
  };

  const onChangeCheckboxGarant = (e) => {
    setIsGarant(isGarant ? false : true);
  };

  const onNameChange = (e) => {
    setFormData((current) => {
      return { ...current, name: e.target.value };
    });
  };
  const onChangeEndTime = (e) => {
    setFormData((current) => {
      return { ...current, endTime: e._d.toLocaleString() };
    });
  };

  const onSymbolChange = (e) => {
    setFormData((current) => {
      return { ...current, symbol: e.target.value };
    });
  };

  const onPriceChange = (e) => {
    setFormData((current) => {
      return { ...current, price: e.target.value };
    });
  };

  const onMaxPriceChange = (e) => {
    setFormData((current) => {
      return { ...current, maxPrice: e.target.value };
    });
  };
  const onPriceNFTChange = (e) => {
    setFormData((current) => {
      return { ...current, nftPrice: e.target.value };
    });
  };
  const onCollectionPriceChange = (e) => {
    setFormData((current) => {
      return { ...current, collectionPrice: e.target.value };
    });
  };

  const onCategoryChange = (category: Category) => {
    setFormData((current) => {
      return { ...current, category };
    });
  };

  const onCategoryChangeSelector = (e) => {
    const newCategory = categories.find(
      (cat) => t(`categories.${cat.name}`) === e.target.value,
    );

    setCategory(newCategory.name);

    let [newClassification] = classifications.filter((p) => {
      if (p.id === newCategory.name) {
        return p;
      }
    });
    setClassification(newClassification);
    formData.attributes = new Map<string, string>();

    if (!newCategory) return;
    setFormData((current) => {
      return { ...current, category: newCategory };
    });
  };

  const matchesDesktop = useMediaQuery('(min-width:905px)');

  return (
    <>
      <Head>
        <title>GOLDOR | Create collection</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Header current={2} />
      <AppContainer>
        {!matchesDesktop ? (
          <CreateCollectionPageAdaptive></CreateCollectionPageAdaptive>
        ) : (
          <div className="content-page">
            <Modal open={modalState.opened}>
              <Box sx={style}>
                <h4>{modalState.title}</h4>
              </Box>
            </Modal>
            <div className="content-page__header">
              <div className="content-page__chart">
                <h1 className="content-page__title">
                  {t('createCollection.createCollection')}
                </h1>
                {/* {usdt !== '' ? (
                <div className="content-page__chart__title">
                  1 SOL = ${usdt.replace(/(\.\d*?[1-9])0+$/g, '$1')}
                </div>
              ) : (
                <></>
              )} */}
              </div>

              <p className="content-page__description">
                {t('createCollection.createCurateAndManage')}
              </p>
            </div>
            <div className="content-page__content">
              <form className="content-page__form" onSubmit={handleSubmit}>
                <div className="content-page__form-content">
                  <div className="content-page__form-block">
                    <h4 className="content-page__form_required">
                      {t('createCollection.logoImage')}
                    </h4>
                    <p>{t('create.thisImageWillAlsoForNavigation')}</p>
                    <div className="form-input">
                      <Button
                        variant="outlined"
                        component="label"
                        sx={{
                          ...buttonRootStyle,
                          padding: '0',
                          width: '180px',
                          height: '180px',
                          border:
                            '2px dashed rgba(255, 255, 255, 0.2) !important',
                          borderRadius: '12px',
                          overflow: 'hidden',
                        }}
                      >
                        <input
                          hidden
                          required
                          type="file"
                          name="file"
                          onChange={onLogoChange}
                        />
                        {formData.logoImage ? (
                          <>
                            <img
                              src={URL.createObjectURL(formData.logoImage)}
                              alt=""
                              style={{
                                height: '100%',
                                width: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          </>
                        ) : (
                          <div className="flex flex-col items-center">
                            <img src="/assets/svg/add-file-icon.svg" alt="" />
                            <p>{t('create.addFile')} +</p>
                          </div>
                        )}
                      </Button>
                    </div>
                    <div
                      style={{
                        paddingLeft: '6%',
                        paddingTop: '3%',
                        color: 'white',
                      }}
                    >
                      {priceForLogo ? (
                        <>
                          <p style={{ paddingLeft: '20px', color: 'white' }}>
                            {t('create.priceForFile')}
                          </p>
                          <p style={{ color: 'white' }}>{priceForLogo} SOL</p>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  <div className="content-page__form-block">
                    <h4 className="content-page__form_required">
                      {t('createCollection.bannerImage')}
                    </h4>
                    <p>{t('create.thisImageWillAlsoForNavigation')}</p>
                    <div className="form-input">
                      <Button
                        variant="outlined"
                        component="label"
                        sx={{
                          ...buttonRootStyle,
                          padding: '0',
                          width: '180px',
                          height: '180px',
                          border:
                            '2px dashed rgba(255, 255, 255, 0.2) !important',
                          borderRadius: '12px',
                          overflow: 'hidden',
                        }}
                      >
                        <input
                          hidden
                          required
                          type="file"
                          name="file"
                          onChange={onBannerChange}
                        />
                        {formData.bannerImage ? (
                          <>
                            <img
                              src={URL.createObjectURL(formData.bannerImage)}
                              alt=""
                              style={{
                                height: '100%',
                                width: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          </>
                        ) : (
                          <div className="flex flex-col items-center">
                            <img src="/assets/svg/add-file-icon.svg" alt="" />
                            <p>{t('create.addFile')} +</p>
                          </div>
                        )}
                      </Button>
                    </div>
                    <div
                      style={{
                        paddingLeft: '6%',
                        paddingTop: '3%',
                        color: 'white',
                      }}
                    >
                      {priceForBanner ? (
                        <>
                          <p style={{ paddingLeft: '20px', color: 'white' }}>
                            {t('create.priceForFile')}
                          </p>
                          <p style={{ color: 'white' }}>{priceForBanner} SOL</p>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  <div className="content-page__form-block">
                    <h4 className="content-page__form">
                      {t('createCollection.nftImages')}
                    </h4>
                    <p>{t('create.thisImageWillAlsoForNavigation')}</p>
                    <div className="form-input">
                      <Button
                        variant="outlined"
                        component="label"
                        sx={{
                          ...buttonRootStyle,
                          padding: '0',
                          width: '180px',
                          height: '180px',
                          border:
                            '2px dashed rgba(255, 255, 255, 0.2) !important',
                          borderRadius: '12px',
                          overflow: 'hidden',
                        }}
                      >
                        <input
                          hidden
                          multiple
                          type="file"
                          name="file"
                          onChange={onNFTSChange}
                        />
                        {formData.nftImages ? (
                          <>
                            <img
                              src={URL.createObjectURL(formData.nftImages[0])}
                              alt=""
                              style={{
                                height: '100%',
                                width: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          </>
                        ) : (
                          <div className="flex flex-col items-center">
                            <img src="/assets/svg/add-file-icon.svg" alt="" />
                            <p>{t('create.addFile')} +</p>
                          </div>
                        )}
                      </Button>
                    </div>
                    <div
                      style={{
                        paddingLeft: '6%',
                        paddingTop: '3%',
                        color: 'white',
                      }}
                    >
                      {priceForNFTS ? (
                        <>
                          <p style={{ paddingLeft: '20px', color: 'white' }}>
                            {t('create.priceForFile')}
                          </p>
                          <p style={{ color: 'white' }}>{priceForNFTS} SOL</p>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  <div className="content-page__form-block">
                    <h4 className="content-page__form">
                      {t('collections.collectionVideos')}
                    </h4>
                    <div className="form-input">
                      <Button
                        variant="outlined"
                        component="label"
                        sx={{
                          ...buttonRootStyle,
                          padding: '0',
                          width: '180px',
                          height: '180px',
                          border:
                            '2px dashed rgba(255, 255, 255, 0.2) !important',
                          borderRadius: '12px',
                          overflow: 'hidden',
                        }}
                      >
                        <input
                          hidden
                          multiple
                          type="file"
                          name="file"
                          onChange={onVideoCollectionChange}
                        />
                        {formData.collectionVideo ? (
                          <>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              {t('collections.completed')}
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center">
                            <img src="/assets/svg/add-file-icon.svg" alt="" />
                            <p>{t('create.addFile')} +</p>
                          </div>
                        )}
                      </Button>
                    </div>
                    <div
                      style={{
                        paddingLeft: '6%',
                        paddingTop: '3%',
                        color: 'white',
                      }}
                    >
                      {videoPriceForCollection ? (
                        <>
                          <p style={{ paddingLeft: '20px', color: 'white' }}>
                            {t('create.priceForFile')}
                          </p>
                          <p style={{ color: 'white' }}>
                            {videoPriceForCollection} SOL
                          </p>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  <div className="content-page__form-block">
                    <h4 className="content-page__form_required">
                      {t('createCollection.collectionName')}
                    </h4>
                    <input
                      onChange={onNameChange}
                      className="form-block__input text-[#B4BAEF] text-sm p-3.5 rounded-md border border-[#9FA4FF] bg-[#212760] dark:bg-white focus:outline-none focus:ring-2"
                      placeholder={t('createCollection.enterCollectionName')}
                    />
                  </div>
                  <div className="content-page__form-block">
                    <h4 className="content-page__form_required">
                      {t('create.collectionPrice')}
                    </h4>
                    <div className="form-input">
                      <TextField
                        placeholder={t('create.collectionPrice')}
                        name="name"
                        // type="number"
                        // inputProps={{ inputMode: 'decimal' }}
                        required
                        sx={{
                          '.MuiOutlinedInput-input': {
                            paddingLeft: '20px',
                            paddingTop: '4px',
                            paddingBottom: '4px',
                            fontSize: '16px',
                            lineHeight: '42px',
                            height: '42px',
                          },
                        }}
                        onChange={onCollectionPriceChange}
                      ></TextField>
                    </div>
                  </div>
                  <div className="content-page__form-block">
                    <h4 className="content-page__form">{t('create.sumNFT')}</h4>
                    <div className="form-input">
                      <TextField
                        placeholder={t('create.sumNFT')}
                        name="name"
                        // type="number"
                        // inputProps={{ inputMode: 'decimal' }}
                        sx={{
                          '.MuiOutlinedInput-input': {
                            paddingLeft: '20px',
                            paddingTop: '4px',
                            paddingBottom: '4px',
                            fontSize: '16px',
                            lineHeight: '42px',
                            height: '42px',
                          },
                        }}
                        onChange={onPriceNFTChange}
                      ></TextField>
                    </div>
                  </div>
                  <div className="content-page__form-block">
                    <h4 className="content-page__form_required">
                      {t('nfts.putTheNFT')}
                    </h4>
                    <div className="form-input">
                      <div>
                        <Checkbox
                          value={isPutNftForSale}
                          onChange={onChangeCheckbox}
                          style={{
                            width: '0',
                            backgroundColor: 'transparent',
                            paddingRight: '30px',
                          }}
                        />
                        <span>{t('nfts.thisItemWillAddCollection')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="content-page__form-block">
                    <h4 className="content-page__form_required">
                      {t('create.maxSum')}
                    </h4>
                    <div className="form-input">
                      <div>
                        <Checkbox
                          value={isSetMaxPrice}
                          onChange={onChangeCheckboxMaxPrice}
                          style={{
                            width: '0',
                            backgroundColor: 'transparent',
                            paddingRight: '30px',
                          }}
                        />
                        <span>{t('create.ifAddField')}</span>
                      </div>
                    </div>
                  </div>
                  {isSetMaxPrice ? (
                    <div className="content-page__form-block">
                      <h4 className="content-page__form_required">
                        {t('create.maxSum')}
                      </h4>
                      <div className="form-input">
                        <TextField
                          placeholder={t('create.enterNFTPriceMax')}
                          name="name"
                          // type="number"
                          // inputProps={{ inputMode: 'decimal' }}
                          required
                          sx={{
                            '.MuiOutlinedInput-input': {
                              paddingLeft: '20px',
                              paddingTop: '4px',
                              paddingBottom: '4px',
                              fontSize: '16px',
                              lineHeight: '42px',
                              height: '42px',
                            },
                          }}
                          onChange={onMaxPriceChange}
                        ></TextField>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}

                  <div className="content-page__form-block">
                    <h4 className="content-page__form_required">
                      {t('create.isAuction')}
                    </h4>
                    <div className="form-input">
                      <div>
                        <Checkbox
                          value={isAuction}
                          onChange={onChangeCheckboxAuction}
                          style={{
                            width: '0',
                            backgroundColor: 'transparent',
                            paddingRight: '30px',
                          }}
                        />
                        <span>{t('create.isSelectAuction')}</span>
                      </div>
                    </div>
                  </div>
                  {isAuction ? (
                    <div className="content-page__form-block">
                      <h4 className="content-page__form_required">
                        {t('create.endDate')}
                      </h4>
                      <div className={`form-input ${s['date-picker']}`}>
                        <LocalizationProvider
                          dateAdapter={AdapterMoment}
                          adapterLocale={router.locale}
                        >
                          <MobileDateTimePicker
                            openTo="day"
                            disablePast
                            onChange={onChangeEndTime}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}

                  <div className="content-page__form-block">
                    <h4 className="content-page__form_required">
                      {t('auction.category')}
                    </h4>
                    <div className="form-input">
                      <Select
                        value={
                          formData.category
                            ? t(`categories.${formData.category.name}`)
                            : ''
                        }
                        onChange={onCategoryChangeSelector}
                        placeholder={t('auction.selectCategory')}
                        required
                        sx={{
                          '.MuiOutlinedInput-input': {
                            paddingLeft: '20px',
                            paddingTop: '4px',
                            paddingBottom: '4px',
                            fontSize: '16px',
                            lineHeight: '42px',
                            height: '42px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            '>img': {
                              height: '24px',
                            },
                          },
                        }}
                      >
                        {categories.map((category, index) => (
                          <MenuItem
                            key={index}
                            value={t(`categories.${category.name}`)}
                          >
                            <img src={category.iconFlat} alt="" />{' '}
                            {t(`categories.${category.name}`)}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                  {classification ? (
                    <div className="content-page__form-block">
                      <h4 className="content-page__form_">
                        {t(`create.${classification.name}`)}
                      </h4>
                      <p>{t(`create.${classification.description}`)}</p>
                      <div className="form-input">
                        {category === 'jewelry' && (
                          <Diamond
                            color={color}
                            handleChangeColor={handleChangeColor}
                            carat={carat}
                            clarity={clarity}
                            cut={cut}
                            handleChangeCarat={handleChangeCarat}
                            handleChangeClarity={handleChangeClarity}
                            handleChangeCut={handleChangeCut}
                          />
                        )}
                        {category === 'wine' && (
                          <Wine
                            alcohol={alcohol}
                            brand={brand}
                            capacity={capacity}
                            color={colorWine}
                            cropYear={cropYear}
                            fortress={fortress}
                            grapeVarieties={grapeVarieties}
                            manufacturer={manufacturer}
                            modeProduction={modeProduction}
                            numberOfUnits={numberOfUnits}
                            rawMaterial={rawMaterial}
                            region={region}
                            typeWine={typeWine}
                            volume={volume}
                            handleChangeAlcohol={handleChangeAlcohol}
                            handleChangeBrand={handleChangeBrand}
                            handleChangeCapacity={handleChangeCapacity}
                            handleChangeColor={handleChangeColorWine}
                            handleChangeCropYear={handleChangeCropYear}
                            handleChangeFortress={handleChangeFortress}
                            handleChangeGrapeVarieties={
                              handleChangeGrapeVarieties
                            }
                            handleChangeManufacturer={handleChangeManufacturer}
                            handleChangeModeProduction={
                              handleChangeModeProduction
                            }
                            handleChangeNumberOfUnits={
                              handleChangeNumberOfUnits
                            }
                            handleChangeRawMaterial={handleChangeRawMaterial}
                            handleChangeRegion={handleChangeRegion}
                            handleChangeTypeWine={handleChangeTypeWine}
                            handleChangeVolume={handleChangeVolume}
                          />
                        )}
                        {category === 'realEstate' && (
                          <RealEstate
                            architect={architect}
                            handleChangeArchitect={handleChangeArchitect}
                            handleChangeNumberRooms={handleChangeNumberRooms}
                            handleChangeRealEstateArea={
                              handleChangeRealEstateArea
                            }
                            handleChangeRegion={handleChangeRegionEstate}
                            luxPropertyType={luxPropertyType}
                            numberRooms={numberRooms}
                            realEstateArea={realEstateArea}
                            regionEstate={regionEstate}
                            selectClassRealEstate={selectClassRealEstate}
                            star={star}
                            handleChangeLuxPropertyType={
                              handleChangeLuxPropertyType
                            }
                          ></RealEstate>
                        )}
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  <div className="content-page__form-block">
                    <h4>{t('auction.attribute')}</h4>
                    <p>{t('create.addAnyItemProperties')}</p>
                    <div className="form-input">
                      <div className="flex flex-row flex-wrap gap-3 items-end">
                        <label>
                          <p className="caption1">{t('create.key')}</p>
                          <TextField
                            placeholder={t('create.forExampleKey')}
                            sx={{
                              '.MuiOutlinedInput-input': {
                                paddingLeft: '20px',
                                paddingTop: '4px',
                                paddingBottom: '4px',
                                fontSize: '16px',
                                lineHeight: '42px',
                                height: '42px',
                              },
                              width: '264px',
                            }}
                            value={newAttributeKey}
                            onChange={(e) => setNewAttributeKey(e.target.value)}
                          ></TextField>
                        </label>
                        <label>
                          <p className="caption1">{t('create.value')}</p>
                          <TextField
                            placeholder={t('create.forExampleValue')}
                            sx={{
                              '.MuiOutlinedInput-input': {
                                paddingLeft: '20px',
                                paddingTop: '4px',
                                paddingBottom: '4px',
                                fontSize: '16px',
                                lineHeight: '42px',
                                height: '42px',
                              },
                              width: '264px',
                            }}
                            value={newAttributeValue}
                            onChange={(e) =>
                              setNewAttributeValue(e.target.value)
                            }
                          ></TextField>
                        </label>
                        <Button
                          variant="outlined"
                          sx={{
                            ...buttonRootStyle,
                            height: '50px',
                            border:
                              '1px solid rgba(255, 255, 255, 0.16) !important',
                          }}
                          onClick={handleCreateAttribute}
                          disabled={createAttrBtnDisabled}
                        >
                          {t('create.createNFT')}
                        </Button>
                      </div>
                    </div>
                    <div className="flex row gap-3 mt-4">
                      {formData.attributes &&
                        Array.from(formData.attributes, ([key, value]) => ({
                          key,
                          value,
                        })).map((attr) => (
                          <Tag
                            key={attr.key}
                            title={attr.key}
                            subtitle={attr.value}
                            id={attr.key}
                            onDelete={handleDeleteAttribute}
                          />
                        ))}
                    </div>
                  </div>
                  <div className="content-page__form-block">
                    <h4>{t('auction.description')}</h4>
                    <div className="form-input">
                      <TextField
                        placeholder={t('create.enterDescription')}
                        sx={{
                          '.MuiOutlinedInput-input': {
                            fontSize: '16px',
                            lineHeight: '42px',
                            height: '42px',
                          },
                          '.MuiOutlinedInput-root': {
                            paddingTop: '4px',
                          },
                        }}
                        multiline
                        rows={3}
                        onChange={onDescriptionChange}
                      ></TextField>
                    </div>
                  </div>
                  <div className="content-page__form-actions">
                    <Button
                      variant="contained"
                      sx={{
                        ...buttonRootStyle,
                        minWidth: '189px',
                        background:
                          'linear-gradient(141.56deg, #365FFA -4.76%, #A736E0 120.26%) !important',
                      }}
                      type="submit"
                      disabled={!isFormValid}
                    >
                      {t('create.createNft')}
                    </Button>
                  </div>
                </div>
                {matchesDesktop && (
                  <div className="content-page__form-preview">
                    <Sticky
                      top={140}
                      bottomBoundary=".collection-create__preview-wrap"
                    >
                      <CollectionCard
                        name={formData.name}
                        logo={
                          formData.logoImage
                            ? URL.createObjectURL(formData.logoImage)
                            : null
                        }
                        price={
                          formData.collectionPrice &&
                          formData.collectionPrice.toString() != ''
                            ? formData.collectionPrice.toString()
                            : '0'
                        }
                        count={formData.nftImages?.length}
                        banner={
                          formData.bannerImage
                            ? URL.createObjectURL(formData.bannerImage)
                            : null
                        }
                        category={getCategoryByName(category)}
                        isPreview={isPreview}
                      />
                      <i className="dummy-bg" style={{ height: '340px' }} />
                    </Sticky>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </AppContainer>
      <Footer />
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}
