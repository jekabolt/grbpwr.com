export class Article {
  constructor(
    public id: number = 1,
    public date: string = new Date().toISOString().split('T')[0],
    public category: string  = '',
    public heading: string  = '',
    public thumbnail: string  = '',
    public description: string  = '',
    public contentDescription: ContentDescription[] = []
  ) { }
}

export interface ContentDescription {
  imageUrl: string;
  videoUrl: string;
  description: string;
}


