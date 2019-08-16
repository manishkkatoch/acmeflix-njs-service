
export default class Cart {
    
    private db: any

    constructor(data: any) {
        this.db = data;
    }

    get id():string {
        return <string>this.db.get("id")
    }

    isEmpty(): boolean {
        return (<Array<any>>this.db.get("movies")).length === 0
    }

    getCartItems(): string[] {
        return (<Array<string>>this.db.get("movies"))
    }

    addToCart(movieId: string): void {
        let movieItems = <Array<string>>this.db.get("movies")
        console.log(movieId, movieItems)
        if (movieItems.findIndex((id) => id === movieId) === -1) {
            movieItems.push(movieId)
            console.log(movieItems)
            this.db.set("movies", movieItems)
            this.db.sync()
        }
    }

    removeFromCart(movieId: string): void {
        let movieItems = <Array<string>>this.db.get("movies")
        let index = movieItems.findIndex((id) => id === movieId)
        if(index > -1) {
            movieItems.splice(index,1)
            this.db.set("movies", movieItems)
            this.db.sync()
        }
    }
}