import Link, { LinkAttributes } from './link';

export default class Resource<T> {
  private item: T
  private links: Array<Link>

  constructor(element: T, uri: string, attributes?: LinkAttributes) {
    this.item = element
    this.links = Array<Link>()
    this.addLink(new Link("self", uri, attributes))
  }

  addLink(link: Link): Resource<T> {
    this.links.push(link)
    return this
  }

  json(): any {
    
    return Object.keys(this).reduce(((object: any, key: string) => {
        if (key === "item") {
            for(var prop in this[key]) {
                object[prop] = this[key][prop]
            }
        } else if (key === "links") {
            if(this[key].length > 0) {
                object["_links"] = new Array()
                this[key].map((link: Link) => {
                    object["_links"].push(link.json())
                })
            }
        } else {
            object[key] = this[key]
        }
        return object
    }).bind(this), {})
}
}