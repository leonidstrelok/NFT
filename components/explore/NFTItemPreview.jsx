import cn from 'classnames'
import { EtheriumIcon } from '../icons/etherium'
import styles from './NFTItemPreview.module.scss';

export default function NFTItemPreview(props) {
    const { image, collectionName, name, categotyName, price, onClick } = props;
    return <div className={cn(styles.wrapper)} onClick={onClick}>
        <div>
            <img className={cn(styles.image)} src={image} alt="preview" />
        </div>
        <div className={cn(styles.infoWrapper)}>
            <div className={cn(styles.collection)}>
                {collectionName}
            </div>
            <div className={cn(styles.name)}>
                {name}
            </div>
            <div className={cn(styles.categoryName)}>
                {categotyName}
            </div>
            <div className={cn(styles.priceWrapper)}>
                <EtheriumIcon />
                <div>{price}</div>
            </div>
        </div>
    </div>
}