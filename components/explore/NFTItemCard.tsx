import cn from 'classnames';
import React from 'react';
import { EtheriumIcon } from '../icons/etherium';
import styles from './NFTItemCard.module.scss';

interface INFTItemCardObj {
  jsonName: string;
  jsonImage: string;
  address: string;
  jsonDescription: string;
  jsonCategory: string;
  jsonTags: [];
  collection: string;
  jsonAttributes: [];
}

interface INFTItemCard {
  data: INFTItemCardObj;
}

const NFTItemCard: React.FC<INFTItemCard> = (props: INFTItemCard) => {
  return (
    <div className={cn(styles.wrapper)}>
      <div className={cn(styles.name)}>{props.data.jsonName}</div>

      <div className={cn(styles.userInfo)}>Sell By: {props.data.address}</div>

      <div>
        <img
          className={cn(styles.image)}
          src={props.data.jsonImage}
          alt="preview"
        />
      </div>
      <div className={cn(styles.paragraphWrapper)}>
        <div className={cn(styles.blockWrapper)}>
          <div className={cn(styles.subheader)}>Description</div>
          <div className={cn(styles.text)}>{props.data.jsonDescription}</div>
        </div>

        <div className={cn(styles.blockWrapper)}>
          <div className={cn(styles.subheader)}>Category</div>
          <div className={cn(styles.text)}>{props.data.jsonCategory}</div>
        </div>
      </div>

      <div className={cn(styles.blockWrapper)}>
        <div className={cn(styles.subheader)}>Attributes</div>
        <div className={cn(styles.text)}>
          {props.data.jsonAttributes &&
            Object.entries(props.data.jsonAttributes).map(([key, value]) => (
              <button key={key} className={cn(styles.chip)}>
                <div className={cn(styles.key)}>{key}</div>
                <div>value</div>
              </button>
            ))}
        </div>
      </div>

      <div className={cn(styles.blockWrapper)}>
        <div className={cn(styles.subheader)}>Tags</div>
        <div className={cn(styles.text)}>
          <div className={cn(styles.tagsWrapper)}>
            {props.data.jsonTags.map((tag) => (
              <button key={tag} className={cn(styles.chip)}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={cn(styles.blockWrapper)}>
        <div
          className={cn(styles.subheader)}
        >{`Collection "${props.data.collection}"`}</div>
      </div>
    </div>
  );
};

export default NFTItemCard;
