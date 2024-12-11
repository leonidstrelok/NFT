import {
  Tooltip,
  IconButton,
  styled,
  TooltipProps,
  tooltipClasses,
} from '@mui/material';
import HelpOutlineSharpIcon from '@mui/icons-material/HelpOutlineSharp';

interface IStyleObject {
  width: number;
  height: number;
  title: string;
}

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: '#282B3C',
    margin: '20px',
    // color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    background: '#282B3C',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: '400',
    fontStyle: 'normal',
    lineHeight: '22px',
    maxWidth: '250px',
    maxHeight: '250px',
  },
}));

const TooltipLocal: React.FC<IStyleObject> = (props) => {
  const { height, title, width } = props;
  return (
    <>
      <BootstrapTooltip title={title} placement="top" arrow>
        <IconButton sx={{ color: '#48556A' }}>
          <HelpOutlineSharpIcon />
        </IconButton>
      </BootstrapTooltip>
    </>
  );
};

export default TooltipLocal;
