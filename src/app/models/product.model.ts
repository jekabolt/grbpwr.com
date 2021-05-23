export class Product {
  public imageFeaturedUrl?;

  constructor(
    public id: number = 1,
    public date: string = new Date().toISOString().split('T')[0],
    public name: string = '',
    public size: string = '',
    public description: string = '',
    public price: number = 0,
    public priceNormal: number = 0,
    public reduction: number = 0,
    public imageURLs: string[] = [],
    public imageRefs: string[] = [],
    public availableSizes: string[] = [],
    public categories: {} = {},
    public sale: boolean = false
  ) { }
}
