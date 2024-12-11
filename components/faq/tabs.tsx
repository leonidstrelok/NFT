import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTranslation } from 'next-i18next';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const tabs = [
  {
    index: 0,
    name: 'faq.privacyPolicy',
    description: [
      { id: 1, header: '', value: '' },
      { id: 2, header: '', value: '' },
      { id: 3, header: '', value: '' },
      { id: 4, header: '', value: '' },
      { id: 5, header: '', value: '' },
      { id: 6, header: '', value: '' },
      { id: 7, header: '', value: '' },
      { id: 8, header: '', value: '' },
      { id: 9, header: '', value: '' },
      { id: 10, header: '', value: '' },
      { id: 11, header: '', value: '' },
    ],
  },
  {
    index: 1,
    name: 'faq.termsAndConditions',
    description: [
      { id: 1, header: 'faq.introduction', value: 'faq.theFollowingTerms' },
      {
        id: 2,
        header: 'faq.privacyPolicyDescription',
        value: 'faq.goldorPrivacy',
      },
      { id: 3, header: 'faq.accessToTheService', value: 'faq.inOrderToList' },
      {
        id: 4,
        header: 'faq.modificationToTerms',
        value: 'faq.withinTheLimits',
      },
      {
        id: 5,
        header: 'faq.communicationPreferences',
        value: 'faq.byCreatingAnAccount',
      },
      { id: 6, header: 'faq.disclaimers', value: 'faq.except' },
      {
        id: 7,
        header: 'faq.assumptionOfRisk',
        value: 'faq.youAcceptAndKnowledge',
      },
      { id: 8, header: 'faq.limitationOfLiability', value: 'faq.toTheFullest' },
      { id: 9, header: 'faq.termination', value: 'faq.notwithstanding' },
      { id: 10, header: 'faq.severability', value: 'faq.ifAnyTerm' },
      { id: 11, header: 'faq.applicableLaw', value: 'faq.theseTerms' },
    ],
  },
];
const VerticalTabs: React.FC = () => {
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation('common');
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        sx={{ textTransform: 'none' }}
        aria-label="Vertical tabs example"
      >
        {tabs.map((p, key) => {
          return (
            <Tab
              key={key}
              label={p.name}
              {...a11yProps(p.index)}
              sx={{ textTransform: 'none',width: '100%' }}
            />
          );
        })}
      </Tabs>
      {tabs.map((p, key) => {
        return (
          <TabPanel value={value} index={p.index} key={key} >
            {p.description.map((k, ind) => {
              return <div key={ind} style={{width: '80%', display: 'flex', marginLeft: '50px' }}>{t(k.value)}</div>
            })}
          </TabPanel>
        );
      })}
    </Box>
  );
};

export default VerticalTabs;
