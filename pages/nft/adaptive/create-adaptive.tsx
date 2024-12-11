import {
  useState,
  useRef,
  useEffect,
  useMemo,
  FormEvent,
  ChangeEvent,
  useCallback,
} from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../../components/header';
import Footer from '../../../components/footer';
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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import {
  categories,
  Category,
  getCategoryByName,
} from '../../../utils/categories';
import { Tag } from '../../../components/tag/tag';
import Sticky from 'react-stickynode';
import { useMetaplex } from '../../../hooks/useMetaplex';
import {
  Nft,
  CreateNftInput,
  PublicKey,
  toMetaplexFileFromBrowser,
  Signer,
  IdentityClient,
  FindNftsByOwnerOutput,
  IdentitySigner,
  walletAdapterIdentity,
  VerifyNftCollectionInput,
  JsonMetadata,
  Metadata,
  AuctionHouse,
  sol,
  formatAmount,
  WRAPPED_SOL_MINT,
} from '@metaplex-foundation/js';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { flexbox } from '@mui/system';
import GetAuctionHouseAddress from '../../api/back/get-auction-house-address';
import { current } from '@reduxjs/toolkit';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Diamond from '../../../components/nft/classifications/diamonds';
import Wine from '../../../components/nft/classifications/wine';
import RealEstate from '../../../components/nft/classifications/real-state';
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
import AppContainer from '../../../components/common/container';
import s from './styles.module.scss';
import NftCard from '../../../components/nft/card';

