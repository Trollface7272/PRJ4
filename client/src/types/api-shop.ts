export interface IShopItemRequirements {
    groups: string[]
    level: number
}

export interface IShopItem {
    _id: string,
    name: string,
    description: string,
    requirements: IShopItemRequirements,
    cost: number,
    stock: number
}