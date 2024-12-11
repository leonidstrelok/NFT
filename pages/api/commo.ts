export function convertSnakeToCamel(obj: { [key: string]: any }): {
  [key: string]: any;
} {
  const camelObj: { [key: string]: any } = {};
  for (let key in obj) {
    let camelKey = key.replace(/(_\w)/g, (match) => match[1].toUpperCase());
    if (Array.isArray(obj[key])) {
      camelObj[camelKey] = obj[key].map(convertSnakeToCamel);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      camelObj[camelKey] = convertSnakeToCamel(obj[key]);
    } else {
      camelObj[camelKey] = obj[key];
    }
  }
  return camelObj;
}

export const isEmptyObj = (obj) => {
  return Object.keys(obj).length === 0 ? false : true;
};

export const getDataWithObjectArray = (result): any[] => {
  const array: any[] = [];
  for (let i = 0; i < Object.keys(result).length; i++) {
    array.push(result[i]);
  }
  return array;
};