const buttonRootStyle = {
  width: '100%',
  height: '50px',

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

interface NFTFormData {
  file: File;
  name: string;
  symbol: string;
  maxPrice: number;
  nftPrice: number;
  royalities: number;
  category: Category;
  attributes?: Map<string, string>;
  collection?: any;
  description: string;
  endTime: string;
}

const initFormData: NFTFormData = {
  file: null,
  description: null,
  name: null,
  symbol: null,
  nftPrice: 0,
  maxPrice: 0,
  royalities: null,
  category: categories.find((cat) => cat.name == 'others'),
  collection: null,
  attributes: new Map<string, string>(),
  endTime: null,
};

interface IClassifications {
  id: string;
  name: string;
  description: string;
}

export default function CreateNFTPageAdaptive() {
  const { t } = useTranslation('common');
  const { metaplex } = useMetaplex();

  const { publicKey } = useWallet();
  const router = useRouter();
  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
  const [color, setColor] = useState('default');

  const [formData, setFormData] = useState(initFormData);
  const [props, setProps] = useState<any>({});
  const [classification, setClassification] = useState<IClassifications>();
  const [category, setCategory] = useState<string>();
  const [isPreview, setIsPreview] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isPutNftForSale, setPutNftForSale] = useState(false);
  const [isAuction, setIsAuction] = useState(false);
  const [isSetMaxPrice, setSetMaxPrice] = useState(false);
  const [isGarant, setIsGarant] = useState(false);

  const [newAttributeKey, setNewAttributeKey] = useState('');
  const [royality, setRoyality] = useState(0);
  const [newAttributeValue, setNewAttributeValue] = useState('');
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

  const handleChangeModeProduction = (event: SelectChangeEvent) => {
    setModeProduction(event.target.value as string);
    addAttribute('Mode Production', event.target.value);
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

  const [modalState, setModalState] = useState({
    opened: false,
    title: t('create.loading'),
  });

  const [myCollections, setMycollections] = useState([]);

  const [carat, setCarat] = useState('default');
  const [clarity, setClarity] = useState('default');
  const [cut, setCut] = useState('default');
  const [priceForFile, setPriceForFile] = useState('');

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

  useEffect(() => {
    const LoadNFTs = async () => {
      const myCollections = await metaplex.nfts().findAllByOwner({
        owner: metaplex.identity().publicKey,
      });

      const loadedItems = await Promise.all(
        myCollections
          .filter((nft) => nft.collectionDetails !== null)
          .map(async (nft: Metadata<JsonMetadata<string>>) => {
            const { data } = await axios.get(nft.uri);
            return {
              ...data,
              creator: nft.creators[0].address.toBase58(),
              id: nft.address.toBase58(),
              size: nft.collectionDetails.size.toString(),
              address: nft.mintAddress,
            };
          }),
      );

      // const converter = async () => {
      //   const { data } = await axios.get(
      //     'https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT',
      //   );
      //   setUsdt(data.price);
      // };
      // converter();
      setMycollections(loadedItems);
    };

    moment.locale(router.locale);
    base58 && LoadNFTs();
  }, [base58, metaplex, router.locale]);

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const price = await metaplex
      .storage()
      .getUploadPriceForFile(
        await toMetaplexFileFromBrowser(e.target.files[0]),
      );
    const formatPrice = formatAmount(price);
    const cleanPrice = formatPrice.replace('SOL ', '');

    setPriceForFile(cleanPrice);
    setFormData((current) => {
      return { ...current, file: e.target.files[0] };
    });
  };

  const onSliderChange = (e) => {
    let royality = e.target?.value * 1000;

    setFormData((current) => {
      return { ...current, royalities: royality };
    });

    setRoyality(e.target.value);
  };

  const onChangeCheckbox = (e) => {
    setPutNftForSale(isPutNftForSale ? false : true);
  };
  const onChangeCheckboxAuction = (e) => {
    setIsAuction(isAuction ? false : true);
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

  const onCategoryChange = (category: Category) => {
    setFormData((current) => {
      return { ...current, category };
    });
  };

  const onCategoryChangeSelector = (e) => {
    const newCategory = categories.find(
      (cat) => t(`categories.${cat.name}`) == e.target.value,
    );

    setCategory(newCategory.name);

    let [newClassification] = classifications.filter((p) => {
      if (p.id === newCategory.name) {
        return p;
      }
    });
    setClassification(newClassification);

    if (!newCategory) return;
    setFormData((current) => {
      return { ...current, category: newCategory };
    });
  };

  const onCollectionChangeSelector = (e) => {
    const newCollection = myCollections.find((collection) => {
      if (collection.id == e.target.value) {
        return collection;
      }
    });
    setFormData((current) => {
      return {
        ...current,
        collection: newCollection ?? undefined,
        category:
          newCollection == undefined
            ? getCategoryByName('others')
            : getCategoryByName(newCollection.attributes[0].value),
      };
    });
  };

  const onDescriptionChange = (e) => {
    setFormData((current) => {
      return { ...current, description: e.target.value };
    });
  };

  function handleValidateForm() {}

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const attributes = [];
    formData.attributes.forEach((key, value) => {
      attributes.push({
        trait_type: key,
        value: value,
      });
    });
    const data = {
      name: formData.name,
      category: formData.category.name,
      file: formData.file,
      attributes: attributes,
      description: formData.description,
    };

    try {
      setModalState({
        opened: true,
        title: t('create.creatingNFT'),
      });
      const uri = await createURI(data);
      await creactNft(uri);

      router.push('/market/nft-purchased');
    } catch (error) {
      setModalState({
        opened: false,
        title: t('create.failingCreatingNFT'),
      });
      console.error(error);
    }
  };

  const [createAttrBtnDisabled, setCreateAttrBtnDisabled] = useState(true);
  useEffect(() => {
    if (newAttributeKey.trim() != '' && newAttributeValue.trim() != '') {
      setCreateAttrBtnDisabled(false);
    } else {
      setCreateAttrBtnDisabled(true);
    }
  }, [newAttributeKey, newAttributeValue]);

  useEffect(() => {
    if (formData.file || formData.name) setIsPreview(false);
    else setIsPreview(true);

    if (
      formData.file &&
      formData.name &&
      formData.category &&
      formData.nftPrice &&
      !modalState.opened
    )
      setIsFormValid(true);
    else setIsFormValid(false);

    console.log(formData);
  }, [formData, modalState]);

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

  // Metaplex
  const createURI = async (data) => {
    let attributes = data.attributes ?? [];

    attributes = [
      { trait_type: 'category', value: data.category },
      ...attributes,
    ];
    const imgUrl = await metaplex
      .storage()
      .upload(await toMetaplexFileFromBrowser(data.file));

    const json = {
      image: imgUrl,
      name: data.name,
      attributes: attributes,
      seller_fee_basis_points: formData.royalities,
      description: data.description ?? '',
      maxPrice: formData.maxPrice ?? '',
      nftPrice: formData.nftPrice,
      endTime: formData.endTime,
      receiptAddressListings: [],
      isAuction: isAuction,
    };
    const uri = await metaplex.storage().uploadJson(json);

    // const uri = await metaplex.nfts().uploadMetadata(
    //   {
    //     image: await toMetaplexFileFromBrowser(data.file),
    //     name: data.name,
    //     attributes: attributes,
    //     seller_fee_basis_points: formData.royalities,
    //     description: data.description ?? '',
    //   },
    //   {
    //     confirmOptions: { skipPreflight: true, commitment: 'finalized' },
    //     commitment: 'finalized',
    //   },
    // );

    return uri;
  };

  const creactNft = async (uri) => {
    const auction = await getAuctionByCreator();
    const data: CreateNftInput = {
      name: formData.name,
      uri: uri,
      isCollection: false,
      collection: formData.collection?.address,
      sellerFeeBasisPoints: 0,
      collectionAuthority: formData.collection
        ? (metaplex.identity() as IdentitySigner)
        : null,
    };
    const nft = await metaplex.nfts().create(data, {
      confirmOptions: { skipPreflight: true, commitment: 'confirmed' },
    });

    // const nft = await metaplex.nfts().create(data);
    const auctionHouseAddress = await GetAuctionHouseAddress();
    if (auctionHouseAddress.isExistAddress && isPutNftForSale) {
      const { listing } = await metaplex.auctionHouse().list({
        auctionHouse: auction,
        mintAccount: nft.mintAddress,
        price: sol(formData.nftPrice),
      });
    }
  };

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

  const matchesDesktop = useMediaQuery('(min-width:905px)');

  return (
    <>
      <div className="content-page__mobile">
        <Modal open={modalState.opened}>
          <Box sx={style}>
            <h4>{modalState.title}</h4>
          </Box>
        </Modal>
        <div className="content-page__mobile__header">
          <div className="content-page__mobile__header__chart">
            <div className="content-page__mobile__header__chart__title">
              {t('create.createNewNFT')}
            </div>
            {/* {usdt !== '' ? (
                  <div className="content-page__chart__title">
                    1 SOL = ${usdt.replace(/(\.\d*?[1-9])0+$/g, '$1')}
                  </div>
                ) : (
                  <></>
                )} */}
          </div>
          <div className="content-page__mobile__description">
            {t('create.createYourNewNFT')}
          </div>
        </div>
        <div className="content-page__mobile__content">
          <form
            className="content-page__mobile__content__form"
            onSubmit={handleSubmit}
          >
            <div className="content-page__mobile__content__form__form-content">
              <div className="content-page__form-block">
                <h4 className="content-page__form_required">
                  {t('create.uploadFile')}
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
                      border: '2px dashed rgba(255, 255, 255, 0.2) !important',
                      borderRadius: '12px',
                      overflow: 'hidden',
                    }}
                  >
                    <input
                      hidden
                      required
                      type="file"
                      name="file"
                      onChange={onFileChange}
                    />
                    {formData.file ? (
                      <>
                        <img
                          src={URL.createObjectURL(formData.file)}
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
                  {priceForFile ? (
                    <>
                      <p>{t('create.priceForFile')}</p>
                      <p>{priceForFile} SOL</p>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="content-page__form-block">
                <h4 className="content-page__form_required">
                  {t('create.nftName')}
                </h4>
                <div className="form-input">
                  <TextField
                    placeholder={t('create.enterNftName')}
                    name="name"
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
                    onChange={onNameChange}
                  ></TextField>
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
                    <span>{t('nfts.thisItemWillAdd')}</span>
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
                      // type={'number'}
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
              <div className="content-page__form-block">
                <h4 className="content-page__form_required">
                  {t('create.sumNFT')}
                </h4>
                <div className="form-input">
                  <TextField
                    placeholder={t('create.enterSumNFT')}
                    name="name"
                    required
                    // type={'number'}
                    // InputProps={{ inputMode: 'decimal' }}
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
                <h4 className="content-page__form_">
                  {t('header.myCollection')}
                </h4>
                <p>{t('create.thisTheCollection')}</p>
                <div className="form-input">
                  <Select
                    value={formData.collection?.id ?? 'default'}
                    onChange={onCollectionChangeSelector}
                    placeholder={t('create.selectCollection')}
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
                    <MenuItem value="default">
                      {t('create.noCollection')}
                    </MenuItem>
                    {myCollections.map((collection, index) => (
                      <MenuItem key={collection.id} value={collection.id}>
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            overflow: 'hidden',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '4px',
                          }}
                        >
                          <img src={collection.logo} alt="" width="24px" />
                        </div>
                        {collection.name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="content-page__form-block">
                <h4 className="content-page__form_">{t('auction.category')}</h4>
                <p>{t('create.selectingCategoryWillHelp')}</p>
                <div className="form-input">
                  <Select
                    value={
                      formData.category
                        ? t(`categories.${formData.category.name}`)
                        : ''
                    }
                    onChange={onCategoryChangeSelector}
                    placeholder={t('create.selectCategory')}
                    required
                    disabled={formData.collection != undefined}
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
                    {categories.map((cat, index) => (
                      <MenuItem key={index} value={t(`categories.${cat.name}`)}>
                        <img src={cat.iconFlat} alt="" />{' '}
                        {t(`categories.${cat.name}`)}
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
                        handleChangeGrapeVarieties={handleChangeGrapeVarieties}
                        handleChangeManufacturer={handleChangeManufacturer}
                        handleChangeModeProduction={handleChangeModeProduction}
                        handleChangeNumberOfUnits={handleChangeNumberOfUnits}
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
                        handleChangeRealEstateArea={handleChangeRealEstateArea}
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
                    {/* {
                        <classification.component
                          {...props}
                          handleChangeColor={handleChangeColor}
                        />
                      } */}
                  </div>
                </div>
              ) : (
                <></>
              )}

              <div className="content-page__mobile__form-block">
                <h4>{t('auction.attribute')}</h4>
                <p>{t('create.addAnyItemProperties')}</p>
                <div className="form-input">
                  <div className="flex flex-row flex-wrap gap-3 items-end">
                    <label style={{ width: '100%' }}>
                      <p className="content-page__mobile__caption1">
                        {t('create.key')}
                      </p>
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
                            width: '100%',
                          },
                          // width: '350px',
                        }}
                        fullWidth
                        value={newAttributeKey}
                        onChange={(e) => setNewAttributeKey(e.target.value)}
                      ></TextField>
                    </label>
                    <label style={{ width: '100%' }}>
                      <p className="content-page__mobile__caption1">
                        {t('create.value')}
                      </p>
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
                          // width: '350px',
                        }}
                        value={newAttributeValue}
                        fullWidth
                        onChange={(e) => setNewAttributeValue(e.target.value)}
                      ></TextField>
                    </label>
                    <Button
                      variant="outlined"
                      sx={{
                        ...buttonRootStyle,
                        height: '50px',
                        border:
                          '1px solid rgba(255, 255, 255, 0.16) !important',
                        mt: '20px',
                      }}
                      onClick={handleCreateAttribute}
                      disabled={createAttrBtnDisabled}
                    >
                      {t('create.createNFT')}
                    </Button>
                  </div>
                </div>
                <div className="content-page__mobile__view-tags">
                  <div className="content-page__mobile__view-tags__tag">
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
              </div>
              <div className="content-page__form-block">
                <h4> {t('auction.description')}</h4>
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
                <Sticky top={140} bottomBoundary=".content-page__form-preview">
                  <NftCard
                    isPreview={isPreview}
                    image={
                      formData.file ? URL.createObjectURL(formData.file) : null
                    }
                    creator={t('create.myNft')}
                    name={
                      formData.name && formData.name != ''
                        ? formData.name
                        : t('create.nftName')
                    }
                    price={
                      formData.nftPrice && formData.nftPrice.toString() != ''
                        ? formData.nftPrice.toString()
                        : '0'
                    }
                    symbol={formData.symbol}
                    royality={formData.royalities}
                    onClick={undefined}
                    categoryName={formData.category?.name}
                    // usdt={usdt}
                  />
                  <i className="dummy-bg" style={{ height: '422px' }} />
                </Sticky>
              </div>
            )}
          </form>
        </div>
      </div>
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
