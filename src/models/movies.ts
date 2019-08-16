export class Movie {
  constructor(
      public id: string,
      public name: string,
      public year: string,
      public director: string,
      public rating: number,
      public ratingEnabled: boolean,
      public synopsis: string,
      public stock: number) { }

  updateRating(newRatings: number):void {
      this.rating = newRatings
  }
}