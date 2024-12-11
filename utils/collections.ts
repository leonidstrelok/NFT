export interface Collection {
    name: string;
    id: string;
}

export const collections: Collection[] = [
    { name: "Collection1", id: "1" },
    { name: "Collection2", id: "2" },
    { name: "Collection3", id: "3" },
];

export const getCollectionNameById = (id: string) => {
    return collections.find(collection => collection.id === id)?.name;
}