export type LinkAttributes = Map<string, any>

export default class Link {
  private attributes: LinkAttributes

  constructor(public rel: string, href: string, attributes?: LinkAttributes) {
    this.attributes = new Map<string, any>()
    this.attributes.set("href", href)
    if (attributes) {
      this.addAttributes(attributes)
    }
  }

  addAttributes(attributes: LinkAttributes) {
    attributes.forEach((v, k) => {
      this.addAttribute(k, v)
    })
  }

  addAttribute(key: string, value: any): Link {
    this.attributes.set(key, value)
    return this
  }

  json():any {
    let self = this
    return Object.keys(this).reduce((function (object, key) {
        if (key === "attributes") {
            self[key].forEach((value, key) => {
                object[key] = value
            })
        } else {
          object[key] = this[key];
        }
        object["rel"] = this.rel;
        return object;
      }).bind(this), {});
}
}