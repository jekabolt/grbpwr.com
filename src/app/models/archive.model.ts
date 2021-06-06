export class ArchiveArticle {
  constructor(
    public id: number = 1,
    public date: string = new Date().toISOString().split('T')[0],
    public title: string = '',
    public description: string = '',
    public descriptionAlternative: string = '',
    public mainImage: string = '',
    public type: string = '',
    public article: Article[]= [],
  ) { }
}

export interface Article {
      mediaLink: string;
      description: string;
      descriptionAlternative: string;
}




