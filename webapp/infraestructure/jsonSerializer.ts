import Serializer from '../business/infraestructure/serializer'

export default class JsonSerializer implements Serializer {
  serialize (obj: object): string {
    return JSON.stringify(obj)
  }

  deserialize<T> (serilizedObj: string): T {
    const obj: T = JSON.parse(serilizedObj)
    return obj
  }
}
