import { FeatureData } from '../dataprovider';
import { Movie } from './movies';

class Library {
    
    private db: any

    constructor(data: any) {
        this.db = data;
    }
    get count():number {
        return this.db.count
    }

    private get movies(): Movie[] {
        let result:Movie[] = []
        var object = this.db.query().run()
        for( var item in object) {
            const {id, name, year, director, rating, ratingEnabled, synopsis, stock } = object[item]
            result.push(new Movie(id, name, year, director, rating, ratingEnabled, synopsis, stock));
        }
        return result
    }
    get moviesProjection(): any[] {
        return this.movies.map((movie) => ({
            name: movie.name,
            year: movie.year,
            director: movie.director,
            id: movie.id
        }))
    }

    getMovieById(id: string): Movie | null {
        var object = this.db
            .query()
            .filter({id: id})
            .run()
        if (object.length > 0) {
            const {id, name, year, director, rating, ratingEnabled, synopsis, stock } = object[0]
            return new Movie(id, name, year, director, rating, ratingEnabled, synopsis, stock)
        }
        return null
    }

    getMovieProjectionById(id: string): any | null {
        let movie = this.getMovieById(id)
        if (movie === null) return null
        return {
            name: movie.name,
            year: movie.year,
            director: movie.director,
            id: movie.id
        }
    }

    hasMovieById(id: string): boolean {
        return this.db
                .query()
                .filter({id: id})
                .run()
                .length > 0
    }

    inStock(id: string): boolean {
        let movie = this.getMovieById(id)
        if (movie === null) return false
        return movie.stock > 0
    }

    updateMovieRating(id: string, rating: number): void {
        let movie = this.getMovieById(id)
        movie.updateRating(rating)
        this.db.set(id, movie)
        this.db.sync()
    }
}
export default Library